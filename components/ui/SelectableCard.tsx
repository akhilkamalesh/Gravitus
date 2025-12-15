import { Pressable, Text, StyleSheet } from "react-native";

type Props = {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
};

export default function SelectableCard({
  label,
  description,
  selected,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        selected && styles.selectedCard,
      ]}
    >
      <Text
        style={[
          styles.label,
          selected && styles.selectedLabel,
        ]}
      >
        {label}
      </Text>

      {description && (
        <Text
          style={[
            styles.description,
            selected && styles.selectedDescription,
          ]}
        >
          {description}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  selectedCard: {
    backgroundColor: "#FFF",
    borderColor: "#FFF",
  },
  label: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  selectedLabel: {
    color: "#000",
  },
  description: {
    marginTop: 6,
    color: "#AAA",
    fontSize: 13,
  },
  selectedDescription: {
    color: "#333",
  },
});
