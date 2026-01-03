// app/(trainingSplits)/trainingSplits.tsx
import GravitusHeader from '@/components/GravitusHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTrainingSplits } from '@/hooks/splits/useTrainingSplits';
import SplitRowCard from '@/components/trainingSplits/SplitRowCard';
import SectionHeader from '@/components/SectionHeader';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * TrainingSplitsScreen
 * @returns Screen to view current training split, create a new one, or explore templates
 */
export default function TrainingSplitsScreen() {
  const router = useRouter();
  const { loading, currentSplit, templates } = useTrainingSplits();

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['rgba(79, 214, 234, 0.15)', 'transparent']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
        pointerEvents="none"
      />
      <GravitusHeader showBackButton />

      <View style={styles.headerContainer}>
        <Text style={styles.screenTitle}>
          Training Splits
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {currentSplit && <SectionHeader title="Current Split" />}
        {currentSplit && (
          <SplitRowCard
            icon="calendar"
            title={currentSplit.name}
            onPress={() => router.push(`/(trainingSplits)/${currentSplit.id}`)}
          />
        )}

        <SectionHeader title="Create Your Own!" />
        <SplitRowCard
          icon="edit"
          title="Create Your Own"
          onPress={() => router.push('/(trainingSplits)/create')}
        />

        <SectionHeader title="Explore Template Splits" />
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  gradient: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 300,
    height: 300,
    borderBottomLeftRadius: 300,
  },
  headerContainer: {
    paddingHorizontal: '5%',
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    textAlign: 'left',
    marginTop: 12,
    marginBottom: 12,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 40,
  },
});