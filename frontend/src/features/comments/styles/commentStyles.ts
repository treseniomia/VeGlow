import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#1A2902",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "#1A2902",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  headerPlaceholder: {
    width: 24,
  },

  centerSpinner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1A2902",
  },
  listContentSpace: {
    paddingBottom: 20,
  },
  emptyView: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.4)",
    fontWeight: "500",
  },

  mainWrapper: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
    backgroundColor: "#1A2902",
  },
  commentContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 14,
    alignItems: "flex-start",
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#99CC33",
  },
  avatarText: {
    color: "#1A2902",
    fontWeight: "700",
  },
  avatarImage: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  contentBlock: {
    flex: 1,
    marginLeft: 12,
    paddingRight: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  username: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
  },
  authorBadge: {
    backgroundColor: "#99CC33",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  authorBadgeText: {
    color: "#1A2902",
    fontSize: 10,
    fontWeight: "700",
  },
  actionIconGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
    gap: 12,
  },
  commentText: {
    fontSize: 14,
    color: "#ffffff",
    marginTop: 4,
    lineHeight: 19,
  },
  mentionText: {
    color: "#99CC33",
    fontWeight: "600",
  },

  footerActionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.4)",
  },
  replyTrigger: {
    marginLeft: 20,
  },
  replyTriggerText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "600",
  },
  actionPanel: {
    alignItems: "center",
    width: 32,
    paddingTop: 2,
  },
  likeCount: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.4)",
    marginTop: 4,
    fontWeight: "500",
  },
  likedText: {
    color: "#99CC33",
  },

  repliesThreadSection: {
    marginTop: 2,
  },
  expandButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 64,
    paddingVertical: 8,
  },
  dividerLine: {
    width: 18,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginRight: 8,
  },
  expandButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.5)",
  },

  editContainer: {
    marginTop: 6,
    width: "100%",
  },
  editInput: {
    backgroundColor: "#1E2F03",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#ffffff",
    minHeight: 40,
    borderWidth: 1,
    borderColor: "rgba(153, 204, 51, 0.2)",
  },
  editActions: {
    flexDirection: "row",
    marginTop: 8,
    justifyContent: "flex-end",
    gap: 8,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.5)",
  },
  saveButton: {
    backgroundColor: "#99CC33",
  },
  saveButtonText: {
    fontSize: 13,
    color: "#1A2902",
    fontWeight: "600",
  },

  mentionIndicatorBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1E2F03",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  mentionTextData: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  boldMention: {
    fontWeight: "600",
    color: "#99CC33",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#1A2902",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#1E2F03",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 10 : 6,
    paddingBottom: Platform.OS === "ios" ? 10 : 6,
    fontSize: 14,
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  sendButton: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledSendButton: {
    opacity: 0.4,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1E2F03",
    borderRadius: 16,
    padding: 8,
    minWidth: 180,
    borderWidth: 1,
    borderColor: "rgba(153, 204, 51, 0.1)",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  modalOptionText: {
    fontSize: 15,
    color: "#ffffff",
    fontWeight: "500",
  },
});
