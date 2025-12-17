import { View, Text, Pressable, StyleSheet } from "react-native";

export type ExperienceLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "unsure";

type Props = {
  value?: ExperienceLevel;
  onSelect: (level: ExperienceLevel) => void;
};

const EXPERIENCE_OPTIONS: {
  value: ExperienceLevel;
  label: string;
  description: string;
}[] = [
  {
    value: "beginner",
    label: "Beginner",
    description: "Just getting started or returning after a break.",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "Consistent training with solid fundamentals.",
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "Years of structured training and progression.",
  },
  {
    value: "unsure",
    label: "Not sure",
    description: "I’m not sure where I fall yet.",
  },
];

export default function ExperienceSelector({
  value,
  onSelect,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>What’s your experience?</Text>

      {EXPERIENCE_OPTIONS.map((option) => {
        const selected = value === option.value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onSelect(option.value)}
            style={[
              styles.option,
              selected && styles.optionSelected,
            ]}
          >
            <View>
              <Text
                style={[
                  styles.optionLabel,
                  selected && styles.optionLabelSelected,
                ]}
              >
                {option.label}
              </Text>

              <Text
                style={[
                  styles.optionDescription,
                  selected &&
                    styles.optionDescriptionSelected,
                ]}
              >
                {option.description}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
  },
  option: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 12,
  },
  optionSelected: {
    borderColor: "#FFF",
    backgroundColor: "#FFF",
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
  },
  optionLabelSelected: {
    color: "#000",
  },
  optionDescription: {
    marginTop: 4,
    fontSize: 12,
    color: "#AAA",
  },
  optionDescriptionSelected: {
    color: "#333",
  },
});
