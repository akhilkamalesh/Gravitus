import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { useAuth } from "@/lib/authContext";
import { useOnboarding } from "@/lib/onboardingContext";

import OnboardingLayout from "@/components/OnboardingLayout";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function WelcomeScreen() {
  const router = useRouter();
  const { createUserProfile } = useAuth();
  const { state } = useOnboarding();

  const canEnter = Boolean(state.name);

const onEnter = async () => {
  if (!state.name) return;

  try {
    const payload = {
      name: state.name,

      ...(state.age !== undefined && { age: state.age }),
      ...(state.gender !== undefined && { gender: state.gender }),

      ...(state.height !== undefined && { height: state.height }),
      ...(state.weight !== undefined && { weight: state.weight }),

      ...(state.fitnessGoal !== undefined && {
        fitnessGoal: state.fitnessGoal,
      }),

      ...(state.trainingStyles !== undefined && {
        trainingStyles: state.trainingStyles,
      }),

      ...(state.notificationsEnabled !== undefined && {
        notificationsEnabled: state.notificationsEnabled,
      }),
    };

    await createUserProfile(payload);

    router.replace("/(tabs)");
  } catch (err) {
    console.error("Failed to create user profile", err);
  }
};



  return (
    <OnboardingLayout
      step={7}
      totalSteps={7}
      title="Welcome to Gravitus"
    >
      <Text style={styles.subtitle}>
        You’re all set. Let’s get started.
      </Text>

      <View style={styles.cta}>
        <PrimaryButton
          label="Enter"
          onPress={onEnter}
          disabled={!canEnter}
        />
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    color: "#AAA",
    fontSize: 16,
    marginTop: 8,
    marginBottom: 40,
  },
  cta: {
    marginTop: "auto",
    marginBottom: 24,
  },
});
