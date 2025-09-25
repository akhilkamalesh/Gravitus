// app/(trainingSplits)/trainingSplits.tsx
import GravitusHeader from '@/components/GravitusHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTrainingSplits } from '@/hooks/splits/useTrainingSplits';
import SplitRowCard from '@/components/trainingSplits/SplitRowCard';
import SectionTitle from '@/components/trainingSplits/SectionTitle';

/**
 * TrainingSplitsScreen
 * @returns Screen to view current training split, create a new one, or explore templates
 */
export default function TrainingSplitsScreen() {
  const router = useRouter();
  const { loading, currentSplit, templates } = useTrainingSplits();

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:'#121417' }}>
      <GravitusHeader showBackButton />
      <Text style={{
        fontSize:28, fontWeight:'600', color:'white',
        alignSelf:'center', textAlign:'center', marginVertical:12,
      }}>
        Training Splits
      </Text>

      <ScrollView contentContainerStyle={{ alignItems:'center', paddingBottom:40 }}>
        {currentSplit && <SectionTitle>Current Split</SectionTitle>}
        {currentSplit && (
          <SplitRowCard
            icon="calendar"
            title={currentSplit.name}
            onPress={() => router.push(`/(trainingSplits)/${currentSplit.id}`)}
          />
        )}

        <SectionTitle>Create Your Own!</SectionTitle>
        <SplitRowCard
          icon="edit"
          title="Create Your Own"
          onPress={() => router.push('/(trainingSplits)/create')}
        />

        <SectionTitle>Explore Template Splits</SectionTitle>
        {!loading && templates.map(split => (
          <SplitRowCard
            key={split.id}
            icon="folder"
            title={split.name}
            onPress={() => router.push(`/(trainingSplits)/${split.id}`)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}