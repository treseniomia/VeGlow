import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { IReel } from "../types/reels.types";
import { styles } from "../styles/reels.styles";
import { ReelInteractionButtons } from "./ReelInteractionButtons";
import { useReelStore } from "../../../services/useReelStore";

interface ReelVideoPlayerProps {
  reel: IReel;
  isActive: boolean;
  onComment?: (reelId: string) => void;
  onOptions?: (reelId: string) => void;
}

export const ReelVideoPlayer: React.FC<ReelVideoPlayerProps> = ({
  reel,
  isActive,
  onComment,
  onOptions,
}) => {
  const player = useVideoPlayer(reel.videoUrl, (player) => {
    player.loop = true;
    player.play();
  });

  const reels = useReelStore((state) => state.reels);
  const currentReel = reels.find((r) => r._id === reel._id) || reel;

  useEffect(() => {
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, player]);

  return (
    <View style={playerStyles.container}>
      <VideoView style={playerStyles.video} player={player} />

      {/* Text Overlays - Lower Left Margin */}
      <View style={playerStyles.textOverlay}>
        <Text style={playerStyles.username}>@{currentReel.user.username}</Text>
        <Text style={playerStyles.title}>{currentReel.title}</Text>
        {currentReel.description && (
          <Text style={playerStyles.description}>
            {currentReel.description}
          </Text>
        )}
      </View>

      {/* Interaction Buttons - Right Aligned */}
      <ReelInteractionButtons
        reelId={currentReel._id}
        reelUserId={currentReel.user._id}
        onComment={onComment}
        onOptions={onOptions}
      />
    </View>
  );
};

const playerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  textOverlay: {
    position: "absolute",
    bottom: 80,
    left: 16,
    right: 80,
    zIndex: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#E0E0E0",
    lineHeight: 20,
  },
});
