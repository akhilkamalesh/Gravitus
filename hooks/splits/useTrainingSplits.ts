// hooks/useTrainingSplits.ts
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { Split } from '@/types/firestoreTypes';
import { loadCurrentSplit, loadTemplateSplits } from '@/lib/orchestration/trainingSplitsService';

/**
 * Custom hook to manage training splits state and loading.
 * @returns An object containing loading state, current split, template splits, and a refresh function.
 */
export function useTrainingSplits() {
  const [currentSplit, setCurrentSplit] = useState<Split | null>(null);
  const [templates, setTemplates] = useState<Split[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [curr, list] = await Promise.all([
        loadCurrentSplit(),
        loadTemplateSplits(),
      ]);
      setCurrentSplit(curr);
      setTemplates(list);
    } finally {
      setLoading(false);
    }
  }, []);

  // refresh when the screen gains focus
  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  return { loading, currentSplit, templates, refresh };
}
