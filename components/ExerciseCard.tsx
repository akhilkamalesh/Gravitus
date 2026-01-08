// components/workout/ExerciseCard.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SetRow from './SetRow';
import { workoutExercise } from '@/types/firestoreTypes';

type Placeholder = { date: string; reps: number; weight: number };

type Props = {
  exercise: workoutExercise;
  exIndex: number;
  // pass the mutable log sets for this exercise:
  sets: { weight: number; reps: number }[];
  // most-recent placeholders to show as input placeholders (optional)
  placeholders?: Placeholder[];
  onDelete: () => void;
  onAddSet: () => void;
  onRemoveSet: () => void;
  onUpdateSet: (setIdx: number, field: 'weight' | 'reps', val: string) => void;
  onOpenHistory: () => void;
};

export default function ExerciseCard({
  exercise, exIndex, sets, placeholders,
  onDelete, onAddSet, onRemoveSet, onUpdateSet, onOpenHistory
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable onPress={onOpenHistory} style={styles.titleContainer}>
          <Text style={styles.exerciseName}>
            {exercise.exerciseData?.name}
          </Text>
          <Ionicons name="time-outline" size={16} color="#4FD6EA" style={{ marginLeft: 8 }} />
        </Pressable>
        <Pressable onPress={onDelete} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={20} color="#ff4444" />
        </Pressable>
      </View>

      <View style={styles.labelsRow}>
        <Text style={styles.colLabel}>Set</Text>
        <Text style={styles.colLabel}>Lbs</Text>
        <Text style={styles.colLabel}>Reps</Text>
      </View>

      {/* Render each set row */}
      {sets.map((_, setIdx) => {
        const ph = placeholders?.[setIdx];
        return (
          <SetRow
            key={setIdx}
            index={setIdx}
            placeholder={ph ? { weight: ph.weight, reps: ph.reps } : undefined}
            onChange={(field, v) => onUpdateSet(setIdx, field, v)}
          />
        );
      })}

      <View style={styles.actionsRow}>
        <Pressable style={styles.actionButton} onPress={onAddSet}>
          <Ionicons name="add-circle-outline" size={20} color="white" />
          <Text style={styles.actionText}>Add Set</Text>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={onRemoveSet}>
          <Ionicons name="remove-circle-outline" size={20} color="white" />
          <Text style={styles.actionText}>Remove Set</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    backgroundColor: '#121417',
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    alignSelf: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 4,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  colLabel: {
    color: '#888',
    width: '28%',
    textAlign: 'center',
    fontSize: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
});
