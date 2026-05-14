export interface INutrition {
  label: string;
  value: string;
}

export interface IBenefit {
  label: string;
  value?: string;
}

export interface IUser {
  _id: string;
  name: string;
  profilePicture?: string;
}

export interface IPost {
  _id: string;
  title: string;
  prepTime: string;
  instructions: string;
  ingredients: string[];
  nutritionList: INutrition[];
  benefitsList: IBenefit[];
  mediaUrls: string[];
  user: IUser;
  createdAt: string;
}
