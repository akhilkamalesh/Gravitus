// Estimated workout time
import { ExerciseStat } from "@/types/firestoreTypes";

export const estimateWorkoutTime = (exerciseCount: number, setsPerExercise: number): string => {
    const secondsPerSet = 60; // average effort + rest per set
    const setupTimePerExercise = 180; // seconds
    const restTimePerSet = 120; // seconds
    
    const totalSets = exerciseCount * setsPerExercise;
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