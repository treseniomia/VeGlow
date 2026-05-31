import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  getMyPosts,
  deletePost,
  updatePost,
  togglePostLike,
  toggleSavePost,
  getSavedPosts,
  hidePost,
  unhidePost,
  getHiddenPosts,
} from "../controllers/postController";
import { protect, optionalProtect } from "../middleware/authMiddleware";
import { incrementShareCount } from "../controllers/postController";

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
router.get("/saved", protect, getSavedPosts);
router.get("/hidden", protect, getHiddenPosts);
router.get("/:id", optionalProtect, getPostById);

router.patch("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

router.post("/:postId/like", protect, togglePostLike);

router.patch("/:id/save", protect, toggleSavePost);
router.patch("/:id/hide", protect, hidePost);
router.patch("/:id/unhide", protect, unhidePost);

router.patch("/:id/share-increment", incrementShareCount);

export default router;
