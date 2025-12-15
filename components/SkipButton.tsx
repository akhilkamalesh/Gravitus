import { Pressable, Text, StyleSheet } from "react-native";

type Props = {
  onPress: () => void;
};

export default function SkipButton({ onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Text style={styles.text}>Skip</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 72,
    right: 24,
    zIndex: 10,
  },
  text: {
    color: "#AAA",
    fontSize: 14,
  },
});
