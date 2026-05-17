import express from "express";
import {
  createComment,
  getCommentsByPost,
  deleteComment,
  toggleCommentLike,
  updateComment,
} from "../controllers/commentController";
import { protect, optionalProtect } from "../middleware/authMiddleware";

const router = express.Router();

// Public view endpoint na may optional authentication reading layer para sa validation
router.get("/post/:postId", optionalProtect, getCommentsByPost);

// Strictly private active transactions
router.post("/", protect, createComment);
router.put("/:commentId", protect, updateComment);
router.delete("/:commentId", protect, deleteComment);
router.post("/:commentId/like", protect, toggleCommentLike);

export default router;
