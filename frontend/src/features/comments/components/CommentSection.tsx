import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useComments } from "@/features/comments/hooks/useComment";
import { CommentItemRow } from "./CommentItemRow";
import { CommentInput } from "./CommentInput";
import { IComment } from "../types";
import { styles } from "../styles/commentStyles";

interface CommentSectionProps {
  postId: string;
  currentUserId: string;
  postAuthorId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  currentUserId,
  postAuthorId,
}) => {
  const {
    comments,
    repliesMap,
    isLoading,
    hasMoreRepliesMap,
    fetchMainComments,
    fetchNextReplies,
    addComment,
    toggleLike,
    removeComment,
    editComment,
  } = useComments(postId);

  const [replyTarget, setReplyTarget] = useState<IComment | null>(null);

  useEffect(() => {
    fetchMainComments(1);
  }, [postId]);

  const handleCommentSubmit = (text: string) => {
    if (replyTarget) {
      const actualParentId = replyTarget.parentId || replyTarget._id;
      addComment(text, actualParentId, replyTarget.user._id);
      setReplyTarget(null);
    } else {
      addComment(text, null, null);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screenContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {isLoading && comments.length === 0 ? (
        <View style={styles.centerSpinner}>
          <ActivityIndicator size="small" color="#99CC33" />
        </View>
      ) : (
        <FlatList
          data={comments}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <CommentItemRow
              item={item}
              replies={repliesMap[item._id]}
              currentUserId={currentUserId}
              postAuthorId={postAuthorId}
              hasMoreReplies={hasMoreRepliesMap[item._id] || false}
              onLike={(id, isRep) => toggleLike(id, isRep, currentUserId)}
              onDelete={removeComment}
              onLoadReplies={fetchNextReplies}
              onSelectReplyTarget={(target) => setReplyTarget(target)}
              onEdit={editComment}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyView}>
              <Text style={styles.emptyText}>
                Be the first to share your thoughts! 🌿
              </Text>
            </View>
          }
          contentContainerStyle={styles.listContentSpace}
        />
      )}

      <CommentInput
        replyTarget={replyTarget}
        onClearReplyTarget={() => setReplyTarget(null)}
        onSubmit={handleCommentSubmit}
      />
    </KeyboardAvoidingView>
  );
};
