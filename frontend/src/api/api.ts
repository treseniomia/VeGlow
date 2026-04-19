// import axios from "axios";

// console.log("Checking API URL:", process.env.EXPO_PUBLIC_API_URL);

// const API = axios.create({
//   baseURL: `${process.env.EXPO_PUBLIC_API_URL}/api/auth`,
// });

// export const registerUser = (userData: any) => API.post("/register", userData);
// export const loginUser = (userData: any) => API.post("/login", userData);

import axios from "axios";

// Kunin ang base URL mula sa .env
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

console.log("📡 API Base URL:", BASE_URL);

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
