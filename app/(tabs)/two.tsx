// app/(workout)/TodayWorkoutScreen.tsx
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GravitusHeader from '@/components/GravitusHeader';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ExerciseSearchModal from '@/components/ExerciseSearchModal';
import WorkoutCompleteModal from '@/components/CompleteModal';
import ExerciseCard from '@/components/ExerciseCard';
import FloatingCard from '@/components/floatingbox';
import SectionHeader from '@/components/SectionHeader';
import HistoryModal from '@/components/HistoryModal';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useTodayWorkout } from '@/hooks/workout/useTodayWorkout';
import { usePlaceholders } from '@/hooks/workout/usePlaceholders';
import { useWorkoutEdits } from '@/hooks/workout/useWorkoutEdits';
import templateWorkouts from '@/data/templateWorkouts.json';
import { TemplateWorkout } from '@/types/firestoreTypes';
import { Ionicons } from '@expo/vector-icons';

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
  const [saving, setSaving] = useState(false);

  // History Modal State
  const [historyVisible, setHistoryVisible] = useState(false);
  const [historyExercise, setHistoryExercise] = useState<{ id: string, name: string } | null>(null);

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

  const handleSave = async () => {
    if (!canEdit) return;
    try {
      setSaving(true);
      await saveWorkout();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  // Open modal whenever the workout becomes done
  useEffect(() => {
    if (isDone) setShowCompleteModal(true);
  }, [isDone]);

  // If no split is active, show "Try New Workout" screen
  if (!split) {
    const recommended = (templateWorkouts as TemplateWorkout[])[0]; // Simple recommendation for now

    return (
      <SafeAreaView style={styles.container}>
        <GravitusHeader
          showBackButton={false} // Root tab, no back button
        />

        {/* Left Aligned Header matching Index.tsx */}
        <View style={{ paddingHorizontal: '5%' }}>
          <Text style={{ fontSize: 32, fontWeight: '700', color: '#fff', marginTop: 12 }}>
            No Active Plan
          </Text>
          <Text style={{ fontSize: 16, color: '#666', marginTop: 4 }}>
            Start a new workout or try a template.
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.emptyContainer}>

          {/* Start from Scratch Card */}
          <FloatingCard
            width="90%"
            onPress={() => tryNewWorkout()}
            style={{
              marginBottom: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <View>
              <Text style={styles.cardTitle}>Start Empty Workout</Text>
              <Text style={styles.cardDesc}>Log a session without a template</Text>
            </View>
            <Ionicons name="add-circle-outline" size={32} color="#4FD6EA" />
          </FloatingCard>

          <SectionHeader title="Recommended For You" />

          {/* Recommended Template Card */}
          <FloatingCard
            width="90%"
            onPress={() => tryNewWorkout(recommended)}
            style={{ marginBottom: 20 }}
          >
            <View>
              <Text style={styles.cardTitle}>{recommended.name}</Text>
              <Text style={styles.cardSubtitle}>{recommended.estimatedDuration} min • {recommended.experienceLevel}</Text>
              <Text style={styles.cardDesc}>{recommended.description}</Text>
            </View>
          </FloatingCard>

          {/* Fallback to browse */}
          <Pressable onPress={() => { /* TODO: Browse templates Modal */ }}>
            <Text style={styles.linkText}>Browse All Templates</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <GravitusHeader
        showEditButton
        onTryNewWorkout={tryNewWorkout}
        onChangeSplit={() => router.push('../(trainingSplits)/trainingSplits')}
        onSkipWorkout={async () => { await skipWorkout(); }}
      />
      <WorkoutCompleteModal visible={showCompleteModal} onClose={() => { setShowCompleteModal(false) }} />

      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>
          Today’s Workout: {workout?.dayName}
        </Text>
        <Text style={styles.headerSubtitle}>{split?.name}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {workout?.exercises.map((ex, exIndex) => (
          <ExerciseCard
            key={ex.instanceId ?? `${ex.exerciseId}-${exIndex}`}
            exercise={ex}
            exIndex={exIndex}
            sets={log?.exercises.find(e => e.instanceId === ex.instanceId)?.sets ?? log?.exercises[exIndex]?.sets ?? []}
            placeholders={placeholders[ex.exerciseId] ?? []}
            onDelete={() => { if (canEdit) deleteExercise(exIndex) }}
            onAddSet={() => addSet(exIndex)}
            onRemoveSet={() => removeSet(exIndex)}
            onUpdateSet={(setIdx, field, val) => updateSet(exIndex, setIdx, field, Number(val))}
            onOpenHistory={() => {
              setHistoryExercise({ id: ex.exerciseId, name: ex.exerciseData?.name ?? 'Exercise' });
              setHistoryVisible(true);
            }}
          />
        ))}

        <Pressable
          style={[styles.addExerciseButton, { opacity: canEdit ? 1 : 0.5 }]}
          onPress={() => { if (canEdit) setModalVisible(true); }}
        >
          <Text style={styles.addExerciseText}>+ Add Exercise</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="Save Workout"
          onPress={handleSave}
          loading={saving}
          disabled={!canEdit}
        />
      </View>

      <ExerciseSearchModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        exercises={exercises}
        onSelectExercise={onSelectExercise}
      />

      <HistoryModal
        visible={historyVisible}
        onClose={() => setHistoryVisible(false)}
        exerciseId={historyExercise?.id ?? ''}
        exerciseName={historyExercise?.name ?? ''}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerContainer: {
    marginVertical: 12,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#4FD6EA',
    fontSize: 16,
  },
  scrollContent: {
    paddingVertical: 24,
    paddingBottom: 100,
  },
  addExerciseButton: {
    marginTop: 10,
    marginBottom: 30,
    alignSelf: 'center',
  },
  addExerciseText: {
    color: '#4FD6EA',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  // Empty State Styles
  emptyContainer: {
    paddingBottom: 48,
    // Removed justifyContent: 'center' to allow top alignment
    alignItems: 'center', // Keep items centered horizontally if desired, or remove for full width
  },
  // sectionHeader style kept for local usage or could be replaced by component
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#4FD6EA',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 14,
    color: '#aaa',
  },
  linkText: {
    color: '#4FD6EA',
    fontSize: 16,
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});