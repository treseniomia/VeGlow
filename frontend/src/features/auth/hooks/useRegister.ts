import { useState } from "react";
import { Alert } from "react-native";
import { registerUser } from "@/api/api";
import { LegalContent, LegalType } from "../types/authTypes";

export const useRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<LegalContent>({
    title: "",
    text: "",
  });

  const openLegal = (type: LegalType) => {
    if (type === "tos") {
      setModalContent({
        title: "Terms of Service",
        text: "Welcome to Vegify! By using this app, you agree to: \n\n1. Provide accurate information. \n2. Respect delivery schedules. \n3. Enjoy the freshest vegetables in Pangasinan!",
      });
    } else {
      setModalContent({
        title: "Privacy Policy",
        text: "Your privacy is our priority, BOSS. \n\nWe only collect your data to ensure fresh delivery.",
      });
    }
    setModalVisible(true);
  };

  const onRegisterPressed = async () => {
    if (!name || !email || !password || !confirmPassword) {
      return Alert.alert("Wait, BOSS!", "Please fill in all fields.");
    }
    if (!isAgreed) {
      return Alert.alert(
        "Legal Check",
        "Please agree to the Terms of Service."
      );
    }
    if (password !== confirmPassword) {
      return Alert.alert("Oops!", "Passwords do not match.");
    }
    if (password.length < 8) {
      return Alert.alert("Security Alert", "Minimum 8 characters required.");
    }

    setLoading(true);
    try {
      await registerUser({ name, email, password });
      Alert.alert("Success 🎉", "Account created successfully, BOSS!");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setIsAgreed(false);
    } catch (error: any) {
      const message = error.response?.data?.message || "Something went wrong.";
      Alert.alert("Error", message);
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
