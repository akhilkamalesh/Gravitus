// lib/orchestration/historyDetailService.ts
import { getLoggedWorkoutById, getSplitBySplitId, getExerciseByID } from '@/lib/firestoreFunctions';
import { ExerciseLog, Split, Exercise } from '@/types/firestoreTypes';

/**
 * getter for log by id
 * @param id log id
 * @returns 
 */
export async function loadLog(id: string) {
  return getLoggedWorkoutById(id); // ExerciseLog | undefined
}

/**
 * getter for split by id
 * @param splitId split id
 * @returns 
 */
export async function loadSplit(splitId: string) {
  return getSplitBySplitId(splitId); // Split | undefined
}

/**
 * enriches log exercises with meta data from getExerciseById and caclulates stats such as volume and sets
 * @param log log to enrich
 * @returns dictionary containing:
 *  - enriched: array of enriched exercises
 *  - pie: data that will be used in the pie chart containing primary muscle group to number of sets
 *  - totalVolume: total volume of the workout
 */
export async function enrichLogExercises(log: ExerciseLog) {
  const results = await Promise.all(
    log.exercises.map(async (logEx) => {
      const meta = await getExerciseByID(logEx.exerciseId) as Exercise;
      const totalVolume = logEx.sets.reduce((sum, s) => sum + s.weight * s.reps, 0); // reduce iterates over every set in array and sums up weight * reps
      return {
        enriched: { ...logEx, ...meta, totalVolume },
        stats: { muscle: meta.primaryMuscleGroup, sets: logEx.sets.length },
      };
    })
  );

  const enriched = results.map(r => r.enriched);
  const statsMap: Record<string, number> = {};
  for (const { stats } of results) {
    statsMap[stats.muscle] = (statsMap[stats.muscle] ?? 0) + stats.sets;
  }
  const pie = Object.entries(statsMap).map(([muscle, sets]) => ({ muscle, sets })); // converts array of arrays into an array of dictionaries

  const totalVolume = enriched.reduce(
    (sum, ex: any) => sum + (ex.totalVolume ?? 0),
    0
  );

  return { enriched, pie, totalVolume };
}
