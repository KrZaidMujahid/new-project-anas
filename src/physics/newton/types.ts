/**
 * EQUATION 1 — Newton's Laws of Motion Laboratory Types
 * Models Newton's First, Second, and Third Laws of Motion.
 */

export type NewtonMode = 'second-law' | 'first-law' | 'third-law';

export interface NewtonSecondLawParameters {
  /** Mass of the object in kilograms (m > 0, default 2.0) */
  mass: number;
  /** Primary applied horizontal force in Newtons (signed: + right, - left) */
  appliedForce: number;
  /** Secondary opposing horizontal force in Newtons (signed) */
  opposingForce: number;
  /** Initial horizontal velocity in m/s */
  initialVelocity: number;
  /** Whether kinetic/static friction is enabled */
  frictionEnabled: boolean;
  /** Coefficient of friction μ (0 to 1) */
  frictionCoeff: number;
  /** Gravity in m/s² for normal force N = mg (default 9.8) */
  gravity: number;
}

export interface NewtonSecondLawState {
  time: number;
  position: number;
  velocity: number;
  speed: number;
  acceleration: number;
  appliedForceTotal: number;
  frictionForce: number;
  netForce: number;
  normalForce: number;
  isMoving: boolean;
}

export interface NewtonFirstLawParameters {
  /** Mass in kg (default 5.0) */
  mass: number;
  /** Initial velocity in m/s (default 5.0) */
  initialVelocity: number;
  /** Applied force in N (default 0 for inertia demonstration) */
  appliedForce: number;
  /** Initial position */
  initialPosition: number;
}

export interface NewtonFirstLawState {
  time: number;
  position: number;
  velocity: number;
  speed: number;
  acceleration: number;
  netForce: number;
}

export interface NewtonThirdLawParameters {
  /** Mass of Object A in kg (default 2.0) */
  massA: number;
  /** Mass of Object B in kg (default 5.0) */
  massB: number;
  /** Mutual interaction push force magnitude in Newtons (default 20.0) */
  interactionForce: number;
  /** Duration of interaction impulse in seconds (default 1.0) */
  interactionDuration: number;
}

export interface NewtonThirdLawState {
  time: number;
  posA: number;
  posB: number;
  velA: number;
  velB: number;
  speedA: number;
  speedB: number;
  accA: number;
  accB: number;
  forceOnA: number; // Force exerted by B on A (leftward: -F)
  forceOnB: number; // Force exerted by A on B (rightward: +F)
  isPushing: boolean;
}

export interface NewtonSample {
  time: number;
  position: number;
  velocity: number;
  acceleration: number;
  netForce: number;
  appliedForce: number;
}

export interface NewtonVectorOptions {
  showAppliedForce: boolean;
  showFrictionForce: boolean;
  showNetForce: boolean;
  showVelocityVector: boolean;
  showAccelerationVector: boolean;
  showForceLabels: boolean;
  showSurfaceGrid: boolean;
}

export interface NewtonPreset {
  id: string;
  name: string;
  law: NewtonMode;
  description: string;
  params: NewtonSecondLawParameters | NewtonFirstLawParameters | NewtonThirdLawParameters;
}

export interface NewtonTestCaseResult {
  id: string;
  title: string;
  description: string;
  expected: string;
  actual: string;
  passed: boolean;
}
