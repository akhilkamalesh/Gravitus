import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, StyleSheet, ScrollView, View } from "react-native";
import FloatingCard from "@/components/floatingbox";
import GravitusHeader from "@/components/GravitusHeader";
import { useLocalSearchParams } from "expo-router";
import { ExerciseLog, Split, Exercise } from "@/types/firestoreTypes";
import { getLoggedWorkoutById, getSplitBySplitId, getExerciseByID } from "@/lib/firestoreFunctions";
import MuscleGroupPieChart from "@/components/PieChart";
import SectionHeader from "@/components/SectionHeader";

export default function HistoryDetailScreen() {
  const { id } = useLocalSearchParams();
  const [logDetails, setLogDetails] = useState<ExerciseLog>();
  const [split, setSplit] = useState<Split>();
  const [enrichedExercises, setEnrichedExercises] = useState<
    (ExerciseLog["exercises"][0] & Exercise)[]
  >([]);
  const [pieChartInfo, setPieChartInfo] = useState<{muscle: string; sets: number}[]>([]);

  const totalVolume = enrichedExercises.reduce((sum, ex) => {
    return sum + ex.sets.reduce((setSum, set) => setSum + set.weight * set.reps, 0);
  }, 0);

  // Fetching workout
  useEffect(() => {
    const fetchLogWorkoutById = async () => {
      const l = await getLoggedWorkoutById(String(id));
      setLogDetails(l);
    };
    fetchLogWorkoutById();
  }, [id]);

  // Fetching split
  useEffect(() => {
    const fetchSplitById = async () => {
      if (logDetails?.splitId) {
        const s = await getSplitBySplitId(logDetails.splitId);
        if (s) {
          setSplit(s);
        } else {
          console.error("split didn’t return");
        }
      }
    };
    const enrichExercises = async () => {
      if (!logDetails) return;

      const results = await Promise.all(
        logDetails.exercises.map(async (logEx) => {
          const meta = await getExerciseByID(logEx.exerciseId);

          const totalVolume = logEx.sets.reduce((sum, set) => sum + set.weight * set.reps, 0);
          
          const sets = logEx.sets.length;
          const muscle = meta.primaryMuscleGroup;

          return {
            enriched: {
              ...logEx,
              ...meta,
              totalVolume,
            },
            stats: {
              muscle,
              sets
            }
          };
        })
      );

      const enriched = results.map((r) => r.enriched);

      // Aggregate sets by muscle group
      const statsMap: { [muscle: string]: number } = {};
      for (const { stats } of results) {
        statsMap[stats.muscle] = (statsMap[stats.muscle] || 0) + stats.sets;
      }

      // Convert aggregated object back to array
      const aggregatedStats = Object.entries(statsMap).map(([muscle, sets]) => ({
        muscle,
        sets,
      }));  
      setEnrichedExercises(enriched);
      setPieChartInfo(aggregatedStats);
    };

    fetchSplitById();
    enrichExercises();

  }, [logDetails]);

  return (
    <SafeAreaView style={styles.screen}>
      <GravitusHeader showBackButton={true} />
      <Text style={styles.title}>
        {logDetails?.workoutDay}: {logDetails?.date.substring(0, 10)}
      </Text>
      <Text style={styles.splitLink}>{split?.name}</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
      <SectionHeader title={"Statistics"}/>
      <FloatingCard width="90%">
        <Text style={styles.cardTitle}>Set Distribution by Muscle Group</Text>
        <MuscleGroupPieChart data={pieChartInfo}/>
      </FloatingCard>

        <FloatingCard width="90%">
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Summary Statistics</Text>
          </View>
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryStats}>Number of Exercises: {enrichedExercises.length}</Text>
            <Text style={styles.summaryStats}>Total Volume: {totalVolume}</Text>
          </View>
        </FloatingCard>

        <SectionHeader title={"Workout Log"}/>
        {enrichedExercises?.map((exercise, exIndex) => (
          <FloatingCard key={exIndex} width="90%">
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{exercise.name}</Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={styles.col}>Set</Text>
              <Text style={styles.col}>Lbs</Text>
              <Text style={styles.col}>Reps</Text>
            </View>

            {logDetails?.exercises[exIndex]?.sets.map((set, setIndex) => (
              <View key={setIndex} style={styles.tableRow}>
                <Text style={styles.col}>{setIndex + 1}</Text>
                <Text style={styles.col}>{set.weight}</Text>
                <Text style={styles.col}>{set.reps}</Text>
              </View>
            ))}
          </FloatingCard>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#121417',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: 'white',
    alignSelf: 'center',
    textAlign: 'center',
    marginVertical: 12,
  },
  splitLink: {
    color: '#4FD6EA',
    fontSize: 14,
    marginBottom: 16,
    alignSelf: 'center',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 48,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  summaryContainer: {
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  summaryStats: {
    color: '#ccc',
    fontSize: 14,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 6,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  col: {
    color: 'white',
    fontSize: 14,
    width: '22%',
    textAlign: 'center',
  },
});
