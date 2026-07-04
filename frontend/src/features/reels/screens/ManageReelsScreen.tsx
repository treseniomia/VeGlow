import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFetchReels } from "../hooks/useFetchReels";
import { useDeleteReel } from "../hooks/useDeleteReel";
import { useAuthStore } from "../../../store/useAuthStore";
import { IReel } from "../types/reels.types";
import { router } from "expo-router";

export const ManageReelsScreen: React.FC = () => {
  const { reels, loading, error, refetch } = useFetchReels();
  const { deleteReel } = useDeleteReel();
  const { user } = useAuthStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const userReels = reels.filter((reel) => reel.user._id === user?._id);

  const handleDelete = useCallback(
    (reelId: string) => {
      Alert.alert(
        "Delete Reel",
        "Are you sure you want to delete this reel? This action cannot be undone.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              setDeletingId(reelId);
              await deleteReel(reelId, () => {
                refetch();
                setDeletingId(null);
              });
            },
          },
        ],
      );
    },
    [deleteReel, refetch],
  );

  const handleEdit = useCallback((reelId: string) => {
    router.push(`/reel/edit/${reelId}`);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: IReel }) => (
      <View style={manageStyles.reelItem}>
        <View style={manageStyles.reelInfo}>
          <Text style={manageStyles.reelTitle}>{item.title}</Text>
          <Text style={manageStyles.reelDescription} numberOfLines={2}>
            {item.description || "No description"}
          </Text>
          <Text style={manageStyles.reelDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={manageStyles.actionButtons}>
          <TouchableOpacity
            style={[manageStyles.actionButton, manageStyles.editButton]}
            onPress={() => handleEdit(item._id)}
          >
            <Ionicons name="create-outline" size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[manageStyles.actionButton, manageStyles.deleteButton]}
            onPress={() => handleDelete(item._id)}
            disabled={deletingId === item._id}
          >
            {deletingId === item._id ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Ionicons name="trash-outline" size={20} color="#FFF" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    ),
    [handleDelete, handleEdit, deletingId],
  );

  if (loading) {
    return (
      <View style={manageStyles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={manageStyles.centerContainer}>
        <Text style={manageStyles.errorText}>{error}</Text>
      </View>
    );
  }

  if (userReels.length === 0) {
    return (
      <View style={manageStyles.centerContainer}>
        <Ionicons name="videocam-outline" size={64} color="#666" />
        <Text style={manageStyles.emptyText}>No reels yet</Text>
        <Text style={manageStyles.emptySubtext}>
          Create your first reel to get started!
        </Text>
      </View>
    );
  }

  return (
    <View style={manageStyles.container}>
      <View style={manageStyles.header}>
        <Text style={manageStyles.headerTitle}>My Reels</Text>
        <Text style={manageStyles.headerSubtitle}>
          {userReels.length} reels
        </Text>
      </View>
      <FlatList
        data={userReels}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={manageStyles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const manageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#999",
  },
  listContent: {
    padding: 16,
  },
  reelItem: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reelInfo: {
    flex: 1,
    marginRight: 12,
  },
  reelTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
  },
  reelDescription: {
    fontSize: 14,
    color: "#999",
    marginBottom: 8,
  },
  reelDate: {
    fontSize: 12,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    backgroundColor: "#FF3040",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    padding: 20,
  },
  errorText: {
    color: "#FF3040",
    fontSize: 16,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFF",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },
});
