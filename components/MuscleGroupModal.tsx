import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet, FlatList, Dimensions } from 'react-native';

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
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{title}</Text>

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
            style={styles.flatList}
            contentContainerStyle={{ paddingBottom: 12 }}
            showsVerticalScrollIndicator={false}
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
    maxHeight: SCREEN_HEIGHT * 0.50, // ✅ Cap modal height at 75% of screen
  },
  title: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 16,
    fontWeight: '600',
    alignSelf: 'center',
  },
  option: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  flatList: {
    flexGrow: 0, // ✅ Makes FlatList respect maxHeight
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

export default MuscleGroupModal;
