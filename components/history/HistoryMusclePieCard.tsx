// components/history/HistoryMusclePieCard.tsx
import { View, Text } from 'react-native';
import FloatingCard from '@/components/floatingbox';
import MuscleGroupPieChart from '@/components/PieChart';

/**
 * pie chart of muscle group distribution
 * @param param0 object type containing:
 *  - data: array of objects containing muscle group and number of sets for that muscle group
 * @returns floating card containing pie chart of muscle group distribution
 */
export default function HistoryMusclePieCard({
  data,
}: { data: { muscle: string; sets: number }[] }) {
  return (
    <FloatingCard width="90%">
      <Text style={{ color: 'white', fontSize: 18, fontWeight: '600', marginBottom: 8 }}>
        Set Distribution by Muscle Group
      </Text>
      <MuscleGroupPieChart data={data} />
    </FloatingCard>
  );
}
