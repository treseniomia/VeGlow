import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  prepTime: string;
  instructions: string;
  ingredients: string[];
  nutritionList: { label: string; value: string }[];
  mediaUrl?: string;
  createdAt: Date;
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
    mediaUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model<IPost>("Post", PostSchema);
