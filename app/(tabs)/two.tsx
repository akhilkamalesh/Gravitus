import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import FloatingCard from '@/components/floatingbox';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import GravitusHeader from '@/components/title';
import { getCurrentSplit, getSplitInformation, getTodayWorkout, incrementDayIndex, logWorkout } from '@/lib/firestoreFunctions';
import { ExerciseLog, Split, workout, workoutExercise } from '@/types/firestoreTypes';
import SaveButton from '@/components/saveButton';
import { useRouter } from 'expo-router';

export default function TodayWorkoutScreen() {

  /*
    TODO:
    - Page needs to be refreshed after save is called
    - Delete Button needs to be operational for each floating card
  */

  const router = useRouter(); 

  const [split, setSplit] = useState<Split | null>(null);
  const [todayWorkout, setTodayWorkout] = useState<workout | null>(null);
  const [loggedExercises, setLoggedExercises] = useState<ExerciseLog | null>(null);

  const addSet = (index: number) => {
    if (!loggedExercises) return;
    const updated = { ...loggedExercises };
    updated.exercises[index].sets.push({ weight: 0, reps: 0 });
    setLoggedExercises(updated);
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: 'weight' | 'reps', value: string) => {
    if (!loggedExercises) return;
    const updated = { ...loggedExercises };
    updated.exercises[exerciseIndex].sets[setIndex][field] = Number(value);
    setLoggedExercises(updated);
  };

  const handleSave = async () => {

    console.log("Handle Save is called")

    if(!loggedExercises){
      console.error('Exercises not logged')
      return;
    }
    try {
      // Need to add logExercise here
      logWorkout(loggedExercises);
      // Then call increment here
      incrementDayIndex();
      // message saying congrats on completing workout
      Alert.alert('Success', 'Workout Uploaded!');
      // Route back to home screen
      router.push('/');
    } catch (err) {
      console.error("Error saving workout:", err);
    }
  }

  // Runs every render
  useEffect(() => {
    const fetchWorkout = async () => {
        const w = await getTodayWorkout()
        if(!w){
          console.error('Workout not found')
          return;
        }
        console.log(w)
        const {split, workout} = w;
        const log: ExerciseLog = {
          splitId: split.id,
          workoutDay: workout.dayName,
          date: new Date().toISOString(),
          exercises: workout.exercises.map((exercise: workoutExercise) => ({
            exerciseId: exercise.exerciseId,
            sets: Array.from({ length: exercise.sets }, () => ({ weight: 0, reps: 0 })),
          }))
        }


        setSplit(split)
        setTodayWorkout(workout)
        setLoggedExercises(log);

        // const initialLogged = workout.exercises.map((exercise) => {

        // })
    };

    fetchWorkout();
  }, [])

  // Error checking
  console.log(split)
  console.log("Today workout: ", todayWorkout?.exercises[0])

  return (
    <SafeAreaView style={styles.screen}>
      <GravitusHeader />   
      <Text style={styles.title}>Today’s Workout: {todayWorkout?.dayName}</Text>
      <Text style={styles.splitLink}>{split?.name}</Text>  
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {todayWorkout?.exercises.map((exercise, exIndex) => (
          <FloatingCard key={exercise.exerciseData?.name} width="90%">
            <View style={styles.cardHeader}>
              <Text style={styles.exerciseName}>{exercise.exerciseData?.name}</Text>
              <Ionicons name="trash-outline" size={20} color="white" />
            </View>

            <View style={styles.tableHeader}>
              <Text style={styles.col}>Set</Text>
              <Text style={styles.col}>Lbs</Text>
              <Text style={styles.col}>Reps</Text>
            </View>

            {loggedExercises?.exercises[exIndex]?.sets.map((set, setIndex) => (
              <View key={setIndex} style={styles.tableRow}>
                <Text style={styles.col}>{setIndex + 1}</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={set.weight.toString()}
                  onChangeText={(val) => updateSet(exIndex, setIndex, 'weight', val)}
                />
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={set.reps.toString()}
                  onChangeText={(val) => updateSet(exIndex, setIndex, 'reps', val)}
                />
              </View>
            ))}


            <Pressable style={styles.addSetButton} onPress={() => addSet(exIndex)}>
              <Ionicons name="add-circle-outline" size={20} color="white" />
              <Text style={styles.addSetText}>Add Set</Text>
            </Pressable>
          </FloatingCard>
        ))}
        <SaveButton onPress={handleSave}/>
      </ScrollView>

    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#1c1f23',
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 24,
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
  splitLink: {
    color: '#4FD6EA',
    fontSize: 14,
    marginBottom: 16,
    alignSelf: 'center'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  exerciseName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600'
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 10
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  col: {
    color: 'white',
    width: '22%',
    textAlign: 'center'
  },
  input: {
    backgroundColor: '#333',
    color: 'white',
    width: '22%',
    textAlign: 'center',
    borderRadius: 6,
    paddingVertical: 4
  },
  addSetButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15
  },
  addSetText: {
    color: 'white',
    marginLeft: 6
  }
});
