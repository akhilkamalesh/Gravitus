import React, {useState, useEffect} from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/authContext';
import GravitusHeader from '@/components/title';
import FloatingCard from '@/components/floatingbox';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { workout } from '@/types/firestoreTypes';
import { checkWorkoutStatus, getTodayWorkout } from '@/lib/firestoreFunctions';
import { estimateWorkoutTime } from '@/lib/otherFunctions';


export default function TabOneScreen() {
  const router = useRouter();
  // router.push adds to the call stack while router.replace doesn;t
  // use push for subscreens, and replace for main screens
  const { userData } = useAuth();

  const [status, setStatus] = useState<boolean>(false);
  const [workout, setWorkout] = useState<workout | null>(null);


  const handleSignOut = async () => {
    try {
      router.replace('/(auth)/auth');
    } catch (e: any) {
      console.error(e);
    }
  };

  useEffect(()=>{
    const fetchWorkout = async () => {

      if (await checkWorkoutStatus()){
        setStatus(true);
        // return;
      }

      const w = await getTodayWorkout()
      if(w != null){
        const {split, workout} = w
        setWorkout(workout)
      }
    }

    fetchWorkout();

  }, [])

  return (
    <SafeAreaView style={styles.screen}>
      <GravitusHeader />
      <Text style={styles.welcome}>Welcome Back, {userData?.name}</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <SectionHeader title="Your Stats" />
        <FloatingCard height={155} width="90%">
          <Text style={styles.cardTitle}>Weekly Progress</Text>
          <Feather name="bar-chart" size={40} color="white" style={styles.cardIcon} />
        </FloatingCard>

        <SectionHeader title="Today's Plan" />
        <FloatingCard height={170} width="90%" onPress={() => router.push('/two')}>
          <View style={styles.workoutCard}>
            <View style={styles.workoutHeader}>
              <MaterialCommunityIcons name="dumbbell" size={28} color="white" />
              <Text style={styles.cardTitle}>Today's Workout</Text>
            </View>
            <Text style={styles.workoutSubtitle}>{workout?.dayName}</Text>
            {!status && (
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Feather name="list" size={16} color="#bbb" />
                <Text style={styles.statText}>{workout?.exercises.length} Exercises</Text>
              </View>
              <View style={styles.statBox}>
                <Feather name="repeat" size={16} color="#bbb" />
                <Text style={styles.statText}>{workout?.exercises?.reduce((sum, ex) => sum + ex.sets, 0) ?? 0} Sets</Text>
              </View>
              <View style={styles.statBox}>
                <Feather name="clock" size={16} color="#bbb" />
                <Text style={styles.statText}>Est. {estimateWorkoutTime(
                    workout?.exercises.length || 0,
                    workout ?
                    workout.exercises.reduce((sum, ex) => sum + ex.sets, 0) : 0
                  )} min
              </Text>
              </View>
            </View>
            )}
            {status && (
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Feather name="list" size={16} color="#bbb" />
                  <Text style={styles.statText}>Workout is complete, you may rest for the day</Text>
                </View>
              </View>
            )}
            <Text style={styles.startPrompt}>Tap to begin</Text>
          </View>
        </FloatingCard>

        <SectionHeader title="Explore" />
        <View style={styles.row}>
          <FloatingCard height={130} width={167} onPress={() => router.push('/(history)/history')}>
            <Text style={styles.cardTitleSmall}>History</Text>
            <Feather name="clock" size={28} color="white" />
          </FloatingCard>
          <FloatingCard height={130} width={167}>
            <Text style={styles.cardTitleSmall}>Goals & PRs</Text>
            <Feather name="target" size={28} color="white" />
          </FloatingCard>
        </View>

        <FloatingCard height={130} width="90%" onPress={() => router.push('/(trainingSplits)/trainingSplits')}>
          <Text style={styles.cardTitleSmall}>Training Splits</Text>
          <Feather name="grid" size={28} color="white" />
        </FloatingCard>

        <FloatingCard height={130} width="90%" onPress={() => router.push('/(exercises)/exercises')}>
          <Text style={styles.cardTitleSmall}>Exercises</Text>
          <MaterialCommunityIcons name="weight-lifter" size={28} color="white" />
        </FloatingCard>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const SectionHeader = ({ title }: { title: string }) => (
  <Text style={styles.sectionHeader}>{title}</Text>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#121417',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 48,
  },
  welcome: {
    fontSize: 28,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginVertical: 12,
  },
  sectionHeader: {
    alignSelf: 'flex-start',
    color: '#999',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
    paddingHorizontal: '5%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    gap: 12,
  },
  cardTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  cardTitleSmall: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  cardIcon: {
    marginTop: 4,
  },
  workoutCard: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  workoutSubtitle: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: '#ccc',
    fontSize: 13,
  },
  startPrompt: {
    marginTop: 12,
    color: '#00e0a1',
    fontSize: 13,
    fontWeight: '600',
  },
  signOutButton: {
    marginTop: 20,
    backgroundColor: '#26292e',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#444',
  },
  signOutText: {
    color: '#eee',
    fontWeight: '600',
    fontSize: 16,
  },
});
