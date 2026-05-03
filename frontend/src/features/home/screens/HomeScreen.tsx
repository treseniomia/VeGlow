import React from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  StatusBar,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import MainHeader from "@/components/MainHeader";
import PostCard from "../components/PostCard";
import { useFetchPosts } from "../hooks/useFetchPosts";
import { VegifyTheme } from "@/constants/theme";
import { homeStyles as styles } from "../styles/homeStyles";

const HomeScreen = () => {
  const { posts, loading, refresh } = useFetchPosts();
  const insets = useSafeAreaInsets();

  if (loading && !posts.length) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: VegifyTheme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={VegifyTheme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" />
      <MainHeader />

      <FlatList
        data={posts as any[]}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
        onRefresh={refresh}
        refreshing={loading}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No daily feed posts yet.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
