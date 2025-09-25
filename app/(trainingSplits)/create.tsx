// app/(trainingSplits)/create.tsx
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text, Alert } from 'react-native';
import GravitusHeader from '@/components/GravitusHeader';
import FloatingCard from '@/components/floatingbox';
import SaveButton from '@/components/SaveButton';
import ExerciseSearchModal from '@/components/ExerciseSearchModal';
import { useRouter } from 'expo-router';

import { useCreateSplit } from '@/hooks/splits/useCreateSplit';
import CreateSplitHeader from '@/components/trainingSplits/CreateSplitHeader';
import WorkoutDayEditor from '@/components/trainingSplits/WorkoutDayEditor';
import ExerciseRowEditor from '@/components/trainingSplits/ExerciseRowEditor';

/**
 * CreateSplitScreen
 * @returns Screen for creating a training split, including form inputs, workout day editors, and exercise pickers.
 */
export default function CreateSplitScreen() {
  const router = useRouter();
  const {
    // form
    name, setName, description, setDescription,
    weeksDurationStr, setWeeksDurationStr,
    // workouts
    workouts, addWorkoutDay, updateWorkoutDayName, addExerciseRow, updateExerciseField,
    // modal
    modalVisible, setModalVisible, searchQuery, setSearchQuery,
    exercises, openExercisePicker, handleExerciseSelect,
    // save
    saveSplit,
  } = useCreateSplit();

  const confirm = (title: string, message: string, onYes: () => void) =>
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', style: 'destructive', onPress: onYes },
    ]);

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:'#121417' }}>
      <GravitusHeader showBackButton />
      <CreateSplitHeader
        name={name} setName={setName}
        description={description} setDescription={setDescription}
        weeksDurationStr={weeksDurationStr} setWeeksDurationStr={setWeeksDurationStr}
      />

      <ScrollView contentContainerStyle={{ alignItems:'center', paddingVertical:14 }} keyboardShouldPersistTaps="handled">
        {workouts.map((w, dayIdx) => (
          <WorkoutDayEditor
            key={dayIdx}
            index={dayIdx}
            value={w.dayName}
            onChangeName={(v) => updateWorkoutDayName(dayIdx, v)}
            onAddExercise={() => addExerciseRow(dayIdx)}
          >
            {w.exercises.map((ex, exIdx) => {
              const exName = exercises.find(e => e.id === ex.exerciseId)?.name ?? '';
              return (
                <ExerciseRowEditor
                  key={`${dayIdx}-${exIdx}`}
                  name={exName}
                  onPick={() => openExercisePicker(dayIdx, exIdx)}
                  sets={ex.sets}
                  minReps={ex.reps?.min ?? 0}
                  maxReps={ex.reps?.max ?? 0}
                  onChangeSets={(t) => updateExerciseField(dayIdx, exIdx, 'sets', t)}
                  onChangeMin={(t) => updateExerciseField(dayIdx, exIdx, 'minReps', t)}
                  onChangeMax={(t) => updateExerciseField(dayIdx, exIdx, 'maxReps', t)}
                />
              );
            })}
          </WorkoutDayEditor>
        ))}

        <FloatingCard width="90%" height={50} onPress={addWorkoutDay}>
          <Text style={{ color:'#4FD6EA', fontSize:16, alignSelf:'center' }}>+ Add Workout Day</Text>
        </FloatingCard>
      </ScrollView>

      <ExerciseSearchModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        exercises={exercises}
        onSelectExercise={handleExerciseSelect}
      />

      <SaveButton onPress={async () => {
        try {
          confirm('Save Split', 'Are you sure you want to save this split?', async () => {
            const id = await saveSplit();
            Alert.alert('Success', `Split saved with ID: ${id}`);
            router.push('/');
          });
        } catch (e: any) {
          Alert.alert('Error', e?.message ?? 'Failed to save split.');
        }
      }} />
    </SafeAreaView>
  );
}