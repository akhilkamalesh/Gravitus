import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function BackButton() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => {
        if (router.canGoBack()) {
          router.back();
        } else {
          console.log("here")
          router.replace('/'); // fallback (replace avoids adding index again in stack)
        }
      }}
      style={styles.button}
    >
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
