import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { useProfile } from "../../profile/hooks/useProfile";
import { SettingItem } from "../components/SettingItem";
import { LogoutButton } from "../components/LogoutButton";

export default function SettingsScreen() {
  const { user, handleLogout, updating } = useProfile();

  return (
    <ScrollView style={styles.container}>
      {/* 1. Profile Card */}
      <View style={styles.profileCard}>
        <Image
          source={{
            uri: user?.profilePicture || "https://via.placeholder.com/150",
          }}
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{user?.name || "BOSS"}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => router.push("/edit-profile")}
          >
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. App Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        <SettingItem icon="moon-outline" label="App Theme" value="Dark Mode" />
        <SettingItem
          icon="notifications-outline"
          label="Notifications"
          value="On"
        />
        <SettingItem icon="globe-outline" label="Language" value="English" />
        <SettingItem
          icon="shield-checkmark-outline"
          label="Privacy & Security"
        />
      </View>

      {/* 3. Logout Section */}
      <View style={styles.section}>
        <LogoutButton onPress={handleLogout} />
      </View>

      {updating && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1204" },
  profileCard: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#161D10",
    margin: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  avatar: { width: 70, height: 70, borderRadius: 35, marginRight: 15 },
  profileInfo: { flex: 1 },
  userName: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  userEmail: { color: "#aaa", fontSize: 14, marginBottom: 10 },
  editBtn: {
    backgroundColor: "#4CAF50",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  editBtnText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  section: { marginTop: 10, paddingHorizontal: 15 },
  sectionTitle: {
    color: "#666",
    fontSize: 13,
    marginBottom: 10,
    textTransform: "uppercase",
    marginLeft: 5,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});
