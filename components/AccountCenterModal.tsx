import React, { useState } from 'react';
import {
  Modal,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface Props {
  visible: boolean;
  title: 'Change Name' | 'Change Email' | 'Change Password' | "";
  onClose: () => void;
  handleFunction: (inputs: { name?: string; email?: string; password?: string }) => void;
}

export default function AccountCenterModal({ visible, title, onClose, handleFunction }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = () => {
    try {
      const data: any = {};
      if (title === 'Change Name') data.name = name;
      if (title === 'Change Email') data.email = email;
      if (title === 'Change Password') data.password = password;

      handleFunction(data);
      onClose();
      setName('');
      setEmail('');
      setPassword('');
      setError('');
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Something went wrong');
    }
  };

  const renderInput = () => {
    if (title === 'Change Name') {
      return (
        <TextInput
          placeholder="Enter new name"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
      );
    } else if (title === 'Change Email') {
      return (
        <TextInput
          placeholder="Enter new email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      );
    } else if (title === 'Change Password') {
      return (
        <TextInput
          placeholder="Enter new password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
      );
    }
    return null;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{title}</Text>
          {renderInput()}
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity onPress={onSubmit} style={styles.modalConfirmButton}>
            <Text style={styles.modalConfirmText}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.modalCancelButton}>
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#1c1f23',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#333',
    color: 'white',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalConfirmButton: {
    backgroundColor: '#06b6d4',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  modalConfirmText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  modalCancelButton: {
    alignItems: 'center',
    marginTop: 4,
  },
  modalCancelText: {
    color: '#4FD6EA',
    fontSize: 16,
    fontWeight: '500',
  },
});
