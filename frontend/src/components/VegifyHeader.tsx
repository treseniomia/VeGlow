import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { VegifyTheme } from "../constants/theme";

interface VegifyHeaderProps {
  title: string;
}

export const VegifyHeader = ({ title }: VegifyHeaderProps) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: VegifyTheme.spacing.md,
    backgroundColor: VegifyTheme.colors.background,
    paddingBottom: 15,
  },
  backBtn: { marginRight: 15 },
  title: {
    color: VegifyTheme.colors.text,
    fontSize: 20,
    fontWeight: "bold",
  },
});
