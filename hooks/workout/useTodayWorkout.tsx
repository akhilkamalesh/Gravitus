import { useEffect, useState, useCallback } from 'react';
import { Exercise, ExerciseLog, Split, workout, TemplateWorkout } from '@/types/firestoreTypes';
import * as svc from '@/lib/orchestration/workoutService';

/**
 * Custom React hook to manage today's workout state.
 * Wraps workoutService methods with React state + memoized callbacks.
 * Provides split, workout, log, exercises, and actions to control flow.
 * @returns 
 * - split [Split]
 * - workout [Workout]
 * - log [ExerciseLog]
 * - setLog
 * - exercises [Exercises[]]
 * - isDone [boolean]
 * - tryNewWorkout
 * - skipWorkout
 * - saveWorkout
 */
export function useTodayWorkout() {
  const [split, setSplit] = useState<Split | null>(null);
  const [workout, setWorkout] = useState<workout | null>(null);
  const [log, setLog] = useState<ExerciseLog | null>(null);
  const [isFresh, setIsFresh] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isRestDay, setIsRestDay] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  /*
  Refreshes the page and calls loadInitialWorkout to setStates of split, workout, log, and isFresh
  */
  const refresh = useCallback(async () => {
    const res = await svc.loadInitialWorkout();
    if (!res) {
      setSplit(null); setWorkout(null); setLog(null); setIsFresh(false); setIsDone(false);
      return;
    }
    if ('isDone' in res) { setIsDone(true) }
    setSplit(res.split); setWorkout(res.workout); setLog(res.log); setIsFresh(res.isFresh);
    if ('isRestDay' in res) setIsRestDay(!!res.isRestDay);
  }, []);

  /*
   Runs refresh and loadExercises and runs when refresh function changes
   */
  useEffect(() => { refresh(); svc.loadExercises().then(setExercises); }, [refresh]);

  /** 
   * Provides memoized callbacks to manage a user's current workout session
   * Dependencies: None because it only uses globals and React’s stable setters. 
  */
  const tryNewWorkout = useCallback(async (template?: { name: string, exercises: Exercise[] } | any) => {
    // Basic type check or casting could be done here if needed
    const workoutName = template?.name || 'Custom';
    const initialExercises = template?.exercises || [];

    const generateId = () => {
      if (typeof crypto !== 'undefined' && (crypto as any).randomUUID) return (crypto as any).randomUUID();
      return Math.random().toString(36).slice(2) + Date.now().toString(36);
    };

    const newSplit: Split = {
      id: generateId(),
      name: 'One-Off',
      description: 'A custom workout not tied to a plan',
      trainingStyle: 'bodybuilding',
      daysPerCycle: 1,
      weeksDuration: 1,
      workouts: [{ dayName: workoutName, exercises: initialExercises }],
    };

    try {
      await svc.startOneOff(newSplit);
    } catch (e: any) {
      console.error(e);
    }

    setSplit(newSplit);
    setWorkout(newSplit.workouts[0]);
    // For logging, we need to map the exercises to log format if they exist
    const logExercises = initialExercises.map((ex: any) => ({
      exerciseId: ex.exerciseId,
      sets: Array(ex.sets).fill({ weight: 0, reps: 0 }),
      instanceId: ex.instanceId
    }));

    setLog({
      splitId: newSplit.id,
      workoutDay: workoutName,
      date: new Date().toISOString(),
      exercises: logExercises
    });
    setIsFresh(true);
  }, []);

  /**
   * Skips today's workout day; 
   * Dependencies: (re-memoize if the `refresh` function reference changes)
   */
  const skipWorkout = useCallback(async () => { await svc.skipWorkoutDay(); await refresh(); }, [refresh]);

  /**
   * Saves workout
   * Preconditions: log has to exist
   * Dependencies: log, isFresh, refresh
   *  - saveWorkout is re-created the most when log is changed (changed in useWorkoutEdits.tsx)
   */
  const saveWorkout = useCallback(async () => {
    if (!log) throw new Error('Nothing to save');
    await svc.completeWorkout(log, isFresh);
    await refresh(); // Loads in the following workout, however, will not be able to edit or save
  }, [log, isFresh, refresh]);

  return { split, setWorkout, workout, log, setLog, exercises, isDone, setIsDone, tryNewWorkout, skipWorkout, saveWorkout, isRestDay };
}
