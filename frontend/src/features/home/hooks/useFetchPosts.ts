import { useEffect } from "react";
import { usePostStore } from "@/services/usePostStore";

export const useFetchPosts = () => {
  const { posts, loading, error, fetchAllPosts } = usePostStore();

  useEffect(() => {
    fetchAllPosts();
  }, []);

  return { posts, loading, error, refresh: fetchAllPosts };
};
