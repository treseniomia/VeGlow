export interface IUserMinimal {
  _id: string;
  name: string;
  profilePicture?: string;
}

export interface IComment {
  _id: string;
  post: string;
  user: IUserMinimal;
  text: string;
  parentId: string | null;
  replyToUser: IUserMinimal | null;
  likes: string[];
  likesCount: number;
  repliesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICommentFeedResponse {
  success: boolean;
  data: IComment[];
  currentPage: number;
  hasMore: boolean;
}

export interface ILikeToggleResponse {
  success: boolean;
  isLiked: boolean;
  likesCount: number;
}
