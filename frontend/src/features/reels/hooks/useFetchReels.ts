import { useState, useEffect } from "react";
import { IReel } from "../types/reels.types";
import { reelApiService } from "../service/reelApi.service";

export const useFetchReels = () => {
  const [reels, setReels] = useState<IReel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReels = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reelApiService.getAllReels();
      setReels(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch reels");
      console.error("❌ Fetch Reels Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  return {
    reels,
    loading,
    error,
    refetch: fetchReels,
  };
};
