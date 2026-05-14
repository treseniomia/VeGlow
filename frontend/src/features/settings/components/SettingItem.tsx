import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
}

export const SettingItem = ({
  icon,
  label,
  value,
  onPress,
}: SettingItemProps) => (
  <TouchableOpacity style={styles.row} onPress={onPress}>
    <View style={styles.rowLeft}>
      <Ionicons
        name={icon}
        size={22}
        color="#fff"
        style={styles.iconContainer}
      />
      <Text style={styles.rowLabel}>{label}</Text>
    </View>
    <View style={styles.rowRight}>
      {value && <Text style={styles.rowValue}>{value}</Text>}
      <Ionicons name="chevron-forward" size={18} color="#666" />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#161D10",
    padding: 15,
    borderRadius: 12,
    marginBottom: 8,
  },
  rowLeft: { flexDirection: "row", alignItems: "center" },
  iconContainer: { marginRight: 12 },
  rowLabel: { color: "#fff", fontSize: 15 },
  rowRight: { flexDirection: "row", alignItems: "center" },
  rowValue: { color: "#666", marginRight: 8, fontSize: 14 },
});
