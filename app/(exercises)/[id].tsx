import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Image, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import GravitusHeader from '@/components/title';
import FloatingCard from '@/components/floatingbox';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Exercise, ExerciseStat } from '@/types/firestoreTypes';
import { getExerciseByID, getLogsByExerciseId } from '@/lib/firestoreFunctions';
import { estimateOneRepMax } from '@/lib/otherFunctions';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
    backgroundGradientFrom: '#2C3237',
    backgroundGradientTo: '#2C3237',
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // white line
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // white labels
    strokeWidth: 2,
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#4FD6EA', // aqua blue dot stroke
      fill: '#4FD6EA'    // aqua blue dot fill
    },
  };

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams();
  const [exercise, setExercise] = useState<Exercise>();
  const [estimatedOneRepMaxOverTime, setEstimatedOneRepMaxOverTime] = useState<{ date: string; oneRepMax: number }[]>([]);

  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    const fetchExercise = async () => {
      const e = await getExerciseByID(id);
      setExercise(e);
    };

    const fetchExerciseStats = async () => {
      const logs = await getLogsByExerciseId(id);
      if (!logs) return;
      const oneRepMaxOverTime = estimateOneRepMax(logs);
      const chartData = Object.entries(oneRepMaxOverTime)
        .map(([date, oneRepMax]) => ({ date, oneRepMax }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setEstimatedOneRepMaxOverTime(chartData);
    };

    fetchExercise();
    fetchExerciseStats();
  }, [id]);

  if (!exercise) {
    return (
      <SafeAreaView style={styles.screen}>
        <GravitusHeader showBackButton={true} />
        <Text style={{ color: 'white', marginTop: 20 }}>Loading exercise...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <GravitusHeader showBackButton={true} />
      <Text style={styles.exerciseName}>{exercise.name}</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image style={styles.image} resizeMode="contain" />

        <View style={styles.detailBox}>
          <Text style={styles.label}>Primary:</Text>
          <Text style={styles.detail}>{exercise.primaryMuscleGroup}</Text>

          {exercise.secondaryMuscleGroup?.length > 0 && (
            <>
              <Text style={styles.label}>Secondary:</Text>
              <Text style={styles.detail}>{exercise.secondaryMuscleGroup.join(', ')}</Text>
            </>
          )}

          <Text style={styles.label}>Motion:</Text>
          <Text style={styles.detail}>{exercise.motion}</Text>
        </View>

        {estimatedOneRepMaxOverTime.length > 0 && (
          <View style={styles.graphWrapper}>
            <Text style={styles.graphTitle}>Estimated 1RM Over Time</Text>
            <LineChart
              data={{
                labels: estimatedOneRepMaxOverTime.map((entry) => new Date(entry.date).toLocaleDateString()),
                datasets: [
                  {
                    data: estimatedOneRepMaxOverTime.map((entry) => entry.oneRepMax),
                  },
                ],
              }}
              width={screenWidth - 32}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              withInnerLines={false}
              withOuterLines={false}
            />
          </View>
        )}
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
    marginTop: 12,
    marginBottom: 12,
  },
  image: {
    width: "90%",
    height: 250,
    marginTop: 12,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#1e1e1e',
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
  },
  detail: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  graphWrapper: {
    marginTop: 20,
    width: '90%',
    alignItems: 'center'
  },
  graphTitle: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  chart: {
    marginHorizontal: 16,
    borderRadius: 8,
  },
});
