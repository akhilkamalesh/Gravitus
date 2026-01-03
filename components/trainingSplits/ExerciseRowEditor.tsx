// components/splits/ExerciseRowEditor.tsx
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * 
 * @param param0 object containing:
 * - name: string (exercise name)
 * - onPick: function to call when picking an exercise
 * - sets: number (number of sets)
 * - minReps: number (minimum reps)
 * - maxReps: number (maximum reps)
 * - onChangeSets: function to call when sets change
 * - onChangeMin: function to call when min reps change
 * - onChangeMax: function to call when max reps change
 * @returns component for editing an exercise row in a workout day
 */
export default function ExerciseRowEditor({
  name, onPick, sets, minReps, maxReps, rpe,
  onChangeSets, onChangeMin, onChangeMax, onChangeRpe, onRemove
}: {
  name: string;
  onPick: () => void;
  sets: number; minReps: number; maxReps: number; rpe?: number;
  onChangeSets: (v: string) => void;
  onChangeMin: (v: string) => void;
  onChangeMax: (v: string) => void;
  onChangeRpe: (v: string) => void;
  onRemove?: () => void;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.exerciseLabel}>Exercise</Text>
        <View style={styles.headerActions}>
          <Pressable onPress={onPick} style={styles.exerciseButton}>
            <Text style={styles.exerciseButtonText}>{name || 'Select Exercise'}</Text>
          </Pressable>
          {onRemove && (
            <Pressable onPress={onRemove} style={styles.removeButton}>
              <Ionicons name="trash-outline" size={20} color="#ff4444" />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.labelsRow}>
        <Text style={styles.headerText}>Sets</Text>
        <Text style={styles.headerText}>Min Reps</Text>
        <Text style={styles.headerText}>Max Reps</Text>
        <Text style={styles.headerText}>RPE</Text>
      </View>

      <View style={styles.inputsRow}>
        <TextInput style={styles.input} placeholder="3" placeholderTextColor="#666" keyboardType="numeric" value={sets ? String(sets) : ''} onChangeText={onChangeSets} />
        <TextInput style={styles.input} placeholder="8" placeholderTextColor="#666" keyboardType="numeric" value={minReps ? String(minReps) : ''} onChangeText={onChangeMin} />
        <TextInput style={styles.input} placeholder="12" placeholderTextColor="#666" keyboardType="numeric" value={maxReps ? String(maxReps) : ''} onChangeText={onChangeMax} />
        <TextInput style={styles.input} placeholder="8" placeholderTextColor="#666" keyboardType="numeric" value={rpe ? String(rpe) : ''} onChangeText={onChangeRpe} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  exerciseLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  exerciseButton: {
    backgroundColor: '#444',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  exerciseButtonText: {
    color: 'white',
    fontSize: 16,
  },
  removeButton: {
    padding: 5,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  headerText: {
    width: '22%',
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
  },
  inputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    backgroundColor: '#1a1d21',
    color: 'white',
    padding: 8,
    borderRadius: 6,
    width: '22%',
    textAlign: 'center',
  },
});
