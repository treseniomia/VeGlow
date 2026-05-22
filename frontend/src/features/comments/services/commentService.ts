import API from "@/api/api";
import {
  IComment,
  ICommentFeedResponse,
  ILikeToggleResponse,
} from "@/features/comments/types/index";

export const getMainComments = async (
  postId: string,
  page: number = 1,
  limit: number = 10
): Promise<ICommentFeedResponse> => {
  const response = await API.get(`/comments/post/${postId}`, {
    params: { page, limit },
  });
  return response.data;
};

export const getSubReplies = async (
  commentId: string,
  page: number = 1,
  limit: number = 5
): Promise<ICommentFeedResponse> => {
  const response = await API.get(`/comments/${commentId}/replies`, {
    params: { page, limit },
  });
  return response.data;
};

export const createComment = async (payload: {
  postId: string;
  text: string;
  parentId?: string | null;
  replyToUser?: string | null;
}): Promise<{ success: boolean; data: IComment }> => {
  const response = await API.post("/comments", payload);
  return response.data;
};

export const toggleCommentLike = async (
  commentId: string
): Promise<ILikeToggleResponse> => {
  const response = await API.post(`/comments/${commentId}/like`);
  return response.data;
};

export const deleteComment = async (
  commentId: string
): Promise<{ success: boolean; message: string }> => {
  const response = await API.delete(`/comments/${commentId}`);
  return response.data;
};

export const updateComment = async (
  commentId: string,
  text: string
): Promise<{ success: boolean; data: IComment }> => {
  const response = await API.put(`/comments/${commentId}`, { text });
  return response.data;
};
