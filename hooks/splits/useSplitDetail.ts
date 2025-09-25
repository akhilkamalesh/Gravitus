// hooks/useSplitDetail.ts
import { useEffect, useState, useCallback } from 'react';
import * as svc from '@/lib/orchestration/splitDetailService';
import { Split } from '@/types/firestoreTypes';

/**
 * custom hook to load and manage split details
 * @param id split document id or "current split id"
 * @returns loading state, split details, if current, and handlers
 */
export function useSplitDetail(id?: string | string[]) {
  const [split, setSplit] = useState<Split | null>(null);
  const [isCurrent, setIsCurrent] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!id) return;
    const realId = Array.isArray(id) ? id[0] : id;
    setLoading(true);
    try {
      const { split, isCurrent } = await svc.loadSplitDetail(realId);
      setSplit(split);
      setIsCurrent(isCurrent);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { refresh(); }, [refresh]);

  const saveSplit = useCallback(async () => {
    if (!split) throw new Error('No split to save');
    return svc.saveAsCurrent(split);
  }, [split]);

  const clearSplit = useCallback(async () => {
    await svc.clearCurrent();
  }, []);

  return { loading, split, isCurrent, refresh, saveSplit, clearSplit };
}
