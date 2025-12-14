import { View, StyleSheet } from "react-native";
import BrandHeader from "@/components/BrandHeader";
import OnboardingCarousel from "@/components/OnboardingCarousel";
import AuthActions from "@/components/AuthActions";
import LoginLink from "@/components/LoginLink";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <BrandHeader />
      <OnboardingCarousel />
      <AuthActions />
      <LoginLink />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingBottom: 32,
  },
});
