import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';

interface Props {
  step: number;
  onStepChange: (step: number) => void;
}

export default function StepInput({ step, onStepChange }: Props) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handlePress = () => {
    setInputValue(String(step));
    setEditing(true);
  };

  const handleSubmit = () => {
    const val = parseFloat(inputValue);
    if (!isNaN(val) && val > 0) {
      onStepChange(Math.min(100, val));
    }
    setEditing(false);
    Keyboard.dismiss();
  };

  if (editing) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Step</Text>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          keyboardType="numeric"
          autoFocus
          selectTextOnFocus
          onSubmitEditing={handleSubmit}
          onBlur={handleSubmit}
          maxLength={5}
        />
        <Text style={styles.unit}>Hz</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Text style={styles.label}>Step</Text>
      <Text style={styles.value}>{step}</Text>
      <Text style={styles.unit}>Hz</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
  },
  label: {
    fontSize: 14,
    color: '#8A8070',
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#C9A050',
    fontVariant: ['tabular-nums'],
  },
  unit: {
    fontSize: 14,
    color: '#8A8070',
  },
  input: {
    fontSize: 18,
    fontWeight: '600',
    color: '#C9A050',
    borderBottomWidth: 1,
    borderBottomColor: '#C9A050',
    minWidth: 50,
    textAlign: 'center',
    padding: 0,
  },
});
