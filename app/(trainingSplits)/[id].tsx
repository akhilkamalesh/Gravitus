// app/(trainingSplits)/[id].tsx
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text, Alert, StyleSheet, View } from 'react-native';
import GravitusHeader from '@/components/GravitusHeader';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSplitDetail } from '@/hooks/splits/useSplitDetail';

/**
 * SplitDetailScreen to show current split
 * @returns Screen component for displaying details of a training split
 */
export default function SplitDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { loading, split, isCurrent, saveSplit, clearSplit } = useSplitDetail(id);

  const confirm = (title: string, message: string, onYes: () => void) =>
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', style: 'destructive', onPress: onYes },
    ]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <GravitusHeader showBackButton />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          <>
            <View style={styles.headerSection}>
              <Text style={styles.splitName}>
                {split?.name || 'Untitled Split'}
              </Text>
              <Text style={styles.description}>
                {split?.description}
                {split?.weeksDuration ? `. Duration: ${split.weeksDuration} weeks.` : ''}
              </Text>
            </View>

            {split?.workouts.map((w, idx) => (
              <View key={`${w.dayName}-${idx}`} style={styles.card}>
                <Text style={styles.dayName}>{w.dayName || `Day ${idx + 1}`}</Text>
                {w.exercises.length === 0 ? (
                  <Text style={styles.placeholder}>No exercises.</Text>
                ) : (
                  w.exercises.map((ex, j) => (
                    <Text key={`${ex.exerciseId}-${j}`} style={styles.exerciseLine}>
                      • {ex.exerciseData?.name || 'Unknown Exercise'}: {ex.sets} x {ex.reps.min}-{ex.reps.max} (RPE {ex.rpe ?? '-'})
                    </Text>
                  ))
                )}
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Footer / Action Buttons */}
      <View style={styles.footer}>
        {!isCurrent && !!split && (
          <PrimaryButton
            label="Save Split"
            onPress={() =>
              confirm('Save Split', 'Are you sure you want to save this split?', async () => {
                try {
                  await saveSplit();
                  router.back();
                } catch (e) {
                  console.error(e);
                  Alert.alert('Error', 'Failed to save split.');
                }
              })
            }
          />
        )}

        {isCurrent && (
          <PrimaryButton
            label="Clear Split"
            onPress={() =>
              confirm('Clear Current Split', 'Are you sure you want to clear current split?', async () => {
                try {
                  await clearSplit();
                  router.back();
                } catch (e) {
                  console.error(e);
                  Alert.alert('Error', 'Failed to clear split.');
                }
              })
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000', // Matches design system dark background
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Space for footer
  },
  loadingText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  headerSection: {
    marginBottom: 24,
  },
  splitName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left', // Left align
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#bbb',
    textAlign: 'left', // Left align
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#222', // Matches card background from Review
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  dayName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  exerciseLine: {
    fontSize: 15,
    color: '#ddd',
    marginBottom: 6,
    lineHeight: 20,
  },
  placeholder: {
    color: '#666',
    fontStyle: 'italic',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    paddingHorizontal: 20, // Add padding for PrimaryButton
  },
});