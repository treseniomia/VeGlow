import { Request, Response } from "express";
import Post from "../models/Post";
import { Like } from "../models/Like";
import User from "../models/User";
import { deleteFromCloudinary } from "../utils/cloudinary";

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
      user: req.user._id,
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

export const getAllPosts = async (req: any, res: Response) => {
  try {
    const posts = await Post.find()
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .lean();

    const currentUserId = req.user?._id;

    const postsWithStatus = await Promise.all(
      posts.map(async (post: any) => {
        const hasLiked = currentUserId
          ? await Like.findOne({ user: currentUserId, post: post._id })
          : null;

        let isSaved = false;
        let isHidden = false;

        if (currentUserId) {
          const user = await User.findById(currentUserId).lean();
          isSaved =
            user?.savedPosts?.some(
              (savedPostId: any) =>
                savedPostId.toString() === post._id.toString(),
            ) || false;

          const hiddenPost = user?.hiddenPosts?.find(
            (hiddenPost: any) =>
              hiddenPost.postId.toString() === post._id.toString(),
          );

          if (hiddenPost) {
            isHidden = true;
          }
        }

        return {
          ...post,
          isLiked: !!hasLiked,
          isSaved,
          isHidden,
        };
      }),
    );

    const visiblePosts = postsWithStatus.filter((post: any) => !post.isHidden);

    return res.status(200).json(visiblePosts);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching posts", error });
  }
};

export const getPostById = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate("user", "name").lean();

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const currentUserId = req.user?._id;

    const hasLiked = currentUserId
      ? await Like.findOne({ user: currentUserId, post: post._id })
      : null;

    let isSaved = false;
    if (currentUserId) {
      const user = await User.findById(currentUserId).lean();
      isSaved =
        user?.savedPosts?.some(
          (savedPostId: any) => savedPostId.toString() === post._id.toString(),
        ) || false;
    }

    const postWithStatus = {
      ...post,
      isLiked: !!hasLiked,
      isSaved,
    };

    return res.status(200).json(postWithStatus);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Error fetching post" });
  }
};

export const getMyPosts = async (req: any, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ message: "Unauthorized. Valid session token required." });
    }

    const posts = await Post.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    const currentUserId = req.user._id;

    const postsWithStatus = await Promise.all(
      posts.map(async (post: any) => {
        const hasLiked = await Like.findOne({
          user: currentUserId,
          post: post._id,
        });

        const user = await User.findById(currentUserId).lean();
        const isSaved =
          user?.savedPosts?.some(
            (savedPostId: any) =>
              savedPostId.toString() === post._id.toString(),
          ) || false;

        return {
          ...post,
          isLiked: !!hasLiked,
          isSaved,
        };
      }),
    );

    return res.status(200).json(postsWithStatus);
  } catch (error: any) {
    console.error("❌ GET_MY_POSTS ERROR:", error.message);
    return res
      .status(500)
      .json({ message: "Error fetching your posts", error: error.message });
  }
};

export const deletePost = async (req: any, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You can only delete your own posts." });
    }

    if (post.mediaUrls && post.mediaUrls.length > 0) {
      await Promise.all(post.mediaUrls.map((url) => deleteFromCloudinary(url)));
    }

    await Like.deleteMany({ post: req.params.id });
    await Post.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message:
        "Post, images, and associated engagement data deleted successfully! 🌿",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePost = async (req: any, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You can only edit your own posts." });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { returnDocument: "after", runValidators: true },
    );

    return res.status(200).json({ success: true, data: updatedPost });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const togglePostLike = async (
  req: any,
  res: Response,
): Promise<Response> => {
  const { postId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized. Session required." });
  }

  try {
    const postExists = await Post.findById(postId);
    if (!postExists) {
      return res
        .status(404)
        .json({ success: false, message: "Recipe post not found." });
    }

    const existingLike = await Like.findOne({ user: userId, post: postId });

    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });

      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $inc: { likesCount: -1 } },
        { returnDocument: "after", select: "likesCount" },
      );

      return res.status(200).json({
        success: true,
        message: "Post unliked.",
        isLiked: false,
        likesCount: updatedPost ? updatedPost.likesCount : 0,
      });
    } else {
      await Like.create({ user: userId, post: postId });

      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $inc: { likesCount: 1 } },
        { returnDocument: "after", select: "likesCount" },
      );

      return res.status(200).json({
        success: true,
        message: "Post liked.",
        isLiked: true,
        likesCount: updatedPost ? updatedPost.likesCount : 0,
      });
    }
  } catch (error: any) {
    console.error("❌ Toggle Like Error:", error);
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Spam request throttled." });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const incrementShareCount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $inc: { sharesCount: 1 } },
      { returnDocument: "after" },
    );

    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        message: "Recipe post target not found.",
      });
    }

    const postObject = updatedPost as any;

    return res.status(200).json({
      success: true,
      sharesCount: postObject.sharesCount || 0,
    });
  } catch (error: any) {
    console.error("Error in incrementShareCount controller:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error processing share increment request.",
      error: error.message,
    });
  }
};

export const toggleSavePost = async (
  req: any,
  res: Response,
): Promise<Response> => {
  const { id } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized. Session required." });
  }

  try {
    const postExists = await Post.findById(id);
    if (!postExists) {
      return res
        .status(404)
        .json({ success: false, message: "Recipe post not found." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const isPostSaved = user.savedPosts?.includes(id as any);

    if (isPostSaved) {
      await User.findByIdAndUpdate(
        userId,
        { $pull: { savedPosts: id } },
        { returnDocument: "after" },
      );

      return res.status(200).json({
        success: true,
        message: "Post unsaved.",
        isSaved: false,
      });
    } else {
      await User.findByIdAndUpdate(
        userId,
        { $push: { savedPosts: id } },
        { returnDocument: "after" },
      );

      return res.status(200).json({
        success: true,
        message: "Post saved.",
        isSaved: true,
      });
    }
  } catch (error: any) {
    console.error("❌ Toggle Save Post Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const getSavedPosts = async (
  req: any,
  res: Response,
): Promise<Response> => {
  const userId = req.user?._id;

  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized. Session required." });
  }

  try {
    const user = await User.findById(userId).populate("savedPosts");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const savedPostsReversed = (user.savedPosts || []).reverse();

    return res.status(200).json({
      success: true,
      savedPosts: savedPostsReversed,
    });
  } catch (error: any) {
    console.error("❌ Get Saved Recipes Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const hidePost = async (req: any, res: Response) => {
  const userId = req.user?._id;
  const { id } = req.params;

  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized. Session required." });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const isAlreadyHidden = user.hiddenPosts?.some(
      (hiddenPost: any) => hiddenPost.postId.toString() === id,
    );

    if (isAlreadyHidden) {
      return res.status(200).json({
        success: true,
        message: "Post already hidden.",
        isHidden: true,
      });
    }

    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          hiddenPosts: {
            postId: id,
            hiddenAt: new Date(),
          },
        },
        $pull: {
          savedPosts: id,
        },
      },
      { returnDocument: "after" },
    );

    return res.status(200).json({
      success: true,
      message: "Post hidden.",
      isHidden: true,
      isSaved: false,
    });
  } catch (error: any) {
    console.error("❌ Hide Post Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const unhidePost = async (req: any, res: Response) => {
  const userId = req.user?._id;
  const { id } = req.params;

  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized. Session required." });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          hiddenPosts: { postId: id },
        },
      },
      { returnDocument: "after" },
    );

    return res.status(200).json({
      success: true,
      message: "Post unhidden.",
      isHidden: false,
    });
  } catch (error: any) {
    console.error("❌ Unhide Post Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const getHiddenPosts = async (
  req: any,
  res: Response,
): Promise<Response> => {
  const userId = req.user?._id;

  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized. Session required." });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const hiddenPostIds =
      user.hiddenPosts?.map((hiddenPost: any) => hiddenPost.postId) || [];

    const posts = await Post.find({ _id: { $in: hiddenPostIds } })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .lean();

    const postsWithHiddenAt = posts.map((post: any) => {
      const hiddenPost = user.hiddenPosts?.find(
        (hiddenPost: any) =>
          hiddenPost.postId.toString() === post._id.toString(),
      );
      return {
        ...post,
        hiddenAt: hiddenPost?.hiddenAt,
      };
    });

    return res.status(200).json({
      success: true,
      hiddenPosts: postsWithHiddenAt,
    });
  } catch (error: any) {
    console.error("❌ Get Hidden Posts Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
