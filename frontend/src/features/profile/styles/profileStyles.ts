import { StyleSheet } from "react-native";
import { VegifyTheme } from "@/constants/theme";

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1204",
  },
  header: {
    backgroundColor: "#1A260F",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#2C3E1D",
  },
  userInfo: {
    flex: 1,
    marginLeft: 20,
  },
  statsRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  statItem: {
    marginRight: 20,
  },
  statNumber: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  statLabel: {
    color: "#A9A9A9",
    fontSize: 12,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: VegifyTheme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    position: "relative",
  },
  avatarTextContainer: {
    backgroundColor: VegifyTheme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },

  avatarText: {
    color: "#FFFFFF",
    fontWeight: "700",
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },

  cameraIconBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    padding: 4,
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  menuContainer: {
    marginTop: 20,
    backgroundColor: "white",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
  },
  logoutItem: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
});
