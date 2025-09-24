// components/exercise/ExerciseStatsCard.tsx
import FloatingCard from '@/components/floatingbox';
import { Text } from 'react-native';

/**
 * `ExerciseStatsCard` displays summary statistics for an exercise, including the number of sessions
 * and details about the best volume set performed.
 *
 * @param sessionCount - The total number of sessions completed for the exercise.
 * @param bestSet - Optional details of the best set, including weight, reps, volume, and date.
 *
 * @remarks
 * - Renders two cards: one for session count and one for the best volume set.
 * - If `bestSet` is not provided, displays a placeholder message.
 */
export default function ExerciseStatsCard({
  sessionCount, bestSet,
}: {
  sessionCount: number;
  bestSet?: { weight: number; reps: number; volume: number; date: string };
}) {
  return (
    <>
      <FloatingCard width="90%">
        <Text style={{ fontSize: 14, color: '#bbb', fontWeight: '600', marginVertical: 6 }}>
          Number of Sessions:
        </Text>
        <Text style={{ fontSize: 16, color: 'white', fontWeight: '500' }}>{sessionCount}</Text>
      </FloatingCard>

      <FloatingCard width="90%">
        <Text style={{ fontSize: 14, color: '#bbb', fontWeight: '600', marginVertical: 6 }}>
          Best Volume Set:
        </Text>
        {bestSet ? (
          <Text style={{ fontSize: 16, color: 'white', fontWeight: '500' }}>
            {bestSet.volume} lbs — ({bestSet.weight} lbs × {bestSet.reps} reps)
          </Text>
        ) : (
          <Text style={{ fontSize: 16, color: 'white', fontWeight: '500' }}>
            No set information found
          </Text>
        )}
      </FloatingCard>
    </>
  );
}
