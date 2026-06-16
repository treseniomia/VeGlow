import { useState } from "react";
import { Alert } from "react-native";
import { ReelFormData, ReelMediaItem } from "../types/reels.types";
import { reelApiService } from "../service/reelApi.service";
import { uploadToCloudinary } from "../../../services/cloudinary.service";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";

export const useCreateReel = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<ReelFormData>({
    videoUrl: "",
    title: "",
    description: "",
  });
  const [media, setMedia] = useState<ReelMediaItem | null>(null);

  const updateField = (field: keyof ReelFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const pickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Access to gallery is required.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      allowsEditing: false,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];

      const newMedia: ReelMediaItem = {
        uri: asset.uri,
        type: "video",
        duration: asset.duration || 0,
      };
      setMedia(newMedia);
    }
  };

  const recordVideo = async () => {
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    const micStatus = await Camera.requestMicrophonePermissionsAsync();

    if (cameraStatus.status !== "granted" || micStatus.status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Kailangan ng camera at microphone access.",
      );
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["videos"],
      allowsEditing: false,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];

      const newMedia: ReelMediaItem = {
        uri: asset.uri,
        type: "video",
        duration: asset.duration || 0,
      };
      setMedia(newMedia);
    }
  };

  const removeMedia = () => {
    setMedia(null);
    setForm((prev) => ({ ...prev, videoUrl: "" }));
  };

  const handlePublish = async () => {
    // Validation
    if (!media || !form.title) {
      Alert.alert(
        "Wait lang, BOSS!",
        "Kailangan ng video at Title para sa Reel.",
      );
      return;
    }

    setLoading(true);
    try {
      // Upload video to Cloudinary
      let uploadedUrl: string = "";
      if (media) {
        uploadedUrl = await uploadToCloudinary(media.uri, "video");
      }

      const payload = {
        videoUrl: uploadedUrl,
        title: form.title,
        description: form.description || "",
      };

      await reelApiService.createReel(payload);
      Alert.alert("Success!", "Reel published na, BOSS!");

      // Reset form
      setForm({
        videoUrl: "",
        title: "",
        description: "",
      });
      setMedia(null);
      setModalVisible(false);
    } catch (error) {
      console.error("Publish Reel Error:", error);
      Alert.alert("Error", "Hindi na-save ang reel.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      videoUrl: "",
      title: "",
      description: "",
    });
    setMedia(null);
  };

  return {
    form,
    loading,
    isModalVisible,
    setModalVisible,
    media,
    updateField,
    pickVideo,
    recordVideo,
    removeMedia,
    handlePublish,
    resetForm,
  };
};
