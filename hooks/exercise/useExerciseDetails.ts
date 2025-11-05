// hooks/useExerciseDetail.ts
import { useEffect, useMemo, useState } from 'react';
import * as svc from '@/lib/orchestration/exerciseDetailService';
import { Exercise } from '@/types/firestoreTypes';

/**
 * Custom React hook to fetch and manage detailed information about a specific exercise.
 *
 * This hook retrieves exercise details, a series of one-rep max (1RM) records, and the best set performed,
 * given an exercise ID. It also provides a loading state and the total number of sessions (based on 1RM series).
 *
 * @param id - The unique identifier of the exercise, which can be a string or an array of strings.
 * @returns An object containing:
 * - `loading`: Indicates if the data is currently being loaded.
 * - `exercise`: The detailed exercise information, or `undefined` if not loaded.
 * - `oneRmSeries`: An array of objects representing the 1RM records, each with a date and value.
 * - `bestSet`: The best set performed, including weight, reps, volume, and date, or `undefined` if not available.
 * - `sessionCount`: The total number of sessions (length of `oneRmSeries`).
 *
 * @example
 * const { loading, exercise, oneRmSeries, bestSet, sessionCount } = useExerciseDetail(exerciseId);
 */
export function useExerciseDetail(id?: string | string[]) {
  // states
  const [exercise, setExercise] = useState<Exercise | undefined>();
  const [oneRmSeries, setOneRmSeries] = useState<{ date: string; value: number }[]>([]);
  const [bestSet, setBestSet] = useState<
    { weight: number; reps: number; volume: number; date: string } | undefined
  >();
  const [loading, setLoading] = useState(true);

  // useEffect to fetch exercise details when id changes
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const realId = Array.isArray(id) ? id[0] : id;
        const { exercise, oneRmSeries, bestSet } = await svc.buildExerciseDetail(realId);

        if (cancelled) return;
        setExercise(exercise);
        setOneRmSeries(oneRmSeries);
        setBestSet(bestSet);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [id]);

  // memoized session count
  const sessionCount = useMemo(() => oneRmSeries.length, [oneRmSeries]);

  return { loading, exercise, oneRmSeries, bestSet, sessionCount };
}
