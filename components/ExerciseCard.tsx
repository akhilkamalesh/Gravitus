// components/workout/ExerciseCard.tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FloatingCard from '@/components/floatingbox';
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
};

export default function ExerciseCard({
  exercise, exIndex, sets, placeholders,
  onDelete, onAddSet, onRemoveSet, onUpdateSet,
}: Props) {
  return (
    <FloatingCard width="90%">
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
          {exercise.exerciseData?.name}
        </Text>
        <Pressable onPress={onDelete}>
          <Ionicons name="trash-outline" size={20} color="white" />
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
        <Text style={{ color: 'white', width: '22%', textAlign: 'center' }}>Set</Text>
        <Text style={{ color: 'white', width: '22%', textAlign: 'center' }}>Lbs</Text>
        <Text style={{ color: 'white', width: '22%', textAlign: 'center' }}>Reps</Text>
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

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '70%', alignSelf: 'center' }}>
        <Pressable style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }} onPress={onAddSet}>
          <Ionicons name="add-circle-outline" size={20} color="white" />
          <Text style={{ color: 'white', marginLeft: 6 }}>Add Set</Text>
        </Pressable>
        <Pressable style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }} onPress={onRemoveSet}>
          <Ionicons name="remove-circle-outline" size={20} color="white" />
          <Text style={{ color: 'white', marginLeft: 6 }}>Remove Set</Text>
        </Pressable>
      </View>
    </FloatingCard>
  );
}
