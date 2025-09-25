// components/splits/CreateSplitHeader.tsx
import { TextInput } from 'react-native';

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
    <>
      <TextInput
        style={{
          fontSize: 28, fontWeight: '600', color: 'white',
          alignSelf: 'center', textAlign: 'center', margin: 12
        }}
        placeholder="Set Split Name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={{
          fontSize: 15, fontWeight: '600', color: 'white',
          alignSelf: 'center', textAlign: 'center', marginVertical: 15
        }}
        placeholder="Enter Pseudo Description Here"
        placeholderTextColor="#aaa"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={{
          fontSize: 15, fontWeight: '600', color: 'white',
          alignSelf: 'center', textAlign: 'center', marginBottom: 8
        }}
        placeholder="Weeks Duration"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        value={weeksDurationStr}
        onChangeText={(t) => setWeeksDurationStr(t.replace(/[^0-9]/g, ''))}
      />
    </>
  );
}
