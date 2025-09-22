// hooks/useHistory.ts
import { useEffect, useMemo, useState, useCallback } from 'react';
import { ExerciseLog } from '@/types/firestoreTypes';
import { loadLoggedWorkouts, loadSplitNamesFor } from '@/lib/orchestration/historyService';

/**
 * contains the state and handlers for the history page
 * @returns State and handlers for the history page
 */
export function useHistory() {

  // states
  const [logs, setLogs] = useState<ExerciseLog[]>([]);
  const [splitNames, setSplitNames] = useState<Record<string, string>>({});
  const [searchText, setSearchText] = useState('');
  const [selectedSplits, setSelectedSplits] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // refresh function to load logs and split names
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await loadLoggedWorkouts();
      setLogs(data);
      const map = await loadSplitNamesFor(data);
      setSplitNames(map);
    } finally {
      setLoading(false);
    }
  }, []);

  // initial load
  useEffect(() => { refresh(); }, [refresh]);

  // handlers for filtering split names
  const toggleSplit = (name: string) => {
    setSelectedSplits(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );
  };

  // clear selected splits
  const clearSplits = () => setSelectedSplits([]);

  // filtered logs based on search text and selected splits
  const filtered = useMemo(() => {
    const needle = searchText.trim().toLowerCase();
    return logs.filter(l => {
      const matchesText = l.workoutDay.toLowerCase().includes(needle);
      const splitName = splitNames[l.splitId] ?? 'One-Off';
      const matchesSplit = selectedSplits.length === 0 || selectedSplits.includes(splitName);
      return matchesText && matchesSplit;
    });
  }, [logs, searchText, selectedSplits, splitNames]);

  // unique split names for filter options
  const splitOptions = useMemo(
    () => Array.from(new Set(Object.values(splitNames))).sort(),
    [splitNames]
  );

  // return all states and handlers
  return {
    loading,
    filtered,       // filtered logs to render
    splitNames,     // id -> name map
    splitOptions,   // unique names for modal
    searchText, setSearchText,
    selectedSplits, toggleSplit, clearSplits,
  };
}
