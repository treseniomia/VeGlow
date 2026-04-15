import { TextInput, StyleSheet, View } from "react-native";
import { VegifyTheme } from "@/constants/theme"; // Gamitin natin ang theme para consistent

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
        // Mahalaga ito para lumitaw ang placeholder sa dark background
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
    backgroundColor: "#2A3D02", // Dark green background
    width: "100%",
    borderColor: "#3D5C04", // Mas maganda kung green border kesa white/e8e8e8
    borderWidth: 1,
    borderRadius: 12, // Modern roundness
    paddingHorizontal: 15,
    marginVertical: 8,
  },
  input: {
    height: 50,
    color: "#E8F5E9", // DITO DAPAT ANG COLOR para white/light green ang type mo!
    fontSize: 16,
  },
});

export default CustomInput;
