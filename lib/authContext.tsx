import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Alert } from "react-native";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "@react-native-firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
} from "@react-native-firebase/firestore";

import { authInstance, firestoreInstance } from "./firebase";
import { emailAllowSet } from "./otherFunctions";

import { FirebaseUser } from "@/types/firestoreTypes";
import {
  FirestoreUserData,
  FirestoreUserCreateInput,
} from "@/types/user";

interface AuthContextProps {
  user: FirebaseUser | null;
  userData: FirestoreUserData;
  loading: boolean;

  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;

  createUserProfile: (
    data: FirestoreUserCreateInput
  ) => Promise<void>;
}


const AuthContext = createContext<AuthContextProps | null>(
  null
);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(
    null
  );
  const [userData, setUserData] =
    useState<FirestoreUserData>(null);
  const [loading, setLoading] = useState(true);

  /**
   * 🔐 Auth state listener
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      authInstance,
      async (firebaseUser) => {
        setUser(firebaseUser);

        if (firebaseUser) {
          const ref = doc(
            firestoreInstance,
            "users",
            firebaseUser.uid
          );
          const snap = await getDoc(ref);

          setUserData(
            snap.exists()
              ? (snap.data() as FirestoreUserData)
              : null
          );
        } else {
          setUserData(null);
        }

        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  /**
   * 🔑 Sign in
   */
  const signInWithEmail = async (
    email: string,
    password: string
  ) => {
    await signInWithEmailAndPassword(
      authInstance,
      email,
      password
    );
  };

  /**
   * ✉️ Create AUTH account only
   * (NO Firestore write)
   */
  const signUpWithEmail = async (
    email: string,
    password: string
  ) => {
    // if (!emailAllowSet.has(email)) {
    //   Alert.alert(
    //     "Email Not Authorized",
    //     "You are not authorized to use this app."
    //   );
    //   throw new Error("Email not allowed");
    // }

    await createUserWithEmailAndPassword(
      authInstance,
      email,
      password
    );
  };

  /**
   * 🧱 Create Firestore user profile
   * (called AFTER onboarding completes)
   */
  const createUserProfile = async (
    data: FirestoreUserCreateInput
  ) => {
    if (!user || !user.email) {
      throw new Error(
        "Cannot create profile without auth user"
      );
    }

    console.log("calling create user profile")

    const finalUser: FirestoreUserData = {
      ...data,
      email: user.email,
      onboardingCompleted: true,
      createdAt: Date.now(),
      currentSplitId: "",
      currentDayIndex: 0,
    };

    console.log(finalUser);

    const ref = doc(
      firestoreInstance,
      "users",
      user.uid
    );

    await setDoc(ref, finalUser);

    console.log('here')

    setUserData(finalUser);
  };

  /**
   * 🚪 Sign out
   */
  const signOut = async () => {
    await authInstance.signOut();
    setUserData(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        createUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }
  return context;
};
