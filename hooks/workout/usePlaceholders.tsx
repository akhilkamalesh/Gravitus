// hooks/usePlaceholders.ts
// TODO: need documentation
import { useEffect, useState } from 'react';
import { ExerciseLog } from '@/types/firestoreTypes';
import { loadLastLogsByExercise } from '@/lib/orchestration/workoutService';

export type Placeholder = { date: string; reps: number; weight: number };
export type PlaceholderMap = Record<string, Placeholder[]>;

export function usePlaceholders(log: ExerciseLog | null) {
  const [placeholders, setPlaceholders] = useState<PlaceholderMap>({});

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const exercises = log?.exercises ?? [];
      if (!exercises.length) {
        if (!cancelled) setPlaceholders({});
        return;
      }

      try {
        const entries = await Promise.all(
          exercises.map(async (e) => {
            const last = await loadLastLogsByExercise(e.exerciseId);
            if (!last?.sets?.length) return [e.exerciseId, []] as const;

            // find the most recent date among sets
            const latest = last.sets.reduce<string>((acc, s) => {
              if (!acc) return s.date;
              return new Date(s.date) > new Date(acc) ? s.date : acc;
            }, '');

            const arr: Placeholder[] = last.sets
              .filter((s: any) => s.date === latest)
              .map((s: any) => ({
                date: s.date,
                reps: s.reps ?? 0,
                weight: s.weight ?? 0,
              }));

            return [e.exerciseId, arr] as const;
          })
        );

        if (!cancelled) {
          setPlaceholders(Object.fromEntries(entries));
        }
      } catch (err) {
        console.error('placeholder fetch failed', err);
        if (!cancelled) setPlaceholders({});
      }
    };

    run();
    return () => {
      cancelled = true;
    };
    // re-run when the *set* of exerciseIds changes
  }, [JSON.stringify(log?.exercises?.map(x => x.exerciseId) ?? [])]);

  return placeholders;
}
