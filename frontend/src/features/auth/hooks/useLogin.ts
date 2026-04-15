import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { loginUser } from "@/api/api";
import { useAuthStore } from "@/store/useAuthStore";

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Gamitin ang bagong 'login' method na may built-in SecureStore logic
  const login = useAuthStore((state) => state.login);

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const onLoginPressed = async () => {
    // 1. Basic Validations
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
      // 2. API Call sa Backend (Node.js/MongoDB)
      const response = await loginUser({
        email: email.toLowerCase().trim(),
        password: password,
      });

      // 3. Success Handling
      if (response.status === 200 || response.status === 201) {
        // I-destructure ang data base sa format ng backend mo
        // Note: Siniguro nating 'token' at 'user' details ang kinuha
        const { token, _id, name, email: userEmail } = response.data;

        const userData = {
          _id,
          name,
          email: userEmail,
        };

        // 4. ETO ANG MAGIC: I-save sa SecureStore at Zustand
        // Gagamitin ang await para siguradong tapos ang pag-save bago lumipat ng screen
        await login(userData, token);

        // 5. Redirect sa main app
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      console.log("Login Error Details:", error.response?.data);

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
