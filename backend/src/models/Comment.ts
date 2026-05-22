import { Schema, model, Document, models } from "mongoose";

export interface IComment extends Document {
  post: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  text: string;
  parentId: Schema.Types.ObjectId | null;
  replyToUser: Schema.Types.ObjectId | null;
  likes: Schema.Types.ObjectId[];
  likesCount: number;
  repliesCount: number;
}

const commentSchema = new Schema<IComment>(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true, maxlength: 500 },
    parentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
    replyToUser: { type: Schema.Types.ObjectId, ref: "User", default: null },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    likesCount: { type: Number, default: 0 },
    repliesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

commentSchema.index({ post: 1, parentId: 1, createdAt: 1 });

commentSchema.pre("findOneAndDelete", async function () {
  const query = this.getQuery();
  const commentId = query._id;

  if (commentId) {
    await models.Comment.deleteMany({ parentId: commentId });
  }
});

export default model<IComment>("Comment", commentSchema);
