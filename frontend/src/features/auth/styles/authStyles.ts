import { StyleSheet, Platform } from "react-native";
import { VegifyTheme } from "@/constants/theme";

export const authStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: VegifyTheme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    // Tinanggal ang static paddingBottom para dynamic safe area ang gagamitin
  },
  headerContainer: {
    alignItems: "center",
    marginVertical: 20, // Binawasan para mag-fit sa screen nang walang scroll
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: VegifyTheme.colors.primary,
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 16,
    color: VegifyTheme.colors.text,
    opacity: 0.7,
    textAlign: "center",
  },
  formContainer: { marginBottom: 10 },
  inputLabel: {
    fontSize: 14,
    color: VegifyTheme.colors.primary,
    fontWeight: "600",
    marginBottom: 4,
    marginTop: 10,
  },
  passwordWrapper: { position: "relative", justifyContent: "center" },
  eyeIcon: { position: "absolute", right: 15, zIndex: 1 },
  button: {
    backgroundColor: VegifyTheme.colors.primary,
    padding: 18,
    borderRadius: 12,
    marginTop: 25,
    elevation: 5,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10, // Space bago ang gesture bar
  },
  footerText: { color: VegifyTheme.colors.text, opacity: 0.7 },
  footerLink: { color: VegifyTheme.colors.primary, fontWeight: "bold" },
  agreementContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  checkbox: { marginRight: 10 },
  agreementText: {
    color: VegifyTheme.colors.text,
    fontSize: 13,
    flex: 1,
    opacity: 0.8,
  },
  linkText: {
    color: VegifyTheme.colors.primary,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
