/**
 * EQUATION 1 — Circular Motion Laboratory Types
 * SI Units:
 * - Mass: kg
 * - Radius: m
 * - Angular position: rad (or deg for display)
 * - Angular velocity: rad/s
 * - Linear velocity / speed: m/s
 * - Centripetal acceleration: m/s²
 * - Centripetal force: N
 * - Period: s
 * - Frequency: Hz
 * - Kinetic energy: J
 */

export type CircularMode = 'basic' | 'force' | 'parameters';

export interface CircularParameters {
  mass: number; // kg (> 0)
  radius: number; // m (> 0)
  angularVelocity: number; // rad/s (ω)
  initialAngleDeg: number; // degrees (θ₀)
  centerX?: number; // m (default 0)
  centerY?: number; // m (default 0)
}

export interface CircularVectorOptions {
  showVelocityVector: boolean;
  showAccelerationVector: boolean;
  showForceVector: boolean;
  showRadiusLine: boolean;
  showAngleArc: boolean;
  showMotionTrail: boolean;
  showCoordinateAxes: boolean;
  showVelocityComponents: boolean;
}

export interface CircularState {
  time: number;
  thetaRad: number; // [0, 2π) or total accumulated
  thetaDeg: number;
  x: number; // m
  y: number; // m
  vx: number; // m/s
  vy: number; // m/s
  ax: number; // m/s²
  ay: number; // m/s²
  speed: number; // m/s (v = r*|ω|)
  centripetalAccel: number; // m/s² (a_c = v²/r = r*ω²)
  centripetalForce: number; // N (F_c = m*a_c)
  period: number; // s (T = 2π/|ω|)
  frequency: number; // Hz (f = 1/T)
  kineticEnergy: number; // J (K = 1/2*m*v²)
}

export interface CircularDerivedValues {
  speed: number; // v = r*ω
  centripetalAccel: number; // a_c = r*ω²
  centripetalForce: number; // F_c = m*r*ω²
  period: number; // T = 2π/ω
  frequency: number; // f = 1/T
  angularVelocityRpm: number; // RPM
  kineticEnergy: number; // 0.5*m*v²
}

export interface CircularSample {
  time: number;
  thetaRad: number;
  thetaDeg: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  speed: number;
  centripetalAccel: number;
  centripetalForce: number;
  kineticEnergy: number;
}

export interface CircularPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  params: CircularParameters;
  expectedOutcome: string;
}

export interface CircularTestReport {
  id: string;
  title: string;
  description: string;
  passed: boolean;
  expected: string;
  actual: string;
  errorMargin?: string;
}
