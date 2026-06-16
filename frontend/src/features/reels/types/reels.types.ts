export interface IReel {
  _id: string;
  user: {
    _id: string;
    username: string;
    avatarUrl?: string;
  };
  videoUrl: string;
  title: string;
  description: string;
  likes: string[];
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReelFormData {
  videoUrl: string;
  title: string;
  description: string;
}

export interface ReelMediaItem {
  uri: string;
  type: "video";
  duration?: number;
}
