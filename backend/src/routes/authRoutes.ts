import express from "express";
import { register, login } from "../controllers/authController"; // Check mo kung tama ang path

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

export default router;
