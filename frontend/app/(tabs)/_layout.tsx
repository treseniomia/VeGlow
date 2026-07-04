import { Tabs } from "expo-router";
import { useState } from "react";
import { VegifyTheme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { CreateBottomSheetModal } from "../../src/features/reels/components/CreateBottomSheetModal";
import { CreateReelFormModal } from "../../src/features/reels/components/CreateReelFormModal";
import { router } from "expo-router";

export default function TabsLayout() {
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isReelFormModalVisible, setReelFormModalVisible] = useState(false);

  const handleSelectReel = () => {
    setReelFormModalVisible(true);
  };

  const handleSelectPost = () => {
    router.push("/(tabs)/post");
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: VegifyTheme.colors.primary,
          tabBarInactiveTintColor: "gray",
          headerShown: false,
          tabBarStyle: {
            backgroundColor: VegifyTheme.colors.background,
            borderTopColor: "#333",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="reels"
          options={{
            title: "Cook",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="videocam-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="post"
          options={{
            title: "Post",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle-outline" size={size} color={color} />
            ),
            tabBarButton: () => (
              <Ionicons
                name="add-circle"
                size={32}
                color={VegifyTheme.colors.primary}
                onPress={() => setCreateModalVisible(true)}
                style={{ marginBottom: 10 }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: "Messages",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubbles-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>

      <CreateBottomSheetModal
        visible={isCreateModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSelectReel={handleSelectReel}
        onSelectPost={handleSelectPost}
      />

      <CreateReelFormModal
        visible={isReelFormModalVisible}
        onClose={() => setReelFormModalVisible(false)}
      />
    </>
  );
}
