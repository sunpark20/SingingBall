import React, { useRef } from 'react';
import {
  View,
  PanResponder,
  StyleSheet,
  LayoutChangeEvent,
  Text,
} from 'react-native';
import { FREQUENCY_MIN, FREQUENCY_MAX } from '../audio/presets';

interface Props {
  frequency: number;
  onFrequencyChange: (freq: number) => void;
  presetColor: string;
}

export default function VerticalSlider({
  frequency,
  onFrequencyChange,
  presetColor,
}: Props) {
  const trackHeight = useRef(0);
  const trackY = useRef(0);

  const freqToPosition = (freq: number): number => {
    const ratio = (freq - FREQUENCY_MIN) / (FREQUENCY_MAX - FREQUENCY_MIN);
    return (1 - ratio) * trackHeight.current;
  };

  const positionToFreq = (y: number): number => {
    const ratio = 1 - y / trackHeight.current;
    const clamped = Math.max(0, Math.min(1, ratio));
    return FREQUENCY_MIN + clamped * (FREQUENCY_MAX - FREQUENCY_MIN);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const y = evt.nativeEvent.locationY;
        onFrequencyChange(Math.round(positionToFreq(y)));
      },
      onPanResponderMove: (evt) => {
        const y = evt.nativeEvent.locationY;
        onFrequencyChange(Math.round(positionToFreq(y)));
      },
    }),
  ).current;

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height, y } = event.nativeEvent.layout;
    trackHeight.current = height;
    trackY.current = y;
  };

  const thumbPosition = freqToPosition(frequency);
  const fillHeight =
    trackHeight.current > 0
      ? trackHeight.current - thumbPosition
      : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{FREQUENCY_MAX}</Text>
      <View
        style={styles.track}
        onLayout={handleLayout}
        {...panResponder.panHandlers}
      >
        {/* Fill (from bottom) */}
        <View
          style={[
            styles.fill,
            {
              height: fillHeight,
              backgroundColor: presetColor + '30',
            },
          ]}
        />
        {/* Thumb */}
        <View
          style={[
            styles.thumb,
            {
              top: thumbPosition - 14,
              backgroundColor: presetColor,
            },
          ]}
        >
          <View style={styles.thumbLine} />
        </View>
        {/* Tick marks */}
        {[0.25, 0.5, 0.75].map((ratio) => (
          <View
            key={ratio}
            style={[
              styles.tick,
              { top: `${(1 - ratio) * 100}%` },
            ]}
          />
        ))}
      </View>
      <Text style={styles.label}>{FREQUENCY_MIN}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  track: {
    width: 40,
    height: 280,
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    overflow: 'visible',
    position: 'relative',
  },
  fill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  thumb: {
    position: 'absolute',
    left: -10,
    width: 60,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  thumbLine: {
    width: 20,
    height: 2,
    backgroundColor: '#fff',
    borderRadius: 1,
    opacity: 0.6,
  },
  tick: {
    position: 'absolute',
    left: 8,
    right: 8,
    height: 1,
    backgroundColor: '#2A2A3E',
  },
  label: {
    fontSize: 12,
    color: '#5A5A6E',
    marginVertical: 4,
    fontVariant: ['tabular-nums'],
  },
});
