import API from "../../../api/api";
import { ReelFormData, IReel } from "../types/reels.types";

export const reelApiService = {
  createReel: async (formData: ReelFormData) => {
    try {
      const response = await API.post("/reels", formData);
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Reel Service Error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  getAllReels: async (): Promise<IReel[]> => {
    try {
      const response = await API.get("/reels");
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Get All Reels Error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  getMyReels: async (): Promise<IReel[]> => {
    try {
      const response = await API.get("/reels/my-reels");
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Get My Reels Error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  updateReel: async (id: string, formData: Partial<ReelFormData>) => {
    try {
      const response = await API.put(`/reels/${id}`, formData);
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Update Reel Error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  deleteReel: async (id: string) => {
    try {
      const response = await API.delete(`/reels/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Delete Reel Error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },
};
