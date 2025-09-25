// lib/orchestration/splitDetailService.ts
import {
    clearCurrentSplit,
    getSplit,
    getSplitBySplitId,
    getSplitInformation,
    resetDayIndex,
    saveSplitToUser,
    updateCurrentSplit,
  } from '@/lib/firestoreFunctions';
  import { Split } from '@/types/firestoreTypes';

/**
 * Load split detail by id, trying both user doc id and "current split id" path.
 */
export type LoadedSplit = {
    split: Split | null;       // enriched for display
    isCurrent: boolean;        // true if id matched current split
};

/**
 * Loads split details
 * @param id split document id or "current split id"
 * @returns enriched split information and if it is current
 */
export async function loadSplitDetail(id: string): Promise<LoadedSplit> {
    // try template/user split by doc id
    let raw = await getSplit(id);
    let isCurrent = false;

    // if not found, try "current split id" path
    if (!raw) {
        raw = await getSplitBySplitId(id); // if available, means "current split"
        isCurrent = !!raw;
    }
    if (!raw) return { split: null, isCurrent: false };

    const enriched = await getSplitInformation(raw);
    return { split: enriched, isCurrent };
}

/**
 * saves given split as current split for user
 * @param split split to save as current
 * @returns docId
 */
export async function saveAsCurrent(split: Split) {
    const docId = await saveSplitToUser(split);
    await updateCurrentSplit(docId);
    await resetDayIndex();
    return docId;
}

/**
 * clears current split
 */
export async function clearCurrent() {
    await clearCurrentSplit();
}
  