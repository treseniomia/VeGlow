import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { VegifyTheme } from "@/constants/theme";
import { profileStyles as styles } from "../styles/profileStyles";

interface Props {
  uri?: string;
  name?: string;
  onPress?: () => void;
  loading?: boolean;
  size?: number;
}

export const ProfileAvatar = ({
  uri,
  name,
  onPress,
  loading = false,
  size = 80,
}: Props) => {
  const [imageError, setImageError] = useState(false);
  const borderRadius = size / 2;

  return (
    <TouchableOpacity
      style={[
        styles.avatarPlaceholder,
        { width: size, height: size, borderRadius },
      ]}
      onPress={onPress}
      disabled={loading || !onPress}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : uri && !imageError ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius }}
          onError={() => setImageError(true)} // Fallback if link is broken
        />
      ) : (
        <View
          style={[
            styles.avatarTextContainer,
            {
              backgroundColor: VegifyTheme.colors.primary,
              width: size,
              height: size,
              borderRadius,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <Text
            style={[
              styles.avatarText,
              { fontSize: size * 0.4, color: "white" },
            ]}
          >
            {name?.charAt(0).toUpperCase() || "U"}
          </Text>
        </View>
      )}

      {!loading && onPress && (
        <View
          style={[
            styles.cameraIconBadge,
            { position: "absolute", bottom: 0, right: 0 },
          ]}
        >
          <Ionicons
            name="camera"
            size={size * 0.25}
            color={VegifyTheme.colors.primary}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};
