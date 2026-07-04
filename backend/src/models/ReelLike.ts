import { Schema, model, Document, Types } from "mongoose";

export interface IReelLike extends Document {
  user: Types.ObjectId;
  reel: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ReelLikeSchema = new Schema<IReelLike>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reel: {
      type: Schema.Types.ObjectId,
      ref: "Reel",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ReelLikeSchema.index({ user: 1, reel: 1 }, { unique: true });

export const ReelLike = model<IReelLike>("ReelLike", ReelLikeSchema);
