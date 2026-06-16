import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { VegifyTheme } from "../../../constants/theme";
import { styles } from "../styles/reels.styles";

interface CreateBottomSheetModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectReel: () => void;
  onSelectPost: () => void;
}

export const CreateBottomSheetModal: React.FC<CreateBottomSheetModalProps> = ({
  visible,
  onClose,
  onSelectReel,
  onSelectPost,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons
                name="close"
                size={24}
                color={VegifyTheme.colors.text}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.choiceContainer}>
            <TouchableOpacity
              style={styles.choiceButton}
              onPress={() => {
                onSelectReel();
                onClose();
              }}
            >
              <Ionicons
                name="videocam-outline"
                size={32}
                color={VegifyTheme.colors.primary}
                style={styles.choiceIcon}
              />
              <Text style={styles.choiceLabel}>Reel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.choiceButton}
              onPress={() => {
                onSelectPost();
                onClose();
              }}
            >
              <Ionicons
                name="document-text-outline"
                size={32}
                color={VegifyTheme.colors.primary}
                style={styles.choiceIcon}
              />
              <Text style={styles.choiceLabel}>Post</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
