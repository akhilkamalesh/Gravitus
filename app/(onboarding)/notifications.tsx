import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useOnboarding } from "@/lib/onboardingContext";
import * as Notifications from "expo-notifications";

import OnboardingLayout from "@/components/OnboardingLayout";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function NotificationsScreen() {
  const router = useRouter();
  const {update} = useOnboarding();

  const savePreferenceAndContinue = async (
    enabled: boolean
  ) => {
    // TODO: persist to user profile
    console.log("Notifications enabled?:", enabled);
    update({ notificationsEnabled: enabled });
    router.push("/(onboarding)/final");
  };

  const onEnable = async () => {
    const { status } =
      await Notifications.requestPermissionsAsync();

    await savePreferenceAndContinue(
      status === "granted"
    );
  };

  const onDecline = async () => {
    await savePreferenceAndContinue(false);
  };

  return (
    <OnboardingLayout
      step={6}
      totalSteps={7}
      title="Stay on track with notifications"
    >
      <Text style={styles.subtitle}>
        Enable notifications to help you stay consistent
        and motivated.
      </Text>

      <View style={styles.list}>
        <Text style={styles.item}>
          • Workout reminders
        </Text>
        <Text style={styles.item}>
          • Positive encouragement
        </Text>
        <Text style={styles.item}>
          • More to come (social features)
        </Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          label="Enable Notifications"
          onPress={onEnable}
        />

        <Text
          style={styles.decline}
          onPress={onDecline}
        >
          Not now
        </Text>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    color: "#AAA",
    fontSize: 15,
    marginBottom: 24,
  },
  list: {
    marginBottom: 40,
  },
  item: {
    color: "#FFF",
    fontSize: 15,
    marginBottom: 12,
  },
  actions: {
    marginTop: 24,
  },
  decline: {
    marginTop: 16,
    color: "#777",
    textAlign: "center",
    fontSize: 14,
  },
});
