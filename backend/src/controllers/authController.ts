import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// --- REGISTER ---
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profilePicture: "",
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "30d" }
    );

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error during registration" });
  }
};

// --- LOGIN ---
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "30d" }
      );

      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture || "",
        token,
      });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server Error during login" });
  }
};

// --- UPDATE PROFILE PICTURE (THE FIX) ---
export const updateProfilePicture = async (req: any, res: Response) => {
  try {
    const { profilePicture } = req.body;
    if (!profilePicture)
      return res.status(400).json({ message: "No URL provided" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profilePicture = profilePicture;
    await user.save();

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
    });
  } catch (error: any) {
    console.error("PUT ERROR:", error.message);
    return res
      .status(500)
      .json({ message: "Update Failed", error: error.message });
  }
};

// --- DELETE PROFILE PICTURE ---
export const deleteProfilePicture = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profilePicture = "";
    await user.save();

    return res.status(200).json({
      message: "Profile picture removed",
      user: {
        _id: user._id,
        profilePicture: "",
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Delete Failed" });
  }
};

// --- GET PROFILE ---
export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
