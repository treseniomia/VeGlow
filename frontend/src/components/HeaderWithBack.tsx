import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HeaderProps {
  title: string;
}

export const HeaderWithBack = ({ title }: HeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    setTimeout(() => {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/(tabs)");
      }
    }, 0);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleBack}
        style={styles.backButton}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      >
        <Ionicons name="arrow-back" size={24} color="#99CC33" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#1A2902",
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#99CC33",
  },
});
