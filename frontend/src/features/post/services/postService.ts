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
};
