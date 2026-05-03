import React, { useEffect } from "react";
import {
  ScrollView,
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderWithBack } from "@/components/HeaderWithBack";
import { useFetchPostById } from "../hooks/useFetchPostById";
import { useVideoPlayer, VideoView } from "expo-video";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

const { width } = Dimensions.get("window");

interface Props {
  postId: string;
}

const MediaVideoItem = ({
  uri,
  isFocused,
}: {
  uri: string;
  isFocused: boolean;
}) => {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
  });

  useEffect(() => {
    if (isFocused) {
      player.play();
    } else {
      player.pause();
    }
  }, [isFocused, player]);

  return (
    <VideoView
      player={player}
      style={{ width, height: 400 }}
      contentFit="cover"
      nativeControls={false}
    />
  );
};

const RecipeDetailScreen = ({ postId }: Props) => {
  const { post, loading, error } = useFetchPostById(postId);
  const isFocused = useIsFocused();
  const flatListRef = React.useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <HeaderWithBack title="Recipe Detail" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#99CC33" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !post) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <HeaderWithBack title="Recipe Detail" />
        <View style={styles.center}>
          <Text style={{ color: "red" }}>{error || "Recipe not found."}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const scrollToIndex = (index: number) => {
    if (index >= 0 && index < (post.mediaUrls?.length || 0)) {
      flatListRef.current?.scrollToIndex({ index, animated: true });
      setCurrentIndex(index);
    }
  };

  const renderMediaItem = ({ item }: { item: string }) => {
    const isVideo =
      item.endsWith(".mp4") || item.endsWith(".mov") || item.includes("video");

    if (isVideo) {
      return <MediaVideoItem uri={item} isFocused={isFocused} />;
    }

    return (
      <Image
        source={{ uri: item }}
        style={{ width, height: 400, resizeMode: "cover" }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <HeaderWithBack title="Recipe Detail" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ height: 400, position: "relative" }}>
          <FlatList
            ref={flatListRef}
            data={post.mediaUrls || []}
            renderItem={renderMediaItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const newIndex = Math.round(
                e.nativeEvent.contentOffset.x / width
              );
              setCurrentIndex(newIndex);
            }}
            keyExtractor={(_, index) => index.toString()}
          />

          {currentIndex > 0 && (
            <TouchableOpacity
              style={[styles.arrowButton, { left: 10 }]}
              onPress={() => scrollToIndex(currentIndex - 1)}
            >
              <Ionicons name="chevron-back" size={30} color="white" />
            </TouchableOpacity>
          )}

          {post.mediaUrls &&
            post.mediaUrls.length > 1 &&
            currentIndex < post.mediaUrls.length - 1 && (
              <TouchableOpacity
                style={[styles.arrowButton, { right: 10 }]}
                onPress={() => scrollToIndex(currentIndex + 1)}
              >
                <Ionicons name="chevron-forward" size={30} color="white" />
              </TouchableOpacity>
            )}

          <View style={styles.paginationContainer}>
            {post.mediaUrls?.map((_: any, i: number) => (
              <View
                key={i}
                style={[styles.dot, { opacity: i === currentIndex ? 1 : 0.4 }]}
              />
            ))}
          </View>
        </View>

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
          {post.nutritionList?.map((item: any, index: number) => (
            <View key={index} style={styles.nutritionCard}>
              <Text style={styles.nutriLabel}>{item.label}</Text>
              <Text style={styles.nutriValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Benefits</Text>
        <View style={styles.benefitContainer}>
          {post.benefitsList?.map((benefit: any, index: number) => (
            <View key={index} style={styles.benefitBadge}>
              <Text style={styles.benefitText}>{benefit.label || benefit}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Instructions</Text>
        <Text style={styles.instructionsText}>
          {post.instructions || "No instructions provided."}
        </Text>

        <Text style={styles.sectionTitle}>Ingredients</Text>
        <View style={styles.ingredientsCard}>
          {post.ingredients?.map((ing: string, index: number) => (
            <View key={index} style={styles.ingredientRow}>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1A2902" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { paddingBottom: 40 },
  headerContent: { padding: 20 },
  badge: {
    backgroundColor: "#2D3E10",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  badgeText: { color: "#99CC33", fontWeight: "bold", fontSize: 12 },
  title: { color: "white", fontSize: 32, fontWeight: "bold" },
  author: { color: "#A0A0A0", marginTop: 5, fontSize: 14 },
  sectionTitle: {
    color: "#99CC33",
    fontSize: 22,
    fontWeight: "bold",
    paddingHorizontal: 20,
    marginTop: 25,
  },
  nutritionGrid: { flexDirection: "row", flexWrap: "wrap", padding: 15 },
  nutritionCard: {
    backgroundColor: "#2D3E10",
    width: "45%",
    margin: "2.5%",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
  },
  nutriLabel: { color: "#A0A0A0", fontSize: 12, textTransform: "uppercase" },
  nutriValue: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
  benefitContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  benefitBadge: {
    backgroundColor: "#25330B",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  benefitText: { color: "#99CC33", fontSize: 13 },
  instructionsText: {
    color: "#E0E0E0",
    paddingHorizontal: 20,
    marginTop: 10,
    lineHeight: 22,
    fontSize: 15,
  },
  ingredientsCard: {
    backgroundColor: "#25330B",
    margin: 20,
    padding: 20,
    borderRadius: 25,
  },
  ingredientRow: {
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#3A4D1A",
  },
  ingredientText: { color: "white", fontSize: 16 },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    width: "100%",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#99CC33",
    marginHorizontal: 4,
  },
  arrowButton: {
    position: "absolute",
    top: "45%",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 25,
    padding: 8,
    zIndex: 10,
  },
  actionContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
    alignItems: "center",
  },
  cookButton: {
    backgroundColor: "#99CC33",
    flexDirection: "row",
    width: "100%",
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  cookButtonText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  addMealButton: { flexDirection: "row", marginTop: 20, alignItems: "center" },
  addMealText: {
    color: "#99CC33",
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default RecipeDetailScreen;
