// components/exercise/ExerciseLineCard.tsx
import { View, Text } from 'react-native';
import FloatingCard from '@/components/floatingbox';
import StatLineChart from '@/components/LineGraph';

/**
 * `ExerciseLineCard` is a React Native component that displays a floating card
 * containing a line chart of estimated one rep max values over time.
 *
 * @param data - An array of objects representing the data points for the chart.
 *               Each object should have a `date` (string) and a `value` (number).
 * @param label - An optional label to display on the chart. If not provided,
 *                the latest value from the data array will be used as the label.
 *
 * @returns A styled card with a title and a line chart visualizing the provided data.
 *          Returns `null` if the data array is empty or undefined.
 */
export default function ExerciseLineCard({
  data, label,
}: { data: { date: string; value: number }[]; label?: string }) {
  if (!data?.length) return null;
  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <FloatingCard width="90%">
        <Text style={{ color: 'white', fontSize: 18, fontWeight: '600', marginBottom: 8 }}>
          Estimated One Rep Max Over Time
        </Text>
        <View style={{ marginTop: 8, marginBottom: 10, width: '100%', alignItems: 'center' }}>
          <StatLineChart data={data} label={label ?? String(data[data.length - 1]?.value ?? '')} />
        </View>
      </FloatingCard>
    </View>
  );
}
