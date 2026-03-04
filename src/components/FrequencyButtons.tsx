import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FREQUENCY_MIN, FREQUENCY_MAX } from '../audio/presets';

interface Props {
  frequency: number;
  step: number;
  onFrequencyChange: (freq: number) => void;
}

export default function FrequencyButtons({
  frequency,
  step,
  onFrequencyChange,
}: Props) {
  const handleDecrease = () => {
    const newFreq = Math.max(FREQUENCY_MIN, frequency - step);
    onFrequencyChange(newFreq);
  };

  const handleIncrease = () => {
    const newFreq = Math.min(FREQUENCY_MAX, frequency + step);
    onFrequencyChange(newFreq);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handleDecrease}
        activeOpacity={0.6}
      >
        <Text style={styles.buttonText}>−</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleIncrease}
        activeOpacity={0.6}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1A1A2E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  buttonText: {
    fontSize: 28,
    color: '#E8E0D0',
    fontWeight: '300',
    marginTop: -2,
  },
});
