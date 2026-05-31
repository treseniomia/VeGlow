import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSavePost } from "../hooks/useSavePost";
import { useSavedPostsStore } from "../../../store/useSavedPostsStore";

const { width } = Dimensions.get("window");
const CARD_SIZE = width / 3;

interface SavedPostGridCardProps {
  post: any;
}

export const SavedPostGridCard: React.FC<SavedPostGridCardProps> = ({
  post,
}) => {
  const { toggleSavePost, isSaving } = useSavePost();
  const { removePostFromSaved, setSavedPosts } = useSavedPostsStore();

  const handlePress = () => {
    router.push(`/recipe/${post._id}`);
  };

  const handleLongPress = () => {
    Alert.alert(
      "Unsave Recipe",
      "Are you sure you want to unsave this recipe?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          style: "destructive",
          onPress: async () => {
            const previousSavedPosts = useSavedPostsStore.getState().savedPosts;

            removePostFromSaved(post._id);

            try {
              await toggleSavePost(post._id);
            } catch (error) {
              console.error(
                "❌ UNSAVE_ERROR: Rolling back optimistic update.",
                error,
              );
              setSavedPosts(previousSavedPosts);
            }
          },
        },
      ],
    );
  };

  const hasImage = post.mediaUrls && post.mediaUrls.length > 0;
  const imageUri = hasImage ? post.mediaUrls[0] : null;

  return (
    <Pressable
      style={styles.card}
      onPress={handlePress}
      onLongPress={handleLongPress}
      disabled={isSaving}
    >
      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.fallbackContainer}>
            <Ionicons name="leaf-outline" size={32} color="#99CC33" />
          </View>
        )}
        <View style={styles.overlay}>
          <Ionicons name="bookmark" size={16} color="#99CC33" />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_SIZE,
    aspectRatio: 1,
    backgroundColor: "#1E2F03",
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
    backgroundColor: "#162202",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  fallbackContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#162202",
  },
  overlay: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    padding: 6,
  },
});
