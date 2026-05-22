import React from "react";
import { useLocalSearchParams, router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { CommentSection } from "@/features/comments/components/CommentSection";
import { useAuthStore } from "@/store/useAuthStore";
import { styles } from "@/features/comments/styles/commentStyles";

export default function PostCommentScreen() {
  const { id, authorId } = useLocalSearchParams<{
    id: string;
    authorId?: string;
  }>();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);

  const currentUserId = user?._id || "";
  const postAuthorId = authorId || "";

  return (
    <View
      style={[
        styles.screenContainer,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerLeft}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#ffffff" />
          <Text style={styles.headerTitle}>Comments</Text>
        </TouchableOpacity>
        <View style={styles.headerPlaceholder} />
      </View>

      <CommentSection
        postId={id}
        currentUserId={currentUserId}
        postAuthorId={postAuthorId}
      />
    </View>
  );
}
