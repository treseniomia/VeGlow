import API from "../../../api/api";

/**
 * Authentication Service
 * Handles all network requests related to User Identity
 */
export const authService = {
  // Register a new user
  registerUser: async (userData: any) => {
    try {
      const response = await API.post("/auth/register", userData);
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Registration Error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Login existing user
  loginUser: async (userData: any) => {
    try {
      const response = await API.post("/auth/login", userData);
      return response.data;
    } catch (error: any) {
      console.error("❌ Login Error:", error.response?.data || error.message);
      throw error;
    }
  },
};
