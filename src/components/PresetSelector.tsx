import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { BowlPreset, PRESETS } from '../audio/presets';

interface Props {
  selectedPreset: BowlPreset;
  onPresetChange: (preset: BowlPreset) => void;
}

export default function PresetSelector({ selectedPreset, onPresetChange }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Bowl Type</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {PRESETS.map((preset) => {
          const isSelected = preset.id === selectedPreset.id;
          return (
            <TouchableOpacity
              key={preset.id}
              style={[
                styles.chip,
                isSelected && {
                  backgroundColor: preset.color + '25',
                  borderColor: preset.color,
                },
              ]}
              onPress={() => onPresetChange(preset)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.dot,
                  { backgroundColor: preset.color },
                ]}
              />
              <Text
                style={[
                  styles.chipName,
                  isSelected && { color: preset.color },
                ]}
                numberOfLines={1}
              >
                {preset.nameKo}
              </Text>
              <Text style={styles.chipDesc} numberOfLines={1}>
                {preset.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#5A5A6E',
    textTransform: 'uppercase',
    letterSpacing: 2,
    paddingHorizontal: 4,
  },
  scrollContent: {
    gap: 10,
    paddingRight: 20,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#1A1A2E',
    borderWidth: 1,
    borderColor: '#2A2A3E',
    minWidth: 110,
    gap: 3,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 2,
  },
  chipName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E8E0D0',
  },
  chipDesc: {
    fontSize: 11,
    color: '#6A6A7E',
  },
});
