import React from 'react';
import { Text, StyleSheet, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  showBackButton?: boolean;
}

export default function GravitusHeader({showBackButton = false}: Props) {
  const navigation = useNavigation();


  return (
    <View style={styles.wrapper}>
      {showBackButton && (
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
      )}
      <Text style={styles.text}>Gravitus</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: [{ translateY: -15 }],
    padding: 4,
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
});
