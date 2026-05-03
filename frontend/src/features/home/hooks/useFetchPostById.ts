import { useState, useEffect } from "react";
import { homeService } from "../services/homeService";

export const useFetchPostById = (postId: string) => {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const data = await homeService.getPostById(postId);
      setPost(data);
    } catch (err) {
      setError("Failed to load recipe details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) fetchPost();
  }, [postId]);

  return { post, loading, error, refetch: fetchPost };
};
