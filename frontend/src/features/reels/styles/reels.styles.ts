import { StyleSheet } from "react-native";
import { VegifyTheme } from "../../../constants/theme";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: VegifyTheme.colors.background,
  },
  scrollContent: {
    padding: VegifyTheme.spacing.md,
    paddingBottom: 50,
  },
  headline: {
    fontSize: 32,
    fontWeight: "bold",
    color: VegifyTheme.colors.text,
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: VegifyTheme.colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: VegifyTheme.spacing.lg,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: VegifyTheme.spacing.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: VegifyTheme.colors.text,
  },
  closeButton: {
    padding: 8,
  },
  // Choice buttons
  choiceContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: VegifyTheme.spacing.md,
  },
  choiceButton: {
    flex: 1,
    backgroundColor: VegifyTheme.colors.card,
    borderWidth: 1,
    borderColor: VegifyTheme.colors.border,
    borderRadius: 15,
    padding: VegifyTheme.spacing.lg,
    alignItems: "center",
    gap: 10,
  },
  choiceButtonSelected: {
    backgroundColor: VegifyTheme.colors.primary,
    borderColor: VegifyTheme.colors.primary,
  },
  choiceIcon: {
    fontSize: 32,
  },
  choiceLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: VegifyTheme.colors.text,
  },
  choiceLabelSelected: {
    color: "#FFF",
  },
  // Form styles
  inputContainer: {
    marginBottom: VegifyTheme.spacing.md,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: VegifyTheme.colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: VegifyTheme.colors.background,
    borderWidth: 1,
    borderColor: VegifyTheme.colors.border,
    borderRadius: 10,
    padding: VegifyTheme.spacing.md,
    fontSize: 16,
    color: VegifyTheme.colors.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  // Video thumbnail
  videoThumbnail: {
    width: "100%",
    height: 200,
    backgroundColor: VegifyTheme.colors.card,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: VegifyTheme.colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: VegifyTheme.spacing.md,
    overflow: "hidden",
  },
  videoPreviewContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  videoPreview: {
    width: "100%",
    height: "100%",
  },
  playIconOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  videoPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  videoPlaceholderText: {
    fontSize: 14,
    color: "#666",
  },
  uploadButton: {
    backgroundColor: VegifyTheme.colors.primary,
    borderRadius: 10,
    padding: VegifyTheme.spacing.md,
    alignItems: "center",
    marginBottom: VegifyTheme.spacing.md,
  },
  uploadButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  // Submit button
  submitButton: {
    backgroundColor: VegifyTheme.colors.primary,
    borderRadius: 10,
    padding: VegifyTheme.spacing.lg,
    alignItems: "center",
    marginTop: VegifyTheme.spacing.md,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  submitButtonDisabled: {
    backgroundColor: "#666",
  },
  // Feed styles
  feedContainer: {
    flex: 1,
  },
  reelItem: {
    marginBottom: VegifyTheme.spacing.md,
  },
  reelVideo: {
    width: "100%",
    aspectRatio: 9 / 16,
    backgroundColor: "#000",
  },
  reelInfo: {
    padding: VegifyTheme.spacing.md,
  },
  reelTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: VegifyTheme.colors.text,
    marginBottom: 4,
  },
  reelDescription: {
    fontSize: 14,
    color: "#999",
    marginBottom: 8,
  },
  reelUser: {
    fontSize: 12,
    color: VegifyTheme.colors.primary,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: VegifyTheme.spacing.xl,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    marginTop: VegifyTheme.spacing.md,
  },
});
