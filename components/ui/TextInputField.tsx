import { View, TextInput, Text, StyleSheet } from "react-native";

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
};

export default function TextInputField({
  label,
  value,
  onChangeText,
  secureTextEntry,
  error,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        style={[
          styles.input,
          error && styles.inputError,
        ]}
        placeholderTextColor="#555"
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // marginBottom: 16,
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
