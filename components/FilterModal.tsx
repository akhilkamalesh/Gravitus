import React from 'react';
import { Modal, View, TextInput, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Exercise } from '@/types/firestoreTypes';

interface ExerciseSearchModalProps {
  visible: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  exercises: Exercise[];
  onSelectExercise: (exerciseId: string) => void;
}

const ExerciseSearchModal = ({visible, onClose, searchQuery, setSearchQuery, exercises, onSelectExercise,}: ExerciseSearchModalProps) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextInput
            placeholder="Search exercises..."
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          <ScrollView style={{ maxHeight: 300 }}>
            {exercises
              .filter((e) => e.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((exercise) => (
                <Pressable
                  key={exercise.id}
                  onPress={() => onSelectExercise(exercise.id)}
                  style={styles.searchItem}
                >
                  <Text style={styles.searchItemText}>{exercise.name}</Text>
                </Pressable>
              ))}
          </ScrollView>
          <Pressable onPress={onClose} style={styles.modalCloseButton}>
            <Text style={styles.modalCloseText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default ExerciseSearchModal;

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
      
      searchInput: {
        backgroundColor: '#333',
        color: 'white',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
      },
      
      searchItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
      },
      
      searchItemText: {
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
