/**
 * EQUATION 1 — Wave Interference Physics Model
 * Deterministic mathematical physics calculations for wave superposition,
 * point source geometry, path differences, effective phase shifts, and interferometry.
 */

import {
  SinusoidalWaveParams,
  WaveDerivedProperties,
  TwoSourceParameters,
  PointInterferenceAnalysis,
  InterferenceClassification,
} from './types';

/**
 * Calculates wave number k = 2π / λ (rad/m)
 */
export function calculateWaveNumber(wavelength: number): number {
  if (wavelength <= 0 || !Number.isFinite(wavelength)) return 0;
  return (2 * Math.PI) / wavelength;
}

/**
 * Calculates angular frequency ω = 2πf (rad/s)
 */
export function calculateAngularFrequency(frequency: number): number {
  if (frequency <= 0 || !Number.isFinite(frequency)) return 0;
  return 2 * Math.PI * frequency;
}

/**
 * Calculates wave period T = 1 / f (s)
 */
export function calculatePeriod(frequency: number): number {
  if (frequency <= 0 || !Number.isFinite(frequency)) return 0;
  return 1 / frequency;
}

/**
 * Calculates wave propagation speed v = fλ (m/s)
 */
export function calculateWaveSpeed(frequency: number, wavelength: number): number {
  if (frequency <= 0 || wavelength <= 0) return 0;
  return frequency * wavelength;
}

/**
 * Computes all standard derived kinematic wave invariants.
 */
export function computeWaveProperties(
  wavelength: number,
  frequency: number
): WaveDerivedProperties {
  return {
    waveNumber: calculateWaveNumber(wavelength),
    angularFrequency: calculateAngularFrequency(frequency),
    period: calculatePeriod(frequency),
    speed: calculateWaveSpeed(frequency, wavelength),
  };
}

/**
 * Calculates sinusoidal wave displacement at position x and time t:
 * y(x,t) = A sin(k x ∓ ω t + φ)
 * - forward: -ω t (propagates in +x direction)
 * - backward: +ω t (propagates in -x direction)
 */
export function calculateSinusoidalDisplacement(
  amplitude: number,
  k: number,
  omega: number,
  phiRad: number,
  x: number,
  t: number,
  direction: 'forward' | 'backward' = 'forward'
): number {
  if (amplitude <= 0) return 0;
  const phaseSign = direction === 'forward' ? -1 : +1;
  const argument = k * x + phaseSign * omega * t + phiRad;
  return amplitude * Math.sin(argument);
}

/**
 * Principle of Superposition: Linear algebraic summation of wave displacements
 * y_resultant = y1 + y2
 */
export function calculateSuperposition(y1: number, y2: number): number {
  return y1 + y2;
}

/**
 * Analytical resultant amplitude for two sinusoidal waves of identical frequency
 * and wave number with relative phase difference Δφ:
 * A_R = √(A1² + A2² + 2 A1 A2 cos(Δφ))
 */
export function calculateResultantAmplitude(
  A1: number,
  A2: number,
  deltaPhiRad: number
): number {
  if (A1 <= 0 && A2 <= 0) return 0;
  if (A1 <= 0) return Math.abs(A2);
  if (A2 <= 0) return Math.abs(A1);

  // Exact equal-amplitude optimization: A_R = 2A |cos(Δφ / 2)|
  if (Math.abs(A1 - A2) < 1e-12) {
    return 2 * A1 * Math.abs(Math.cos(deltaPhiRad / 2));
  }

  const radicand = A1 * A1 + A2 * A2 + 2 * A1 * A2 * Math.cos(deltaPhiRad);
  return Math.sqrt(Math.max(0, radicand));
}

/**
 * Euclidean distance between two spatial points (x1, y1) and (x2, y2)
 */
export function calculateDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Path difference between two point sources S1 and S2 to an observation point P:
 * Δr = r2 - r1
 */
export function calculatePathDifference(r1: number, r2: number): number {
  return r2 - r1;
}

/**
 * Effective phase difference at observation point P:
 * ΔΦ = k(r2 - r1) + (φ2 - φ1) = k Δr + Δφ0
 */
export function calculateEffectivePhaseDifference(
  k: number,
  pathDifference: number,
  sourcePhaseDifferenceRad: number
): number {
  return k * pathDifference + sourcePhaseDifferenceRad;
}

/**
 * Classifies interference based on effective phase difference ΔΦ:
 * - Constructive: ΔΦ ≈ 2πn (path diff ≈ nλ for in-phase sources)
 * - Destructive: ΔΦ ≈ (2n + 1)π (path diff ≈ (n + 1/2)λ for in-phase sources)
 * - Partial: Intermediate phase angles
 */
export function classifyInterference(
  effectivePhaseDiffRad: number,
  toleranceRad = 0.35
): { classification: InterferenceClassification; orderN: number } {
  // Normalize angle to [0, 2π)
  const twoPi = 2 * Math.PI;
  const modPhase = ((effectivePhaseDiffRad % twoPi) + twoPi) % twoPi;

  // Check distance to closest multiple of 2π (0 or 2π)
  const distToConstructive = Math.min(modPhase, twoPi - modPhase);
  // Check distance to odd multiple of π (π)
  const distToDestructive = Math.abs(modPhase - Math.PI);

  const exactOrder = effectivePhaseDiffRad / twoPi;
  const orderN = Math.round(exactOrder);

  if (distToConstructive <= toleranceRad) {
    return { classification: 'constructive', orderN };
  } else if (distToDestructive <= toleranceRad) {
    return { classification: 'destructive', orderN: Math.round(exactOrder - 0.5) };
  }
  return { classification: 'partial', orderN };
}

/**
 * Analyzes two-source interference at an observation point P(x, y).
 * Coordinates: S1 is at (0, +d/2), S2 is at (0, -d/2).
 */
export function analyzeTwoSourcePoint(
  params: TwoSourceParameters,
  probeX: number,
  probeY: number,
  time: number
): PointInterferenceAnalysis {
  const halfD = params.separation / 2;
  const s1X = 0;
  const s1Y = halfD;
  const s2X = 0;
  const s2Y = -halfD;

  const r1 = calculateDistance(s1X, s1Y, probeX, probeY);
  const r2 = calculateDistance(s2X, s2Y, probeX, probeY);

  const pathDifference = calculatePathDifference(r1, r2);
  const wavelength = Math.max(0.01, params.wavelength);
  const pathDifferenceInWavelengths = pathDifference / wavelength;

  const k = calculateWaveNumber(wavelength);
  const omega = calculateAngularFrequency(params.frequency);

  const phi1Rad = (params.sourcePhase1Deg * Math.PI) / 180;
  const phi2Rad = (params.sourcePhase2Deg * Math.PI) / 180;
  const sourcePhaseDiffRad = phi2Rad - phi1Rad;

  const effectivePhaseDiffRad = calculateEffectivePhaseDifference(
    k,
    pathDifference,
    sourcePhaseDiffRad
  );
  const effectivePhaseDiffDeg = (effectivePhaseDiffRad * 180) / Math.PI;

  // Instantaneous displacements:
  // Using circular expanding wave approximation y(r, t) = A * sin(k r - ω t + φ)
  // (We use a gentle 2D geometric decay factor 1 / √(1 + 0.1r) to maintain visible fringe contrast throughout the viewport)
  const decay1 = 1 / Math.sqrt(1 + 0.08 * r1);
  const decay2 = 1 / Math.sqrt(1 + 0.08 * r2);

  const a1Effective = params.amplitude1 * decay1;
  const a2Effective = params.amplitude2 * decay2;

  const y1Instantaneous = a1Effective * Math.sin(k * r1 - omega * time + phi1Rad);
  const y2Instantaneous = a2Effective * Math.sin(k * r2 - omega * time + phi2Rad);
  const yResultantInstantaneous = y1Instantaneous + y2Instantaneous;

  // Local theoretical max amplitude
  const resultantAmplitude = calculateResultantAmplitude(
    a1Effective,
    a2Effective,
    effectivePhaseDiffRad
  );

  // Time-averaged intensity I ∝ A_R²
  const baseAmp = Math.max(0.001, (params.amplitude1 + params.amplitude2) / 2);
  const relativeIntensity = (resultantAmplitude * resultantAmplitude) / (baseAmp * baseAmp);

  const { classification, orderN } = classifyInterference(effectivePhaseDiffRad);

  return {
    r1,
    r2,
    pathDifference,
    pathDifferenceInWavelengths,
    effectivePhaseDiffRad,
    effectivePhaseDiffDeg,
    y1Instantaneous,
    y2Instantaneous,
    yResultantInstantaneous,
    resultantAmplitude,
    relativeIntensity,
    classification,
    orderN,
  };
}

/**
 * Validates wave superposition parameters to prevent invalid inputs.
 */
export function validateSuperpositionParams(
  wave1: SinusoidalWaveParams,
  wave2: SinusoidalWaveParams
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (wave1.amplitude < 0 || !Number.isFinite(wave1.amplitude)) {
    errors.push('Wave 1 amplitude must be non-negative (A1 ≥ 0 m).');
  }
  if (wave2.amplitude < 0 || !Number.isFinite(wave2.amplitude)) {
    errors.push('Wave 2 amplitude must be non-negative (A2 ≥ 0 m).');
  }
  if (wave1.wavelength <= 0 || !Number.isFinite(wave1.wavelength)) {
    errors.push('Wave 1 wavelength must be strictly positive (λ1 > 0 m).');
  }
  if (wave2.wavelength <= 0 || !Number.isFinite(wave2.wavelength)) {
    errors.push('Wave 2 wavelength must be strictly positive (λ2 > 0 m).');
  }
  if (wave1.frequency <= 0 || !Number.isFinite(wave1.frequency)) {
    errors.push('Wave 1 frequency must be strictly positive (f1 > 0 Hz).');
  }
  if (wave2.frequency <= 0 || !Number.isFinite(wave2.frequency)) {
    errors.push('Wave 2 frequency must be strictly positive (f2 > 0 Hz).');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export interface Wave1DSample {
  x: number;
  y1: number;
  y2: number;
  yResultant: number;
}

export interface WaveTimeSample {
  time: number;
  y1: number;
  y2: number;
  yResultant: number;
}

/**
 * Generates 1D spatial wave displacement profiles at time t along a ray from S1 or along a horizontal axis.
 */
export function generate1DSpatialSamples(
  params: TwoSourceParameters,
  time: number,
  pointsCount = 120
): Wave1DSample[] {
  const k = calculateWaveNumber(params.wavelength);
  const omega = calculateAngularFrequency(params.frequency);
  const phi1 = (params.sourcePhase1Deg * Math.PI) / 180;
  const phi2 = (params.sourcePhase2Deg * Math.PI) / 180;
  const halfD = params.separation / 2;

  const samples: Wave1DSample[] = [];
  const maxX = params.fieldWidthMeters || 10;
  const step = maxX / (pointsCount - 1);

  for (let i = 0; i < pointsCount; i++) {
    const x = i * step;
    // Sample along y = params.probePoint.y
    const y = params.probePoint.y;
    const r1 = Math.sqrt(x * x + (y - halfD) * (y - halfD));
    const r2 = Math.sqrt(x * x + (y + halfD) * (y + halfD));

    const decay1 = 1 / Math.sqrt(1 + 0.08 * r1);
    const decay2 = 1 / Math.sqrt(1 + 0.08 * r2);

    const y1 = params.amplitude * decay1 * Math.sin(k * r1 - omega * time + phi1);
    const y2 = params.amplitude * decay2 * Math.sin(k * r2 - omega * time + phi2);
    const yResultant = y1 + y2;

    samples.push({ x, y1, y2, yResultant });
  }

  return samples;
}

/**
 * Generates temporal wave oscillation samples over two periods at probe point P.
 */
export function generate1DTimeSamples(
  params: TwoSourceParameters,
  currentTime: number,
  pointsCount = 100
): WaveTimeSample[] {
  const period = calculatePeriod(params.frequency);
  const startTime = Math.max(0, currentTime - period);
  const endTime = currentTime + period;
  const dt = (endTime - startTime) / (pointsCount - 1);

  const analysis = analyzeTwoSourcePoint(params, params.probePoint.x, params.probePoint.y, currentTime);
  const k = calculateWaveNumber(params.wavelength);
  const omega = calculateAngularFrequency(params.frequency);
  const phi1 = (params.sourcePhase1Deg * Math.PI) / 180;
  const phi2 = (params.sourcePhase2Deg * Math.PI) / 180;

  const samples: WaveTimeSample[] = [];
  for (let i = 0; i < pointsCount; i++) {
    const t = startTime + i * dt;
    const decay1 = 1 / Math.sqrt(1 + 0.08 * analysis.r1);
    const decay2 = 1 / Math.sqrt(1 + 0.08 * analysis.r2);

    const y1 = params.amplitude * decay1 * Math.sin(k * analysis.r1 - omega * t + phi1);
    const y2 = params.amplitude * decay2 * Math.sin(k * analysis.r2 - omega * t + phi2);
    const yResultant = y1 + y2;

    samples.push({ time: t, y1, y2, yResultant });
  }

  return samples;
}

