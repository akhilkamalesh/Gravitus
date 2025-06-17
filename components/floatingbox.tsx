import React from 'react'
import {View, Text, StyleSheet, ViewStyle, Pressable, GestureResponderEvent} from 'react-native';

type Dimension = number | `${number}%`; // Valid types for height/width

// Properties of component
type FloatingCardProps = {
    height?: Dimension;
    width: Dimension;
    children: React.ReactNode;
    onPress?: (event: GestureResponderEvent) => void;
  }

export default function FloatingCard({height, width, children, onPress}: FloatingCardProps){
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          { height, width },
          pressed && styles.pressedCard,
        ]}
      >
        {children}
      </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
      backgroundColor: '#2C3237',
      borderRadius: 5,
      padding: 16,
      marginTop: 20,
    } as ViewStyle,
    pressedCard: {
      opacity: 0.85,
      transform: [{ scale: 0.98 }],
    },
  });