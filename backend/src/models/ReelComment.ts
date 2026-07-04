import { Schema, model, Document, models, Types } from "mongoose";

export interface IReply {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  text: string;
  replyingToUserId: Types.ObjectId | null;
  parentReplyId: Types.ObjectId | null;
  likes: Types.ObjectId[];
  likesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReelComment extends Document {
  reel: Types.ObjectId;
  user: Types.ObjectId;
  text: string;
  likes: Types.ObjectId[];
  likesCount: number;
  repliesCount: number;
  replies: IReply[];
  createdAt: Date;
  updatedAt: Date;
}

const replySchema = new Schema<IReply>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true, maxlength: 500 },
    replyingToUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    parentReplyId: { type: Schema.Types.ObjectId, default: null },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    likesCount: { type: Number, default: 0 },
  },
  { timestamps: true, _id: true },
);

const reelCommentSchema = new Schema<IReelComment>(
  {
    reel: { type: Schema.Types.ObjectId, ref: "Reel", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true, maxlength: 500 },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    likesCount: { type: Number, default: 0 },
    repliesCount: { type: Number, default: 0 },
    replies: [replySchema],
  },
  { timestamps: true },
);

reelCommentSchema.index({ reel: 1, createdAt: -1 });

export default model<IReelComment>("ReelComment", reelCommentSchema);
