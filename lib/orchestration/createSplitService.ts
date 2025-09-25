// lib/orchestration/createSplitService.ts
import {
    getExercises,
    getSplitInformation,
    saveSplitToUser,
    updateCurrentSplit,
    resetDayIndex,
  } from '@/lib/firestoreFunctions';
  import { Exercise, Split, workout } from '@/types/firestoreTypes';
  
  /**
   * Get all exercises
   * @returns A list of all available exercises from the database.
   */
  export async function loadAllExercises(): Promise<Exercise[]> {
    return await getExercises();
  }
  
  /**
   * NewSplitInput
   */
  export type NewSplitInput = {
    name: string;
    description: string;
    repeatDays: boolean;
    weeksDuration: number; // validated number
    workouts: workout[];
  };
  
  /**
   * Validation checker for split
   * @param input NewSplitInput
   */
  export function validateSplit(input: NewSplitInput) {
    if (!input.name.trim()) throw new Error('Split name is required.');
    if (!input.description.trim()) throw new Error('Description is required.');
    if (!Number.isFinite(input.weeksDuration) || input.weeksDuration <= 0)
      throw new Error('Weeks duration must be a positive number.');
    if (!input.workouts.length) throw new Error('Add at least one workout day.');
  }
  
  /**
   * Saves the split to the user account
   * @param input NewSplitInput
   * @returns docId of the saved split
   */
  export async function saveSplitFlow(input: NewSplitInput) {
    validateSplit(input);
    // getSplitInformation enriches with exerciseData, etc.
    const enriched = await getSplitInformation({ ...input, id: '' } as unknown as Split);
    const docId = await saveSplitToUser(enriched);
    await updateCurrentSplit(docId);
    await resetDayIndex();
    return docId;
  }
  