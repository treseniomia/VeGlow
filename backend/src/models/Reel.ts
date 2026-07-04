import { Schema, model, Document } from "mongoose";

export interface IReelSchema extends Document {
  user: Schema.Types.ObjectId;
  videoUrl: string;
  title: string;
  description: string;
  likes: Schema.Types.ObjectId[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReelSchema = new Schema<IReelSchema>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User association is required."],
    },
    videoUrl: {
      type: String,
      required: [true, "Video URL is required for a reel."],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Recipe title is required."],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters."],
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters."],
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    sharesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// DB Optimization: Indexing frequently queried paths
ReelSchema.index({ createdAt: -1 });
ReelSchema.index({ user: 1 });

export const Reel = model<IReelSchema>("Reel", ReelSchema);
