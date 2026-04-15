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
import { Link } from "expo-router";

// Components & Constants
import CustomInput from "@/components/CustomInput";
import Header from "@/components/Header";
import LegalModal from "@/features/auth/components/LegalModal"; // Siguraduhin na tama ang path nito
import { VegifyTheme } from "@/constants/theme";

// Modular Imports
import { authStyles as styles } from "../styles/authStyles"; // Paki-check kung tama ang path
import { useRegister } from "../hooks/useRegister";

const SignUpScreen = () => {
  const insets = useSafeAreaInsets();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    isAgreed,
    setIsAgreed,
    modalVisible,
    setModalVisible,
    modalContent,
    openLegal,
    onRegisterPressed,
  } = useRegister();

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Create Account" showBackButton={true} />

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
            <Text style={styles.title}>Join Vegify 🌿</Text>
            <Text style={styles.subTitle}>
              Freshness delivered to your doorstep
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <CustomInput
              placeholder="Ex. Mia Tresenio"
              value={name}
              setValue={setName}
            />

            <Text style={styles.inputLabel}>Email Address</Text>
            <CustomInput
              placeholder="Enter your email"
              value={email}
              setValue={setEmail}
              keyboardType="email-address"
            />

            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordWrapper}>
              <CustomInput
                placeholder="Minimum 8 characters"
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

            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={styles.passwordWrapper}>
              <CustomInput
                placeholder="Repeat your password"
                value={confirmPassword}
                setValue={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color={VegifyTheme.colors.primary}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.agreementContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setIsAgreed(!isAgreed)}
            >
              <Ionicons
                name={isAgreed ? "checkbox" : "square-outline"}
                size={24}
                color={VegifyTheme.colors.primary}
              />
            </TouchableOpacity>
            <Text style={styles.agreementText}>
              I agree to the{" "}
              <Text style={styles.linkText} onPress={() => openLegal("tos")}>
                Terms of Service
              </Text>{" "}
              and{" "}
              <Text
                style={styles.linkText}
                onPress={() => openLegal("privacy")}
              >
                Privacy Policy
              </Text>
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              (loading || !isAgreed) && styles.buttonDisabled,
            ]}
            onPress={onRegisterPressed}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already a member?</Text>
            <Link href="/(auth)/signin" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}> Log In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <LegalModal
        visible={modalVisible}
        title={modalContent.title}
        content={modalContent.text}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default SignUpScreen;
