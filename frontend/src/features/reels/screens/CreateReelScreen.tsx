import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { Ionicons } from "@expo/vector-icons";
import { VegifyTheme } from "../../../constants/theme";
import { useCreateReel } from "../hooks/useCreateReel";
import { router } from "expo-router";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const CreateReelScreen = () => {
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

  const handleBack = () => {
    resetForm();
    router.back();
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

  const handlePublishPress = async () => {
    await handlePublish();
    resetForm();
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A260F" />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={VegifyTheme.colors.text}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Reel</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
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
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={removeMedia}
                >
                  <Ionicons name="close-circle" size={24} color="#FF4444" />
                </TouchableOpacity>
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
          <View style={styles.uploadButtonsContainer}>
            <TouchableOpacity
              style={[styles.uploadButton, { flex: 1 }]}
              onPress={pickVideo}
            >
              <Ionicons name="images-outline" size={18} color="#FFF" />
              <Text style={styles.uploadButtonText}>Pick Video</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.uploadButton, { flex: 1 }]}
              onPress={recordVideo}
            >
              <Ionicons name="camera-outline" size={18} color="#FFF" />
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
              autoCapitalize="words"
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
              textAlignVertical="top"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!media || !form.title || loading) && styles.submitButtonDisabled,
            ]}
            onPress={handlePublishPress}
            disabled={!media || !form.title || loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitButtonText}>Publish Reel</Text>
            )}
          </TouchableOpacity>
        </ScrollView>

        {/* Full Screen Video Modal */}
        {showFullScreenVideo && (
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
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A260F",
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2C3E1D",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: VegifyTheme.colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 150,
  },
  videoThumbnail: {
    height: SCREEN_HEIGHT * 0.5,
    backgroundColor: "#2C3E1D",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  videoPreviewContainer: {
    flex: 1,
    position: "relative",
  },
  videoPreview: {
    width: "100%",
    height: "100%",
  },
  playIconOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -24 }, { translateY: -24 }],
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    padding: 4,
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  videoPlaceholderText: {
    color: "#666",
    marginTop: 8,
    fontSize: 14,
  },
  uploadButtonsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: VegifyTheme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  uploadButtonText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "600",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: VegifyTheme.colors.text,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#2C3E1D",
    color: VegifyTheme.colors.text,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#3D4E2D",
  },
  textArea: {
    height: 120,
    paddingTop: 10,
  },
  submitButton: {
    backgroundColor: VegifyTheme.colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#3D4E2D",
  },
  submitButtonText: {
    color: "#1A260F",
    fontSize: 15,
    fontWeight: "bold",
  },
});

const fullScreenStyles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
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
