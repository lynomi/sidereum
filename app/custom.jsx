import { Audio, setAudioModeAsync } from "expo-audio";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import BackButton from "../components/BackButton";

const KEEP_AWAKE_TAG = "sidereum-youtube";
const YOUTUBE_VOLUME = 0.7;

export default function Custom() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const soundRef = useRef(null);

  const configureAudio = useCallback(async () => {
    try {
      await setAudioModeAsync({
        allowsRecording: false,
        interruptionMode: "doNotMix",
        playsInSilentMode: true,
        shouldPlayInBackground: true,
        shouldRouteThroughEarpiece: false,
        interruptionModeAndroid: "doNotMix",
      });
    } catch (err) {
      setError("Audio could not be prepared on this device.");
    }
  }, []);

  useEffect(() => {
    configureAudio();

    return () => {
      // Cleanup: stop sound on unmount
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, [configureAudio]);

  useEffect(() => {
    if (!isPlaying) {
      deactivateKeepAwake(KEEP_AWAKE_TAG).catch(() => {});
      return;
    }

    activateKeepAwakeAsync(KEEP_AWAKE_TAG).catch(() => {});

    return () => {
      deactivateKeepAwake(KEEP_AWAKE_TAG).catch(() => {});
    };
  }, [isPlaying]);

  useEffect(() => {
    const handlePlayback = async () => {
      if (!soundRef.current) return;

      try {
        const status = await soundRef.current.getStatusAsync();
        
        if (isPlaying && !status.isPlaying) {
          await soundRef.current.playAsync();
        } else if (!isPlaying && status.isPlaying) {
          await soundRef.current.pauseAsync();
        }
      } catch (err) {
        setError("Failed to control audio playback");
      }
    };

    handlePlayback();
  }, [isPlaying]);

  const extractAudioUrl = async (url) => {
    try {
      // Extract video ID from various YouTube URL formats
      let videoId = null;

      if (url.includes("youtube.com/watch?v=")) {
        videoId = url.split("v=")[1].split("&")[0];
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
      } else if (url.includes("youtube.com/embed/")) {
        videoId = url.split("embed/")[1].split("?")[0];
      }

      if (!videoId) {
        setError("Invalid YouTube URL");
        return null;
      }

      return `https://www.youtube.com/watch?v=${videoId}`;
    } catch (err) {
      setError("Failed to process YouTube URL");
      return null;
    }
  };

  const handleLoadYoutubeAudio = async () => {
    if (!youtubeUrl.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);
    setError("");

    try {
      // Stop previous sound if playing
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const url = await extractAudioUrl(youtubeUrl);
      if (!url) {
        setIsPlaying(false);
        setIsLoading(false);
        return;
      }

      // Create and load new sound
      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { volume: YOUTUBE_VOLUME, isLooping: true }
      );

      soundRef.current = sound;
      await sound.playAsync();
      setIsPlaying(true);
    } catch (err) {
      setError("Failed to load YouTube audio. Make sure the URL is valid and accessible.");
      setIsPlaying(false);
      soundRef.current = null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePlayback = () => {
    if (!soundRef.current) {
      setError("Please load a YouTube URL first");
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    } catch (err) {
      // Ignore cleanup errors
    }
    setIsPlaying(false);
    setYoutubeUrl("");
    setError("");
  };

  return (
    <View style={styles.container}>
      <BackButton />

      <Text style={styles.title}>Custom</Text>
      <Text style={styles.subtitle}>Add a YouTube link to play audio.</Text>

      <TextInput
        style={styles.input}
        placeholder="Paste YouTube URL"
        placeholderTextColor="#999"
        value={youtubeUrl}
        onChangeText={setYoutubeUrl}
        editable={!isLoading}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.buttonGroup}>
        <Pressable
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLoadYoutubeAudio}
          disabled={isLoading || isPlaying}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>
              {soundRef.current ? "Reload" : "Play"}
            </Text>
          )}
        </Pressable>

        {soundRef.current && (
          <>
            <Pressable
              style={[styles.button, styles.pauseButton]}
              onPress={handleTogglePlayback}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isPlaying ? "Pause" : "Resume"}
              </Text>
            </Pressable>

            <Pressable style={styles.stopButton} onPress={handleStop}>
              <Text style={styles.buttonText}>Stop</Text>
            </Pressable>
          </>
        )}
      </View>

      <Pressable style={styles.sleepButton} onPress={() => router.push("/sleep")}>
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
    backgroundColor: "#1f1b2e",
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
    color: "#ddd6fe",
  },
  input: {
    width: "100%",
    maxWidth: 300,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#2d2640",
    borderWidth: 1,
    borderColor: "#7c3aed",
    color: "#ffffff",
    fontSize: 14,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 13,
    textAlign: "center",
    maxWidth: 300,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: "#7c3aed",
    paddingHorizontal: 20,
    paddingVertical: 12,
    minWidth: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  pauseButton: {
    backgroundColor: "#f59e0b",
  },
  stopButton: {
    backgroundColor: "#ef4444",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minWidth: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  sleepButton: {
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: "#7c3aed",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});
