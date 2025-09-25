// components/splits/SplitExerciseRow.tsx
import { View, Text } from 'react-native';
import FloatingCard from '@/components/floatingbox';

/**
 * 
 * @param param0 object containing:
 * - name: optional string for exercise name
 * - muscle: optional string for muscle group
 * - sets: number of sets
 * - reps: object with min and max reps
 * @returns component rendering a row with exercise details
 */
export default function SplitExerciseRow({
  name, muscle, sets, reps,
}: { name?: string; muscle?: string; sets: number; reps: {min:number; max:number} }) {
  return (
    <View style={{ width: '90%', alignSelf: 'center' }}>
      <FloatingCard height={70} width={350}>
        <View style={{
          flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', width: '100%'
        }}>
          <Text style={{ width: '33%', color: 'white', fontSize: 14, textAlign: 'left' }}>
            {name ?? '—'}
          </Text>
          <Text style={{ width: '33%', color: 'white', fontSize: 14, textAlign: 'center' }}>
            {muscle ?? '—'}
          </Text>
          <Text style={{ width: '33%', color: 'white', fontSize: 14, textAlign: 'right' }}>
            {sets} x {reps.min}-{reps.max}
          </Text>
        </View>
      </FloatingCard>
    </View>
  );
}
