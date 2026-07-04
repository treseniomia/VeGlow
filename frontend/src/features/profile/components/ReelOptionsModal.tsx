import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { profileService } from "../services/profileService";

interface ReelOptionsModalProps {
  ref: React.RefObject<any>;
  reelId: string | null;
  onClose: () => void;
  onRefresh: () => void;
}

export const ReelOptionsModal: React.FC<ReelOptionsModalProps> = ({
  ref,
  reelId,
  onClose,
  onRefresh,
}) => {
  const router = useRouter();

  const handleEdit = () => {
    ref.current?.close();
    if (reelId) {
      router.push(`/reel/edit/${reelId}`);
    }
  };

  const handleDelete = () => {
    ref.current?.close();

    Alert.alert(
      "Delete Reel",
      "Are you sure you want to delete this reel? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              if (reelId) {
                await profileService.deleteReel(reelId);
                onRefresh();
                console.log("✅ Reel deleted successfully!");
              }
            } catch (error) {
              console.error("❌ Delete Reel Error:", error);
              Alert.alert("Error", "Failed to delete reel");
            }
          },
        },
      ],
    );
  };

  const handleCancel = () => {
    ref.current?.close();
    onClose();
  };

  return (
    <RBSheet
      ref={ref}
      draggable={true}
      closeOnPressMask={true}
      height={200}
      customStyles={{
        wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
        draggableIcon: { backgroundColor: "#555" },
        container: {
          backgroundColor: "#1A260F",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
      }}
      onClose={onClose}
    >
      <View style={styles.container}>
        {/* OPTION 1: EDIT */}
        <TouchableOpacity style={styles.option} onPress={handleEdit}>
          <Ionicons name="pencil-outline" size={24} color="#4CAF50" />
          <Text style={styles.optionText}>Edit Reel</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* OPTION 2: DELETE */}
        <TouchableOpacity style={styles.option} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={24} color="#FF4444" />
          <Text style={[styles.optionText, styles.deleteText]}>
            Delete Reel
          </Text>
        </TouchableOpacity>
      </View>
    </RBSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  optionText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },
  deleteText: {
    color: "#FF4444",
  },
  cancelText: {
    color: "#888",
  },
  divider: {
    height: 1,
    backgroundColor: "#2C3E1D",
    marginVertical: 8,
  },
});
