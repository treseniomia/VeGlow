import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { useUpdateReel } from "../hooks/useUpdateReel";
import { reelApiService } from "../service/reelApi.service";
import { IReel, ReelFormData } from "../types/reels.types";

export const EditReelScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { loading, updateReel } = useUpdateReel();
  const [reel, setReel] = useState<IReel | null>(null);
  const [loadingReel, setLoadingReel] = useState(true);
  const [form, setForm] = useState<ReelFormData>({
    videoUrl: "",
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchReel();
  }, [id]);

  const fetchReel = async () => {
    try {
      setLoadingReel(true);
      const data = await reelApiService.getMyReels();
      const foundReel = data.find((r) => r._id === id);
      if (foundReel) {
        setReel(foundReel);
        setForm({
          videoUrl: foundReel.videoUrl,
          title: foundReel.title,
          description: foundReel.description,
        });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load reel");
      console.error("Fetch reel error:", error);
    } finally {
      setLoadingReel(false);
    }
  };

  const handleUpdate = async () => {
    if (!form.title) {
      Alert.alert("Validation Error", "Title is required");
      return;
    }

    await updateReel(
      id,
      { title: form.title, description: form.description },
      () => {
        router.back();
      },
    );
  };

  if (loadingReel) {
    return (
      <View style={editStyles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!reel) {
    return (
      <View style={editStyles.centerContainer}>
        <Text style={editStyles.errorText}>Reel not found</Text>
      </View>
    );
  }

  return (
    <View style={editStyles.container}>
      <View style={editStyles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={editStyles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={editStyles.headerTitle}>Edit Reel</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={editStyles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Video Preview */}
        <View style={editStyles.videoPreview}>
          <Ionicons name="videocam" size={48} color="#4CAF50" />
          <Text style={editStyles.videoPreviewText}>
            Video cannot be changed
          </Text>
        </View>

        {/* Title Input */}
        <View style={editStyles.inputContainer}>
          <Text style={editStyles.inputLabel}>Recipe Title *</Text>
          <TextInput
            style={editStyles.input}
            placeholder="Enter recipe title"
            placeholderTextColor="#666"
            value={form.title}
            onChangeText={(value) => setForm({ ...form, title: value })}
          />
        </View>

        {/* Description Input */}
        <View style={editStyles.inputContainer}>
          <Text style={editStyles.inputLabel}>Description</Text>
          <TextInput
            style={[editStyles.input, editStyles.textArea]}
            placeholder="Add a description (optional)"
            placeholderTextColor="#666"
            value={form.description}
            onChangeText={(value) => setForm({ ...form, description: value })}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Metadata */}
        <View style={editStyles.metadataContainer}>
          <Text style={editStyles.metadataLabel}>Created:</Text>
          <Text style={editStyles.metadataValue}>
            {new Date(reel.createdAt).toLocaleDateString()}
          </Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[
            editStyles.saveButton,
            loading && editStyles.saveButtonDisabled,
          ]}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={editStyles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const editStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  backButton: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  videoPreview: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#333",
    borderStyle: "dashed",
  },
  videoPreviewText: {
    color: "#999",
    fontSize: 14,
    marginTop: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    color: "#FFF",
  },
  textArea: {
    height: 120,
  },
  metadataContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
  },
  metadataLabel: {
    fontSize: 14,
    color: "#999",
  },
  metadataValue: {
    fontSize: 14,
    color: "#FFF",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonDisabled: {
    backgroundColor: "#666",
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  errorText: {
    color: "#FF3040",
    fontSize: 16,
  },
});
