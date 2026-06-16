import React, { useState, useEffect, useCallback, memo, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/useAuthStore";
import { useReelCommentStore } from "@/services/useReelCommentStore";
import {
  IReelComment,
  IReelReply,
} from "@/features/reels/types/reelComment.types";

interface ReelCommentsBottomSheetProps {
  visible: boolean;
  reelId: string;
  onClose: () => void;
}

interface CommentItemProps {
  comment: IReelComment;
  isReply: boolean;
  isAuthor: boolean;
  reelUserId: string;
  onToggleLike: (commentId: string) => void;
  onToggleReplyLike: (commentId: string, replyId: string) => void;
  onReply: (
    commentId: string,
    userName: string,
    replyingToUserId?: string,
  ) => void;
  onStartEdit: (comment: IReelComment) => void;
  onDelete: (commentId: string) => void;
  onDeleteReply: (commentId: string, replyId: string) => void;
  onEditReply: (commentId: string, replyId: string, replyText: string) => void;
}

const formatTimestamp = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
  return date.toLocaleDateString();
};

const renderCommentText = (text: string): React.ReactNode => {
  const parts = text.split(/(@\w+)/g);
  return parts.map((part, index) => {
    if (part.startsWith("@")) {
      return (
        <Text key={index} style={styles.mentionText}>
          {part}
        </Text>
      );
    }
    return <Text key={index}>{part}</Text>;
  });
};

const CommentItem = memo<CommentItemProps>(
  ({
    comment,
    isReply,
    isAuthor,
    reelUserId,
    onToggleLike,
    onToggleReplyLike,
    onReply,
    onStartEdit,
    onDelete,
    onDeleteReply,
    onEditReply,
  }) => {
    const { user } = useAuthStore();
    const hasReplies = comment.repliesCount > 0;
    const isReelAuthor = comment.user._id === reelUserId;

    return (
      <View style={[styles.commentContainer, isReply && styles.replyContainer]}>
        {isReply && <View style={styles.leafIndicator} />}
        <View style={styles.commentHeader}>
          <View style={styles.userInfo}>
            {comment.user.profilePicture ? (
              <Image
                source={{ uri: comment.user.profilePicture }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {comment.user.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.userDetails}>
              <View style={styles.userNameRow}>
                <Text style={styles.userName}>{comment.user.name}</Text>
                {isReelAuthor && (
                  <View style={styles.authorBadge}>
                    <Text style={styles.authorBadgeText}>AUTHOR</Text>
                  </View>
                )}
              </View>
              <Text style={styles.timestamp}>
                {formatTimestamp(comment.createdAt)}
              </Text>
            </View>
          </View>

          {isAuthor && (
            <View style={styles.commentActions}>
              <TouchableOpacity
                onPress={() => onStartEdit(comment)}
                style={styles.actionButton}
              >
                <Ionicons name="create-outline" size={18} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onDelete(comment._id)}
                style={styles.actionButton}
              >
                <Ionicons name="trash-outline" size={18} color="#FF3040" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={styles.commentText}>
          {renderCommentText(comment.text)}
        </Text>

        <View style={styles.commentFooter}>
          <TouchableOpacity
            onPress={() => onToggleLike(comment._id)}
            style={styles.likeButton}
          >
            <View style={{ transform: [{ scaleX: -1 }] }}>
              <Ionicons
                name={
                  comment.likes.includes(user?._id || "")
                    ? "leaf"
                    : "leaf-outline"
                }
                size={isReply ? 16 : 18}
                color={
                  comment.likes.includes(user?._id || "")
                    ? "#99CC33"
                    : "rgba(255,255,255,0.4)"
                }
              />
            </View>
            <Text style={styles.likeCount}>
              {comment.likesCount ?? comment.likes.length}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onReply(comment._id, comment.user.name)}
            style={styles.replyButton}
          >
            <Text style={styles.replyButtonText}>Reply</Text>
          </TouchableOpacity>
        </View>

        {/* Render replies sequentially (flat UI) */}
        {hasReplies &&
          comment.replies.map((reply) => (
            <ReplyItem
              key={reply._id}
              reply={reply}
              commentId={comment._id}
              reelUserId={reelUserId}
              onToggleReplyLike={onToggleReplyLike}
              onReply={onReply}
              onDeleteReply={onDeleteReply}
              onEditReply={onEditReply}
            />
          ))}
      </View>
    );
  },
);

interface ReplyItemProps {
  reply: IReelReply;
  commentId: string;
  reelUserId: string;
  onToggleReplyLike: (commentId: string, replyId: string) => void;
  onReply: (
    commentId: string,
    userName: string,
    replyingToUserId?: string,
  ) => void;
  onDeleteReply: (commentId: string, replyId: string) => void;
  onEditReply: (commentId: string, replyId: string, replyText: string) => void;
}

const ReplyItem = memo<ReplyItemProps>(
  ({
    reply,
    commentId,
    reelUserId,
    onToggleReplyLike,
    onReply,
    onDeleteReply,
    onEditReply,
  }) => {
    const { user } = useAuthStore();
    const isAuthor = user?._id === reply.user._id;
    const isReplyAuthor = reply.user._id === reelUserId;

    return (
      <View style={styles.replyContainer}>
        <View style={styles.leafIndicator} />
        <View style={styles.commentHeader}>
          <View style={styles.userInfo}>
            {reply.user.profilePicture ? (
              <Image
                source={{ uri: reply.user.profilePicture }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {reply.user.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.userDetails}>
              <View style={styles.userNameRow}>
                <Text style={styles.userName}>{reply.user.name}</Text>
                {isReplyAuthor && (
                  <View style={styles.authorBadge}>
                    <Text style={styles.authorBadgeText}>AUTHOR</Text>
                  </View>
                )}
              </View>
              <Text style={styles.timestamp}>
                {formatTimestamp(reply.createdAt)}
              </Text>
            </View>
          </View>

          {isAuthor && (
            <View style={styles.commentActions}>
              <TouchableOpacity
                onPress={() => onEditReply(commentId, reply._id, reply.text)}
                style={styles.actionButton}
              >
                <Ionicons name="create-outline" size={16} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onDeleteReply(commentId, reply._id)}
                style={styles.actionButton}
              >
                <Ionicons name="trash-outline" size={16} color="#FF3040" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={styles.commentText}>{renderCommentText(reply.text)}</Text>

        <View style={styles.commentFooter}>
          <TouchableOpacity
            onPress={() => onToggleReplyLike(commentId, reply._id)}
            style={styles.likeButton}
          >
            <View style={{ transform: [{ scaleX: -1 }] }}>
              <Ionicons
                name={
                  reply.likes.includes(user?._id || "")
                    ? "leaf"
                    : "leaf-outline"
                }
                size={16}
                color={
                  reply.likes.includes(user?._id || "")
                    ? "#99CC33"
                    : "rgba(255,255,255,0.4)"
                }
              />
            </View>
            <Text style={styles.likeCount}>{reply.likesCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onReply(commentId, reply.user.name, reply.user._id)}
            style={styles.replyButton}
          >
            <Text style={styles.replyButtonText}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);

CommentItem.displayName = "CommentItem";

export const ReelCommentsBottomSheet: React.FC<
  ReelCommentsBottomSheetProps
> = ({ visible, reelId, onClose }) => {
  const { user } = useAuthStore();
  const inputRef = useRef<TextInput>(null);
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState<{
    commentId: string;
    userName: string;
  } | null>(null);
  const [editingComment, setEditingComment] = useState<{
    commentId: string;
    text: string;
  } | null>(null);
  const [editingReply, setEditingReply] = useState<{
    commentId: string;
    replyId: string;
    text: string;
  } | null>(null);

  const {
    comments,
    loading,
    fetchComments,
    createComment,
    createReply,
    updateComment,
    updateReply,
    deleteComment,
    deleteReply,
    toggleCommentLike,
    toggleReplyLike,
    getReelUserId,
  } = useReelCommentStore();

  useEffect(() => {
    if (visible && reelId) {
      fetchComments(reelId);
    }
  }, [visible, reelId, fetchComments]);

  useEffect(() => {
    if (replyTo || editingComment || editingReply) {
      inputRef.current?.focus();
    }
  }, [replyTo, editingComment, editingReply]);

  const handlePostComment = useCallback(async () => {
    if (!user?._id) {
      Alert.alert("Authentication Required", "Please log in to comment.");
      return;
    }

    if (!commentText.trim()) {
      Alert.alert("Error", "Comment cannot be empty.");
      return;
    }

    try {
      if (editingReply) {
        // This is editing a reply
        await updateReply(editingReply.commentId, editingReply.replyId, {
          text: commentText.trim(),
        });
        setEditingReply(null);
        setCommentText("");
      } else if (replyTo) {
        // This is a reply
        await createReply({
          commentId: replyTo.commentId,
          text: commentText.trim(),
          replyingToUserId: replyTo.commentId ? user._id : undefined,
        });
        setCommentText("");
        setReplyTo(null);
      } else if (editingComment) {
        // This is editing a comment
        await updateComment(editingComment.commentId, {
          text: commentText.trim(),
        });
        setEditingComment(null);
        setCommentText("");
      } else {
        // This is a main comment
        await createComment({
          reelId,
          text: commentText.trim(),
        });
        setCommentText("");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  }, [
    user?._id,
    commentText,
    reelId,
    replyTo,
    editingComment,
    editingReply,
    createComment,
    createReply,
    updateComment,
    updateReply,
  ]);

  const handleEditComment = useCallback(async () => {
    if (!editingComment || !commentText.trim()) {
      return;
    }

    try {
      await updateComment(editingComment.commentId, {
        text: commentText.trim(),
      });
      setEditingComment(null);
      setCommentText("");
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  }, [editingComment, commentText, updateComment]);

  const handleDeleteComment = useCallback(
    (commentId: string) => {
      Alert.alert(
        "Delete Comment",
        "Are you sure you want to delete this comment?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => deleteComment(commentId, reelId),
          },
        ],
      );
    },
    [deleteComment, reelId],
  );

  const handleDeleteReply = useCallback(
    (commentId: string, replyId: string) => {
      Alert.alert(
        "Delete Reply",
        "Are you sure you want to delete this reply?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => deleteReply(commentId, replyId, reelId),
          },
        ],
      );
    },
    [deleteReply, reelId],
  );

  const handleReply = useCallback(
    (commentId: string, userName: string, replyingToUserId?: string) => {
      setReplyTo({ commentId, userName });
      setCommentText(`@${userName} `);
      setEditingComment(null);
      setEditingReply(null);
    },
    [],
  );

  const handleEditReply = useCallback(
    (commentId: string, replyId: string, replyText: string) => {
      setEditingReply({ commentId, replyId, text: replyText });
      setCommentText(replyText);
      setReplyTo(null);
      setEditingComment(null);
    },
    [],
  );

  const handleStartEdit = useCallback((comment: IReelComment) => {
    setEditingComment({ commentId: comment._id, text: comment.text });
    setCommentText(comment.text);
    setReplyTo(null);
    setEditingReply(null);
  }, []);

  const reelComments = comments[reelId] || [];
  const isLoading = loading[`comments_${reelId}`];

  const renderItem = useCallback(
    ({ item }: { item: IReelComment }) => (
      <CommentItem
        comment={item}
        isReply={false}
        isAuthor={user?._id === item.user._id}
        reelUserId={getReelUserId(reelId) || ""}
        onToggleLike={toggleCommentLike}
        onToggleReplyLike={toggleReplyLike}
        onReply={handleReply}
        onStartEdit={handleStartEdit}
        onDelete={handleDeleteComment}
        onDeleteReply={handleDeleteReply}
        onEditReply={handleEditReply}
      />
    ),
    [
      user?._id,
      getReelUserId,
      reelId,
      toggleCommentLike,
      toggleReplyLike,
      handleReply,
      handleStartEdit,
      handleDeleteComment,
      handleDeleteReply,
      handleEditReply,
    ],
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.overlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.title}>Comments</Text>
              <View style={styles.placeholder} />
            </View>

            <FlatList
              style={styles.commentsList}
              data={reelComments}
              keyExtractor={(item) => item._id}
              renderItem={renderItem}
              removeClippedSubviews={true}
              initialNumToRender={10}
              maxToRenderPerBatch={5}
              windowSize={10}
              ListEmptyComponent={
                isLoading ? (
                  <ActivityIndicator
                    color="#4CAF50"
                    style={styles.loadingIndicator}
                  />
                ) : (
                  <View style={styles.emptyState}>
                    <Ionicons
                      name="chatbubble-outline"
                      size={48}
                      color="#666"
                    />
                    <Text style={styles.emptyText}>No comments yet</Text>
                    <Text style={styles.emptySubtext}>
                      Be the first to comment!
                    </Text>
                  </View>
                )
              }
            />

            <View style={styles.inputSection}>
              {replyTo && (
                <View style={styles.replyToBar}>
                  <Text style={styles.replyToText}>
                    Replying to{" "}
                    <Text style={styles.replyToUser}>{replyTo.userName}</Text>
                  </Text>
                  <TouchableOpacity onPress={() => setReplyTo(null)}>
                    <Ionicons name="close-circle" size={20} color="#FFF" />
                  </TouchableOpacity>
                </View>
              )}

              {editingComment && (
                <View style={styles.editingBar}>
                  <Text style={styles.editingText}>Editing comment</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setEditingComment(null);
                      setCommentText("");
                    }}
                  >
                    <Ionicons name="close-circle" size={20} color="#FFF" />
                  </TouchableOpacity>
                </View>
              )}

              {editingReply && (
                <View style={styles.editingBar}>
                  <Text style={styles.editingText}>Editing reply</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setEditingReply(null);
                      setCommentText("");
                    }}
                  >
                    <Ionicons name="close-circle" size={20} color="#FFF" />
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.inputContainer}>
                <TextInput
                  ref={inputRef}
                  style={styles.input}
                  placeholder="Add a comment..."
                  placeholderTextColor="#999"
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                  maxLength={500}
                />
                <TouchableOpacity
                  onPress={
                    editingComment ? handleEditComment : handlePostComment
                  }
                  style={styles.postButton}
                  disabled={!commentText.trim()}
                >
                  <Text
                    style={[
                      styles.postButtonText,
                      !commentText.trim() && styles.postButtonDisabled,
                    ]}
                  >
                    {editingComment ? "Update" : "Post"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    minHeight: "50%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
  },
  placeholder: {
    width: 32,
  },
  commentsList: {
    flex: 1,
    padding: 16,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#FFF",
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
  commentContainer: {
    marginBottom: 16,
  },
  replyContainer: {
    marginLeft: 24,
    marginTop: 12,
    paddingLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: "#4CAF50",
    backgroundColor: "rgba(76, 175, 80, 0.05)",
    padding: 12,
    borderRadius: 8,
    position: "relative",
  },
  leafIndicator: {
    position: "absolute",
    left: -2,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: "#4CAF50",
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  avatarText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  userDetails: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
  },
  authorBadge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  authorBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 0.5,
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
  },
  commentActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  commentText: {
    fontSize: 14,
    color: "#FFF",
    lineHeight: 20,
    marginBottom: 8,
  },
  mentionText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "600",
  },
  commentFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  likeCount: {
    fontSize: 12,
    color: "#FFF",
  },
  replyButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderRadius: 12,
  },
  replyButtonText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
  },
  viewRepliesButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderRadius: 12,
  },
  viewRepliesText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
  },
  repliesSection: {
    marginTop: 8,
  },
  inputSection: {
    borderTopWidth: 1,
    borderTopColor: "#333",
    padding: 16,
  },
  replyToBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  replyToText: {
    fontSize: 12,
    color: "#FFF",
  },
  replyToUser: {
    fontWeight: "600",
    color: "#4CAF50",
  },
  editingBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  editingText: {
    fontSize: 12,
    color: "#4CAF50",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#2A2A2A",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#FFF",
    fontSize: 14,
    maxHeight: 100,
  },
  postButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#4CAF50",
    borderRadius: 20,
  },
  postButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
});
