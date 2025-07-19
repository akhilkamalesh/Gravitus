import React, { useState } from 'react';
import { Modal, View, TextInput, StyleSheet, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '@/lib/authContext';

interface SignUpModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SignUpModal({ visible, onClose }: SignUpModalProps) {
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    try {
      await signUp(email, password, name);
      onClose();
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>Create Account</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              placeholder="Enter your name"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="Create a password"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity onPress={handleSignUp} style={styles.button}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000000aa',
    paddingHorizontal: 24,
  },
  content: {
    backgroundColor: '#1c1f23',
    borderRadius: 12,
    paddingVertical: 30,
    paddingHorizontal: 24,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    gap: 16,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#aaa',
    marginBottom: -5
  },
  input: {
    borderWidth: 1,
    borderColor: '#4FD6EA',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    color: 'white',
    fontSize: 14,
  },
  error: {
    color: '#ff6b6b',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#4FD6EA',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#121417',
    fontWeight: '700',
    fontSize: 15,
  },
  cancel: {
    color: '#4FD6EA',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'italic',
    marginTop: 20,
    textAlign: 'center',
  },
});
