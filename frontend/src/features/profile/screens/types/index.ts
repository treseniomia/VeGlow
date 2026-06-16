export interface UserPost {
  _id: string;
  mediaUrls: string[];
  title: string;
}

export interface UserReel {
  _id: string;
  videoUrl: string;
  title: string;
  user?: {
    _id: string;
    name: string;
  };
}
