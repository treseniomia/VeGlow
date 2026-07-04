import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Text,
  RefreshControl,
} from "react-native";
import { ViewabilityConfig, ViewToken } from "react-native";
import { useFocusEffect } from "expo-router";
import { useFetchReels } from "../hooks/useFetchReels";
import { ReelVideoPlayer } from "../components/ReelVideoPlayer";
import { ReelCommentsBottomSheet } from "../components/ReelCommentsBottomSheet";
import { IReel } from "../types/reels.types";
import { useReelStore } from "../../../services/useReelStore";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const viewabilityConfig: ViewabilityConfig = {
  itemVisiblePercentThreshold: 50,
  minimumViewTime: 300,
};

export const ReelsFeedScreen: React.FC = () => {
  const { reels, loading, error, refetch } = useFetchReels();
  const setReels = useReelStore((state) => state.setReels);
  const [activeIndex, setActiveIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [isScreenFocused, setIsScreenFocused] = useState(true);
  const [commentSheetVisible, setCommentSheetVisible] = useState(false);
  const [selectedReelId, setSelectedReelId] = useState<string | null>(null);

  // Sync reels with store when data changes
  useEffect(() => {
    if (reels.length > 0) {
      setReels(reels);
    }
  }, [reels, setReels]);

  // Pause videos when screen loses focus
  useFocusEffect(
    useCallback(() => {
      setIsScreenFocused(true);
      return () => {
        setIsScreenFocused(false);
      };
    }, []),
  );
  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig,
      onViewableItemsChanged: ({ changed }: { changed: ViewToken[] }) => {
        changed.forEach((item) => {
          if (item.isViewable && item.index !== null) {
            setActiveIndex(item.index);
          }
        });
      },
    },
  ]);

  const handleComment = useCallback((reelId: string) => {
    setSelectedReelId(reelId);
    setCommentSheetVisible(true);
  }, []);

  const handleOptions = useCallback((reelId: string) => {
    console.log("Options for reel:", reelId);
    // Implement options menu logic here
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Error refreshing reels:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const renderItem = useCallback(
    ({ item, index }: { item: IReel; index: number }) => (
      <View style={feedStyles.reelContainer}>
        <ReelVideoPlayer
          reel={item}
          isActive={index === activeIndex && isScreenFocused}
          onComment={handleComment}
          onOptions={handleOptions}
        />
      </View>
    ),
    [activeIndex, isScreenFocused, handleComment, handleOptions],
  );

  if (loading) {
    return (
      <View style={feedStyles.centerContainer}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={feedStyles.centerContainer}>
        <Text style={feedStyles.errorText}>{error}</Text>
      </View>
    );
  }

  if (reels.length === 0) {
    return (
      <View style={feedStyles.centerContainer}>
        <Text style={feedStyles.emptyText}>No reels yet</Text>
      </View>
    );
  }

  return (
    <View style={feedStyles.container}>
      <FlatList
        data={reels}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        pagingEnabled
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        maxToRenderPerBatch={3}
        windowSize={5}
        initialNumToRender={1}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFF"
            colors={["#FFF"]}
            progressBackgroundColor="#000"
          />
        }
      />
      {selectedReelId && (
        <ReelCommentsBottomSheet
          visible={commentSheetVisible}
          reelId={selectedReelId}
          onClose={() => setCommentSheetVisible(false)}
        />
      )}
    </View>
  );
};

const feedStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  reelContainer: {
    width: Dimensions.get("window").width,
    height: SCREEN_HEIGHT,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  errorText: {
    color: "#FF3040",
    fontSize: 16,
    textAlign: "center",
  },
  emptyText: {
    color: "#FFF",
    fontSize: 18,
  },
});
