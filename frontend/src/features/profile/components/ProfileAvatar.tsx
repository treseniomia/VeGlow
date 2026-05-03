import React from "react";
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
  const borderRadius = size / 2;

  return (
    <TouchableOpacity
      style={[
        styles.avatarPlaceholder,
        { width: size, height: size, borderRadius: borderRadius },
      ]}
      onPress={onPress}
      disabled={loading || !onPress}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : uri ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius: borderRadius }}
        />
      ) : (
        <Text style={[styles.avatarText, { fontSize: size * 0.4 }]}>
          {name?.charAt(0) || "U"}
        </Text>
      )}

      {size > 50 && (
        <View style={styles.cameraIconBadge}>
          <Ionicons
            name="camera"
            size={size * 0.2}
            color={VegifyTheme.colors.primary}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};
