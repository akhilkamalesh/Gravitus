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

export type FirestoreUserCreateInput = {
  name: string;

  age?: number;
  gender?: "male" | "female" | "other";

  height?: {
    value: number;
    unit: "cm" | "in";
  };

  weight?: {
    value: number;
    unit: "kg" | "lb";
  };

  fitnessGoal?: string;

  trainingStyles?: Partial<
    Record<TrainingStyle, ExperienceLevel>
  >;

  notificationsEnabled?: boolean;
};

export type FirestoreUserData = {
  name: string;
  email: string;

  age?: number;
  gender?: "male" | "female" | "other";

  height?: {
    value: number;
    unit: "cm" | "in";
  };

  weight?: {
    value: number;
    unit: "kg" | "lb";
  };

  fitnessGoal?: string;

  trainingStyles?: Partial<
    Record<TrainingStyle, ExperienceLevel>
  >;

  notificationsEnabled?: boolean;

  currentSplitId: string;
  currentDayIndex: number;

  onboardingCompleted: boolean;
  createdAt: number;
} | null;
