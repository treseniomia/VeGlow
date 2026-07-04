import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  FlatList,
  Image,
  Alert,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { useProfile } from "../hooks/useProfile";
import { useUserPosts } from "../../post/hooks/useUserPosts";
import { profileStyles as styles } from "../styles/profileStyles";
import { ProfileAvatar } from "../components/ProfileAvatar";
import { VegifyTheme } from "@/constants/theme";
import { useRouter } from "expo-router";
import RBSheet from "react-native-raw-bottom-sheet";
import { profileService } from "../services/profileService";
import { useUserReels } from "../../reels/hooks/useUserReels";
import { Ionicons } from "@expo/vector-icons";
import { ReelOptionsModal } from "../components/ReelOptionsModal";
import { UserPost } from "./types/index";
import { IReel } from "../../reels/types/reels.types";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = width / 3;

const ReelVideoPreview = ({ videoUrl }: { videoUrl: string }) => {
  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = true;
    player.muted = true;
  });

  return (
    <VideoView
      style={{ flex: 1 }}
      player={player}
      contentFit="cover"
      nativeControls={false}
    />
  );
};

export const ProfileScreen = () => {
  const router = useRouter();
  const refRBSheet = useRef<any>(null);
  const refReelRBSheet = useRef<any>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedReelId, setSelectedReelId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"posts" | "reels">("posts");

  const { user, takeProfilePhoto, pickImageFromGallery, updating } =
    useProfile();
  const { posts, loading, refresh } = useUserPosts();
  const {
    reels,
    loading: reelsLoading,
    refresh: refreshReels,
  } = useUserReels();

  useEffect(() => {
    console.log("Current User in Profile Screen:", user);
  }, [user]);

  const handleEditPhoto = () => {
    Alert.alert(
      "Update Profile Picture",
      "Saan mo gustong kumuha ng bagong photo, BOSS?",
      [
        { text: "📷 Take Photo", onPress: takeProfilePhoto },
        { text: "🖼️ Choose from Gallery", onPress: pickImageFromGallery },
        { text: "Cancel", style: "cancel" },
      ],
    );
  };

  const onLongPressPost = (postId: string) => {
    setSelectedPostId(postId);
    refRBSheet.current?.open();
  };

  const onLongPressReel = (reelId: string) => {
    setSelectedReelId(reelId);
    refReelRBSheet.current?.open();
  };

  const handleDeletePress = () => {
    refRBSheet.current?.close();

    Alert.alert(
      "Delete Recipe",
      "Are you sure you want to delete this recipe? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              if (selectedPostId) {
                await profileService.deletePost(selectedPostId);
                refresh();
                console.log("✅ Post deleted successfully!");
              }
            } catch (error) {
              console.error("❌ Delete Error:", error);
            }
          },
        },
      ],
    );
  };

  const renderPostItem = ({ item }: { item: UserPost }) => (
    <TouchableOpacity
      style={{ width: COLUMN_WIDTH, height: COLUMN_WIDTH, padding: 1 }}
      onPress={() => router.push(`/recipe/${item._id}`)}
      onLongPress={() => onLongPressPost(item._id)}
    >
      <Image
        source={{ uri: item.mediaUrls[0] }}
        style={{ flex: 1, backgroundColor: "#2C3E1D" }}
      />
    </TouchableOpacity>
  );

  const renderReelItem = ({ item }: { item: IReel }) => (
    <TouchableOpacity
      style={{ width: COLUMN_WIDTH, height: COLUMN_WIDTH, padding: 1 }}
      onPress={() => router.push(`/reel/edit/${item._id}`)}
      onLongPress={() => onLongPressReel(item._id)}
    >
      <View
        style={{ flex: 1, backgroundColor: "#2C3E1D", position: "relative" }}
      >
        <ReelVideoPreview videoUrl={item.videoUrl} />
        <View
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: 10,
            padding: 4,
          }}
        >
          <Ionicons name="videocam" size={12} color="#FFF" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 1. HEADER SECTION */}
      <View style={styles.header}>
        <ProfileAvatar
          uri={user?.profilePicture}
          name={user?.name}
          onPress={handleEditPhoto}
          loading={updating}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name || "User"}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {(posts?.length || 0) + (reels?.length || 0)}
              </Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1.2k</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>482</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 2. TAB NAVIGATION */}
      <View
        style={{
          flexDirection: "row",
          borderBottomWidth: 0.5,
          borderBottomColor: "#2C3E1D",
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 12,
            alignItems: "center",
            borderBottomWidth: activeTab === "posts" ? 2 : 0,
            borderBottomColor:
              activeTab === "posts" ? "#4CAF50" : "transparent",
          }}
          onPress={() => setActiveTab("posts")}
        >
          <Ionicons
            name="grid-outline"
            size={24}
            color={activeTab === "posts" ? "#4CAF50" : "#A9A9A9"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 12,
            alignItems: "center",
            borderBottomWidth: activeTab === "reels" ? 2 : 0,
            borderBottomColor:
              activeTab === "reels" ? "#4CAF50" : "transparent",
          }}
          onPress={() => setActiveTab("reels")}
        >
          <Ionicons
            name="videocam-outline"
            size={24}
            color={activeTab === "reels" ? "#4CAF50" : "#A9A9A9"}
          />
        </TouchableOpacity>
      </View>

      {/* 4. CONTENT GRID */}
      {activeTab === "posts" ? (
        loading && (!posts || posts.length === 0) ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator
              color={VegifyTheme.colors.primary}
              size="large"
            />
          </View>
        ) : (
          <FlatList
            data={posts}
            renderItem={renderPostItem}
            keyExtractor={(item: UserPost) => item._id}
            numColumns={3}
            onRefresh={refresh}
            refreshing={loading}
            contentContainerStyle={{ flexGrow: 1 }}
            ListEmptyComponent={
              <View
                style={{
                  marginTop: 100,
                  alignItems: "center",
                  paddingHorizontal: 40,
                }}
              >
                <Text
                  style={{ color: "#555", textAlign: "center", fontSize: 16 }}
                >
                  Walang posts pa, BOSS. Simulan mo na ang pagluluto! 🌿
                </Text>
              </View>
            }
          />
        )
      ) : reelsLoading && (!reels || reels.length === 0) ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator color={VegifyTheme.colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={reels}
          renderItem={renderReelItem}
          keyExtractor={(item: IReel) => item._id}
          numColumns={3}
          onRefresh={refreshReels}
          refreshing={reelsLoading}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={
            <View
              style={{
                marginTop: 100,
                alignItems: "center",
                paddingHorizontal: 40,
              }}
            >
              <Text
                style={{ color: "#555", textAlign: "center", fontSize: 16 }}
              >
                Walang reels pa, BOSS. I-record mo na ang unang reel mo! 🎬
              </Text>
            </View>
          }
        />
      )}

      {/* 4. BOTTOM SHEET FOR POSTS */}
      <RBSheet
        ref={refRBSheet}
        draggable={true}
        closeOnPressMask={true}
        height={200}
        customStyles={{
          wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
          draggableIcon: { backgroundColor: "#555" },
          container: {
            backgroundColor: "#1A260F",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}
      >
        <View style={{ padding: 20 }}>
          {/* OPTION 1: EDIT */}
          <TouchableOpacity
            style={{ paddingVertical: 10 }}
            onPress={() => {
              refRBSheet.current?.close();
              router.push({
                pathname: "/recipe/edit/[id]",
                params: { id: selectedPostId },
              });
            }}
          >
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
              ✏️ Edit Recipe
            </Text>
          </TouchableOpacity>

          <View
            style={{
              height: 1,
              backgroundColor: "#2C3E1D",
              marginVertical: 15,
            }}
          />

          {/* OPTION 2: DELETE */}
          <TouchableOpacity
            style={{ paddingVertical: 10 }}
            onPress={handleDeletePress}
          >
            <Text style={{ color: "#FF4444", fontSize: 18, fontWeight: "600" }}>
              🗑️ Delete Recipe
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>

      {/* 5. BOTTOM SHEET FOR REELS */}
      <ReelOptionsModal
        ref={refReelRBSheet}
        reelId={selectedReelId}
        onClose={() => setSelectedReelId(null)}
        onRefresh={refreshReels}
      />
    </View>
  );
};
