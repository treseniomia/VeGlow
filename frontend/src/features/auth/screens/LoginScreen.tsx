import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomInput from "@/components/CustomInput";
import Header from "@/components/Header";
import { VegifyTheme } from "@/constants/theme";

// Modular Imports
import { authStyles as styles } from "../styles/authStyles";
import { useLogin } from "../hooks/useLogin";

const LoginScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter(); // Initialize router
  const [showPassword, setShowPassword] = useState(false);

  // Destructure functions mula sa useLogin hook
  const { email, setEmail, password, setPassword, loading, onLoginPressed } =
    useLogin();

  return (
    <SafeAreaView style={styles.root}>
      {/* Ginagamit ang Header component para sa consistency */}
      <Header title="Login" showBackButton={true} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
          bounces={false}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Welcome Back! 🌿</Text>
            <Text style={styles.subTitle}>Ready for some fresh harvest?</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <CustomInput
              placeholder="Enter your email"
              value={email}
              setValue={setEmail}
              keyboardType="email-address"
              autoCapitalize="none" // Professional: Email should not auto-capitalize
            />

            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordWrapper}>
              <CustomInput
                placeholder="Enter your password"
                value={password}
                setValue={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color={VegifyTheme.colors.primary}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={{ alignSelf: "flex-end", marginTop: 10 }}>
              <Text style={styles.linkText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              (loading || !email || !password) && styles.buttonDisabled,
            ]}
            onPress={onLoginPressed}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>LOG IN</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>New to Vegify?</Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
              <Text style={styles.footerLink}> Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
