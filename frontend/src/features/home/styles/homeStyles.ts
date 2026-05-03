import { StyleSheet } from "react-native";
import { VegifyTheme } from "@/constants/theme";

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A2902",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  emptyText: {
    color: "#99CC33",
    fontSize: 16,
    opacity: 0.6,
  },
});
