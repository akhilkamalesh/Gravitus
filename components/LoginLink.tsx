import { Text, Pressable, StyleSheet } from "react-native";
import {useRouter} from "expo-router";

export default function LoginLink() {

  const router = useRouter();

  return (
    <Pressable onPress={() => router.push("/(auth)/auth")}>
      <Text style={styles.text}>
        Already have an account? <Text style={styles.link}>Log in</Text>
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
    color: "#AAA",
    fontSize: 14,
    marginTop: 16,
  },
  link: {
    color: "#FFF",
    fontWeight: "600",
  },
});
