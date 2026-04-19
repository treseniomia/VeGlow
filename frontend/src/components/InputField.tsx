import React, { forwardRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TextInputProps,
} from "react-native";
import { VegifyTheme } from "../constants/theme";

interface VegifyInputProps extends TextInputProps {
  label?: string;
  error?: string;
  multiline?: boolean;
}

export const InputField = forwardRef<TextInput, VegifyInputProps>(
  ({ label, error, style, ...props }, ref) => {
    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <TextInput
          ref={ref}
          placeholderTextColor={VegifyTheme.colors.placeholder}
          style={[
            styles.input,
            props.multiline && styles.textArea,
            error ? styles.inputError : null,
            style,
          ]}
          {...props}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: { marginBottom: VegifyTheme.spacing.md },
  label: {
    color: VegifyTheme.colors.primary,
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: VegifyTheme.spacing.xs,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: VegifyTheme.colors.card,
    color: VegifyTheme.colors.text,
    borderRadius: 12,
    padding: VegifyTheme.spacing.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: VegifyTheme.colors.border,
  },
  textArea: { minHeight: 120, textAlignVertical: "top" },
  inputError: { borderColor: VegifyTheme.colors.error },
  errorText: {
    color: VegifyTheme.colors.error,
    fontSize: 12,
    marginTop: VegifyTheme.spacing.xs,
  },
});
