import { View, StyleSheet } from "react-native";

type Props = {
  children: React.ReactNode;
};

export default function FormFieldStack({ children }: Props) {
  return <View style={styles.stack}>{children}</View>;
}

const styles = StyleSheet.create({
  stack: {
    gap: 16, // ✅ single spacing token for all fields
  },
});
