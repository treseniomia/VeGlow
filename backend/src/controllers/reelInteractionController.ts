import { Request as ExpressRequest, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Reel } from "../models/Reel";
import ReelComment from "../models/ReelComment";

// Custom interface definition for Authenticated Request payloads
interface AuthenticatedRequest extends ExpressRequest {
  user?: { _id: string; name: string };
}

// 1. ATOMIC LIKE EXECUTION (POST /api/reels-interactions/:reelId/like)
export const likeReel = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { reelId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. User identity missing.",
      });
      return;
    }

    // $addToSet guarantees that the userId is only added ONCE, preventing duplication bugs
    const updatedReel = await Reel.findByIdAndUpdate(
      reelId,
      { $addToSet: { likes: userId } },
      { returnDocument: "after" },
    ).lean();

    if (!updatedReel) {
      res
        .status(404)
        .json({ success: false, message: "Target reel document not found." });
      return;
    }

    // Dynamically recalculate count based on actual array length to prevent hallucination
    const actualLikesCount = updatedReel.likes ? updatedReel.likes.length : 0;

    // Update the count to match the actual array length
    const finalReel = await Reel.findByIdAndUpdate(
      reelId,
      { $set: { likesCount: actualLikesCount } },
      { returnDocument: "after" },
    ).lean();

    res.status(200).json({
      success: true,
      isLiked: true,
      likesCount: finalReel?.likesCount || actualLikesCount,
      reel: finalReel || updatedReel,
    });
  } catch (error) {
    next(error);
  }
};

// 2. ATOMIC UNLIKE EXECUTION (DELETE /api/reels-interactions/:reelId/like)
export const unlikeReel = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { reelId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. User identity missing.",
      });
      return;
    }

    // $pull atomically extracts the userId from the likes array reference natively
    const updatedReel = await Reel.findByIdAndUpdate(
      reelId,
      { $pull: { likes: userId } },
      { returnDocument: "after" },
    ).lean();

    if (!updatedReel) {
      res
        .status(404)
        .json({ success: false, message: "Target reel document not found." });
      return;
    }

    // Dynamically recalculate count based on actual array length to prevent hallucination
    const actualLikesCount = updatedReel.likes ? updatedReel.likes.length : 0;

    // Update the count to match the actual array length
    const finalReel = await Reel.findByIdAndUpdate(
      reelId,
      { $set: { likesCount: actualLikesCount } },
      { returnDocument: "after" },
    ).lean();

    res.status(200).json({
      success: true,
      isLiked: false,
      likesCount: finalReel?.likesCount || actualLikesCount,
      reel: finalReel || updatedReel,
    });
  } catch (error) {
    next(error);
  }
};

// 3. EXPLICIT LIKE STATUS CHECKER (GET /api/reels-interactions/:reelId/like/status)
export const checkLikeStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { reelId } = req.params;
    const userId = req.user?._id;

    const targetReel = await Reel.findById(reelId).lean();
    if (!targetReel) {
      res
        .status(404)
        .json({ success: false, message: "Target reel trace failed." });
      return;
    }

    const isLiked =
      targetReel.likes && userId
        ? targetReel.likes.some(
            (id: any) => id.toString() === userId.toString(),
          )
        : false;

    res.status(200).json({
      isLiked,
      likesCount: targetReel.likes ? targetReel.likes.length : 0,
    });
  } catch (error) {
    next(error);
  }
};

// 4. CREATE COMMENT (POST /api/reels-interactions/:reelId/comments)
export const createComment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { reelId } = req.params;
    const { text } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. User identity missing.",
      });
      return;
    }

    if (!text) {
      res
        .status(400)
        .json({ success: false, message: "Content text is required" });
      return;
    }

    const commentData: any = {
      reel: reelId,
      user: userId,
      text,
    };

    const comment = await ReelComment.create(commentData);

    await Reel.findOneAndUpdate(
      { _id: reelId as any },
      { $inc: { commentsCount: 1 } },
      { returnDocument: "after" },
    );

    // Fetch the reel to get the creator's ID for author badge logic
    const reel = await Reel.findById(reelId).select("user");

    const populatedComment = await comment.populate(
      "user",
      "name profilePicture",
    );

    res.status(201).json({
      success: true,
      data: populatedComment,
      reelUserId: reel?.user, // Include reel creator ID for author badge logic
    });
  } catch (error) {
    next(error);
  }
};

// 5. GET COMMENTS (GET /api/reels-interactions/:reelId/comments)
export const getComments = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { reelId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Fetch the reel to get the creator's ID for author badge logic
    const reel = await Reel.findById(reelId).select("user");

    const comments = await ReelComment.find({
      reel: reelId as any,
    })
      .populate("user", "name profilePicture")
      .populate("replies.user", "name profilePicture")
      .populate("replies.replyingToUserId", "name profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalComments = await ReelComment.countDocuments({
      reel: reelId as any,
    });

    res.status(200).json({
      success: true,
      data: comments,
      reelUserId: reel?.user, // Include reel creator ID for author badge logic
      currentPage: page,
      hasMore: skip + comments.length < totalComments,
    });
  } catch (error) {
    next(error);
  }
};

// 5.5. ADD REPLY (POST /api/reels-interactions/:commentId/replies)
export const addReply = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { commentId } = req.params;
    const { text, replyingToUserId, parentReplyId } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. User identity missing.",
      });
      return;
    }

    if (!text) {
      res
        .status(400)
        .json({ success: false, message: "Reply text is required." });
      return;
    }

    const replyData: any = {
      user: userId,
      text,
      replyingToUserId: replyingToUserId || null,
      parentReplyId: parentReplyId || null,
      likesCount: 0,
      likes: [],
    };

    const updatedComment = await ReelComment.findByIdAndUpdate(
      commentId,
      {
        $push: { replies: replyData },
        $inc: { repliesCount: 1 },
      },
      { returnDocument: "after", new: true },
    )
      .populate("user", "name profilePicture")
      .populate("replies.user", "name profilePicture")
      .populate("replies.replyingToUserId", "name profilePicture");

    // Fetch the reel to get the creator's ID for author badge logic
    const reel = await Reel.findById(updatedComment?.reel).select("user");

    res.status(201).json({
      success: true,
      data: updatedComment,
      reelUserId: reel?.user,
    });
  } catch (error) {
    next(error);
  }
};

// 6. GET REPLIES (GET /api/reels-interactions/comments/:commentId/replies)
export const getReplies = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { commentId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;

    // Fetch the parent comment to get the reel ID
    const parentComment = await ReelComment.findById(commentId).select("reel");

    // Fetch the reel to get the creator's ID for author badge logic
    const reel = await Reel.findById(parentComment?.reel).select("user");

    const replies = await ReelComment.find({ parentId: commentId as any })
      .populate("user", "name profilePicture")
      .populate("replyToUser", "name profilePicture")
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    const totalReplies = await ReelComment.countDocuments({
      parentId: commentId as any,
    });

    res.status(200).json({
      success: true,
      data: replies,
      reelUserId: reel?.user, // Include reel creator ID for author badge logic
      currentPage: page,
      hasMore: skip + replies.length < totalReplies,
    });
  } catch (error) {
    next(error);
  }
};

// 7. UPDATE COMMENT (PUT /api/reels-interactions/comments/:commentId)
export const updateComment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. User identity missing.",
      });
      return;
    }

    if (!text) {
      res
        .status(400)
        .json({ success: false, message: "Updated text is required" });
      return;
    }

    const comment = await ReelComment.findById(commentId);
    if (!comment) {
      res
        .status(404)
        .json({ success: false, message: "Comment document not found" });
      return;
    }

    if (comment.user.toString() !== userId.toString()) {
      res
        .status(401)
        .json({ success: false, message: "Unauthorized operation matrix" });
      return;
    }

    const updatedComment = await ReelComment.findOneAndUpdate(
      { _id: commentId as any },
      { text },
      { returnDocument: "after", runValidators: true },
    )
      .populate("user", "name profilePicture")
      .populate("replies.user", "name profilePicture")
      .populate("replies.replyingToUserId", "name profilePicture");

    res.status(200).json({ success: true, data: updatedComment });
  } catch (error) {
    next(error);
  }
};

// 8. DELETE COMMENT (DELETE /api/reels-interactions/comments/:commentId)
export const deleteComment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { commentId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. User identity missing.",
      });
      return;
    }

    const comment = await ReelComment.findById(commentId);

    if (!comment) {
      res
        .status(404)
        .json({ success: false, message: "Comment record not found" });
      return;
    }

    if (comment.user.toString() !== userId.toString()) {
      res
        .status(401)
        .json({ success: false, message: "Unauthorized execution block" });
      return;
    }

    await Reel.findOneAndUpdate(
      { _id: comment.reel as any },
      { $inc: { commentsCount: -1 } },
      { returnDocument: "after" },
    );

    await ReelComment.findOneAndDelete({ _id: commentId as any });

    res
      .status(200)
      .json({ success: true, message: "Target document dropped successfully" });
  } catch (error) {
    next(error);
  }
};

// 8.5. DELETE REPLY (DELETE /api/reels-interactions/comments/:commentId/replies/:replyId)
export const deleteReply = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { commentId, replyId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. User identity missing.",
      });
      return;
    }

    const comment = await ReelComment.findById(commentId);

    if (!comment) {
      res
        .status(404)
        .json({ success: false, message: "Comment record not found" });
      return;
    }

    const reply = comment.replies.find(
      (r: any) => r._id.toString() === replyId,
    );

    if (!reply) {
      res
        .status(404)
        .json({ success: false, message: "Reply record not found" });
      return;
    }

    if (reply.user.toString() !== userId.toString()) {
      res
        .status(401)
        .json({ success: false, message: "Unauthorized execution block" });
      return;
    }

    const updatedComment = await ReelComment.findByIdAndUpdate(
      commentId,
      {
        $pull: { replies: { _id: replyId } },
        $inc: { repliesCount: -1 },
      },
      { returnDocument: "after", new: true },
    )
      .populate("user", "name profilePicture")
      .populate("replies.user", "name profilePicture")
      .populate("replies.replyingToUserId", "name profilePicture");

    res.status(200).json({ success: true, data: updatedComment });
  } catch (error) {
    next(error);
  }
};

// 8.6. TOGGLE REPLY LIKE (POST /api/reels-interactions/comments/:commentId/replies/:replyId/like)
export const toggleReplyLike = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { commentId, replyId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. User identity missing.",
      });
      return;
    }

    const comment = await ReelComment.findById(commentId);

    if (!comment) {
      res.status(404).json({ success: false, message: "Comment not found" });
      return;
    }

    const reply = comment.replies.find(
      (r: any) => r._id.toString() === replyId,
    );

    if (!reply) {
      res.status(404).json({ success: false, message: "Reply not found" });
      return;
    }

    const isLiked = reply.likes.some(
      (id: any) => id.toString() === userId.toString(),
    );
    const updateQuery = isLiked
      ? {
          $pull: { "replies.$.likes": userId },
          $inc: { "replies.$.likesCount": -1 },
        }
      : {
          $addToSet: { "replies.$.likes": userId },
          $inc: { "replies.$.likesCount": 1 },
        };

    const updatedComment = await ReelComment.findOneAndUpdate(
      { _id: commentId, "replies._id": replyId },
      updateQuery,
      { returnDocument: "after" },
    )
      .populate("user", "name profilePicture")
      .populate("replies.user", "name profilePicture")
      .populate("replies.replyingToUserId", "name profilePicture");

    const updatedReply = updatedComment?.replies.find(
      (r: any) => r._id.toString() === replyId,
    );

    res.status(200).json({
      success: true,
      isLiked: !isLiked,
      likesCount: updatedReply?.likesCount || 0,
    });
  } catch (error) {
    next(error);
  }
};

// 10. UPDATE REPLY (PATCH /api/reels-interactions/comments/:commentId/replies/:replyId)
export const updateReply = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { commentId, replyId } = req.params;
    const { text } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. User identity missing.",
      });
      return;
    }

    if (!text || text.trim().length === 0) {
      res
        .status(400)
        .json({ success: false, message: "Reply text cannot be empty" });
      return;
    }

    const comment = await ReelComment.findById(commentId);
    if (!comment) {
      res.status(404).json({ success: false, message: "Comment not found" });
      return;
    }

    const reply = comment.replies.find(
      (r: any) => r._id.toString() === replyId,
    );
    if (!reply) {
      res.status(404).json({ success: false, message: "Reply not found" });
      return;
    }

    // Verify ownership
    if (reply.user.toString() !== userId.toString()) {
      res.status(403).json({
        success: false,
        message: "Forbidden. You can only edit your own replies.",
      });
      return;
    }

    // Update the reply using array positional operator
    const updatedComment = await ReelComment.findOneAndUpdate(
      { _id: commentId, "replies._id": replyId },
      {
        $set: {
          "replies.$.text": text.trim(),
          "replies.$.updatedAt": new Date(),
        },
      },
      { returnDocument: "after" },
    )
      .populate("user", "name profilePicture")
      .populate("replies.user", "name profilePicture")
      .populate("replies.replyingToUserId", "name profilePicture");

    const updatedReply = updatedComment?.replies.find(
      (r: any) => r._id.toString() === replyId,
    );

    res.status(200).json({
      success: true,
      data: updatedReply,
    });
  } catch (error) {
    next(error);
  }
};

// 11. TOGGLE COMMENT LIKE (POST /api/reels-interactions/comments/:commentId/like)
export const likeComment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { commentId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. User identity missing.",
      });
      return;
    }

    const comment = await ReelComment.findById(commentId);
    if (!comment) {
      res.status(404).json({ success: false, message: "Comment not found" });
      return;
    }

    const isLiked = comment.likes.some((id) => id.toString() === userId);
    const updateQuery = isLiked
      ? { $pull: { likes: userId } }
      : { $addToSet: { likes: userId } };

    const updatedComment = await ReelComment.findOneAndUpdate(
      { _id: commentId as any },
      updateQuery,
      { returnDocument: "after" },
    );

    // Dynamically recalculate count based on actual array length to prevent hallucination
    const actualLikesCount = updatedComment?.likes
      ? updatedComment.likes.length
      : 0;

    // Update the count to match the actual array length
    const finalComment = await ReelComment.findOneAndUpdate(
      { _id: commentId as any },
      { $set: { likesCount: actualLikesCount } },
      { returnDocument: "after" },
    );

    res.status(200).json({
      success: true,
      isLiked: !isLiked,
      likesCount: finalComment?.likesCount || actualLikesCount,
    });
  } catch (error) {
    next(error);
  }
};

// 10. UNLIKE COMMENT (DELETE /api/reels-interactions/comments/:commentId/like)
export const unlikeComment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { commentId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. User identity missing.",
      });
      return;
    }

    const comment = await ReelComment.findById(commentId);
    if (!comment) {
      res.status(404).json({ success: false, message: "Comment not found" });
      return;
    }

    const isLiked = comment.likes.some((id) => id.toString() === userId);
    if (!isLiked) {
      res
        .status(400)
        .json({ success: false, message: "Comment not liked by user" });
      return;
    }

    const updatedComment = await ReelComment.findOneAndUpdate(
      { _id: commentId as any },
      { $pull: { likes: userId } },
      { returnDocument: "after" },
    );

    // Dynamically recalculate count based on actual array length to prevent hallucination
    const actualLikesCount = updatedComment?.likes
      ? updatedComment.likes.length
      : 0;

    // Update the count to match the actual array length
    const finalComment = await ReelComment.findOneAndUpdate(
      { _id: commentId as any },
      { $set: { likesCount: actualLikesCount } },
      { returnDocument: "after" },
    );

    res.status(200).json({
      success: true,
      isLiked: false,
      likesCount: finalComment?.likesCount || actualLikesCount,
    });
  } catch (error) {
    next(error);
  }
};

// 11. SHARE REEL (POST /api/reels-interactions/:reelId/share)
export const shareReel = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { reelId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. User identity missing.",
      });
      return;
    }

    const updatedReel = await Reel.findByIdAndUpdate(
      reelId,
      { $inc: { sharesCount: 1 } },
      { returnDocument: "after" },
    ).lean();

    if (!updatedReel) {
      res
        .status(404)
        .json({ success: false, message: "Target reel document not found." });
      return;
    }

    res.status(200).json({
      success: true,
      sharesCount: updatedReel.sharesCount,
      reel: updatedReel,
    });
  } catch (error) {
    next(error);
  }
};
