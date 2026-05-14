import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useProfile } from "../hooks/useProfile";
import { useRouter } from "expo-router";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updating, takeProfilePhoto, pickImageFromGallery } =
    useProfile();

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState("");

  const handleSave = () => {
    Alert.alert("Success", "Profile details updated locally!");
    router.back();
  };

  const handleChangePhoto = () => {
    Alert.alert("Update Photo", "Saan mo gustong kumuha ng photo, BOSS?", [
      { text: "Camera", onPress: takeProfilePhoto },
      { text: "Gallery", onPress: pickImageFromGallery },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* 1. Header Area (Custom) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={updating}>
          <Text style={styles.saveText}>{updating ? "..." : "Save"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* 2. Avatar Section */}
        <View style={styles.avatarContainer}>
          <View>
            <Image
              source={{
                uri: user?.profilePicture || "https://via.placeholder.com/150",
              }}
              style={styles.avatar}
            />
            <TouchableOpacity
              style={styles.cameraIcon}
              onPress={handleChangePhoto}
            >
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.changePhotoText}>Tap to change avatar</Text>
        </View>

        {/* 3. Form Inputs */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholderTextColor="#666"
            placeholder="Enter your name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={bio}
            onChangeText={setBio}
            placeholderTextColor="#666"
            placeholder="Tell us about yourself..."
            multiline
            numberOfLines={4}
          />
        </View>
      </View>

      {updating && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={{ color: "#fff", marginTop: 10 }}>
            Uploading to Cloudinary...
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1204" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#161D10",
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  saveText: { color: "#4CAF50", fontSize: 16, fontWeight: "bold" },
  content: { padding: 20 },
  avatarContainer: { alignItems: "center", marginBottom: 30 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#161D10",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#0B1204",
  },
  changePhotoText: { color: "#666", marginTop: 10, fontSize: 12 },
  inputGroup: { marginBottom: 20 },
  label: { color: "#4CAF50", fontSize: 14, marginBottom: 8, fontWeight: "600" },
  input: {
    backgroundColor: "#161D10",
    color: "#fff",
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
  },
  textArea: { height: 100, textAlignVertical: "top" },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
});
