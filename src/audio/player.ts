import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { BowlPreset } from './presets';
import { generateBowlSamples, getEffectiveDuration } from './engine';
import { encodeWavBase64 } from './wav';

let currentSound: Audio.Sound | null = null;

/**
 * Generate and play a singing bowl strike sound.
 * Stops any currently playing sound first.
 */
export async function playBowlStrike(
  frequency: number,
  preset: BowlPreset,
): Promise<void> {
  // Stop previous sound
  await stopSound();

  // Configure audio mode
  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    staysActiveInBackground: true,
  });

  // Generate audio
  const duration = getEffectiveDuration(preset);
  const samples = generateBowlSamples(frequency, preset, duration);
  const wavBase64 = encodeWavBase64(samples);

  // Write to temp file
  const filePath = FileSystem.cacheDirectory + 'singing_bowl.wav';
  await FileSystem.writeAsStringAsync(filePath, wavBase64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Play
  const { sound } = await Audio.Sound.createAsync(
    { uri: filePath },
    { shouldPlay: true, volume: 1.0 },
  );
  currentSound = sound;

  // Auto-cleanup when playback finishes
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.isLoaded && status.didJustFinish) {
      sound.unloadAsync();
      if (currentSound === sound) {
        currentSound = null;
      }
    }
  });
}

/**
 * Stop currently playing sound.
 */
export async function stopSound(): Promise<void> {
  if (currentSound) {
    try {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
    } catch {
      // already unloaded
    }
    currentSound = null;
  }
}

/**
 * Returns true if a sound is currently playing.
 */
export function isPlaying(): boolean {
  return currentSound !== null;
}
