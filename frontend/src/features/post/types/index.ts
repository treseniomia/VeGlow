export interface PostFormData {
  title: string;
  prepTime: string;
  instructions: string;
  ingredients: string;
  calories: string;
  protein: string;
  media: MediaItem[];
}

export interface MediaItem {
  uri: string;
  type: "image" | "video";
}
