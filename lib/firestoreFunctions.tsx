import { firestoreInstance, authInstance } from "./firebase";
import { collection, getDoc, setDoc, getDocs, addDoc, updateDoc, doc, serverTimestamp, query, orderBy, where, limit } from "@react-native-firebase/firestore";
import { Exercise, ExerciseLog, ExerciseStat } from "@/types/firestoreTypes";
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

// Gets Exercise Based off ID
export const getExerciseByID = async (id: string): Promise<Exercise> => {
  const docRef = doc(firestoreInstance, 'exercises', id);
  const snapshot = await getDoc(docRef)

  if (!snapshot.exists()) {
    throw new Error('Exercise not found');
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Exercise;
  
}


// Loads splits based off ID (only for splitTemplates)
export const getSplit = async (splitId: string): Promise<Split | null> => {
    try {
        const docRef = firestoreInstance.collection('splitTemplates').doc(splitId);
        const docSnap = await docRef.get();

        console.log("docsnap is: ", docSnap.data)
    
        if (docSnap.exists()) {
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

// Function that loads full split information including exercises information
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

  // If a workout has already been done today, return that logged workout
  if (await checkWorkoutStatus()) {
    const log = await getPrevWorkoutStat();
    if (!log) {
      return null;
    }

    // Match workout by workoutDay string (e.g., "Push")
    const loggedWorkout = split.workouts.find(w => w.dayName === log.workoutDay);
    if (!loggedWorkout) {
      console.warn(`No workout found with name '${log.workoutDay}' in current split`);
      return null;
    }

    return { split, workout: loggedWorkout };
  }

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
export const getLoggedWorkouts = async (): Promise<ExerciseLog[]> => {
  const user = authInstance.currentUser;
  if (!user) throw new Error('User not authenticated');

  const logsRef = collection(firestoreInstance, 'users', user.uid, 'logs');
  const logsQuery = query(logsRef, orderBy('date', 'desc'));
  const snapshot = await getDocs(logsQuery);

  const logs: ExerciseLog[] = snapshot.docs.map((log) => ({
    ...log.data(),
  })) as ExerciseLog[];

  return logs;
};

// Get logged workout based on id
export const getLoggedWorkoutById = async (logId: string): Promise<ExerciseLog> => {
  const user = auth().currentUser;
  if (!user) throw new Error('User not authenticated');

  // Reference to the specific log document
  const logRef = doc(firestoreInstance, 'users', user.uid, 'logs', logId);
  const logSnap = await getDoc(logRef);

  if (!logSnap.exists()) {
    throw new Error('Log not found');
  }

  return {
    id: logSnap.id, // Optional: add `id` if you want the log ID in your result
    ...logSnap.data(),
  } as ExerciseLog;
};

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

// Clear Current Split
export const clearCurrentSplit = async() => {

  const user = auth().currentUser;
  if (!user) throw new Error('User not authenticated');

  const userRef = doc(firestoreInstance, 'users', user.uid)

  await updateDoc(userRef, {currentSplitId: ""});
}

// Generate random split ID
export const generateRandomSplitId = () => {
  const user = authInstance.currentUser;
  if (!user) throw new Error('User not authenticated');

  return doc(collection(firestoreInstance, 'users', user.uid, 'splits')).id;
};

// Check if workout is complete based of date
export const checkWorkoutStatus = async () => {

  const todayISO = new Date().toISOString().split('T')[0]; // '2025-06-15'

  const user = authInstance.currentUser;
  if (!user) throw new Error('User not authenticated');
  const logsRef = collection(firestoreInstance, "users", user.uid, "logs");

  const q = query(logsRef,
    where('date', '>=', todayISO),
    where('date', '<', `${todayISO}T23:59:59`)
  );

  const snapshot = await getDocs(q)

  return !snapshot.empty;
}

// Gets previous workout statistics (used in getTodayWorkout function)
const getPrevWorkoutStat = async (): Promise<ExerciseLog | null> => {
  const todayISO = new Date().toISOString().split('T')[0]; // '2025-06-15'

  const user = authInstance.currentUser;
  if (!user) throw new Error('User not authenticated');
  const logsRef = collection(firestoreInstance, "users", user.uid, "logs");

  const q = query(logsRef,
    where('date', '>=', todayISO),
    where('date', '<', `${todayISO}T23:59:59`),
    limit(1)
  );

  const snapshot = await getDocs(q)

  if(snapshot.empty){
    console.error('Split does not exist')
    return null;
  }

  const doc = snapshot.docs[0];

  return {
    id: doc.id,
    ...doc.data()
  } as ExerciseLog
}

// Based off exerciseId, grab all ExerciseLog.exercises that contain that
export const getLogsByExerciseId = async (exerciseId: string): Promise<ExerciseStat | null> => {

  const allExerciseLogs = await getLoggedWorkouts();

  const sets: { weight: number; reps: number ; date: string}[] = [];

  allExerciseLogs.forEach((log) => {
    const data = log.exercises;
    const logDate = log.date;

    data.forEach((ex) => {
      if(ex.exerciseId === exerciseId){
        for(const set of ex.sets ?? []){
          if(set.weight !== undefined && set.reps !== undefined){
            sets.push({weight: set.weight, reps: set.reps, date: logDate});
          }
        }
      }
    })

  })

  if (sets.length === 0) {
    return null;
  }

  return {
    exerciseId,
    sets
  }
} 

export const getWorkoutCountPerWeek = async (): Promise<
  { date: string; count: number }[] | null
> => {
  const allExerciseLogs = await getLoggedWorkouts();

  if (!allExerciseLogs || allExerciseLogs.length === 0) {
    return null;
  }

  const weekMap: Record<string, number> = {};

  for (const log of allExerciseLogs) {
    const logDate = new Date(log.date);
    const day = logDate.getDay(); // 0 = Sunday
    const sunday = new Date(logDate);
    sunday.setDate(logDate.getDate() - day);
    sunday.setHours(0, 0, 0, 0);

    const weekKey = sunday.toISOString().split("T")[0];
    weekMap[weekKey] = (weekMap[weekKey] || 0) + 1;
  }

  const sorted = Object.entries(weekMap).sort(
    ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
  );

  return sorted.map(([date, count]) => ({ date, count }));
};


