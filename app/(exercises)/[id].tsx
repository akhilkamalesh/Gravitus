import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Image, StyleSheet, Pressable, ScrollView } from 'react-native';
import GravitusHeader from '@/components/title';
import FloatingCard from '@/components/floatingbox';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Exercise, ExerciseStat } from '@/types/firestoreTypes';
import { getExerciseByID, getLogsByExerciseId } from '@/lib/firestoreFunctions';

export default function ExerciseDetailScreen() {
  // Sample data (replace with props or route params)
  const {id} = useLocalSearchParams();
  const [exercise, setExercise] = useState<Exercise>();
  const [exerciseStat, setExerciseStat] = useState<ExerciseStat>();

  useEffect(() => {
    if (!id || typeof id !== 'string'){
        console.log('not a string')
        return;
    } 

    const fetchExercise = async () => {

        console.log("fetch exercise is called")
        const e = await getExerciseByID(id);
        setExercise(e);
    }

    const fetchExerciseStats = async () => {
        
        const e = await getLogsByExerciseId(id);
        if(e){
            setExerciseStat(e)
        }

    }

    fetchExercise();
    fetchExerciseStats();
  }, [id])


  if (!exercise) {
    return (
      <SafeAreaView style={styles.screen}>
        <GravitusHeader showBackButton={true} />
        <Text style={{ color: 'white', marginTop: 20 }}>Loading exercise...</Text>
      </SafeAreaView>
    );
  }

  console.log(exercise);
  console.log(exerciseStat);    


  return (
    <SafeAreaView style={styles.screen}>
      <GravitusHeader showBackButton={true} />
      <Text style={styles.exerciseName}>{exercise.name}</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image style={styles.image} resizeMode="contain" />

        <View style={styles.detailBox}>
            <Text style={styles.label}>Primary:</Text>
            <Text style={styles.detail}>{exercise.primaryMuscleGroup}</Text>

            <Text style={styles.label}>Secondary:</Text>
            <Text style={styles.detail}>{exercise.secondaryMuscleGroup?.join(", ")}</Text>

            <Text style={styles.label}>Motion:</Text>
            <Text style={styles.detail}>{exercise.motion}</Text>
        </View>

        <FloatingCard height={80} width="90%">
            <Pressable style={styles.graphDropdown}>
            <Text style={styles.graphText}>Graph “Stat” over time</Text>
            <Ionicons name="chevron-down" size={20} color="white" />
            </Pressable>
        </FloatingCard>



      </ScrollView>

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
    paddingVertical: 14,
  },
  exerciseName: {
    fontSize: 28,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginTop: 12,
  },
  image: {
    width: 250,
    height: 250,
    marginTop: 12,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#1e1e1e',
  },
  detailBox: {
    alignItems: 'center',
    marginBottom: 20,
    gap: 6,
  },
  label: {
    fontSize: 14,
    color: '#bbb',
    fontWeight: '600',
  },
  detail: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
    marginBottom: 4,
  },
  graphDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 20,
  },
  graphText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
