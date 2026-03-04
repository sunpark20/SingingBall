import React, { useState, useCallback } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FrequencyDisplay from '../components/FrequencyDisplay';
import StepInput from '../components/StepInput';
import FrequencyButtons from '../components/FrequencyButtons';
import VerticalSlider from '../components/VerticalSlider';
import PlayButton from '../components/PlayButton';
import PresetSelector from '../components/PresetSelector';
import { BowlPreset, PRESETS, DEFAULT_FREQUENCY, DEFAULT_STEP } from '../audio/presets';
import { playBowlStrike, stopSound } from '../audio/player';

export default function HomeScreen() {
  const [frequency, setFrequency] = useState(DEFAULT_FREQUENCY);
  const [step, setStep] = useState(DEFAULT_STEP);
  const [preset, setPreset] = useState<BowlPreset>(PRESETS[2]); // Thadobati default
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlay = useCallback(async () => {
    if (isPlaying) {
      await stopSound();
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    try {
      await playBowlStrike(frequency, preset);
      setIsPlaying(true);
      // Auto-reset when sound finishes (based on duration)
      const duration = Math.min(25, Math.max(8, preset.partials[0].decay * 4.6));
      setTimeout(() => setIsPlaying(false), duration * 1000);
    } catch (e) {
      console.error('Playback error:', e);
    } finally {
      setIsLoading(false);
    }
  }, [frequency, preset, isPlaying]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Preset Selector (top) */}
        <PresetSelector selectedPreset={preset} onPresetChange={setPreset} />

        {/* Frequency Display */}
        <FrequencyDisplay
          frequency={frequency}
          onFrequencyChange={setFrequency}
        />

        {/* Step Input */}
        <View style={styles.stepRow}>
          <StepInput step={step} onStepChange={setStep} />
        </View>

        {/* Main Control Area: Buttons + Slider */}
        <View style={styles.controlArea}>
          {/* - Button */}
          <View style={styles.sideControl}>
            <FrequencyButtons
              frequency={frequency}
              step={step}
              onFrequencyChange={setFrequency}
            />
          </View>

          {/* Vertical Slider */}
          <VerticalSlider
            frequency={frequency}
            onFrequencyChange={setFrequency}
            presetColor={preset.color}
          />
        </View>

        {/* Play Button (bottom) */}
        <View style={styles.playArea}>
          <PlayButton
            onPress={handlePlay}
            isLoading={isLoading}
            isPlaying={isPlaying}
            color={preset.color}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0D0D1A',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  stepRow: {
    alignItems: 'center',
    marginTop: 4,
  },
  controlArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    flex: 1,
  },
  sideControl: {
    justifyContent: 'center',
  },
  playArea: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
