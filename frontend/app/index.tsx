import { Redirect } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";
import { View, ActivityIndicator } from "react-native";
import { VegifyTheme } from "@/constants/theme";

export default function Index() {
  const { token, isHydrated } = useAuthStore();

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

  return token ? (
    <Redirect href="/(tabs)" />
  ) : (
    <Redirect href="/(auth)/signup" />
  );
}
