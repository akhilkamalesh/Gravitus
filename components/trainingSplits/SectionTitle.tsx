// components/trainingSplits/SectionTitle.tsx
import { Text } from 'react-native';

export default function SectionTitle({ children }: { children: string }) {
  return (
    <Text style={{
      color:'#999', fontWeight:'600', fontSize:18,
      marginTop:20, marginBottom:10, alignSelf:'flex-start', paddingHorizontal:'5%',
    }}>
      {children}
    </Text>
  );
}
