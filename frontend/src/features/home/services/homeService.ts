import api from "../../../api/api";

export const homeService = {
  getAllPosts: async () => {
    const response = await api.get("/posts");
    return response.data;
  },

  getPostById: async (id: string) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },
};
