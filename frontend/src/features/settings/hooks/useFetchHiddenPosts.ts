import { useEffect, useState } from "react";
import { settingsService, HiddenPostsResponse } from "../services/settingsService";

export const useFetchHiddenPosts = () => {
  const [hiddenPosts, setHiddenPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHiddenPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: HiddenPostsResponse = await settingsService.getHiddenPosts();
      setHiddenPosts(response.hiddenPosts);
    } catch (err: any) {
      setError(err.message || "Failed to fetch hidden posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHiddenPosts();
  }, []);

  return {
    hiddenPosts,
    loading,
    error,
    refetch: fetchHiddenPosts,
  };
};
