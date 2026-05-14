import React from "react";
import {
  ScrollView,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderWithBack } from "@/components/HeaderWithBack";
import { useFetchPostById } from "../hooks/useFetchPostById";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { homeStyles as styles } from "../styles/homeStyles";
import { RecipeMediaCarousel } from "../components/RecipeMediaCarousel";
import { IPost } from "../types";

interface Props {
  postId: string;
}

const RecipeDetailScreen = ({ postId }: Props) => {
  const { post, loading, error } = useFetchPostById(postId) as {
    post: IPost;
    loading: boolean;
    error: any;
  };
  const isFocused = useIsFocused();

  if (loading)
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
          {post.nutritionList?.map((item, i) => (
            <View key={i} style={styles.nutritionCard}>
              <Text style={styles.nutriLabel}>{item.label}</Text>
              <Text style={styles.nutriValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Benefits</Text>
        <View style={styles.benefitContainer}>
          {post.benefitsList?.map((b, i) => (
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
          {post.ingredients?.map((ing, i) => (
            <View key={i} style={styles.ingredientRow}>
              <Text style={styles.ingredientText}>🌿 {ing}</Text>
            </View>
          ))}
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
