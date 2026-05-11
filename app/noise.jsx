import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Noise() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Noise</Text>
      <Text style={styles.subtitle}>Soft background noise for focus and rest.</Text>

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
  secondaryButton: {
    borderRadius: 8,
    borderColor: "#9ca3af",
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e5e7eb",
  },
});
