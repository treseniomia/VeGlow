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
      benefitsList,
      mediaUrls,
    } = req.body;

    if (!title || !instructions) {
      return res
        .status(400)
        .json({ message: "Missing title or instructions." });
    }

    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ message: "Not authorized. No user found in request." });
    }

    const parsedNutrition =
      typeof nutritionList === "string"
        ? JSON.parse(nutritionList)
        : nutritionList;

    const parsedBenefits =
      typeof benefitsList === "string"
        ? JSON.parse(benefitsList)
        : benefitsList;

    const newPost = new Post({
      user: req.user._id, // Coming from JWT
      title,
      prepTime: prepTime || "0 mins",
      instructions,
      ingredients: Array.isArray(ingredients)
        ? ingredients
        : typeof ingredients === "string"
        ? ingredients.split(",").map((i) => i.trim())
        : [],
      nutritionList: Array.isArray(parsedNutrition) ? parsedNutrition : [],
      benefitsList: Array.isArray(parsedBenefits) ? parsedBenefits : [],
      mediaUrls: Array.isArray(mediaUrls) ? mediaUrls : [],
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

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate("user", "name");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Error fetching post" });
  }
};
