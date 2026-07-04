import { create } from "zustand";
import { reelInteractionService } from "@/features/reels/service/reelInteraction.service";

interface ReelInteractionState {
  // Store interaction status map where key is reelId -> { isLiked, likesCount }
  reelStates: Record<string, { isLiked: boolean; likesCount: number }>;
  loadingReels: Record<string, boolean>;

  // Actions
  fetchLikeStatus: (reelId: string) => Promise<void>;
  toggleLikeReel: (reelId: string) => Promise<void>;
}

export const useReelInteractionStore = create<ReelInteractionState>(
  (set, get) => ({
    reelStates: {},
    loadingReels: {},

    fetchLikeStatus: async (reelId) => {
      try {
        const data = await reelInteractionService.checkLikeStatus(reelId);
        set((state) => ({
          reelStates: {
            ...state.reelStates,
            [reelId]: { isLiked: data.isLiked, likesCount: data.likesCount },
          },
        }));
      } catch (error) {
        console.error(
          `[STORE ERROR] Failed fetching status for reel ${reelId}:`,
          error
        );
      }
    },

    toggleLikeReel: async (reelId) => {
      const currentReelState = get().reelStates[reelId] || {
        isLiked: false,
        likesCount: 0,
      };
      const previousState = { ...currentReelState };

      // --- OPTIMISTIC UPDATE: Change UI instantly for maximum responsiveness ---
      const nextIsLiked = !currentReelState.isLiked;
      const nextLikesCount = nextIsLiked
        ? currentReelState.likesCount + 1
        : Math.max(0, currentReelState.likesCount - 1);

      set((state) => ({
        reelStates: {
          ...state.reelStates,
          [reelId]: { isLiked: nextIsLiked, likesCount: nextLikesCount },
        },
      }));

      try {
        // Execute actual background API mutation network payload
        if (nextIsLiked) {
          await reelInteractionService.likeReel(reelId);
        } else {
          await reelInteractionService.unlikeReel(reelId);
        }
      } catch (error) {
        console.error(
          `[STORE ERROR] Mutation failed for reel ${reelId}. Rolling back state.`,
          error
        );

        // --- ROLLBACK INTERACTION STATE IF API FAILS ---
        set((state) => ({
          reelStates: {
            ...state.reelStates,
            [reelId]: previousState,
          },
        }));
      }
    },
  })
);
