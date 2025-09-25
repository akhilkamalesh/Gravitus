// hooks/useCreateSplit.ts
import { useEffect, useState, useCallback } from 'react';
import { Exercise, workout } from '@/types/firestoreTypes';
import * as svc from '@/lib/orchestration/createSplitService';

/**
 * Custom hook for handling state and logic for creating a training split.
 * @returns State and handlers for creating a training split
 */
export function useCreateSplit() {
  // form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [repeatDays, setRepeatDays] = useState(false);
  const [weeksDurationStr, setWeeksDurationStr] = useState(''); // keep as string for input
  const weeksDuration = Number(weeksDurationStr || 0);

  // workouts editor state
  const [workouts, setWorkouts] = useState<workout[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  // exercise picker state
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDayIdx, setSelectedDayIdx] = useState<number | null>(null);
  const [selectedExIdx, setSelectedExIdx] = useState<number | null>(null);

  // load exercise catalog
  useEffect(() => { svc.loadAllExercises().then(setExercises); }, []);

  // day ops
  const addWorkoutDay = useCallback(() => {
    setWorkouts(prev => [...prev, { dayName: '', exercises: [] }]);
  }, []);

  const updateWorkoutDayName = useCallback((dayIdx: number, value: string) => {
    setWorkouts(prev => {
      const next = [...prev];
      next[dayIdx] = { ...next[dayIdx], dayName: value };
      return next;
    });
  }, []);

  // exercise row ops
  const addExerciseRow = useCallback((dayIdx: number) => {
    setWorkouts(prev => {
      const next = [...prev];
      next[dayIdx].exercises.push({ exerciseId: '', sets: 3, reps: { min: 4, max: 12 } });
      return next;
    });
  }, []);

  const updateExerciseField = useCallback((
    dayIdx: number,
    exIdx: number,
    field: 'exerciseId' | 'sets' | 'minReps' | 'maxReps',
    value: string
  ) => {
    setWorkouts(prev => {
      const next = [...prev];
      const target = { ...next[dayIdx].exercises[exIdx] };
      if (!target.reps) target.reps = { min: 0, max: 0 };

      if (field === 'sets') target.sets = Number(value) || 0;
      else if (field === 'minReps') target.reps.min = Number(value) || 0;
      else if (field === 'maxReps') target.reps.max = Number(value) || 0;
      else target.exerciseId = value;

      next[dayIdx].exercises[exIdx] = target;
      return next;
    });
  }, []);

  // modal helpers
  const openExercisePicker = useCallback((dayIdx: number, exIdx: number) => {
    setSelectedDayIdx(dayIdx);
    setSelectedExIdx(exIdx);
    setModalVisible(true);
  }, []);

  const handleExerciseSelect = useCallback((exerciseId: string) => {
    if (selectedDayIdx == null || selectedExIdx == null) return;
    updateExerciseField(selectedDayIdx, selectedExIdx, 'exerciseId', exerciseId);
    setModalVisible(false);
    setSearchQuery('');
    setSelectedDayIdx(null);
    setSelectedExIdx(null);
  }, [selectedDayIdx, selectedExIdx, updateExerciseField]);

  // save
  const saveSplit = useCallback(async () => {
    const payload = {
      name,
      description,
      repeatDays,
      weeksDuration,
      workouts,
    };
    const id = await svc.saveSplitFlow(payload);
    return id; // let caller navigate / toast
  }, [name, description, repeatDays, weeksDuration, workouts]);

  return {
    // form
    name, setName,
    description, setDescription,
    repeatDays, setRepeatDays,
    weeksDurationStr, setWeeksDurationStr,

    // workouts
    workouts, addWorkoutDay, updateWorkoutDayName,
    addExerciseRow, updateExerciseField,

    // modal
    modalVisible, setModalVisible, searchQuery, setSearchQuery,
    exercises, openExercisePicker, handleExerciseSelect,

    // save
    saveSplit,
  };
}
