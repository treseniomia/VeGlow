import { useState, useEffect } from "react";
import { homeService } from "../services/homeService";

export interface IPostFeed {
  _id: string;
  title: string;
  mediaUrl: string;
  user: {
    username: string;
    profilePicture?: string;
  };
  nutritionList: { label: string; value: string }[];
  benefitsList: { label: string; value: string }[];
}

export const useFetchPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await homeService.getAllPosts();
      setPosts(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, loading, error, refresh: fetchPosts };
};
