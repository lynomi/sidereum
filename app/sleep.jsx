import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Sleep() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sleep Screen</Text>
      <Text style={styles.subtitle}>Settle in and get ready to rest.</Text>

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
    backgroundColor: "#000000",
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
  secondaryButton: {
    marginTop: 8,
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
