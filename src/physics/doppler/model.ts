/**
 * EQUATION 1 — Doppler Effect Physics Calculation Engine
 * Deterministic formulas for:
 * - Observed frequency with moving source and moving observer
 * - Wavelength compression in front and expansion behind
 * - Mach number and relativistic caveats
 * - Preset experiments configuration
 */

import { DopplerParameters, DopplerDerivedValues, DopplerPreset } from './types';

/**
 * Calculates observed frequency using the general Doppler formula for sound in a stationary medium:
 * f_obs = f_source * (v + v_observer) / (v - v_source)
 *
 * Sign conventions:
 * - v_observer > 0: Observer moves toward source
 * - v_observer < 0: Observer moves away from source
 * - v_source > 0: Source moves toward observer
 * - v_source < 0: Source moves away from observer
 */
export function calculateObservedFrequency(
  fSource: number,
  soundSpeed: number,
  vSource: number,
  vObserver: number
): number {
  if (fSource <= 0 || soundSpeed <= 0) return 0;

  // Clamp source velocity to remain subsonic (v_source < v)
  const safeVSource = Math.min(soundSpeed - 5, Math.max(-soundSpeed + 5, vSource));
  const denominator = soundSpeed - safeVSource;
  const numerator = soundSpeed + vObserver;

  if (denominator <= 0) return fSource * 10; // safety ceiling

  return fSource * (numerator / denominator);
}

/**
 * Calculates compressed wavelength in front of the moving source:
 * λ_front = (v - v_source) / f_source
 */
export function calculateWavelengthFront(
  fSource: number,
  soundSpeed: number,
  vSource: number
): number {
  if (fSource <= 0) return 0;
  const safeVSource = Math.min(soundSpeed - 5, vSource);
  return (soundSpeed - safeVSource) / fSource;
}

/**
 * Calculates expanded wavelength behind the moving source:
 * λ_behind = (v + v_source) / f_source
 */
export function calculateWavelengthBehind(
  fSource: number,
  soundSpeed: number,
  vSource: number
): number {
  if (fSource <= 0) return 0;
  return (soundSpeed + vSource) / fSource;
}

/**
 * Evaluates all derived invariant quantities for the Doppler experiment
 */
export function computeDopplerDerivedValues(
  params: DopplerParameters
): DopplerDerivedValues {
  const { sourceFrequency: fs, speedOfSound: v, sourceVelocity: vs, observerVelocity: vo } = params;

  const fObs = calculateObservedFrequency(fs, v, vs, vo);
  const deltaF = fObs - fs;
  const relativeShiftPercent = fs > 0 ? (deltaF / fs) * 100 : 0;

  const lambdaFront = calculateWavelengthFront(fs, v, vs);
  const lambdaBehind = calculateWavelengthBehind(fs, v, vs);
  const lambda0 = fs > 0 ? v / fs : 0;

  const machNumberSource = v > 0 ? Math.abs(vs) / v : 0;
  const machNumberObserver = v > 0 ? Math.abs(vo) / v : 0;

  let regime: DopplerDerivedValues['regime'] = 'stationary';
  let explanationText = 'The observed frequency equals the emitted frequency.';

  // Relative approaching vs receding net motion
  const netRelativeApproach = vs + vo;
  if (Math.abs(netRelativeApproach) < 0.1) {
    regime = 'stationary';
    explanationText = 'When there is no relative motion along the line of sight, the observed frequency equals the emitted frequency.';
  } else if (netRelativeApproach > 0) {
    regime = 'approaching';
    explanationText = 'The observed frequency increases. The sound is perceived as higher in pitch.';
  } else {
    regime = 'receding';
    explanationText = 'The observed frequency decreases. The sound is perceived as lower in pitch.';
  }

  return {
    observedFrequency: fObs,
    frequencyShift: deltaF,
    relativeShiftPercent,
    wavelengthFront: lambdaFront,
    wavelengthBehind: lambdaBehind,
    stationaryWavelength: lambda0,
    machNumberSource,
    machNumberObserver,
    regime,
    explanationText,
  };
}

/**
 * 6 Presets as requested by Part 9
 */
export const DOPPLER_PRESETS: DopplerPreset[] = [
  {
    id: 'stationary',
    name: '1. Stationary Source',
    tagline: 'vs = 0, vo = 0',
    description: 'Source and observer are both stationary. Wavefronts form symmetric concentric circles and emitted equals observed frequency.',
    params: {
      sourceFrequency: 500,
      speedOfSound: 343,
      sourceVelocity: 0,
      observerVelocity: 0,
      animationSpeed: 1.0,
    },
  },
  {
    id: 'source-approaching',
    name: '2. Source Approaching',
    tagline: 'vs = +30 m/s',
    description: 'Source moves toward the observer. Wavefronts crowd together in front, causing an increased pitch.',
    params: {
      sourceFrequency: 500,
      speedOfSound: 343,
      sourceVelocity: 30,
      observerVelocity: 0,
      animationSpeed: 1.0,
    },
  },
  {
    id: 'source-receding',
    name: '3. Source Receding',
    tagline: 'vs = -30 m/s',
    description: 'Source moves away from the observer. Wavefronts spread out in front of the observer, decreasing observed frequency.',
    params: {
      sourceFrequency: 500,
      speedOfSound: 343,
      sourceVelocity: -30,
      observerVelocity: 0,
      animationSpeed: 1.0,
    },
  },
  {
    id: 'observer-approaching',
    name: '4. Observer Approaching',
    tagline: 'vs = 0, vo = +20 m/s',
    description: 'Stationary source with observer driving toward it. Observer encounters more wavefronts per unit time, raising pitch.',
    params: {
      sourceFrequency: 500,
      speedOfSound: 343,
      sourceVelocity: 0,
      observerVelocity: 20,
      animationSpeed: 1.0,
    },
  },
  {
    id: 'observer-receding',
    name: '5. Observer Receding',
    tagline: 'vs = 0, vo = -20 m/s',
    description: 'Stationary source with observer moving away. Observer intercepts fewer wavefronts per second, lowering pitch.',
    params: {
      sourceFrequency: 500,
      speedOfSound: 343,
      sourceVelocity: 0,
      observerVelocity: -20,
      animationSpeed: 1.0,
    },
  },
  {
    id: 'high-speed',
    name: '6. Higher Source Speed',
    tagline: 'vs = +80 m/s',
    description: 'High subsonic source velocity (~Mach 0.23). Observe severe wavefront compression and a dramatic pitch rise.',
    params: {
      sourceFrequency: 500,
      speedOfSound: 343,
      sourceVelocity: 80,
      observerVelocity: 0,
      animationSpeed: 1.0,
    },
  },
];
