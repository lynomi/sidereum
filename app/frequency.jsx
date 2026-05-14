import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import BackButton from "../components/TopRightBackButton";

export default function Frequency() {
  return (
    <View style={styles.container}>
      <BackButton />

      <Text style={styles.title}>Frequency</Text>

      <Pressable style={styles.button} onPress={() => router.push("/sleep")}>
        <Text style={styles.buttonText}>432hz</Text>
      </Pressable>

       <Pressable style={styles.button} onPress={() => router.push("/sleep")}>
        <Text style={styles.buttonText}>528hz</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    padding: 24,
    backgroundColor: "#1f2937",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#ffffff",
  },
  subtitle: {
    maxWidth: 280,
    textAlign: "center",
    fontSize: 16,
    color: "#d1d5db",
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: "#4b5563",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});
