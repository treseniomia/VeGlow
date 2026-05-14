import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function EditRecipeScreen() {
  const { id } = useLocalSearchParams();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1A260F",
      }}
    >
      <Text style={{ color: "#fff" }}>Editing Recipe ID: {id}</Text>
    </View>
  );
}
