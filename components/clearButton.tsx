import React, { useState } from 'react';
import { Modal, View, Pressable, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  onChangeSplit?: () => void;
  onTryNewWorkout?: () => void;
};

export default function EditButton({ onChangeSplit, onTryNewWorkout }: Props) {

  const [modalVisible, setModalVisible] = useState(false);

  const confirmAction = (title: string, message: string, onConfirm: () => void) => {
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', style: 'destructive', onPress: onConfirm },
    ]);
  };

  const handleChangeSplit = () => {
    setModalVisible(false);
    if (onChangeSplit) onChangeSplit();
  };

  const handleTryNewWorkout = () => {
    confirmAction('Try New Workout', 'Start a brand new workout plan?', () => {
      setModalVisible(false);
      if(onTryNewWorkout) onTryNewWorkout();
      console.log('Trying new workout');
      // TODO: Try new workout logic
    });
  };

  return (
    <>
      <Pressable onPress={() => setModalVisible(true)} style={styles.iconButton}>
        <Ionicons name="ellipsis-vertical" size={20} color="white" />
      </Pressable>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Options</Text>

            <Pressable onPress={handleChangeSplit} style={styles.option}>
              <Text style={styles.optionText}>Change Split</Text>
            </Pressable>
            <Pressable onPress={handleTryNewWorkout} style={styles.option}>
              <Text style={styles.optionText}>Try New Workout</Text>
            </Pressable>

            <Pressable onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
    padding: 4,
  },

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

  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },

  option: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },

  optionText: {
    color: 'white',
    fontSize: 16,
  },

  modalCloseButton: {
    marginTop: 12,
    alignItems: 'center',
  },

  modalCloseText: {
    color: '#4FD6EA',
    fontSize: 16,
  },
});
