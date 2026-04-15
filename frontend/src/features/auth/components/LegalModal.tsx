import React from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { VegifyTheme } from "@/constants/theme";

const LegalModal = ({ visible, title, content, onClose }: any) => (
  <Modal visible={visible} animationType="slide" transparent={true}>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>{title}</Text>
        <ScrollView style={styles.scrollText}>
          <Text style={styles.textContent}>{content}</Text>
        </ScrollView>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>I UNDERSTAND</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: VegifyTheme.colors.card,
    borderRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: VegifyTheme.colors.primary,
    marginBottom: 15,
  },
  scrollText: { marginBottom: 20 },
  textContent: { color: VegifyTheme.colors.text, lineHeight: 20, fontSize: 14 },
  closeButton: {
    backgroundColor: VegifyTheme.colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: { color: "white", fontWeight: "bold" },
});

export default LegalModal;
