// components/history/HistoryItem.tsx
import { View, Text } from 'react-native';
import FloatingCard from '@/components/floatingbox';

/**
 * Singular item in the history list contained in a floating card
 * @param param0 dictionary containing:
 *  @param logId The ID of the log
 *  @param date The date of the log
 *  @param dayName The name of the day
 *  @param splitName The name of the split
 *  @param onPress Function to call when the item is pressed
 * @returns A single item in the history list
 */
export default function HistoryItem({
  logId, date, dayName, splitName, onPress,
}: {
  logId: string; date: string; dayName: string; splitName: string; onPress: (id: string) => void;
}) {
  return (
    <FloatingCard height={70} width="90%" onPress={() => onPress(logId)}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>{dayName}</Text>
          <Text style={{ color: '#888', fontSize: 13, marginTop: 4 }}>{splitName}</Text>
        </View>
        <Text style={{ color: '#4FD6EA', fontSize: 14, fontWeight: '600' }}>{date.substring(0, 10)}</Text>
      </View>
    </FloatingCard>
  );
}
