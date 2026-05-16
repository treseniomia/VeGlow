import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  getMyPosts,
  deletePost,
  updatePost,
  togglePostLike,
} from "../controllers/postController";
import { protect, optionalProtect } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @route
 * @desc
 * @access  Private (Requires JWT Token)
 */
router.get("/my-posts", protect, getMyPosts);
router.post("/", protect, createPost);

/**
 * @route
 * @desc
 * @access  Public / Optional (Reads JWT token if available to evaluate persistent like state markers)
 */
router.get("/", optionalProtect, getAllPosts);
router.get("/:id", optionalProtect, getPostById);

router.patch("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

router.post("/:postId/like", protect, togglePostLike);

export default router;
