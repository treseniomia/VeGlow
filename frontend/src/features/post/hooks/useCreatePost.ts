import { useState } from "react";
import { Alert } from "react-native";
import { PostFormData } from "../types";
import { postService } from "../services/postService";

export const useCreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  // Dynamic list for nutrients
  const [nutritions, setNutritions] = useState<
    { label: string; value: string }[]
  >([]);

  const [form, setForm] = useState<PostFormData>({
    title: "",
    prepTime: "",
    instructions: "",
    ingredients: "",
    calories: "0",
    protein: "0",
  });

  const updateField = (field: keyof PostFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addNutrition = (label: string, value: string) => {
    setNutritions((prev) => [...prev, { label, value }]);
  };

  const handlePublish = async () => {
    if (!form.title || !form.instructions) {
      Alert.alert("Ops!", "Kailangan ng Title at Instructions.");
      return;
    }

    setLoading(true);
    try {
      // Isama natin ang nutritions array sa payload pag-send sa backend
      const payload = { ...form, nutritionList: nutritions };
      await postService.publishRecipe(payload as any);

      Alert.alert("Success!", "Recipe published na, BOSS!");
    } catch (error) {
      Alert.alert("Error", "Hindi na-save ang recipe.");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    updateField,
    handlePublish,
    nutritions,
    isModalVisible,
    setModalVisible,
    addNutrition,
  };
};
