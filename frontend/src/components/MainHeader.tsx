import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ProfileAvatar } from "@/features/profile/components/ProfileAvatar";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/useAuthStore";

const MainHeader = () => {
  const { user } = useAuthStore();

  return (
    <View style={styles.container}>
      <ProfileAvatar size={40} uri={user?.profilePicture} name={user?.name} />

      <Text style={styles.logoText}>Vegify</Text>

      <View style={styles.iconGroup}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="search-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#1A2902",
  },
  logoText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#99CC33",
  },
  iconGroup: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 15,
  },
});

export default MainHeader;
