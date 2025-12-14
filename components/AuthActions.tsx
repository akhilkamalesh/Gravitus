import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";

export default function AuthActions() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <PrimaryButton
        label="Sign up with Email"
        onPress={() => router.push("/(onboarding)/email")}
      />

      <SecondaryButton
        label="Continue with Apple"
        onPress={() => {
          // TODO: Apple sign-in
        }}
      />

      <SecondaryButton
        label="Continue with Google"
        onPress={() => {
          // TODO: Google sign-in
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    gap: 12,
  },
});
