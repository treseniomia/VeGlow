import React, { useCallback, useState } from "react";
import { settingsService } from "../services/settingsService";
import { usePostStore } from "../../../services/usePostStore";
import { useSavedPostsStore } from "../../../store/useSavedPostsStore";

export interface UseHidePostReturn {
  hidePost: (postId: string) => Promise<void>;
  unhidePost: (postId: string) => Promise<void>;
  isHiding: boolean;
  error: string | null;
}

export const useHidePost = (): UseHidePostReturn => {
  const { posts, currentPost } = usePostStore();
  const { removePostFromSaved } = useSavedPostsStore();
  const [isHiding, setIsHiding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hidePost = useCallback(
    async (postId: string) => {
      setIsHiding(true);
      setError(null);

      const previousPosts = posts;
      const previousCurrentPost = currentPost;

      const optimisticPosts = previousPosts.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            isHidden: true,
            isSaved: false,
          };
        }
        return post;
      });

      let optimisticCurrentPost = previousCurrentPost;
      if (previousCurrentPost && previousCurrentPost._id === postId) {
        optimisticCurrentPost = {
          ...previousCurrentPost,
          isHidden: true,
          isSaved: false,
        };
      }

      usePostStore.setState({
        posts: optimisticPosts,
        currentPost: optimisticCurrentPost,
      });

      removePostFromSaved(postId);

      try {
        await settingsService.hidePost(postId);
      } catch (err: any) {
        setError(err.message || "Failed to hide post");
        usePostStore.setState({
          posts: previousPosts,
          currentPost: previousCurrentPost,
        });
      } finally {
        setIsHiding(false);
      }
    },
    [posts, currentPost, removePostFromSaved],
  );

  const unhidePost = useCallback(
    async (postId: string) => {
      setIsHiding(true);
      setError(null);

      const previousPosts = posts;
      const previousCurrentPost = currentPost;

      const optimisticPosts = previousPosts.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            isHidden: false,
          };
        }
        return post;
      });

      let optimisticCurrentPost = previousCurrentPost;
      if (previousCurrentPost && previousCurrentPost._id === postId) {
        optimisticCurrentPost = {
          ...previousCurrentPost,
          isHidden: false,
        };
      }

      usePostStore.setState({
        posts: optimisticPosts,
        currentPost: optimisticCurrentPost,
      });

      try {
        await settingsService.unhidePost(postId);
      } catch (err: any) {
        setError(err.message || "Failed to unhide post");
        usePostStore.setState({
          posts: previousPosts,
          currentPost: previousCurrentPost,
        });
      } finally {
        setIsHiding(false);
      }
    },
    [posts, currentPost],
  );

  return {
    hidePost,
    unhidePost,
    isHiding,
    error,
  };
};
