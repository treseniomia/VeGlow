import { create } from "zustand";
import { reelInteractionService } from "@/features/reels/service/reelInteraction.service";
import { Alert } from "react-native";

export interface ReelData {
  _id: string;
  videoUrl: string;
  title: string;
  description: string;
  likes: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  user: {
    _id: string;
    username: string;
    avatarUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ReelStoreState {
  reels: ReelData[];
  setReels: (reels: ReelData[]) => void;
  toggleLikeOptimistic: (
    reelId: string,
    currentUserId: string,
  ) => Promise<void>;
}

export const useReelStore = create<ReelStoreState>((set, get) => ({
  reels: [],

  setReels: (reels) => {
    const reelsWithVerifiedLikeStatus = reels.map((reel) => ({
      ...reel,

      isLiked: reel.isLiked ?? false,
    }));
    set({ reels: reelsWithVerifiedLikeStatus });
  },

  toggleLikeOptimistic: async (reelId, currentUserId) => {
    const state = get();
    const reelIndex = state.reels.findIndex((reel) => reel._id === reelId);

    if (reelIndex === -1) {
      console.error(`[STORE ERROR] Reel with ID ${reelId} not found in store`);
      return;
    }

    const currentReel = state.reels[reelIndex];
    const previousReelState = { ...currentReel };

    const alreadyLiked = currentReel.likes.includes(currentUserId);
    const nextIsLiked = !alreadyLiked;
    const updatedLikes = alreadyLiked
      ? currentReel.likes.filter((id) => id !== currentUserId)
      : [...currentReel.likes, currentUserId];

    set((state) => ({
      reels: state.reels.map((reel) => {
        if (reel._id !== reelId) return reel;

        return {
          ...reel,
          likes: updatedLikes,
          likesCount: updatedLikes.length,
          isLiked: nextIsLiked,
        };
      }),
    }));

    try {
      // Execute actual background API mutation network payload
      let apiResponse;
      if (nextIsLiked) {
        apiResponse = await reelInteractionService.likeReel(reelId);
      } else {
        apiResponse = await reelInteractionService.unlikeReel(reelId);
      }

      // Update state with API response to ensure consistency
      // Recalculate likes from array to match database logic exactly
      set((state) => ({
        reels: state.reels.map((reel) => {
          if (reel._id !== reelId) return reel;

          return {
            ...reel,
            likes: updatedLikes,
            likesCount: updatedLikes.length, // Use array length to match database logic
            isLiked: apiResponse.isLiked,
          };
        }),
      }));
    } catch (error) {
      console.error(
        `[STORE ERROR] Mutation failed for reel ${reelId}. Rolling back state.`,
        error,
      );

      // --- ROLLBACK: Revert to previous state if API fails ---
      set((state) => ({
        reels: state.reels.map((reel) => {
          if (reel._id !== reelId) return reel;

          return previousReelState;
        }),
      }));

      // --- USER ALERT: Notify user of the failure without breaking layout ---
      Alert.alert(
        "Connection Error",
        "Failed to update like status. Please check your internet connection and try again.",
        [{ text: "OK" }],
      );
    }
  },
}));
