// components/home/TodayPlanCard.tsx
import { View, Text } from 'react-native';
import FloatingCard from '@/components/floatingbox';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

type Props = {
  isDone: boolean;
  workoutMeta: { dayName: string; exerciseCount: number; setCount: number; estMins: string } | null;
  onPress: () => void;
};

export default function TodayPlanCard({ isDone, workoutMeta, onPress }: Props) {
  return (
    <FloatingCard height={170} width="90%" onPress={onPress}>
      <View style={{ flex: 1, justifyContent: 'space-between', paddingVertical: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <MaterialCommunityIcons name="dumbbell" size={28} color="white" />
          <Text style={{ color: 'white', fontSize: 20, fontWeight: '700', marginBottom: 12 }}>
            Today&apos;s Workout
          </Text>
        </View>

        <Text style={{ color: '#ccc', fontSize: 14, marginTop: 4, fontWeight: '500' }}>
          {workoutMeta?.dayName ?? '—'}
        </Text>

        {!isDone ? (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Feather name="list" size={16} color="#bbb" />
              <Text style={{ color: '#ccc', fontSize: 13 }}>
                {workoutMeta?.exerciseCount ?? 0} Exercises
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Feather name="repeat" size={16} color="#bbb" />
              <Text style={{ color: '#ccc', fontSize: 13 }}>
                {workoutMeta?.setCount ?? 0} Sets
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Feather name="clock" size={16} color="#bbb" />
              <Text style={{ color: '#ccc', fontSize: 13 }}>
                Est. {workoutMeta?.estMins ?? 0} min
              </Text>
            </View>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Feather name="list" size={16} color="#bbb" />
              <Text style={{ color: '#ccc', fontSize: 13 }}>
                Workout is complete, you may rest for the day
              </Text>
            </View>
          </View>
        )}

        <Text style={{ marginTop: 12, color: '#00e0a1', fontSize: 13, fontWeight: '600' }}>
          Tap to begin
        </Text>
      </View>
    </FloatingCard>
  );
}
