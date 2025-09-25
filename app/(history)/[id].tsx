// app/(history)/[id].tsx
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text } from 'react-native';
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121417' }}>
      <GravitusHeader showBackButton />
      <Text style={{ fontSize: 26, fontWeight: '600', color: 'white', alignSelf: 'center', marginVertical: 12 }}>
        {log ? `${log.workoutDay}: ${log.date.substring(0, 10)}` : 'Workout'}
      </Text>
      <Text style={{ color: '#4FD6EA', fontSize: 14, marginBottom: 16, alignSelf: 'center' }}>
        {split?.name ?? ''}
      </Text>

      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 48 }}>
        <SectionHeader title="Statistics" />
        <HistoryMusclePieCard data={pieData} />
        <HistoryStatsCard exerciseCount={enrichedExercises.length} totalVolume={totalVolume} />

        <SectionHeader title="Workout Log" />
        {enrichedExercises.map((ex: any, idx: number) => (
          <HistoryExerciseLogCard
            key={`${ex.exerciseId}-${idx}`}
            name={ex.name}
            sets={log?.exercises[idx]?.sets ?? []}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}