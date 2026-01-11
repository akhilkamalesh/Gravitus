import { View, Text, TextInput, StyleSheet } from 'react-native';

/**
 * SetRow component
 * @param 
 * - index [number]
 * - placeholder: [weight, reps]
 * - onChange [function with params: weight|reps]
 * @returns row within exerciseCard
 */
export default function SetRow({ index, placeholder, values, onChange, disabled }: {
  index: number;
  placeholder?: { weight: number; reps: number };
  values?: { weight: number; reps: number };
  onChange: (field: 'weight' | 'reps', value: string) => void;
  disabled?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.col}>{index + 1}</Text>
      <TextInput
        style={[styles.input, disabled && styles.disabledInput]}
        keyboardType="numeric"
        placeholder={String(placeholder?.weight ?? 0)}
        placeholderTextColor="#555"
        value={values ? String(values.weight) : undefined}
        editable={!disabled}
        onChangeText={(v) => onChange('weight', v)}
      />
      <TextInput
        style={[styles.input, disabled && styles.disabledInput]}
        keyboardType="numeric"
        placeholder={String(placeholder?.reps ?? 0)}
        placeholderTextColor="#555"
        value={values ? String(values.reps) : undefined}
        editable={!disabled}
        onChangeText={(v) => onChange('reps', v)}
      />
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
  disabledInput: {
    opacity: 0.5,
    backgroundColor: '#111',
  },
});
