import { useEffect } from "react";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "@/store/useAuthStore";

export default function RootLayout() {
  const { rehydrate, setHydrated, isHydrated } = useAuthStore();

  useEffect(() => {
    async function loadStorageData() {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        const userData = await SecureStore.getItemAsync("userData");

        if (token && userData) {
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

  if (!isHydrated) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
