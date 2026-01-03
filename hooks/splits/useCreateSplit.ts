// hooks/useCreateSplit.ts
import { useEffect, useState, useCallback } from 'react';
import { Exercise, workout, Split } from '@/types/firestoreTypes';
import * as svc from '@/lib/orchestration/createSplitService';
import { router } from 'expo-router';

/**
 * Custom hook for handling state and logic for creating a training split.
 * @returns State and handlers for creating a training split
 */
export function useCreateSplit() {
  // form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [trainingStyle, setTrainingStyle] = useState(''); // New
  const [repeatDays, setRepeatDays] = useState(false);
  const [weeksDurationStr, setWeeksDurationStr] = useState(''); // keep as string for input
  const weeksDuration = Number(weeksDurationStr || 0);

  // schedule state
  const [scheduledDays, setScheduledDays] = useState<string[]>([]); // New
  const [daysPerCycleStr, setDaysPerCycleStr] = useState('7'); // Default 7 days
  const daysPerCycle = Number(daysPerCycleStr) || 7;

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
      // Default new exercise
      next[dayIdx].exercises.push({
        exerciseId: '',
        sets: 3,
        reps: { min: 8, max: 12 },
        rpe: 8
      });
      return next;
    });
  }, []);

  const removeExerciseRow = useCallback((dayIdx: number, exIdx: number) => {
    setWorkouts(prev => {
      const next = [...prev];
      if (next[dayIdx] && next[dayIdx].exercises) {
        const updatedExercises = [...next[dayIdx].exercises];
        updatedExercises.splice(exIdx, 1);
        next[dayIdx] = { ...next[dayIdx], exercises: updatedExercises };
      }
      return next;
    });
  }, []);

  const initializeWorkouts = useCallback((count: number, days?: string[]) => {
    setWorkouts(prev => {
      // If we are just resizing, try to preserve data
      const newWorkouts = [...prev];

      // Resize
      if (newWorkouts.length < count) {
        const needed = count - newWorkouts.length;
        for (let i = 0; i < needed; i++) {
          newWorkouts.push({ dayName: '', exercises: [] });
        }
      } else if (newWorkouts.length > count) {
        newWorkouts.length = count;
      }

      // Assign scheduled dates if provided
      if (days && days.length === count) {
        newWorkouts.forEach((w, i) => {
          // Only overwrite if empty or explicitly syncing? 
          // Let's overwrite to ensure sync with Step 2 choices.
          newWorkouts[i] = { ...w, scheduledDate: days[i] };
        });
      }

      return newWorkouts;
    });
  }, []);

  const updateWorkoutDaySchedule = useCallback((dayIdx: number, day: string) => {
    setWorkouts(prev => {
      const next = [...prev];
      next[dayIdx] = { ...next[dayIdx], scheduledDate: day };
      return next;
    });
  }, []);

  const updateExerciseField = useCallback((
    dayIdx: number,
    exIdx: number,
    field: 'exerciseId' | 'sets' | 'minReps' | 'maxReps' | 'rpe',
    value: string
  ) => {
    setWorkouts(prev => {
      const next = [...prev];
      const target = { ...next[dayIdx].exercises[exIdx] };
      if (!target.reps) target.reps = { min: 0, max: 0 };

      if (field === 'sets') target.sets = Number(value) || 0;
      else if (field === 'minReps') target.reps.min = Number(value) || 0;
      else if (field === 'maxReps') target.reps.max = Number(value) || 0;
      else if (field === 'rpe') target.rpe = Number(value) || 0;
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
    // Construct payload matching Split (or strict subset used by service)
    // Note: svc.saveSplitFlow implementation might need to be checked if it strictly defines the payload type
    // Assuming it takes a Partial<Split> or similar input object.

    // We need to pass the raw values. The service usually handles the ID generation etc.
    const payload: any = {
      name,
      description,
      trainingStyle,
      repeatDays,
      weeksDuration,
      daysPerCycle,
      scheduledDays: scheduledDays.length > 0 ? scheduledDays : undefined,
      workouts,
    };

    const id = await svc.saveSplitFlow(payload);
    return id;
  }, [name, description, trainingStyle, repeatDays, weeksDuration, daysPerCycle, scheduledDays, workouts]);

  return {
    // form
    name, setName,
    description, setDescription,
    trainingStyle, setTrainingStyle,
    repeatDays, setRepeatDays,
    weeksDurationStr, setWeeksDurationStr,

    // schedule
    scheduledDays, setScheduledDays,
    daysPerCycleStr, setDaysPerCycleStr,

    // workouts
    workouts, addWorkoutDay, updateWorkoutDayName, updateWorkoutDaySchedule,
    addExerciseRow, removeExerciseRow, updateExerciseField, initializeWorkouts,

    // modal
    modalVisible, setModalVisible, searchQuery, setSearchQuery,
    exercises, openExercisePicker, handleExerciseSelect,

    // save
    saveSplit,
  };
}
