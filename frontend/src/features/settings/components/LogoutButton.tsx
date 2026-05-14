import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface LogoutButtonProps {
  onPress: () => void;
}

export const LogoutButton = ({ onPress }: LogoutButtonProps) => (
  <TouchableOpacity style={styles.logoutBtn} onPress={onPress}>
    <Ionicons name="log-out-outline" size={22} color="#FF4B4B" />
    <Text style={styles.logoutText}>Logout</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#FF4B4B33",
    borderRadius: 12,
  },
  logoutText: {
    color: "#FF4B4B",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
});
