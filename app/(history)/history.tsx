// app/(history)/history.tsx
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import GravitusHeader from '@/components/GravitusHeader';
import HistoryTopBar from '@/components/history/HistoryTopBar';
import HistoryItem from '@/components/history/HistoryItem';
import MuscleGroupModal from '@/components/MuscleGroupModal';
import { useHistory } from '@/hooks/history/useHistory';

/**
 * Main screen for viewing logged workouts
 *  pulls data using the useHistory hook
 * @returns The main screen for viewing logged workouts
 */
export default function HistoryScreen() {
  const router = useRouter();
  const {
    loading, filtered, splitNames, splitOptions,
    searchText, setSearchText, selectedSplits, toggleSplit, clearSplits,
  } = useHistory();

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:'#121417' }}>
      <GravitusHeader showBackButton />
      <Text style={{ fontSize:28, fontWeight:'600', color:'white', alignSelf:'center', marginVertical:12 }}>
        Logged Workouts
      </Text>

      {// Top bar with search and filter button
      }
      <HistoryTopBar
        searchText={searchText}
        setSearchText={setSearchText}
        onOpenFilter={() => setModalVisible(true)}
      />

      {// List of logged workouts depending on filter results
      }
      <ScrollView contentContainerStyle={{ alignItems:'center', paddingBottom:36 }}>
        {!loading && filtered.map(w => (
          <HistoryItem
            key={w.id}
            logId={w.id}
            date={w.date}
            dayName={w.workoutDay}
            splitName={splitNames[w.splitId] ?? 'One-Off'}
            onPress={(id) => router.push(`/(history)/${id}`)}
          />
        ))}
      </ScrollView>

      {// Modal for selecting muscle groups to filter by
      }
      <MuscleGroupModal
        visible={modalVisible}
        selected={selectedSplits}
        options={splitOptions}
        onSelect={toggleSplit}
        onClear={clearSplits}
        onApply={() => setModalVisible(false)}
        onClose={() => setModalVisible(false)}
        title="Select Split"
      />
    </SafeAreaView>
  );
}


// import React, { useState, useEffect } from "react";
// import GravitusHeader from "@/components/GravitusHeader";
// import FloatingCard from "@/components/floatingbox";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { ScrollView, StyleSheet, Text, View } from "react-native";
// import { ExerciseLog } from "@/types/firestoreTypes";
// import { getLoggedWorkouts, getSplitBySplitId } from "@/lib/firestoreFunctions";
// import SearchBar from "@/components/SearchBar";
// import { Feather } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import MuscleGroupModal from '@/components/MuscleGroupModal';

// export default function HistoryScreen() {
//   const router = useRouter();

//   const [searchText, setSearchText] = useState('');
//   const [loggedWorkouts, setLoggedWorkouts] = useState<ExerciseLog[] | null>(null);
//   const [splitNames, setSplitNames] = useState<{ [splitId: string]: string }>({});
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

//   const toggleGroup = (group: string) => {
//     setSelectedGroups((prev) =>
//       prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
//     );
//   };

//   const fetchSplitName = async (splitId: string) => {
//     if (splitNames[splitId]) return;
//     const split = await getSplitBySplitId(splitId);
//     if (split) {
//       setSplitNames((prev) => ({ ...prev, [splitId]: split.name }));
//     }
//   };

//   useEffect(() => {
//     const fetchLoggedWorkouts = async () => {
//       const workouts = await getLoggedWorkouts();
//       if (!workouts) {
//         console.error("Logged workouts not fetched");
//         return;
//       }
//       setLoggedWorkouts(workouts);
//       const arr = []
//       for (const log of workouts) {
//         if(log.splitId in arr){
//           continue;
//         }
//         arr.push(log.splitId)
//         await fetchSplitName(log.splitId);
//       }
//     };
//     fetchLoggedWorkouts();
//   }, []);

//   return (
//     <SafeAreaView style={styles.screen}>
//       <GravitusHeader showBackButton={true} />
//       <Text style={styles.title}>Logged Workouts</Text>

//       <View style={styles.topBar}>
//         <SearchBar
//           value={searchText}
//           onChange={setSearchText}
//           placeholder="Search By Workout..."
//         />
//         <Feather name="filter" size={22} color="#bbb" style={styles.icon} onPress={()=>setModalVisible(true)}/>
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollContent}>
//       {loggedWorkouts
//           ?.filter((l) =>
//             l.workoutDay.toLowerCase().includes(searchText.toLowerCase()) &&
//             (
//               selectedGroups.length === 0 ||
//               selectedGroups.includes(splitNames[l.splitId] ?? 'One-Off')
//             )
//           )
//           .map((workout) => (
//             <FloatingCard
//               key={workout.id}
//               height={70}
//               width="90%"
//               onPress={() => router.push(`/(history)/${workout.id}`)}
//             >
//               <View style={styles.loggedRow}>
//                 <Text style={styles.loggedRowText}>{workout.date.substring(0, 10)}</Text>
//                 <Text style={styles.loggedRowTextMiddle}>{workout.workoutDay}</Text>
//                 <Text style={styles.loggedRowText}>
//                   {splitNames[workout.splitId] ?? 'One-Off'}
//                 </Text>
//               </View>
//             </FloatingCard>
//           ))}
//       </ScrollView>

//       <MuscleGroupModal
//         visible={modalVisible}
//         selected={selectedGroups}
//         options={Object.values(splitNames)}
//         onSelect={toggleGroup}
//         onClear={() => setSelectedGroups([])}
//         onApply={() => setModalVisible(false)}
//         onClose={() => setModalVisible(false)}
//         title="Select Split"
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: '#121417',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '600',
//     color: 'white',
//     alignSelf: 'center',
//     textAlign: 'center',
//     marginVertical: 12,
//   },
//   topBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginHorizontal: 15,
//     marginBottom: 12,
//     gap: 8,
//   },
//   icon: {
//     padding: 6,
//   },
//   scrollContent: {
//     alignItems: 'center',
//     paddingBottom: 36,
//   },
//   loggedRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     height: '100%', // ensures full vertical space is used
//   },
  
//   loggedRowText: {
//     color: 'white',
//     fontSize: 15,
//     fontWeight: '600',
//     textAlign: 'center',
//     width: 100, // or adjust to taste
//  },
//  loggedRowTextMiddle: {
//     color: 'white',
//     fontSize: 15,
//     fontWeight: '600',
//     textAlign: 'center',
//     marginHorizontal: 10,
//     width: 100, // or adjust to taste
//  },
// });
