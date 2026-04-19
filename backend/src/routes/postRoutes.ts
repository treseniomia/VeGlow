import express from "express";
import { createPost } from "../controllers/postController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @route   POST /api/posts
 * @desc    Create a new recipe post
 * @access  Private (Requires JWT Token)
 */
router.post("/", protect, createPost);

export default router;
