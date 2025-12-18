import { View, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/lib/authContext";

import OnboardingLayout from "@/components/OnboardingLayout";
import TextInputField from "@/components/ui/TextInputField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import FormFieldStack from "@/components/ui/FormFieldStack";

export default function EmailSignUpScreen() {
  const router = useRouter();
  const auth = useAuth();

  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");

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

  const onSubmit = async () => {
    if (!validate()) return;
    console.log("Creating account with:", {email})
    await auth.signUpWithEmail(email, password);

    router.push("/(onboarding)/basicInfo");
  };

  return (
    <OnboardingLayout
      step={1}
      totalSteps={7}
      title="Create your account"
    >
      <FormFieldStack>
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
      </FormFieldStack>

      <View style={styles.cta}>
        <PrimaryButton label="Continue" onPress={onSubmit} />
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  cta: {
    marginTop: 24,
  },
});
