import { BowlPreset } from './presets';

const SAMPLE_RATE = 44100;
const TWO_PI = 2 * Math.PI;

/**
 * Generate singing bowl audio samples.
 *
 * Each partial is rendered as a pair of slightly detuned sine waves
 * to produce the characteristic beating effect:
 *   sin(f + detune/2) + sin(f - detune/2) → amplitude-modulated tone
 *
 * Higher partials decay faster than lower ones, matching real bowl physics.
 */
export function generateBowlSamples(
  frequency: number,
  preset: BowlPreset,
  duration: number,
): Float32Array {
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(numSamples);
  const attackSamples = Math.floor(preset.attackTime * SAMPLE_RATE);

  // Pre-compute per-partial constants
  const allPartials = [...preset.partials];
  if (preset.subHarmonic) {
    allPartials.push(preset.subHarmonic);
  }

  const partialData = allPartials.map((p, index) => {
    const baseFreq = frequency * p.ratio;
    // Each partial gets a slightly different beat detune for natural feel
    const detuneScale = 1 + index * 0.15;
    const detune = preset.beatFrequency * detuneScale;
    return {
      freqA: TWO_PI * (baseFreq + detune * 0.5) / SAMPLE_RATE,
      freqB: TWO_PI * (baseFreq - detune * 0.5) / SAMPLE_RATE,
      amplitude: p.amplitude,
      decayRate: 1.0 / (p.decay * SAMPLE_RATE),
    };
  });

  // Compute peak amplitude for normalisation
  let peakAmplitude = 0;
  for (const pd of partialData) {
    peakAmplitude += pd.amplitude;
  }
  const normFactor = 0.9 / peakAmplitude;

  for (let i = 0; i < numSamples; i++) {
    let sample = 0;
    const t = i; // sample index used for phase accumulation

    for (const pd of partialData) {
      // Exponential decay envelope
      const envelope = Math.exp(-i * pd.decayRate);
      // Two detuned oscillators create beating
      const oscA = Math.sin(pd.freqA * t);
      const oscB = Math.sin(pd.freqB * t);
      sample += pd.amplitude * envelope * 0.5 * (oscA + oscB);
    }

    // Attack envelope (fade in to avoid click)
    if (i < attackSamples) {
      sample *= i / attackSamples;
    }

    samples[i] = sample * normFactor;
  }

  return samples;
}

/**
 * Compute effective duration: time until all partials decay below threshold.
 * Capped between 8 and 25 seconds for practical playback.
 */
export function getEffectiveDuration(preset: BowlPreset): number {
  const threshold = 0.01; // -40dB
  let maxTime = 0;
  for (const p of preset.partials) {
    // exp(-t/decay) = threshold → t = -decay * ln(threshold)
    const t = -p.decay * Math.log(threshold);
    if (t > maxTime) maxTime = t;
  }
  // Clamp between 8s and 25s
  return Math.min(25, Math.max(8, maxTime));
}

export { SAMPLE_RATE };
