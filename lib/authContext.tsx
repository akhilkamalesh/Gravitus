import React, { createContext, useContext, useEffect, useState } from 'react';
import { authInstance, firestoreInstance } from './firebase';
import { FirebaseUser, FirestoreUserData } from '@/types/firestoreTypes';
import { signInWithEmailAndPassword } from '@react-native-firebase/auth';

interface AuthContextProps {
  user: FirebaseUser | null;
  userData: FirestoreUserData;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<FirestoreUserData>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authInstance.onAuthStateChanged(async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.email ?? 'no user');

      setUser(firebaseUser);

      if (firebaseUser) {
        const userDoc = await firestoreInstance.collection('users').doc(firebaseUser.uid).get();
        setUserData(userDoc.exists() ? (userDoc.data() as FirestoreUserData) : null);
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(authInstance, email, password);
  };

  const signUp = async (email: string, password: string, name: string) => {
    try{
      const userCredential = await authInstance.createUserWithEmailAndPassword(email, password);
      const uid = userCredential.user.uid;
      await firestoreInstance.collection('users').doc(uid).set({
        name,
        email,
        currentSplitId: '',
      });
    }catch(err){
      console.log(err)
    }
  };

  const signOut = async () => {
    await authInstance.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
