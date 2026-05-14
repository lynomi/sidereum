import { router } from "expo-router";
import { Animated, Pressable, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BackButton({ opacity }) {
  const insets = useSafeAreaInsets();

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/selection");
  };

  const invertedOpacity = opacity
    ? opacity.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      })
    : 1;

  const buttonStyle = [styles.button, { top: insets.top + 16, opacity: invertedOpacity }];

  return (
    <Animated.View style={buttonStyle}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={goBack}
      >
        <Text style={styles.buttonText}>Back</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    left: 20,
    zIndex: 10,
    borderRadius: 8,
    borderColor: "rgba(255, 255, 255, 0.5)",
    borderWidth: 1,
    backgroundColor: "rgba(0, 0, 0, 0.24)",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
  },
});
