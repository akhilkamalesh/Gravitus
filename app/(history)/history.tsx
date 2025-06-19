import React, { useState, useEffect } from "react";
import GravitusHeader from "@/components/title";
import FloatingCard from "@/components/floatingbox";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ExerciseLog } from "@/types/firestoreTypes";
import { getLoggedWorkouts, getSplitBySplitId } from "@/lib/firestoreFunctions";
import SearchBar from "@/components/searchBar";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function HistoryScreen() {

    const router = useRouter(); 

    const [searchText, setSearchText] = useState('');
    const [loggedWorkouts, setLoggedWorkouts] = useState<ExerciseLog[] | null>(null);
    const [splitNames, setSplitNames] = useState<{ [splitId: string]: string }>({});

    const fetchSplitName = async (splitId: string) => {
        if (splitNames[splitId]) return; // already fetched
      
        const split = await getSplitBySplitId(splitId);
        if (split) {
          setSplitNames((prev) => ({ ...prev, [splitId]: split.name }));
        }
      };

    useEffect(() => {
        const fetchLoggedWorkouts = async () => {
            const workouts = await getLoggedWorkouts();
            if(!workouts){
                console.error("Logged workouts not fetched")
            }
            setLoggedWorkouts(workouts);

            // Immediately iterate on the raw workouts data, not state
            for (const log of workouts) {
                await fetchSplitName(log.splitId);
            }
        }
        fetchLoggedWorkouts()
    }, [])

    return(
        <SafeAreaView style={styles.screen}>
            <GravitusHeader showBackButton={true}/>
            <Text style={styles.title}>Logged Workouts</Text>
            <View style={styles.topBar}>
                <SearchBar value={searchText} onChange={setSearchText} placeholder="Search Workouts..."/>
                <Feather name="filter" size={20} color="#ccc" style={styles.icon}/>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {loggedWorkouts?.filter((l) => l.workoutDay.toLowerCase().includes(searchText.toLowerCase()))?.map((workout) => (
                    <FloatingCard key={workout.id} height={60} width={"90%"} onPress={()=>router.push(`/(history)/${workout.id}`)}>
                        <View style={styles.loggedRow}>
                            <Text style={styles.loggedRowText}>{workout.date.substring(0, 10)}</Text>
                            <Text style={styles.loggedRowText}>{workout.workoutDay}</Text>
                            <Text style={styles.loggedRowText}>{splitNames[workout.splitId]}</Text>
                        </View>
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
    scrollContent: {
        alignItems: 'center',
        // paddingVertical: 24,
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
    loggedRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    loggedRowText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '600'
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginHorizontal: 15,
    },
    icon:{
        alignSelf: 'center'
    },
})