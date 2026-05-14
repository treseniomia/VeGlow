import React from "react";
import { TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ProfileScreen } from "@/features/profile/screens/ProfileScreen";

export default function ProfileRoute() {
  const router = useRouter();
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "My Vegify",
          headerStyle: { backgroundColor: "#0B1204" },
          headerTintColor: "#fff",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("/settings")}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="settings-outline" size={24} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
      <ProfileScreen />
    </>
  );
}
