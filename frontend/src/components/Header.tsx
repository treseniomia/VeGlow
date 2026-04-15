import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Expo icons
import { useRouter } from "expo-router"; // Para sa back navigation
import { VegifyTheme } from "@/constants/theme"; // existing theme mo

// DefineProps para malaman kung anong ipapasa sa header
interface HeaderProps {
  title: string;
  showBackButton?: boolean; // Pwede mong sabihin kung gusto mo ng back button
  leftAvatar?: any; // Pwede mong ipasa ang avatar image source
  onLeftPress?: () => void; // Function kung ano gagawin pag pinindot ang left
  rightIcons?: { name: string; onPress: () => void }[]; // Array ng icons sa kanan
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  leftAvatar,
  onLeftPress,
  rightIcons = [], // Default ay empty array
}) => {
  const router = useRouter(); // Expo router hook

  // Handle Back Press default kung walang pinasang left function
  const handleLeftPress = () => {
    if (onLeftPress) {
      onLeftPress();
    } else if (showBackButton) {
      router.back(); // Default back action
    }
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftContainer}>
        {/* Render Back Button (Image 5 style) */}
        {showBackButton && (
          <TouchableOpacity onPress={handleLeftPress} style={styles.iconButton}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={VegifyTheme.colors.primary} // Veggie Green galing sa theme
            />
          </TouchableOpacity>
        )}

        {/* Render Avatar (Image 6 style) */}
        {leftAvatar && (
          <TouchableOpacity onPress={handleLeftPress}>
            <Image source={leftAvatar} style={styles.avatarImage} />
          </TouchableOpacity>
        )}
      </View>

      {/* Render Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
      </View>

      {/* Render Right Icons */}
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
              color={VegifyTheme.colors.primary} // Veggie Green
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 60, // Fixed professional height
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: VegifyTheme.colors.background, // Dark Green
    paddingHorizontal: VegifyTheme.spacing.md, // Consistent padding
    borderBottomWidth: 1, // Optional: dagdag visual hierarchy
    borderBottomColor: VegifyTheme.colors.border, // Medyo green border
  },
  leftContainer: {
    flex: 1, // Hayaan ang title na gumitna
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  titleContainer: {
    flex: 3, // Bigyan ng space ang title
    justifyContent: "center",
    alignItems: "flex-start", // Title aligned to left (or center kung gusto mo)
  },
  headerTitle: {
    fontSize: 20, // Modern header size
    fontWeight: "700", // Bold
    color: VegifyTheme.colors.text, // Light green/white text
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
    paddingLeft: VegifyTheme.spacing.sm, // Gap sa pagitan ng mga icons
  },
  avatarImage: {
    width: 38,
    height: 38,
    borderRadius: 19, // Perfect circle
    marginRight: VegifyTheme.spacing.sm, // Gap bago ang title
  },
});

export default Header;
