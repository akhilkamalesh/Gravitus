//workoutService.tsx
import {
    getExercises, getTodayWorkout, incrementDayIndex, logWorkout,
    generateOneOffSplitId, checkWorkoutStatus, getLogsByExerciseId, saveOneOffSplitToUser
} from '@/lib/firestoreFunctions';

import { Exercise, ExerciseLog, Split, workout, workoutExercise } from '@/types/firestoreTypes';


/**
 * Returns the workout for the current day.
 *
 * If no workout exists, a blank workout is created.
 * If a workout exists:
 *   - Captures the active split and workout
 *   - Retrieves the exercise log from `getTodayWorkout`
 *   - Prepares the workout for logging
 *
 * @returns {Object} Object containing:
 *   - split {Split}        The current split
 *   - workout {Workout}    The workout for today
 *   - log {ExerciseLog[]}  Exercise logs for the workout
 *   - isFresh {boolean}    Whether this is a newly created workout
 */
export async function loadInitialWorkout() {
    const w = await getTodayWorkout();

    const generateInstanceId = () => {
        if (typeof crypto !== 'undefined' && (crypto as any).randomUUID) return (crypto as any).randomUUID();
        return Math.random().toString(36).slice(2) + Date.now().toString(36);
    };

    if (!w) {
        // Return null to indicate no active split/workout
        return null;
    }

    const { split, workout } = w;

    // Ensure each workout exercise has a stable instanceId
    const normalizedExercises: workoutExercise[] = workout.exercises.map((e: workoutExercise) =>
        e.instanceId ? e : { ...e, instanceId: generateInstanceId() }
    );

    // Build a log that aligns exercises by instanceId so inputs stay stable
    const log: ExerciseLog = {
        splitId: split.id,
        workoutDay: workout.dayName,
        date: new Date().toISOString(),
        localDate: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0],
        exercises: normalizedExercises.map((e: workoutExercise) => ({
            instanceId: e.instanceId,
            exerciseId: e.exerciseId,
            sets: Array.from({ length: e.sets }, () => ({ weight: 0, reps: 0 })),
        })),
    };

    const normalizedWorkout: workout = { ...workout, exercises: normalizedExercises };

    if (await checkWorkoutStatus()) return { split, workout: normalizedWorkout, log, isFresh: false, isDone: true, isRestDay: w.isRestDay } as const;

    return { split, workout: normalizedWorkout, log, isFresh: false, isRestDay: w.isRestDay } as const;
}

/** 
 * Returns exercises
 * @returns exercises {Excerise[]}
*/
export async function loadExercises(): Promise<Exercise[]> { return getExercises(); }

/**
 * Returns the last log for exercise given id
 * @param exerciseId [String] - id that maps to exerciseId in firestore
 * @returns ExerciseStat | null [Promise<ExerciseStat | null>]
 */
export async function loadLastLogsByExercise(exerciseId: string) { return getLogsByExerciseId(exerciseId); }

/**
 * Saves workout log to firestore
 * @param log [ExerciseLog] - the log that gets saved
 * @param skipIncrement [boolean] - if workout is not part of a split
 */
export async function completeWorkout(log: ExerciseLog, skipIncrement?: boolean) {
    // if (await checkWorkoutStatus()) throw new Error('Workout already done');
    await logWorkout(log);
    if (!skipIncrement) await incrementDayIndex();
}

/**
 * Skips workout by iterating incrementDay Index
 * Only applicable if split is not null
 */
export async function skipWorkoutDay() { await incrementDayIndex(); }

/**
 * Saves workout to a one off split if split is null
 * @param split [Split] - what the split is called
 * @todo: Could make split static
 */
export async function startOneOff(split: Split) { await saveOneOffSplitToUser(split); }
