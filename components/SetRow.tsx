import { View, Text, TextInput, StyleSheet } from 'react-native';

/**
 * SetRow component
 * @param 
 * - index [number]
 * - placeholder: [weight, reps]
 * - onChange [function with params: weight|reps]
 * @returns row within exerciseCard
 */
export default function SetRow({ index, placeholder, onChange }: {
  index: number;
  placeholder?: { weight: number; reps: number };
  onChange: (field: 'weight' | 'reps', value: string) => void;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.col}>{index + 1}</Text>
      <TextInput style={styles.input} keyboardType="numeric"
        placeholder={String(placeholder?.weight ?? 0)} placeholderTextColor="#555"
        onChangeText={(v) => onChange('weight', v)} />
      <TextInput style={styles.input} keyboardType="numeric"
        placeholder={String(placeholder?.reps ?? 0)} placeholderTextColor="#555"
        onChangeText={(v) => onChange('reps', v)} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  col: { color: 'white', width: '28%', textAlign: 'center', fontSize: 14 },
  input: {
    backgroundColor: '#1A1D21',
    color: 'white',
    width: '28%',
    textAlign: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    paddingVertical: 8,
    fontSize: 14,
  },
});
