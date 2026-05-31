import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFetchSavedPosts } from "../hooks/useFetchSavedPosts";
import { SavedPostGridCard } from "../components/SavedPostGridCard";

export default function SavedPostsScreen() {
  const { savedPosts, loading, error, refetch } = useFetchSavedPosts();

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="bookmark-outline" size={64} color="#99CC33" />
        <Text style={styles.emptyTitle}>No Saved Recipes Yet</Text>
        <Text style={styles.emptySubtitle}>
          Start saving your favorite recipes to see them here
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

  if (loading && savedPosts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Saved Recipes</Text>
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
        <Text style={styles.headerTitle}>Saved Recipes</Text>
        <Text style={styles.headerCount}>{savedPosts.length}</Text>
      </View>

      {error && savedPosts.length === 0 ? (
        renderErrorState()
      ) : savedPosts.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={savedPosts}
          renderItem={({ item }) => <SavedPostGridCard post={item} />}
          keyExtractor={(item) => item._id}
          numColumns={3}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={refetch}
        />
      )}
    </SafeAreaView>
  );
}

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
  row: {
    justifyContent: "flex-start",
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
