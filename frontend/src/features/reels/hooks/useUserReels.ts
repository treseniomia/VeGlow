import { useState, useEffect } from "react";
import { IReel } from "../types/reels.types";
import { reelApiService } from "../service/reelApi.service";

export const useUserReels = () => {
  const [reels, setReels] = useState<IReel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserReels = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reelApiService.getMyReels();
      setReels(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch reels");
      console.error("❌ Fetch User Reels Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserReels();
  }, []);

  return {
    reels,
    loading,
    error,
    refresh: fetchUserReels,
  };
};
