import { useState } from "react";
import { Alert } from "react-native";
import { MediaItem, PostFormData } from "../types";
import { postService } from "../services/postService";
import { uploadToCloudinary } from "../../../services/cloudinary.service";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";

export const useCreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [nutritions, setNutritions] = useState<
    { label: string; value: string }[]
  >([]);

  const [form, setForm] = useState<PostFormData>({
    title: "",
    prepTime: "",
    instructions: "",
    ingredients: "",
    nutritionList: [],
    media: [],
  });

  const updateField = (field: keyof PostFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addNutrition = (label: string, value: string) => {
    setNutritions((prev) => [...prev, { label, value }]);
  };

  const removeNutrition = (index: number) => {
    setNutritions((prev) => prev.filter((_, i) => i !== index));
  };

  const takePhoto = async (mode: "image" | "video" = "image") => {
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    const micStatus = await Camera.requestMicrophonePermissionsAsync();

    if (cameraStatus.status !== "granted" || micStatus.status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Kailangan ng camera at microphone access."
      );
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      // mediaTypes:
      //   mode === "video"
      //     ? ImagePicker.MediaTypeOptions.Videos
      //     : ImagePicker.MediaTypeOptions.Images,
      mediaTypes: mode === "video" ? ["videos"] : ["images"],
      allowsEditing: false,
      quality: 0.7,
      videoMaxDuration: 60,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const newMedia: MediaItem = {
        uri: asset.uri,
        type:
          asset.type === "video" || asset.uri.endsWith(".mp4")
            ? "video"
            : "image",
      };
      setForm((prev) => ({
        ...prev,
        media: [...prev.media, newMedia].slice(0, 25),
      }));
    }
  };

  const pickMedia = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Access to gallery is required.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsMultipleSelection: true,
      selectionLimit: 6,
      quality: 0.7,
    });

    if (!result.canceled) {
      const selectedMedia: MediaItem[] = result.assets.map((asset) => ({
        uri: asset.uri,
        type: asset.type === "video" ? "video" : "image",
      }));
      setForm((prev) => ({
        ...prev,
        media: [...prev.media, ...selectedMedia].slice(0, 25),
      }));
    }
  };

  const removeMedia = (index: number) => {
    setForm((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }));
  };

  const handlePublish = async () => {
    // STRICT VALIDATION: title, instructions, media, at ingredients
    if (
      !form.title ||
      !form.instructions ||
      !form.ingredients ||
      form.media.length === 0
    ) {
      Alert.alert(
        "Wait lang, BOSS!",
        "Kailangan kumpleto ang Title, Instructions, Ingredients, at Media."
      );
      return;
    }

    setLoading(true);
    try {
      let uploadedUrls: string[] = [];
      if (form.media.length > 0) {
        const uploadPromises = form.media.map((item) =>
          uploadToCloudinary(item.uri, item.type)
        );
        uploadedUrls = await Promise.all(uploadPromises);
      }

      // STRICT INGREDIENTS LOGIC: I-convert ang string tungo sa clean Array
      const ingredientsArray = form.ingredients
        .split(/[\n,]+/) // Split by new line or comma
        .map((item) => item.trim()) // Remove extra spaces
        .filter((item) => item.length > 0); // Remove empty strings

      const payload = {
        ...form,
        ingredients: form.ingredients
          .split(/[\n,]+/)
          .map((item) => item.trim())
          .filter((item) => item.length > 0),
        nutritionList: nutritions,
        mediaUrl: uploadedUrls[0] || "",
      };

      await postService.publishRecipe(payload as any);
      Alert.alert(
        "Success!",
        "Recipe published na with Strict Ingredients, BOSS!"
      );

      setForm({
        title: "",
        prepTime: "",
        instructions: "",
        ingredients: "",
        nutritionList: nutritions,
        media: [],
      });
      setNutritions([]);
    } catch (error) {
      console.error("Publish Error:", error);
      Alert.alert("Error", "Hindi na-save ang recipe.");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    updateField,
    handlePublish,
    nutritions,
    isModalVisible,
    setModalVisible,
    addNutrition,
    removeNutrition,
    pickMedia,
    takePhoto,
    removeMedia,
  };
};
