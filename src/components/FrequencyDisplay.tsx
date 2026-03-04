import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { FREQUENCY_MIN, FREQUENCY_MAX } from '../audio/presets';

interface Props {
  frequency: number;
  onFrequencyChange: (freq: number) => void;
}

export default function FrequencyDisplay({ frequency, onFrequencyChange }: Props) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handlePress = () => {
    setInputValue(String(Math.round(frequency)));
    setEditing(true);
  };

  const handleSubmit = () => {
    const val = parseFloat(inputValue);
    if (!isNaN(val)) {
      const clamped = Math.min(FREQUENCY_MAX, Math.max(FREQUENCY_MIN, val));
      onFrequencyChange(clamped);
    }
    setEditing(false);
    Keyboard.dismiss();
  };

  if (editing) {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          keyboardType="numeric"
          autoFocus
          selectTextOnFocus
          onSubmitEditing={handleSubmit}
          onBlur={handleSubmit}
          maxLength={7}
        />
        <Text style={styles.unit}>Hz</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Text style={styles.frequency}>{frequency.toFixed(1)}</Text>
      <Text style={styles.unit}>Hz</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  frequency: {
    fontSize: 48,
    fontWeight: '300',
    color: '#E8E0D0',
    fontVariant: ['tabular-nums'],
  },
  unit: {
    fontSize: 20,
    color: '#8A8070',
    marginLeft: 6,
  },
  input: {
    fontSize: 48,
    fontWeight: '300',
    color: '#C9A050',
    borderBottomWidth: 2,
    borderBottomColor: '#C9A050',
    minWidth: 160,
    textAlign: 'center',
    padding: 0,
  },
});
