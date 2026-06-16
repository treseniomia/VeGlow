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

  deletePost: async (postId: string) => {
    const response = await API.delete(`/posts/${postId}`);
    return response.data;
  },

  updatePost: async (postId: string, postData: any) => {
    const response = await API.patch(`/posts/${postId}`, postData);
    return response.data;
  },

  deleteReel: async (reelId: string) => {
    const response = await API.delete(`/reels/${reelId}`);
    return response.data;
  },
};
