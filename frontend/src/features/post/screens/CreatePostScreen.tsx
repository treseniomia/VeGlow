import React from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";
import { VegifyHeader } from "../../../components/VegifyHeader";
import { InputField } from "../../../components/InputField";
import { MacroChip } from "../components/MacroChip";
import { Button } from "../../../components/Button";
import { NutritionModal } from "../components/NutritionModal"; // Import mo 'to
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
  } = useCreatePost();

  return (
    <View style={styles.mainContainer}>
      <VegifyHeader title="New Post" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.headline}>Share your culinary magic.</Text>

          <View style={styles.mediaPlaceholder}>
            <Text style={{ color: "#666" }}>
              [ Media Uploader Placeholder ]
            </Text>
          </View>

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

          {/* Nutrition Section Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style={styles.sectionLabel}>Nutritions</Text>
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

          {/* Dynamic Macro Chips */}
          <View style={styles.macroRow}>
            {nutritions.length === 0 ? (
              <Text
                style={{ color: "#666", fontStyle: "italic", marginBottom: 10 }}
              >
                No nutrition info added yet.
              </Text>
            ) : (
              nutritions.map((item, index) => (
                <MacroChip key={index} label={item.label} value={item.value} />
              ))
            )}
          </View>

          <InputField
            label="Instructions"
            placeholder="Describe..."
            multiline
            value={form.instructions}
            onChangeText={(t) => updateField("instructions", t)}
          />
          <InputField
            label="Ingredients"
            placeholder="List them..."
            multiline
            value={form.ingredients}
            onChangeText={(t) => updateField("ingredients", t)}
          />

          <Button
            title={loading ? "Publishing..." : "Publish Recipe"}
            onPress={handlePublish}
            disabled={loading}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal Component */}
      <NutritionModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSave={addNutrition}
      />
    </View>
  );
}
