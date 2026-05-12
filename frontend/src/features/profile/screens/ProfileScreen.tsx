import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { VegifyTheme } from "@/constants/theme";
import { useProfile } from "../hooks/useProfile";
import { profileStyles as styles } from "../styles/profileStyles";
import { ProfileAvatar } from "../components/ProfileAvatar";
import { useEffect } from "react";

export const ProfileScreen = () => {
  const {
    user,
    handleLogout,
    takeProfilePhoto,
    pickImageFromGallery,
    updating,
  } = useProfile();

  useEffect(() => {
    console.log("Current User in Profile Screen:", user);
  }, [user]);

  const handleEditPhoto = () => {
    Alert.alert(
      "Update Profile Picture",
      "Saan mo gustong kumuha ng bagong photo, BOSS?",
      [
        { text: "📷 Take Photo", onPress: takeProfilePhoto },
        { text: "🖼️ Choose from Gallery", onPress: pickImageFromGallery },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ProfileAvatar
          uri={user?.profilePicture}
          name={user?.name}
          onPress={handleEditPhoto}
          loading={updating}
        />
        <Text style={styles.userName}>{user?.name || "User"}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons
            name="person-outline"
            size={24}
            color={VegifyTheme.colors.primary}
          />
          <Text style={styles.menuText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons
            name="settings-outline"
            size={24}
            color={VegifyTheme.colors.primary}
          />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, styles.logoutItem]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#FF4444" />
          <Text style={[styles.menuText, { color: "#FF4444" }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
