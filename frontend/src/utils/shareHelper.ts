// import { Share, Alert, Platform, Clipboard } from "react-native";
// // ✅ FIX: Gumagamit na ngayon ng core React Native Clipboard para hindi na maghanap ng 'ExpoClipboard' module
// import API from "../api/api";

// const DEPLOYED_WEB_URL = "https://vegify-web-preview.vercel.app";

// /**
//  * ACTION 1: Pure Clipboard Copy Action (Selyadong Pag-increment)
//  * 🛠️ UPDATE: Binago ang string mapping content format para sumunod sa eksaktong templated structural guide patterns na gusto mo.
//  */
// export const handleCopyRecipeLink = async (
//   recipeId: string,
//   recipeTitle: string, // 🛠️ UPDATE: Idinagdag ang recipeTitle sa parameter execution stream profile para sa dynamic injection mapping template configuration matrix layouts
//   onCountUpdate?: (newCount: number) => void
// ) => {
//   // 🛠️ UPDATE: Templated exact identical content string logic mapping build matrix layout para maging uniform ang system profile layout
//   const shareUrl = `${DEPLOYED_WEB_URL}/recipe/${recipeId}`;
//   const fullTextToShare = `Check out this healthy recipe on Vegify: "${recipeTitle}" 🌿\n\nTry it here: ${shareUrl}`;

//   try {
//     // ✅ FIX: Ginamit ang core string setter mechanism nang walang kinakailangang native configuration upgrades
//     // 🛠️ UPDATE: Ang kinokopya na ngayon ay ang buong structural form text value array string sequence array sequence wrapper index asset elements structure container block framework body
//     Clipboard.setString(fullTextToShare);

//     // Patch operation sa backend kapag click command ang binitawan ng user
//     const response = await API.patch(`/posts/${recipeId}/share-increment`);

//     if (response.data && response.data.success && onCountUpdate) {
//       onCountUpdate(response.data.sharesCount);
//     }

//     Alert.alert(
//       "Link Copied!",
//       "Recipe details and link copied to clipboard. 🌿"
//     );
//   } catch (error: any) {
//     console.error("Failed copy operation:", error);
//     Alert.alert("Error", "Could not copy link to clipboard.");
//   }
// };

// /**
//  * ACTION 2: Native OS Share Sheet Interceptor Fallback
//  * 🛠️ UPDATE: Inalis ang platform division switch conditions para pilitin ang iOS/Android native sheet wrappers na isubo ang link mismo sa string format interface sequences block ng message system content.
//  */
// export const handleNativeShareRecipe = async (
//   recipeId: string,
//   recipeTitle: string,
//   onCountUpdate?: (newCount: number) => void
// ) => {
//   const shareUrl = `${DEPLOYED_WEB_URL}/recipe/${recipeId}`;

//   // 🛠️ UPDATE: Parehong-pareho na ang output configuration parameters nito sa ginagawa ng dynamic custom fallback clipboard engine core natin sa itaas
//   const fullTextToShare = `Check out this healthy recipe on Vegify: "${recipeTitle}" 🌿\n\nTry it here: ${shareUrl}`;

//   try {
//     const result = await Share.share({
//       // 🛠️ UPDATE: Pinilit ang build matrix strings na gamitin ang full single content text block sa iOS man o Android para hindi lamunin ng Messenger/FB share interface interceptors ang URL links parameter value profiles element containers
//       message: fullTextToShare,
//       url: Platform.OS === "ios" ? shareUrl : undefined, // Iniiwan itong raw fallback descriptor module indicator tag para sa default iOS core system presentation preview asset components controllers
//       title: `Vegify - ${recipeTitle}`,
//     });

//     if (result.action === Share.sharedAction) {
//       const response = await API.patch(`/posts/${recipeId}/share-increment`);
//       if (response.data && response.data.success && onCountUpdate) {
//         onCountUpdate(response.data.sharesCount);
//       }
//     }
//   } catch (error: any) {
//     console.error("Native share sheet tracking failure:", error);
//   }
// };

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
