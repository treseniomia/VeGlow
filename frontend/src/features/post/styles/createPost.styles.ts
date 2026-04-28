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
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  addInfoText: {
    color: VegifyTheme.colors.primary,
    fontWeight: "bold",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  chip: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 10,
    marginRight: 8,
    marginBottom: 8,
    minWidth: 80,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  chipLabel: {
    color: VegifyTheme.colors.primary,
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  chipValue: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  // createPost.styles.ts
  emptyText: {
    color: "#666",
    fontStyle: "italic",
    fontSize: 14,
    marginTop: 5,
  },
});
