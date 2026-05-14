import React, { useRef, useState } from "react";
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { homeStyles as styles } from "../styles/homeStyles";
import { useVideoPlayer, VideoView } from "expo-video";

const { width } = Dimensions.get("window");

const MediaVideoItem = ({
  uri,
  isFocused,
}: {
  uri: string;
  isFocused: boolean;
}) => {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
  });
  React.useEffect(() => {
    isFocused ? player.play() : player.pause();
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

export const RecipeMediaCarousel = ({
  mediaUrls,
  isFocused,
}: {
  mediaUrls: string[];
  isFocused: boolean;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setCurrentIndex(index);
  };

  const renderItem = ({ item }: { item: string }) => {
    const isVideo =
      item.endsWith(".mp4") || item.endsWith(".mov") || item.includes("video");
    return isVideo ? (
      <MediaVideoItem uri={item} isFocused={isFocused} />
    ) : (
      <Image
        source={{ uri: item }}
        style={{ width, height: 400, resizeMode: "cover" }}
      />
    );
  };

  return (
    <View style={{ height: 400, position: "relative" }}>
      <FlatList
        ref={flatListRef}
        data={mediaUrls}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        onMomentumScrollEnd={(e) =>
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width))
        }
        keyExtractor={(_, i) => i.toString()}
      />
      {currentIndex > 0 && (
        <TouchableOpacity
          style={[styles.arrowButton, { left: 10 }]}
          onPress={() => scrollToIndex(currentIndex - 1)}
        >
          <Ionicons name="chevron-back" size={30} color="white" />
        </TouchableOpacity>
      )}
      {currentIndex < mediaUrls.length - 1 && (
        <TouchableOpacity
          style={[styles.arrowButton, { right: 10 }]}
          onPress={() => scrollToIndex(currentIndex + 1)}
        >
          <Ionicons name="chevron-forward" size={30} color="white" />
        </TouchableOpacity>
      )}
      <View style={styles.paginationContainer}>
        {mediaUrls.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, { opacity: i === currentIndex ? 1 : 0.4 }]}
          />
        ))}
      </View>
    </View>
  );
};
