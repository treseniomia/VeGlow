import { useReelStore } from "@/services/useReelStore";
import { useAuthStore } from "@/store/useAuthStore";

export const useReelInteractions = (reelId: string) => {
  const { user } = useAuthStore();
  const toggleLikeOptimistic = useReelStore(
    (state) => state.toggleLikeOptimistic,
  );
  const reels = useReelStore((state) => state.reels);

  const currentReel = reels.find((r: { _id: string }) => r._id === reelId);

  const isLiked = currentReel?.isLiked ?? false;
  const likesCount = currentReel?.likesCount ?? 0;

  const handleLike = async () => {
    if (!user?._id) {
      return;
    }

    await toggleLikeOptimistic(reelId, user._id);
  };

  return {
    isLiked,
    likesCount,
    handleLike,
  };
};
