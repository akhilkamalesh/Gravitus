import React, {useEffect, useState} from 'react';
import { SafeAreaView, View, Text, StyleSheet, Alert, TextInput, ScrollView, Pressable, KeyboardAvoidingView, Modal } from 'react-native';
import FloatingCard from '@/components/floatingbox';
import GravitusHeader from '@/components/GravitusHeader';
import { Exercise, Split, workout, workoutExercise } from '@/types/firestoreTypes';
import { saveSplitToUser, updateCurrentSplit, getExercises, getSplitInformation, resetDayIndex} from '@/lib/firestoreFunctions';
import SaveButton from '@/components/SaveButton';
import DropDownPicker from 'react-native-dropdown-picker';
import RNPickerSelect from 'react-native-picker-select';
import { useRouter } from 'expo-router';
import ExerciseSearchModal from '@/components/ExerciseSearchModal';

export default function CreateSplit(){

    const router = useRouter(); 

    const confirmAction = (title: string, message: string, onConfirm: () => void) => {
        Alert.alert(title, message, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Confirm', style: 'destructive', onPress: onConfirm },
        ]);
    };

    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [repeatDays, setRepeatDays] = useState<boolean>(false);
    const [weeksDuration, setWeeksDuration] = useState<string>('');
    const [workouts, setWorkouts] = useState<workout[]>([]);
    const [selectedExerciseDay, setSelectedExerciseDay] = useState<number | null>(null);
    const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [exercises, setExercises] = useState<Exercise[]>([]);

    const addWorkoutDay = () => {
        setWorkouts((prev) => [...prev, {dayName: '', exercises: []}])
    }

    const updateWorkoutDayName = (index: number, newName: string) => {
        setWorkouts((prevWorkouts) => {
            const updated = [...prevWorkouts];
            updated[index] = {
              ...updated[index],
              dayName: newName
            };
            return updated;
          });
    }

    const addExerciseRow = (dayIndex: number) => {
        setWorkouts((prev) => {
          const updated = [...prev];
          updated[dayIndex].exercises.push({
            exerciseId: '',
            sets: 3,
            reps: {
                min: 4,
                max: 12
            },
          });
          return updated;
        });
      };

    const updateExercise = (
        dayIndex: number,
        exIndex: number,
        field: 'exerciseId' | 'sets' | 'minReps' | 'maxReps',
        value: string
      ) => {
        setWorkouts((prev) => {
          const updated = [...prev];
          const targetExercise = { ...updated[dayIndex].exercises[exIndex] };
      
          if (!targetExercise.reps) {
            targetExercise.reps = { min: 0, max: 0 };
          }
      
          if (field === 'minReps') {
            const num = parseInt(value);
            targetExercise.reps.min = isNaN(num) ? 0 : num;
          } else if (field === 'maxReps') {
            const num = parseInt(value);
            targetExercise.reps.max = isNaN(num) ? 0 : num;
          } else if (field === 'sets') {
            const num = parseInt(value);
            targetExercise.sets = isNaN(num) ? 0 : num;
          } else {
            (targetExercise as any)[field] = value;
          }
      
          updated[dayIndex].exercises[exIndex] = targetExercise;
          return updated;
        });
    };
      
    const handleExerciseSelect = (exerciseId: string) => {
        if (selectedExerciseDay === null || selectedExerciseIndex === null) return;
      
        updateExercise(selectedExerciseDay, selectedExerciseIndex, 'exerciseId', exerciseId);
        setModalVisible(false);
        setSearchQuery('');
        setSelectedExerciseDay(null);
        setSelectedExerciseIndex(null);
    };
      

    const handleSave = async () => {
        // Need to add more error checks
        if(!name || !description || workouts.length == 0){
            Alert.alert("Missing fields", "Fill out all the necessary information for the split")
        }

        confirmAction('Save Split', 'Are you sure you want to save split?', async () => {
            const split: Omit<Split, 'id'> = {
                name,
                description,
                repeatDays,
                weeksDuration: parseInt(weeksDuration),
                workouts,
                createdAt: new Date() as any,
            };
    
            try{
                const enrichedSplit = await getSplitInformation({ ...split, id: '' });
    
                const docId = await saveSplitToUser(enrichedSplit);
                updateCurrentSplit(docId); // TODO: needs to be some type of check
                                            // if user wants to make split that they created
                                             // as their current split 
                resetDayIndex();           // Reset Day index to 0
                Alert.alert('Success', `Split saved with ID: ${docId}`);
    
                router.push('/');
            }catch(err){
                console.error(err);
                Alert.alert('Error', 'Failed to save split.');
            }
        })
    };

    useEffect(() => {
        const fetchExercises = async () => {
            const e = await getExercises();
            setExercises(e);
        };

        fetchExercises();

    }, [])

    return (
        <SafeAreaView style={styles.screen}>
            <GravitusHeader showBackButton={true}/>
            <TextInput 
                style={styles.title} 
                placeholder="Set Split Name"
                placeholderTextColor="#aaa"
                value={name}
                onChangeText={setName}
            />
            <TextInput 
                style={styles.description}
                placeholder="Enter Psuedo Description Here"
                placeholderTextColor="#aaa"
                value={description}
                onChangeText={setDescription}
            />
            <TextInput
                style={styles.description}
                placeholder="Weeks Duration"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                value={weeksDuration}
                onChangeText={(text) => {
                    const numericOnly = text.replace(/[^0-9]/g, ''); // ⬅ removes non-digits
                    setWeeksDuration(numericOnly);
                }}            
            />
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    {workouts.map((w, index) => (
                        <View key={index} style={styles.workoutBox}>
                        <TextInput 
                            style={styles.workoutTitle}
                            placeholder={`Workout Day ${index+1}`}
                            placeholderTextColor="#aaa"
                            value={w.dayName}
                            onChangeText={(text) => updateWorkoutDayName(index, text)}
                        />
                        {w.exercises.map((exercise, exIndex) => (
                            <View key={exIndex} style={styles.exerciseGroup}>
                                <View style={styles.headersRow}>
                                    <Text style={styles.headers}>Exercise: </Text>
                                    <Pressable
                                    onPress={() => {
                                        setSelectedExerciseDay(index);
                                        setSelectedExerciseIndex(exIndex);
                                        setModalVisible(true);
                                    }}
                                    style={styles.exerciseNameSelector}
                                    >
                                    <Text style={styles.exerciseNameText}>
                                        {exercises.find((e) => e.id === exercise.exerciseId)?.name || 'Select Exercise'}
                                    </Text>
                                    </Pressable>
                                </View>                            
                                <View style={styles.headersRow}>
                                    {/* <Text style={styles.headers}>Exercises: </Text> */}
                                    <Text style={styles.headers}>Sets: </Text>
                                    <Text style={styles.headers}>Min Reps: </Text>
                                    <Text style={styles.headers}>Max Reps: </Text>
                                </View>
                                <View style={styles.exerciseRow}>
                                    <TextInput
                                        style={styles.exerciseInput}
                                        placeholder="Sets"
                                        keyboardType="numeric"
                                        value={String(exercise.sets)}
                                        onChangeText={(text) => updateExercise(index, exIndex, 'sets', text)}
                                    />
                                    <TextInput
                                        style={styles.exerciseInput}
                                        placeholder="Min Reps"
                                        keyboardType="numeric"
                                        value={exercise.reps.min?.toString() ?? ''}
                                        onChangeText={(text) => updateExercise(index, exIndex, 'minReps', text)}
                                    />
                                    <TextInput
                                        style={styles.exerciseInput}
                                        placeholder="Max Reps"
                                        keyboardType="numeric"
                                        value={exercise.reps.max?.toString() ?? ''}
                                        onChangeText={(text) => updateExercise(index, exIndex, 'maxReps', text)}
                                    />
                                </View>
                            </View>
                        ))}
                        <Pressable onPress={() => addExerciseRow(index)} style={styles.addButton}>
                            <Text style={styles.addText}>+ Add Exercise</Text>
                        </Pressable>
                        </View>                    
                    ))}
                    <Pressable onPress={addWorkoutDay} style={styles.addButton}>
                        <Text style={styles.addText}>+ Add Workout Day</Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
            <ExerciseSearchModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                exercises={exercises}
                onSelectExercise={handleExerciseSelect}
            />
            <SaveButton onPress={handleSave}/>
        </SafeAreaView>
    )
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
    title: {
        fontSize: 28,
        fontWeight: '600',
        color: 'white',
        alignSelf: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        margin: 12
    },
    description: {
        fontSize: 15,
        fontWeight: '600',
        color: 'white',
        alignSelf: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        marginVertical: 15,
    },
    label: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        width: '90%',
        backgroundColor: '#2C3237',
        color: 'white',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    addButton: {
        marginTop: 20,
    },
    addText: {
        color: '#4FD6EA',
        fontSize: 16,
        alignSelf: 'center'
    },
    workoutBox: {
        marginBottom: 20
    },
    workoutTitle: {
        fontSize: 25,
        fontWeight: '600',
        color: 'white',
        alignSelf: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        marginTop: 10,
        marginBottom: 10
    },
    headersRow: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10
    },
    headers: {
        width: '30%',
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 6
    },
    exerciseRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    exerciseText: {
        color: 'white',
        width: '30%',
        textAlign: 'center',
    },
    exerciseInput: {
        backgroundColor: '#333',
        color: 'white',
        padding: 8,
        borderRadius: 6,
        marginRight: 8,
        flex: 1,
        textAlign: 'center',
    },
    searchButton: {
        backgroundColor: '#2C3237',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginRight: 8,
        flex: 1,
        justifyContent: 'center',
      },
      searchButtonText: {
        color: 'white',
        textAlign: 'center',
      },
      
      modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      
      modalContent: {
        width: '85%',
        backgroundColor: '#1c1f23',
        padding: 20,
        borderRadius: 10,
      },
      
      searchInput: {
        backgroundColor: '#333',
        color: 'white',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
      },
      
      searchItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
      },
      
      searchItemText: {
        color: 'white',
        fontSize: 16,
      },
      
      modalCloseButton: {
        marginTop: 12,
        alignItems: 'center',
      },
      
      modalCloseText: {
        color: '#4FD6EA',
        fontSize: 16,
      },
      exerciseGroup: {
        marginBottom: 12,
        width: '100%',
      },
      
      exerciseNameSelector: {
        backgroundColor: '#2C3237',
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginBottom: 6,
        alignSelf: 'flex-start',
      },
      
      exerciseNameText: {
        color: 'white',
        fontSize: 16,
      },

})