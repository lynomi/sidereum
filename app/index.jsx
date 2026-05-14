import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sidereum</Text>
      <Text style={styles.subtitle}>Sleep quickly.</Text>

      <Pressable style={styles.button} onPress={() => router.push("/selection")}>
        <Text style={styles.buttonText}>Go</Text>
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
    backgroundColor: "#2c0703",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#ebd4cb",
  },
  subtitle: {
    fontSize: 16,
    color: "#da9f93",
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: "#da9f93",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ebd4cb",
  },
});
