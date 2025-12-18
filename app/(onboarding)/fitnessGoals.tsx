import { View, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useOnboarding } from "@/lib/onboardingContext";

import OnboardingLayout from "@/components/OnboardingLayout";
import SelectableCard from "@/components/ui/SelectableCard";
import PrimaryButton from "@/components/ui/PrimaryButton";

type FitnessGoal =
  | "lose_weight"
  | "gain_muscle"
  | "get_stronger"
  | "improve_cardio"
  | "track_workouts";

const GOALS: {
  value: FitnessGoal;
  label: string;
  description: string;
}[] = [
  {
    value: "lose_weight",
    label: "Lose Weight",
    description: "Reduce body fat and improve overall health.",
  },
  {
    value: "gain_muscle",
    label: "Gain Muscle",
    description: "Build lean muscle mass and size.",
  },
  {
    value: "get_stronger",
    label: "Get Stronger",
    description: "Increase strength in major lifts.",
  },
  {
    value: "improve_cardio",
    label: "Improve Cardiovascular Fitness",
    description: "Enhance endurance and conditioning.",
  },
  {
    value: "track_workouts",
    label: "Track Workouts Only",
    description: "Log workouts without recommendations.",
  },
];

export default function FitnessGoalsScreen() {
  const router = useRouter();
  const { update } = useOnboarding(); 

  const [selectedGoal, setSelectedGoal] =
    useState<FitnessGoal | null>(null);

  const onContinue = () => {
    if (!selectedGoal) return;

    console.log("Selected fitness goal:", selectedGoal);

    update({
      fitnessGoal: selectedGoal,
    })

    // TODO: persist goal to onboarding profile
    router.push("/(onboarding)/trainingStyle");
  };

  return (
    <OnboardingLayout
      step={3}
      totalSteps={7}
      title="What’s your primary goal?"
      onSkip={() => router.push("/(onboarding)/trainingStyle")}
    >
      {GOALS.map((goal) => (
        <SelectableCard
          key={goal.value}
          label={goal.label}
          description={goal.description}
          selected={selectedGoal === goal.value}
          onPress={() => setSelectedGoal(goal.value)}
        />
      ))}

      <View style={styles.cta}>
        <PrimaryButton
          label="Continue"
          onPress={onContinue}
          disabled={!selectedGoal}
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
