import React from 'react';
import { Text, StyleSheet, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import OptionsButton from './OptionsButton';
import { useRouter } from 'expo-router';

type Props = {
  showBackButton?: boolean;
  showEditButton?: boolean;
  onChangeSplit?: () => void;
  onTryNewWorkout?: () => void;
  onSkipWorkout?: () => void;
}

export default function GravitusHeader({showBackButton = false, showEditButton = false, onChangeSplit, onTryNewWorkout, onSkipWorkout}: Props) {
  const router = useRouter();

  return (
    <View style={styles.wrapper}>
      {showBackButton && (
        <Pressable onPress={() => {
          router.back();
        }} 
        style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
      )}
      <Text style={styles.text}>Gravitus</Text>
      {showEditButton && (
        <OptionsButton
          onChangeSplit={onChangeSplit}
          onTryNewWorkout={onTryNewWorkout}
          onSkipWorkout={onSkipWorkout}
        />
      )}
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
