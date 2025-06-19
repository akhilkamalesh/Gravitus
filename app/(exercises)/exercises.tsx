import GravitusHeader from '@/components/title'
import React, {useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet, Pressable, Text, View, ScrollView } from 'react-native'
import SearchBar from '@/components/searchBar'
import FilterModal from '@/components/exerciseFilterBar'
import { Feather } from '@expo/vector-icons';
import { getExercises } from '@/lib/firestoreFunctions'
import { Exercise } from '@/types/firestoreTypes'
import FloatingCard from '@/components/floatingbox'
import { Image } from 'react-native'

export default function Exercises(){

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
    const [exercises, setExercises] = useState<Exercise[]>([])

    // Selects the muscle groups from the popup modal (exerciseFilterBar)
    const toggleGroup = (group: string) => {
      setSelectedGroups((prev) =>
        prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
      );
    };

    // Exercise Groups
    const groups = ["Chest", "Quadriceps", "Rhomboids", "Latissimus Dorsi", "Shoulders", "Biceps", "Triceps", "Calves"];

    // Pulls exercises from the database
    useEffect(() => {
      const loadExercises = async() => {
        const data = await getExercises();
        setExercises(data);
      };

      loadExercises();
    }, [])

    // TODO: Fix UI of title so it wraps (too long)
    // this will probably be a later task after setting up split page, then tracking page
    return(
        <SafeAreaView style={styles.screen}>
            <GravitusHeader showBackButton={true}/>
            <Text style={styles.mainTitle}>Exercises</Text>
            <View style={styles.topBar}>
                <SearchBar value={searchQuery} onChange={setSearchQuery}/>
                <Feather name="filter" size={20} color="#ccc" style={styles.icon} onPress={()=>setModalVisible(true)}/>
            </View>

            <ScrollView>
              <View style={styles.listComp}>
                {exercises
                  .filter((e) => e.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
                  (selectedGroups.length === 0 || selectedGroups.includes(e.primaryMuscleGroup))
                  )
                  .map((exercise) => (
                    <FloatingCard key={exercise.id} width="90%">
                      <View style={styles.exerciseInformation}>
                        <View style={styles.leftColumn}>
                          <View style={styles.titleWrapper}>
                            <Text style={styles.title} numberOfLines={0}>{exercise.name}</Text>
                          </View>
                        </View>
                        <View style={styles.rightColumn}>
                          <Text style={styles.secondary}>Primary: {exercise.primaryMuscleGroup}</Text>
                          <Text style={styles.secondary}>Motion: {exercise.motion}</Text>
                        </View>
                      </View>
                    </FloatingCard>
                ))}
              </View>
            </ScrollView>
            

            <FilterModal
                visible={modalVisible}
                selected={selectedGroups}
                options={groups}
                onSelect={toggleGroup}
                onClear={() => setSelectedGroups([])}
                onApply={() => setModalVisible(false)}
                onClose={() => setModalVisible(false)}
            />

         </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: '#1c1f23',
    },
    mainTitle: {
      fontSize: 30,
      fontWeight: '600',
      color: 'white',
      alignSelf: 'center',
      textAlign: 'center',
      flexWrap: 'wrap',
      margin: 12
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginHorizontal: 15,
    },
    icon:{
        alignSelf: 'center'
    },
    listComp: {
      alignItems: "center",
    },
    exerciseInformation: {
      flexDirection: 'row',
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: 10,
      gap: 10,
    },
    
    leftColumn: {
      width: '50%', 
      paddingRight: 10,
    },

    titleWrapper: {
      width: '100%',
    },
    
    rightColumn: {
      width: '45%',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center'
    },
    
    title: {
      color: 'white',
      fontSize: 20,
      flexWrap: 'wrap',
      textAlign: 'left',
      width: '100%',          // ✅ <-- This is the key
    },
    
    secondary: {
      color: 'white',
      fontSize: 12,
      marginBottom: 2,
      textAlign: 'left',
      // flexWrap: 'wrap',
    },
  });