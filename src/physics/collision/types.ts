/**
 * EQUATION 1 — Collision & Momentum Laboratory Types
 * SI Units: mass in kg, position in m, velocity in m/s, momentum in kg·m/s,
 * force in N, energy in J, time in s, impulse in N·s (or kg·m/s).
 */

export type CollisionType = 'elastic' | 'inelastic' | 'perfectly-inelastic';

export interface CollisionParameters {
  collisionType: CollisionType;
  // Object 1
  m1: number; // kg (> 0)
  v1: number; // m/s (can be negative)
  x1: number; // m initial position
  // Object 2
  m2: number; // kg (> 0)
  v2: number; // m/s (can be negative)
  x2: number; // m initial position
  // Collision properties
  restitution: number; // e in [0, 1]
  collisionDuration: number; // s (contact pulse duration, e.g. 0.05s)
  cartWidth1?: number; // m
  cartWidth2?: number; // m
}

export interface ObjectState {
  mass: number;
  position: number;
  velocity: number;
  speed: number;
  momentum: number;
  kineticEnergy: number;
}

export interface CollisionState {
  time: number;
  object1: ObjectState;
  object2: ObjectState;
  totalMomentum: number;
  totalKineticEnergy: number;
  isColliding: boolean;
  hasCollided: boolean;
  contactForce: number; // N (instantaneous contact force magnitude)
  cumulativeImpulse: number; // N·s accumulated on object 1
  collisionTime: number | null; // time at which contact starts
  collisionDuration: number;
}

export interface AnalyticalCollisionResult {
  hasCollision: boolean;
  collisionTime: number | null;
  // Initial (Before)
  p1_before: number;
  p2_before: number;
  P_total_before: number;
  K1_before: number;
  K2_before: number;
  K_total_before: number;
  // Final (After)
  v1_after: number;
  v2_after: number;
  p1_after: number;
  p2_after: number;
  P_total_after: number;
  K1_after: number;
  K2_after: number;
  K_total_after: number;
  // Conservation metrics
  momentumError: number; // P_after - P_before
  kineticEnergyChange: number; // K_after - K_before
  kineticEnergyLost: number; // K_before - K_after
  fractionEnergyRetained: number; // K_after / K_before
  // Impulse & Force
  impulseObj1: number; // J1 = m1*(v1' - v1)
  impulseObj2: number; // J2 = m2*(v2' - v2) = -J1
  impulseMagnitude: number; // |J|
  collisionDuration: number;
  averageForce: number; // |J| / dt
  peakForce: number; // (pi/2) * averageForce for half-sine pulse
  // Combined system (for perfectly inelastic)
  combinedMass: number;
  finalCombinedVelocity: number;
}

export interface NumericalCollisionResult {
  v1_after: number;
  v2_after: number;
  P_total_after: number;
  K_total_after: number;
  collisionTime: number | null;
  maxForce: number;
  impulse: number;
  simulatedFinalTime: number;
}

export interface CollisionSample {
  time: number;
  x1: number;
  x2: number;
  v1: number;
  v2: number;
  p1: number;
  p2: number;
  P_total: number;
  K1: number;
  K2: number;
  K_total: number;
  contactForce: number;
  cumulativeImpulse: number;
  isColliding: boolean;
  hasCollided: boolean;
}

export interface CollisionVectorOptions {
  showVelocityVectors: boolean;
  showMomentumVectors: boolean;
  showForceVectors: boolean;
  showMotionTrails: boolean;
  showTrackRuler: boolean;
  showCenterOfMass: boolean;
}

export interface CollisionPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  params: CollisionParameters;
  expectedOutcome: string;
}

export interface CollisionTestReport {
  id: string;
  title: string;
  description: string;
  passed: boolean;
  expected: string;
  actual: string;
  errorMargin?: string;
}
