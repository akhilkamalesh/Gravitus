// components/home/ExploreCard.tsx
import { Text } from 'react-native';
import FloatingCard from '@/components/floatingbox';

export default function ExploreCard({
  title, icon,
  onPress, height = 110,
}: {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
  height: number;
}) {
  return (
    <FloatingCard height={height} width="90%" onPress={onPress}>
      <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginBottom: 6 }}>
        {title}
      </Text>
      {icon}
    </FloatingCard>
  );
}
