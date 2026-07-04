import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";
import { useReelStore } from "@/services/useReelStore";

interface ReelInteractionButtonsProps {
  reelId: string;
  reelUserId: string;
  onComment?: (reelId: string) => void;
  onOptions?: (reelId: string) => void;
}

export const ReelInteractionButtons: React.FC<ReelInteractionButtonsProps> = ({
  reelId,
  reelUserId,
  onComment,
  onOptions,
}) => {
  const [showOptionsModal, setShowOptionsModal] = React.useState(false);
  const { user } = useAuthStore();

  // Read reactive states directly from centralized useReelStore array using reel's _id
  const toggleLike = useReelStore((state) => state.toggleLikeOptimistic);
  const reels = useReelStore((state) => state.reels);

  const currentReel = reels.find((r: { _id: string }) => r._id === reelId);

  // Use centralized store data - check both isLiked flag and likes array for maximum persistence
  const isLikedFromFlag = currentReel?.isLiked ?? false;
  const isLikedFromArray = user?._id
    ? (currentReel?.likes?.includes(user._id) ?? false)
    : false;
  const isLiked = isLikedFromFlag || isLikedFromArray;

  // Use likesCount from store, but fall back to array length for maximum accuracy
  const likesCount = currentReel?.likesCount ?? currentReel?.likes?.length ?? 0;
  const commentsCount = currentReel?.commentsCount ?? 0;

  const isCreator = user?._id === reelUserId;

  const handleLike = async () => {
    if (!user?._id) {
      Alert.alert(
        "Authentication Required",
        "Please log in to like this reel.",
      );
      return;
    }
    // Bind optimistic toggle function seamlessly to TouchableOpacity action with zero lag
    await toggleLike(reelId, user._id);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this reel on Vegify: ${reelId}`,
      });
    } catch (error) {
      console.error("Error sharing reel:", error);
    }
  };

  const handleComment = () => {
    if (onComment) {
      onComment(reelId);
    }
  };

  const handleOptions = () => {
    if (isCreator) {
      setShowOptionsModal(true);
    } else if (onOptions) {
      onOptions(reelId);
    }
  };

  const handleEdit = () => {
    setShowOptionsModal(false);
    router.push(`/reel/edit/${reelId}`);
  };

  const handleDelete = () => {
    setShowOptionsModal(false);
    Alert.alert(
      "Delete Reel",
      "Are you sure you want to delete this reel? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            router.push("/manage-reels");
          },
        },
      ],
    );
  };

  return (
    <>
      <View style={buttonStyles.container}>
        {/* Like Button - Leaf Icon */}
        <TouchableOpacity
          style={buttonStyles.button}
          onPress={handleLike}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isLiked ? "leaf" : "leaf-outline"}
            size={32}
            color={isLiked ? "#4CAF50" : "#FFF"}
            style={{ transform: [{ rotate: "90deg" }] }}
          />
          <Text style={buttonStyles.label}>{likesCount}</Text>
        </TouchableOpacity>

        {/* Comment Button */}
        <TouchableOpacity
          style={buttonStyles.button}
          onPress={handleComment}
          activeOpacity={0.7}
        >
          <Ionicons name="chatbubble-outline" size={32} color="#FFF" />
          <Text style={buttonStyles.label}>{commentsCount}</Text>
        </TouchableOpacity>

        {/* Share Button */}
        <TouchableOpacity
          style={buttonStyles.button}
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <Ionicons name="share-social-outline" size={32} color="#FFF" />
          <Text style={buttonStyles.label}>Share</Text>
        </TouchableOpacity>

        {/* Options Menu Button - Only visible to creator */}
        {isCreator && (
          <TouchableOpacity
            style={buttonStyles.button}
            onPress={handleOptions}
            activeOpacity={0.7}
          >
            <Ionicons name="ellipsis-vertical" size={32} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Options Modal for Creator */}
      <Modal
        visible={showOptionsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <TouchableOpacity
          style={buttonStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowOptionsModal(false)}
        >
          <View style={buttonStyles.optionsModal}>
            <TouchableOpacity
              style={buttonStyles.optionItem}
              onPress={handleEdit}
            >
              <Ionicons name="create-outline" size={24} color="#FFF" />
              <Text style={buttonStyles.optionText}>Edit Reel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[buttonStyles.optionItem, buttonStyles.deleteOption]}
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={24} color="#FF3040" />
              <Text style={[buttonStyles.optionText, buttonStyles.deleteText]}>
                Delete Reel
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const buttonStyles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 16,
    bottom: 80,
    alignItems: "center",
    gap: 20,
    zIndex: 10,
  },
  button: {
    alignItems: "center",
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFF",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  optionsModal: {
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  optionText: {
    fontSize: 16,
    color: "#FFF",
    marginLeft: 12,
  },
  deleteOption: {
    borderBottomWidth: 0,
  },
  deleteText: {
    color: "#FF3040",
  },
});
