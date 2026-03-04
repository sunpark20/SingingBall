import { AudioContext, GainNode } from 'react-native-audio-api';
import { BowlPreset } from './presets';

// Shared AudioContext (reuse across strikes)
let audioContext: AudioContext | null = null;

// Track active nodes for stop functionality
let activeGains: InstanceType<typeof GainNode>[] = [];

function getAudioContext(): AudioContext {
  if (!audioContext || audioContext.state === 'closed') {
    audioContext = new AudioContext();
  }
  return audioContext;
}

/**
 * Play a singing bowl strike using Web Audio API oscillators.
 *
 * Each partial is rendered as a pair of slightly detuned sine oscillators
 * connected through a GainNode with exponential decay — identical to the
 * physics of a real singing bowl's beating effect.
 *
 * Latency: <50ms (no file I/O, no WAV encoding).
 */
export function playBowlStrike(frequency: number, preset: BowlPreset): void {
  stopSound();

  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const attackTime = preset.attackTime;

  // Collect all partials (including sub-harmonic if present)
  const allPartials = [...preset.partials];
  if (preset.subHarmonic) {
    allPartials.push(preset.subHarmonic);
  }

  // Normalisation factor (same logic as old engine.ts)
  let peakAmplitude = 0;
  for (const p of allPartials) {
    peakAmplitude += p.amplitude;
  }
  const normFactor = 0.9 / peakAmplitude;

  const gains: InstanceType<typeof GainNode>[] = [];

  allPartials.forEach((partial, index) => {
    const baseFreq = frequency * partial.ratio;

    // Each partial gets a slightly different beat detune for natural feel
    const detuneScale = 1 + index * 0.15;
    const detune = preset.beatFrequency * detuneScale;

    const freqA = baseFreq + detune * 0.5;
    const freqB = baseFreq - detune * 0.5;

    // Skip partials above Nyquist
    if (freqA > 20000 || freqB > 20000) return;

    const amplitude = partial.amplitude * normFactor * 0.5; // 0.5 because two oscillators

    // GainNode for this partial's envelope
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    gains.push(gainNode);

    // Attack: ramp from 0 to amplitude
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(amplitude, now + attackTime);

    // Decay: exponential ramp down
    // exponentialRampToValueAtTime cannot reach 0, so ramp to very small value
    const decayEnd = now + attackTime + partial.decay;
    gainNode.gain.exponentialRampToValueAtTime(0.0001, decayEnd);
    gainNode.gain.setValueAtTime(0, decayEnd + 0.01);

    // Oscillator A (detuned up)
    const oscA = ctx.createOscillator();
    oscA.type = 'sine';
    oscA.frequency.setValueAtTime(freqA, now);
    oscA.connect(gainNode);
    oscA.start(now);
    oscA.stop(decayEnd + 0.02);

    // Oscillator B (detuned down)
    const oscB = ctx.createOscillator();
    oscB.type = 'sine';
    oscB.frequency.setValueAtTime(freqB, now);
    oscB.connect(gainNode);
    oscB.start(now);
    oscB.stop(decayEnd + 0.02);
  });

  activeGains = gains;
}

/**
 * Stop all currently playing oscillators immediately.
 */
export function stopSound(): void {
  if (activeGains.length === 0) return;

  const ctx = getAudioContext();
  const now = ctx.currentTime;

  for (const gain of activeGains) {
    try {
      // Quick fade out to avoid click (20ms)
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.02);
    } catch {
      // Node already disconnected
    }
  }

  activeGains = [];
}

/**
 * Compute effective duration for UI timer.
 */
export function getEffectiveDuration(preset: BowlPreset): number {
  const threshold = 0.01;
  let maxTime = 0;
  for (const p of preset.partials) {
    const t = -p.decay * Math.log(threshold);
    if (t > maxTime) maxTime = t;
  }
  return Math.min(25, Math.max(8, maxTime));
}
