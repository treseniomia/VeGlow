import { Redirect } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";
import { View, ActivityIndicator } from "react-native";
import { VegifyTheme } from "@/constants/theme";

export default function Index() {
  const { token, isHydrated } = useAuthStore();

  // 1. STICKY LOADING: Huwag gagalaw hangga't isHydrated is FALSE
  if (!isHydrated) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F5F5F5",
        }}
      >
        <ActivityIndicator size="large" color={VegifyTheme.colors.primary} />
      </View>
    );
  }

  // 2. Ngayong SURE na tayo na nabasa na ang storage, saka mag-redirect
  return token ? (
    <Redirect href="/(tabs)" />
  ) : (
    <Redirect href="/(auth)/signup" />
  );
}
