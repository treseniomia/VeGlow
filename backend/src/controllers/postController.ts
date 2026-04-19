import { Request, Response } from "express";
import Post from "../models/Post";

export const createPost = async (req: any, res: Response) => {
  try {
    const {
      title,
      prepTime,
      instructions,
      ingredients,
      nutritionList,
      mediaUrl,
    } = req.body;

    if (!title || !instructions) {
      return res
        .status(400)
        .json({ message: "Missing title or instructions." });
    }

    // Siguraduhin nating may user session galing sa protect middleware
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ message: "Not authorized. No user found in request." });
    }

    const newPost = new Post({
      user: req.user._id, // Ito ang nanggaling sa JWT
      title,
      prepTime: prepTime || "0 mins",
      instructions,
      ingredients: Array.isArray(ingredients)
        ? ingredients
        : ingredients?.split(",").map((i: string) => i.trim()) || [],
      nutritionList: nutritionList || [],
      mediaUrl: mediaUrl || "",
    });

    const savedPost = await newPost.save();
    console.log("✅ SUCCESS: Recipe saved to MongoDB!");

    return res.status(201).json({
      success: true,
      message: "Recipe saved successfully!",
      data: savedPost,
    });
  } catch (error: any) {
    console.error("❌ BACKEND ERROR:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
