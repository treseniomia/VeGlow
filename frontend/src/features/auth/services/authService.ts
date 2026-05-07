import API from "../../../api/api";

export const authService = {
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
