import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { VegifyTheme } from "../../../constants/theme";
import { router, useRouter } from "expo-router";

const PostCard = ({ post }: { post: any }) => {
  const handleNavigate = () => {
    router.push(`/recipe/${post._id}`);
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: post.mediaUrls && post.mediaUrls[0] }}
          style={styles.image}
        />

        <View style={styles.engagementOverlay}>
          <View style={styles.iconGroup}>
            <TouchableOpacity style={styles.circleIcon}>
              <MaterialCommunityIcons name="leaf" size={24} color="#99CC33" />
            </TouchableOpacity>
            <Text style={styles.countText}>24.5K</Text>
          </View>

          <View style={styles.iconGroup}>
            <TouchableOpacity style={styles.circleIcon}>
              <Ionicons name="chatbubble-outline" size={22} color="white" />
            </TouchableOpacity>
            <Text style={styles.countText}>1.5K</Text>
          </View>

          <View style={styles.iconGroup}>
            <TouchableOpacity style={styles.circleIcon}>
              <Ionicons name="share-social-outline" size={22} color="white" />
            </TouchableOpacity>
            <Text style={styles.countText}>1.2K</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{post.title}</Text>
            <Text style={styles.author}>
              By {post.user?.name || "Vegify User"}
            </Text>
          </View>

          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>4.9</Text>
          </View>
        </View>

        <View style={styles.tagContainer}>
          {post.benefitsList?.slice(0, 2).map((item: any, index: number) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{item.label}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.recipeButton} onPress={handleNavigate}>
          <Text style={styles.recipeButtonText}>View Full Recipe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E2F03",
    borderRadius: 30,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  imageContainer: { height: 350, position: "relative" },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  engagementOverlay: {
    position: "absolute",
    right: 15,
    top: 20,
    alignItems: "center",
  },
  iconGroup: { alignItems: "center", marginBottom: 15 },
  circleIcon: {
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 10,
    borderRadius: 50,
  },
  countText: {
    color: "#99CC33",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
  },
  content: { padding: 20 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: { color: "white", fontSize: 22, fontWeight: "bold" },
  author: { color: "rgba(255,255,255,0.6)", fontSize: 14, marginTop: 4 },
  ratingBadge: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ratingText: { color: "#99CC33", fontWeight: "bold", fontSize: 16 },
  tagContainer: { flexDirection: "row", flexWrap: "wrap", marginVertical: 10 },
  tag: {
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#334411",
  },
  tagText: { color: "#99CC33", fontSize: 12 },
  recipeButton: {
    backgroundColor: "#99CC33",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 15,
  },
  recipeButtonText: { color: "#1A2902", fontWeight: "bold", fontSize: 16 },
});

export default PostCard;
