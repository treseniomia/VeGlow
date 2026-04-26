export interface PostFormData {
  title: string;
  prepTime: string;
  instructions: string;
  ingredients: string;
  nutritionList: { label: string; value: string }[];
  media: MediaItem[];
}

export interface MediaItem {
  uri: string;
  type: "image" | "video";
}
