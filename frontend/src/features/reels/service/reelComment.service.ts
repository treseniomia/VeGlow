import API from "@/api/api";
import {
  IReelComment,
  IReelCommentFeedResponse,
  IReelCommentLikeToggleResponse,
  IReelCommentCreatePayload,
  IReelReplyCreatePayload,
  IReelCommentUpdatePayload,
} from "../types/reelComment.types";

export const reelCommentService = {
  getMainComments: async (
    reelId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<IReelCommentFeedResponse> => {
    const response = await API.get(`/reels-interactions/${reelId}/comments`, {
      params: { page, limit },
    });
    return response.data;
  },

  getSubReplies: async (
    commentId: string,
    page: number = 1,
    limit: number = 5,
  ): Promise<IReelCommentFeedResponse> => {
    const response = await API.get(
      `/reels-interactions/comments/${commentId}/replies`,
      {
        params: { page, limit },
      },
    );
    return response.data;
  },

  createComment: async (
    payload: IReelCommentCreatePayload,
  ): Promise<{ success: boolean; data: IReelComment }> => {
    const response = await API.post(
      `/reels-interactions/${payload.reelId}/comments`,
      {
        text: payload.text,
      },
    );
    return response.data;
  },

  createReply: async (
    payload: IReelReplyCreatePayload,
  ): Promise<{ success: boolean; data: IReelComment }> => {
    const response = await API.post(
      `/reels-interactions/comments/${payload.commentId}/replies`,
      {
        text: payload.text,
        replyingToUserId: payload.replyingToUserId,
        parentReplyId: payload.parentReplyId,
      },
    );
    return response.data;
  },

  toggleCommentLike: async (
    commentId: string,
  ): Promise<IReelCommentLikeToggleResponse> => {
    const response = await API.post(
      `/reels-interactions/comments/${commentId}/like`,
    );
    return response.data;
  },

  toggleReplyLike: async (
    commentId: string,
    replyId: string,
  ): Promise<IReelCommentLikeToggleResponse> => {
    const response = await API.post(
      `/reels-interactions/comments/${commentId}/replies/${replyId}/like`,
    );
    return response.data;
  },

  unlikeComment: async (
    commentId: string,
  ): Promise<IReelCommentLikeToggleResponse> => {
    const response = await API.delete(
      `/reels-interactions/comments/${commentId}/like`,
    );
    return response.data;
  },

  deleteComment: async (
    commentId: string,
  ): Promise<{ success: boolean; message: string }> => {
    const response = await API.delete(
      `/reels-interactions/comments/${commentId}`,
    );
    return response.data;
  },

  deleteReply: async (
    commentId: string,
    replyId: string,
  ): Promise<{ success: boolean; data: IReelComment }> => {
    const response = await API.delete(
      `/reels-interactions/comments/${commentId}/replies/${replyId}`,
    );
    return response.data;
  },

  updateComment: async (
    commentId: string,
    payload: IReelCommentUpdatePayload,
  ): Promise<{ success: boolean; data: IReelComment }> => {
    const response = await API.put(
      `/reels-interactions/comments/${commentId}`,
      payload,
    );
    return response.data;
  },

  updateReply: async (
    commentId: string,
    replyId: string,
    payload: IReelCommentUpdatePayload,
  ): Promise<{ success: boolean; data: any }> => {
    const response = await API.patch(
      `/reels-interactions/comments/${commentId}/replies/${replyId}`,
      payload,
    );
    return response.data;
  },
};
