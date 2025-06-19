import React, {useEffect, useState} from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native"
import FloatingCard from "@/components/floatingbox";
import GravitusHeader from "@/components/title";
import { useLocalSearchParams } from "expo-router";
import { ExerciseLog } from "@/types/firestoreTypes";
import { getLoggedWorkoutById } from "@/lib/firestoreFunctions";


export default function HistoryDetailScreen(){

    const {id} = useLocalSearchParams();
    const [logDetails, setLogDetails] = useState<ExerciseLog>();


    useEffect(() => {
        const fetchLogWorkoutById = async () => {
            const l = await getLoggedWorkoutById(String(id));
            setLogDetails(l);
        }

        fetchLogWorkoutById();

    }, [])

    console.log(logDetails)

    return (
        <SafeAreaView style={styles.screen}>
            <GravitusHeader showBackButton={true}/>
            <Text style={styles.title}>id</Text>
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
})