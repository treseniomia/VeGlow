import express from "express";
import {
  createComment,
  getCommentsByPost,
  getRepliesForComment,
  deleteComment,
  toggleCommentLike,
  updateComment,
} from "../controllers/commentController";
import { protect, optionalProtect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/post/:postId", optionalProtect, getCommentsByPost);
router.get("/:commentId/replies", optionalProtect, getRepliesForComment);

router.post("/", protect, createComment);
router.put("/:commentId", protect, updateComment);
router.delete("/:commentId", protect, deleteComment);
router.post("/:commentId/like", protect, toggleCommentLike);

export default router;
