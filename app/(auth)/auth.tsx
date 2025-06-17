import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { router } from 'expo-router';
import { useAuth } from '@/lib/authContext';
import SignUpModal from './signUp';


export default function LoginScreen() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [staySignedIn, setStaySignedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);


  const {signIn, signUp, userData} = useAuth()

  const handleLogin = async () => {
    try {
      await signIn(username, password);
      Alert.alert('Success', 'Signed in successfully');
      // Optionally redirect to tabs
      router.replace('/');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Login Failed', error.message);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gravitus</Text>

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder=""
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder=""
        placeholderTextColor="#aaa"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      {/* <View style={styles.checkboxContainer}>
        <CheckBox
          value={staySignedIn}
          onValueChange={setStaySignedIn}
          style={styles.checkbox}
        />
        <Text style={styles.checkboxLabel}>Stay Signed In</Text>
      </View> */}

      <TouchableOpacity>
        <Text style={styles.signup} onPress={() => setShowModal(true)}>Sign Up</Text>
      </TouchableOpacity>

      {/* Render the modal */}
      <SignUpModal visible={showModal} onClose={() => setShowModal(false)} />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Enter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#1c1f23',
      paddingHorizontal: 30,
      paddingTop: 80,
    },
    title: {
      color: '#FFFFFF',
      fontSize: 60,
      fontWeight: '600',
      textAlign: 'center',
      marginTop: 75,
      marginBottom: 88,
    },
    label: {
      color: '#FFFFFF',
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 40,
    },
    input: {
      borderBottomWidth: 1,
      width: 325,
      alignSelf: 'center',
      borderBottomColor: '#06b6d4', // cyan-400
      color: '#FFFFFF',
      paddingBottom: Platform.OS === 'ios' ? 6 : 2,
      marginBottom: 50,
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    checkbox: {
      marginRight: 8,
    },
    checkboxLabel: {
      color: '#fff',
      fontWeight: '600',
    },
    signup: {
      color: '#4FD6EA',
      marginBottom: 40,
      fontWeight: 'bold',
      fontStyle: 'italic',
      alignSelf: 'center'
    },
    button: {
      backgroundColor: '#06b6d4',
      width: 325,
      alignSelf: 'center',
      borderRadius: 6,
      paddingVertical: 12,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: 3 },
      shadowRadius: 4,
      elevation: 3,
      marginTop: 40
    },
    buttonText: {
      color: '#FFFFFF',
      fontWeight: '700',
      fontSize: 18,
    },
  });
  
