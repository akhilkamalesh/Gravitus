import { View, Text, StyleSheet, ScrollView } from "react-native";

type Props = {
  step: number;
  totalSteps: number;
  title: string;
  children: React.ReactNode;
};

export default function OnboardingLayout({
  step,
  totalSteps,
  title,
  children,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.step}>
        Step {step} of {totalSteps}
      </Text>

      <Text style={styles.title}>{title}</Text>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 24,
    paddingTop: 72,
  },
  step: {
    color: "#666",
    fontSize: 12,
    marginBottom: 8,
  },
  title: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
  },
  scrollContent: {
    paddingBottom: 40, // ensures CTA is reachable
  },
});
