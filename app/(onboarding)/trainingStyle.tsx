import { View, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useOnboarding } from "@/lib/onboardingContext";

import OnboardingLayout from "@/components/OnboardingLayout";
import PrimaryButton from "@/components/ui/PrimaryButton";
import ExpandableTrainingStyleCard from "@/components/ExpandableTrainingCard";

type TrainingStyle =
  | "bodybuilding"
  | "powerlifting"
  | "crossfit"
  | "running";

type ExperienceLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "unsure";

const TRAINING_STYLES = [
  {
    value: "bodybuilding",
    label: "Bodybuilding",
    description: "Hypertrophy and muscle growth.",
  },
  {
    value: "powerlifting",
    label: "Powerlifting",
    description: "Squat, bench, and deadlift focus.",
  },
  {
    value: "crossfit",
    label: "CrossFit",
    description: "High-intensity functional training.",
  },
  {
    value: "running",
    label: "Running",
    description: "Distance and cardiovascular fitness.",
  },
] as const;

export default function TrainingStyleScreen() {
  const router = useRouter();
  const { update } = useOnboarding();

  const [expanded, setExpanded] =
    useState<TrainingStyle | null>(null);

  const [stylesState, setStylesState] =
    useState<Partial<Record<TrainingStyle, ExperienceLevel>>>(
      {}
    );

  const onSelectExperience = (
    style: TrainingStyle,
    level: ExperienceLevel
  ) => {
    setStylesState((prev) => ({
      ...prev,
      [style]: level,
    }));
  };

  const onClear = (style: TrainingStyle) => {
    setStylesState((prev) => {
      const next = { ...prev };
      delete next[style];
      return next;
    });

    if (expanded === style) setExpanded(null);
  };

  const canContinue =
    Object.keys(stylesState).length > 0;

  const onContinue = async () => {
    if(!canContinue) return;

    console.log("Selected training styles:", stylesState);

    update({
      trainingStyles: stylesState,
    });

    router.push("/(onboarding)/notifications");
  }



  return (
    <OnboardingLayout
      step={4}
      totalSteps={7}
      title="How do you like to train?"
      onSkip={() => router.push("/(onboarding)/notifications")}
    >
      {TRAINING_STYLES.map((style) => (
        <ExpandableTrainingStyleCard
          key={style.value}
          label={style.label}
          description={style.description}
          expanded={expanded === style.value}
          experience={stylesState[style.value]}
          onExpand={() => setExpanded(style.value)}
          onCollapse={() => setExpanded(null)}
          onSelectExperience={(level) =>
            onSelectExperience(style.value, level)
          }
          onClear={() => onClear(style.value)}
        />
      ))}

      <View style={styles.cta}>
        <PrimaryButton
          label="Continue"
          onPress={onContinue}
          disabled={!canContinue}
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
