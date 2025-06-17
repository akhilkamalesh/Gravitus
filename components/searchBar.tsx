import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

// Defines the props for the SearchBar Component
interface SearchBarProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
}

// SeachBar Component
const SearchBar = ({ value, onChange, placeholder = "Search exercises..." }: SearchBarProps) => {
  return (
    <View style={styles.container}>
      <Feather name="search" size={20} color="#ccc" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
};

// StyleSheet
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2d33',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 16,
    width: "90%",
    alignSelf: 'center'
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
});

export default SearchBar;