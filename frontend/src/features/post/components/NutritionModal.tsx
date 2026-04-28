import React, { useEffect, useState } from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { InputField } from "../../../components/InputField";
import { Button } from "../../../components/Button";
import { VegifyTheme } from "../../../constants/theme";

interface NutritionModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (type: string, value: string) => void;
  title?: string;
  isBenefit?: boolean;
}

export const NutritionModal = ({
  visible,
  onClose,
  onSave,
  title = "Add Nutrition Info",
  isBenefit = false,
}: NutritionModalProps) => {
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");

  useEffect(() => {
    if (visible) {
      setLabel("");
      setValue("");
    }
  }, [visible]);

  const handleSave = () => {
    // Kung Benefit, kahit walang value (ipapasa natin ay static string para sa backend)
    if (isBenefit && label) {
      onSave(label, "Benefit"); // Ipinasa ang "Benefit" as value para sumunod sa schema
      onClose();
    } else if (label && value) {
      onSave(label, value);
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>

          <InputField
            label={isBenefit ? "Benefit" : "Nutrient Name"}
            placeholder={
              isBenefit ? "e.g. Anti-inflammatory" : "e.g. Potassium"
            }
            value={label}
            onChangeText={setLabel}
          />

          {!isBenefit && (
            <InputField
              label="Amount (Grams/kcal)"
              placeholder="e.g. 150"
              keyboardType="numeric"
              value={value}
              onChangeText={setValue}
            />
          )}

          <View style={styles.row}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={onClose}
              style={{ width: "48%" }}
            />
            <Button title="Add" onPress={handleSave} style={{ width: "48%" }} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 20,
  },
  content: {
    backgroundColor: VegifyTheme.colors.card,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: VegifyTheme.colors.border,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
});
