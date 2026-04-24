export const uploadToCloudinary = async (
  fileUri: string,
  fileType: "image" | "video"
) => {
  const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const data = new FormData();

  const fileToUpload = {
    uri: fileUri,
    type: fileType === "video" ? "video/mp4" : "image/jpeg",
    name: fileType === "video" ? "upload.mp4" : "upload.jpg",
  } as any;

  data.append("file", fileToUpload);
  data.append("upload_preset", uploadPreset!);

  // DYNAMIC RESOURCE TYPE: Dito natin binabago ang endpoint base sa file type
  const resourceType = fileType === "video" ? "video" : "image";

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      {
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const result = await response.json();
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};
