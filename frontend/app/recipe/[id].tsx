import React from "react";
import { useLocalSearchParams } from "expo-router";
import RecipeDetailScreen from "@/features/home/screens/RecipeDetailScreen";

export default function RecipeRoute() {
  const { id } = useLocalSearchParams();

  return <RecipeDetailScreen postId={id as string} />;
}
