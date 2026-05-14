import React from "react";
import { useLocalSearchParams } from "expo-router";
import EditPostScreen from "@/features/post/screens/EditPostScreen";

export default function EditRecipeRoute() {
  const { id } = useLocalSearchParams();

  return <EditPostScreen postId={id as string} />;
}
