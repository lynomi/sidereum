import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Selection() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selection Page</Text>

      <Pressable style={styles.button} onPress={() => router.push("/sleep")}>
        <Text style={styles.buttonText}>Start Sleep</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
        <Text style={styles.secondaryButtonText}>Go Back</Text>
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
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111827",
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
    borderColor: "#2563eb",
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2563eb",
  },
});
