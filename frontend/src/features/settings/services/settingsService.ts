import API from "../../../api/api";
import { useAuthStore } from "../../../store/useAuthStore";

export interface ToggleSavePostResponse {
  success: boolean;
  message: string;
  isSaved: boolean;
}

export interface SavedPostsResponse {
  success: boolean;
  savedPosts: any[];
}

export interface ToggleHidePostResponse {
  success: boolean;
  message: string;
  isHidden: boolean;
}

export interface HiddenPostsResponse {
  success: boolean;
  hiddenPosts: any[];
}

export const settingsService = {
  toggleSavePost: async (postId: string): Promise<ToggleSavePostResponse> => {
    try {
      const token = useAuthStore.getState().token;

      const response = await API.patch(`/posts/${postId}/save`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Settings Service Error (toggleSavePost):",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  getSavedPosts: async (): Promise<SavedPostsResponse> => {
    try {
      const response = await API.get("/posts/saved");
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Settings Service Error (getSavedPosts):",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  hidePost: async (postId: string): Promise<ToggleHidePostResponse> => {
    try {
      const token = useAuthStore.getState().token;

      const response = await API.patch(`/posts/${postId}/hide`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Settings Service Error (hidePost):",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  unhidePost: async (postId: string): Promise<ToggleHidePostResponse> => {
    try {
      const token = useAuthStore.getState().token;

      const response = await API.patch(`/posts/${postId}/unhide`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Settings Service Error (unhidePost):",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  getHiddenPosts: async (): Promise<HiddenPostsResponse> => {
    try {
      const response = await API.get("/posts/hidden");
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Settings Service Error (getHiddenPosts):",
        error.response?.data || error.message,
      );
      throw error;
    }
  },
};
