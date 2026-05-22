import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IComment } from "../types";
import { CommentItemRow } from "./CommentItemRow";
import { styles } from "../styles/commentStyles";

interface ReplySectionProps {
  replies: IComment[];
  currentUserId: string;
  postAuthorId: string;
  parentId: string;
  hasMoreReplies: boolean;
  onLike: (commentId: string, isReply: boolean) => void;
  onDelete: (commentId: string, parentId: string | null) => void;
  onLoadMore: () => void;
  onSelectReplyTarget: (comment: IComment) => void;
  onEdit: (commentId: string, newText: string, parentId: string | null) => void;
}

export const ReplySection: React.FC<ReplySectionProps> = ({
  replies,
  currentUserId,
  postAuthorId,
  parentId,
  hasMoreReplies,
  onLike,
  onDelete,
  onLoadMore,
  onSelectReplyTarget,
  onEdit,
}) => {
  return (
    <View style={{ marginTop: 4 }}>
      {replies.map((reply) => (
        <CommentItemRow
          key={reply._id}
          item={reply}
          currentUserId={currentUserId}
          postAuthorId={postAuthorId}
          isReply={true}
          parentId={parentId}
          onLike={onLike}
          onDelete={onDelete}
          onSelectReplyTarget={() =>
            onSelectReplyTarget({ ...reply, parentId })
          }
          onEdit={onEdit}
        />
      ))}

      {hasMoreReplies && (
        <TouchableOpacity
          onPress={onLoadMore}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 64,
            paddingVertical: 8,
          }}
        >
          <View
            style={{
              width: 24,
              height: 1,
              backgroundColor: "rgba(255,255,255,0.6)",
              opacity: 0.3,
              marginRight: 8,
            }}
          />
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            Load more replies
          </Text>
          <Ionicons
            name="chevron-down"
            size={12}
            color="rgba(255,255,255,0.4)"
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
