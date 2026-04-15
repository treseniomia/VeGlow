import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { VegifyTheme } from "@/constants/theme";
import { useProfile } from "../hooks/useProfile";
import { profileStyles as styles } from "../styles/profileStyles";

export const ProfileScreen = () => {
  const { user, handleLogout } = useProfile();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0) || "U"}</Text>
        </View>
        <Text style={styles.userName}>{user?.name || "User"}</Text>
        <Text style={styles.userEmail}>
          {user?.email || "No email provided"}
        </Text>
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
