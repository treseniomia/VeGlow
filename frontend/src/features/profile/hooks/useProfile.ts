import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";
import { useState, useCallback } from "react";
import * as ImagePicker from "expo-image-picker";
import { uploadToCloudinary } from "@/services/cloudinary.service";
import { profileService } from "../services/profileService";

export const useProfile = () => {
  const router = useRouter();
  const { user, logout, updateUser } = useAuthStore();
  const [updating, setUpdating] = useState(false);

  const processImageUpdate = useCallback(
    async (uri: string) => {
      setUpdating(true);
      try {
        const imageUrl = await uploadToCloudinary(uri, "image");

        const updatedUserFromServer = await profileService.updateAvatar(
          imageUrl
        );

        if (updateUser) {
          await updateUser(updatedUserFromServer);
        }

        Alert.alert("Success 🌿", "Updated na ang profile mo, BOSS!");
      } catch (error: any) {
        console.error("[PROFILE_UPDATE_ERROR]:", error.message);
        Alert.alert(
          "Update Failed",
          "Hindi na-save ang image sa server. Check your connection."
        );
      } finally {
        setUpdating(false);
      }
    },
    [updateUser]
  );

  const takeProfilePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Kailangan namin ng camera access para sa profile photo."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      await processImageUpdate(result.assets[0].uri);
    }
  };

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Kailangan namin ng gallery access, BOSS."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      await processImageUpdate(result.assets[0].uri);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout 🌿", "Are you sure you want to logout from Vegify?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/signin");
        },
      },
    ]);
  };

  return {
    user,
    updating,
    handleLogout,
    takeProfilePhoto,
    pickImageFromGallery,
  };
};
