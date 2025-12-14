import { View, Text, Pressable, StyleSheet } from "react-native";

type Props = {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
};

export default function UnitToggle({ options, selected, onChange }: Props) {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <Pressable
          key={option}
          onPress={() => onChange(option)}
          style={[
            styles.option,
            selected === option && styles.active,
          ]}
        >
          <Text
            style={[
              styles.text,
              selected === option && styles.activeText,
            ]}
          >
            {option}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 8,
  },
  option: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#333",
  },
  active: {
    backgroundColor: "#FFF",
  },
  text: {
    color: "#FFF",
    fontSize: 13,
  },
  activeText: {
    color: "#000",
    fontWeight: "600",
  },
});
