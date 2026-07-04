import { Request, Response, NextFunction } from "express";
import { Reel } from "../models/Reel";

// Custom type structure extension for Auth requests
interface AuthenticatedRequest extends Request {
  user?: { _id: string; name: string };
}

export const createReel = async (req: any, res: Response) => {
  try {
    const { videoUrl, title, description } = req.body;

    if (!videoUrl || !title) {
      return res.status(400).json({ message: "Missing videoUrl or title." });
    }

    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ message: "Not authorized. No user found in request." });
    }

    const newReel = new Reel({
      user: req.user._id,
      videoUrl,
      title,
      description: description || "",
    });

    const savedReel = await newReel.save();
    console.log("✅ SUCCESS: Reel saved to MongoDB!");

    // Populate user data and add username field
    const reelWithUser = await Reel.findById(savedReel._id).populate(
      "user",
      "name",
    );
    if (!reelWithUser) {
      return res.status(404).json({ message: "Reel not found after save" });
    }

    const reelWithUsername = {
      ...reelWithUser.toObject(),
      user: {
        ...((reelWithUser.user as any).toObject
          ? (reelWithUser.user as any).toObject()
          : reelWithUser.user),
        username: (reelWithUser.user as any).name, // Add username field using name
      },
    };

    return res.status(201).json({
      success: true,
      message: "Reel saved successfully!",
      data: reelWithUsername,
    });
  } catch (error: any) {
    console.error("❌ BACKEND ERROR:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllReels = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const reels = await Reel.find()
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .lean();

    const userId = req.user?._id;

    const reelsWithLikeStatus = reels.map((reel: any) => ({
      ...reel,
      user: {
        ...reel.user,
        username: reel.user.name, // Add username field using name
      },
      isLiked:
        userId && reel.likes
          ? reel.likes.some((id: any) => id.toString() === userId.toString())
          : false,
    }));

    return res.status(200).json(reelsWithLikeStatus);
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyReels = async (req: any, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized." });
    }

    const reels = await Reel.find({ user: req.user._id })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .lean();

    const reelsWithUsername = reels.map((reel: any) => ({
      ...reel,
      user: {
        ...reel.user,
        username: reel.user.name, // Add username field using name
      },
    }));

    return res.status(200).json(reelsWithUsername);
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateReel = async (req: any, res: Response) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: "Reel not found" });

    if (reel.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You can only edit your own reels." });
    }

    const { title, description } = req.body;
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    const updatedReel = await Reel.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { returnDocument: "after", runValidators: true },
    ).populate("user", "name");

    if (!updatedReel)
      return res.status(404).json({ message: "Reel not found" });

    // Add username field to the response
    const reelWithUsername = {
      ...updatedReel.toObject(),
      user: updatedReel.user
        ? {
            ...((updatedReel.user as any).toObject
              ? (updatedReel.user as any).toObject()
              : updatedReel.user),
            username: (updatedReel.user as any).name, // Add username field using name
          }
        : null,
    };

    return res.status(200).json({ success: true, data: reelWithUsername });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteReel = async (req: any, res: Response) => {
  try {
    const reel = await Reel.findById(req.params.id);

    if (!reel) return res.status(404).json({ message: "Reel not found" });

    if (reel.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You can only delete your own reels." });
    }

    await Reel.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Reel deleted successfully!" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
