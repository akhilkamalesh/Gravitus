// app/(exercises)/exercises.tsx
import GravitusHeader from '@/components/GravitusHeader';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, ScrollView } from 'react-native';
import MuscleGroupModal from '@/components/MuscleGroupModal';
import { router } from 'expo-router';
import ExercisesTopBar from '@/components/exercise/ExerciseTopBar';
import ExerciseListItem from '@/components/exercise/ExerciseListItem';
import { useExercises } from '@/hooks/exercise/useExercise';

/**
 * This screen displays a searchable and filterable list of exercises.
 * 
 * Features:
 * - Header with back navigation.
 * - Title "Exercises".
 * - Search bar for filtering exercises by name.
 * - Filter modal for selecting muscle groups.
 * - List of exercises, each showing name, primary muscle group, and motion.
 * - Tapping an exercise navigates to its detail screen.
 * 
 * Hooks:
 * - useExercises: Manages loading state, filtered exercises, muscle groups, search query, and selected groups.
 * 
 * Components:
 * - GravitusHeader: App header with optional back button.
 * - ExercisesTopBar: Contains search input and filter button.
 * - ExerciseListItem: Displays individual exercise info.
 * - MuscleGroupModal: Modal for selecting muscle groups to filter exercises.
 */
export default function ExercisesScreen() {
  const {
    loading, filtered, groups,
    search, setSearch,
    selectedGroups, toggleGroup, clearGroups,
  } = useExercises(); // calls useExercise hooks

  const [modalVisible, setModalVisible] = useState(false); // modals

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:'#121417' }}>
      <GravitusHeader showBackButton />
      <Text style={{ fontSize:28, fontWeight:'600', color:'white', alignSelf:'center', marginVertical:12 }}>
        Exercises
      </Text>

      <ExercisesTopBar
        search={search}
        setSearch={setSearch}
        onOpenFilter={() => setModalVisible(true)}
      />

      <ScrollView>
        <View style={{ alignItems:'center', paddingBottom:36 }}>
          {!loading && filtered.map(ex => (
            <ExerciseListItem
              key={ex.id}
              id={ex.id}
              name={ex.name}
              primary={ex.primaryMuscleGroup}
              motion={ex.motion}
              onPress={(id) => router.push(`/(exercises)/${id}`)}
            />
          ))}
        </View>
      </ScrollView>

      <MuscleGroupModal
        visible={modalVisible}
        selected={selectedGroups}
        options={groups}
        onSelect={toggleGroup}
        onClear={clearGroups}
        onApply={() => setModalVisible(false)}
        onClose={() => setModalVisible(false)}
        title="Select Muscle Groups"
      />
    </SafeAreaView>
  );
}


// import GravitusHeader from '@/components/GravitusHeader';
// import React, { useEffect, useState } from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { StyleSheet, Pressable, Text, View, ScrollView, Button } from 'react-native';
// import SearchBar from '@/components/SearchBar';
// import MuscleGroupModal from '@/components/MuscleGroupModal';
// import { Feather } from '@expo/vector-icons';
// import {getExercises, getExerciseGroups} from '@/lib/firestoreFunctions';
// import { Exercise } from '@/types/firestoreTypes';
// import FloatingCard from '@/components/floatingbox';
// import { router } from 'expo-router';
// // import { allExerciseData } from '@/jsonData/exercisesData';

// export default function Exercises() {
//   const [searchQuery, setSearchQuery] = useState<string>('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
//   const [exercises, setExercises] = useState<Exercise[]>([]);
//   const [groups, setGroups] = useState<string[]>([]);

//   const toggleGroup = (group: string) => {
//     setSelectedGroups((prev) =>
//       prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
//     );
//   };

//   useEffect(() => {
//     const loadExercises = async () => {
//       const data = await getExercises();
//       setExercises(data);
//     };
//     const getGroups = async () => {
//       const data = await getExerciseGroups();
//       setGroups(data);
//     }

//     loadExercises();
//     getGroups();
//   }, []);


//   return (
//     <SafeAreaView style={styles.screen}>
//       <GravitusHeader showBackButton={true} />
//       <Text style={styles.mainTitle}>Exercises</Text>

//       <View style={styles.topBar}>
//         <SearchBar value={searchQuery} onChange={setSearchQuery} />
//         <Feather
//           name="filter"
//           size={22}
//           color="#bbb"
//           style={styles.icon}
//           onPress={() => setModalVisible(true)}
//         />
//       </View>

//       <ScrollView>
//         <View style={styles.listComp}>
//           {exercises
//             .filter(
//               (e) =>
//                 e.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
//                 (selectedGroups.length === 0 || selectedGroups.includes(e.primaryMuscleGroup))
//             )
//             .map((exercise) => (
//               <FloatingCard key={exercise.id} width="90%" height={95} onPress={()=>router.push(`/(exercises)/${exercise.id}`)}>
//                 <View style={styles.exerciseCard}>
//                   <View style={styles.exerciseTopRow}>
//                     <Text style={styles.exerciseName} numberOfLines={2}>{exercise.name}</Text>
//                   </View>
//                   <View style={styles.exerciseMetaRow}>
//                     <Text style={styles.secondary}>Primary: {exercise.primaryMuscleGroup}</Text>
//                     <Text style={styles.secondary}>Motion: {exercise.motion}</Text>
//                   </View>
//                 </View>
//               </FloatingCard>
//             ))}
//         </View>
//       </ScrollView>

//       <MuscleGroupModal
//         visible={modalVisible}
//         selected={selectedGroups}
//         options={groups}
//         onSelect={toggleGroup}
//         onClear={() => setSelectedGroups([])}
//         onApply={() => setModalVisible(false)}
//         onClose={() => setModalVisible(false)}
//         title="Select Muscle Groups"
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: '#121417',
//   },
//   mainTitle: {
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
//   listComp: {
//     alignItems: 'center',
//     paddingBottom: 36,
//   },
//   exerciseCard: {
//     flex: 1,
//     justifyContent: 'space-between',
//     paddingVertical: 8,
//   },
//   exerciseTopRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 6,
//   },
//   exerciseName: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: '600',
//     flex: 1,
//     flexWrap: 'wrap',
//   },
//   exerciseMetaRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 16,
//   },
//   secondary: {
//     color: '#bbb',
//     fontSize: 13,
//   },
// });
