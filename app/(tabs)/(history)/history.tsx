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
import FilterModal from '@/components/exerciseFilterBar';

export default function HistoryScreen() {
  const router = useRouter();

  const [searchText, setSearchText] = useState('');
  const [loggedWorkouts, setLoggedWorkouts] = useState<ExerciseLog[] | null>(null);
  const [splitNames, setSplitNames] = useState<{ [splitId: string]: string }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const toggleGroup = (group: string) => {
    setSelectedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const fetchSplitName = async (splitId: string) => {
    if (splitNames[splitId]) return;
    const split = await getSplitBySplitId(splitId);
    if (split) {
      setSplitNames((prev) => ({ ...prev, [splitId]: split.name }));
    }
  };

  useEffect(() => {
    const fetchLoggedWorkouts = async () => {
      const workouts = await getLoggedWorkouts();
      if (!workouts) {
        console.error("Logged workouts not fetched");
        return;
      }
      setLoggedWorkouts(workouts);
      const arr = []
      for (const log of workouts) {
        if(log.splitId in arr){
          continue;
        }
        arr.push(log.splitId)
        await fetchSplitName(log.splitId);
      }
    };
    fetchLoggedWorkouts();
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <GravitusHeader showBackButton={true} />
      <Text style={styles.title}>Logged Workouts</Text>

      <View style={styles.topBar}>
        <SearchBar
          value={searchText}
          onChange={setSearchText}
          placeholder="Search By Workout..."
        />
        <Feather name="filter" size={22} color="#bbb" style={styles.icon} onPress={()=>setModalVisible(true)}/>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
      {loggedWorkouts
          ?.filter((l) =>
            l.workoutDay.toLowerCase().includes(searchText.toLowerCase()) &&
            (
              selectedGroups.length === 0 ||
              selectedGroups.includes(splitNames[l.splitId] ?? 'One-Off')
            )
          )
          .map((workout) => (
            <FloatingCard
              key={workout.id}
              height={70}
              width="90%"
              onPress={() => router.push(`/(history)/${workout.id}`)}
            >
              <View style={styles.loggedRow}>
                <Text style={styles.loggedRowText}>{workout.date.substring(0, 10)}</Text>
                <Text style={styles.loggedRowTextMiddle}>{workout.workoutDay}</Text>
                <Text style={styles.loggedRowText}>
                  {splitNames[workout.splitId] ?? 'One-Off'}
                </Text>
              </View>
            </FloatingCard>
          ))}
      </ScrollView>

      <FilterModal
        visible={modalVisible}
        selected={selectedGroups}
        options={Object.values(splitNames)}
        onSelect={toggleGroup}
        onClear={() => setSelectedGroups([])}
        onApply={() => setModalVisible(false)}
        onClose={() => setModalVisible(false)}
        title="Select Split"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#121417',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: 'white',
    alignSelf: 'center',
    textAlign: 'center',
    marginVertical: 12,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginBottom: 12,
    gap: 8,
  },
  icon: {
    padding: 6,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 36,
  },
  loggedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%', // ensures full vertical space is used
  },
  
  loggedRowText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    width: 100, // or adjust to taste
 },
 loggedRowTextMiddle: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 10,
    width: 100, // or adjust to taste
 },
});
