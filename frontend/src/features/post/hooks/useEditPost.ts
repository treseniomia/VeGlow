import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { postService } from "../services/postService";
import { uploadToCloudinary } from "../../../services/cloudinary.service";
import { MediaItem, PostFormData } from "../types";
import { useRouter } from "expo-router";

export const useEditPost = (postId: string) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isModalVisible, setModalVisible] = useState(false);
  const [isBenefitModalVisible, setBenefitModalVisible] = useState(false);

  const [form, setForm] = useState<PostFormData>({
    title: "",
    prepTime: "",
    instructions: "",
    ingredients: "",
    nutritionList: [],
    benefitsList: [],
    media: [],
  });

  useEffect(() => {
    const loadPostData = async () => {
      try {
        const data = await postService.getPostById(postId);
        setForm({
          title: data.title || "",
          prepTime: data.prepTime || "",
          instructions: data.instructions || "",
          ingredients: Array.isArray(data.ingredients)
            ? data.ingredients.join(", ")
            : "",
          nutritionList: data.nutritionList || [],
          benefitsList: data.benefitsList || [],
          media: data.mediaUrls
            ? data.mediaUrls.map((url: string) => ({
                uri: url,
                type: "image",
              }))
            : [],
        });
      } catch (err) {
        Alert.alert("Error", "Hindi ma-load ang recipe data.");
      } finally {
        setLoading(false);
      }
    };
    loadPostData();
  }, [postId]);

  const updateField = (field: keyof PostFormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    if (!form.title || !form.instructions || !form.ingredients) {
      Alert.alert(
        "Oops!",
        "Pakikumpleto ang Title, Instructions, at Ingredients."
      );
      return;
    }

    setSaving(true);
    try {
      const uploadPromises = form.media.map((item) => {
        if (item.uri.startsWith("http")) return item.uri;
        return uploadToCloudinary(item.uri, item.type);
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      const cleanNutrition = form.nutritionList.map((n) => ({
        label: String(n.label),
        value: String(n.value),
      }));

      const cleanBenefits = form.benefitsList.map((b) => ({
        label: String(b.label),
        value: b.value && b.value.trim() !== "" ? String(b.value) : "Verified",
      }));

      const payload = {
        title: form.title,
        prepTime: form.prepTime,
        instructions: form.instructions,
        ingredients: form.ingredients
          .split(/[\n,]+/)
          .map((i) => i.trim())
          .filter((i) => i.length > 0),
        nutritionList: cleanNutrition,
        benefitsList: cleanBenefits,
        mediaUrls: uploadedUrls,
      };

      await postService.updateRecipe(postId, payload);

      Alert.alert("Success!", "Recipe updated na, BOSS!", [
        {
          text: "OK",
          onPress: () => router.replace("/(tabs)/profile"),
        },
      ]);
    } catch (error: any) {
      console.error("❌ UPDATE FAIL:", error.response?.data || error.message);
      Alert.alert(
        "Error",
        "Failed to update recipe. Something is wrong with the data format."
      );
    } finally {
      setSaving(false);
    }
  };

  return {
    form,
    loading,
    saving,
    updateField,
    handleUpdate,
    isModalVisible,
    setModalVisible,
    isBenefitModalVisible,
    setBenefitModalVisible,
  };
};
