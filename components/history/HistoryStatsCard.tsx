// components/history/HistoryStatsCard.tsx
import { View, Text } from 'react-native';
import FloatingCard from '@/components/floatingbox';

/**
 * Card component that holds the summary statistics for a workout history entry.
 * @param param0 object type containing:
 *  - exerciseCount: number of exercises in the workout
 *  - totalVolume: total volume of the workout
 * @returns A card component displaying summary statistics for a workout history entry.
 */
export default function HistoryStatsCard({
  exerciseCount, totalVolume,
}: { exerciseCount: number; totalVolume: number; }) {
  return (
    <FloatingCard width="90%">
      <View style={{ marginBottom: 8 }}>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Summary Statistics</Text>
      </View>
      <View style={{ alignItems: 'center', gap: 6, marginTop: 6 }}>
        <Text style={{ color: '#ccc', fontSize: 14 }}>Number of Exercises: {exerciseCount}</Text>
        <Text style={{ color: '#ccc', fontSize: 14 }}>Total Volume: {totalVolume}</Text>
      </View>
    </FloatingCard>
  );
}
