export interface IReelUserMinimal {
  _id: string;
  name: string;
  profilePicture?: string;
}

export interface IReelReply {
  _id: string;
  user: IReelUserMinimal;
  text: string;
  replyingToUserId: IReelUserMinimal | null;
  parentReplyId: string | null;
  likes: string[];
  likesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IReelComment {
  _id: string;
  reel: string;
  user: IReelUserMinimal;
  text: string;
  likes: string[];
  likesCount: number;
  repliesCount: number;
  replies: IReelReply[];
  createdAt: string;
  updatedAt: string;
}

export interface IReelCommentFeedResponse {
  success: boolean;
  data: IReelComment[];
  reelUserId?: string;
  currentPage: number;
  hasMore: boolean;
}

export interface IReelCommentLikeToggleResponse {
  success: boolean;
  isLiked: boolean;
  likesCount: number;
}

export interface IReelCommentCreatePayload {
  reelId: string;
  text: string;
}

export interface IReelReplyCreatePayload {
  commentId: string;
  text: string;
  replyingToUserId?: string | null;
  parentReplyId?: string | null;
}

export interface IReelCommentUpdatePayload {
  text: string;
}
