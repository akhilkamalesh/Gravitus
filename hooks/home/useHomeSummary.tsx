// hooks/useHomeSummary.ts
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { loadHomeSummary } from '@/lib/orchestration/homeService';

// Type of homeService.tsx
type WorkoutMeta = {
  dayName: string;
  exerciseCount: number;
  setCount: number;
  estMins: string;
} | null;

/**
 * Hooks that will be called in index.tsx
 * @returns {Object} containing:
 * - isDone
 * - workoutMeta
 * - loading
 * - refresh - callback function that sets the previous variables
 *           - refreshes whenever screen gains focus
 */
export function useHomeSummary() {
  const [isDone, setIsDone] = useState(false);
  const [workoutMeta, setWorkoutMeta] = useState<WorkoutMeta>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const { isDone, workoutMeta } = await loadHomeSummary();
      setIsDone(isDone);
      setWorkoutMeta(workoutMeta);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh whenever screen gains focus
  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  return { isDone, workoutMeta, loading, refresh };
}
