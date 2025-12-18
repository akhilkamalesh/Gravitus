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
          styles.label        
        ]}
      >
        {label}
      </Text>

      {description && (
        <Text
          style={[
            styles.description
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  selectedCard: {
    borderColor: "#FFF",
  },
  label: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  description: {
    marginTop: 6,
    color: "#AAA",
    fontSize: 13,
  },
});
