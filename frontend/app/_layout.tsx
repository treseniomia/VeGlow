import { Stack } from "expo-router";
import { VegifyTheme } from "@/constants/theme";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: VegifyTheme.colors.background,
          },
          headerTintColor: VegifyTheme.colors.primary,
          headerTitleStyle: {
            fontWeight: "bold",
          },
          contentStyle: {
            backgroundColor: VegifyTheme.colors.background,
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: "VEGIFY" }} />
      </Stack>
    </>
  );
}
