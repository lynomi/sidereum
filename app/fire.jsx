import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import TopRightBackButton from "../components/TopRightBackButton";

export default function Fire() {
  return (
    <View style={styles.container}>
      <TopRightBackButton />

      <Text style={styles.title}>Fire</Text>
      <Text style={styles.subtitle}>Warm crackles for settling down.</Text>

      <Pressable style={styles.button} onPress={() => router.push("/sleep")}>
        <Text style={styles.buttonText}>Go to Sleep</Text>
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
    backgroundColor: "#2d160c",
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
    color: "#fed7aa",
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: "#ea580c",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});
