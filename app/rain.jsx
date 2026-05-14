import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import BackButton from "../components/BackButton";

export default function Rain() {
  return (
    <View style={styles.container}>
      <BackButton />

      <Text style={styles.title}>Rain</Text>
      <Text style={styles.subtitle}>A steady rainfall soundscape.</Text>

      <Pressable style={styles.button} onPress={() => router.push("/sleep")}>
        <Text style={styles.buttonText}>Light Rain</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => router.push("/sleep")}>
        <Text style={styles.buttonText}>Heavy Rain</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() =>
          router.push({
            pathname: "/sleep",
            params: { sound: "thunderstorm" },
          })
        }
      >
        <Text style={styles.buttonText}>Thunderstorm</Text>
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
});
