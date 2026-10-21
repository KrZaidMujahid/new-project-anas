/**
 * EQUATION 1 — Simple Harmonic Motion (SHM) Physics Model
 * Deterministic analytical kinematics, dynamics, energy conservation, and conversions.
 */

import {
  SHMParameters,
  SHMDerivedValues,
  SHMState,
  SHMSample,
} from './types';

/**
 * Converts initial displacement (x0) and velocity (v0) into equivalent
 * amplitude A and initial phase φ.
 *
 * x(0) = A cos(φ) = x0
 * v(0) = -Aω sin(φ) = v0  =>  sin(φ) = -v0 / (Aω)
 * tan(φ) = -v0 / (ω x0)
 * A = √(x0² + (v0/ω)²)
 * φ = atan2(-v0/ω, x0)
 */
export function convertInitialConditionsToAmplitudePhase(
  x0: number,
  v0: number,
  omega: number
): { amplitude: number; phaseRad: number; phaseDeg: number } {
  if (omega <= 0) {
    return { amplitude: Math.abs(x0), phaseRad: 0, phaseDeg: 0 };
  }

  const vScaled = v0 / omega;
  const amplitude = Math.sqrt(x0 * x0 + vScaled * vScaled);

  if (amplitude < 1e-12) {
    return { amplitude: 0, phaseRad: 0, phaseDeg: 0 };
  }

  // atan2(y, x) where y = -v0/omega, x = x0
  let phaseRad = Math.atan2(-vScaled, x0);
  let phaseDeg = (phaseRad * 180) / Math.PI;

  return { amplitude, phaseRad, phaseDeg };
}

/**
 * Validates SHM parameters to ensure physical reality and prevent NaNs.
 */
export function validateSHMParameters(params: SHMParameters): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (params.mass <= 0 || !Number.isFinite(params.mass)) {
    errors.push('Mass must be strictly positive (m > 0 kg).');
  }

  if (params.systemType === 'pendulum') {
    if (params.pendulumLength <= 0 || !Number.isFinite(params.pendulumLength)) {
      errors.push('Pendulum length must be strictly positive (L > 0 m).');
    }
    if (params.gravity <= 0 || !Number.isFinite(params.gravity)) {
      errors.push('Gravitational acceleration must be positive (g > 0 m/s²).');
    }
  } else {
    if (params.springConstant <= 0 || !Number.isFinite(params.springConstant)) {
      errors.push('Spring constant must be strictly positive (k > 0 N/m).');
    }
    if (params.amplitude < 0 || !Number.isFinite(params.amplitude)) {
      errors.push('Amplitude must be non-negative (A ≥ 0 m).');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Calculates all derived invariant physical properties of the SHM system.
 */
export function computeSHMDerivedValues(params: SHMParameters): SHMDerivedValues {
  const { systemType, mass, springConstant, gravity, pendulumLength, pendulumInitialAngleDeg } = params;

  let omega = 0;
  let effectiveAmplitude = 0;
  let effectivePhaseRad = 0;
  let isPendulumSmallAngleValid = true;

  if (systemType === 'pendulum') {
    const L = Math.max(0.01, pendulumLength);
    const g = Math.max(0, gravity);
    omega = Math.sqrt(g / L);

    const initialAngleRad = (pendulumInitialAngleDeg * Math.PI) / 180;
    effectiveAmplitude = Math.abs(initialAngleRad);
    effectivePhaseRad = (params.initialPhaseDeg * Math.PI) / 180;
    // Small angle approximation sin(θ) ≈ θ is typically acceptable for θ ≤ 15° (0.26 rad)
    isPendulumSmallAngleValid = Math.abs(pendulumInitialAngleDeg) <= 15;
  } else {
    const m = Math.max(0.001, mass);
    const k = Math.max(0.001, springConstant);
    omega = Math.sqrt(k / m);

    if (params.inputMode === 'initial-conditions') {
      const converted = convertInitialConditionsToAmplitudePhase(
        params.initialDisplacement,
        params.initialVelocity,
        omega
      );
      effectiveAmplitude = converted.amplitude;
      effectivePhaseRad = converted.phaseRad;
    } else {
      effectiveAmplitude = Math.max(0, params.amplitude);
      effectivePhaseRad = (params.initialPhaseDeg * Math.PI) / 180;
    }
  }

  const frequency = omega > 0 ? omega / (2 * Math.PI) : 0;
  const period = frequency > 0 ? 1 / frequency : 0;

  let vMax = 0;
  let aMax = 0;
  let fMax = 0;
  let totalEnergy = 0;
  let staticExtension = 0;

  if (systemType === 'pendulum') {
    // Angular max velocity & acceleration:
    // θ_max = effectiveAmplitude (rad)
    // ω_ang_max = effectiveAmplitude * omega (rad/s)
    // Linear velocity at the bob: v = L * θ_dot => vMax = L * effectiveAmplitude * omega
    const L = Math.max(0.01, pendulumLength);
    const m = Math.max(0.001, mass);
    const g = Math.max(0, gravity);

    vMax = L * effectiveAmplitude * omega;
    aMax = L * effectiveAmplitude * omega * omega;
    // Restoring force maximum: F_t_max = m * g * sin(θ_max) ≈ m * g * θ_max
    fMax = m * g * Math.sin(effectiveAmplitude);
    // Potential energy at maximum displacement: U_max = m * g * L * (1 - cos(θ_max)) ≈ 1/2 m g L θ_max²
    totalEnergy = m * g * L * (1 - Math.cos(effectiveAmplitude));
    staticExtension = 0;
  } else {
    const k = Math.max(0.001, springConstant);
    const m = Math.max(0.001, mass);
    const g = Math.max(0, gravity);

    vMax = effectiveAmplitude * omega;
    aMax = effectiveAmplitude * omega * omega;
    fMax = k * effectiveAmplitude;
    // Total mechanical energy of ideal SHM: E = 1/2 k A²
    totalEnergy = 0.5 * k * effectiveAmplitude * effectiveAmplitude;

    // For vertical spring: static extension ΔL = mg / k
    staticExtension = (m * g) / k;
  }

  return {
    omega,
    frequency,
    period,
    vMax,
    aMax,
    fMax,
    totalEnergy,
    staticExtension,
    effectiveAmplitude,
    effectivePhaseRad,
    isPendulumSmallAngleValid,
  };
}

/**
 * Computes exact state at any given simulation time t with zero numerical drift.
 * Uses analytical solutions:
 * x(t) = A cos(ωt + φ)
 * v(t) = -Aω sin(ωt + φ)
 * a(t) = -Aω² cos(ωt + φ) = -ω² x(t)
 */
export function computeSHMStateAtTime(
  params: SHMParameters,
  time: number
): SHMState {
  const derived = computeSHMDerivedValues(params);
  const { omega, effectiveAmplitude, effectivePhaseRad, staticExtension } = derived;

  const phaseRad = omega * time + effectivePhaseRad;
  const cosPhase = Math.cos(phaseRad);
  const sinPhase = Math.sin(phaseRad);

  if (params.systemType === 'pendulum') {
    const L = Math.max(0.01, params.pendulumLength);
    const m = Math.max(0.001, params.mass);
    const g = Math.max(0, params.gravity);

    // Angular quantities
    const angleRad = effectiveAmplitude * cosPhase;
    const angleDeg = (angleRad * 180) / Math.PI;
    const angularVelocity = -effectiveAmplitude * omega * sinPhase;
    const angularAcceleration = -effectiveAmplitude * omega * omega * cosPhase;

    // Linear tangential kinematics of bob
    const displacement = L * angleRad;
    const tangentialVelocity = L * angularVelocity;
    const tangentialAcceleration = L * angularAcceleration;

    // Restoring force along tangent: F_t = -mg sin(θ)
    const tangentialRestoringForce = -m * g * Math.sin(angleRad);

    // Energy:
    // Kinetic energy: K = 1/2 m v²
    const kineticEnergy = 0.5 * m * tangentialVelocity * tangentialVelocity;
    // Potential energy: U = m g h = m g L (1 - cos(θ))
    const potentialEnergy = m * g * L * (1 - Math.cos(angleRad));
    const totalEnergy = kineticEnergy + potentialEnergy;

    return {
      time,
      displacement,
      velocity: tangentialVelocity,
      acceleration: tangentialAcceleration,
      restoringForce: tangentialRestoringForce,
      kineticEnergy,
      potentialEnergy,
      totalEnergy,
      phaseRad: phaseRad % (2 * Math.PI),
      pendulumAngleRad: angleRad,
      pendulumAngleDeg: angleDeg,
      tangentialVelocity,
      tangentialRestoringForce,
    };
  }

  // Mass-Spring (Horizontal & Vertical)
  const k = Math.max(0.001, params.springConstant);
  const m = Math.max(0.001, params.mass);

  const displacement = effectiveAmplitude * cosPhase;
  const velocity = -effectiveAmplitude * omega * sinPhase;
  const acceleration = -effectiveAmplitude * omega * omega * cosPhase;
  const restoringForce = -k * displacement;

  const kineticEnergy = 0.5 * m * velocity * velocity;
  const potentialEnergy = 0.5 * k * displacement * displacement;
  const totalEnergy = 0.5 * k * effectiveAmplitude * effectiveAmplitude;

  const totalElongation =
    params.systemType === 'vertical-spring'
      ? staticExtension + displacement
      : displacement;

  return {
    time,
    displacement,
    velocity,
    acceleration,
    restoringForce,
    kineticEnergy,
    potentialEnergy,
    totalEnergy,
    phaseRad: phaseRad % (2 * Math.PI),
    totalElongation,
  };
}

/**
 * Generates an array of trajectory samples for SVG graphing over a given duration.
 */
export function generateSHMSamples(
  params: SHMParameters,
  duration: number,
  sampleCount = 200
): SHMSample[] {
  const count = Math.max(50, sampleCount);
  const dt = duration / (count - 1);
  const samples: SHMSample[] = [];

  for (let i = 0; i < count; i++) {
    const t = i * dt;
    const state = computeSHMStateAtTime(params, t);
    samples.push({
      time: t,
      displacement: state.displacement,
      velocity: state.velocity,
      acceleration: state.acceleration,
      kineticEnergy: state.kineticEnergy,
      potentialEnergy: state.potentialEnergy,
      totalEnergy: state.totalEnergy,
      restoringForce: state.restoringForce,
    });
  }

  return samples;
}
