import { View, Text, StyleSheet } from "react-native";
import { VegifyTheme } from "@/constants/theme";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: VegifyTheme.colors.primary }}>Home Screen</Text>
    </View>
  );
}
