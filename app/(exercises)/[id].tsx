// app/(exercises)/[id].tsx
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text } from 'react-native';
import GravitusHeader from '@/components/GravitusHeader';
import SectionHeader from '@/components/SectionHeader';
import { useLocalSearchParams } from 'expo-router';
import { useExerciseDetail } from '@/hooks/exercise/useExerciseDetails';
import ExerciseLineCard from '@/components/exercise/ExerciseLineCard';
import ExerciseAboutCard from '@/components/exercise/ExerciseAboutCard';
import ExerciseStatsCard from '@/components/exercise/ExerciseStatsCard';

/**
 * `ExerciseDetailScreen` displays detailed information about a specific exercise.
 *
 * This screen fetches exercise details using the exercise ID from the route parameters.
 * It shows the exercise name, estimated one rep max progression (if enough data is available),
 * and cards for exercise information and statistics.
 *
 * Data Sources:
 * - Uses `useExerciseDetail` hook to fetch exercise data, statistics, and progression.
 *
 * UI Components:
 * - `GravitusHeader`: App header with back navigation.
 * - `SectionHeader`: Section titles.
 * - `ExerciseLineCard`: Line chart for one rep max progression.
 * - `ExerciseAboutCard`: Exercise muscle group and motion details.
 * - `ExerciseStatsCard`: Session count and best set statistics.
 *
 */
export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams();

  const { loading, exercise, oneRmSeries, bestSet, sessionCount } = useExerciseDetail(id);

  if (!exercise) {
    return (
      <SafeAreaView style={{ flex:1, backgroundColor:'#121417' }}>
        <GravitusHeader showBackButton />
        <Text style={{ color:'white', marginTop:20, textAlign:'center' }}>
          {loading ? 'Loading exercise...' : 'Exercise not found'}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:'#121417' }}>
      <GravitusHeader showBackButton />
      <Text style={{ fontSize:28, fontWeight:'600', color:'white', textAlign:'center', marginVertical:12 }}>
        {exercise.name}
      </Text>

      <ScrollView contentContainerStyle={{ alignItems:'center', paddingBottom:48 }}>
        {oneRmSeries.length >= 5 && <SectionHeader title="Estimated One Rep Max Over Time" />}
        {oneRmSeries.length >= 5 && (
          <ExerciseLineCard
            data={oneRmSeries}
            label={String(oneRmSeries[oneRmSeries.length - 1].value)}
          />
        )}

        <SectionHeader title="About" />
        <ExerciseAboutCard
          name={exercise.name}
          primary={exercise.primaryMuscleGroup}
          secondary={exercise.secondaryMuscleGroup}
          motion={exercise.motion}
        />

        <SectionHeader title="Statistics" />
        <ExerciseStatsCard sessionCount={sessionCount} bestSet={bestSet} />
      </ScrollView>
    </SafeAreaView>
  );
}


// import React, { useEffect, useState } from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { View, Text, StyleSheet, ScrollView } from 'react-native';
// import GravitusHeader from '@/components/GravitusHeader';
// import { useLocalSearchParams } from 'expo-router';
// import { Exercise } from '@/types/firestoreTypes';
// import { getExerciseByID, getLogsByExerciseId } from '@/lib/firestoreFunctions';
// import { estimateOneRepMax, getHighestVolumeSet } from '@/lib/otherFunctions';
// import StatLineChart from '@/components/LineGraph';
// import SectionHeader from '@/components/SectionHeader';
// import FloatingCard from '@/components/floatingbox';

// export default function ExerciseDetailScreen() {
//   const { id } = useLocalSearchParams();
//   const [exercise, setExercise] = useState<Exercise>();
//   const [estimatedOneRepMaxOverTime, setEstimatedOneRepMaxOverTime] = useState<
//     { date: string; value: number }[]
//   >([]);
//   const [highestVolumeSet, setHighestVolumeSet] = useState<{ weight: number; reps: number; volume: number; date: string }>();

//   useEffect(() => {
//     if (!id || typeof id !== 'string') return;

//     const fetchData = async () => {
//       const [exerciseData, logs] = await Promise.all([
//         getExerciseByID(id),
//         getLogsByExerciseId(id),
//       ]);

//       if (exerciseData) setExercise(exerciseData);

//       if (logs) {
//         const hvs = getHighestVolumeSet(logs);
//         if(hvs){
//           setHighestVolumeSet(hvs);
//         }
//         const oneRepMaxOverTime = estimateOneRepMax(logs);
//         const chartData = Object.entries(oneRepMaxOverTime)
//           .map(([date, value]) => ({ date, value }))
//           .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
//         setEstimatedOneRepMaxOverTime(chartData);
//       }
//     };

//     fetchData();
//   }, [id]);

//   if (!exercise) {
//     return (
//       <SafeAreaView style={styles.screen}>
//         <GravitusHeader showBackButton />
//         <Text style={styles.loadingText}>Loading exercise...</Text>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.screen}>
//       <GravitusHeader showBackButton />
//       <Text style={styles.exerciseName}>{exercise.name}</Text>

//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         {estimatedOneRepMaxOverTime.length>=5&&(<SectionHeader title={"Estimated One Rep Max Over Time"}/>)}
//         {estimatedOneRepMaxOverTime.length >= 5 && (
//           <View style={styles.graphWrapper}>
//             <StatLineChart
//               data={estimatedOneRepMaxOverTime}
//               label={String(estimatedOneRepMaxOverTime[estimatedOneRepMaxOverTime.length-1].value)}
//             />
//           </View>
//         )}

//         <SectionHeader title="About" />

//         <FloatingCard width="90%">
//             <Text style={styles.label}>Primary Muscle Targetted:</Text>
//             <Text style={styles.detail}>{exercise.primaryMuscleGroup}</Text>
//         </FloatingCard>

//         {exercise.secondaryMuscleGroup?.length > 0 && (
//           <FloatingCard width="90%">
//             <Text style={styles.label}>Secondary Muscle Targetted:</Text>
//             <Text style={styles.detail}>{exercise.secondaryMuscleGroup.join(', ')}</Text>
//           </FloatingCard>
//         )}


//         <FloatingCard width="90%">
//           <Text style={styles.label}>{exercise.name} Motion:</Text>
//             <Text style={styles.detail}>{exercise.motion}</Text>
//         </FloatingCard>

//         <SectionHeader title="Statistics"/>

//         <FloatingCard width="90%">
//           <Text style={styles.label}>Amount of {exercise.name} Sessions:</Text>
//             <Text style={styles.detail}>{estimatedOneRepMaxOverTime.length}</Text>
//         </FloatingCard>

//         <FloatingCard width="90%">
//           <Text style={styles.label}>Best Volume Set: </Text>
//             {highestVolumeSet != null && (
//               <Text style={styles.detail}>{highestVolumeSet?.volume} lbs - ({highestVolumeSet?.weight} lbs * {highestVolumeSet?.reps} reps)</Text>
//             )}
//             {highestVolumeSet == null && (
//               <Text style={styles.detail}>No set information found</Text>
//             )}
            
//         </FloatingCard>


//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: '#121417',
//   },
//   scrollContent: {
//     alignItems: 'center',
//     paddingBottom: 48,
//   },
//   exerciseName: {
//     fontSize: 28,
//     fontWeight: '600',
//     color: 'white',
//     textAlign: 'center',
//     marginVertical: 12,
//   },
//   loadingText: {
//     color: 'white',
//     marginTop: 20,
//     textAlign: 'center',
//   },
//   detailBox: {
//     alignItems: 'center',
//     marginBottom: 20,
//     gap: 6,
//   },
//   label: {
//     fontSize: 14,
//     color: '#bbb',
//     fontWeight: '600',
//     marginTop: 6,
//     marginBottom: 6
//   },
//   detail: {
//     fontSize: 16,
//     color: 'white',
//     fontWeight: '500',
//   },
//   graphWrapper: {
//     marginTop: 20,
//     marginBottom: 10,
//     width: '90%',
//     alignItems: 'center',
//   },
// });
