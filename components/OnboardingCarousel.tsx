import { View, Text, StyleSheet, FlatList, Dimensions } from "react-native";

const SLIDES = [
  {
    title: "Track Every Workout",
    description: "Log sets, reps, and weights with ease.",
  },
  {
    title: "Train With Purpose",
    description: "Build splits tailored to your goals.",
  },
  {
    title: "Progress That Matters",
    description: "See real strength trends over time.",
  },
];

const { width } = Dimensions.get("window");

export default function OnboardingCarousel() {
  return (
    <FlatList
      data={SLIDES}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.title}
      renderItem={({ item }) => (
        <View style={[styles.slide, { width: width - 48 }]}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  slide: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#FFF",
    textAlign: "center",
  },
  description: {
    marginTop: 12,
    fontSize: 14,
    color: "#AAA",
    textAlign: "center",
  },
});
