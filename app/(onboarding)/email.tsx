import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import {useAuth} from "@/lib/authContext";

import TextInputField from "@/components/ui/TextInputField";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function EmailSignUpScreen() {
  const router = useRouter();
  const signUp = useAuth();

  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<{
    email?: string;
    confirmEmail?: string;
    password?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!email) newErrors.email = "Email is required";
    if (email !== confirmEmail)
      newErrors.confirmEmail = "Emails do not match";
    if (!password || password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = () => {
    if (!validate()) return;

    // TODO: Auth logic
    // signUp(email, password)
    setIsLoading(false);

    router.push("/(onboarding)/basicInfo");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create your account</Text>

      <TextInputField
        label="Email"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
      />

      <TextInputField
        label="Confirm Email"
        value={confirmEmail}
        onChangeText={setConfirmEmail}
        error={errors.confirmEmail}
      />

      <TextInputField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        error={errors.password}
      />

      {/* Spacing before CTA */}
      <View style={styles.ctaContainer}>
        <PrimaryButton label="Continue" onPress={onSubmit} loading={isLoading}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 24,
    paddingTop: 96, // ⬅ increased top padding
  },
  title: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 32,
  },
  ctaContainer: {
    marginTop: 24, // ⬅ space between password + button
  },
});
