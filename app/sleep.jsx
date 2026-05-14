import {
    setAudioModeAsync,
    useAudioPlayer,
} from "expo-audio";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    Animated,
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import BackButton from "../components/BackButton";

const TIMER_MINUTES = {
  min: 1,
  max: 9999,
  default: 30,
};

const SLEEP_SOUNDS = {
  thunderstorm: require("../assets/sounds/light-thunder.mp3"),
};
const KEEP_AWAKE_TAG = "sidereum-sleep-timer";
const SLEEP_VOLUME = 0.7;
const FADE_OUT_SECONDS = 5;
const FADE_OUT_INTERVAL_MS = 250;

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function Sleep() {
  const { sound } = useLocalSearchParams();
  const selectedSound = SLEEP_SOUNDS[sound] ?? SLEEP_SOUNDS.thunderstorm;
  const player = useAudioPlayer(selectedSound, {
    updateInterval: 1000,
  });
  const blackScreenOpacity = useRef(new Animated.Value(0)).current;
  const [duration, setDuration] = useState(TIMER_MINUTES.default * 60);
  const [durationInput, setDurationInput] = useState(
    String(TIMER_MINUTES.default)
  );
  const [remainingSeconds, setRemainingSeconds] = useState(
    TIMER_MINUTES.default * 60
  );
  const [endTimeMs, setEndTimeMs] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isEditingDuration, setIsEditingDuration] = useState(false);
  const [isScreenDimmed, setIsScreenDimmed] = useState(false);
  const [isShowingStoppedTime, setIsShowingStoppedTime] = useState(false);
  const [audioError, setAudioError] = useState("");

  const configureAudio = useCallback(() => {
    return setAudioModeAsync({
      allowsRecording: false,
      interruptionMode: "doNotMix",
      playsInSilentMode: true,
      shouldPlayInBackground: false,
      shouldRouteThroughEarpiece: false,
      interruptionModeAndroid: "doNotMix",
    }).catch(() => {
      setAudioError("Audio could not be prepared on this device.");
    });
  }, []);

  useEffect(() => {
    player.loop = true;
    player.volume = SLEEP_VOLUME;

    configureAudio();

    return undefined;
  }, [configureAudio, player]);

  useEffect(() => {
    if (!isRunning) {
      deactivateKeepAwake(KEEP_AWAKE_TAG).catch(() => {});
      return undefined;
    }

    activateKeepAwakeAsync(KEEP_AWAKE_TAG).catch(() => {});

    return () => {
      deactivateKeepAwake(KEEP_AWAKE_TAG).catch(() => {});
    };
  }, [isRunning]);

  const showBlackScreen = useCallback(() => {
    setIsScreenDimmed(true);
    blackScreenOpacity.stopAnimation();
    Animated.timing(blackScreenOpacity, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();
  }, [blackScreenOpacity]);

  const hideBlackScreen = useCallback(() => {
    blackScreenOpacity.stopAnimation();
    Animated.timing(blackScreenOpacity, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setIsScreenDimmed(false);
      }
    });
  }, [blackScreenOpacity]);

  const releaseKeepAwake = useCallback(() => {
    deactivateKeepAwake(KEEP_AWAKE_TAG).catch(() => {});
  }, []);

  const pausePlayer = useCallback(() => {
    try {
      player.pause();
    } catch {
      setAudioError("The sleep sound could not be paused.");
    }
  }, [player]);

  const restartPlayer = useCallback(() => {
    player.seekTo(0).catch(() => {});
  }, [player]);

  const finishTimer = useCallback(() => {
    releaseKeepAwake();
    pausePlayer();
    restartPlayer();
    setEndTimeMs(null);
    setIsRunning(false);
    setIsShowingStoppedTime(false);
    setRemainingSeconds(0);
  }, [pausePlayer, releaseKeepAwake, restartPlayer]);

  const syncRemainingTime = useCallback(() => {
    if (!endTimeMs) {
      return;
    }

    const nextRemainingSeconds = Math.max(
      0,
      Math.ceil((endTimeMs - Date.now()) / 1000)
    );

    setRemainingSeconds(nextRemainingSeconds);

    if (nextRemainingSeconds === 0) {
      finishTimer();
    }
  }, [endTimeMs, finishTimer]);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      syncRemainingTime();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning, syncRemainingTime]);

  useEffect(() => {
    if (!isRunning || !endTimeMs) {
      return undefined;
    }

    const fadeOutVolume = () => {
      const millisecondsRemaining = Math.max(0, endTimeMs - Date.now());
      const fadeOutMilliseconds = FADE_OUT_SECONDS * 1000;

      if (millisecondsRemaining > fadeOutMilliseconds) {
        player.volume = SLEEP_VOLUME;
        return;
      }

      player.volume =
        SLEEP_VOLUME * (millisecondsRemaining / fadeOutMilliseconds);
    };

    fadeOutVolume();
    const intervalId = setInterval(fadeOutVolume, FADE_OUT_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [endTimeMs, isRunning, player]);

  const chooseDurationMinutes = useCallback(
    (minutes) => {
      if (isRunning) {
        return;
      }

      const clampedMinutes = clamp(
        minutes,
        TIMER_MINUTES.min,
        TIMER_MINUTES.max
      );
      const seconds = clampedMinutes * 60;

      setDuration(seconds);
      setDurationInput(String(clampedMinutes));
      setRemainingSeconds(seconds);
      setEndTimeMs(null);
      setIsShowingStoppedTime(false);
    },
    [isRunning]
  );

  const updateDurationInput = (nextValue) => {
    if (isRunning) {
      return;
    }

    const numericValue = nextValue.replace(/\D/g, "").slice(0, 4);

    setDurationInput(numericValue);

    if (numericValue) {
      chooseDurationMinutes(Number(numericValue));
    }
  };

  const commitDurationInput = () => {
    chooseDurationMinutes(Number(durationInput) || TIMER_MINUTES.min);
    setIsEditingDuration(false);
    Keyboard.dismiss();
  };

  const startTimer = async () => {
    setAudioError("");
    setIsEditingDuration(false);
    Keyboard.dismiss();

    const secondsToRun =
      remainingSeconds > 0 && remainingSeconds < duration
        ? remainingSeconds
        : duration;

    setRemainingSeconds(secondsToRun);
    setIsShowingStoppedTime(false);
    setEndTimeMs(Date.now() + secondsToRun * 1000);
    setIsRunning(true);

    try {
      await configureAudio();
      player.loop = true;
      player.volume = SLEEP_VOLUME;
      if (secondsToRun === duration) {
        await player.seekTo(0);
      }
      player.play();
    } catch {
      setEndTimeMs(null);
      setIsRunning(false);
      setIsShowingStoppedTime(true);
      setAudioError("The sleep sound could not be started.");
    }
  };

  const stopTimer = () => {
    const nextRemainingSeconds = endTimeMs
      ? Math.max(0, Math.ceil((endTimeMs - Date.now()) / 1000))
      : remainingSeconds;

    pausePlayer();
    player.volume = SLEEP_VOLUME;
    hideBlackScreen();
    releaseKeepAwake();
    setEndTimeMs(null);
    setIsRunning(false);
    setIsShowingStoppedTime(true);
    setRemainingSeconds(nextRemainingSeconds);
  };

  const resetTimer = () => {
    pausePlayer();
    player.volume = SLEEP_VOLUME;
    hideBlackScreen();
    releaseKeepAwake();
    setEndTimeMs(null);
    setIsRunning(false);
    setIsShowingStoppedTime(false);
    setRemainingSeconds(duration);
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={isScreenDimmed} />
      <BackButton opacity={blackScreenOpacity} />

      <Text style={styles.title}>Sleep</Text>

      <View style={styles.timerSlot}>
        {isRunning || isShowingStoppedTime ? (
          <View style={styles.timerReadout}>
            <Text style={styles.timer}>{formatTime(remainingSeconds)}</Text>
          </View>
        ) : (
          <View style={styles.timerEditor}>
            <TextInput
              accessibilityLabel="Timer minutes"
              keyboardType="number-pad"
              maxLength={4}
              selectTextOnFocus
              style={styles.timerInput}
              value={durationInput}
              onBlur={commitDurationInput}
              onChangeText={updateDurationInput}
              onFocus={() => setIsEditingDuration(true)}
              onSubmitEditing={commitDurationInput}
            />
            <Text style={styles.timerUnit}>min</Text>
          </View>
        )}
      </View>

      {isEditingDuration && !isRunning ? (
        <Pressable style={styles.doneButton} onPress={commitDurationInput}>
          <Text style={styles.doneButtonText}>Done</Text>
        </Pressable>
      ) : null}

      <View style={styles.controlsStack}>
        <Pressable
          style={[styles.primaryButton, isRunning && styles.disabledButton]}
          disabled={isRunning}
          onPress={startTimer}
        >
          <Text style={styles.primaryButtonText}>
            {isRunning
              ? "Timer Running"
              : isShowingStoppedTime
                ? "Resume"
                : "Start Timer"}
          </Text>
        </Pressable>

        <View style={styles.controlSlot}>
          {isRunning ? (
            <Pressable style={styles.stopButton} onPress={stopTimer}>
              <Text style={styles.stopButtonText}>Stop</Text>
            </Pressable>
          ) : null}

          {isShowingStoppedTime ? (
            <Pressable style={styles.resetButton} onPress={resetTimer}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.controlSlot}>
          {isRunning ? (
            <Pressable
              style={[
                styles.dimButton,
                isScreenDimmed && { opacity: 0.3 },
              ]}
              onPress={isScreenDimmed ? hideBlackScreen : showBlackScreen}
            >
              <Text style={styles.dimButtonText}>Dim</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      {audioError ? <Text style={styles.errorText}>{audioError}</Text> : null}
      {isScreenDimmed ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Show sleep timer controls"
          onPress={hideBlackScreen}
          style={StyleSheet.absoluteFill}
        >
          <Animated.View
            pointerEvents="none"
            style={[styles.blackScreen, { opacity: blackScreenOpacity }]}
          />
        </Pressable>
      ) : null}
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
  timerSlot: {
    minHeight: 92,
    justifyContent: "center",
  },
  timer: {
    fontSize: 56,
    fontWeight: "800",
    color: "#ffffff",
  },
  timerReadout: {
    alignItems: "center",
  },
  timerEditor: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  timerInput: {
    minWidth: 96,
    textAlign: "center",
    fontSize: 56,
    fontWeight: "800",
    color: "#ffffff",
  },
  timerUnit: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: "700",
    color: "#cbd5e1",
  },
  doneButton: {
    minWidth: 96,
    alignItems: "center",
    borderRadius: 8,
    borderColor: "#475569",
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  doneButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#dbeafe",
  },
  primaryButton: {
    minWidth: 180,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#2563eb",
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#ffffff",
  },
  controlsStack: {
    alignItems: "center",
    gap: 16,
    minHeight: 170,
  },
  controlSlot: {
    minHeight: 50,
    justifyContent: "center",
  },
  stopButton: {
    minWidth: 180,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#7f1d1d",
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  stopButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fee2e2",
  },
  resetButton: {
    minWidth: 180,
    alignItems: "center",
    borderRadius: 8,
    borderColor: "#475569",
    borderWidth: 1,
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  resetButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#dbeafe",
  },
  dimButton: {
    minWidth: 180,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#111827",
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  dimButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#dbeafe",
  },
  disabledButton: {
    opacity: 0.55,
  },
  errorText: {
    maxWidth: 280,
    textAlign: "center",
    fontSize: 14,
    color: "#fecaca",
  },
  blackScreen: {
    flex: 1,
    backgroundColor: "#000000",
  },
});
