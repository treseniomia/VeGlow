import { useEffect } from "react";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "@/store/useAuthStore";

export default function RootLayout() {
  const rehydrate = useAuthStore((state) => state.rehydrate);
  const setHydrated = useAuthStore((state) => state.setHydrated);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        const userData = await SecureStore.getItemAsync("userData");

        if (token && userData) {
          // rehydrate to set the state without storage conflict
          rehydrate(JSON.parse(userData), token);
        }
      } catch (e) {
        console.error("Failed to load storage", e);
      } finally {
        setHydrated(true);
      }
    }

    loadStorageData();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="recipe/[id]" options={{ presentation: "card" }} />
    </Stack>
  );
}
