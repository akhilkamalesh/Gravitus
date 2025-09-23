// hooks/useExercises.ts
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Exercise } from '@/types/firestoreTypes';
import { loadExercises, loadExerciseGroups } from '@/lib/orchestration/exerciseService';

/**
 * React hook to manage and filter a list of exercises and their muscle groups.
 *
 * This hook loads all exercises and available muscle groups, provides search and group-based filtering,
 * and exposes utility functions for group selection and refreshing data.
 *
 * @returns An object containing:
 * - `loading`: Indicates if exercises and groups are being loaded.
 * - `filtered`: The filtered list of exercises based on search and selected groups.
 * - `groups`: Array of available muscle groups.
 * - `search`: Current search query string.
 * - `setSearch`: Setter for the search query.
 * - `selectedGroups`: Array of currently selected muscle groups for filtering.
 * - `toggleGroup`: Function to toggle selection of a muscle group.
 * - `clearGroups`: Function to clear all selected muscle groups.
 * - `refresh`: Function to reload exercises and groups from the data source.
 */
export function useExercises() {

  // states
  const [all, setAll] = useState<Exercise[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // hooks
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [exs, grps] = await Promise.all([loadExercises(), loadExerciseGroups()]);
      setAll(exs);
      setGroups(grps);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // toggles group selection for filter
  const toggleGroup = (g: string) =>
    setSelectedGroups(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);

  // clears group selection for filter
  const clearGroups = () => setSelectedGroups([]);

  // filtered exercises based on search and selected groups
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return all.filter(e => {
      const matchesText = e.name.toLowerCase().includes(q);
      const matchesGroup = selectedGroups.length === 0 || selectedGroups.includes(e.primaryMuscleGroup);
      return matchesText && matchesGroup;
    });
  }, [all, search, selectedGroups]);

  return {
    loading,
    filtered,
    groups,
    search, setSearch,
    selectedGroups, toggleGroup, clearGroups,
    refresh,
  };
}
