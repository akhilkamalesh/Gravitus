import React, { useState, useEffect } from "react";
import FloatingCard from "@/components/floatingbox";
import { useLocalSearchParams, useRouter } from "expo-router";
import { clearCurrentSplit, getSplit, getSplitBySplitId, getSplitInformation, resetDayIndex, saveSplitToUser, updateCurrentSplit } from "@/lib/firestoreFunctions";
import { Split } from "@/types/firestoreTypes";
import { SafeAreaView } from "react-native-safe-area-context";
import GravitusHeader from "@/components/GravitusHeader";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import SaveButton from "@/components/SaveButton";

export default function SplitDetailScreen(){

    const router = useRouter();

    const confirmAction = (title: string, message: string, onConfirm: () => void) => {
        Alert.alert(title, message, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Confirm', style: 'destructive', onPress: onConfirm },
        ]);
    };

    const {id} = useLocalSearchParams();
    const [split, setSplit] = useState<Split | null>(null);
    const [rawSplit, setRawSplit] = useState<Split | null>(null);
    const [loading, setLoading] = useState(false)
    const [isCurrSplit, setIsCurrSplit] = useState(false)

    // Logic for saving the split into your split collection
    const handleSave = async () => {
        confirmAction('Save Split', 'Are you sure you want to save split?',async () => {
            if (!split) return;
            try {
              const docRefId = await saveSplitToUser(split);
              await updateCurrentSplit(docRefId)
              await resetDayIndex();
              router.back();
            } catch (err) {
              console.error("Error saving split:", err);
            }
        });
      };

    // Logic for clearing a split
    const handleClear = async () => {
        confirmAction('Clear Current Split', 'Are you sure you want to clear current split?', async ()=>{
            if(!split) return;
            try {
                await clearCurrentSplit();
                router.back();
            }catch (err) {
                console.error("Error clearing split", err);
            }
        })
    }


    useEffect(() => {
        if (typeof id !== 'string'){
            return;
        } 

        const fetchSplit = async () => {
            setLoading(true);
            let rawSplit = await getSplit(id);
            setRawSplit(rawSplit)

            if (!rawSplit) {
                rawSplit = await getSplitBySplitId(id);
                setIsCurrSplit(true)
            }
            if(!rawSplit){
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

    return (
        <SafeAreaView style={styles.screen}>
            <GravitusHeader showBackButton={true}/>
            <Text style={styles.title}>{split?.name}</Text>
            <Text style={styles.description}>{split?.description}. The duration of this split is {split?.weeksDuration} weeks.</Text>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {workouts?.map((workout, index) => (
                    <View key={`${workout.dayName}-${index}`} style={styles.workoutBox}>
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
            {
            !isCurrSplit && <SaveButton onPress={() => {handleSave();}}/>
            }
            {
            isCurrSplit && <SaveButton text={"Clear Split"} onPress={() => {handleClear();}}/>
            }

        </SafeAreaView>
    );

};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#121417',
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
        marginHorizontal: 15
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

