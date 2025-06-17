import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet, FlatList } from 'react-native';

interface FilterModalProps {
  visible: boolean;
  selected: string[];
  options: string[];
  onSelect: (group: string) => void;
  onApply: () => void;
  onClear: () => void;
  onClose: () => void;
}

// TODO: Need to change UI for the Filter Modal
const FilterModal = ({ visible, selected, options, onSelect, onApply, onClear, onClose }: FilterModalProps) => {
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Select Muscle Groups</Text>
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              const isSelected = selected.includes(item);
              return (
                <Pressable onPress={() => onSelect(item)} style={styles.option}>
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                    {isSelected ? '✅ ' : '⬜ '} {item}
                  </Text>
                </Pressable>
              );
            }}
          />
          <View style={styles.actions}>
            <Pressable onPress={onClear}>
              <Text style={styles.actionText}>Clear</Text>
            </Pressable>
            <Pressable onPress={onApply}>
              <Text style={[styles.actionText, { fontWeight: 'bold' }]}>Apply</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modal: {
    backgroundColor: '#1c1f23',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 16,
  },
  option: {
    paddingVertical: 10,
  },
  optionText: {
    color: '#ccc',
    fontSize: 16,
  },
  optionTextSelected: {
    color: '#4f9deb',
  },
  actions: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionText: {
    color: '#4f9deb',
    fontSize: 16,
  },
});

export default FilterModal;
