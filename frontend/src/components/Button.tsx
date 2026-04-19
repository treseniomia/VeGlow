import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { VegifyTheme } from "../constants/theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: "primary" | "outline" | "danger";
}

export const Button = ({
  title,
  onPress,
  loading,
  disabled,
  style,
  textStyle,
  variant = "primary",
}: ButtonProps) => {
  // Logic para sa colors base sa variant
  const getBackgroundColor = () => {
    if (disabled || loading) return VegifyTheme.colors.border;
    if (variant === "outline") return "transparent";
    if (variant === "danger") return VegifyTheme.colors.error;
    return VegifyTheme.colors.primary;
  };

  const getBorderColor = () => {
    if (variant === "outline") return VegifyTheme.colors.primary;
    return "transparent";
  };

  const getTextColor = () => {
    if (variant === "outline") return VegifyTheme.colors.primary;
    return "white";
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === "outline" ? 1 : 0,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginVertical: VegifyTheme.spacing.sm,
    // Soft shadow para sa professional look
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
