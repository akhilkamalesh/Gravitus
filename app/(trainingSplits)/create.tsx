// app/(trainingSplits)/create.tsx
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text, Alert, View, TouchableOpacity, BackHandler, StyleSheet } from 'react-native';
import ExerciseSearchModal from '@/components/ExerciseSearchModal';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useCreateSplit } from '@/hooks/splits/useCreateSplit';
import CreateSplitHeader from '@/components/trainingSplits/CreateSplitHeader';
import WorkoutDayEditor from '@/components/trainingSplits/WorkoutDayEditor';
import ExerciseRowEditor from '@/components/trainingSplits/ExerciseRowEditor';
import SplitScheduleForm from '@/components/trainingSplits/SplitScheduleForm';
import SplitReview from '@/components/trainingSplits/SplitReview';
import Dropdown from '@/components/ui/Dropdown';
import SelectField from '@/components/ui/SelectField';

/**
 * CreateSplitScreen
 * @returns Multi-step Wizard for creating a training split.
 */
export default function CreateSplitScreen() {
  const router = useRouter();
  const {
    // form
    name, setName, description, setDescription,
    trainingStyle, setTrainingStyle,
    weeksDurationStr, setWeeksDurationStr,

    // schedule
    scheduledDays, setScheduledDays,
    daysPerCycleStr, setDaysPerCycleStr,

    // workouts
    workouts, addWorkoutDay, updateWorkoutDayName, updateWorkoutDaySchedule, addExerciseRow, removeExerciseRow, updateExerciseField, initializeWorkouts,

    // modal
    modalVisible, setModalVisible, searchQuery, setSearchQuery,
    exercises, openExercisePicker, handleExerciseSelect,

    // save
    saveSplit,
  } = useCreateSplit();

  const [step, setStep] = useState(1);

  // Constants


  // 1: Basic Info
  // 2: Schedule
  // 3+: Workouts (step 3 = day 1, step 4 = day 2...)
  // Last: Review

  // Validation Logic
  const validateStep1 = () => {
    if (!name.trim()) return 'Please enter a split name.';
    if (!description.trim()) return 'Please enter a description.';
    if (!weeksDurationStr.trim()) return 'Please enter duration.';
    if (!trainingStyle) return 'Please select a training style.';
    return null;
  };

  // Calculate total workout days needed
  // If user selected specific days, that count is the number of workout days.
  // If not, they add days manually. For now, let's assume if scheduledDays is set, we iterate those.
  // If scheduledDays is empty, maybe we ask how many days? Or just let them add dynamically in a step?
  // Requirement says: "If user does not enter in “day”, Gravitus will appropriately space it out on the calendar for you"
  // This implies if they skip schedule, they just define days (Day 1, Day 2).

  // Let's stick to the plan:
  // 1. Info
  // 2. Schedule (Pick days per week)
  //    -> If days picked (e.g. Mon, Wed, Fri), automatically initialize 3 workout days labeled Mon, Wed, Fri.
  //    -> If no days picked, ask "How many days/week?" or just start with 1 day and let user add.
  // 3. For each workout day in `workouts`, show an editor screen.
  // 4. Review.

  const currentWorkoutIdx = step - 3;
  const isWorkoutStep = currentWorkoutIdx >= 0 && currentWorkoutIdx < workouts.length;
  // Step logic: 1(Info) -> 2(Schedule) -> 3..N(Workouts) -> N+1(Review)
  const isReviewStep = step === 3 + workouts.length;

  const handleNext = () => {
    if (step === 1) {
      const error = validateStep1();
      if (error) { Alert.alert('Missing Info', error); return; }
      setStep(2);
    } else if (step === 2) {
      const daysCount = parseInt(daysPerCycleStr, 10);
      if (!daysCount || daysCount <= 0) {
        Alert.alert('Invalid Schedule', 'Please select at least 1 day per week.');
        return;
      }
      setStep(3);
    } else {
      // Workout Steps
      if (isWorkoutStep) {
        if (workouts[currentWorkoutIdx].exercises.length === 0) {
          Alert.alert('Empty Workout', 'Please add at least one exercise to this day before proceeding.');
          return;
        }
        // Move to next day or review
        // If we are at the last workout index, go to review.
        if (currentWorkoutIdx === workouts.length - 1) {
          setStep(step + 1);
        } else {
          setStep(step + 1);
        }
      } else {
        // Should not happen easily unless logic drift
        setStep(step + 1);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      Alert.alert('Exit', 'Are you sure you want to exit? Unsaved changes will be lost.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Exit', style: 'destructive', onPress: () => router.back() }
      ]);
    }
  };

  // Override back button
  React.useEffect(() => {
    const backAction = () => {
      handleBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [step]);


  // Derive current view
  // Step 1: Info
  // Step 2: Schedule
  // Step 3 to 3+N-1: Workout Days
  // Step 3+N: Review (where N = workouts.length)

  // Actually, keeping step numbers aligned with array indices is tricky if array grows.
  // Let's use specific "Pages".
  // Page 'INFO' | 'SCHEDULE' | 'WORKOUT_i' | 'REVIEW'

  // To keep it simple with existing state integer:
  // 1 = Info
  // 2 = Schedule
  // 3 ... 2+workouts.length = Workouts (Index = step - 3)
  // 3+workouts.length = Review

  // Special case: If workouts.length changed (user added day), the generic logic holds.

  const onNextPress = () => {
    // Step 2 Logic -> Initialize Workouts if needed
    if (step === 2) {
      const daysCount = parseInt(daysPerCycleStr, 10);

      // Validation: If scheduledDays selected, MUST match daysCount
      if (scheduledDays.length > 0 && scheduledDays.length !== daysCount) {
        Alert.alert(
          'Schedule Mismatch',
          `You selected ${scheduledDays.length} specific days but set "Days per week" to ${daysCount}. Please adjust one to match.`
        );
        return;
      }

      // Initialize Workouts
      initializeWorkouts(daysCount, scheduledDays);
    }

    // Check Workout Steps
    if (isWorkoutStep) {
      if (workouts[currentWorkoutIdx].exercises.length === 0) {
        Alert.alert('Empty Workout', 'Please add at least one exercise to this day before proceeding.');
        return;
      }
      // Proceed to next step
      setStep(step + 1);
      return; // Handled
    }

    handleNext();
  }

  // Constants
  const TRAINING_STYLES = ['bodybuilding', 'powerlifting', 'crossfit', 'running'];

  // ... (Hooks and Logic same as before) ...

  // Validation Logic (Same)

  // ... (Step Logic Same) ...

  const renderContent = () => {
    if (step === 1) {
      return (
        <View style={styles.contentContainer}>
          <Text style={styles.screenTitle}>Basic Info</Text>
          <Text style={styles.screenSubtitle}>Let's start with the basics.</Text>

          <CreateSplitHeader
            name={name} setName={setName}
            description={description} setDescription={setDescription}
            weeksDurationStr={weeksDurationStr} setWeeksDurationStr={setWeeksDurationStr}
          />

          <View style={styles.inputSection}>
            <Text style={styles.label}>TRAINING STYLE</Text>
            <Dropdown
              data={TRAINING_STYLES}
              value={trainingStyle}
              onSelect={setTrainingStyle}
              placeholder="Select style"
            />
          </View>
        </View>
      );
    }

    if (step === 2) {
      return (
        <View style={styles.contentContainer}>
          <Text style={styles.screenTitle}>Schedule</Text>
          <Text style={styles.screenSubtitle}>Define your weekly routine.</Text>
          <SplitScheduleForm
            selectedDays={scheduledDays}
            onChange={setScheduledDays}
            daysPerCycle={daysPerCycleStr}
            onChangeDaysPerCycle={setDaysPerCycleStr}
          />
        </View>
      );
    }

    if (isWorkoutStep) {
      const w = workouts[currentWorkoutIdx];
      const dayLabel = scheduledDays[currentWorkoutIdx] || `Day ${currentWorkoutIdx + 1} `;

      return (
        <View style={styles.contentContainer}>
          <Text style={styles.screenTitle}>Build Workout</Text>
          <Text style={styles.screenSubtitle}>Configure exercises for {dayLabel}.</Text>

          <WorkoutDayEditor
            index={currentWorkoutIdx}
            value={w.dayName}
            onChangeName={(v) => updateWorkoutDayName(currentWorkoutIdx, v)}

            onAddExercise={() => addExerciseRow(currentWorkoutIdx)}
            placeholder={dayLabel}
          >
            {w.exercises.map((ex, exIdx) => {
              const exName = exercises.find(e => e.id === ex.exerciseId)?.name ?? '';
              return (
                <ExerciseRowEditor
                  key={`${currentWorkoutIdx}-${exIdx}`}
                  name={exName}
                  onPick={() => openExercisePicker(currentWorkoutIdx, exIdx)}
                  sets={ex.sets}
                  minReps={ex.reps?.min ?? 0}
                  maxReps={ex.reps?.max ?? 0}
                  rpe={ex.rpe}
                  onChangeSets={(t) => updateExerciseField(currentWorkoutIdx, exIdx, 'sets', t)}
                  onChangeMin={(t) => updateExerciseField(currentWorkoutIdx, exIdx, 'minReps', t)}
                  onChangeMax={(t) => updateExerciseField(currentWorkoutIdx, exIdx, 'maxReps', t)}
                  onChangeRpe={(t) => updateExerciseField(currentWorkoutIdx, exIdx, 'rpe', t)}
                  onRemove={() => removeExerciseRow(currentWorkoutIdx, exIdx)}
                />
              );
            })}
          </WorkoutDayEditor>
        </View>
      );
    }

    if (isReviewStep) {
      return (
        <View style={styles.contentContainer}>
          <Text style={styles.screenTitle}>Review Split</Text>
          <Text style={styles.screenSubtitle}>Confirm your details below.</Text>
          <SplitReview
            name={name}
            description={description}
            trainingStyle={trainingStyle}
            weeksDuration={Number(weeksDurationStr)}
            workouts={workouts}
            exercises={exercises}
          />
        </View>
      );
    }

    return <Text style={{ color: 'white' }}>Unknown Step</Text>
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          Step {step === 1 ? 1 : step === 2 ? 2 : isReviewStep ? 4 : 3} of 4
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {renderContent()}
      </ScrollView>

      <View style={styles.footer}>
        {isReviewStep ? (
          <PrimaryButton
            label="Save Split"
            onPress={async () => {
              // ... Save Logic ...
              try {
                Alert.alert('Save Split', 'Are you sure you want to save this split?', [
                  { text: 'Cancel' },
                  {
                    text: 'Save', onPress: async () => {
                      const id = await saveSplit();
                      Alert.alert('Success', `Split saved!`);
                      router.push('/');
                    }
                  }
                ]);
              } catch (e: any) {
                Alert.alert('Error', e?.message ?? 'Failed to save split.');
              }
            }} />
        ) : (
          <PrimaryButton
            label={step === 1 ? 'Next: Schedule' : step === 2 ? 'Next: Workouts' : 'Next'}
            onPress={onNextPress}
          // style not needed as PrimaryButton has constraints, we just place it in footer
          />
        )}
      </View>

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
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  backButton: {
    padding: 10,
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 14,
    paddingBottom: 120, // Enough space for footer
  },
  contentContainer: {
    width: '100%',
    paddingHorizontal: 0,
    // alignItems: 'center', // Centering content generally, but inner components handle left text
  },
  screenTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center', // Title centered or left? User said "Match design patterns". Most screens have Centered Header Title in Create.
    // Wait, "Let's left align the text entries." but Headers usually centered?
    // User said "Let's add a title to each screen".
    // Let's keep Screen Title Left Aligned for consistency with "Left align text entries"?
    // Actually, standard iOS/App headers are centered, page titles are left.
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
  },
  screenSubtitle: {
    color: '#888',
    fontSize: 16,
    marginBottom: 20,
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
  },
  inputSection: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  label: {
    color: '#888',
    fontSize: 12,
    marginBottom: 5,
    fontWeight: '600'
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    paddingHorizontal: 20, // Add padding for PrimaryButton
  },
  nextButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
  }
});