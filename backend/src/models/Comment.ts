import { Schema, model, Document } from "mongoose";

export interface IComment extends Document {
  post: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  text: string;
  parentId: Schema.Types.ObjectId | null;
  replyToUser: Schema.Types.ObjectId | null;
  likes: Schema.Types.ObjectId[];
  likesCount: number;
}

const commentSchema = new Schema<IComment>(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true, maxlength: 500 },

    // Naka-null muna ito para sa Phase 1 (Single Comments)
    parentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
    replyToUser: { type: Schema.Types.ObjectId, ref: "User", default: null },

    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    likesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// I-index natin ang post at parentId para sa mabilisang lazy loading query performance
commentSchema.index({ post: 1, createdAt: -1 });

export default model<IComment>("Comment", commentSchema);
