import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  prepTime: string;
  instructions: string;
  ingredients: string[];
  nutritionList: { label: string; value: string }[];
  benefitsList: { label: string; value: string }[];
  mediaUrls: string[];
  likesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    prepTime: { type: String, required: true },
    instructions: { type: String, required: true },
    ingredients: [{ type: String }],
    nutritionList: [
      {
        label: { type: String },
        value: { type: String },
      },
    ],

    benefitsList: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    mediaUrls: [{ type: String, default: [] }],

    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model<IPost>("Post", PostSchema);
