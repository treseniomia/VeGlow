import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { Ionicons } from "@expo/vector-icons";
import { VegifyTheme } from "../../../constants/theme";
import { styles } from "../styles/reels.styles";
import { useCreateReel } from "../hooks/useCreateReel";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

interface CreateReelFormModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CreateReelFormModal: React.FC<CreateReelFormModalProps> = ({
  visible,
  onClose,
}) => {
  const {
    form,
    loading,
    media,
    updateField,
    pickVideo,
    recordVideo,
    removeMedia,
    handlePublish,
    resetForm,
  } = useCreateReel();

  const [showFullScreenVideo, setShowFullScreenVideo] = useState(false);
  const previewPlayer = useVideoPlayer(media?.uri || "", (player) => {
    player.loop = true;
  });
  const fullScreenPlayer = useVideoPlayer(media?.uri || "", (player) => {
    player.loop = true;
  });

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleVideoPress = () => {
    if (media) {
      setShowFullScreenVideo(true);
    }
  };

  const handleCloseFullScreen = () => {
    setShowFullScreenVideo(false);
    fullScreenPlayer.pause();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create Reel</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Ionicons
                name="close"
                size={24}
                color={VegifyTheme.colors.text}
              />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Video Thumbnail / Upload Section */}
            <View style={styles.videoThumbnail}>
              {media ? (
                <TouchableOpacity
                  style={styles.videoPreviewContainer}
                  onPress={handleVideoPress}
                  activeOpacity={0.8}
                >
                  <VideoView
                    style={styles.videoPreview}
                    player={previewPlayer}
                    contentFit="cover"
                    nativeControls={false}
                  />
                  <View style={styles.playIconOverlay}>
                    <Ionicons name="play-circle" size={48} color="#FFF" />
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={styles.videoPlaceholder}>
                  <Ionicons name="videocam-outline" size={48} color="#666" />
                  <Text style={styles.videoPlaceholderText}>
                    No video selected
                  </Text>
                </View>
              )}
            </View>

            {/* Upload Buttons */}
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
              <TouchableOpacity
                style={[styles.uploadButton, { flex: 1 }]}
                onPress={pickVideo}
              >
                <Ionicons name="images-outline" size={20} color="#FFF" />
                <Text style={styles.uploadButtonText}>Pick Video</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.uploadButton, { flex: 1 }]}
                onPress={recordVideo}
              >
                <Ionicons name="camera-outline" size={20} color="#FFF" />
                <Text style={styles.uploadButtonText}>Record</Text>
              </TouchableOpacity>
            </View>

            {/* Title Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Recipe Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter recipe title"
                placeholderTextColor="#666"
                value={form.title}
                onChangeText={(value) => updateField("title", value)}
              />
            </View>

            {/* Description Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add a description (optional)"
                placeholderTextColor="#666"
                value={form.description}
                onChangeText={(value) => updateField("description", value)}
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!media || !form.title || loading) &&
                  styles.submitButtonDisabled,
              ]}
              onPress={handlePublish}
              disabled={!media || !form.title || loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.submitButtonText}>Publish Reel</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      {/* Full Screen Video Modal */}
      <Modal
        visible={showFullScreenVideo}
        animationType="fade"
        onRequestClose={handleCloseFullScreen}
      >
        <View style={fullScreenStyles.container}>
          <TouchableOpacity
            style={fullScreenStyles.backButton}
            onPress={handleCloseFullScreen}
          >
            <Ionicons name="arrow-back" size={28} color="#FFF" />
          </TouchableOpacity>
          {media && (
            <VideoView
              style={fullScreenStyles.video}
              player={fullScreenPlayer}
              contentFit="contain"
              nativeControls
            />
          )}
        </View>
      </Modal>
    </Modal>
  );
};

const fullScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 8,
  },
});
