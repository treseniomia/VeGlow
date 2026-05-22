import React from "react";
import {
  View,
  Text,
  Image,
  StyleProp,
  ViewStyle,
  ImageStyle,
  TextStyle,
} from "react-native";
import { styles } from "../styles/commentStyles";

interface UserAvatarProps {
  size?: number;
  uri?: string;
  name: string;
  style?: StyleProp<ViewStyle>;
}

export const UserAvatarFallback: React.FC<UserAvatarProps> = ({
  size = 36,
  uri,
  name,
  style,
}) => {
  const initial = name ? name.charAt(0).toUpperCase() : "?";
  const radius = size / 2;

  if (uri && uri.trim() !== "" && !uri.includes("placeholder")) {
    return (
      <Image
        source={{ uri }}
        style={[
          styles.avatarContainer,
          styles.avatarImage,
          { width: size, height: size, borderRadius: radius },
          style as unknown as StyleProp<ImageStyle>,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.avatarContainer,
        { width: size, height: size, borderRadius: radius },
        style,
      ]}
    >
      <Text style={[styles.avatarText, { fontSize: size * 0.4 }]}>
        {initial}
      </Text>
    </View>
  );
};
