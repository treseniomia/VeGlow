import API from "@/api/api";

export const profileService = {
  updateAvatar: async (imageUrl: string) => {
    const response = await API.put("/auth/profile/picture", {
      profilePicture: imageUrl,
    });
    return response.data;
  },

  getProfile: async () => {
    const response = await API.get("/auth/profile");
    return response.data;
  },

  deleteAvatar: async () => {
    const response = await API.delete("/auth/profile/picture");
    return response.data;
  },
};
