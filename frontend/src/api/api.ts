import axios from "axios";

// Palitan ang IP na 'to ng actual Local IP ng Mac mo
// const API = axios.create({
//   // baseURL: "http://172.20.10.2:5001/api/auth",
//   // baseURL: "https://7e716c78bdd0d1.lhr.life/api/auth",
//   baseURL: process.env.EXPO_PUBLIC_API_URL,
// });

console.log("Checking API URL:", process.env.EXPO_PUBLIC_API_URL);

const API = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL}/api/auth`,
});

export const registerUser = (userData: any) => API.post("/register", userData);
export const loginUser = (userData: any) => API.post("/login", userData);
