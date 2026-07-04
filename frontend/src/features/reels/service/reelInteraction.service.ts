import api from "@/api/api";

export interface LikeResponse {
  success: boolean;
  isLiked: boolean;
  likesCount: number;
}

export interface LikeStatusResponse {
  isLiked: boolean;
  likesCount: number;
}

export const reelInteractionService = {
  /**
   * Send a POST request to atomically like a reel
   */
  likeReel: async (reelId: string): Promise<LikeResponse> => {
    const response = await api.post<LikeResponse>(
      `/reels-interactions/${reelId}/like`
    );
    return response.data;
  },

  /**
   * Send a DELETE request to atomically unlike a reel
   */
  unlikeReel: async (reelId: string): Promise<LikeResponse> => {
    const response = await api.delete<LikeResponse>(
      `/reels-interactions/${reelId}/like`
    );
    return response.data;
  },

  /**
   * Fetch the current logged-in user's interaction status for a specific reel
   */
  checkLikeStatus: async (reelId: string): Promise<LikeStatusResponse> => {
    const response = await api.get<LikeStatusResponse>(
      `/reels-interactions/${reelId}/like/status`
    );
    return response.data;
  },
};
