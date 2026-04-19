import { StyleSheet } from "react-native";
import { VegifyTheme } from "../../../constants/theme";

export const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: VegifyTheme.colors.background },
  scrollContent: { padding: VegifyTheme.spacing.md, paddingBottom: 50 },
  headline: {
    fontSize: 32,
    fontWeight: "bold",
    color: VegifyTheme.colors.text,
    marginBottom: 20,
  },
  mediaPlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: VegifyTheme.colors.card,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: VegifyTheme.colors.border,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionLabel: {
    color: VegifyTheme.colors.primary,
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  macroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 10,
  },
});
