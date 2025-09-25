import { firestoreInstance, authInstance } from "./firebase";
import { collection, getDoc, setDoc, getDocs, addDoc, updateDoc, doc, serverTimestamp, query, orderBy, where, limit, deleteDoc } from "@react-native-firebase/firestore";
import { Exercise, ExerciseLog, ExerciseStat, workout } from "@/types/firestoreTypes";
import auth, { updateEmail } from '@react-native-firebase/auth'
import { Split } from "@/types/firestoreTypes";

// Loads all exercises from the database
export const getExercises = async (): Promise<Exercise[]> => {
    try{
        const snapshot = await getDocs(collection(firestoreInstance, 'exercises'));
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

// Grabs all the exercise groups
export const getExerciseGroups = async (): Promise<string[]> => {
  const exercises = await getExercises();

  const groupSet = new Set<string>();

  for (const e of exercises) {
    groupSet.add(String(e.primaryMuscleGroup));
  }

  return Array.from(groupSet);
} 


// Loads splits based off ID (only for splitTemplates)
export const getSplit = async (splitId: string): Promise<Split | null> => {
    try {
        const docRef = doc(firestoreInstance, "splitTemplates", splitId);
        // const docRef = firestoreInstance.collection('splitTemplates').doc(splitId);
        const docSnap = await getDoc(docRef)
    
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

// Loads all splits
export const getSplits = async (): Promise<Split[] | null> => {
  const splitsRef = collection(firestoreInstance, "splitTemplates");
  const snapshot = await getDocs(splitsRef);

  if(!snapshot){
    return null;
  }

  const splits: Split[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Split[];

  return splits;
}

// Function that loads full split information including exercises information
export const getSplitInformation = async (split: Split): Promise <Split> => {
  const resolvedWorkouts = await Promise.all(
    split.workouts.map(async (workout) => {
      const enrichedExercises = await Promise.all(
        workout.exercises.map(async (exercise) => {
          const docRef = doc(firestoreInstance, 'exercises', exercise.exerciseId);
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
  const user = authInstance.currentUser;
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

// Save custom workout to a one-off split
export const saveOneOffSplitToUser = async (split: Split) => {
  const user = authInstance.currentUser;
  if (!user) throw new Error("User not logged in");

  const oneOffSplitId = generateOneOffSplitId();
  const splitDocRef = doc(firestoreInstance, 'users', user.uid, 'splits', oneOffSplitId);

  const existing = await getDoc(splitDocRef);
  if (existing.exists()) {
    return oneOffSplitId; // Already exists, reuse it
  }

  const splitData = {
    ...split,
    createdAt: serverTimestamp(),
    createdFromTemplateId: split.id,
  };

  await setDoc(splitDocRef, splitData);
  return oneOffSplitId;
};

// Save splitId to currentSplitId attribute under user
export const updateCurrentSplit = async (splitId: string) => {
  const user = authInstance.currentUser;
  if (!user) throw new Error('User not authenticated');

  const userDocRef = doc(firestoreInstance, 'users', user.uid);
  await updateDoc(userDocRef, {
    currentSplitId: splitId,
  });
};

// Retrieves the current split
export const getCurrentSplit = async (): Promise<Split | null> => {
  const user = authInstance.currentUser;
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
  const user = authInstance.currentUser;;
  if (!user) throw new Error('User not authenticated');

  const uid = user.uid;

  // Get user document
  const userDocRef = doc(firestoreInstance, 'users', uid);
  const userSnap = await getDoc(userDocRef);
  const userData = userSnap.data();

  const currentSplitId = userData?.currentSplitId;
  let currentDayIndex = userData?.currentDayIndex || 0;

  // If a workout has already been done today, return the logged one
  // Logic is deleted, to get it back, reset to previous git commit

  // No workout logged today, return the current split's workout
  if (!currentSplitId) return null;

  const currentSplitRef = doc(firestoreInstance, 'users', uid, 'splits', currentSplitId);
  const currentSplitSnap = await getDoc(currentSplitRef);

  if (!currentSplitSnap.exists()) return null;

  const split = { id: currentSplitSnap.id, ...currentSplitSnap.data() } as Split;

  // Removed checkWorkoutStatus() checker since this is accounted for in workoutService.tsx
  const workout = split.workouts[currentDayIndex % split.workouts.length];

  // console.log(workout)
  // console.log(currentDayIndex)

  return { split, workout };
};


// Increment Day Index (want to keep the actual number and modulate in the previous function)
export const incrementDayIndex = async () => {
  const user = authInstance.currentUser;
  if (!user) throw new Error('User not authenticated');

  const userRef = doc(firestoreInstance, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  const currentIndex = userSnap.data()?.currentDayIndex ?? 0;
  
  const nextIndex = (currentIndex + 1);
  await updateDoc(userRef, { currentDayIndex: nextIndex });
};

// Reset Day Index (when switching to another split)
export const resetDayIndex = async () => {
  const user = authInstance.currentUser;
  if (!user) throw new Error('User not authenticated');

  const userRef = doc(firestoreInstance, 'users', user.uid);
  await updateDoc(userRef, {currentDayIndex: 0});
}

// Log workout for the day
export const logWorkout = async (exerciseLog: ExerciseLog) => {
  const user = authInstance.currentUser;
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
  const user = authInstance.currentUser;
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
  const user = authInstance.currentUser;
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

  const user = authInstance.currentUser;
  if (!user) throw new Error('User not authenticated');

  const userRef = doc(firestoreInstance, 'users', user.uid)

  await updateDoc(userRef, {currentSplitId: ""});
}

// Generate random split ID
export const generateOneOffSplitId = () => {
  const user = authInstance.currentUser;
  if (!user) throw new Error('User not authenticated');

  return `one_off_${user.uid}`;
};

// Check if workout is complete based of date
// TODO: Fix date comparison
export const checkWorkoutStatus = async () => {

  const todayISO = new Date().toLocaleString().split(',')[0]; // '2025-06-15'

  const user = authInstance.currentUser;
  if (!user) throw new Error('User not authenticated');
  const logsRef = collection(firestoreInstance, "users", user.uid, "logs");
  
  const q = query(logsRef, orderBy('date', 'desc'), limit(1));

  const snapshot = await getDocs(q)

  const snapshotDate = snapshot.docs[0].data().date.split(',')[0];

  return (snapshotDate === todayISO)
}

// Gets previous workout statistics (used in getTodayWorkout function)
export const getPrevWorkoutStat = async (): Promise<ExerciseLog | null> => {
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

// Calculate number of workouts per week (graph data)
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


// Changes User's Name
export const changeUserName = async (name:string) => {

  // User Data
  const user = authInstance.currentUser;
  if (!user) throw new Error('User not authenticated');

  const userDocRef = doc(firestoreInstance, 'users', user.uid);
  await updateDoc(userDocRef, {
    name: name
  });
}

// Change User's Email
export const changeUserEmail = async (email:string) => {

  // User Data
  const user = authInstance.currentUser;
  if (!user) throw new Error('User not authenticated');

  const userDocRef = doc(firestoreInstance, 'users', user.uid);

  await updateEmail(user, email);

  await updateDoc(userDocRef, {
    email: email
  }); 
}

// Change User's Password
export const changeUserPassword = async (password:string) => {

  // User Data
  const user = authInstance.currentUser;
  if (!user) throw new Error('User not authenticated');

  await user.updatePassword(password)
}

// Delete Account
export const deleteAccount = async () => {
  
  // User Data
  const user = authInstance.currentUser;
  if (!user) throw new Error('User not authenticated');

  // Delete User Data
  // await firestoreInstance.collection('users').doc(user.uid).delete();
  await deleteDoc(doc(firestoreInstance, 'users', user.uid));  

  const logsCollectionRef = collection(firestoreInstance, 'users', user.uid, 'logs');
  const logsSnapshot = await getDocs(logsCollectionRef);
  const logDeletionPromises = logsSnapshot.docs.map(docSnap => deleteDoc(docSnap.ref));
  await Promise.all(logDeletionPromises);

  const splitssCollectionRef = collection(firestoreInstance, 'users', user.uid, 'splits');
  const splitssSnapshot = await getDocs(splitssCollectionRef);
  const splitsDeletionPromises = splitssSnapshot.docs.map(docSnap => deleteDoc(docSnap.ref));
  await Promise.all(splitsDeletionPromises);

  // Delete the user from Firebase Authentication
  await user.delete();
}

// Admin Functions - Add Exercise to Exercise List
export const addExercisesToExerciseList = async (exerciseList:Exercise[]) => {

    const firestoreExercises = collection(firestoreInstance, "exercises");

    for(const exercise of exerciseList){
      try {
        const exerciseRef = doc(firestoreExercises, exercise.id); // Use 'id' as document ID
        await setDoc(exerciseRef, exercise); 
      } catch (err) {
        console.error('Error setting exercise:', err);
      }
    } 
}

//Admin Function - Delete All Exercises in exercise list
export const deleteAllExercises = async () => {
  const exercisesRef = collection(firestoreInstance, 'exercises');

  try {
    const snapshot = await getDocs(exercisesRef);

    const deletePromises = snapshot.docs.map((docSnap) =>
      deleteDoc(doc(firestoreInstance, 'exercises', docSnap.id))
    );

    await Promise.all(deletePromises);

  } catch (error) {
    console.error('Error deleting exercises:', error);
    throw error;
  }
};

// Add a split to the splitTemplates
export const addSplitToTemplates = async (split:Split) => {

  const splitTemplates = collection(firestoreInstance, "splitTemplates")
  
  try {
    const { id, ...rest } = split;
    await setDoc(doc(splitTemplates, id), rest);
    
  }catch (err){
    console.error(err)
  }

}