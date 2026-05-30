// import axios from "axios";
// import * as SecureStore from "expo-secure-store";

// const API = axios.create({
//   baseURL: `${process.env.EXPO_PUBLIC_API_URL}/api`,
//   timeout: 10000,
// });

// // Interceptor para laging may dalang token ang requests
// API.interceptors.request.use(async (config) => {
//   const token = await SecureStore.getItemAsync("userToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default API;

import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL}/api`,
  timeout: 10000,
});

API.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error fetching token from SecureStore", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
