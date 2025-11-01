// hooks/useWorkoutEdits.tsx
// TODO: Need documentation
import { Alert } from 'react-native';
import { ExerciseLog, Exercise, workout } from '@/types/firestoreTypes';

export function useWorkoutEdits(
  workout: workout | null,
  log: ExerciseLog | null,
  setWorkout: React.Dispatch<React.SetStateAction<workout | null>>,
  setLog: React.Dispatch<React.SetStateAction<ExerciseLog | null>>,
) {
  const addExercise = (exercise: Exercise) => {
    if (!workout || !log) return;

    const generateInstanceId = () => {
      if (typeof crypto !== 'undefined' && (crypto as any).randomUUID) return (crypto as any).randomUUID();
      return Math.random().toString(36).slice(2) + Date.now().toString(36);
    };
    const instanceId = generateInstanceId();

    const newExercise = {
      instanceId,                     // <-- stable id for this instance
      exerciseId: exercise.id,
      sets: 2,
      reps: { min: 4, max: 12 },
      exerciseData: exercise,
    };

    setWorkout(curr =>
      curr ? { ...curr, exercises: [...curr.exercises, newExercise] } : curr
    );

    setLog(curr =>
      curr ? {
        ...curr,
        exercises: [
          ...curr.exercises,
          { instanceId, exerciseId: exercise.id, sets: Array.from({ length: 2 }, () => ({ weight: 0, reps: 0 })) },
        ],
      } : curr
    );
  };

  // Need to make sure when you delete an exercise that values from exercises underneath still remain
  /*
  const deleteExercise = (exIndex: number) => {
    if (!workout || !log) return;
    if (workout.exercises.length <= 1) {
      Alert.alert('Cannot delete only exercise');
      return;
    }
    setWorkout(curr => curr ? { ...curr, exercises: curr.exercises.filter((_, i) => i !== exIndex) } : curr);
    setLog(curr => curr ? { ...curr, exercises: curr.exercises.filter((_, i) => i !== exIndex) } : curr);
  };
  */

  const deleteExercise = (exIndex: number) => {
    if (!workout || !log) return;
    if (workout.exercises.length <= 1) {
      Alert.alert('Cannot delete only exercise');
      return;
    }

    const removedExerciseId = workout.exercises[exIndex]?.exerciseId;
    if (!removedExerciseId) return;

    console.log('removedExerciseId:', removedExerciseId);

    // Remove the exercise from the workout by index
    setWorkout(curr =>
      curr ? { ...curr, exercises: curr.exercises.filter((_, i) => i !== exIndex) } : curr
    );

    // Remove the corresponding log entry by matching exerciseId.
    // This prevents shifting user-entered values for exercises below.
    setLog(curr => {
      if (!curr) return curr;
      const logIndex = curr.exercises.findIndex(e => e.exerciseId === removedExerciseId);
      if (logIndex === -1) {
        // No id match — fall back to removing by the same index to keep arrays aligned
        return { ...curr, exercises: curr.exercises.filter((_, i) => i !== exIndex) };
      }
      return { ...curr, exercises: curr.exercises.filter((_, i) => i !== logIndex) };
    });
  };

  const addSet = (exIndex: number) => {
    if (!log) return;
    setLog(curr => {
      if (!curr) return curr;
      const ex = curr.exercises[exIndex];
      const next = { ...curr, exercises: curr.exercises.map((e, i) =>
        i === exIndex ? { ...e, sets: [...e.sets, { weight: 0, reps: 0 }] } : e
      )};
      return next;
    });
  };

  const removeSet = (exIndex: number) => {
    if (!log) return;
    setLog(curr => {
      if (!curr) return curr;
      const sets = curr.exercises[exIndex].sets;
      if (sets.length <= 1) { Alert.alert('Cannot delete the only set'); return curr; }
      const next = { ...curr, exercises: curr.exercises.map((e, i) =>
        i === exIndex ? { ...e, sets: e.sets.slice(0, -1) } : e
      )};
      return next;
    });
  };

  const updateSet = (exIndex: number, setIndex: number, field: 'weight'|'reps', value: number) => {
    if (!log) return;
    setLog(curr => {
      if (!curr) return curr;
      const next = { ...curr, exercises: curr.exercises.map((e, i) => {
        if (i !== exIndex) return e;
        const newSets = e.sets.map((s, si) => si === setIndex ? { ...s, [field]: value } : s);
        return { ...e, sets: newSets };
      })};
      return next;
    });
  };

  return { addExercise, deleteExercise, addSet, removeSet, updateSet };
}
