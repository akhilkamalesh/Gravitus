// app/(workout)/TodayWorkoutScreen.tsx
// TODO: Needs documentation
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GravitusHeader from '@/components/GravitusHeader';
import SaveButton from '@/components/SaveButton';
import ExerciseSearchModal from '@/components/ExerciseSearchModal';
import WorkoutCompleteModal from '@/components/CompleteModal';
import ExerciseCard from '@/components/ExerciseCard';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useTodayWorkout } from '@/hooks/workout/useTodayWorkout';
import { usePlaceholders } from '@/hooks/workout/usePlaceholders';
import { useWorkoutEdits } from '@/hooks/workout/useWorkoutEdits';

export default function TodayWorkoutScreen() {
  const router = useRouter();
  const {
    split, workout, setWorkout, log, setLog, exercises,
    isDone, setIsDone, tryNewWorkout, skipWorkout, saveWorkout
  } = useTodayWorkout();

  const placeholders = usePlaceholders(log);
  const { addExercise, deleteExercise, addSet, removeSet, updateSet } =
    useWorkoutEdits(workout, log, setWorkout, setLog);

  const [modalVisible, setModalVisible] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const canEdit = Boolean(workout && log && !isDone);

  const onSelectExercise = (exerciseId: string) => {
    try {
      if (!canEdit) return;
      const selected = exercises.find(e => e.id === exerciseId);
      if (!selected) return;
      addExercise(selected);
    } finally {
      setModalVisible(false);
      setSearchQuery('');
    }
  };

  // Open modal whenever the workout becomes done
  useEffect(() => {
    if (isDone) setShowCompleteModal(true);
  }, [isDone]);


  return (
    <SafeAreaView style={{flex:1, backgroundColor:'#121417'}}>
      <GravitusHeader
        showEditButton
        onTryNewWorkout={tryNewWorkout}
        onChangeSplit={() => router.push('../(trainingSplits)/trainingSplits')}
        onSkipWorkout={async () => { await skipWorkout(); }}
      />
      <WorkoutCompleteModal visible={showCompleteModal} onClose={()=>{setShowCompleteModal(false)}} />

      <Text style={{color:'white', fontSize:30, fontWeight:'600', textAlign:'center', margin:12}}>
        Today’s Workout: {workout?.dayName}
      </Text>
      <Text style={{color:'#4FD6EA', fontSize:14, alignSelf:'center'}}>{split?.name}</Text>

      <ScrollView contentContainerStyle={{alignItems:'center', paddingVertical:24}}>
        {workout?.exercises.map((ex, exIndex) => (
          <ExerciseCard
            key={`${ex.exerciseId}-${exIndex}`}
            exercise={ex}
            exIndex={exIndex}
            sets={log?.exercises[exIndex]?.sets ?? []}
            placeholders={placeholders[ex.exerciseId] ?? []}
            onDelete={() => deleteExercise(exIndex)}
            onAddSet={() => addSet(exIndex)}
            onRemoveSet={() => removeSet(exIndex)}
            onUpdateSet={(setIdx, field, val) => updateSet(exIndex, setIdx, field, Number(val))}
          />
        ))}
        <Pressable
          style={{marginTop:20, opacity: canEdit ? 1 : 0.5}}
          onPress={() => { if (canEdit) setModalVisible(true); }}
        >
          <Text style={{color:'#4FD6EA', fontSize:16, alignSelf:'center'}}>+ Add Exercise</Text>
        </Pressable>
      </ScrollView>

      {/*TODo: Need to check if canEdit is false */}
      <SaveButton onPress={async () => { try { if(canEdit) { await saveWorkout();} } catch (e:any) { alert(e.message); } }} />

      <ExerciseSearchModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        exercises={exercises}
        onSelectExercise={onSelectExercise}
      />
    </SafeAreaView>
  );
}