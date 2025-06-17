// // firebase.ts
// import { getApp } from '@react-native-firebase/app';
// import { getAuth } from '@react-native-firebase/auth';
// import {getFirestore} from '@react-native-firebase/firestore';

// const app = getApp();

// export const auth = getAuth(app);
// export const firestoreInstance = getFirestore(app);
// firebase.ts
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const authInstance = auth(); // Optional alias, but valid
export const firestoreInstance = firestore(); // ✅ This works with .collection()
