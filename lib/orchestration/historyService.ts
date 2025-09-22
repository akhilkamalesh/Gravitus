// lib/orchestration/historyService.ts
import { getLoggedWorkouts, getSplitBySplitId } from '@/lib/firestoreFunctions';
import { ExerciseLog } from '@/types/firestoreTypes';

/**
 * Getter for logged workouts
 * @returns A list of all logged workouts, or an empty array if none exist.
 */
export async function loadLoggedWorkouts(): Promise<ExerciseLog[]> {
  const workouts = await getLoggedWorkouts();
  return workouts ?? [];
}

/**
 * 
 * @param logs A list of exercise logs
 * @returns list of split names that will be used in the filter
 */
export async function loadSplitNamesFor(logs: ExerciseLog[]) {
  const unique = Array.from(new Set(logs.map(l => l.splitId).filter(Boolean)));
  const entries = await Promise.all(unique.map(async (id) => {
    const split = await getSplitBySplitId(id);
    return [id, split?.name ?? 'One-Off'] as const;
  }));
  return Object.fromEntries(entries) as Record<string, string>;
}
