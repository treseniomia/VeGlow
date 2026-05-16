import { v2 as cloudinary } from "cloudinary";

export const deleteFromCloudinary = async (url: string) => {
  try {
    const publicId = url.split("/").pop()?.split(".")[0];

    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
      console.log(`✅ Deleted from Cloudinary: ${publicId}`);
    }
  } catch (error) {
    console.error("❌ Cloudinary Deletion Failed:", error);
  }
};
