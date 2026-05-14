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
import { useProfile } from "../hooks/useProfile";
import { useUserPosts } from "../../post/hooks/useUserPosts";
import { profileStyles as styles } from "../styles/profileStyles";
import { ProfileAvatar } from "../components/ProfileAvatar";
import { VegifyTheme } from "@/constants/theme";
import { useRouter } from "expo-router";
import RBSheet from "react-native-raw-bottom-sheet";
import { profileService } from "../services/profileService";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = width / 3;

interface UserPost {
  _id: string;
  mediaUrls: string[];
  title: string;
}

export const ProfileScreen = () => {
  const router = useRouter();
  const refRBSheet = useRef<any>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const { user, takeProfilePhoto, pickImageFromGallery, updating } =
    useProfile();
  const { posts, loading, refresh } = useUserPosts();

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
      ]
    );
  };

  const onLongPressPost = (postId: string) => {
    setSelectedPostId(postId);
    refRBSheet.current?.open();
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
      ]
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
        <Text style={styles.userName}>{user?.name || "User"}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      {/* 2. STATS SECTION */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          paddingVertical: 20,
          borderBottomWidth: 0.5,
          borderBottomColor: "#2C3E1D",
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
            {posts?.length || 0}
          </Text>
          <Text style={{ color: "#A9A9A9", fontSize: 12 }}>Posts</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
            1.2k
          </Text>
          <Text style={{ color: "#A9A9A9", fontSize: 12 }}>Followers</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
            482
          </Text>
          <Text style={{ color: "#A9A9A9", fontSize: 12 }}>Following</Text>
        </View>
      </View>

      {/* 3. POSTS GRID */}
      {loading && (!posts || posts.length === 0) ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator color={VegifyTheme.colors.primary} size="large" />
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
      )}

      {/* 4. BOTTOM SHEET */}
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
    </View>
  );
};
