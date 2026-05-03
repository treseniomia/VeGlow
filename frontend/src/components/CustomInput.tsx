import { TextInput, StyleSheet, View } from "react-native";
import { VegifyTheme } from "@/constants/theme";

const CustomInput = ({
  value,
  setValue,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
}: any) => {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        placeholderTextColor="#A9A9A9"
        style={styles.input}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2A3D02",
    width: "100%",
    borderColor: "#3D5C04",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginVertical: 8,
  },
  input: {
    height: 50,
    color: "#E8F5E9",
    fontSize: 16,
  },
});

export default CustomInput;
