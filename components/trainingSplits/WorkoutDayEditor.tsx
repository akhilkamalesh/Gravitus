// components/splits/WorkoutDayEditor.tsx
import { View, Text, Pressable, TextInput } from 'react-native';

/**
 * 
 * @param param0 object containing:
 * - index: number (day index)
 * - value: string (day name)
 * - onChangeName: function to call when day name changes
 * - onAddExercise: function to call to add a new exercise row
 * - children: React nodes representing exercise rows
 * @returns A component for editing a workout day, including its name and exercises
 */
export default function WorkoutDayEditor({
  index, value, onChangeName, onAddExercise, children
}: {
  index: number;
  value: string;
  onChangeName: (v: string) => void;
  onAddExercise: () => void;
  children: React.ReactNode; // exercise rows
}) {
  return (
    <View style={{ marginBottom: 20 }}>
      <TextInput
        style={{
          fontSize: 25, fontWeight: '600', color: 'white',
          alignSelf: 'center', textAlign: 'center', marginVertical: 10
        }}
        placeholder={`Workout Day ${index + 1}`}
        placeholderTextColor="#aaa"
        value={value}
        onChangeText={onChangeName}
      />
      {children}
      <Pressable onPress={onAddExercise} style={{ marginTop: 12 }}>
        <Text style={{ color: '#4FD6EA', fontSize: 16, alignSelf: 'center' }}>+ Add Exercise</Text>
      </Pressable>
    </View>
  );
}
