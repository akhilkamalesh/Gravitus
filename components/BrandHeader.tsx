import { View, Text, StyleSheet } from "react-native";

export default function BrandHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gravitus</Text>
      <Text style={styles.subtitle}>
        Train smarter. Track everything.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 80,
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#AAA",
  },
});
