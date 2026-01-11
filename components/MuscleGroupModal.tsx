import React, { useState } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, FlatList, Dimensions, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FilterModalProps {
  visible: boolean;
  selected: string[];
  options: string[];
  onSelect: (group: string) => void;
  onApply: () => void;
  onClear: () => void;
  onClose: () => void;
  title: string;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

const MuscleGroupModal = ({
  visible,
  selected,
  options,
  onSelect,
  onApply,
  onClear,
  onClose,
  title,
}: FilterModalProps) => {
  const [search, setSearch] = useState('');

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Search..."
              placeholderTextColor="#666"
              style={styles.input}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              const isSelected = selected.includes(item);
              return (
                <Pressable onPress={() => onSelect(item)} style={styles.option}>
                  <Ionicons
                    name={isSelected ? "checkbox" : "square-outline"}
                    size={24}
                    color={isSelected ? "#4FD6EA" : "#555"}
                    style={{ marginRight: 12 }}
                  />
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                    {item}
                  </Text>
                </Pressable>
              );
            }}
            style={styles.flatList}
            contentContainerStyle={{ paddingBottom: 12 }}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.footer}>
            <Pressable onPress={() => { setSearch(''); onClear(); }} style={{ padding: 10 }}>
              <Text style={styles.clearText}>Clear</Text>
            </Pressable>
            <Pressable onPress={onApply} style={styles.applyButton}>
              <Text style={styles.applyText}>Apply Filter</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

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
    maxHeight: SCREEN_HEIGHT * 0.70,
    borderWidth: 1,
    borderColor: '#333',
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  header: {
    marginBottom: 16,
    alignItems: 'flex-start',
    paddingHorizontal: 4,
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
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  flatList: {
    flexGrow: 0,
  },
  optionText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  footer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  clearText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: '#4FD6EA',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  applyText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MuscleGroupModal;
