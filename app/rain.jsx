import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Rain() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rain</Text>
      <Text style={styles.subtitle}>A steady rainfall soundscape.</Text>

      <Pressable style={styles.button} onPress={() => router.push("/sleep")}>
        <Text style={styles.buttonText}>Go to Sleep</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
        <Text style={styles.secondaryButtonText}>Back to Selection</Text>
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
    backgroundColor: "#10233f",
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
    color: "#cbd5e1",
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: "#2563eb",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  secondaryButton: {
    borderRadius: 8,
    borderColor: "#93c5fd",
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#bfdbfe",
  },
});
