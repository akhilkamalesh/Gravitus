// components/splits/CreateSplitHeader.tsx
import { TextInput, View, Text, StyleSheet } from 'react-native';

/**
 * 
 * @param param0 object containing
 * - name: string
 * - setName: state for name
 * - description: string
 * - setDescription: state for description
 * - weeksDurationStr: string
 * - setWeeksDurationStr: state for weeksDurationStr
 * @returns A header component with text inputs for name, description, and weeks duration
 */
export default function CreateSplitHeader({
  name, setName, description, setDescription, weeksDurationStr, setWeeksDurationStr
}: {
  name: string; setName: (v: string) => void;
  description: string; setDescription: (v: string) => void;
  weeksDurationStr: string; setWeeksDurationStr: (v: string) => void;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>SPLIT NAME</Text>
      <TextInput
        style={styles.inputLarge}
        placeholder="e.g. Upper/Lower Split"
        placeholderTextColor="#444"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>DESCRIPTION</Text>
      <TextInput
        style={styles.inputNormal}
        placeholder="Brief description of goals"
        placeholderTextColor="#444"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>DURATION (WEEKS)</Text>
      <TextInput
        style={styles.inputNormal}
        placeholder="Duration"
        placeholderTextColor="#444"
        keyboardType="numeric"
        value={weeksDurationStr}
        onChangeText={(t) => setWeeksDurationStr(t.replace(/[^0-9]/g, ''))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
  },
  label: {
    color: '#888',
    fontSize: 12,
    marginBottom: 5,
    fontWeight: '600',
  },
  inputLarge: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 10,
  },
  inputNormal: {
    fontSize: 16,
    color: 'white',
    textAlign: 'left',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 10,
  },
});
