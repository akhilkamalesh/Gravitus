import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, getAuth } from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';
import type { User } from 'firebase/auth';
import { authInstance, firestoreInstance } from './firebase';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { FirebaseUser, FirestoreUserData } from '@/types/firestoreTypes';
// import {doc, setDoc} from "@react-native-firebase/firestore"

// type FirebaseUser = FirebaseAuthTypes.User | null;

// type FirestoreUserData = {
//   name: string;
//   email: string;
//   currentSplitId: string;
// } | null;

interface AuthContextProps {
  user: FirebaseUser | null;
  userData: FirestoreUserData;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<FirestoreUserData>(null);
  const [loading, setLoading] = useState(true);

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = authInstance.onAuthStateChanged(async (firebaseUser) => {
      console.log('Auth state changed:', user?.email ?? 'no user');

      setUser(firebaseUser);

      if (firebaseUser) {
        const userDoc = await firestoreInstance.collection('users').doc(firebaseUser.uid).get();
        if (userDoc.exists()) {
          setUserData(userDoc.data() as FirestoreUserData);
        } else {
          setUserData(null);
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await authInstance.signInWithEmailAndPassword(email, password);
  };

  const signUp = async (email: string, password: string, name: string) => {
    const userCredential = await authInstance.createUserWithEmailAndPassword(email, password);
    const uid = userCredential.user.uid;
    console.log(uid)
    // await setDoc(doc(firestoreInstance, "users", uid), {
    //   name,
    //   email,
    //   currentSplitId: '',
    // });

    // Create Firestore user doc
    await firestoreInstance.collection('users').doc(uid).set({
      name,
      email,
      currentSplitId: '',
    });
  };

  const signOut = async () => {
    await authInstance.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, userData, signIn, signUp, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// How we can grab the data from the provider (access through any component)
// import useAuth can grab any data/function defined in props
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};