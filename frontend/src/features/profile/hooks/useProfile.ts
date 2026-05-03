import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import api from "@/api/api";
import { uploadToCloudinary } from "@/services/cloudinary.service";

export const useProfile = () => {
  const router = useRouter();
  const { user, logout, updateUser } = useAuthStore();
  const [updating, setUpdating] = useState(false);
  const processImageUpdate = async (uri: string) => {
    setUpdating(true);
    try {
      const imageUrl = await uploadToCloudinary(uri, "image");

      await api.put("/auth/profile", {
        profilePicture: imageUrl,
      });

      if (updateUser) {
        await updateUser({ profilePicture: imageUrl });
      }

      Alert.alert("Success! 🌿", "Updated na ang profile picture mo, BOSS.");
    } catch (error: any) {
      console.error(
        "Upload Error Details:",
        error.response?.data || error.message
      );
      Alert.alert("Error", "Hindi ma-upload ang picture. Try again later.");
    } finally {
      setUpdating(false);
    }
  };

  const takeProfilePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Kailangan namin ng camera access, BOSS."
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
        "Permission Denied",
        "Kailangan namin ng access sa gallery mo, BOSS."
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
