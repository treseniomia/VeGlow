import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Clipboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IComment } from "../types";

interface ReplyItemProps {
  reply: IComment;
  currentUserId: string;
  onLike: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  onEdit?: (commentId: string, newText: string) => void;
  onSelectReplyTarget?: (comment: IComment) => void;
}

export const ReplyItem: React.FC<ReplyItemProps> = ({
  reply,
  currentUserId,
  onLike,
  onDelete,
  onEdit,
  onSelectReplyTarget,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(reply.text);
  const [showModal, setShowModal] = useState(false);
  const isLiked = reply.likes.includes(currentUserId);
  const isOwnReply = reply.user._id === currentUserId;

  const formatRelativeTime = (dateString: string): string => {
    const now = Date.now();
    const date = new Date(dateString).getTime();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d`;
    } else if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months}m`;
    } else {
      const years = Math.floor(diffInSeconds / 31536000);
      return `${years}y`;
    }
  };

  useEffect(() => {
    if (!isEditing) {
      setEditText(reply.text);
    }
  }, [reply.text, isEditing]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditText(reply.text);
  };

  const handleEditSave = () => {
    if (editText.trim() && onEdit) {
      onEdit(reply._id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditText(reply.text);
  };

  const handleDelete = () => {
    Alert.alert("Delete Reply", "Are you sure you want to delete this reply?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => onDelete(reply._id),
      },
    ]);
  };

  const handleCopy = async () => {
    const textToCopy = reply.replyToUser
      ? `@${reply.replyToUser.name} ${reply.text}`
      : reply.text;
    await Clipboard.setString(textToCopy);
    setShowModal(false);
  };

  const handleModalEdit = () => {
    setShowModal(false);
    handleEditToggle();
  };

  return (
    <View style={styles.replyContainer}>
      <Image
        source={{
          uri: reply.user.profilePicture || "https://via.placeholder.com/150",
        }}
        style={styles.avatar}
      />

      <View style={styles.contentBlock}>
        <View style={styles.headerRow}>
          <Text style={styles.username}>{reply.user.name}</Text>
          {isOwnReply && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={handleEditToggle}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name="create-outline"
                  size={14}
                  color="#007aff"
                  style={styles.actionIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDelete}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name="trash-outline"
                  size={14}
                  color="#ff4d4d"
                  style={styles.trashIcon}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.editInput}
              value={editText}
              onChangeText={setEditText}
              multiline
              autoFocus
            />
            <View style={styles.editActions}>
              <TouchableOpacity
                onPress={handleEditCancel}
                style={styles.editButton}
              >
                <Text style={styles.editButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleEditSave}
                style={[styles.editButton, styles.saveButton]}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            onLongPress={() => setShowModal(true)}
            delayLongPress={500}
            activeOpacity={1}
          >
            <Text style={styles.replyText}>
              {reply.replyToUser && (
                <Text style={styles.mentionText}>
                  @{reply.replyToUser.name}{" "}
                </Text>
              )}
              {reply.text}
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.footerActionRow}>
          <Text style={styles.timestamp}>
            {formatRelativeTime(reply.createdAt)}
          </Text>
          {onSelectReplyTarget && (
            <TouchableOpacity
              onPress={() => onSelectReplyTarget(reply)}
              style={styles.replyTrigger}
            >
              <Text style={styles.replyTriggerText}>Reply</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.actionPanel}>
        <TouchableOpacity
          onPress={() => onLike(reply._id)}
          style={styles.likeButton}
        >
          <Ionicons
            name={isLiked ? "leaf" : "leaf-outline"}
            size={16}
            color={isLiked ? "#ff3b30" : "#8e8e93"}
          />
          <Text style={[styles.likeCount, isLiked && styles.likedText]}>
            {reply.likesCount}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowModal(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalOption} onPress={handleCopy}>
              <Ionicons name="copy-outline" size={20} color="#ffffff" />
              <Text style={styles.modalOptionText}>Copy</Text>
            </TouchableOpacity>
            {isOwnReply && onEdit && (
              <TouchableOpacity
                style={styles.modalOption}
                onPress={handleModalEdit}
              >
                <Ionicons name="create-outline" size={20} color="#ffffff" />
                <Text style={styles.modalOptionText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  replyContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "flex-start",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e1e1e1",
  },
  contentBlock: {
    flex: 1,
    marginLeft: 10,
    paddingRight: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  username: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1c1c1e",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionIcon: {
    marginRight: 8,
  },
  editContainer: {
    marginTop: 4,
  },
  editInput: {
    backgroundColor: "#f2f2f7",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: "#1c1c1e",
    minHeight: 36,
  },
  editActions: {
    flexDirection: "row",
    marginTop: 8,
    gap: 8,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    fontSize: 12,
    color: "#8e8e93",
  },
  saveButton: {
    backgroundColor: "#007aff",
  },
  saveButtonText: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "600",
  },
  replyText: {
    fontSize: 14,
    color: "#2c2c2e",
    marginTop: 3,
    lineHeight: 19,
  },
  mentionText: {
    color: "#007aff",
    fontWeight: "500",
  },
  timestamp: {
    fontSize: 10,
    color: "#8e8e93",
    marginTop: 4,
  },
  footerActionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  replyTrigger: {
    marginLeft: 12,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  replyTriggerText: {
    fontSize: 11,
    color: "#8e8e93",
    fontWeight: "600",
  },
  actionPanel: {
    alignItems: "center",
    justifyContent: "center",
    width: 28,
  },
  likeButton: {
    alignItems: "center",
  },
  likeCount: {
    fontSize: 10,
    color: "#8e8e93",
    marginTop: 2,
  },
  likedText: {
    color: "#ff3b30",
  },
  trashIcon: {
    paddingHorizontal: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1a4d2e",
    borderRadius: 12,
    padding: 8,
    minWidth: 150,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  modalOptionText: {
    fontSize: 16,
    color: "#ffffff",
  },
});
