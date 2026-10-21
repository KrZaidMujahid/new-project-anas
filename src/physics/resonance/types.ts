/**
 * EQUATION 1 — Resonance Laboratory Types & Contracts
 * Pure scientific type definitions for driven, damped harmonic oscillators,
 * RK4 numerical simulations, resonance frequency response, and virtual experiments.
 */

export type ResonanceVisualizationMode =
  | 'below-resonance'
  | 'at-resonance'
  | 'above-resonance'
  | 'low-damping'
  | 'high-damping'
  | 'compare-two';

export interface ResonanceParameters {
  mass: number; // m in kg (0.1 to 5.0 kg, default 1.0 kg)
  springConstant: number; // k in N/m (5 to 200 N/m, default 50 N/m)
  dampingCoefficient: number; // c in N·s/m (0 to 5.0 N·s/m, default 0.5 N·s/m)
  drivingFrequencyHz: number; // f_d in Hz (0.1 to 10.0 Hz, default ~1.125 Hz)
  drivingForceAmplitude: number; // F_0 in N (0.1 to 10.0 N, default 2.0 N)
  initialDisplacement: number; // x_0 in m (default 0.0 m)
  initialVelocity: number; // v_0 in m/s (default 0.0 m/s)
}

export interface DualOscillatorConfig {
  enabled: boolean;
  system1: ResonanceParameters;
  system2: ResonanceParameters;
}

export interface OscillatorDerivedValues {
  naturalAngularFreq: number; // ω_0 = √(k/m) in rad/s
  naturalFrequencyHz: number; // f_0 = ω_0 / (2π) in Hz
  naturalPeriod: number; // T_0 = 1 / f_0 in s
  drivingAngularFreq: number; // ω_d = 2π f_d in rad/s
  drivingPeriod: number; // T_d = 1 / f_d in s
  dampingRatio: number; // ζ = c / (2√(mk)) (dimensionless)
  dampingRegime: 'undamped' | 'underdamped' | 'critically-damped' | 'overdamped';
  dampedAngularFreq: number | null; // ω_damped = √(ω_0² - (c/2m)²) if underdamped, else null
  dampedFrequencyHz: number | null; // f_damped in Hz
  amplitudePeakAngularFreq: number | null; // ω_peak = √(ω_0² - c²/(2m²)) if radicand > 0, else null
  amplitudePeakFrequencyHz: number | null; // f_peak in Hz
  qualityFactor: number | null; // Q = m ω_0 / c if c > 0, else null (infinite)
  steadyStateAmplitude: number; // A(ω_d) = F_0 / √((k - m ω_d²)² + (c ω_d)²) in meters
  steadyStatePhaseLagRad: number; // φ = atan2(c ω_d, k - m ω_d²) in radians [0, π]
  steadyStatePhaseLagDeg: number; // φ in degrees [0°, 180°]
  maxTheoreticalAmplitude: number | null; // Peak amplitude at ω_peak
  frequencyDetuningHz: number; // f_d - f_0
}

export interface LiveOscillatorState {
  time: number; // simulation timestamp t (s)
  displacement: number; // x(t) in meters
  velocity: number; // v(t) in m/s
  acceleration: number; // a(t) in m/s²
  drivingForce: number; // F(t) = F_0 sin(ω_d t) in N
  springForce: number; // F_spring = -k x in N
  dampingForce: number; // F_damping = -c v in N
  netForce: number; // F_net = F_drive + F_spring + F_damping in N
  kineticEnergy: number; // K = 1/2 m v² in Joules
  potentialEnergy: number; // U = 1/2 k x² in Joules
  totalMechanicalEnergy: number; // E = K + U in Joules
  powerDamping: number; // P_damping = c v² in Watts (instantaneous dissipation rate)
  powerDrive: number; // P_drive = F(t) v(t) in Watts (instantaneous mechanical power supplied)
  cumulativeDissipatedEnergy: number; // ∫ P_damping dt in Joules
  cumulativeDriveWork: number; // ∫ P_drive dt in Joules
}

export interface OscillatorHistoryPoint {
  time: number;
  displacement: number;
  drivingForceNormalized: number;
  velocity: number;
  kineticEnergy: number;
  potentialEnergy: number;
}

export interface ResonanceCurvePoint {
  frequencyHz: number;
  angularFreq: number;
  amplitude: number;
  phaseLagDeg: number;
}

export interface ResonancePreset {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  params: ResonanceParameters;
  targetMode?: ResonanceVisualizationMode;
  pedagogicalTakeaway: string;
}

export interface GuidedResonanceActivity {
  id: number;
  title: string;
  objective: string;
  instructions: string[];
  expectedObservation: string;
  setupParams: Partial<ResonanceParameters>;
  targetMode?: ResonanceVisualizationMode;
  questionPrompt: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
