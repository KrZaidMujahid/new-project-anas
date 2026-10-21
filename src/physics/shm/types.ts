/**
 * EQUATION 1 — Simple Harmonic Motion (SHM) Types & Contracts
 * Pure scientific type definitions for ideal simple harmonic motion.
 */

export type SHMSystemType = 'horizontal-spring' | 'vertical-spring' | 'pendulum';

export type SHMInputMode = 'amplitude-phase' | 'initial-conditions';

export interface SHMParameters {
  systemType: SHMSystemType;
  inputMode: SHMInputMode;

  // Mass-spring parameters
  mass: number; // kg (> 0)
  springConstant: number; // N/m (> 0)
  amplitude: number; // m (>= 0)
  initialPhaseDeg: number; // degrees (-180 to 180)

  // Direct initial conditions (alternative mode)
  initialDisplacement: number; // m
  initialVelocity: number; // m/s

  // Vertical spring / Pendulum parameter
  gravity: number; // m/s² (>= 0, standard 9.80)

  // Pendulum parameters
  pendulumLength: number; // m (> 0)
  pendulumInitialAngleDeg: number; // degrees (small angle, 1 to 20°)
}

export interface SHMDerivedValues {
  // Angular frequency ω (rad/s)
  omega: number;
  // Natural frequency f (Hz)
  frequency: number;
  // Oscillation period T (s)
  period: number;

  // Kinematic maximums
  vMax: number; // m/s
  aMax: number; // m/s²
  fMax: number; // N

  // Total mechanical energy E (J)
  totalEnergy: number;

  // Vertical spring static extension ΔL = mg/k (m)
  staticExtension: number;

  // Effective amplitude & initial phase in radians
  effectiveAmplitude: number;
  effectivePhaseRad: number;

  // For pendulum mode
  isPendulumSmallAngleValid: boolean;
}

export interface SHMState {
  time: number; // s
  displacement: number; // m (or rad for pendulum)
  velocity: number; // m/s (or rad/s for pendulum)
  acceleration: number; // m/s² (or rad/s² for pendulum)
  restoringForce: number; // N
  kineticEnergy: number; // J
  potentialEnergy: number; // J
  totalEnergy: number; // J
  phaseRad: number; // total phase (ωt + φ) rad

  // Specific to vertical spring:
  // Total elongation from unstretched length = staticExtension + displacement
  totalElongation?: number;

  // Specific to pendulum:
  pendulumAngleRad?: number;
  pendulumAngleDeg?: number;
  tangentialVelocity?: number;
  tangentialRestoringForce?: number;
}

export interface SHMVectorDisplayOptions {
  showVelocityVector: boolean;
  showForceVector: boolean;
  showAccelerationVector: boolean;
  showEquilibriumMarker: boolean;
  showAmplitudeBounds: boolean;
  showGrid: boolean;
  showEnergyBar: boolean;
  showPhaseWheel: boolean;
  showTrail: boolean;
}

export interface SHMSample {
  time: number;
  displacement: number;
  velocity: number;
  acceleration: number;
  kineticEnergy: number;
  potentialEnergy: number;
  totalEnergy: number;
  restoringForce: number;
}

export interface SHMPreset {
  id: string;
  name: string;
  systemType: SHMSystemType;
  description: string;
  params: Partial<SHMParameters>;
  tags: string[];
}
