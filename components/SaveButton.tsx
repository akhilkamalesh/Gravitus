import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';

type SaveButtonProps = {
  text?: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  backgroundColor?: string;
};

export default function SaveButton({
  text = "Save",
  onPress,
  loading = false,
  disabled = false,
  backgroundColor = '#4FD6EA',
}: SaveButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading || disabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: disabled ? '#999' : backgroundColor,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.text}>{text}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 16,
    alignSelf: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
