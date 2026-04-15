import { View, Text, StyleSheet } from "react-native";
import { VegifyTheme } from "@/constants/theme";

export default function SignInScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: VegifyTheme.colors.primary }}>SignIn Screen</Text>
    </View>
  );
}
