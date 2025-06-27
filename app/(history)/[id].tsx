import React, {useEffect, useState} from "react";
import { SafeAreaView, Text, StyleSheet, ScrollView, View } from "react-native"
import FloatingCard from "@/components/floatingbox";
import GravitusHeader from "@/components/title";
import { useLocalSearchParams } from "expo-router";
import { ExerciseLog, Split, Exercise } from "@/types/firestoreTypes";
import { getLoggedWorkoutById, getSplitBySplitId, getExerciseByID } from "@/lib/firestoreFunctions";

export default function HistoryDetailScreen(){

    const {id} = useLocalSearchParams();
    const [logDetails, setLogDetails] = useState<ExerciseLog>();
    const [split, setSplit] = useState<Split>();
    const [enrichedExercises, setEnrichedExercises] = useState<
                                                    (ExerciseLog['exercises'][0] & Exercise)[]
                                                    >([]);

    const totalVolume = enrichedExercises.reduce((sum, ex) => {
        return sum + ex.sets.reduce((setSum, set) => setSum + set.weight * set.reps, 0);
    }, 0);


    useEffect(() => {
        const fetchLogWorkoutById = async () => {
          const l = await getLoggedWorkoutById(String(id));
          setLogDetails(l);
        };
      
        fetchLogWorkoutById();
      }, [id]); // only runs once when `id` is set
      
      useEffect(() => {
        const fetchSplitById = async () => {
          if (logDetails?.splitId) {
            const s = await getSplitBySplitId(logDetails.splitId);
            if (s) {
              setSplit(s);
            } else {
              console.error('split didn’t return');
            }
          }
        };
      
        fetchSplitById();
      }, [logDetails]); // runs when `logDetails` is updated

      useEffect(() => {
        const enrichExercises = async () => {
          if (!logDetails) return;
      
          const results = await Promise.all(
            logDetails.exercises.map(async (logEx) => {
              const meta = await getExerciseByID(logEx.exerciseId);
      
              const totalVolume = logEx.sets.reduce(
                (sum, set) => sum + set.weight * set.reps,
                0
              );
      
              // Pretty nice conversion math
              const estimated1RM = Math.max(
                ...logEx.sets.map(set => set.weight * (1 + set.reps / 30))
              );
      
              return {
                ...logEx,
                ...meta,
                totalVolume,
                estimated1RM,
              };
            })
          );
      
          setEnrichedExercises(results);
        };
      
        enrichExercises();
      }, [logDetails]);
      

    console.log(logDetails)
    console.log("Split = ", split)
    console.log(enrichedExercises)

    

    return (
        <SafeAreaView style={styles.screen}>
            <GravitusHeader showBackButton={true}/>
            <Text style={styles.title}>{logDetails?.workoutDay}: {logDetails?.date.substring(0, 10)}</Text>
            <Text style={styles.splitLink}>{split?.name}</Text>        
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <FloatingCard width="90%">
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Summary Statistics</Text>
                    </View>
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryStats}>Number of Exercises Done: {enrichedExercises.length}</Text>
                        <Text style={styles.summaryStats}>Total Volume: {totalVolume}</Text>
                    </View>
                </FloatingCard>
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
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#1c1f23',
    },
    title: {
        fontSize: 30,
        fontWeight: '600',
        color: 'white',
        alignSelf: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        margin: 12
    },
    splitLink: {
        color: '#4FD6EA',
        fontSize: 14,
        marginBottom: 16,
        alignSelf: 'center'
    },
    scrollContent: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    cardTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600'
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginTop: 10
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4
    },
    col: {
        color: 'white',
        width: '22%',
        textAlign: 'center'
    },
    summaryStats: {
      color: 'white',
      marginBottom: 6
    },
    summaryContainer: {
      alignItems: 'center'
    }
})