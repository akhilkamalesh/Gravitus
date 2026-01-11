import React from 'react';
import { Modal, View, TextInput, Text, ScrollView, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Exercise } from '@/types/firestoreTypes';

interface ExerciseSearchModalProps {
  visible: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  exercises: Exercise[];
  onSelectExercise: (exerciseId: string) => void;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

const ExerciseSearchModal = ({ visible, onClose, searchQuery, setSearchQuery, exercises, onSelectExercise, }: ExerciseSearchModalProps) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Exercise</Text>
            <Pressable onPress={onClose} style={{ padding: 4 }}>
              <Ionicons name="close" size={24} color="#666" />
            </Pressable>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Search exercises..."
              placeholderTextColor="#666"
              style={styles.input}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={false}
            />
          </View>

          <ScrollView style={{ maxHeight: SCREEN_HEIGHT * 0.5 }} showsVerticalScrollIndicator={false}>
            {exercises
              .filter((e) => e.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((exercise) => (
                <Pressable
                  key={exercise.id}
                  onPress={() => onSelectExercise(exercise.id)}
                  style={styles.searchItem}
                >
                  <Text style={styles.searchItemText}>{exercise.name}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#444" />
                </Pressable>
              ))}
            {exercises.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
              <Text style={{ color: '#666', textAlign: 'center', marginTop: 20 }}>No exercises found.</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ExerciseSearchModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#000',
    borderRadius: 16,
    maxHeight: SCREEN_HEIGHT * 0.8,
    borderWidth: 1,
    borderColor: '#333',
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  searchItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchItemText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
