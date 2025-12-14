import { View, Text, TextInput, StyleSheet } from "react-native";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit?: string;
  error?: string;
};

export default function NumericInputField({
  label,
  value,
  onChange,
  unit,
  error,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {unit ? `(${unit})` : ""}
      </Text>

      <TextInput
        value={value}
        onChangeText={(text) => {
          // Numbers only
          const numeric = text.replace(/[^0-9]/g, "");
          onChange(numeric);
        }}
        keyboardType="number-pad"
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor="#555"
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    color: "#AAA",
    fontSize: 12,
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    paddingHorizontal: 12,
    color: "#FFF",
    fontSize: 15,
  },
  inputError: {
    borderColor: "#FF4D4F",
  },
  error: {
    marginTop: 4,
    color: "#FF4D4F",
    fontSize: 12,
  },
});
