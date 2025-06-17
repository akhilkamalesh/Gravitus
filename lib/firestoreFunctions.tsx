import { firestoreInstance } from "./firebase";
import { collection, getDoc, setDoc, getDocs, addDoc, updateDoc, doc, serverTimestamp } from "@react-native-firebase/firestore";
import { Exercise, ExerciseLog } from "@/types/firestoreTypes";
import auth from '@react-native-firebase/auth'
import { Split } from "@/types/firestoreTypes";

// Loads all exercises from the database
export const getExercises = async (): Promise<Exercise[]> => {
    try{
        const snapshot = await getDocs(firestoreInstance.collection('exercises'));
        const exercises: Exercise[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as Exercise[];

        return exercises;
    }
    catch (error) {
        console.error('Error fetching exercises:', error);
        return [];
    }
}

// Loads splits based off ID
export const getSplit = async (splitId: string): Promise<Split | null> => {
    try {
        const docRef = firestoreInstance.collection('splitTemplates').doc(splitId);
        const docSnap = await docRef.get();
    
        if (docSnap) {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            ...data,
          } as Split;
        } else {
          console.warn('Split not found');
        }
      } catch (error) {
        console.error('Error fetching split:', error);
      }

    return null;
};

// TODO: Create function that loads full split information including exercises information
export const getSplitInformation = async (split: Split): Promise <Split> => {
  const resolvedWorkouts = await Promise.all(
    split.workouts.map(async (workout) => {
      const enrichedExercises = await Promise.all(
        workout.exercises.map(async (exercise) => {
          const docRef = firestoreInstance.collection('exercises').doc(exercise.exerciseId);
          const docSnap = await getDoc(docRef);
          return {
            ...exercise,
            exerciseData: docSnap.exists() ? (docSnap.data() as Exercise) : undefined
          };
        })
      )

      return {
        ...workout,
        exercises: enrichedExercises,
      };

    })
  )
  return {
    ...split,
    workouts: resolvedWorkouts,
  };
}

// Save split to user
export const saveSplitToUser = async (split: Split) => {
  const user = auth().currentUser;
  if(!user) throw new Error("User not logged in") // This error should never happen

  const { id, ...splitData } = split;

  const newSplit = {
    ...splitData,
    createdAt: serverTimestamp(),
    createdFromTemplateId: id, // track source
  };

  const userSplitsRef = collection(firestoreInstance, 'users', user.uid, 'splits');
  const docRef = await addDoc(userSplitsRef, newSplit);

  return docRef.id; // return new splitId
};

// Save splitId to currentSplitId attribute under user
export const updateCurrentSplit = async (splitId: string) => {
  const user = auth().currentUser;
  if (!user) throw new Error('User not authenticated');

  const userDocRef = doc(firestoreInstance, 'users', user.uid);
  await updateDoc(userDocRef, {
    currentSplitId: splitId,
  });
};

// Retrieves the current split
export const getCurrentSplit = async (): Promise<Split | null> => {
  const user = auth().currentUser;
  if (!user) throw new Error('User not authenticated');

  // Step 1: Get currentSplitId from user document
  const userDocRef = doc(firestoreInstance, 'users', user.uid);
  const userSnap = await getDoc(userDocRef);
  const userData = userSnap.data();

  const currentSplitId = userData?.currentSplitId;
  if (!currentSplitId) return null;

  // Step 2: Fetch the actual split
  const splitDocRef = doc(firestoreInstance, 'users', user.uid, 'splits', currentSplitId);
  const splitSnap = await getDoc(splitDocRef);

  if (!splitSnap.exists()) return null;
  return { id: splitSnap.id, ...splitSnap.data() } as Split;
};

// Gets todays workout
export const getTodayWorkout = async (): Promise<{ split: Split; workout: any } | null> => {
  const user = auth().currentUser;
  if (!user) throw new Error('User not authenticated');

  // Get user document
  const userDocRef = doc(firestoreInstance, 'users', user.uid);
  const userSnap = await getDoc(userDocRef);
  const userData = userSnap.data();

  const splitId = userData?.currentSplitId;
  const currentDayIndex = userData?.currentDayIndex || 0;
  if (!splitId) return null;

  // Get current split
  const splitDocRef = doc(firestoreInstance, 'users', user.uid, 'splits', splitId);
  const splitSnap = await getDoc(splitDocRef);
  const split = { id: splitSnap.id, ...splitSnap.data() } as Split;

  const workout = split.workouts[(currentDayIndex % split.workouts.length)];
  return { split, workout };
};

// Increment Day Index (want to keep the actual number and modulate in the previous function)
export const incrementDayIndex = async () => {
  const user = auth().currentUser;
  if (!user) throw new Error('User not authenticated');

  const userRef = doc(firestoreInstance, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  const currentIndex = userSnap.data()?.currentDayIndex ?? 0;

  const nextIndex = (currentIndex + 1);
  await updateDoc(userRef, { currentDayIndex: nextIndex });
};

// Reset Day Index (when switching to another split)
export const resetDayIndex = async () => {
  const user = auth().currentUser;
  if (!user) throw new Error('User not authenticated');

  const userRef = doc(firestoreInstance, 'users', user.uid);
  await updateDoc(userRef, {currentDayIndex: 0});
}

// Log workout for the day
export const logWorkout = async (exerciseLog: ExerciseLog) => {
  const user = auth().currentUser;
  if (!user) throw new Error('User not authenticated');

  const logsRef = collection(firestoreInstance, 'users', user.uid, 'logs');
  const newDocRef = doc(logsRef)

  const logWithId = {
    ...exerciseLog,
    id: newDocRef.id
  }

  await setDoc(newDocRef, logWithId);
};

// Grabs all logged workouts from a user (should include some type of limit)
// TODO: Need to grab in descending date order
export const getLoggedWorkouts = async (): Promise<ExerciseLog[]> => {
  const user = auth().currentUser;
  if (!user) throw new Error('User not authenticated');

  // Going to log collection
  const logsRef = collection(firestoreInstance, 'users', user.uid, 'logs');
  const snapshot = await getDocs(logsRef);

  const logs: ExerciseLog[] = snapshot.docs.map((log) => ({
    ...log.data(),
  })) as ExerciseLog[];

  return logs;
}

// Gets split information based on SplitID
export const getSplitBySplitId = async (splitId:string): Promise<Split | null> => {
  const user = auth().currentUser;
  if (!user) throw new Error('User not authenticated');

  const splitRef = doc(firestoreInstance, 'users', user.uid, 'splits', splitId);
  const splitSnap = await getDoc(splitRef);

  if(!splitSnap){
    console.error('Split does not exist')
    return null;
  }

  const split = { id: splitSnap.id, ...splitSnap.data() } as Split;

  return split;
}