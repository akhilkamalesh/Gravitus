import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { Timestamp } from 'firebase/firestore';

export type FirebaseUser = FirebaseAuthTypes.User | null;

export type FirestoreUserData = {
  name: string;
  email: string;
  currentSplitId: string;
  currentDayIndex: number; //currentDatIndex
} | null;

export interface Exercise {
    id: string;
    name: string;
    primaryMuscleGroup: string;
    secondaryMuscleGroup: string[];
    motion: string;
    // imageUrl?: string;
}

// Split type
export interface Split {
  id: string;
  name: string;
  description: string;
  repeatDays: boolean;
  weeksDuration: number;
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
  exercises: {
    exerciseId: string;
    sets: {weight: number; reps: number}[];
  }[];
}

// Sub interfaces that will be used as a child interface
export interface workout {
  dayName: string;
  exercises: workoutExercise[];
}

export interface workoutExercise {
  exerciseId: string;
  reps: {
    min: number;
    max: number;
  }
  sets: number;
  exerciseData?: Exercise;
}

// Used for exercise [id] graphing purposes as well as statistics
// Could definitely be used to replace sub dictionary in Exercise Log
export interface ExerciseStat {
  exerciseId: string;
  sets: {weight: number; reps: number; date: string}[];
}