/**
 * EQUATION 1 — Resonance Physics Model & Numerical Engine
 * Deterministic physics calculations:
 * - Natural frequencies (undamped, damped, and resonance displacement peak)
 * - Steady-state amplitude and phase response formulas
 * - High-precision 4th-Order Runge-Kutta (RK4) numerical integration for transient and steady-state dynamics
 * - Energy conservation and power dissipation accounting
 */

import {
  ResonanceParameters,
  OscillatorDerivedValues,
  LiveOscillatorState,
  ResonanceCurvePoint,
} from './types';

/**
 * Calculates undamped natural angular frequency ω_0 = √(k/m) (rad/s)
 */
export function calculateNaturalAngularFrequency(m: number, k: number): number {
  if (m <= 0 || k <= 0) return 0;
  return Math.sqrt(k / m);
}

/**
 * Calculates undamped natural frequency f_0 = (1 / 2π) √(k/m) (Hz)
 */
export function calculateNaturalFrequencyHz(m: number, k: number): number {
  return calculateNaturalAngularFrequency(m, k) / (2 * Math.PI);
}

/**
 * Calculates damped free oscillation angular frequency ω_damped = √(ω_0² - (c / 2m)²) (rad/s)
 * Returns null if critically damped or overdamped (radicand ≤ 0).
 */
export function calculateDampedAngularFrequency(
  m: number,
  k: number,
  c: number
): number | null {
  if (m <= 0 || k <= 0) return null;
  const omega0 = calculateNaturalAngularFrequency(m, k);
  const gamma = c / (2 * m);
  const radicand = omega0 * omega0 - gamma * gamma;
  if (radicand <= 0) return null;
  return Math.sqrt(radicand);
}

/**
 * Calculates displacement-amplitude peak frequency:
 * ω_peak = √(ω_0² - c² / (2m²))
 * Returns null if radicand ≤ 0 (meaning no nonzero frequency peak exists).
 */
export function calculateResonancePeakAngularFrequency(
  m: number,
  k: number,
  c: number
): number | null {
  if (m <= 0 || k <= 0) return null;
  const omega0 = calculateNaturalAngularFrequency(m, k);
  const term = (c * c) / (2 * m * m);
  const radicand = omega0 * omega0 - term;
  if (radicand <= 0) return null;
  return Math.sqrt(radicand);
}

/**
 * Calculates Quality factor Q = m ω_0 / c (dimensionless)
 * Returns null if c == 0 (infinite Q).
 */
export function calculateQualityFactor(
  m: number,
  k: number,
  c: number
): number | null {
  if (c <= 0 || m <= 0 || k <= 0) return null;
  const omega0 = calculateNaturalAngularFrequency(m, k);
  return (m * omega0) / c;
}

/**
 * Calculates theoretical steady-state displacement amplitude:
 * A(ω) = F_0 / √[(k - m ω²)² + (c ω)²]
 */
export function calculateSteadyStateAmplitude(
  params: ResonanceParameters,
  omega: number
): number {
  const { mass: m, springConstant: k, dampingCoefficient: c, drivingForceAmplitude: F0 } = params;
  if (m <= 0 || k <= 0 || F0 < 0) return 0;

  const inertiaStiffnessTerm = k - m * omega * omega;
  const dampingTerm = c * omega;
  const denominatorSq = inertiaStiffnessTerm * inertiaStiffnessTerm + dampingTerm * dampingTerm;

  // Zero damping at exact resonance singularity safeguard
  if (denominatorSq < 1e-12) {
    return 100.0; // visual cap
  }

  return F0 / Math.sqrt(denominatorSq);
}

/**
 * Calculates steady-state phase lag:
 * φ = atan2(c ω, k - m ω²) ∈ [0, π]
 */
export function calculateSteadyStatePhaseLag(
  params: ResonanceParameters,
  omega: number
): { rad: number; deg: number } {
  const { mass: m, springConstant: k, dampingCoefficient: c } = params;
  const y = c * omega;
  const x = k - m * omega * omega;
  let rad = Math.atan2(y, x);
  if (rad < 0) rad += 2 * Math.PI;

  return {
    rad,
    deg: (rad * 180) / Math.PI,
  };
}

/**
 * Evaluates all derived invariants and milestone frequencies for the oscillator.
 */
export function computeOscillatorDerivedValues(
  params: ResonanceParameters
): OscillatorDerivedValues {
  const { mass: m, springConstant: k, dampingCoefficient: c, drivingFrequencyHz: fd, drivingForceAmplitude: F0 } = params;

  const omega0 = calculateNaturalAngularFrequency(m, k);
  const f0 = omega0 / (2 * Math.PI);
  const T0 = f0 > 0 ? 1 / f0 : 0;

  const omegaD = 2 * Math.PI * fd;
  const Td = fd > 0 ? 1 / fd : 0;

  // Damping ratio: ζ = c / (2√(mk))
  const criticalDamping = 2 * Math.sqrt(Math.max(1e-9, m * k));
  const dampingRatio = c / criticalDamping;

  let dampingRegime: OscillatorDerivedValues['dampingRegime'] = 'underdamped';
  if (c <= 1e-7) dampingRegime = 'undamped';
  else if (Math.abs(dampingRatio - 1.0) < 0.02) dampingRegime = 'critically-damped';
  else if (dampingRatio > 1.0) dampingRegime = 'overdamped';

  const omegaDamped = calculateDampedAngularFrequency(m, k, c);
  const fDamped = omegaDamped !== null ? omegaDamped / (2 * Math.PI) : null;

  const omegaPeak = calculateResonancePeakAngularFrequency(m, k, c);
  const fPeak = omegaPeak !== null ? omegaPeak / (2 * Math.PI) : null;

  const qualityFactor = calculateQualityFactor(m, k, c);

  const steadyStateAmplitude = calculateSteadyStateAmplitude(params, omegaD);
  const phaseLag = calculateSteadyStatePhaseLag(params, omegaD);

  const maxTheoreticalAmplitude =
    omegaPeak !== null ? calculateSteadyStateAmplitude(params, omegaPeak) : (F0 / k);

  return {
    naturalAngularFreq: omega0,
    naturalFrequencyHz: f0,
    naturalPeriod: T0,
    drivingAngularFreq: omegaD,
    drivingPeriod: Td,
    dampingRatio,
    dampingRegime,
    dampedAngularFreq: omegaDamped,
    dampedFrequencyHz: fDamped,
    amplitudePeakAngularFreq: omegaPeak,
    amplitudePeakFrequencyHz: fPeak,
    qualityFactor,
    steadyStateAmplitude,
    steadyStatePhaseLagRad: phaseLag.rad,
    steadyStatePhaseLagDeg: phaseLag.deg,
    maxTheoreticalAmplitude,
    frequencyDetuningHz: fd - f0,
  };
}

/**
 * Evaluates acceleration from Newton's 2nd Law for the driven damped oscillator:
 * a = (F_0 sin(ω_d t) - c v - k x) / m
 */
function getOscillatorDerivatives(
  params: ResonanceParameters,
  t: number,
  x: number,
  v: number
): { dx: number; dv: number } {
  const { mass: m, springConstant: k, dampingCoefficient: c, drivingForceAmplitude: F0, drivingFrequencyHz: fd } = params;
  const omegaD = 2 * Math.PI * fd;
  const Fdrive = F0 * Math.sin(omegaD * t);
  const Fspring = -k * x;
  const Fdamping = -c * v;
  const a = (Fdrive + Fspring + Fdamping) / Math.max(0.001, m);

  return { dx: v, dv: a };
}

/**
 * 4th-Order Runge-Kutta (RK4) single numerical step
 */
export function rk4Step(
  params: ResonanceParameters,
  t: number,
  x: number,
  v: number,
  dt: number
): { tNext: number; xNext: number; vNext: number; aNext: number } {
  // k1
  const d1 = getOscillatorDerivatives(params, t, x, v);

  // k2
  const t2 = t + dt * 0.5;
  const x2 = x + d1.dx * (dt * 0.5);
  const v2 = v + d1.dv * (dt * 0.5);
  const d2 = getOscillatorDerivatives(params, t2, x2, v2);

  // k3
  const t3 = t + dt * 0.5;
  const x3 = x + d2.dx * (dt * 0.5);
  const v3 = v + d2.dv * (dt * 0.5);
  const d3 = getOscillatorDerivatives(params, t3, x3, v3);

  // k4
  const t4 = t + dt;
  const x4 = x + d3.dx * dt;
  const v4 = v + d3.dv * dt;
  const d4 = getOscillatorDerivatives(params, t4, x4, v4);

  const xNext = x + (dt / 6) * (d1.dx + 2 * d2.dx + 2 * d3.dx + d4.dx);
  const vNext = v + (dt / 6) * (d1.dv + 2 * d2.dv + 2 * d3.dv + d4.dv);
  const tNext = t + dt;

  const { dv: aNext } = getOscillatorDerivatives(params, tNext, xNext, vNext);

  return { tNext, xNext, vNext, aNext };
}

/**
 * Computes complete live physical state given current time, position, and velocity
 */
export function computeLiveOscillatorState(
  params: ResonanceParameters,
  time: number,
  displacement: number,
  velocity: number,
  cumulativeDissipatedEnergy: number,
  cumulativeDriveWork: number
): LiveOscillatorState {
  const { mass: m, springConstant: k, dampingCoefficient: c, drivingForceAmplitude: F0, drivingFrequencyHz: fd } = params;
  const omegaD = 2 * Math.PI * fd;

  const drivingForce = F0 * Math.sin(omegaD * time);
  const springForce = -k * displacement;
  const dampingForce = -c * velocity;
  const netForce = drivingForce + springForce + dampingForce;
  const acceleration = netForce / Math.max(0.001, m);

  const kineticEnergy = 0.5 * m * velocity * velocity;
  const potentialEnergy = 0.5 * k * displacement * displacement;
  const totalMechanicalEnergy = kineticEnergy + potentialEnergy;

  // Power
  const powerDamping = c * velocity * velocity; // always ≥ 0
  const powerDrive = drivingForce * velocity; // can be positive (injecting) or negative (absorbing)

  return {
    time,
    displacement,
    velocity,
    acceleration,
    drivingForce,
    springForce,
    dampingForce,
    netForce,
    kineticEnergy,
    potentialEnergy,
    totalMechanicalEnergy,
    powerDamping,
    powerDrive,
    cumulativeDissipatedEnergy,
    cumulativeDriveWork,
  };
}

/**
 * Generates steady-state resonance response curve data points across a given frequency range.
 */
export function generateResonanceCurve(
  params: ResonanceParameters,
  minFreqHz = 0.1,
  maxFreqHz = 6.0,
  pointsCount = 200
): ResonanceCurvePoint[] {
  const points: ResonanceCurvePoint[] = [];
  const step = (maxFreqHz - minFreqHz) / (pointsCount - 1);

  for (let i = 0; i < pointsCount; i++) {
    const f = minFreqHz + i * step;
    const omega = 2 * Math.PI * f;
    const amp = calculateSteadyStateAmplitude(params, omega);
    const { deg: phaseLagDeg } = calculateSteadyStatePhaseLag(params, omega);

    points.push({
      frequencyHz: f,
      angularFreq: omega,
      amplitude: amp,
      phaseLagDeg,
    });
  }

  return points;
}
