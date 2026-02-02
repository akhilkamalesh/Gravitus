// app/(workout)/TodayWorkoutScreen.tsx
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GravitusHeader from '@/components/GravitusHeader';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ExerciseSearchModal from '@/components/ExerciseSearchModal';
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
    isDone, setIsDone, tryNewWorkout, skipWorkout, saveWorkout, isRestDay
  } = useTodayWorkout();

  const placeholders = usePlaceholders(log);
  const { addExercise, deleteExercise, addSet, removeSet, updateSet, updateNotes } =
    useWorkoutEdits(workout, log, setWorkout, setLog);

  /* New State for Post-Workout View */
  type ViewMode = 'active' | 'menu' | 'past' | 'next';
  const [viewMode, setViewMode] = useState<ViewMode>('active');
  const [pastLog, setPastLog] = useState<any>(null);

  // Sync isDone to viewMode
  useEffect(() => {
    if (isDone && viewMode === 'active') {
      setViewMode('menu');
      // Load past log for "Today's Workout" view
      import('@/lib/firestoreFunctions').then(mod => {
        mod.getPrevWorkoutStat().then(log => {
          setPastLog(log);
        });
      });
    } else if (!isDone) {
      setViewMode('active');
    }
  }, [isDone]);

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

    // Validation: Ensure all exercises have been logged
    const allLogged = workout?.exercises.every((ex, index) => {
      const logEntry = log?.exercises.find(e => e.instanceId === ex.instanceId) ?? log?.exercises[index];
      if (!logEntry) return false;
      // Check if at least one set is completed (weight > 0 && reps > 0)
      // Or checking if the user has inputted anything at all. 
      // Let's go with: has at least one set where reps > 0 (weight could be 0 for bodyweight?)
      // Adjust validation stringency as needed.
      return logEntry.sets.some(s => s.reps > 0 && s.weight >= 0);
    });

    if (!allLogged) {
      alert("Not all exercises have been logged. Please complete all exercises before saving.");
      return;
    }

    try {
      setSaving(true);
      await saveWorkout();
      // Success confirmation
      // The requirement says: "When a user saves their workout -> Then the system should display a confirmation message"
      // We can use Alert for native feel or a custom modal. Using Alert for now as per "message".
      alert("Workout has been saved successfully!");

    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };



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

  // --- Render Functions for Completed State ---

  const renderMenu = () => (
    <View style={styles.menuContainer}>
      <View style={{ alignItems: 'center', marginBottom: 40 }}>
        <Ionicons name="checkmark-circle" size={80} color="#4FD6EA" style={{ marginBottom: 16 }} />
        <Text style={styles.menuTitle}>Workout Completed!</Text>
        <Text style={styles.menuSubtitle}>Good job. What's next?</Text>
      </View>

      <FloatingCard
        width="100%"
        onPress={() => setViewMode('past')}
        style={{ marginBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <View>
          <Text style={styles.cardTitle}>View Today's Workout</Text>
          <Text style={styles.cardDesc}>Review your performance</Text>
        </View>
        <Ionicons name="eye-outline" size={24} color="#4FD6EA" />
      </FloatingCard>

      <FloatingCard
        width="100%"
        onPress={() => setViewMode('next')}
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <View>
          <Text style={styles.cardTitle}>View Tomorrow's Workout</Text>
          <Text style={styles.cardDesc}>Prepare for your next session</Text>
        </View>
        <Ionicons name="calendar-outline" size={24} color="#4FD6EA" />
      </FloatingCard>
    </View>
  );

  const renderWorkoutView = (isPast: boolean) => {
    // If viewing past, we use pastLog and hydrating data from 'exercises'
    // If viewing next (isDone + active/next), we use 'workout' and 'log' (which are freshly loaded for tomorrow)

    // Determine which data to use
    let displayExercises: any[] = [];
    if (isPast) {
      if (!pastLog) return <Text style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>Loading past workout...</Text>;
      displayExercises = pastLog.exercises.map((logEx: any, i: number) => {
        const exData = exercises.find(e => e.id === logEx.exerciseId);
        return {
          instanceId: logEx.instanceId ?? `past-${i}`,
          exerciseId: logEx.exerciseId,
          exerciseData: exData,
          sets: logEx.sets, // for rendering loop
          notes: logEx.notes
        };
      });
    } else {
      // Future
      displayExercises = workout?.exercises.map((ex, index) => {
        const logEntry = log?.exercises.find(e => e.instanceId === ex.instanceId) ?? log?.exercises[index];
        return {
          ...ex,
          sets: logEntry?.sets ?? [],
          notes: logEntry?.notes
        }
      }) ?? [];
    }

    const title = isPast ? "Today's Workout" : "Tomorrow's Workout";
    const sub = isPast ? "Completed" : split.name;

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerSubtitle}>{sub}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {displayExercises.map((ex, i) => (
            <ExerciseCard
              key={i}
              exercise={isPast ? { ...ex, reps: { min: 0, max: 0 } /* dummy */ } : ex} // ExerciseCard needs workoutExercise type
              exIndex={i}
              sets={ex.sets}
              notes={ex.notes}
              // placeholders={placeholders[ex.exerciseId] ?? []} // Optional for view modes
              readOnly={true}
              onDelete={() => { }}
              onAddSet={() => { }}
              onRemoveSet={() => { }}
              onUpdateSet={() => { }}
              onUpdateNotes={() => { }}
              onOpenHistory={() => { }}
            />
          ))}
          {/* Back Button if in menu flow */}
          <Pressable style={styles.backButton} onPress={() => setViewMode('menu')}>
            <Text style={styles.backButtonText}>Back to Options</Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  };

  // Main Render Helper
  const renderContent = () => {
    if (viewMode === 'menu') return renderMenu();
    if (viewMode === 'past') return renderWorkoutView(true);
    if (viewMode === 'next') return renderWorkoutView(false);

    // Rest Day View
    if (isRestDay) {
      return (
        <View style={styles.menuContainer}>
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <Ionicons name="moon" size={80} color="#4FD6EA" style={{ marginBottom: 16 }} />
            <Text style={styles.menuTitle}>Rest Day</Text>
            <Text style={styles.menuSubtitle}>No workout scheduled for today.</Text>
          </View>

          {/* View Next Workout */}
          <FloatingCard
            width="100%"
            onPress={() => setViewMode('next')}
            style={{ marginBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <View>
              <Text style={styles.cardTitle}>View Next Workout</Text>
              <Text style={styles.cardDesc}>See what's coming up</Text>
            </View>
            <Ionicons name="calendar-outline" size={24} color="#4FD6EA" />
          </FloatingCard>

          {/* Start Empty */}
          <FloatingCard
            width="100%"
            onPress={() => tryNewWorkout()}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <View>
              <Text style={styles.cardTitle}>Start Empty Workout</Text>
              <Text style={styles.cardDesc}>Log a session anyway</Text>
            </View>
            <Ionicons name="add-circle-outline" size={24} color="#4FD6EA" />
          </FloatingCard>
        </View>
      )
    }

    // Default Active Render
    return (
      <>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>
            Today’s Workout: {workout?.dayName}
          </Text>
          <Text style={styles.headerSubtitle}>{split?.name}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {workout?.exercises.map((ex, exIndex) => {
            const logEntry = log?.exercises.find(e => e.instanceId === ex.instanceId) ?? log?.exercises[exIndex];
            return (
              <ExerciseCard
                key={ex.instanceId ?? `${ex.exerciseId}-${exIndex}`}
                exercise={ex}
                exIndex={exIndex}
                sets={logEntry?.sets ?? []}
                notes={logEntry?.notes}
                placeholders={placeholders[ex.exerciseId] ?? []}
                onDelete={() => { if (canEdit) deleteExercise(exIndex) }}
                onAddSet={() => addSet(exIndex)}
                onRemoveSet={() => removeSet(exIndex)}
                onUpdateSet={(setIdx, field, val) => updateSet(exIndex, setIdx, field, Number(val))}
                onUpdateNotes={(text) => updateNotes(exIndex, text)}
                onOpenHistory={() => {
                  setHistoryExercise({ id: ex.exerciseId, name: ex.exerciseData?.name ?? 'Exercise' });
                  setHistoryVisible(true);
                }}
              />
            );
          })}

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
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <GravitusHeader
        showEditButton={!isDone}
        onTryNewWorkout={tryNewWorkout}
        onChangeSplit={() => router.push('../(trainingSplits)/trainingSplits')}
        onSkipWorkout={async () => { await skipWorkout(); }}
      />
      {/* Complete Modal Removed in favor of viewMode */}

      {renderContent()}

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
  // ... existing styles
  linkText: {
    color: '#4FD6EA',
    fontSize: 16,
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'black', // Ensure black background
  },
  menuTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  menuSubtitle: {
    color: '#aaa',
    fontSize: 18,
    marginBottom: 40,
    textAlign: 'center',
  },
  backButton: {
    alignSelf: 'center',
    marginTop: 20,
    padding: 10,
  },
  backButtonText: {
    color: '#4FD6EA',
    fontSize: 16,
  },
});