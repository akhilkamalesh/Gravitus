// app/(history)/[id].tsx
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text, View } from 'react-native';
import GravitusHeader from '@/components/GravitusHeader';
import SectionHeader from '@/components/SectionHeader';
import { useLocalSearchParams } from 'expo-router';
import { useHistoryDetail } from '@/hooks/history/useHistoryDetail';
import HistoryStatsCard from '@/components/history/HistoryStatsCard';
import HistoryMusclePieCard from '@/components/history/HistoryMusclePieCard';
import HistoryExerciseLogCard from '@/components/history/HistoryExerciseLogCard';

/**
 * Detailed view of logged workout based on log id
 * @returns Detailed view of a logged workout
 */
export default function HistoryDetailScreen() {
  const { id } = useLocalSearchParams();
  const { loading, log, split, enrichedExercises, pieData, totalVolume } = useHistoryDetail(id); // getting hook information here

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <GravitusHeader showBackButton />

      <View style={{ paddingHorizontal: 20, marginTop: 12, marginBottom: 20 }}>
        <Text style={{ fontSize: 32, fontWeight: '700', color: 'white' }}>
          {log ? `${log.workoutDay}` : 'Workout'}
        </Text>
        <Text style={{ fontSize: 16, color: '#666', marginTop: 4 }}>
          {log ? log.date.substring(0, 10) : ''} • {split?.name ?? 'One-Off'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 48 }}>
        <SectionHeader title="Statistics" />
        <HistoryMusclePieCard data={pieData} />
        <HistoryStatsCard exerciseCount={enrichedExercises.length} totalVolume={totalVolume} />

        <SectionHeader title="Workout Log" />
        {enrichedExercises.map((ex: any, idx: number) => (
          <HistoryExerciseLogCard
            key={`${ex.exerciseId}-${idx}`}
            name={ex.name}
            sets={ex.sets ?? []}
            notes={ex.notes}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}