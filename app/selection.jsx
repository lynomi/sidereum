import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Selection() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selection Page</Text>

      <View style={styles.buttonGroup}>
        <Pressable style={styles.button} onPress={() => router.push("/rain")}>
          <Text style={styles.buttonText}>Rain</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => router.push("/fire")}>
          <Text style={styles.buttonText}>Fire</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => router.push("/noise")}>
          <Text style={styles.buttonText}>Noise</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => router.push("/custom")}>
          <Text style={styles.buttonText}>Custom</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
    paddingTop: 72,
    backgroundColor: "#31302E",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#F0F0F0",
  },
  buttonGroup: {
    width: "100%",
    maxWidth: 320,
    gap: 12,
    marginTop: 32,
  },
  button: {
    alignItems: "center",
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
