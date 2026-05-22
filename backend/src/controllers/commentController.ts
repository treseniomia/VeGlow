import { Response, NextFunction } from "express";
import Comment from "../models/Comment";
import Post from "../models/Post";

export const createComment = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId, text, parentId, replyToUser } = req.body;

    if (!text)
      return res
        .status(400)
        .json({ success: false, message: "Content text is required" });

    const commentData: any = {
      post: postId,
      user: req.user._id,
      text,
    };

    if (parentId) commentData.parentId = parentId;
    if (replyToUser) commentData.replyToUser = replyToUser;

    const comment = await Comment.create(commentData);

    if (parentId) {
      await Comment.findOneAndUpdate(
        { _id: parentId as any },
        { $inc: { repliesCount: 1 } }
      );
    }

    await Post.findOneAndUpdate(
      { _id: postId as any },
      { $inc: { commentsCount: 1 } }
    );

    const populatedComment = await comment.populate([
      { path: "user", select: "name profilePicture" },
      { path: "replyToUser", select: "name" },
    ]);

    res.status(201).json({ success: true, data: populatedComment });
  } catch (error: any) {
    next(error);
  }
};

export const getCommentsByPost = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({ post: postId as any, parentId: null })
      .populate("user", "name profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalComments = await Comment.countDocuments({
      post: postId as any,
      parentId: null,
    });

    res.status(200).json({
      success: true,
      data: comments,
      currentPage: page,
      hasMore: skip + comments.length < totalComments,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getRepliesForComment = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { commentId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;

    const replies = await Comment.find({ parentId: commentId as any })
      .populate("user", "name profilePicture")
      .populate("replyToUser", "name")
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    const totalReplies = await Comment.countDocuments({
      parentId: commentId as any,
    });

    res.status(200).json({
      success: true,
      data: replies,
      currentPage: page,
      hasMore: skip + replies.length < totalReplies,
    });
  } catch (error: any) {
    next(error);
  }
};

export const deleteComment = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment)
      return res
        .status(404)
        .json({ success: false, message: "Comment record not found" });

    if (comment.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized execution block" });
    }

    if (comment.parentId) {
      await Comment.findOneAndUpdate(
        { _id: comment.parentId as any },
        { $inc: { repliesCount: -1 } }
      );
    }

    await Post.findOneAndUpdate(
      { _id: comment.post as any },
      { $inc: { commentsCount: -1 } }
    );

    await Comment.findOneAndDelete({ _id: commentId as any });

    res
      .status(200)
      .json({ success: true, message: "Target document dropped successfully" });
  } catch (error: any) {
    next(error);
  }
};

export const toggleCommentLike = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });

    const isLiked = comment.likes.includes(userId);
    const updateQuery = isLiked
      ? { $pull: { likes: userId }, $inc: { likesCount: -1 } }
      : { $push: { likes: userId }, $inc: { likesCount: 1 } };

    const updatedComment = await Comment.findOneAndUpdate(
      { _id: commentId as any },
      updateQuery,
      { returnDocument: "after" }
    );

    res.status(200).json({
      success: true,
      isLiked: !isLiked,
      likesCount: updatedComment?.likesCount || 0,
    });
  } catch (error: any) {
    next(error);
  }
};

export const updateComment = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    if (!text)
      return res
        .status(400)
        .json({ success: false, message: "Updated text is required" });

    const comment = await Comment.findById(commentId);
    if (!comment)
      return res
        .status(404)
        .json({ success: false, message: "Comment document not found" });

    if (comment.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized operation matrix" });
    }

    const updatedComment = await Comment.findOneAndUpdate(
      { _id: commentId as any },
      { text },
      { returnDocument: "after", runValidators: true }
    )
      .populate("user", "name profilePicture")
      .populate("replyToUser", "name");

    res.status(200).json({ success: true, data: updatedComment });
  } catch (error: any) {
    next(error);
  }
};
