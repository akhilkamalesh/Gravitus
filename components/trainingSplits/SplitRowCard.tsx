// components/trainingSplits/SplitRowCard.tsx
import { View, Text } from 'react-native';
import FloatingCard from '@/components/floatingbox';
import { Feather } from '@expo/vector-icons';

export default function SplitRowCard({
  icon = 'folder',
  title,
  onPress,
}: {
  icon?: 'folder' | 'calendar' | 'edit';
  title: string;
  onPress: () => void;
}) {
  return (
    <FloatingCard width="90%" height={70} onPress={onPress}>
      <View style={{ flex:1, flexDirection:'row', alignItems:'center', paddingHorizontal:12, gap:12 }}>
        <Feather name={icon} size={18} color="#bbb" style={{ marginTop: 2 }} />
        <Text style={{ color:'white', fontWeight:'600', fontSize:18 }}>{title}</Text>
      </View>
    </FloatingCard>
  );
}
