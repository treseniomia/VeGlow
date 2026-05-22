import React, { useState, Suspense } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Clipboard,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { IComment } from "../types";
import { UserAvatarFallback } from "./UserAvatarFallback";
import { styles } from "../styles/commentStyles";

const ReplySection = React.lazy(() =>
  import("./ReplySection").then((module) => ({ default: module.ReplySection }))
);

interface CommentItemRowProps {
  item: IComment;
  replies?: IComment[];
  currentUserId: string;
  postAuthorId: string;
  isReply?: boolean;
  parentId?: string | null;
  hasMoreReplies?: boolean;
  onLike: (commentId: string, isReply: boolean) => void;
  onDelete: (commentId: string, parentId: string | null) => void;
  onLoadReplies?: (commentId: string) => void;
  onSelectReplyTarget: (comment: IComment) => void;
  onEdit: (commentId: string, newText: string, parentId: string | null) => void;
}

export const CommentItemRow: React.FC<CommentItemRowProps> = ({
  item,
  replies = [],
  currentUserId,
  postAuthorId,
  isReply = false,
  parentId = null,
  hasMoreReplies = false,
  onLike,
  onDelete,
  onLoadReplies,
  onSelectReplyTarget,
  onEdit,
}) => {
  const [isRepliesExpanded, setIsRepliesExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);
  const [showLongPressModal, setShowLongPressModal] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const isLiked = item.likes.includes(currentUserId);
  const isOwnNode = item.user._id === currentUserId;
  const isPostAuthor = item.user._id === postAuthorId;

  if (isHidden) return null;

  const formatRelativeTime = (dateString: string): string => {
    const now = Date.now();
    const date = new Date(dateString).getTime();
    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  const handleEditSave = () => {
    if (editText.trim()) {
      onEdit(item._id, editText.trim(), parentId);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    setShowLongPressModal(false);
    Alert.alert(
      isReply ? "Delete Reply" : "Delete Comment",
      "Are you sure you want to permanently erase this message row context?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(item._id, parentId),
        },
      ]
    );
  };

  const handleCopyText = () => {
    Clipboard.setString(item.text);
    setShowLongPressModal(false);
    Alert.alert("Success", "Comment copied to clipboard!");
  };

  const handleHideComment = () => {
    setShowLongPressModal(false);
    setIsHidden(true);
  };

  const handleReportComment = () => {
    setShowLongPressModal(false);
    Alert.alert(
      "Report Submitted",
      "Thank you. We will review this content matching Vegify guidelines."
    );
  };

  const handleBlockUser = () => {
    setShowLongPressModal(false);
    Alert.alert(
      "User Blocked",
      `You will no longer see updates from @${item.user.name}`
    );
  };

  const handleContentTextRender = () => {
    if (isEditing) {
      return (
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
              onPress={() => setIsEditing(false)}
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
      );
    }

    return (
      <TouchableOpacity
        onLongPress={() => setShowLongPressModal(true)}
        delayLongPress={400}
        activeOpacity={0.8}
      >
        <Text style={styles.commentText}>
          {isReply && item.replyToUser && (
            <Text style={styles.mentionText}>@{item.replyToUser.name} </Text>
          )}
          {item.text}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.mainWrapper, isReply && { borderBottomWidth: 0 }]}>
      <View
        style={[
          styles.commentContainer,
          isReply && { paddingLeft: 54, paddingTop: 10 },
        ]}
      >
        <UserAvatarFallback
          size={isReply ? 28 : 36}
          uri={item.user.profilePicture}
          name={item.user.name}
        />

        <View style={styles.contentBlock}>
          <View style={styles.headerRow}>
            <Text style={styles.username}>{item.user.name}</Text>
            {isPostAuthor && (
              <View style={styles.authorBadge}>
                <Text style={styles.authorBadgeText}>AUTHOR</Text>
              </View>
            )}

            {isOwnNode && !isEditing && (
              <View style={styles.actionIconGroup}>
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Ionicons
                    name="create-outline"
                    size={15}
                    color="rgba(255,255,255,0.4)"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete}>
                  <Ionicons name="trash-outline" size={15} color="#ff4d4d" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {handleContentTextRender()}

          <View style={styles.footerActionRow}>
            <Text style={styles.timestamp}>
              {formatRelativeTime(item.createdAt)}
            </Text>
            <TouchableOpacity
              onPress={() => onSelectReplyTarget(item)}
              style={styles.replyTrigger}
            >
              <Text style={styles.replyTriggerText}>Reply</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actionPanel}>
          <TouchableOpacity onPress={() => onLike(item._id, isReply)}>
            <View style={{ transform: [{ scaleX: -1 }] }}>
              <Ionicons
                name={isLiked ? "leaf" : "leaf-outline"}
                size={isReply ? 16 : 18}
                color={isLiked ? "#99CC33" : "rgba(255,255,255,0.4)"}
              />
            </View>
          </TouchableOpacity>
          <Text style={[styles.likeCount, isLiked && styles.likedText]}>
            {item.likesCount}
          </Text>
        </View>
      </View>

      {!isReply && item.repliesCount > 0 && (
        <View style={styles.repliesThreadSection}>
          {!isRepliesExpanded ? (
            <TouchableOpacity
              onPress={() => {
                if (onLoadReplies) onLoadReplies(item._id);
                setIsRepliesExpanded(true);
              }}
              style={styles.expandButton}
            >
              <View style={styles.dividerLine} />
              <Text style={styles.expandButtonText}>
                View replies ({item.repliesCount})
              </Text>
              <Ionicons
                name="chevron-down"
                size={12}
                color="rgba(255,255,255,0.4)"
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          ) : (
            <Suspense
              fallback={
                <ActivityIndicator
                  size="small"
                  color="#99CC33"
                  style={{ paddingVertical: 10 }}
                />
              }
            >
              <ReplySection
                replies={replies}
                currentUserId={currentUserId}
                postAuthorId={postAuthorId}
                parentId={item._id}
                hasMoreReplies={hasMoreReplies}
                onLike={onLike}
                onDelete={onDelete}
                onLoadMore={() => onLoadReplies && onLoadReplies(item._id)}
                onSelectReplyTarget={onSelectReplyTarget}
                onEdit={(commentId: string, newText: string) =>
                  onEdit(commentId, newText, item._id)
                }
              />
            </Suspense>
          )}
        </View>
      )}

      <Modal
        visible={showLongPressModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLongPressModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLongPressModal(false)}
        >
          <View style={styles.modalContent}>
            {isOwnNode ? (
              <>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setShowLongPressModal(false);
                    setIsEditing(true);
                  }}
                >
                  <Ionicons name="create-outline" size={18} color="#ffffff" />
                  <Text style={styles.modalOptionText}>Edit Text</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={handleDelete}
                >
                  <Ionicons name="trash-outline" size={18} color="#ff4d4d" />
                  <Text style={[styles.modalOptionText, { color: "#ff4d4d" }]}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={handleCopyText}
                >
                  <Ionicons name="copy-outline" size={18} color="#ffffff" />
                  <Text style={styles.modalOptionText}>Copy Text</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={handleHideComment}
                >
                  <Ionicons name="eye-off-outline" size={18} color="#ffffff" />
                  <Text style={styles.modalOptionText}>Hide Comment</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={handleBlockUser}
                >
                  <MaterialCommunityIcons
                    name="account"
                    size={18}
                    color="white"
                  />
                  <Text style={[styles.modalOptionText, { color: "white" }]}>
                    Follow User
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={handleBlockUser}
                >
                  <MaterialCommunityIcons
                    name={"block-helper"}
                    size={18}
                    color="#ff4d4d"
                  />
                  <Text style={[styles.modalOptionText, { color: "#ff4d4d" }]}>
                    Block User
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={handleReportComment}
                >
                  <Ionicons
                    name="alert-circle-outline"
                    size={18}
                    color="#ffb300"
                  />
                  <Text style={[styles.modalOptionText, { color: "#ffb300" }]}>
                    Report Comment
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
