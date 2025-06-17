import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function BackButton() {
  const navigation = useNavigation();

  return (
    <Pressable onPress={() => navigation.goBack()} style={styles.button}>
      <Ionicons name="arrow-back" size={24} color="white" />
      <Text style={styles.text}>Back</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  text: {
    color: 'white',
    fontSize: 16,
    marginLeft: 4,
  },
});
