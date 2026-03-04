import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';

interface Props {
  onPress: () => void;
  isLoading: boolean;
  isPlaying: boolean;
  color: string;
}

export default function PlayButton({ onPress, isLoading, isPlaying, color }: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isPlaying ? color + '20' : color,
          borderColor: color,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="#0D0D1A" size="small" />
      ) : (
        <View style={styles.content}>
          <Text
            style={[
              styles.icon,
              { color: isPlaying ? color : '#0D0D1A' },
            ]}
          >
            {isPlaying ? '■' : '●'}
          </Text>
          <Text
            style={[
              styles.label,
              { color: isPlaying ? color : '#0D0D1A' },
            ]}
          >
            {isPlaying ? 'Stop' : 'Strike'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    fontSize: 18,
  },
  label: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
