import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import GravitusHeader from '@/components/title';
import { useLocalSearchParams } from 'expo-router';
import { Exercise } from '@/types/firestoreTypes';
import { getExerciseByID, getLogsByExerciseId } from '@/lib/firestoreFunctions';
import { estimateOneRepMax } from '@/lib/otherFunctions';
import StatLineChart from '@/components/LineGraph';
import SectionHeader from '@/components/SectionHeader';
import FloatingCard from '@/components/floatingbox';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams();
  const [exercise, setExercise] = useState<Exercise>();
  const [estimatedOneRepMaxOverTime, setEstimatedOneRepMaxOverTime] = useState<
    { date: string; value: number }[]
  >([]);

  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    const fetchData = async () => {
      const [exerciseData, logs] = await Promise.all([
        getExerciseByID(id),
        getLogsByExerciseId(id),
      ]);

      if (exerciseData) setExercise(exerciseData);

      if (logs) {
        const oneRepMaxOverTime = estimateOneRepMax(logs);
        const chartData = Object.entries(oneRepMaxOverTime)
          .map(([date, value]) => ({ date, value }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setEstimatedOneRepMaxOverTime(chartData);
      }
    };

    fetchData();
  }, [id]);

  if (!exercise) {
    return (
      <SafeAreaView style={styles.screen}>
        <GravitusHeader showBackButton />
        <Text style={styles.loadingText}>Loading exercise...</Text>
      </SafeAreaView>
    );
  }

  console.log(estimatedOneRepMaxOverTime)

  return (
    <SafeAreaView style={styles.screen}>
      <GravitusHeader showBackButton />
      <Text style={styles.exerciseName}>{exercise.name}</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SectionHeader title={"Estimated One Rep Max Over Time"}/>
        {estimatedOneRepMaxOverTime.length >= 5 && (
          <View style={styles.graphWrapper}>
            <StatLineChart
              data={estimatedOneRepMaxOverTime}
              label={String(estimatedOneRepMaxOverTime[estimatedOneRepMaxOverTime.length-1].value)}
            />
          </View>
        )}

        <SectionHeader title="About" />

        <FloatingCard width="90%">
            <Text style={styles.label}>Primary Muscle Targetted:</Text>
            <Text style={styles.detail}>{exercise.primaryMuscleGroup}</Text>
        </FloatingCard>

        <FloatingCard width="90%">
          {exercise.secondaryMuscleGroup?.length > 0 && (
                <>
                  <Text style={styles.label}>Secondary Muscle Targetted:</Text>
                  <Text style={styles.detail}>{exercise.secondaryMuscleGroup.join(', ')}</Text>
                </>
          )}
        </FloatingCard>

        <FloatingCard width="90%">
          <Text style={styles.label}>{exercise.name} Motion:</Text>
            <Text style={styles.detail}>{exercise.motion}</Text>
        </FloatingCard>

        <SectionHeader title="Statistics"/>

        <FloatingCard width="90%">
          <Text style={styles.label}>Amount of {exercise.name} Sessions:</Text>
            <Text style={styles.detail}>{estimatedOneRepMaxOverTime.length}</Text>
        </FloatingCard>

        <FloatingCard width="90%">
          <Text style={styles.label}>Best Volume Set: </Text>
            <Text style={styles.detail}>{estimatedOneRepMaxOverTime.length}</Text>
        </FloatingCard>


      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#121417',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 48,
  },
  exerciseName: {
    fontSize: 28,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginVertical: 12,
  },
  loadingText: {
    color: 'white',
    marginTop: 20,
    textAlign: 'center',
  },
  detailBox: {
    alignItems: 'center',
    marginBottom: 20,
    gap: 6,
  },
  label: {
    fontSize: 14,
    color: '#bbb',
    fontWeight: '600',
    marginTop: 6,
    marginBottom: 6
  },
  detail: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  graphWrapper: {
    marginTop: 20,
    marginBottom: 10,
    width: '90%',
    alignItems: 'center',
  },
});
