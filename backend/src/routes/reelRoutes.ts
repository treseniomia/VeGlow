import express from "express";
import {
  createReel,
  getAllReels,
  getMyReels,
  updateReel,
  deleteReel,
} from "../controllers/reelController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @route   POST /api/reels
 * @desc    Create a new reel
 * @access  Private (Requires JWT Token)
 */
router.post("/", protect, createReel);

/**
 * @route   GET /api/reels
 * @desc    Get all reels (global feed)
 * @access  Public
 */
router.get("/", getAllReels);

/**
 * @route   GET /api/reels/my-reels
 * @desc    Get current user's reels
 * @access  Private (Requires JWT Token)
 */
router.get("/my-reels", protect, getMyReels);

/**
 * @route   PUT /api/reels/:id
 * @desc    Update a reel (title and description only)
 * @access  Private (Requires JWT Token)
 */
router.put("/:id", protect, updateReel);

/**
 * @route   DELETE /api/reels/:id
 * @desc    Delete a reel
 * @access  Private (Requires JWT Token)
 */
router.delete("/:id", protect, deleteReel);

export default router;
