import React from 'react'
import { View, Text, StyleSheet, ViewStyle, Pressable, GestureResponderEvent, StyleProp } from 'react-native';

type Dimension = number | `${number}%`; // Valid types for height/width

// Properties of component
type FloatingCardProps = {
  height?: Dimension;
  width: Dimension;
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
}

export default function FloatingCard({ height, width, children, onPress, style }: FloatingCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { height, width },
        style,
        pressed && styles.pressedCard,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#333',
  } as ViewStyle,
  pressedCard: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});