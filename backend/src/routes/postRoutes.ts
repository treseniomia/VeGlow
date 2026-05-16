import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  getMyPosts,
  deletePost,
  updatePost,
} from "../controllers/postController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @route
 * @desc
 * @access  Private (Requires JWT Token)
 */

router.get("/my-posts", protect, getMyPosts);

router.post("/", protect, createPost);
router.get("/", getAllPosts);
router.get("/:id", getPostById);

router.patch("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

export default router;
