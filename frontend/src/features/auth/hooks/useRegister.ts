import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { registerUser } from "@/api/api";
import { useAuthStore } from "@/store/useAuthStore";

export const useRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  // Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", text: "" });

  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const openLegal = (type: "tos" | "privacy") => {
    if (type === "tos") {
      setModalContent({
        title: "Terms of Service",
        text: "Welcome to Vegify. By using our app, you agree to post only fresh vegetable content...",
      });
    } else {
      setModalContent({
        title: "Privacy Policy",
        text: "We value your privacy. Your data is used only for delivery and healthy living tips...",
      });
    }
    setModalVisible(true);
  };

  const onRegisterPressed = async () => {
    if (!name || !email || !password || !confirmPassword) {
      return Alert.alert("Wait, BOSS!", "Please fill in all fields.");
    }
    if (password !== confirmPassword) {
      return Alert.alert("Error", "Passwords do not match.");
    }
    if (!isAgreed) {
      return Alert.alert(
        "Wait!",
        "You must agree to the Terms and Conditions."
      );
    }

    setLoading(true);
    try {
      const response = await registerUser({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
      });

      if (response.status === 201 || response.status === 200) {
        const { token, _id, name: userName, email: userEmail } = response.data;
        await login({ _id, name: userName, email: userEmail }, token);
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Registration failed.";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    isAgreed,
    setIsAgreed,
    modalVisible,
    setModalVisible,
    modalContent,
    openLegal,
    onRegisterPressed,
  };
};
