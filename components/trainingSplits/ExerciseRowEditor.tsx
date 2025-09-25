// components/splits/ExerciseRowEditor.tsx
import { View, Text, Pressable, TextInput } from 'react-native';

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
  name, onPick, sets, minReps, maxReps,
  onChangeSets, onChangeMin, onChangeMax,
}: {
  name: string;
  onPick: () => void;
  sets: number; minReps: number; maxReps: number;
  onChangeSets: (v: string) => void;
  onChangeMin: (v: string) => void;
  onChangeMax: (v: string) => void;
}) {
  return (
    <View style={{ marginBottom: 12, width: '100%' }}>
      <View style={{ flexDirection: 'row', alignSelf: 'center', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
        <Text style={{ width: '30%', color: 'white', fontSize: 16, fontWeight: '600', textAlign: 'center' }}>Exercise:</Text>
        <Pressable onPress={onPick} style={{ backgroundColor: '#2C3237', borderRadius: 6, paddingVertical: 10, paddingHorizontal: 12, marginBottom: 6, alignSelf: 'flex-start' }}>
          <Text style={{ color: 'white', fontSize: 16 }}>{name || 'Select Exercise'}</Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', alignSelf: 'center', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
        <Text style={hdr}>Sets:</Text>
        <Text style={hdr}>Min Reps:</Text>
        <Text style={hdr}>Max Reps:</Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <TextInput style={inp} placeholder="Sets" keyboardType="numeric" value={String(sets)} onChangeText={onChangeSets} />
        <TextInput style={inp} placeholder="Min Reps" keyboardType="numeric" value={String(minReps ?? '')} onChangeText={onChangeMin} />
        <TextInput style={inp} placeholder="Max Reps" keyboardType="numeric" value={String(maxReps ?? '')} onChangeText={onChangeMax} />
      </View>
    </View>
  );
}
const hdr = { width: '30%', color: 'white', fontSize: 16, fontWeight: '600', textAlign: 'center', marginBottom: 6 } as const;
const inp = { backgroundColor: '#333', color: 'white', padding: 8, borderRadius: 6, marginRight: 8, flex: 1, textAlign: 'center' } as const;
