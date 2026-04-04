import { View, Text, StyleSheet } from "react-native";
import { VegifyTheme } from "@/constants/theme";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.welcomeText}>Welcome to Vegify, BOSS!</Text>
        <Text style={styles.subText}>Clean Architecture is now active.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: VegifyTheme.spacing.md,
  },
  card: {
    backgroundColor: VegifyTheme.colors.card,
    padding: VegifyTheme.spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: VegifyTheme.colors.border,
  },
  welcomeText: {
    color: VegifyTheme.colors.primary,
    fontSize: 24,
    fontWeight: "bold",
  },
  subText: {
    color: VegifyTheme.colors.text,
    marginTop: VegifyTheme.spacing.sm,
  },
});
