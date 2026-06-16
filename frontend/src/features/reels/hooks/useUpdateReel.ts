import { useState } from "react";
import { Alert } from "react-native";
import { reelApiService } from "../service/reelApi.service";
import { ReelFormData } from "../types/reels.types";

export const useUpdateReel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateReel = async (
    reelId: string,
    formData: Partial<ReelFormData>,
    onSuccess?: () => void
  ) => {
    setLoading(true);
    setError(null);

    try {
      await reelApiService.updateReel(reelId, formData);
      Alert.alert("Success", "Reel updated successfully!");
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to update reel";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    updateReel,
  };
};
