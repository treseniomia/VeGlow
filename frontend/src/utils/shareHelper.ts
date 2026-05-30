import { Share, Alert, Platform } from "react-native";
import API from "../api/api";
import Clipboard from "@react-native-clipboard/clipboard";

const DEPLOYED_WEB_URL = "https://vegify-web-preview.vercel.app";

export const handleCopyRecipeLink = async (
  recipeId: string,
  recipeTitle: string,
  onCountUpdate?: (newCount: number) => void
) => {
  const shareUrl = `${DEPLOYED_WEB_URL}/recipe/${recipeId}`;
  const fullTextToShare = `Check out this healthy recipe on Vegify: "${recipeTitle}" 🌿\n\nTry it here: ${shareUrl}`;

  try {
    Clipboard.setString(fullTextToShare);

    const response = await API.patch(`/posts/${recipeId}/share-increment`);

    if (response.data && response.data.success && onCountUpdate) {
      onCountUpdate(response.data.sharesCount);
    }

    Alert.alert(
      "Link Copied!",
      "Recipe details and link copied to clipboard. 🌿"
    );
  } catch (error: any) {
    console.error("Failed copy operation:", error);
    Alert.alert("Error", "Could not copy link to clipboard.");
  }
};

export const handleNativeShareRecipe = async (
  recipeId: string,
  recipeTitle: string,
  onCountUpdate?: (newCount: number) => void
) => {
  const shareUrl = `${DEPLOYED_WEB_URL}/recipe/${recipeId}`;

  const fullTextToShare = `Check out this healthy recipe on Vegify: "${recipeTitle}" 🌿\n\nTry it here: ${shareUrl}`;

  try {
    const result = await Share.share({
      message: fullTextToShare,

      title: `Vegify - ${recipeTitle}`,
    });

    if (result.action === Share.sharedAction) {
      const response = await API.patch(`/posts/${recipeId}/share-increment`);
      if (response.data && response.data.success && onCountUpdate) {
        onCountUpdate(response.data.sharesCount);
      }
    }
  } catch (error: any) {
    console.error("Native share sheet tracking failure:", error);
  }
};
