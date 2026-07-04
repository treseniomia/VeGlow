import { useState } from "react";
import { Alert } from "react-native";
import { reelApiService } from "../service/reelApi.service";

export const useDeleteReel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteReel = async (reelId: string, onSuccess?: () => void) => {
    setLoading(true);
    setError(null);

    try {
      await reelApiService.deleteReel(reelId);
      Alert.alert("Success", "Reel deleted successfully!");
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to delete reel";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    deleteReel,
  };
};
