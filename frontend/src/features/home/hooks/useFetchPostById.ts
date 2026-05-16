import { useEffect } from "react";
import { usePostStore } from "@/services/usePostStore";

export const useFetchPostById = (postId: string) => {
  const { currentPost, loading, error, fetchPostById } = usePostStore();

  useEffect(() => {
    if (postId) {
      fetchPostById(postId);
    }
  }, [postId]);

  return {
    post: currentPost,
    loading,
    error,
    refetch: () => fetchPostById(postId),
  };
};
