import express from "express";
import { register, login } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";
import {
  getProfile,
  updateProfilePicture,
  deleteProfilePicture,
} from "../controllers/authController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/profile/picture", protect, updateProfilePicture);
router.delete("/profile/picture", protect, deleteProfilePicture);

export default router;
