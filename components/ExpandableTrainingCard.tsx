import { View, Text, Pressable, StyleSheet } from "react-native";
import ExperienceSelector, {
  ExperienceLevel,
} from "./ExperienceSelector";

type Props = {
  label: string;
  description: string;
  expanded: boolean;
  experience?: ExperienceLevel;
  onExpand: () => void;
  onCollapse: () => void;
  onSelectExperience: (level: ExperienceLevel) => void;
  onClear: () => void;
};

export default function ExpandableTrainingStyleCard({
  label,
  description,
  expanded,
  experience,
  onExpand,
  onCollapse,
  onSelectExperience,
  onClear,
}: Props) {

  const selected = !!experience;

  const onHeaderPress = () => {
    if (selected) {
      onClear();       // ✅ clear experience
      onCollapse();    // collapse
    } else {
      expanded ? onCollapse() : onExpand();
    }
  };


  return (
    <View style={[styles.card, selected && styles.selectedCard]}>
      {/* Header */}
      <Pressable
        onPress={onHeaderPress}
        style={styles.header}
      >
        <View>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        {experience && (
          <Text style={styles.badge}>
            {experience.charAt(0).toUpperCase() + experience.slice(1)}
          </Text>
        )}
      </Pressable>

      {/* Expanded */}
      {expanded && (
        <View style={styles.expanded}>
          <ExperienceSelector
            value={experience}
            onSelect={(level) => {
              onSelectExperience(level);
              onCollapse();
            }}
          />

        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#000",
  },
  selectedCard: {
    borderColor: "#FFF", // ✅ WHITE OUTLINE
  },
  header: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  description: {
    marginTop: 4,
    color: "#AAA",
    fontSize: 13,
  },
  badge: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  expanded: {
    borderTopWidth: 1,
    borderTopColor: "#333",
    padding: 16,
  },
  remove: {
    marginTop: 12,
    color: "#FF4D4F",
    fontSize: 13,
  },
});
