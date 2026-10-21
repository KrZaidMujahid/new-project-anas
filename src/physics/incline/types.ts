/**
 * EQUATION 1 — Inclined Plane Laboratory Types
 * 1D motion along a 2D inclined plane under gravity, normal force, applied force, and friction.
 *
 * Coordinate Convention:
 * - Positive direction (+s): Directed UP the incline along the surface.
 * - Negative direction (-s): Directed DOWN the incline along the surface.
 * - Perpendicular direction (+n): Directed away from the incline surface (Normal direction).
 */

export type InclineMode = 'basic' | 'force-lab' | 'friction-lab';

export interface InclineParameters {
  /** Mass of the block in kg (m > 0, default 5.0) */
  mass: number;
  /** Incline angle θ in degrees (0° to 85°, default 30°) */
  angleDeg: number;
  /** Applied force magnitude in Newtons (default 0) */
  appliedForceMag: number;
  /** Applied force direction: 'up' (+s) or 'down' (-s) */
  appliedForceDirection: 'up' | 'down';
  /** Whether friction is enabled (default false in basic/force-lab, true in friction-lab) */
  frictionEnabled: boolean;
  /** Coefficient of static friction μs (>= μk, default 0.35) */
  staticFrictionCoeff: number;
  /** Coefficient of kinetic friction μk (default 0.25) */
  kineticFrictionCoeff: number;
  /** Gravitational acceleration in m/s² (default 9.8) */
  gravity: number;
  /** Initial position along ramp in meters from bottom (0 <= s <= rampLength, default 10.0) */
  initialPosition: number;
  /** Initial velocity along the incline in m/s (default 0) */
  initialVelocity: number;
  /** Length of the ramp in meters (default 20.0) */
  rampLength: number;
}

export type InclineMotionState = 'stationary-equilibrium' | 'moving-up' | 'moving-down' | 'stopped-at-bottom' | 'stopped-at-top';
export type InclineFrictionState = 'none' | 'static-hold' | 'kinetic-opposing-up' | 'kinetic-opposing-down';

export interface InclineState {
  time: number;
  /** Position along the incline in meters (0 is bottom, rampLength is top) */
  position: number;
  /** Current vertical height above bottom in meters: h = position * sin(θ) */
  height: number;
  /** Velocity along the incline in m/s (positive is up, negative is down) */
  velocity: number;
  speed: number;
  /** Acceleration along the incline in m/s² */
  acceleration: number;
  /** Distance traversed along the ramp in meters */
  distanceTravelled: number;

  // Force magnitudes and components (in Newtons)
  weight: number; // W = mg
  gravityParallel: number; // mg * sin(θ) (pointing down incline)
  gravityPerpendicular: number; // mg * cos(θ) (pointing into ramp)
  normalForce: number; // N = mg * cos(θ)

  appliedForceSigned: number; // +F if up, -F if down
  maxStaticFriction: number; // fs,max = μs * N
  kineticFrictionMagnitude: number; // fk = μk * N
  currentFrictionForce: number; // Signed friction force along incline (+ is up, - is down)
  netForce: number; // Signed ΣF along incline

  // Energetics (in Joules)
  kineticEnergy: number; // 0.5 * m * v^2
  potentialEnergy: number; // m * g * h
  mechanicalEnergy: number; // E = Ek + Ep
  workFriction: number; // Cumulative work done by friction (negative)

  motionState: InclineMotionState;
  frictionState: InclineFrictionState;
}

export interface InclineSample {
  time: number;
  position: number;
  velocity: number;
  acceleration: number;
  netForce: number;
  normalForce: number;
  frictionForce: number;
  kineticEnergy: number;
  potentialEnergy: number;
  mechanicalEnergy: number;
}

export interface InclineVectorOptions {
  showWeightVector: boolean;
  showNormalForce: boolean;
  showGravityComponents: boolean;
  showAppliedForce: boolean;
  showFrictionForce: boolean;
  showNetForce: boolean;
  showVelocityVector: boolean;
  showAccelerationVector: boolean;
  showAngleArc: boolean;
  showForceValues: boolean;
  showMotionTrail: boolean;
  showEnergyHUD: boolean;
}

export interface InclinePreset {
  id: string;
  name: string;
  mode: InclineMode;
  description: string;
  params: InclineParameters;
}

export interface InclineTestCaseResult {
  id: string;
  title: string;
  description: string;
  expected: string;
  actual: string;
  passed: boolean;
}
