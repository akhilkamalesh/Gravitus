import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import FloatingCard from '@/components/floatingbox';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import GravitusHeader from '@/components/GravitusHeader';
import { getExercises, getTodayWorkout, incrementDayIndex, logWorkout, generateOneOffSplitId, checkWorkoutStatus, getLogsByExerciseId, saveOneOffSplitToUser } from '@/lib/firestoreFunctions';
import { Exercise, ExerciseLog, Split, workout, workoutExercise } from '@/types/firestoreTypes';
import SaveButton from '@/components/SaveButton';
import { useRouter } from 'expo-router';
import ExerciseSearchModal from '@/components/ExerciseSearchModal';
import WorkoutCompleteModal from '@/components/CompleteModal';


export default function TodayWorkoutScreen() {

  const router = useRouter(); 

  const [split, setSplit] = useState<Split | null>(null);
  const [todayWorkout, setTodayWorkout] = useState<workout | null>(null);
  const [loggedExercises, setLoggedExercises] = useState<ExerciseLog | null>(null);
  const [isStartingFresh, setIsStartingFresh] = useState(false);
  const [isWorkoutDone, setIsWorkoutDone] = useState(false);
  const [placeholders, setPlaceholders] = useState<{[exerciseId: string]: { date: string; reps: number; weight: number }[]}>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [trigger, setTrigger] = useState(false);


  const addSet = (index: number) => {
    if (!loggedExercises) return;
    const updated = { ...loggedExercises };
    updated.exercises[index].sets.push({ weight: 0, reps: 0 });
    setLoggedExercises(updated);
  };

  const removeSet = (exerciseIndex: number) => {
    if (!loggedExercises) return;
    const updated = { ...loggedExercises };
    const sets = updated.exercises[exerciseIndex].sets;
  
    if (sets.length > 1) {
      sets.splice(0, 1); // Remove the set
      setLoggedExercises(updated);
    } else {
      Alert.alert("Cannot delete the only set in this exercise");
    }
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: 'weight' | 'reps', value: string) => {
    if (!loggedExercises) return;
    const updated = { ...loggedExercises };
    updated.exercises[exerciseIndex].sets[setIndex][field] = Number(value);
    setLoggedExercises(updated);
  };

  const handleExerciseSelect = (exerciseId: string) => {
    const selected = exercises.find((e) => e.id === exerciseId);
    if (!selected || !todayWorkout || !loggedExercises) return;
  
    const newExercise: workoutExercise = {
      exerciseId: selected.id,
      sets: 2,
      reps: { min: 4, max: 12 },
      exerciseData: selected,
    };
  
    const updatedTodayWorkout: workout = {
      ...todayWorkout,
      exercises: [...todayWorkout.exercises, newExercise],
    };
  
    const updatedLog: ExerciseLog = {
      ...loggedExercises,
      exercises: [
        ...loggedExercises.exercises,
        {
          exerciseId: selected.id,
          sets: Array.from({ length: 2 }, () => ({ weight: 0, reps: 0 })),
        },
      ],
    };
  
    setTodayWorkout(updatedTodayWorkout);
    setLoggedExercises(updatedLog);
    setModalVisible(false);
    setSearchQuery('');
  };
  

  const deleteExercise = (exerciseIndex: number) => {
    if(todayWorkout?.exercises != null && todayWorkout?.exercises.length > 1){
      const updated = todayWorkout.exercises.filter((_, index) => index !== exerciseIndex);
      setTodayWorkout({ ...todayWorkout, exercises: updated });    
    }else{
      Alert.alert("Cannot delete only exercise")
    }
  };

  const handleSave = async () => {

    if(!loggedExercises){
      Alert.alert('Cannot Save', 'Nothing has been inputted')
      return;
    }
    try {
      // Log Workout
      if(await checkWorkoutStatus() == true){
        Alert.alert('Cannot Save', 'Workout is already done!')
        return;
      }

      logWorkout(loggedExercises);
      // Then call increment here
      if(!isStartingFresh){
        incrementDayIndex();
      }
      // message saying congrats on completing workout
      Alert.alert('Success', 'Workout Uploaded!');
      setTrigger(true);
    } catch (err) {
      console.error("Error saving workout:", err);
    }
  }

  const fetchWorkout = async () => {

    if(await checkWorkoutStatus()){
      setIsWorkoutDone(true)
      // return;
    }
    const w = await getTodayWorkout()
    if(!w){
      // This needs to be the same as the current split
      const newSplit: Split = {
        id: generateOneOffSplitId(),
        name: 'One-Off',
        description: 'A custom workout not tied to a plan',
        repeatDays: false,
        weeksDuration: 1,
        workouts: [
          {
            dayName: 'Custom',
            exercises: [], // populated during workout
          },
        ],
      };

      const log: ExerciseLog = {
        splitId: newSplit.id,
        workoutDay: newSplit.workouts[0].dayName,
        date: new Date().toISOString(),
        exercises: newSplit.workouts[0].exercises.map((exercise: workoutExercise) => ({
          exerciseId: exercise.exerciseId,
          sets: Array.from({ length: exercise.sets }, () => ({ weight: 0, reps: 0 })),
        }))
      }

      await saveOneOffSplitToUser(newSplit); // Overwrites the split with fixed ID
      setIsStartingFresh(true);

      setSplit(newSplit)
      setTodayWorkout(newSplit.workouts[0])
      setLoggedExercises(log);

      return;
    }
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
  };

  const fetchExercises = async () => {
    const e = await getExercises();
    setExercises(e)
  }

  useEffect(() => {
    fetchWorkout();
    fetchExercises();
    setTrigger(false)
  }, [trigger])

  useEffect(() => {
      
    fetchWorkout();
    fetchExercises();
  }, [])

  useEffect(() => {
    const fetchLastLogged = async () => {
      let arr: { [exerciseId: string]: { date: string; reps: number; weight: number }[] } = {};

      if(!loggedExercises){
        return;
      }

      // Iterates through all of the exercies for the workout
      for(const e of loggedExercises.exercises){
        const log = await getLogsByExerciseId(e.exerciseId);
        if(!log){
          arr[e.exerciseId].push({date: "", reps: 0, weight: 0})
          continue;
        }

        let date = '';

        // Has to grab the sets from that first date
        for(const set of log.sets){
          if(date === ''){
            date = set.date;
            arr[log.exerciseId] = [];
            arr[log.exerciseId].push(set);
          }else{
            if(new Date(set.date) >= new Date(date)){
              if (!arr[log.exerciseId]) {
                arr[log.exerciseId] = [];
              }
              arr[log.exerciseId].push(set);
            }else{
              continue;
            }
          }
        }
      }

      setPlaceholders(arr);
    }

    fetchLastLogged();

  }, [loggedExercises]);

  return (
    <SafeAreaView style={styles.screen}>
      <GravitusHeader showEditButton={true} 
        onTryNewWorkout={async () => {
          
          // This needs to be the same as the current split
          const newSplit: Split = {
            id: generateOneOffSplitId(),
            name: 'One-Off',
            description: 'A custom workout not tied to a plan',
            repeatDays: false,
            weeksDuration: 1,
            workouts: [
              {
                dayName: 'Custom',
                exercises: [], // populated during workout
              },
            ],
          };
        
          await saveOneOffSplitToUser(newSplit); // Overwrites the split with fixed ID
          setIsStartingFresh(true);

          if(split !== null){
            setTodayWorkout({ dayName: 'Custom', exercises: [] });
            setLoggedExercises({
              splitId: split.id,
              workoutDay: 'Custom',
              date: new Date().toISOString(),
              exercises: []
            });
          }}
        }
        onChangeSplit={()=>{
          router.push('../(trainingSplits)/trainingSplits')
        }}
        onSkipWorkout={async () => {
          await incrementDayIndex();
          setTrigger(true)
        }}
      />      
      {/* Workout complete modal */}
      <WorkoutCompleteModal
        visible={isWorkoutDone}
        onClose={() => setIsWorkoutDone(false)}
      />
      <Text style={styles.title}>Today’s Workout: {todayWorkout?.dayName}</Text>
      <Text style={styles.splitLink}>{split?.name}</Text>  
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {todayWorkout?.exercises.map((exercise, exIndex) => (
          <FloatingCard key={exercise.exerciseData?.name} width="90%">
            <View style={styles.cardHeader}>
              <Text style={styles.exerciseName}>{exercise.exerciseData?.name}</Text>
              <Pressable onPress={() => deleteExercise(exIndex)}>
                <Ionicons name="trash-outline" size={20} color="white" />
              </Pressable>
            </View>

            <View style={styles.tableHeader}>
              <Text style={styles.col}>Set</Text>
              <Text style={styles.col}>Lbs</Text>
              <Text style={styles.col}>Reps</Text>
            </View>

            {loggedExercises?.exercises[exIndex]?.sets.map((set, setIndex) => {
              
              const eId = loggedExercises.exercises[exIndex].exerciseId;
              let placeholder = placeholders[eId]
              let currPlaceHolderSet = placeholder?.[setIndex]
              if(currPlaceHolderSet === undefined){
                currPlaceHolderSet = {date: "", weight: 0, reps: 0}
              }

              return (
          
              <View key={setIndex} style={styles.tableRow}>
                <Text style={styles.col}>{setIndex + 1}</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder={String(currPlaceHolderSet?.weight)}
                  placeholderTextColor="#ccc"
                  onChangeText={(val) => updateSet(exIndex, setIndex, 'weight', val)}
                />
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder={String(currPlaceHolderSet?.reps)}
                  placeholderTextColor="#ccc"
                  onChangeText={(val) => updateSet(exIndex, setIndex, 'reps', val)}
                />
              </View>
              )
            })}

            <View style={styles.setRow}>
              <Pressable style={styles.addSetButton} onPress={() => addSet(exIndex)}>
                <Ionicons name="add-circle-outline" size={20} color="white" />
                <Text style={styles.addSetText}>Add Set</Text>
              </Pressable>
              <Pressable style={styles.addSetButton} onPress={() => removeSet(exIndex)}>
                <Ionicons name="remove-circle-outline" size={20} color="white" />
                <Text style={styles.addSetText}>Remove Set</Text>
              </Pressable>
            </View>
          </FloatingCard>
        ))}
        <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.addText}>+ Add Exercise</Text>
        </Pressable>
      </ScrollView>
      <SaveButton onPress={handleSave}/>
      <ExerciseSearchModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          exercises={exercises}
          onSelectExercise={handleExerciseSelect}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#121417',
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
    paddingVertical: 4, 
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
  },
  addButton: {
    marginTop: 20,
  },
  addText: {
      color: '#4FD6EA',
      fontSize: 16,
      alignSelf: 'center'
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    alignSelf: 'center'
  }
});
