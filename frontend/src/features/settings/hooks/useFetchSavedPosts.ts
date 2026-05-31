import { useEffect, useCallback } from "react";
import { useSavedPostsStore, SavedPost } from "../../../store/useSavedPostsStore";

export interface UseFetchSavedPostsReturn {
  savedPosts: SavedPost[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useFetchSavedPosts = (): UseFetchSavedPostsReturn => {
  const { savedPosts, loading, error, fetchSavedPosts } = useSavedPostsStore();

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  const refetch = useCallback(async () => {
    await fetchSavedPosts();
  }, [fetchSavedPosts]);

  return {
    savedPosts,
    loading,
    error,
    refetch,
  };
};
