// components/history/HistoryExerciseLogCard.tsx
import { View, Text } from 'react-native';
import FloatingCard from '@/components/floatingbox';

/**
 * Creates the card for exercises containing their sets, weights, and reps
 * @param param0 object type containing:
 *  - @param name: name of the exercise
 *  - @param sets: array of objects containing weight and reps for each set
 * @returns 
 */
export default function HistoryExerciseLogCard({
  name, sets, notes
}: {
  name: string;
  sets: { weight: number; reps: number }[];
  notes?: string;
}) {
  return (
    <FloatingCard width="90%">
      <View style={{ marginBottom: 16 }}>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>{name}</Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, paddingHorizontal: 6, borderBottomWidth: 1, borderBottomColor: '#333', paddingBottom: 6 }}>
        <Text style={col}>Set</Text>
        <Text style={col}>Lbs</Text>
        <Text style={col}>Reps</Text>
      </View>

      {sets.map((s, i) => (
        <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 6, paddingVertical: 8 }}>
          <Text style={col}>{i + 1}</Text>
          <Text style={col}>{s.weight}</Text>
          <Text style={col}>{s.reps}</Text>
        </View>
      ))}

      {notes && (
        <View style={{ marginTop: 12, borderTopWidth: 1, borderTopColor: '#333', paddingTop: 12 }}>
          <Text style={{ color: '#888', fontSize: 12, fontStyle: 'italic' }}>Notes:</Text>
          <Text style={{ color: '#ccc', fontSize: 14, marginTop: 4 }}>{notes}</Text>
        </View>
      )}
    </FloatingCard>
  );
}

const col = { color: 'white', fontSize: 14, width: '22%', textAlign: 'center' } as const;
