import { Router } from "express";
import {
  likeReel,
  unlikeReel,
  checkLikeStatus,
  createComment,
  getComments,
  getReplies,
  addReply,
  updateComment,
  deleteComment,
  deleteReply,
  updateReply,
  likeComment,
  unlikeComment,
  toggleReplyLike,
  shareReel,
} from "../controllers/reelInteractionController";
import { protect, optionalProtect } from "../middleware/authMiddleware";

const router = Router();

// LIKE ROUTES
router.post("/:reelId/like", protect, likeReel);
router.delete("/:reelId/like", protect, unlikeReel);
router.get("/:reelId/like/status", protect, checkLikeStatus);

// COMMENT ROUTES
router.post("/:reelId/comments", protect, createComment);
router.get("/:reelId/comments", optionalProtect, getComments);
router.post("/comments/:commentId/replies", protect, addReply);
router.get("/comments/:commentId/replies", optionalProtect, getReplies);
router.put("/comments/:commentId", protect, updateComment);
router.delete("/comments/:commentId", protect, deleteComment);
router.delete("/comments/:commentId/replies/:replyId", protect, deleteReply);
router.patch("/comments/:commentId/replies/:replyId", protect, updateReply);

// COMMENT LIKE ROUTES
router.post("/comments/:commentId/like", protect, likeComment);
router.delete("/comments/:commentId/like", protect, unlikeComment);
router.post(
  "/comments/:commentId/replies/:replyId/like",
  protect,
  toggleReplyLike,
);

// SHARE ROUTE
router.post("/:reelId/share", protect, shareReel);

export default router;
