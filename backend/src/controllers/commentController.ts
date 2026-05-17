import { Response } from "express";
import Comment from "../models/Comment";
import User from "../models/User";

// 1. CREATE MAIN COMMENT
export const createComment = async (req: any, res: Response) => {
  try {
    const { postId, text } = req.body;

    if (!text)
      return res.status(400).json({ message: "Comment text is required" });

    const comment = await Comment.create({
      post: postId,
      user: req.user._id, // Galing sa protect middleware natin
      text,
    });

    // I-populate ang user details para pagbalik sa frontend, may pangalan at avatar agad
    const populatedComment = await comment.populate("user", "name avatar");

    res.status(201).json({ success: true, data: populatedComment });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// 2. GET MAIN COMMENTS WITH LAZY LOADING PAGINATION
export const getCommentsByPost = async (req: any, res: Response) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Kunin lang ang mga main comments (parentId === null)
    const comments = await Comment.find({ post: postId, parentId: null })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 }) // Bago sa itaas
      .skip(skip)
      .limit(limit);

    const totalComments = await Comment.countDocuments({
      post: postId,
      parentId: null,
    });

    res.status(200).json({
      success: true,
      data: comments,
      currentPage: page,
      hasMore: skip + comments.length < totalComments,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// 3. DELETE SINGLE COMMENT
export const deleteComment = async (req: any, res: Response) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Authorization: Dapat ang may-ari lang ng comment ang pwedeng mag-delete
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized execution" });
    }

    await Comment.findByIdAndDelete(commentId);
    res
      .status(200)
      .json({ success: true, message: "Comment deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// 4. TOGGLE LIKE COMMENT (WITH RECENT RETURN DOCUMENT SPECIFICATION)
export const toggleCommentLike = async (req: any, res: Response) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const isLiked = comment.likes.includes(userId);
    const updateQuery = isLiked
      ? { $pull: { likes: userId }, $inc: { likesCount: -1 } }
      : { $push: { likes: userId }, $inc: { likesCount: 1 } };

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      updateQuery,
      {
        returnDocument: "after", // NO DEPRECATION WARNINGS
      }
    );

    res.status(200).json({
      success: true,
      isLiked: !isLiked,
      likesCount: updatedComment?.likesCount || 0,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
// 5. UPDATE/EDIT SINGLE COMMENT CONTENT (CLEAN PUT ROUTE)
export const updateComment = async (req: any, res: Response) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    if (!text)
      return res.status(400).json({ message: "Updated text is required" });

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized operation" });
    }

    // FIX: Ginamit natin ang findOneAndUpdate + Explicit Identifier Mapping Object
    const updatedComment = await Comment.findOneAndUpdate(
      { _id: commentId },
      { text },
      { returnDocument: "after", runValidators: true }
    ).populate("user", "name avatar");

    res.status(200).json({ success: true, data: updatedComment });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
