// Estimated workout time
import { ExerciseLog, ExerciseStat } from "@/types/firestoreTypes";
import Constants from 'expo-constants';

export const estimateWorkoutTime = (exerciseCount: number, totalSets: number): string => {
    const secondsPerSet = 60; // average effort + rest per set
    const setupTimePerExercise = 120; // seconds
    const restTimePerSet = 120; // seconds

    const totalTimeSeconds = (totalSets * (secondsPerSet + restTimePerSet)) + (exerciseCount * setupTimePerExercise);
    
    const minutes = Math.floor(totalTimeSeconds / 60);
  
    return `${minutes}`
}


// Estimated 1RM Max based of ExerciseStat
// Following the Epley Formula
export const estimateOneRepMax = (stat: ExerciseStat): Record<string, number> => {

    const epleyFormula = (weight: number, reps: number): number => {

        const eF = weight * (1 + (reps/30))

        return eF;
    }

    const {exerciseId, sets} = stat;

    const arr: Record<string, number> = {};

    for(const set of sets){

        const {weight, reps, date} = set;

        const oneRepMax = epleyFormula(weight, reps)
        const dateKey = new Date(date).toISOString().split("T")[0]

        if (!(dateKey in arr) || oneRepMax > arr[dateKey]) {
            arr[dateKey] = oneRepMax;
        }
    }
    
    return arr;
}

// Grabs the set with the highest volume
export function getHighestVolumeSet(stat: ExerciseStat): { weight: number; reps: number; volume: number; date: string } | null {
    let maxVolumeSet: { weight: number; reps: number; volume: number; date: string } | null = null;
  
    for (const set of stat.sets) {
      if (set.reps > 3) {
        const volume = set.weight * set.reps;
        if (!maxVolumeSet || volume > maxVolumeSet.volume) {
          maxVolumeSet = {
            weight: set.weight,
            reps: set.reps,
            volume,
            date: set.date,
          };
        }
      }
    }
  
    return maxVolumeSet;
  }

function getAllowlist(): string[] {
  const raw = (Constants.expoConfig?.extra as any)?.EMAIL_ALLOWLIST || '';
  return String(raw)
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
}

export const emailAllowlist = getAllowlist();
export const emailAllowSet = new Set(emailAllowlist);
