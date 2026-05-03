import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { authService } from "../services/authService";
import { useAuthStore } from "@/store/useAuthStore";

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = useAuthStore((state) => state.login);

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const onLoginPressed = async () => {
    if (!email.trim() || !password.trim()) {
      return Alert.alert("Wait, BOSS!", "Email and Password cannot be empty.");
    }

    if (!validateEmail(email)) {
      return Alert.alert(
        "Invalid Email",
        "Please enter a valid email address."
      );
    }

    setLoading(true);
    try {
      const data = await authService.loginUser({
        email: email.toLowerCase().trim(),
        password: password,
      });

      // CORE LOGIC: Sinigurong 'token' at 'user' details ang kinuha
      // Note: Sa Axios Service, ang 'data' na ang mismong response body
      const { token, _id, name, email: userEmail } = data;

      const userData = {
        _id,
        name,
        email: userEmail,
      };

      // I-save sa SecureStore at Zustand
      await login(userData, token);

      router.replace("/(tabs)");
    } catch (error: any) {
      console.log(
        "Login Error Details:",
        error.response?.data || error.message
      );
      const message =
        error.response?.data?.message || "Incorrect email or password.";
      Alert.alert("Login Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    onLoginPressed,
  };
};
