// // firebase.ts
import { getApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const app = getApp();
export const authInstance = auth(app);
export const firestoreInstance = firestore(app);
