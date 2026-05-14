import { useState, useEffect } from "react";
import { postService } from "../services/postService";

export const useUserPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const data = await postService.getMyPosts();
      setPosts(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  return { posts, loading, error, refresh: fetchMyPosts };
};
