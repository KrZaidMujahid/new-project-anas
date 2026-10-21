/**
 * EQUATION 1 — Lorentz Force Laboratory Types & Contracts
 * Pure scientific type definitions for charged particle dynamics in
 * electromagnetic fields, cyclotron resonance, helical trajectories, and vector calculus.
 */

export type LorentzMotionMode =
  | 'perpendicular' // Circular motion (v ⊥ B)
  | 'parallel' // Straight line (v ∥ B)
  | 'helical' // Helical motion (v at angle θ to B)
  | 'electric-only' // B = 0, E ≠ 0
  | 'crossed-fields'; // Crossed E ⊥ B fields (Wien velocity filter)

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface LorentzParameters {
  // Particle Properties
  charge: number; // in Coulombs (default +1e = +1.602176634e-19 C)
  chargeNumber: number; // integer multiple of e (+1, -1, +2, -2)
  mass: number; // in kg (default 1.0e-27 kg)
  speed: number; // in m/s (1e5 to 1e7, default 2.0e6 m/s)
  initialVelocityAngleDeg: number; // velocity direction in xy-plane (0° = +x / right)

  // Magnetic Field Properties
  bFieldStrength: number; // in Tesla (0 to 2.0 T, default 0.5 T)
  bFieldDirection: 'out-of-screen' | 'into-screen'; // ⊙ vs ⊗
  angleThetaDeg: number; // angle between velocity and magnetic field (0° to 180°, default 90°)

  // Electric Field Properties
  electricFieldEnabled: boolean; // toggle
  eFieldStrength: number; // in N/C or V/m (0 to 1e6 N/C, default 0 N/C)
  eFieldDirection: 'up' | 'down' | 'left' | 'right'; // direction of E vector

  // Simulation mode & playback
  mode: LorentzMotionMode;
  animationSpeed: number; // multiplier: 0.5, 1.0, 2.0
}

export interface LorentzDerivedValues {
  // Forces
  magneticForceMagnitude: number; // |F_B| = |q| v B sin(θ) in N
  magneticForceVector: Vector3D; // F_B = q(v × B) in N
  electricForceMagnitude: number; // |F_E| = |q| E in N
  electricForceVector: Vector3D; // F_E = q E in N
  totalForceMagnitude: number; // |F| in N
  totalForceVector: Vector3D; // F = F_E + F_B in N
  accelerationMagnitude: number; // a = F / m in m/s²

  // Velocity components
  vParallel: number; // v_parallel = v cos(θ) in m/s
  vPerpendicular: number; // v_perpendicular = v sin(θ) in m/s

  // Cyclotron kinematics
  cyclotronRadius: number | null; // r = m v_perp / (|q| B) in meters (null if B=0 or q=0)
  cyclotronAngularFreq: number | null; // ω_c = |q| B / m in rad/s
  cyclotronFrequency: number | null; // f_c = ω_c / (2π) in Hz
  cyclotronPeriod: number | null; // T_c = 1 / f_c in seconds
  helicalPitch: number | null; // pitch = v_parallel * T_c in meters

  // Energetics
  kineticEnergyJoules: number; // K = 1/2 m v² in Joules
  kineticEnergyEV: number; // K in electron-volts (eV)
  crossedFieldsBalanceSpeed: number | null; // v = E / B for zero net force (m/s)

  // Status & physical regime
  isNetForceZero: boolean;
  explanationText: string;
}

export interface TrajectoryPoint {
  x: number; // simulation visual coordinates (px)
  y: number;
  z: number;
  vx: number; // physical velocity components (m/s)
  vy: number;
  vz: number;
  time: number; // seconds
}

export interface LorentzPreset {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  params: Partial<LorentzParameters>;
}

export interface GuidedLorentzActivity {
  id: number;
  title: string;
  objective: string;
  instructions: string[];
  expectedObservation: string;
  setupParams: Partial<LorentzParameters>;
}

export interface LorentzQuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
