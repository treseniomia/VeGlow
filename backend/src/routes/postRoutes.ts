import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
} from "../controllers/postController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @route   POST /api/posts
 * @desc    Create a new recipe post
 * @access  Private (Requires JWT Token)
 */
router.post("/", protect, createPost);
router.get("/", getAllPosts);
router.get("/:id", getPostById);

export default router;
