import React from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  Image,
  ActionSheetIOS,
  Alert,
  ActivityIndicator,
} from "react-native";
import { VegifyHeader } from "../../../components/VegifyHeader";
import { InputField } from "../../../components/InputField";
import { Button } from "../../../components/Button";
import { NutritionModal } from "../components/NutritionModal";
import { useCreatePost } from "../hooks/useCreatePost";
import { styles } from "../styles/createPost.styles";
import { VegifyTheme } from "../../../constants/theme";

export default function CreatePostScreen() {
  const {
    form,
    loading,
    updateField,
    handlePublish,
    nutritions,
    isModalVisible,
    setModalVisible,
    addNutrition,
    pickMedia,
    takePhoto,
    removeMedia,
    removeNutrition,
  } = useCreatePost();

  const handleAddMedia = () => {
    const options = [
      "Cancel",
      "📷 Take Photo",
      "🎥 Record Video",
      "🖼️ Choose from Gallery",
    ];

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        { options, cancelButtonIndex: 0 },
        (buttonIndex) => {
          if (buttonIndex === 1) takePhoto("image");
          else if (buttonIndex === 2) takePhoto("video");
          else if (buttonIndex === 3) pickMedia();
        }
      );
    } else {
      Alert.alert("Upload Media", "Saan mo gustong kumuha ng file?", [
        { text: "📷 Take Photo", onPress: () => takePhoto("image") },
        { text: "🎥 Record Video", onPress: () => takePhoto("video") },
        { text: "🖼️ Gallery", onPress: pickMedia },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <VegifyHeader title="New Post" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionLabel}>Media ({form.media.length}/6)</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 15 }}
          >
            <TouchableOpacity
              style={[
                styles.mediaPlaceholder,
                { width: 100, height: 100, marginRight: 10, marginTop: 5 },
              ]}
              onPress={handleAddMedia}
            >
              <Text style={{ color: VegifyTheme.colors.primary, fontSize: 24 }}>
                +
              </Text>
            </TouchableOpacity>

            {form.media.map((item, index) => (
              <View
                key={index}
                style={{ position: "relative", marginRight: 10, marginTop: 5 }}
              >
                <Image
                  source={{ uri: item.uri }}
                  style={{ width: 100, height: 100, borderRadius: 12 }}
                />
                <TouchableOpacity
                  onPress={() => removeMedia(index)}
                  style={{
                    position: "absolute",
                    top: -5,
                    right: -5,
                    backgroundColor: "red",
                    borderRadius: 10,
                    width: 20,
                    height: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 10,
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 12, fontWeight: "bold" }}
                  >
                    X
                  </Text>
                </TouchableOpacity>
                {item.type === "video" && (
                  <View
                    style={{
                      position: "absolute",
                      bottom: 5,
                      left: 5,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      borderRadius: 4,
                      padding: 2,
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 8 }}>VIDEO</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>

          <InputField
            label="Recipe Title"
            placeholder="e.g. Smoked Cauliflower Wings"
            value={form.title}
            onChangeText={(t) => updateField("title", t)}
          />
          <InputField
            label="Mins of Preparation"
            placeholder="e.g. 18 MINS"
            keyboardType="numeric"
            value={form.prepTime}
            onChangeText={(t) => updateField("prepTime", t)}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
              marginTop: 15,
            }}
          >
            <Text style={styles.sectionLabel}>Nutritions (Hold to delete)</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text
                style={{
                  color: VegifyTheme.colors.primary,
                  fontWeight: "bold",
                }}
              >
                + ADD INFO
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "flex-start",
              marginBottom: 10,
            }}
          >
            {nutritions.length === 0 ? (
              <Text style={{ color: "#666", fontStyle: "italic" }}>
                No nutrition info added yet.
              </Text>
            ) : (
              nutritions.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onLongPress={() => removeNutrition(index)}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: "#1A1A1A",
                    borderRadius: 12,
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    marginRight: 8,
                    marginBottom: 8,
                    minWidth: 80,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.1)",
                  }}
                >
                  <Text
                    style={{
                      color: VegifyTheme.colors.primary,
                      fontSize: 10,
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      marginBottom: 2,
                    }}
                  >
                    {item.label}
                  </Text>
                  <Text
                    style={{ color: "#FFF", fontSize: 14, fontWeight: "bold" }}
                  >
                    {item.value}g
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>

          <InputField
            label="Instructions"
            placeholder="Describe step by step..."
            multiline
            value={form.instructions}
            onChangeText={(t) => updateField("instructions", t)}
          />
          <InputField
            label="Ingredients (Strict Mode)"
            placeholder="Separate with commas or new line (e.g. Garlic, Onion, Salt)"
            multiline
            value={form.ingredients}
            onChangeText={(t) => updateField("ingredients", t)}
          />

          {/* <Button
            title={loading ? "Publishing..." : "Publish Recipe"}
            onPress={handlePublish}
            disabled={loading}
          /> */}
          <View style={{ marginTop: 20, marginBottom: 40 }}>
            {loading ? (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                {/* ActivityIndicator para sa professional loading feel */}
                <ActivityIndicator
                  size="large"
                  color={VegifyTheme.colors.primary}
                />
                <Text
                  style={{
                    color: VegifyTheme.colors.primary,
                    marginTop: 10,
                    fontWeight: "600",
                    fontSize: 14,
                  }}
                >
                  Uploading recipe and media, please wait...
                </Text>
              </View>
            ) : (
              /* I-wrap natin ang Button sa View para safe ang layout */
              <Button
                title="Publish Recipe"
                onPress={handlePublish}
                disabled={loading} // Pigilan ang double-tap
                style={{
                  opacity: loading ? 0.6 : 1, // Visual cue na disabled ang button
                }}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <NutritionModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSave={addNutrition}
      />
    </View>
  );
}
