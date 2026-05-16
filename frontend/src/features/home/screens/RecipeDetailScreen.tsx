import React from "react";
import {
  ScrollView,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderWithBack } from "@/components/HeaderWithBack";
import { useFetchPostById } from "../hooks/useFetchPostById";
import { usePostStore } from "@/services/usePostStore";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { homeStyles as styles } from "../styles/homeStyles";
import { RecipeMediaCarousel } from "../components/RecipeMediaCarousel";
import { IPost } from "../types";

interface Props {
  postId: string;
}

const RecipeDetailScreen = ({ postId }: Props) => {
  const { posts, toggleLikeOptimistic } = usePostStore();
  const { loading, error } = useFetchPostById(postId);
  const isFocused = useIsFocused();

  const post =
    posts.find((p) => p._id === postId) || usePostStore.getState().currentPost;

  const handleLikePress = async () => {
    if (post?._id) {
      await toggleLikeOptimistic(post._id);
    }
  };

  const handleSharePress = async () => {
    try {
      if (post) {
        await Share.share({
          message: `Check out this amazing recipe: ${post.title} on Vegify! 🌿`,
        });
      }
    } catch (err: any) {
      console.error("❌ SHARE_EXECUTION_FAILED:", err.message);
    }
  };

  if (loading && !post)
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <HeaderWithBack title="Recipe Detail" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#99CC33" />
        </View>
      </SafeAreaView>
    );

  if (error || !post)
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <HeaderWithBack title="Recipe Detail" />
        <View style={styles.center}>
          <Text style={{ color: "red" }}>{error || "Recipe not found."}</Text>
        </View>
      </SafeAreaView>
    );
  const circleIconStyle = {
    justifyContent: "center" as const,
    alignItems: "center" as const,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <HeaderWithBack title="Recipe Detail" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <RecipeMediaCarousel mediaUrls={post.mediaUrls} isFocused={isFocused} />

        <View style={styles.headerContent}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{post.prepTime || "0 MINS"}</Text>
          </View>
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.author}>
            ⭐ 4.9 • By {post.user?.name || "Chef"}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Nutritions</Text>
        <View style={styles.nutritionGrid}>
          {post.nutritionList?.map((item: any, i: number) => (
            <View key={i} style={styles.nutritionCard}>
              <Text style={styles.nutriLabel}>{item.label}</Text>
              <Text style={styles.nutriValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Benefits</Text>
        <View style={styles.benefitContainer}>
          {post.benefitsList?.map((b: any, i: number) => (
            <View key={i} style={styles.benefitBadge}>
              <Text style={styles.benefitText}>{b.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Instructions</Text>
        <Text style={styles.instructionsText}>
          {post.instructions || "No instructions provided."}
        </Text>

        <Text style={styles.sectionTitle}>Ingredients</Text>
        <View style={styles.ingredientsCard}>
          {post.ingredients?.map((ing: string, i: number) => (
            <View key={i} style={styles.ingredientRow}>
              <Text style={styles.ingredientText}>🌿 {ing}</Text>
            </View>
          ))}
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            paddingVertical: 14,
            marginHorizontal: 16,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.08)",
            marginBottom: 16,
          }}
        >
          {/* LIKE INTERACTION HANDLER */}
          <TouchableOpacity
            onPress={handleLikePress}
            style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
          >
            <View
              style={[
                circleIconStyle,
                post.isLiked && { backgroundColor: "rgba(153, 204, 51, 0.15)" },
              ]}
            >
              <Ionicons
                name={post.isLiked ? "leaf" : "leaf-outline"}
                size={20}
                color={post.isLiked ? "#99CC33" : "white"}
              />
            </View>
            <Text style={{ color: "white", fontSize: 14, fontWeight: "500" }}>
              {post.likesCount ?? 0}
            </Text>
          </TouchableOpacity>

          {/* COMMENT INTERACTION HANDLER */}
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            onPress={() => console.log("💬 Open Comments Sheets Triggered")}
          >
            <View style={circleIconStyle}>
              <Ionicons name="chatbubble-outline" size={20} color="white" />
            </View>
            <Text style={{ color: "white", fontSize: 14, fontWeight: "500" }}>
              Comment
            </Text>
          </TouchableOpacity>

          {/* SHARE INTERACTION HANDLER */}
          <TouchableOpacity
            onPress={handleSharePress}
            style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
          >
            <View style={circleIconStyle}>
              <Ionicons name="share-social-outline" size={20} color="white" />
            </View>
            <Text style={{ color: "white", fontSize: 14, fontWeight: "500" }}>
              Share
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.cookButton}>
            <MaterialCommunityIcons
              name="silverware-fork-knife"
              size={20}
              color="black"
            />
            <Text style={styles.cookButtonText}>COOK MODE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addMealButton}>
            <Ionicons name="bookmark-outline" size={18} color="#99CC33" />
            <Text style={styles.addMealText}>Add to Meal Plan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RecipeDetailScreen;
