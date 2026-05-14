import React from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { VegifyHeader } from "../../../components/VegifyHeader";
import { InputField } from "../../../components/InputField";
import { Button } from "../../../components/Button";
import { NutritionModal } from "../components/NutritionModal";
import { useEditPost } from "../hooks/useEditPost";
import { styles } from "../styles/createPost.styles";
import { VegifyTheme } from "../../../constants/theme";

interface EditPostScreenProps {
  postId: string;
}

export default function EditPostScreen({ postId }: EditPostScreenProps) {
  const {
    form,
    loading,
    saving,
    updateField,
    handleUpdate,
    isModalVisible,
    setModalVisible,
    isBenefitModalVisible,
    setBenefitModalVisible,
  } = useEditPost(postId);

  if (loading) {
    return (
      <View style={[styles.mainContainer, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={VegifyTheme.colors.primary} />
        <Text style={{ color: "#fff", marginTop: 10, textAlign: "center" }}>
          Fetching Recipe Details...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <VegifyHeader title="Edit Recipe" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Media Section */}
          <Text style={styles.sectionLabel}>Media ({form.media.length}/6)</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 15 }}
          >
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
                  onPress={() => {
                    const newMedia = form.media.filter((_, i) => i !== index);
                    updateField("media", newMedia);
                  }}
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
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 12, fontWeight: "bold" }}
                  >
                    X
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* Basic Info */}
          <InputField
            label="Recipe Title"
            value={form.title}
            onChangeText={(t) => updateField("title", t)}
          />
          <InputField
            label="Mins of Preparation"
            keyboardType="numeric"
            value={form.prepTime}
            onChangeText={(t) => updateField("prepTime", t)}
          />

          {/* Nutritions Section */}
          <View style={[styles.rowBetween, { marginTop: 15 }]}>
            <Text style={styles.sectionLabel}>Nutritions</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text
                style={{
                  color: VegifyTheme.colors.primary,
                  fontWeight: "bold",
                }}
              >
                + EDIT INFO
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 10 }}
          >
            {form.nutritionList.length === 0 ? (
              <Text style={{ color: "#666", fontStyle: "italic" }}>
                No nutrition info yet.
              </Text>
            ) : (
              form.nutritionList.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onLongPress={() => {
                    const newList = form.nutritionList.filter(
                      (_, i) => i !== index
                    );
                    updateField("nutritionList", newList);
                  }}
                  style={{
                    backgroundColor: "#1A1A1A",
                    borderRadius: 12,
                    padding: 10,
                    marginRight: 8,
                    marginBottom: 8,
                    borderWidth: 1,
                    borderColor: VegifyTheme.colors.primary,
                  }}
                >
                  <Text
                    style={{
                      color: VegifyTheme.colors.primary,
                      fontSize: 10,
                      fontWeight: "bold",
                    }}
                  >
                    {item.label}
                  </Text>
                  <Text style={{ color: "#FFF", fontSize: 14 }}>
                    {item.value}g
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* Benefits Section */}
          <View style={[styles.rowBetween, { marginTop: 15 }]}>
            <Text style={styles.sectionLabel}>Benefits</Text>
            <TouchableOpacity onPress={() => setBenefitModalVisible(true)}>
              <Text style={styles.addInfoText}>+ EDIT BENEFIT</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 10 }}
          >
            {form.benefitsList.length === 0 ? (
              <Text style={{ color: "#666", fontStyle: "italic" }}>
                No benefits added yet.
              </Text>
            ) : (
              form.benefitsList.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onLongPress={() => {
                    const newList = form.benefitsList.filter(
                      (_, i) => i !== index
                    );
                    updateField("benefitsList", newList);
                  }}
                  style={[
                    styles.chip,
                    {
                      borderColor: VegifyTheme.colors.primary,
                      marginBottom: 8,
                    },
                  ]}
                >
                  <Text style={styles.chipLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* Instructions and Ingredients */}
          <InputField
            label="Instructions"
            multiline
            value={form.instructions}
            onChangeText={(t) => updateField("instructions", t)}
          />
          <InputField
            label="Ingredients"
            multiline
            value={form.ingredients}
            onChangeText={(t) => updateField("ingredients", t)}
          />

          {/* Save Button */}
          <View style={{ marginTop: 20, marginBottom: 40 }}>
            {saving ? (
              <ActivityIndicator
                size="large"
                color={VegifyTheme.colors.primary}
              />
            ) : (
              <Button title="Save Changes" onPress={handleUpdate} />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modals */}
      <NutritionModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSave={(l, v) =>
          updateField("nutritionList", [
            ...form.nutritionList,
            { label: l, value: v },
          ])
        }
      />
      <NutritionModal
        title="Add Benefit Info"
        visible={isBenefitModalVisible}
        onClose={() => setBenefitModalVisible(false)}
        onSave={(l) =>
          updateField("benefitsList", [
            ...form.benefitsList,
            { label: l, value: "Verified" },
          ])
        }
        isBenefit={true}
      />
    </View>
  );
}
