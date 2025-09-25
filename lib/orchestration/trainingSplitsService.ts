// lib/orchestration/trainingSplitsService.ts

import { getCurrentSplit, getSplits } from '@/lib/firestoreFunctions';
import { Split } from '@/types/firestoreTypes';

/**
 * Gets current split
 * @returns The current training split or null if an error occurs.
 */
export async function loadCurrentSplit(): Promise<Split | null> {
  try {
    return await getCurrentSplit();
  } catch (e) {
    console.error('loadCurrentSplit failed', e);
    return null;
  }
}

/**
 * Gets a list of training splits
 * @returns A list of training splits or an empty array if an error occurs. 
 */
export async function loadTemplateSplits(): Promise<Split[]> {
  try {
    const res = await getSplits();
    return res ?? [];
  } catch (e) {
    console.error('loadTemplateSplits failed', e);
    return [];
  }
}
