/**
 * EQUATION 1 — Free Fall Laboratory Types
 * Core definitions for 1D vertical motion under uniform gravity.
 *
 * Coordinate Convention:
 * - Origin y = 0 is the Ground.
 * - Positive y (+y) points UPWARD (altitude).
 * - Gravitational acceleration points DOWNWARD: a(t) = -g (where g >= 0).
 * - Initial height y0 >= 0.
 * - Initial velocity v0: positive is UPWARD, negative is DOWNWARD, 0 is RELEASE FROM REST.
 */

export interface FreeFallParameters {
  /** Initial height in meters (y0 >= 0, default 20) */
  initialHeight: number;
  /** Initial vertical velocity in m/s (signed: + upward, - downward, 0 rest) */
  initialVelocity: number;
  /** Gravitational acceleration in m/s² (g >= 0, default 9.8) */
  gravity: number;
}

export interface FreeFallState {
  /** Elapsed simulation time in seconds */
  time: number;
  /** Vertical position / height above ground in meters (y >= 0) */
  height: number;
  /** Vertical displacement from initial release point in meters: y(t) - y0 */
  displacement: number;
  /** Instantaneous vertical velocity in m/s (signed: + upward, - downward) */
  velocity: number;
  /** Instantaneous speed magnitude in m/s: |v(t)| */
  speed: number;
  /** Instantaneous acceleration in m/s²: -g */
  acceleration: number;
  /** Cumulative distance traveled / fallen in meters */
  distanceTravelled: number;
  /** Has the object reached ground (y <= 0) */
  isGrounded: boolean;
}

export interface FreeFallAnalytical {
  /** Total time to reach ground y = 0 in seconds */
  timeToGround: number;
  /** Instantaneous vertical velocity upon ground impact in m/s (signed, negative) */
  finalVelocity: number;
  /** Impact speed magnitude in m/s: |v(T)| */
  finalSpeed: number;
  /** Maximum altitude reached above ground in meters */
  maxHeight: number;
  /** Time when maximum altitude is reached in seconds */
  timeToApex: number;
  /** Total path distance traveled from t=0 to landing in meters */
  totalDistanceTravelled: number;
  /** Special case indicator: initial velocity is exactly zero */
  isReleasedFromRest: boolean;
  /** Special case indicator: zero gravity condition (g = 0) */
  isZeroGravity: boolean;
}

export interface FreeFallSample {
  time: number;
  height: number;
  velocity: number;
  acceleration: number;
  speed: number;
}

export interface NumericalVsAnalyticalComparison {
  analyticalTime: number;
  simulationTime: number;
  timeDelta: number;
  analyticalFinalVelocity: number;
  simulationFinalVelocity: number;
  velocityDelta: number;
  analyticalFinalSpeed: number;
  simulationFinalSpeed: number;
  speedDelta: number;
  integrationTimestep: number;
  stepsCount: number;
}

export interface FreeFallVectorOptions {
  showVelocityVector: boolean;
  showAccelerationVector: boolean;
  showMotionTrail: boolean;
  showHeightRuler: boolean;
  showApexMarker: boolean;
  showCoordinateGrid: boolean;
}

export interface FreeFallPreset {
  id: string;
  name: string;
  description: string;
  params: FreeFallParameters;
}

export interface TestCaseResult {
  id: string;
  title: string;
  description: string;
  expected: string;
  actual: string;
  passed: boolean;
}
