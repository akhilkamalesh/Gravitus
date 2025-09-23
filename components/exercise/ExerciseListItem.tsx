// components/exercises/ExerciseListItem.tsx
import { View, Text } from 'react-native';
import FloatingCard from '@/components/floatingbox';

/**
 * Renders a single exercise item inside a floating card.
 * Displays the exercise name, primary muscle group, and motion type.
 * Triggers the `onPress` callback with the exercise `id` when pressed.
 *
 * @param props - The props for the ExerciseListItem component.
 * @param props.id - Unique identifier for the exercise.
 * @param props.name - Name of the exercise.
 * @param props.primary - Primary muscle group targeted by the exercise.
 * @param props.motion - Type of motion performed in the exercise.
 * @param props.onPress - Callback function invoked when the item is pressed, receives the exercise `id`.
 *
 * @returns A React element representing the exercise list item.
 */
export default function ExerciseListItem({
  id, name, primary, motion, onPress,
}: {
  id: string; name: string; primary: string; motion: string;
  onPress: (id: string) => void;
}) {
  return (
    <FloatingCard key={id} width="90%" height={95} onPress={() => onPress(id)}>
      <View style={{ flex:1, justifyContent:'space-between', paddingVertical:8 }}>
        <View style={{ flexDirection:'row', justifyContent:'space-between', marginBottom:6 }}>
          <Text style={{ color:'white', fontSize:18, fontWeight:'600', flex:1 }} numberOfLines={2}>
            {name}
          </Text>
        </View>
        <View style={{ flexDirection:'row', justifyContent:'space-between', gap:16 }}>
          <Text style={{ color:'#bbb', fontSize:13 }}>Primary: {primary}</Text>
          <Text style={{ color:'#bbb', fontSize:13 }}>Motion: {motion}</Text>
        </View>
      </View>
    </FloatingCard>
  );
}
