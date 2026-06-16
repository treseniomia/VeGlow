import { create } from "zustand";
import { Alert } from "react-native";
import { reelCommentService } from "@/features/reels/service/reelComment.service";
import { useAuthStore } from "@/store/useAuthStore";
import {
  IReelComment,
  IReelCommentCreatePayload,
  IReelReplyCreatePayload,
  IReelCommentUpdatePayload,
} from "@/features/reels/types/reelComment.types";

interface ReelCommentState {
  comments: Record<string, IReelComment[]>; // reelId -> comments array
  reelUserIds: Record<string, string | undefined>; // reelId -> reel creator userId
  loading: Record<string, boolean>;
  error: string | null;
  likingComments: Set<string>; // Track comments currently being liked to prevent double-taps

  fetchComments: (reelId: string, page?: number) => Promise<void>;
  createComment: (payload: IReelCommentCreatePayload) => Promise<void>;
  createReply: (payload: IReelReplyCreatePayload) => Promise<void>;
  updateComment: (
    commentId: string,
    payload: IReelCommentUpdatePayload,
  ) => Promise<void>;
  updateReply: (
    commentId: string,
    replyId: string,
    payload: IReelCommentUpdatePayload,
  ) => Promise<void>;
  deleteComment: (commentId: string, reelId: string) => Promise<void>;
  deleteReply: (
    commentId: string,
    replyId: string,
    reelId: string,
  ) => Promise<void>;
  toggleCommentLike: (commentId: string) => Promise<void>;
  toggleReplyLike: (commentId: string, replyId: string) => Promise<void>;
  clearComments: (reelId: string) => void;
  getReelUserId: (reelId: string) => string | undefined;
}

export const useReelCommentStore = create<ReelCommentState>((set, get) => ({
  comments: {},
  reelUserIds: {},
  loading: {},
  error: null,
  likingComments: new Set<string>(),

  fetchComments: async (reelId: string, page: number = 1) => {
    try {
      set((state) => ({
        loading: { ...state.loading, [`comments_${reelId}`]: true },
        error: null,
      }));

      const response = await reelCommentService.getMainComments(reelId, page);

      set((state) => ({
        comments: {
          ...state.comments,
          [reelId]:
            page === 1
              ? response.data
              : [...(state.comments[reelId] || []), ...response.data],
        },
        reelUserIds: {
          ...state.reelUserIds,
          [reelId]: response.reelUserId,
        },
        loading: { ...state.loading, [`comments_${reelId}`]: false },
      }));
    } catch (error: any) {
      console.error("Error fetching reel comments:", error);
      set((state) => ({
        error: error.message || "Failed to fetch comments",
        loading: { ...state.loading, [`comments_${reelId}`]: false },
      }));
    }
  },

  createComment: async (payload: IReelCommentCreatePayload) => {
    const { reelId } = payload;
    const previousComments = get().comments[reelId] || [];

    // Optimistic update
    const user = useAuthStore.getState().user;
    const tempComment: IReelComment = {
      _id: `temp_${Date.now()}`,
      reel: reelId,
      user: {
        _id: user?._id || "temp",
        name: user?.name || "You",
        profilePicture: user?.profilePicture || "",
      },
      text: payload.text,
      likes: [],
      likesCount: 0,
      repliesCount: 0,
      replies: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      comments: {
        ...state.comments,
        [reelId]: [tempComment, ...(state.comments[reelId] || [])],
      },
    }));

    try {
      const response = await reelCommentService.createComment(payload);

      // Replace temp comment with real comment
      set((state) => ({
        comments: {
          ...state.comments,
          [reelId]: state.comments[reelId]?.map((comment) =>
            comment._id === tempComment._id ? response.data : comment,
          ) || [response.data],
        },
      }));
    } catch (error: any) {
      console.error("Error creating reel comment:", error);

      // Rollback on error
      set((state) => ({
        comments: {
          ...state.comments,
          [reelId]: previousComments,
        },
      }));

      Alert.alert("Error", "Failed to post comment. Please try again.");
    }
  },

  createReply: async (payload: IReelReplyCreatePayload) => {
    const { commentId } = payload;
    const previousComments = { ...get().comments };

    // Optimistic update
    const user = useAuthStore.getState().user;
    const tempReply = {
      _id: `temp_${Date.now()}`,
      user: {
        _id: user?._id || "temp",
        name: user?.name || "You",
        profilePicture: user?.profilePicture || "",
      },
      text: payload.text,
      replyingToUserId: payload.replyingToUserId
        ? { _id: payload.replyingToUserId, name: "User", profilePicture: "" }
        : null,
      parentReplyId: payload.parentReplyId || null,
      likes: [],
      likesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      comments: Object.fromEntries(
        Object.entries(state.comments).map(([reelId, comments]) => [
          reelId,
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  replies: [...comment.replies, tempReply],
                  repliesCount: comment.repliesCount + 1,
                }
              : comment,
          ),
        ]),
      ),
    }));

    try {
      const response = await reelCommentService.createReply(payload);

      // Replace temp reply with real reply
      set((state) => ({
        comments: Object.fromEntries(
          Object.entries(state.comments).map(([reelId, comments]) => [
            reelId,
            comments.map((comment) =>
              comment._id === commentId
                ? {
                    ...comment,
                    replies: comment.replies.map((reply) =>
                      reply._id === tempReply._id
                        ? response.data.replies[
                            response.data.replies.length - 1
                          ]
                        : reply,
                    ),
                  }
                : comment,
            ),
          ]),
        ),
      }));
    } catch (error: any) {
      console.error("Error creating reel reply:", error);

      // Rollback on error
      set({ comments: previousComments });
      Alert.alert("Error", "Failed to post reply. Please try again.");
    }
  },

  updateComment: async (
    commentId: string,
    payload: IReelCommentUpdatePayload,
  ) => {
    const state = get();
    const previousComments = { ...state.comments };

    // Optimistic update
    const updateCommentInArray = (comments: IReelComment[]): IReelComment[] =>
      comments.map((comment) =>
        comment._id === commentId
          ? {
              ...comment,
              text: payload.text,
              updatedAt: new Date().toISOString(),
            }
          : comment,
      );

    set((state) => ({
      comments: Object.fromEntries(
        Object.entries(state.comments).map(([reelId, comments]) => [
          reelId,
          updateCommentInArray(comments),
        ]),
      ),
    }));

    try {
      const response = await reelCommentService.updateComment(
        commentId,
        payload,
      );

      // Update with server response
      const updateWithServerData = (comments: IReelComment[]): IReelComment[] =>
        comments.map((comment) =>
          comment._id === commentId ? response.data : comment,
        );

      set((state) => ({
        comments: Object.fromEntries(
          Object.entries(state.comments).map(([reelId, comments]) => [
            reelId,
            updateWithServerData(comments),
          ]),
        ),
      }));
    } catch (error: any) {
      console.error("Error updating reel comment:", error);

      // Rollback on error
      set({ comments: previousComments });
      Alert.alert("Error", "Failed to update comment. Please try again.");
    }
  },

  updateReply: async (
    commentId: string,
    replyId: string,
    payload: IReelCommentUpdatePayload,
  ) => {
    const previousComments = { ...get().comments };

    // Optimistic update
    const updateReplyInArray = (comments: IReelComment[]): IReelComment[] =>
      comments.map((comment) =>
        comment._id === commentId
          ? {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply._id === replyId
                  ? {
                      ...reply,
                      text: payload.text,
                      updatedAt: new Date().toISOString(),
                    }
                  : reply,
              ),
            }
          : comment,
      );

    set((state) => ({
      comments: Object.fromEntries(
        Object.entries(state.comments).map(([reelId, comments]) => [
          reelId,
          updateReplyInArray(comments),
        ]),
      ),
    }));

    try {
      const response = await reelCommentService.updateReply(
        commentId,
        replyId,
        payload,
      );

      // Update with server response
      const updateWithServerData = (comments: IReelComment[]): IReelComment[] =>
        comments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply._id === replyId ? response.data : reply,
                ),
              }
            : comment,
        );

      set((state) => ({
        comments: Object.fromEntries(
          Object.entries(state.comments).map(([reelId, comments]) => [
            reelId,
            updateWithServerData(comments),
          ]),
        ),
      }));
    } catch (error: any) {
      console.error("Error updating reel reply:", error);

      // Rollback on error
      set({ comments: previousComments });
      Alert.alert("Error", "Failed to update reply. Please try again.");
    }
  },

  deleteComment: async (commentId: string, reelId: string) => {
    const previousComments = { ...get().comments };

    // Optimistic update
    set((state) => ({
      comments: {
        ...state.comments,
        [reelId]:
          state.comments[reelId]?.filter(
            (comment) => comment._id !== commentId,
          ) || [],
      },
    }));

    try {
      await reelCommentService.deleteComment(commentId);
    } catch (error: any) {
      console.error("Error deleting reel comment:", error);

      // Rollback on error
      set({ comments: previousComments });
      Alert.alert("Error", "Failed to delete comment. Please try again.");
    }
  },

  deleteReply: async (commentId: string, replyId: string, reelId: string) => {
    const previousComments = { ...get().comments };

    // Optimistic update
    set((state) => ({
      comments: Object.fromEntries(
        Object.entries(state.comments).map(([rId, comments]) => [
          rId,
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  replies: comment.replies.filter(
                    (reply) => reply._id !== replyId,
                  ),
                  repliesCount: Math.max(0, comment.repliesCount - 1),
                }
              : comment,
          ),
        ]),
      ),
    }));

    try {
      await reelCommentService.deleteReply(commentId, replyId);
    } catch (error: any) {
      console.error("Error deleting reel reply:", error);

      // Rollback on error
      set({ comments: previousComments });
      Alert.alert("Error", "Failed to delete reply. Please try again.");
    }
  },

  toggleCommentLike: async (commentId: string) => {
    const user = useAuthStore.getState().user;
    const userId = user?._id;

    if (!userId) {
      Alert.alert("Error", "You must be logged in to like comments.");
      return;
    }

    // Prevent double-tap on the same comment
    if (get().likingComments.has(commentId)) {
      return;
    }

    // Add to liking set to prevent double-tap
    set((state) => ({
      likingComments: new Set(state.likingComments).add(commentId),
    }));

    const previousComments = { ...get().comments };

    // Find comment and toggle like optimistically
    const toggleLikeInArray = (comments: IReelComment[]): IReelComment[] =>
      comments.map((comment) => {
        if (comment._id === commentId) {
          const isLiked = comment.likes.includes(userId);
          const updatedLikes = isLiked
            ? comment.likes.filter((id) => id !== userId)
            : [...comment.likes, userId];
          return {
            ...comment,
            likes: updatedLikes,
            likesCount: updatedLikes.length, // Use array length to match database logic
          };
        }
        return comment;
      });

    set((state) => ({
      comments: Object.fromEntries(
        Object.entries(state.comments).map(([reelId, comments]) => [
          reelId,
          toggleLikeInArray(comments),
        ]),
      ),
    }));

    try {
      const response = await reelCommentService.toggleCommentLike(commentId);

      // Update with server response - use array length to match database logic
      const updateWithServerData = (comments: IReelComment[]): IReelComment[] =>
        comments.map((comment) => {
          if (comment._id === commentId) {
            const isLiked = comment.likes.includes(userId);
            const updatedLikes = isLiked
              ? comment.likes.filter((id) => id !== userId)
              : [...comment.likes, userId];
            return {
              ...comment,
              likes: updatedLikes,
              likesCount: updatedLikes.length, // Use array length to match database logic
            };
          }
          return comment;
        });

      set((state) => {
        const newLikingComments = new Set(state.likingComments);
        newLikingComments.delete(commentId);
        return {
          comments: Object.fromEntries(
            Object.entries(state.comments).map(([reelId, comments]) => [
              reelId,
              updateWithServerData(comments),
            ]),
          ),
          likingComments: newLikingComments,
        };
      });
    } catch (error: any) {
      console.error("Error toggling reel comment like:", error);

      // Rollback on error
      set((state) => {
        const newLikingComments = new Set(state.likingComments);
        newLikingComments.delete(commentId);
        return {
          comments: previousComments,
          likingComments: newLikingComments,
        };
      });
    }
  },

  toggleReplyLike: async (commentId: string, replyId: string) => {
    const user = useAuthStore.getState().user;
    const userId = user?._id;

    if (!userId) {
      Alert.alert("Error", "You must be logged in to like replies.");
      return;
    }

    const likeKey = `${commentId}_${replyId}`;
    if (get().likingComments.has(likeKey)) {
      return;
    }

    set((state) => ({
      likingComments: new Set(state.likingComments).add(likeKey),
    }));

    const previousComments = { ...get().comments };

    const toggleReplyLikeInArray = (comments: IReelComment[]): IReelComment[] =>
      comments.map((comment) =>
        comment._id === commentId
          ? {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply._id === replyId
                  ? {
                      ...reply,
                      likes: reply.likes.includes(userId)
                        ? reply.likes.filter((id) => id !== userId)
                        : [...reply.likes, userId],
                      likesCount: reply.likes.includes(userId)
                        ? Math.max(0, reply.likesCount - 1)
                        : reply.likesCount + 1,
                    }
                  : reply,
              ),
            }
          : comment,
      );

    set((state) => ({
      comments: Object.fromEntries(
        Object.entries(state.comments).map(([reelId, comments]) => [
          reelId,
          toggleReplyLikeInArray(comments),
        ]),
      ),
    }));

    try {
      const response = await reelCommentService.toggleReplyLike(
        commentId,
        replyId,
      );

      set((state) => {
        const newLikingComments = new Set(state.likingComments);
        newLikingComments.delete(likeKey);
        return {
          comments: Object.fromEntries(
            Object.entries(state.comments).map(([reelId, comments]) => [
              reelId,
              comments.map((comment) =>
                comment._id === commentId
                  ? {
                      ...comment,
                      replies: comment.replies.map((reply) =>
                        reply._id === replyId
                          ? { ...reply, likesCount: response.likesCount }
                          : reply,
                      ),
                    }
                  : comment,
              ),
            ]),
          ),
          likingComments: newLikingComments,
        };
      });
    } catch (error: any) {
      console.error("Error toggling reel reply like:", error);
      set((state) => {
        const newLikingComments = new Set(state.likingComments);
        newLikingComments.delete(likeKey);
        return {
          comments: previousComments,
          likingComments: newLikingComments,
        };
      });
    }
  },

  clearComments: (reelId: string) => {
    set((state) => ({
      comments: { ...state.comments, [reelId]: [] },
    }));
  },

  getReelUserId: (reelId: string) => {
    return get().reelUserIds[reelId];
  },
}));
