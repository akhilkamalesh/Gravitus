import GravitusHeader from '@/components/title';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Pressable, Text, View, ScrollView, Button } from 'react-native';
import SearchBar from '@/components/searchBar';
import FilterModal from '@/components/exerciseFilterBar';
import { Feather } from '@expo/vector-icons';
import { addExercisesToExerciseList, getExercises, deleteAllExercises} from '@/lib/firestoreFunctions';
import { Exercise } from '@/types/firestoreTypes';
import FloatingCard from '@/components/floatingbox';
import { router } from 'expo-router';
// import { allExerciseData } from '@/jsonData/exercisesData';

export default function Exercises() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const toggleGroup = (group: string) => {
    setSelectedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  // const addExercises = async () => {
  //   await addExercisesToExerciseList(allExerciseData);
  // }

  // const deleteExercises = async () => {
  //   await deleteAllExercises();
  // }

  const groups = ["Chest", "Quadriceps", "Rhomboids", "Latissimus Dorsi", "Shoulders", "Biceps", "Triceps", "Calves"];

  useEffect(() => {
    const loadExercises = async () => {
      const data = await getExercises();
      setExercises(data);
    };
    loadExercises();
  }, []);

  // exercises.forEach((e) => console.log(e.id))
  console.log(exercises)

  return (
    <SafeAreaView style={styles.screen}>
      <GravitusHeader showBackButton={true} />
      <Text style={styles.mainTitle}>Exercises</Text>

      <View style={styles.topBar}>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <Feather
          name="filter"
          size={22}
          color="#bbb"
          style={styles.icon}
          onPress={() => setModalVisible(true)}
        />
      </View>

      <ScrollView>
        <View style={styles.listComp}>
          {exercises
            .filter(
              (e) =>
                e.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                (selectedGroups.length === 0 || selectedGroups.includes(e.primaryMuscleGroup))
            )
            .map((exercise) => (
              <FloatingCard key={exercise.id} width="90%" height={95} onPress={()=>router.push(`/(exercises)/${exercise.id}`)}>
                <View style={styles.exerciseCard}>
                  <View style={styles.exerciseTopRow}>
                    <Text style={styles.exerciseName} numberOfLines={2}>{exercise.name}</Text>
                  </View>
                  <View style={styles.exerciseMetaRow}>
                    <Text style={styles.secondary}>Primary: {exercise.primaryMuscleGroup}</Text>
                    <Text style={styles.secondary}>Motion: {exercise.motion}</Text>
                  </View>
                </View>
              </FloatingCard>
            ))}
        </View>
        {/* <Button title={'dededed'} onPress={()=>{deleteExercises()}}></Button>
        <Button title={'asdsa'} onPress={()=>{addExercises()}}></Button> */}
      </ScrollView>

      <FilterModal
        visible={modalVisible}
        selected={selectedGroups}
        options={groups}
        onSelect={toggleGroup}
        onClear={() => setSelectedGroups([])}
        onApply={() => setModalVisible(false)}
        onClose={() => setModalVisible(false)}
        title="Select Muscle Groups"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#121417',
  },
  mainTitle: {
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
  listComp: {
    alignItems: 'center',
    paddingBottom: 36,
  },
  exerciseCard: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  exerciseTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  exerciseName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    flexWrap: 'wrap',
  },
  exerciseMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  secondary: {
    color: '#bbb',
    fontSize: 13,
  },
});
