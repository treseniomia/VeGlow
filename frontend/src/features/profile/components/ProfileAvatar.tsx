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
  onPress: () => void;
  loading: boolean;
}

export const ProfileAvatar = ({ uri, name, onPress, loading }: Props) => (
  <TouchableOpacity
    style={styles.avatarPlaceholder}
    onPress={onPress}
    disabled={loading}
  >
    {loading ? (
      <ActivityIndicator color="white" />
    ) : uri ? (
      <Image
        source={{ uri }}
        style={{ width: 80, height: 80, borderRadius: 40 }}
      />
    ) : (
      <Text style={styles.avatarText}>{name?.charAt(0) || "U"}</Text>
    )}
    <View style={styles.cameraIconBadge}>
      <Ionicons name="camera" size={16} color={VegifyTheme.colors.primary} />
    </View>
  </TouchableOpacity>
);
