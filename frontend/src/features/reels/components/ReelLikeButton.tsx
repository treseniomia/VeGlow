import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useReelInteractionStore } from "@/services/useReelInteractionStore";

interface ReelLikeButtonProps {
  reelId: string;
}

export const ReelLikeButton: React.FC<ReelLikeButtonProps> = React.memo(
  ({ reelId }) => {
    const { reelStates, fetchLikeStatus, toggleLikeReel } =
      useReelInteractionStore();

    // Extract specific safe scoped state defaults for this reel instance
    const stateData = reelStates[reelId] || { isLiked: false, likesCount: 0 };

    useEffect(() => {
      fetchLikeStatus(reelId);
    }, [reelId]);

    return (
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => toggleLikeReel(reelId)}
          style={styles.iconButton}
        >
          <Text
            style={[
              styles.heartIcon,
              { color: stateData.isLiked ? "#FF3B30" : "#FFFFFF" },
            ]}
          >
            ♥
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconButton: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  heartIcon: {
    fontSize: 30,
    lineHeight: 30,
    textAlign: "center",
  },
  countText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});
