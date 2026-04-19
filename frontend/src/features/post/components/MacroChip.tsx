import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { VegifyTheme } from "../../../constants/theme";

interface MacroChipProps {
  label: string;
  value: string | number;
}

export const MacroChip = ({ label, value }: MacroChipProps) => (
  <View style={styles.card}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: VegifyTheme.colors.card,
    borderRadius: 50, // Pill shape base sa Figma
    paddingVertical: 20,
    paddingHorizontal: 15,
    width: "45%", // Para dalawa sa isang row
    alignItems: "center",
    marginBottom: VegifyTheme.spacing.md,
  },
  label: {
    color: VegifyTheme.colors.placeholder,
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 5,
  },
  value: {
    color: VegifyTheme.colors.primary,
    fontSize: 24,
    fontWeight: "bold",
  },
});
