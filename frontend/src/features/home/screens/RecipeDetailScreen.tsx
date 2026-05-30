import React, { useState, useRef } from "react";
import {
  ScrollView,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Pressable,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderWithBack } from "@/components/HeaderWithBack";
import { useFetchPostById } from "../hooks/useFetchPostById";
import { usePostStore } from "@/services/usePostStore";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import { homeStyles as styles } from "../styles/homeStyles";
import { RecipeMediaCarousel } from "../components/RecipeMediaCarousel";
import { IPost } from "../types";
import {
  handleCopyRecipeLink,
  handleNativeShareRecipe,
} from "@/utils/shareHelper";

interface Props {
  postId: string;
}

const RecipeDetailScreen = ({ postId }: Props) => {
  const { posts, toggleLikeOptimistic } = usePostStore();
  const { loading, error } = useFetchPostById(postId);
  const isFocused = useIsFocused();

  const [shareMenuVisible, setShareMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;

  const post =
    posts.find((p) => p._id === postId) || usePostStore.getState().currentPost;

  const handleLikePress = async () => {
    if (post?._id) {
      await toggleLikeOptimistic(post._id);
    }
  };

  const openShareMenu = () => {
    setShareMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeShareMenu = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setShareMenuVisible(false));
  };

  const handleNavigateComments = () => {
    if (post?._id) {
      router.push(`/comment/${post._id}`);
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
          <TouchableOpacity
            onPress={handleLikePress}
            style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            activeOpacity={0.7}
          >
            <View style={localStyles.circleIconLayoutWrapper}>
              <View style={{ transform: [{ scaleX: -1 }] }}>
                <Ionicons
                  name={post.isLiked ? "leaf" : "leaf-outline"}
                  size={20}
                  color={post.isLiked ? "#99CC33" : "white"}
                />
              </View>
            </View>

            <Text style={{ color: "white", fontSize: 14, fontWeight: "500" }}>
              {post.likesCount ?? 0}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            onPress={handleNavigateComments}
          >
            <View style={localStyles.circleIconLayoutWrapper}>
              <Ionicons name="chatbubble-outline" size={20} color="white" />
            </View>
            <Text style={{ color: "white", fontSize: 14, fontWeight: "500" }}>
              {post.commentsCount ?? 0}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openShareMenu}
            activeOpacity={0.7}
            style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
          >
            <View style={localStyles.circleIconLayoutWrapper}>
              <Ionicons name="share-social-outline" size={20} color="#ffffff" />
            </View>

            <Text style={{ color: "white", fontSize: 14, fontWeight: "500" }}>
              {post?.sharesCount || 0}
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

      <Modal
        visible={shareMenuVisible}
        transparent
        animationType="none"
        onRequestClose={closeShareMenu}
      >
        <Pressable style={localStyles.modalOverlay} onPress={closeShareMenu}>
          <Animated.View
            style={[
              localStyles.slidingSheetContainer,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={localStyles.sheetHandleIndicator} />
            <Text style={localStyles.sheetHeaderTitle}>Share Recipe</Text>

            <TouchableOpacity
              style={localStyles.sheetActionButtonRow}
              onPress={() => {
                closeShareMenu();
                handleCopyRecipeLink(post._id, post.title, (newCount) => {
                  post.sharesCount = newCount;
                });
              }}
            >
              <View style={localStyles.actionIconContainer}>
                <Ionicons name="link-outline" size={20} color="#99CC33" />
              </View>
              <Text style={localStyles.actionButtonLabelText}>
                Copy Recipe Link
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={localStyles.sheetActionButtonRow}
              onPress={() => {
                closeShareMenu();
                handleNativeShareRecipe(post._id, post.title, (newCount) => {
                  post.sharesCount = newCount;
                });
              }}
            >
              <View style={localStyles.actionIconContainer}>
                <Ionicons name="apps-outline" size={20} color="#99CC33" />
              </View>
              <Text style={localStyles.actionButtonLabelText}>
                Share via other Apps
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  circleIconLayoutWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  slidingSheetContainer: {
    backgroundColor: "#162202",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  sheetHandleIndicator: {
    width: 40,
    height: 5,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 20,
  },
  sheetHeaderTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  sheetActionButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.02)",
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(153, 204, 51, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  actionButtonLabelText: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
  },
});

export default RecipeDetailScreen;
