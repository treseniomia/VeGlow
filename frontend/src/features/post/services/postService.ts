import API from "../../../api/api";
import { useAuthStore } from "../../../store/useAuthStore";

export const postService = {
  publishRecipe: async (formData: any) => {
    try {
      const token = useAuthStore.getState().token;

      const response = await API.post("/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Post Service Error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getMyPosts: async () => {
    try {
      const response = await API.get("/posts/my-posts");
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  getPostById: async (id: string) => {
    const response = await API.get(`/posts/${id}`);
    return response.data;
  },

  updateRecipe: async (id: string, formData: any) => {
    const token = useAuthStore.getState().token;
    const response = await API.patch(`/posts/${id}`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
