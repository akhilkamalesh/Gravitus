import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { Timestamp } from 'firebase/firestore';
import { TrainingStyle, ExperienceLevel, FitnessGoal } from './onboarding';

export type FirebaseUser = FirebaseAuthTypes.User | null;

export interface Exercise {
  id: string;
  name: string;
  primaryMuscleGroup: string;
  secondaryMuscleGroup: string[];
  motion?: string;
  // imageUrl?: string;
}

export interface TemplateSplit {
  id: string;
  name: string;
  description: string;
  trainingStyle: TrainingStyle;
  experienceLevel: ExperienceLevel;
  fitnessGoal: FitnessGoal;
  weeksDuration: number;
  daysPerCycle: number;
  daysOfWeek?: string[]; // This can be adjusted
  workouts: workout[];
}

// Split type
export interface Split {
  id: string;
  name: string;
  description: string;
  trainingStyle: TrainingStyle;
  // repeatDays: boolean;
  weeksDuration: number;
  daysPerCycle: number;
  daysOfWeek?: string[]; // This can be adjusted
  workouts: workout[];
  createdAt?: Timestamp; // ✅ optional if not always present
  createdFromTemplateId?: string; // ✅ tracks template source
}

// Log type
export interface ExerciseLog {
  id?: string;
  splitId: string;
  workoutDay: string;
  date: string;
  localDate?: string; // optional local date string for easier querying
  exercises: {
    instanceId?: string; // <-- added so log entries can be matched to workout instances
    exerciseId: string;
    brand?: string;
    sets: { weight: number; reps: number }[];
  }[];
}

// Sub interfaces that will be used as a child interface
export interface workout {
  dayName: string;
  scheduledDate?: string;
  exercises: workoutExercise[];
}

export interface workoutExercise {
  exerciseId: string;
  reps: {
    min: number;
    max: number;
  }
  sets: number;
  rpe?: number; // Optional RPE value (0-10)
  exerciseData?: Exercise;
  instanceId?: string; // <-- added so log entries can be matched to workout instances
}

// Used for exercise [id] graphing purposes as well as statistics
// Could definitely be used to replace sub dictionary in Exercise Log
export interface ExerciseStat {
  exerciseId: string;
  sets: { weight: number; reps: number; date: string }[];
}