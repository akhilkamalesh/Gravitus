// app/(trainingSplits)/[id].tsx
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text, Alert } from 'react-native';
import GravitusHeader from '@/components/GravitusHeader';
import SaveButton from '@/components/SaveButton';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSplitDetail } from '@/hooks/splits/useSplitDetail';
import SplitWorkoutSection from '@/components/trainingSplits/SplitWorkoutSection';

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
    <SafeAreaView style={{ flex:1, backgroundColor:'#121417' }}>
      <GravitusHeader showBackButton />
      <Text style={{
        fontSize: 30, fontWeight: '600', color: 'white',
        alignSelf: 'center', textAlign: 'center', margin: 12
      }}>
        {split?.name ?? (loading ? 'Loading…' : 'Split')}
      </Text>
      <Text style={{
        fontSize: 15, fontWeight: '600', color: 'white',
        alignSelf: 'center', textAlign: 'center', marginVertical: 15, marginHorizontal: 15
      }}>
        {split ? `${split.description}. The duration of this split is ${split.weeksDuration} weeks.` : ''}
      </Text>

      <ScrollView contentContainerStyle={{ alignItems:'center', paddingVertical:14 }}>
        {split?.workouts.map((w, idx) => (
          <SplitWorkoutSection key={`${w.dayName}-${idx}`} w={w} />
        ))}
      </ScrollView>

      {!isCurrent && !!split && (
        <SaveButton onPress={() =>
          confirm('Save Split', 'Are you sure you want to save split?', async () => {
            try {
              await saveSplit();
              router.back();
            } catch (e) {
              console.error(e);
              Alert.alert('Error', 'Failed to save split.');
            }
          })
        }/>
      )}

      {isCurrent && (
        <SaveButton
          text="Clear Split"
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
    </SafeAreaView>
  );
}