import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { VegifyTheme } from "@/constants/theme";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  leftAvatar?: any;
  onLeftPress?: () => void;
  rightIcons?: { name: string; onPress: () => void }[];
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  leftAvatar,
  onLeftPress,
  rightIcons = [],
}) => {
  const router = useRouter();

  const handleLeftPress = () => {
    if (onLeftPress) {
      onLeftPress();
    } else if (showBackButton) {
      router.back();
    }
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity onPress={handleLeftPress} style={styles.iconButton}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={VegifyTheme.colors.primary}
            />
          </TouchableOpacity>
        )}

        {leftAvatar && (
          <TouchableOpacity onPress={handleLeftPress}>
            <Image source={leftAvatar} style={styles.avatarImage} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View style={styles.rightContainer}>
        {rightIcons.map((icon, index) => (
          <TouchableOpacity
            key={index}
            onPress={icon.onPress}
            style={styles.rightIconButton}
          >
            <Ionicons
              name={icon.name as any}
              size={24}
              color={VegifyTheme.colors.primary}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: VegifyTheme.colors.background,
    paddingHorizontal: VegifyTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: VegifyTheme.colors.border,
  },
  leftContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  titleContainer: {
    flex: 3,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: VegifyTheme.colors.text,
  },
  rightContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  iconButton: {
    paddingRight: VegifyTheme.spacing.sm,
  },
  rightIconButton: {
    paddingLeft: VegifyTheme.spacing.sm,
  },
  avatarImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: VegifyTheme.spacing.sm,
  },
});

export default Header;
