// import axios from "axios";
// import { useAuthStore } from "../../../store/useAuthStore";

// const BASE_URL = "https://92a0c67c531743.lhr.life"; // Gamitin ang tunnel URL mo
// const API_URL = `${BASE_URL}/api/posts`;

// export const postService = {
//   publishRecipe: async (formData: any) => {
//     const token = useAuthStore.getState().token;

//     // LOG: Para makita natin ang full path na tinatamaan
//     console.log("🚀 SENDING TO:", API_URL);

//     const response = await axios.post(API_URL, formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json", // Siguraduhin nating JSON ito
//       },
//     });

//     return response.data;
//   },
// };

import API from "../../../api/api"; // I-import yung centralized instance natin
import { useAuthStore } from "../../../store/useAuthStore";

export const postService = {
  publishRecipe: async (formData: any) => {
    try {
      const token = useAuthStore.getState().token;

      // Ang /api/posts ay idurugtong na lang sa baseURL mula sa .env
      const response = await API.post("/api/posts", formData, {
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
