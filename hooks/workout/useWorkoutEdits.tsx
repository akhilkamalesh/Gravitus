// hooks/workout/useWorkoutEdits.ts
import { useCallback } from 'react';
import { Exercise, ExerciseLog, workout, workoutExercise } from '@/types/firestoreTypes';

export function useWorkoutEdits(
  workout: workout | null,
  log: ExerciseLog | null,
  setWorkout: React.Dispatch<React.SetStateAction<workout | null>>,
  setLog: React.Dispatch<React.SetStateAction<ExerciseLog | null>>
) {
  // Add a new exercise to BOTH workout and log (keeps indices aligned)
  const addExercise = useCallback((selected: Exercise) => {
    if (!workout || !log) return;
    const ex: workoutExercise = {
      exerciseId: selected.id,
      sets: 2,
      reps: { min: 4, max: 12 },
      exerciseData: selected,
    };

    setWorkout(prev => {
      if (!prev) return prev;
      return { ...prev, exercises: [...prev.exercises, ex] };
    });

    setLog(prev => {
      if (!prev) return prev;
      const newLogEntry = {
        exerciseId: selected.id,
        sets: Array.from({ length: 2 }, () => ({ weight: 0, reps: 0 })),
      };
      return { ...prev, exercises: [...prev.exercises, newLogEntry] };
    });
  }, [workout, log, setWorkout, setLog]);

  // Delete exercise at index in BOTH structures
  const deleteExercise = useCallback((exerciseIndex: number) => {
    if (!workout || !log) return;

    setWorkout(prev => {
      if (!prev) return prev;
      const next = prev.exercises.filter((_, i) => i !== exerciseIndex);
      return { ...prev, exercises: next };
    });

    setLog(prev => {
      if (!prev) return prev;
      const next = prev.exercises.filter((_, i) => i !== exerciseIndex);
      return { ...prev, exercises: next };
    });
  }, [workout, log, setWorkout, setLog]);

  // Add a set row to a specific exercise
  const addSet = useCallback((exerciseIndex: number) => {
    if (!log) return;
    setLog(prev => {
      if (!prev) return prev;
      const next = [...prev.exercises];
      const currSets = next[exerciseIndex]?.sets ?? [];
      next[exerciseIndex] = {
        ...next[exerciseIndex],
        sets: [...currSets, { weight: 0, reps: 0 }],
      };
      return { ...prev, exercises: next };
    });
  }, [log, setLog]);

  // Remove a set row (keep at least 1)
  const removeSet = useCallback((exerciseIndex: number) => {
    if (!log) return;
    setLog(prev => {
      if (!prev) return prev;
      const next = [...prev.exercises];
      const currSets = next[exerciseIndex]?.sets ?? [];
      if (currSets.length <= 1) return prev; // guard
      next[exerciseIndex] = {
        ...next[exerciseIndex],
        sets: currSets.slice(0, currSets.length - 1),
      };
      return { ...prev, exercises: next };
    });
  }, [log, setLog]);

  // Update a single set’s field
  const updateSet = useCallback((
    exerciseIndex: number,
    setIndex: number,
    field: 'weight' | 'reps',
    value: number
  ) => {
    if (!log) return;
    setLog(prev => {
      if (!prev) return prev;
      const next = [...prev.exercises];
      const curr = next[exerciseIndex];
      if (!curr) return prev;
      const sets = [...curr.sets];
      const set = { ...sets[setIndex] };
      set[field] = value;
      sets[setIndex] = set;
      next[exerciseIndex] = { ...curr, sets };
      return { ...prev, exercises: next };
    });
  }, [log, setLog]);

  return { addExercise, deleteExercise, addSet, removeSet, updateSet };
}


// // hooks/useWorkoutEdits.tsx
// // TODO: Need documentation
// import { Alert } from 'react-native';
// import { ExerciseLog, Exercise, workout } from '@/types/firestoreTypes';

// export function useWorkoutEdits(
//   workout: workout | null,
//   log: ExerciseLog | null,
//   setWorkout: React.Dispatch<React.SetStateAction<workout | null>>,
//   setLog: React.Dispatch<React.SetStateAction<ExerciseLog | null>>,
// ) {
//   const addExercise = (exercise: Exercise) => {
//     if (!workout || !log) return;

//     const newExercise = {
//       exerciseId: exercise.id,
//       sets: 2,
//       reps: { min: 4, max: 12 },
//       exerciseData: exercise,
//     };

//     setWorkout(curr =>
//       curr ? { ...curr, exercises: [...curr.exercises, newExercise] } : curr
//     );

//     setLog(curr =>
//       curr ? {
//         ...curr,
//         exercises: [
//           ...curr.exercises,
//           { exerciseId: exercise.id, sets: Array.from({ length: 2 }, () => ({ weight: 0, reps: 0 })) },
//         ],
//       } : curr
//     );
//   };

//   const deleteExercise = (exIndex: number) => {
//     if (!workout || !log) return;
//     if (workout.exercises.length <= 1) {
//       Alert.alert('Cannot delete only exercise');
//       return;
//     }
//     setWorkout(curr => curr ? { ...curr, exercises: curr.exercises.filter((_, i) => i !== exIndex) } : curr);
//     setLog(curr => curr ? { ...curr, exercises: curr.exercises.filter((_, i) => i !== exIndex) } : curr);
//   };

//   const addSet = (exIndex: number) => {
//     if (!log) return;
//     setLog(curr => {
//       if (!curr) return curr;
//       const ex = curr.exercises[exIndex];
//       const next = { ...curr, exercises: curr.exercises.map((e, i) =>
//         i === exIndex ? { ...e, sets: [...e.sets, { weight: 0, reps: 0 }] } : e
//       )};
//       return next;
//     });
//   };

//   const removeSet = (exIndex: number) => {
//     if (!log) return;
//     setLog(curr => {
//       if (!curr) return curr;
//       const sets = curr.exercises[exIndex].sets;
//       if (sets.length <= 1) { Alert.alert('Cannot delete the only set'); return curr; }
//       const next = { ...curr, exercises: curr.exercises.map((e, i) =>
//         i === exIndex ? { ...e, sets: e.sets.slice(0, -1) } : e
//       )};
//       return next;
//     });
//   };

//   const updateSet = (exIndex: number, setIndex: number, field: 'weight'|'reps', value: number) => {
//     if (!log) return;
//     setLog(curr => {
//       if (!curr) return curr;
//       const next = { ...curr, exercises: curr.exercises.map((e, i) => {
//         if (i !== exIndex) return e;
//         const newSets = e.sets.map((s, si) => si === setIndex ? { ...s, [field]: value } : s);
//         return { ...e, sets: newSets };
//       })};
//       return next;
//     });
//   };

//   return { addExercise, deleteExercise, addSet, removeSet, updateSet };
// }
