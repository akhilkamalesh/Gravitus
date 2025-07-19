import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/lib/authContext';
import SignUpModal from './signUp';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);

  const { signIn } = useAuth();

  const handleLogin = async () => {
    try {
      await signIn(username, password);
      Alert.alert('Success', 'Signed in successfully');
      router.replace('/');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Gravitus</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter username"
            placeholderTextColor="#888"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            placeholderTextColor="#888"
            value={password}
            secureTextEntry
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity onPress={() => setShowModal(true)}>
          <Text style={styles.signup}>New here? Sign Up</Text>
        </TouchableOpacity>

        <SignUpModal visible={showModal} onClose={() => setShowModal(false)} />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Enter</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#121417',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 60,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 48,
  },
  inputContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 36,
  },
  label: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#1c1f23',
    borderWidth: 1,
    borderColor: '#4FD6EA',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    color: '#fff',
    fontSize: 16,
  },
  signup: {
    color: '#4FD6EA',
    fontSize: 14,
    marginBottom: 20,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#4FD6EA',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#121417',
    fontWeight: '700',
    fontSize: 16,
  },
});
