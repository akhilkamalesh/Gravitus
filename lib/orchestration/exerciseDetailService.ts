/**
 * Service functions for loading exercise details and logs, and building detailed exercise statistics.
 *
 * This module provides utilities to:
 * - Fetch exercise data by ID.
 * - Fetch exercise logs by exercise ID.
 * - Build a detailed exercise summary including one-rep max progression and best set information.
 *
 * @module exerciseDetailService
 */
import { getExerciseByID, getLogsByExerciseId } from '@/lib/firestoreFunctions';
import { estimateOneRepMax, getHighestVolumeSet } from '@/lib/otherFunctions';
import { Exercise } from '@/types/firestoreTypes';


// load exercise by id
export async function loadExercise(id: string) {
  return getExerciseByID(id) as Promise<Exercise | undefined>;
}

// load exercise log by id
export async function loadExerciseLogs(id: string) {
  return getLogsByExerciseId(id); // your existing shape
}

// estimate one rep max from logs
// returns an object with exercise, oneRepMaxOverTime, bestSet
export async function buildExerciseDetail(id: string) {
  const [exercise, logs] = await Promise.all([loadExercise(id), loadExerciseLogs(id)]);
  if (!exercise) return { exercise: undefined, oneRmSeries: [], bestSet: undefined };

  let oneRmSeries: { date: string; value: number }[] = [];
  let bestSet: { weight: number; reps: number; volume: number; date: string } | undefined;

  if (logs) {
    const hvs = getHighestVolumeSet(logs);
    if (hvs) bestSet = hvs;

    const oneRepMaxOverTime = estimateOneRepMax(logs);
    oneRmSeries = Object.entries(oneRepMaxOverTime)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf());
  }

  return { exercise, oneRmSeries, bestSet };
}
