import React, { useState, useEffect } from "react";
import FloatingCard from "@/components/floatingbox";
import { useLocalSearchParams } from "expo-router";
import { getSplit, getSplitInformation, saveSplitToUser, updateCurrentSplit } from "@/lib/firestoreFunctions";
import { Split } from "@/types/firestoreTypes";
import { SafeAreaView } from "react-native-safe-area-context";
import GravitusHeader from "@/components/title";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import SaveButton from "@/components/saveButton";

export default function SplitDetailScreen(){
    const {id} = useLocalSearchParams();
    const [split, setSplit] = useState<Split | null>(null);
    const [loading, setLoading] = useState(false)

    // Logic for saving the split into your split collection
    const handleSave = async () => {
        if (!split) return;
        try {
          const docRefId = await saveSplitToUser(split);
          console.log("Doc Ref ID is:", docRefId);
          await updateCurrentSplit(docRefId)
        } catch (err) {
          console.error("Error saving split:", err);
        }
      };


    useEffect(() => {
        if (typeof id !== 'string') return;

        const fetchSplit = async () => {
            setLoading(true);
            const rawSplit = await getSplit(id);
            if (!rawSplit) {
                setLoading(false);
                return;
              }
            const enrichedSplitData = await getSplitInformation(rawSplit)
            setSplit(enrichedSplitData)
            setLoading(false);
        };

        fetchSplit();
    }, [id]) // id is the dependency array, only run when this changes    

    const workouts = split?.workouts;
    // console.log(split)
    // console.log(workouts)

    // const exercises = split?.workouts[0].exercises;
    // console.log(exercises)
    console.log(split)

    return (
        <SafeAreaView style={styles.screen}>
            <GravitusHeader showBackButton={true}/>
            <Text style={styles.title}>{split?.name}</Text>
            <Text style={styles.description}>{split?.description}. The duration of this split is {split?.weeksDuration} weeks.</Text>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {workouts?.map((workout, index) => (
                    <View key={workout.dayName} style={styles.workoutBox}>
                        <Text style={styles.workoutTitle}>{workout.dayName}</Text>
                        <View style={styles.headersRow}>
                            <Text style={styles.headers}>Exercises: </Text>
                            <Text style={styles.headers}>Muscle Group: </Text>
                            <Text style={styles.headers}>Sets/Reps: </Text>
                        </View>
                        
                        {workout.exercises.map((exercise, index) => (
                            <View key={exercise.exerciseId} style={styles.alignedRow}>
                                <FloatingCard key={exercise.exerciseId} height={70} width={350}>
                                    <View style={styles.floatingView}>
                                        <Text style={styles.cardColLeft}>{exercise.exerciseData?.name}</Text>
                                        <Text style={styles.cardColMid}>{exercise.exerciseData?.primaryMuscleGroup}</Text>
                                        <Text style={styles.cardColRight}>
                                            {exercise.sets} x {exercise.reps.min}-{exercise.reps.max}
                                        </Text>
                                    </View>
                                </FloatingCard>
                            </View>
                        ))}

                    </View>
                ))}
            </ScrollView>
            <SaveButton onPress={() => {
                handleSave();
            }}/>
        </SafeAreaView>
    );

};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#1c1f23',
    },
    alignedRow: {
        width: '90%',
        alignSelf: 'center',
    },
    scrollContent: {
        alignItems: 'center',
        paddingVertical: 14,
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
    floatingView: {
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-between',
        alignContent: 'center',
        width: '100%',
    },
    workoutBox: {
        marginBottom: 20
    },
    workoutTitle: {
        fontSize: 25,
        fontWeight: '600',
        color: 'white',
        alignSelf: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        marginTop: 10
    },
    description: {
        fontSize: 15,
        fontWeight: '600',
        color: 'white',
        alignSelf: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        marginVertical: 15,
    },
    headersRow: {
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-between',
        marginTop: 10
    },
    headers: {
        width: '33%',
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center'
    },
    cardColLeft: {
        width: '33%',
        color: 'white',
        fontSize: 14,
        textAlign: 'left'
    },
    cardColMid: {
        width: '33%',
        color: 'white',
        fontSize: 14,
        textAlign: 'center'
    },
    cardColRight: {
        width: '33%',
        color: 'white',
        fontSize: 14,
        textAlign: 'right'
    },


})

