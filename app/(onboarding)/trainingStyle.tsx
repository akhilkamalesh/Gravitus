import { View, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

import OnboardingLayout from "@/components/OnboardingLayout";
import SelectableCard from "@/components/ui/SelectableCard";
import PrimaryButton from "@/components/ui/PrimaryButton";

type TrainingStyle =
  | "bodybuilding"
  | "powerlifting"
  | "crossfit"
  | "running";

const TRAINING_STYLES: {
  value: TrainingStyle;
  label: string;
  description: string;
}[] = [
  {
    value: "bodybuilding",
    label: "Bodybuilding",
    description: "Focus on hypertrophy, aesthetics, and muscle growth.",
  },
  {
    value: "powerlifting",
    label: "Powerlifting",
    description: "Train the squat, bench, and deadlift for strength.",
  },
  {
    value: "crossfit",
    label: "CrossFit",
    description: "High-intensity functional training and varied workouts.",
  },
  {
    value: "running",
    label: "Running",
    description: "Distance, pace, and cardiovascular performance.",
  },
];

export default function TrainingStyleScreen() {
  const router = useRouter();
  const [selectedStyles, setSelectedStyles] = useState<TrainingStyle[]>([]);

  const toggleStyle = (style: TrainingStyle) => {
    setSelectedStyles((prev) =>
      prev.includes(style)
        ? prev.filter((s) => s !== style)
        : [...prev, style]
    );
  };

  const onContinue = () => {
    if (selectedStyles.length === 0) return;

    // TODO: persist training styles to onboarding profile
    router.push("/onboarding/experience-level");
  };

  return (
    <OnboardingLayout
      step={4}
      totalSteps={7}
      title="How do you like to train?"
      onSkip={() => router.push("/(tabs)/index")}
    >
      {TRAINING_STYLES.map((style) => (
        <SelectableCard
          key={style.value}
          label={style.label}
          description={style.description}
          selected={selectedStyles.includes(style.value)}
          onPress={() => toggleStyle(style.value)}
        />
      ))}

      <View style={styles.cta}>
        <PrimaryButton
          label="Continue"
          onPress={onContinue}
          disabled={selectedStyles.length === 0}
        />
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  cta: {
    marginTop: 24,
  },
});
