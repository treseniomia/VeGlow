import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFetchHiddenPosts } from "../hooks/useFetchHiddenPosts";
import { useHidePost } from "../hooks/useHidePost";
import { router } from "expo-router";

export default function HiddenPostsScreen() {
  const { hiddenPosts, loading, error, refetch } = useFetchHiddenPosts();
  const { unhidePost, isHiding } = useHidePost();

  const handleUnhide = async (postId: string, postTitle: string) => {
    Alert.alert(
      "Unhide Post",
      `Are you sure you want to unhide "${postTitle}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Unhide",
          onPress: async () => {
            try {
              await unhidePost(postId);
              refetch();
            } catch (err) {
              console.error("Failed to unhide post:", err);
            }
          },
        },
      ]
    );
  };

  const renderHiddenPostItem = ({ item }: { item: any }) => {
    const hasImage = item.mediaUrls && item.mediaUrls.length > 0;
    const imageUri = hasImage ? item.mediaUrls[0] : null;

    return (
      <TouchableOpacity
        style={styles.postItem}
        onPress={() => router.push(`/recipe/${item._id}`)}
      >
        <View style={styles.postImageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.postImage} />
          ) : (
            <View style={styles.fallbackContainer}>
              <Ionicons name="leaf-outline" size={32} color="#99CC33" />
            </View>
          )}
        </View>
        <View style={styles.postContent}>
          <Text style={styles.postTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.postAuthor}>by {item.user?.name || "Unknown"}</Text>
          <TouchableOpacity
            style={styles.unhideButton}
            onPress={() => handleUnhide(item._id, item.title)}
            disabled={isHiding}
          >
            <Ionicons name="eye-outline" size={16} color="#99CC33" />
            <Text style={styles.unhideButtonText}>Unhide</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="eye-off-outline" size={64} color="#99CC33" />
        <Text style={styles.emptyTitle}>No Hidden Posts</Text>
        <Text style={styles.emptySubtitle}>
          Posts you hide will appear here
        </Text>
      </View>
    );
  };

  const renderErrorState = () => {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
        <Text style={styles.emptyTitle}>Error Loading Posts</Text>
        <Text style={styles.emptySubtitle}>
          {error || "Something went wrong"}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading && hiddenPosts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hidden Posts</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#99CC33" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hidden Posts</Text>
        <Text style={styles.headerCount}>{hiddenPosts.length}</Text>
      </View>

      {error && hiddenPosts.length === 0 ? (
        renderErrorState()
      ) : hiddenPosts.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={hiddenPosts}
          renderItem={renderHiddenPostItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={refetch}
        />
      )}
    </SafeAreaView>
  );
}

import { Image } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1204",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  headerCount: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 20,
    fontWeight: "300",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  postItem: {
    flexDirection: "row",
    backgroundColor: "#1E2F03",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  postImageContainer: {
    width: 80,
    height: 80,
  },
  postImage: {
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
  postContent: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  postTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  postAuthor: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    marginBottom: 8,
  },
  unhideButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(153, 204, 51, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  unhideButtonText: {
    color: "#99CC33",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
  },
  emptySubtitle: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: "#99CC33",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 20,
  },
  retryButtonText: {
    color: "#1A2902",
    fontSize: 14,
    fontWeight: "bold",
  },
});
