// components/splits/SplitWorkoutSection.tsx
import { View, Text } from 'react-native';
import SplitExerciseRow from './SplitExerciseRow';
import { workout } from '@/types/firestoreTypes';

/**
 * 
 * @param param0 object containing:
 * - w: workout object with dayName and exercises
 * @returns 
 */
export default function SplitWorkoutSection({ w }: { w: workout }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{
        fontSize: 25, fontWeight: '600', color: 'white',
        alignSelf: 'center', textAlign: 'center', marginTop: 10
      }}>
        {w.dayName}
      </Text>

      <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', marginTop: 10, width: '90%' }}>
        <Text style={{ width: '33%', color: 'white', fontSize: 16, fontWeight: '600', textAlign: 'center' }}>Exercises:</Text>
        <Text style={{ width: '33%', color: 'white', fontSize: 16, fontWeight: '600', textAlign: 'center' }}>Muscle Group:</Text>
        <Text style={{ width: '33%', color: 'white', fontSize: 16, fontWeight: '600', textAlign: 'center' }}>Sets/Reps:</Text>
      </View>

      {w.exercises.map((e, i) => (
        <SplitExerciseRow
          key={`${e.exerciseId}-${i}`}
          name={e.exerciseData?.name}
          muscle={e.exerciseData?.primaryMuscleGroup}
          sets={e.sets}
          reps={e.reps}
        />
      ))}
    </View>
  );
}
