// hooks/useHistoryDetail.ts
import { useEffect, useMemo, useState } from 'react';
import * as svc from '@/lib/orchestration/historyDetailService';
import { ExerciseLog, Split } from '@/types/firestoreTypes';

// Pie Data Type
type PieDatum = { muscle: string; sets: number };

/**
 * contains the state and handlers for the history [id] page
 * @param id log id
 * @returns states and handlers for the history [id] page
 */
export function useHistoryDetail(id?: string | string[]) {

  // states
  const [log, setLog] = useState<ExerciseLog | null>(null);
  const [split, setSplit] = useState<Split | null>(null);
  const [enrichedExercises, setEnrichedExercises] = useState<any[]>([]);
  const [pieData, setPieData] = useState<PieDatum[]>([]);
  const [loading, setLoading] = useState(true);

  // load log, split, enriched exercises and pie data when id changes
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const logId = Array.isArray(id) ? id[0] : id;
        const l = await svc.loadLog(logId);
        if (!l) return;
        if (!cancelled) setLog(l);

        if (l.splitId) {
          const s = await svc.loadSplit(l.splitId);
          if (!cancelled) setSplit(s ?? null);
        }

        const { enriched, pie } = await svc.enrichLogExercises(l);
        if (!cancelled) {
          setEnrichedExercises(enriched);
          setPieData(pie);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [id]);

  // total volume calculation
  const totalVolume = useMemo(
    () => enrichedExercises.reduce((sum, ex: any) => sum + (ex.totalVolume ?? 0), 0),
    [enrichedExercises]
  );

  return { loading, log, split, enrichedExercises, pieData, totalVolume };
}
