import React, { useState } from 'react';
import { Modal, View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../lib/authContext'; // Adjust path as needed

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
      <View style={styles.modalContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Name</Text>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <Text style={styles.subtitle}>Email</Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Text style={styles.subtitle}>Password</Text>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity onPress={handleSignUp} style={styles.button}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#00000099',
  },
  content: {
    backgroundColor: '#1c1f23',
    margin: 20,
    padding: 24,
    borderRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    color: 'white',
    marginBottom: 25,
    textAlign: 'left',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: 'white',
    textAlign: 'left',
    fontWeight: '600',
  },
  input: {
    borderBottomWidth: 1,
    width: 300,
    alignSelf: 'center',
    borderBottomColor: '#06b6d4', // cyan-400
    color: '#FFFFFF',
    marginVertical: 15,
  },
  error: {
    color: 'red',
    marginBottom: 8,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#06b6d4',
    width: 200,
    alignSelf: 'center',
    borderRadius: 6,
    paddingVertical: 10,
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
    fontWeight: '600',
    fontSize: 14,
  },
  cancel: {
    color: '#4FD6EA',
    marginTop: 20,
    fontWeight: 'bold',
    fontStyle: 'italic',
    alignSelf: 'center'
  },
});
