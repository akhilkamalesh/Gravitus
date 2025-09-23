// lib/orchestration/exercisesService.ts
import { getExercises, getExerciseGroups } from '@/lib/firestoreFunctions';
import { Exercise } from '@/types/firestoreTypes';

export async function loadExercises(): Promise<Exercise[]> {
  const data = await getExercises();
  return data ?? [];
}

export async function loadExerciseGroups(): Promise<string[]> {
  const groups = await getExerciseGroups();
  return groups ?? [];
}
