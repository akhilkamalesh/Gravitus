// lib/orchestration/homeService.ts
import { checkWorkoutStatus, getTodayWorkout } from '@/lib/firestoreFunctions';
import { estimateWorkoutTime } from '@/lib/otherFunctions';


/**
 * Loads the summary that is loaded in on the top widget
 * 
 * @returns {Object} workoutMeta containing:
 * - isDone
 * - workoutMeta
 * - weeklyCount
 */
export async function loadHomeSummary() {
  const done = await checkWorkoutStatus();
  const today = await getTodayWorkout(); // { split, workout } | null

  // Creating workoutMeta object
  let workoutMeta:
    | { dayName: string; exerciseCount: number; setCount: number; estMins: string }
    | null = null;
 
  if (today?.workout) {
    const { split, workout } = today;
    const exerciseCount = workout.exercises.length;
    const setCount = workout.exercises.reduce((s: any, ex: { sets: any; }) => s + ex.sets, 0);
    const estMins = estimateWorkoutTime(exerciseCount, setCount);
    workoutMeta = {
      dayName: workout.dayName,
      exerciseCount,
      setCount,
      estMins,
    };
  }

  return { isDone: done, workoutMeta };
}
