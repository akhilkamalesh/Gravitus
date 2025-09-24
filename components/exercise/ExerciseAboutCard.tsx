// components/exercise/ExerciseAboutCard.tsx
import { Text } from 'react-native';
import FloatingCard from '@/components/floatingbox';

/**
 * `ExerciseAboutCard` displays information about an exercise, including its primary muscle targeted,
 * optional secondary muscles, and the type of motion involved.
 *
 * @param primary - The primary muscle group targeted by the exercise.
 * @param secondary - Optional array of secondary muscle groups targeted.
 * @param motion - The type of motion performed in the exercise.
 * @param name - The name of the exercise, used as a label for the motion.
 *
 * Renders up to three floating cards:
 * - Primary muscle group
 * - Secondary muscle groups (if provided)
 * - Motion type, labeled with the exercise name
 */
export default function ExerciseAboutCard({
  primary, secondary, motion, name,
}: { primary: string; secondary?: string[]; motion: string; name: string }) {
  return (
    <>
      <FloatingCard width="90%">
        <Text style={{ fontSize: 14, color: '#bbb', fontWeight: '600', marginVertical: 6 }}>
          Primary Muscle Targeted:
        </Text>
        <Text style={{ fontSize: 16, color: 'white', fontWeight: '500' }}>{primary}</Text>
      </FloatingCard>

      {!!secondary?.length && (
        <FloatingCard width="90%">
          <Text style={{ fontSize: 14, color: '#bbb', fontWeight: '600', marginVertical: 6 }}>
            Secondary Muscle Targeted:
          </Text>
          <Text style={{ fontSize: 16, color: 'white', fontWeight: '500' }}>
            {secondary.join(', ')}
          </Text>
        </FloatingCard>
      )}

      <FloatingCard width="90%">
        <Text style={{ fontSize: 14, color: '#bbb', fontWeight: '600', marginVertical: 6 }}>
          {name} Motion:
        </Text>
        <Text style={{ fontSize: 16, color: 'white', fontWeight: '500' }}>{motion}</Text>
      </FloatingCard>
    </>
  );
}
