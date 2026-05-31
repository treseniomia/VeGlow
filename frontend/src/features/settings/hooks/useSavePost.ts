import React, { useCallback, useState } from "react";
import { useSavedPostsStore } from "../../../store/useSavedPostsStore";
import { usePostStore } from "../../../services/usePostStore";

export interface UseSavePostReturn {
  toggleSavePost: (postId: string) => Promise<void>;
  isSaving: boolean;
  error: string | null;
}

export const useSavePost = (): UseSavePostReturn => {
  const { toggleSaveOptimistic } = useSavedPostsStore();
  const { posts, currentPost } = usePostStore();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSavePost = useCallback(
    async (postId: string) => {
      setIsSaving(true);
      setError(null);

      const previousPosts = posts;
      const previousCurrentPost = currentPost;

      const targetPost = previousPosts.find((post) => post._id === postId);
      const isCurrentlySaved = targetPost?.isSaved || false;

      const optimisticPosts = previousPosts.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            isSaved: !isCurrentlySaved,
          };
        }
        return post;
      });

      let optimisticCurrentPost = previousCurrentPost;
      if (previousCurrentPost && previousCurrentPost._id === postId) {
        optimisticCurrentPost = {
          ...previousCurrentPost,
          isSaved: !isCurrentlySaved,
        };
      }

      usePostStore.setState({
        posts: optimisticPosts,
        currentPost: optimisticCurrentPost,
      });

      try {
        await toggleSaveOptimistic(postId);
      } catch (err: any) {
        setError(err.message || "Failed to toggle save status");
        usePostStore.setState({
          posts: previousPosts,
          currentPost: previousCurrentPost,
        });
      } finally {
        setIsSaving(false);
      }
    },
    [posts, currentPost, toggleSaveOptimistic],
  );

  return {
    toggleSavePost,
    isSaving,
    error,
  };
};
