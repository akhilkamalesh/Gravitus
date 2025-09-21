// app/(tabs)/TabOneScreen.tsx (your two.tsx equivalent)
import { ScrollView, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, useRouter } from 'expo-router';
import { useAuth } from '@/lib/authContext';
import GravitusHeader from '@/components/GravitusHeader';
import SectionHeader from '@/components/SectionHeader';
import TodayPlanCard from '@/components/home/TodayPlanCard';
import ExploreCard from '@/components/home/ExploreCard';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useHomeSummary } from '@/hooks/home/useHomeSummary';

export default function TabOneScreen() {
  const router = useRouter();
  const { user, userData } = useAuth(); // calling auth context
  const { isDone, workoutMeta } = useHomeSummary(); // calling hook context

  if (user === null) return <Redirect href="../(auth)/auth" />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121417' }}>
      <GravitusHeader />
      <Text style={{ fontSize: 28, fontWeight: '600', color: '#fff', textAlign: 'center', marginVertical: 12 }}>
        Welcome Back, {userData?.name}
      </Text>

      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 48 }}>
        <SectionHeader title="Today's Plan" />
        <TodayPlanCard
          isDone={isDone}
          workoutMeta={workoutMeta}
          onPress={() => router.push('/two')}
        />

        <SectionHeader title="Explore" />
        <ExploreCard
          title="History"
          height={110}
          onPress={() => router.push('/(history)/history')}
          icon={<Feather name="clock" size={28} color="white" />}
        />
        <ExploreCard
          title="Training Splits"
          height={110}
          onPress={() => router.push('/(trainingSplits)/trainingSplits')}
          icon={<Feather name="grid" size={28} color="white" />}
        />
        <ExploreCard
          title="Exercises"
          height={110}
          onPress={() => router.push('/(exercises)/exercises')}
          icon={<MaterialCommunityIcons name="weight-lifter" size={28} color="white" />}
        />
      </ScrollView>
    </SafeAreaView>
  );
}





// import React, {useState, useEffect} from 'react';
// import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Redirect, useRouter } from 'expo-router';
// import { useAuth } from '@/lib/authContext';
// import GravitusHeader from '@/components/GravitusHeader';
// import FloatingCard from '@/components/floatingbox';
// import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
// import { workout } from '@/types/firestoreTypes';
// import { checkWorkoutStatus, getTodayWorkout, getWorkoutCountPerWeek } from '@/lib/firestoreFunctions';
// import { estimateWorkoutTime } from '@/lib/otherFunctions';
// import { useFocusEffect } from '@react-navigation/native';
// import { useCallback } from 'react';


// export default function TabOneScreen() {
//   const router = useRouter();
//   // router.push adds to the call stack while router.replace doesn;t
//   // use push for subscreens, and replace for main screens
//   const { user, userData } = useAuth();

//   const [status, setStatus] = useState<boolean>(false);
//   const [workout, setWorkout] = useState<workout | null>(null);

//   useFocusEffect(
//     useCallback(() => {
//       const fetchWorkout = async () => {
//         if (await checkWorkoutStatus()) {
//           setStatus(true);
//         }
  
//         const w = await getTodayWorkout();
//         if (w != null) {
//           const { split, workout } = w;
//           setWorkout(workout);
//         }
//       };
  
//       fetchWorkout();
//     }, [])
//   );

//   if(user === null){
//     return(
//      <Redirect href="../(auth)/auth"/>
//     )
//   }

//   return (
//     <SafeAreaView style={styles.screen}>
//       <GravitusHeader />
//       <Text style={styles.welcome}>Welcome Back, {userData?.name}</Text>
//       <ScrollView contentContainerStyle={styles.scrollContent}>

//         <SectionHeader title="Today's Plan" />
//         <FloatingCard height={170} width="90%" onPress={() => router.push('/two')}>
//           <View style={styles.workoutCard}>
//             <View style={styles.workoutHeader}>
//               <MaterialCommunityIcons name="dumbbell" size={28} color="white" />
//               <Text style={styles.cardTitle}>Today's Workout</Text>
//             </View>
//             <Text style={styles.workoutSubtitle}>{workout?.dayName}</Text>
//             {!status && (
//             <View style={styles.statsRow}>
//               <View style={styles.statBox}>
//                 <Feather name="list" size={16} color="#bbb" />
//                 <Text style={styles.statText}>{workout?.exercises.length} Exercises</Text>
//               </View>
//               <View style={styles.statBox}>
//                 <Feather name="repeat" size={16} color="#bbb" />
//                 <Text style={styles.statText}>{workout?.exercises?.reduce((sum, ex) => sum + ex.sets, 0) ?? 0} Sets</Text>
//               </View>
//               <View style={styles.statBox}>
//                 <Feather name="clock" size={16} color="#bbb" />
//                 <Text style={styles.statText}>Est. {estimateWorkoutTime(
//                     workout?.exercises.length || 0,
//                     workout ?
//                     workout.exercises.reduce((sum, ex) => sum + ex.sets, 0) : 0
//                   )} min
//                 </Text>
//               </View>
//             </View>
//             )}
//             {status && (
//               <View style={styles.statsRow}>
//                 <View style={styles.statBox}>
//                   <Feather name="list" size={16} color="#bbb" />
//                   <Text style={styles.statText}>Workout is complete, you may rest for the day</Text>
//                 </View>
//               </View>
//             )}
//             <Text style={styles.startPrompt}>Tap to begin</Text>
//           </View>
//         </FloatingCard>

//         <SectionHeader title="Explore" />

//         <FloatingCard height={110} width="90%" onPress={() => router.push('/(history)/history')}>
//             <Text style={styles.cardTitleSmall}>History</Text>
//             <Feather name="clock" size={28} color="white" />
//           </FloatingCard>

//         <FloatingCard height={110} width="90%" onPress={() => router.push('/(trainingSplits)/trainingSplits')}>
//           <Text style={styles.cardTitleSmall}>Training Splits</Text>
//           <Feather name="grid" size={28} color="white" />
//         </FloatingCard>

//         <FloatingCard height={110} width="90%" onPress={() => router.push('/(exercises)/exercises')}>
//           <Text style={styles.cardTitleSmall}>Exercises</Text>
//           <MaterialCommunityIcons name="weight-lifter" size={28} color="white" />
//         </FloatingCard>

//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const SectionHeader = ({ title }: { title: string }) => (
//   <Text style={styles.sectionHeader}>{title}</Text>
// );

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: '#121417',
//   },
//   scrollContent: {
//     alignItems: 'center',
//     paddingBottom: 48,
//   },
//   welcome: {
//     fontSize: 28,
//     fontWeight: '600',
//     color: '#ffffff',
//     textAlign: 'center',
//     marginVertical: 12,
//   },
//   sectionHeader: {
//     alignSelf: 'flex-start',
//     color: '#999',
//     fontSize: 18,
//     fontWeight: '600',
//     marginTop: 20,
//     marginBottom: 8,
//     paddingHorizontal: '5%',
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '90%',
//     gap: 12,
//   },
//   cardTitle: {
//     color: 'white',
//     fontSize: 20,
//     fontWeight: '700',
//     marginBottom: 12,
//   },
//   cardTitleSmall: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 6,
//   },
//   cardIcon: {
//     marginTop: 4,
//   },
//   workoutCard: {
//     flex: 1,
//     justifyContent: 'space-between',
//     paddingVertical: 8,
//   },
//   workoutHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   workoutSubtitle: {
//     color: '#ccc',
//     fontSize: 14,
//     marginTop: 4,
//     fontWeight: '500',
//   },
//   statsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10,
//   },
//   statBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   statText: {
//     color: '#ccc',
//     fontSize: 13,
//   },
//   startPrompt: {
//     marginTop: 12,
//     color: '#00e0a1',
//     fontSize: 13,
//     fontWeight: '600',
//   },
//   graphWrapper: {
//     marginTop: 20,
//     marginBottom: 10,
//     width: '90%',
//     alignItems: 'center',
//   },
// });
