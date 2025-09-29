import { useEffect, useState, useCallback } from 'react';
import { Exercise, ExerciseLog, Split, workout } from '@/types/firestoreTypes';
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
  const [split, setSplit] = useState<Split|null>(null);
  const [workout, setWorkout] = useState<workout|null>(null);
  const [log, setLog] = useState<ExerciseLog|null>(null);
  const [isFresh, setIsFresh] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);  

  /*
  Refreshes the page and calls loadInitialWorkout to setStates of split, workout, log, and isFresh
  */
  const refresh = useCallback(async () => {
    setLoading(true);                             // ⬅ set loading to true at the start
    try {

      // console.log("Calling loadInitialWorkout");

      const res = await svc.loadInitialWorkout();          // your function that creates a one-off if missing

      // console.log("res is ", res);

      if ('isDone' in res && res.isDone === true && !res.workout) {
        // if your service can return a “done” sentinel without a workout, normalize here if needed
      }
      setSplit(res.split);
      setWorkout(res.workout);
      setLog(res.log);
      setIsFresh(res.isFresh);
      setIsDone(!!(res as any).isDone);
    } catch (err) {
      console.error("error in refresh:", err);
    } finally {
      setLoading(false);                                   // ⬅ end
    }
  }, []);

  /*
   Runs refresh and loadExercises and runs when refresh function changes
   */
  useEffect(() => { refresh(); svc.loadExercises().then(setExercises); }, [refresh]);

  /** 
   * Provides memoized callbacks to manage a user's current workout session
   * Dependencies: None because it only uses globals and React’s stable setters. 
  */
  const tryNewWorkout = useCallback(async () => {
    const newSplit: Split = {
      id: crypto.randomUUID(),
      name: 'One-Off',
      description: 'A custom workout not tied to a plan',
      repeatDays: false, weeksDuration: 1,
      workouts: [{ dayName: 'Custom', exercises: [] }],
    };
    await svc.startOneOff(newSplit);
    setSplit(newSplit);
    setWorkout(newSplit.workouts[0]);
    setLog({ splitId: newSplit.id, workoutDay: 'Custom', date: new Date().toISOString(), exercises: [] });
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

  return { split, setWorkout, workout, log, setLog, exercises, isDone, setIsDone, tryNewWorkout, skipWorkout, saveWorkout, loading };
}
