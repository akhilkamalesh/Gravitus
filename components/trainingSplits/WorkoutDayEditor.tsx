// components/splits/WorkoutDayEditor.tsx
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';

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
  index, value, onChangeName, onAddExercise, children, placeholder
}: {
  index: number;
  value: string;
  onChangeName: (v: string) => void;
  onAddExercise: () => void;
  children: React.ReactNode;
  placeholder?: string;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>WORKOUT NAME</Text>
      <TextInput
        style={styles.dayInput}
        placeholder={placeholder || `Workout Day ${index + 1}`}
        placeholderTextColor="#aaa"
        value={value}
        onChangeText={onChangeName}
      />
      {children}
      <Pressable onPress={onAddExercise} style={styles.addExerciseBtn}>
        <Text style={styles.addExerciseText}>+ Add Exercise</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginHorizontal: 20,
  },
  dayInput: {
    fontSize: 25,
    fontWeight: '600',
    color: 'white',
    alignSelf: 'flex-start',
    textAlign: 'left',
    marginTop: 0,
    marginBottom: 30,
    width: '100%',
  },
  addExerciseBtn: {
    marginTop: 15,
    alignSelf: 'center',
    padding: 10,
    borderWidth: 1,
    // borderColor: '#333',
    // borderRadius: 8,
    // backgroundColor: '#222',
  },
  addExerciseText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  label: {
    color: '#888',
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
  }
});
