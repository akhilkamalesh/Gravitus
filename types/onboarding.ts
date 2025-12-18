export type TrainingStyle =
  | "bodybuilding"
  | "powerlifting"
  | "crossfit"
  | "running";

export type ExperienceLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "unsure";

export type OnboardingState = {
  // Basic info (SCRUM-12)
  name?: string;
  age?: number;
  height?: {
    value: number;
    unit: "cm" | "in";
  };
  weight?: {
    value: number;
    unit: "kg" | "lb";
  };
  gender?: "male" | "female" | "other";

  fitnessGoal?:
    | "lose_weight"
    | "gain_muscle"
    | "get_stronger"
    | "improve_cardio"
    | "track_workouts";

  // Training style & experience (SCRUM-14)
  trainingStyles?: Partial<
    Record<TrainingStyle, ExperienceLevel>
  >;

  // Notifications (SCRUM-21)
  notificationsEnabled?: boolean;

  // Completion flags
  completed?: boolean;
};
