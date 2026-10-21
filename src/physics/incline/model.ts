/**
 * EQUATION 1 — Inclined Plane Physics Engine
 * Analytical & Piecewise Kinematics, Dynamics, Energy, and Automated Validation.
 */

import {
  InclineParameters,
  InclinePreset,
  InclineSample,
  InclineState,
  InclineTestCaseResult,
} from './types';

/**
 * Planetary gravity presets for experimentation
 */
export const GRAVITY_PRESETS = [
  { name: 'Earth', value: 9.80665, label: '9.81 m/s² (1.0g)' },
  { name: 'Moon', value: 1.62, label: '1.62 m/s² (0.17g)' },
  { name: 'Mars', value: 3.71, label: '3.71 m/s² (0.38g)' },
  { name: 'Jupiter', value: 24.79, label: '24.79 m/s² (2.53g)' },
  { name: 'Zero-g', value: 0.0, label: '0.00 m/s² (Orbital)' },
];

/**
 * Computes instantaneous forces acting on the block given velocity
 */
export function computeInstantaneousForces(
  params: InclineParameters,
  v: number
): {
  weight: number;
  gravityParallel: number;
  gravityPerpendicular: number;
  normalForce: number;
  appliedForceSigned: number;
  maxStaticFriction: number;
  kineticFrictionMagnitude: number;
  currentFrictionForce: number;
  netForce: number;
  acceleration: number;
  frictionState: InclineState['frictionState'];
} {
  const thetaRad = (params.angleDeg * Math.PI) / 180;
  const sinTheta = Math.sin(thetaRad);
  const cosTheta = Math.cos(thetaRad);

  const weight = params.mass * params.gravity;
  const gravityParallel = weight * sinTheta; // acts DOWN slope (-s direction)
  const gravityPerpendicular = weight * cosTheta; // acts into slope
  const normalForce = gravityPerpendicular; // acts away from slope

  const appliedForceSigned =
    params.appliedForceMag * (params.appliedForceDirection === 'up' ? 1 : -1);

  // Driving force along incline excluding friction (+s is up, -s is down)
  const drivingForce = appliedForceSigned - gravityParallel;

  const maxStaticFriction = params.frictionEnabled
    ? params.staticFrictionCoeff * normalForce
    : 0;

  const kineticFrictionMagnitude = params.frictionEnabled
    ? params.kineticFrictionCoeff * normalForce
    : 0;

  let currentFrictionForce = 0;
  let frictionState: InclineState['frictionState'] = 'none';

  const EPSILON = 1e-4;

  if (Math.abs(v) < EPSILON) {
    // Stationary or instantaneous turn-around
    if (params.frictionEnabled) {
      if (Math.abs(drivingForce) <= maxStaticFriction + 1e-6) {
        // Static hold: static friction balances driving force exactly
        currentFrictionForce = -drivingForce;
        frictionState = 'static-hold';
      } else {
        // Static friction broken: kinetic friction opposes impending motion
        const impendingDir = Math.sign(drivingForce);
        currentFrictionForce = -impendingDir * kineticFrictionMagnitude;
        frictionState =
          impendingDir > 0 ? 'kinetic-opposing-up' : 'kinetic-opposing-down';
      }
    } else {
      frictionState = 'none';
      currentFrictionForce = 0;
    }
  } else if (v > 0) {
    // Moving up the incline: friction opposes motion, pointing DOWN (-s)
    if (params.frictionEnabled) {
      currentFrictionForce = -kineticFrictionMagnitude;
      frictionState = 'kinetic-opposing-up';
    } else {
      frictionState = 'none';
      currentFrictionForce = 0;
    }
  } else {
    // Moving down the incline: friction opposes motion, pointing UP (+s)
    if (params.frictionEnabled) {
      currentFrictionForce = kineticFrictionMagnitude;
      frictionState = 'kinetic-opposing-down';
    } else {
      frictionState = 'none';
      currentFrictionForce = 0;
    }
  }

  const netForce = drivingForce + currentFrictionForce;
  const acceleration = params.mass > 0 ? netForce / params.mass : 0;

  return {
    weight,
    gravityParallel,
    gravityPerpendicular,
    normalForce,
    appliedForceSigned,
    maxStaticFriction,
    kineticFrictionMagnitude,
    currentFrictionForce,
    netForce,
    acceleration,
    frictionState,
  };
}

/**
 * Computes exact state at any time t using analytical piecewise integration
 */
export function computeInclineStateAtTime(
  params: InclineParameters,
  t: number
): InclineState {
  const thetaRad = (params.angleDeg * Math.PI) / 180;
  const sinTheta = Math.sin(thetaRad);
  const cosTheta = Math.cos(thetaRad);

  const weight = params.mass * params.gravity;
  const gravityParallel = weight * sinTheta;
  const gravityPerpendicular = weight * cosTheta;
  const normalForce = gravityPerpendicular;

  const appliedForceSigned =
    params.appliedForceMag * (params.appliedForceDirection === 'up' ? 1 : -1);
  const drivingForce = appliedForceSigned - gravityParallel;

  const maxStaticFriction = params.frictionEnabled
    ? params.staticFrictionCoeff * normalForce
    : 0;
  const kineticFriction = params.frictionEnabled
    ? params.kineticFrictionCoeff * normalForce
    : 0;

  const s0 = params.initialPosition;
  const v0 = params.initialVelocity;
  const L = params.rampLength;

  if (t <= 0) {
    const f0 = computeInstantaneousForces(params, v0);
    const h0 = Math.max(0, s0 * sinTheta);
    const Ek0 = 0.5 * params.mass * v0 * v0;
    const Ep0 = params.mass * params.gravity * h0;

    let motionState: InclineState['motionState'] = 'stationary-equilibrium';
    if (v0 > 1e-4) motionState = 'moving-up';
    else if (v0 < -1e-4) motionState = 'moving-down';
    else if (Math.abs(f0.netForce) > 1e-4) {
      motionState = f0.netForce > 0 ? 'moving-up' : 'moving-down';
    }

    return {
      time: 0,
      position: s0,
      height: h0,
      velocity: v0,
      speed: Math.abs(v0),
      acceleration: f0.acceleration,
      distanceTravelled: 0,
      weight,
      gravityParallel,
      gravityPerpendicular,
      normalForce,
      appliedForceSigned,
      maxStaticFriction,
      kineticFrictionMagnitude: kineticFriction,
      currentFrictionForce: f0.currentFrictionForce,
      netForce: f0.netForce,
      kineticEnergy: Ek0,
      potentialEnergy: Ep0,
      mechanicalEnergy: Ek0 + Ep0,
      workFriction: 0,
      motionState,
      frictionState: f0.frictionState,
    };
  }

  // Numerical/Piecewise integration with small delta for exact boundary & friction reversal handling
  const dt = 0.005;
  let currTime = 0;
  let s = s0;
  let v = v0;
  let dist = 0;
  let workFriction = 0;

  while (currTime < t) {
    const step = Math.min(dt, t - currTime);
    const forces = computeInstantaneousForces(params, v);
    let a = forces.acceleration;

    // Check boundary stops
    if (s <= 0 && v <= 0 && a <= 0) {
      // Reached bottom and driving force pushes into bottom stop
      s = 0;
      v = 0;
      a = 0;
      currTime += step;
      continue;
    }
    if (s >= L && v >= 0 && a >= 0) {
      // Reached top and driving force pushes into top stop
      s = L;
      v = 0;
      a = 0;
      currTime += step;
      continue;
    }

    const nextV = v + a * step;
    let nextS = s + v * step + 0.5 * a * step * step;

    // Boundary clamping
    if (nextS < 0) {
      nextS = 0;
      v = 0;
    } else if (nextS > L) {
      nextS = L;
      v = 0;
    } else {
      v = nextV;
    }

    dist += Math.abs(nextS - s);
    workFriction += forces.currentFrictionForce * (nextS - s);
    s = nextS;
    currTime += step;
  }

  const finalForces = computeInstantaneousForces(params, v);
  let finalAcc = finalForces.acceleration;
  let motionState: InclineState['motionState'] = 'stationary-equilibrium';

  if (s <= 0 && v <= 0 && finalAcc <= 0) {
    motionState = 'stopped-at-bottom';
    finalAcc = 0;
  } else if (s >= L && v >= 0 && finalAcc >= 0) {
    motionState = 'stopped-at-top';
    finalAcc = 0;
  } else if (Math.abs(v) > 1e-4) {
    motionState = v > 0 ? 'moving-up' : 'moving-down';
  } else if (Math.abs(finalAcc) > 1e-4) {
    motionState = finalAcc > 0 ? 'moving-up' : 'moving-down';
  } else {
    motionState = 'stationary-equilibrium';
  }

  const height = Math.max(0, s * sinTheta);
  const kineticEnergy = 0.5 * params.mass * v * v;
  const potentialEnergy = params.mass * params.gravity * height;

  return {
    time: t,
    position: s,
    height,
    velocity: v,
    speed: Math.abs(v),
    acceleration: finalAcc,
    distanceTravelled: dist,
    weight,
    gravityParallel,
    gravityPerpendicular,
    normalForce,
    appliedForceSigned,
    maxStaticFriction,
    kineticFrictionMagnitude: kineticFriction,
    currentFrictionForce: finalForces.currentFrictionForce,
    netForce: finalForces.netForce,
    kineticEnergy,
    potentialEnergy,
    mechanicalEnergy: kineticEnergy + potentialEnergy,
    workFriction,
    motionState,
    frictionState: finalForces.frictionState,
  };
}

/**
 * Generates trajectory samples across time for plotting and timeline scrubber
 */
export function generateInclineSamples(
  params: InclineParameters,
  duration = 8.0,
  sampleCount = 160
): InclineSample[] {
  const samples: InclineSample[] = [];
  const dt = duration / (sampleCount - 1);

  for (let i = 0; i < sampleCount; i++) {
    const t = i * dt;
    const state = computeInclineStateAtTime(params, t);
    samples.push({
      time: t,
      position: state.position,
      velocity: state.velocity,
      acceleration: state.acceleration,
      netForce: state.netForce,
      normalForce: state.normalForce,
      frictionForce: state.currentFrictionForce,
      kineticEnergy: state.kineticEnergy,
      potentialEnergy: state.potentialEnergy,
      mechanicalEnergy: state.mechanicalEnergy,
    });
  }

  return samples;
}

/**
 * Curated laboratory presets for pedagogical exploration
 */
export const INCLINE_PRESETS: InclinePreset[] = [
  {
    id: 'galileo-frictionless',
    name: "Galileo's Incline",
    mode: 'basic',
    description:
      'Classic frictionless ramp demonstrating dilution of gravity: a = -g sin(θ). Independent of mass.',
    params: {
      mass: 5.0,
      angleDeg: 30,
      appliedForceMag: 0,
      appliedForceDirection: 'up',
      frictionEnabled: false,
      staticFrictionCoeff: 0.35,
      kineticFrictionCoeff: 0.25,
      gravity: 9.8,
      initialPosition: 15.0,
      initialVelocity: 0,
      rampLength: 20.0,
    },
  },
  {
    id: 'angle-of-repose',
    name: 'Angle of Repose Threshold',
    mode: 'friction-lab',
    description:
      'Block at rest on a slope with μs = 0.50. Critical angle θc = arctan(0.50) ≈ 26.57°. Watch it hold at 25° and slip at 30°!',
    params: {
      mass: 4.0,
      angleDeg: 26.0,
      appliedForceMag: 0,
      appliedForceDirection: 'up',
      frictionEnabled: true,
      staticFrictionCoeff: 0.5,
      kineticFrictionCoeff: 0.4,
      gravity: 9.8,
      initialPosition: 14.0,
      initialVelocity: 0,
      rampLength: 20.0,
    },
  },
  {
    id: 'pushing-uphill',
    name: 'Pushing Up the Slope',
    mode: 'force-lab',
    description:
      'Applied force overcoming both gravity component and friction to accelerate the mass up the incline.',
    params: {
      mass: 5.0,
      angleDeg: 30,
      appliedForceMag: 50.0,
      appliedForceDirection: 'up',
      frictionEnabled: true,
      staticFrictionCoeff: 0.3,
      kineticFrictionCoeff: 0.2,
      gravity: 9.8,
      initialPosition: 2.0,
      initialVelocity: 0,
      rampLength: 20.0,
    },
  },
  {
    id: 'critical-balance',
    name: 'Static Equilibrium (Exact Balance)',
    mode: 'force-lab',
    description:
      'Applied force exactly balances gravity parallel: F_app = mg sin(θ). Net force is zero, block remains suspended.',
    params: {
      mass: 5.0,
      angleDeg: 30,
      appliedForceMag: 24.5, // 5 * 9.8 * sin(30°) = 24.5 N
      appliedForceDirection: 'up',
      frictionEnabled: false,
      staticFrictionCoeff: 0.3,
      kineticFrictionCoeff: 0.2,
      gravity: 9.8,
      initialPosition: 10.0,
      initialVelocity: 0,
      rampLength: 20.0,
    },
  },
  {
    id: 'steep-ice-run',
    name: 'Steep Ice Runway',
    mode: 'friction-lab',
    description:
      'Steep 60° angle on low-friction ice (μk = 0.05). Demonstrates rapid acceleration under dominating gravity.',
    params: {
      mass: 8.0,
      angleDeg: 60,
      appliedForceMag: 0,
      appliedForceDirection: 'up',
      frictionEnabled: true,
      staticFrictionCoeff: 0.08,
      kineticFrictionCoeff: 0.05,
      gravity: 9.8,
      initialPosition: 18.0,
      initialVelocity: 0,
      rampLength: 20.0,
    },
  },
  {
    id: 'stick-and-slide',
    name: 'Stick & Slide (Upward Launch)',
    mode: 'friction-lab',
    description:
      'Launched up the ramp with v0 = +6 m/s. Friction and gravity slow it down; upon reaching top velocity zero, high static friction holds it permanently in place!',
    params: {
      mass: 3.0,
      angleDeg: 25,
      appliedForceMag: 0,
      appliedForceDirection: 'up',
      frictionEnabled: true,
      staticFrictionCoeff: 0.6,
      kineticFrictionCoeff: 0.35,
      gravity: 9.8,
      initialPosition: 2.0,
      initialVelocity: 6.0,
      rampLength: 20.0,
    },
  },
  {
    id: 'lunar-crater-slope',
    name: 'Lunar Crater Rim (0.17g)',
    mode: 'basic',
    description:
      'Motion on the Moon with low gravity (g = 1.62 m/s²). Observe slower descent rate and gentle acceleration.',
    params: {
      mass: 10.0,
      angleDeg: 35,
      appliedForceMag: 0,
      appliedForceDirection: 'up',
      frictionEnabled: false,
      staticFrictionCoeff: 0.3,
      kineticFrictionCoeff: 0.2,
      gravity: 1.62,
      initialPosition: 15.0,
      initialVelocity: 0,
      rampLength: 20.0,
    },
  },
];

/**
 * Automated Physical & Mathematical Validation Suite
 * Confirms physics rules, conservation laws, and corner cases against exact theory.
 */
export function runInclineValidationTests(): InclineTestCaseResult[] {
  const results: InclineTestCaseResult[] = [];

  // Test 1: Frictionless Acceleration Law: a = -g * sin(θ)
  {
    const params: InclineParameters = {
      mass: 10.0,
      angleDeg: 30,
      appliedForceMag: 0,
      appliedForceDirection: 'up',
      frictionEnabled: false,
      staticFrictionCoeff: 0.4,
      kineticFrictionCoeff: 0.3,
      gravity: 9.8,
      initialPosition: 10.0,
      initialVelocity: 0,
      rampLength: 20.0,
    };
    const f = computeInstantaneousForces(params, 0);
    const expectedA = -9.8 * Math.sin((30 * Math.PI) / 180); // -4.900 m/s²
    const passed = Math.abs(f.acceleration - expectedA) < 1e-4;
    results.push({
      id: 'test-1-diluted-gravity',
      title: 'Galileo Diluted Gravity (Frictionless Incline)',
      description: 'Verifies a = -g sin(θ) = -9.8 * sin(30°) = -4.900 m/s²',
      expected: `${expectedA.toFixed(4)} m/s²`,
      actual: `${f.acceleration.toFixed(4)} m/s²`,
      passed,
    });
  }

  // Test 2: Normal Force Equation: N = mg * cos(θ)
  {
    const params: InclineParameters = {
      mass: 5.0,
      angleDeg: 45,
      appliedForceMag: 0,
      appliedForceDirection: 'up',
      frictionEnabled: false,
      staticFrictionCoeff: 0.4,
      kineticFrictionCoeff: 0.3,
      gravity: 9.8,
      initialPosition: 10.0,
      initialVelocity: 0,
      rampLength: 20.0,
    };
    const f = computeInstantaneousForces(params, 0);
    const expectedN = 5.0 * 9.8 * Math.cos((45 * Math.PI) / 180); // 34.648 N
    const passed = Math.abs(f.normalForce - expectedN) < 1e-4;
    results.push({
      id: 'test-2-normal-force',
      title: 'Perpendicular Normal Force Balance',
      description: 'Verifies N = mg cos(45°) = 5 * 9.8 * 0.7071 = 34.6482 N',
      expected: `${expectedN.toFixed(4)} N`,
      actual: `${f.normalForce.toFixed(4)} N`,
      passed,
    });
  }

  // Test 3: Angle of Repose Below Critical (Static Equilibrium)
  {
    // μs = 0.50 => critical angle = arctan(0.50) = 26.565°
    // At θ = 20°, block must not move: net force = 0, a = 0
    const params: InclineParameters = {
      mass: 5.0,
      angleDeg: 20,
      appliedForceMag: 0,
      appliedForceDirection: 'up',
      frictionEnabled: true,
      staticFrictionCoeff: 0.5,
      kineticFrictionCoeff: 0.4,
      gravity: 9.8,
      initialPosition: 10.0,
      initialVelocity: 0,
      rampLength: 20.0,
    };
    const f = computeInstantaneousForces(params, 0);
    const passed =
      Math.abs(f.netForce) < 1e-4 &&
      Math.abs(f.acceleration) < 1e-4 &&
      f.frictionState === 'static-hold';
    results.push({
      id: 'test-3-angle-of-repose-hold',
      title: 'Angle of Repose Hold (θ < arctan(μs))',
      description: 'At 20° < 26.57°, static friction holds block: a = 0 m/s²',
      expected: 'Net Force = 0.0000 N, a = 0.0000 m/s² (static-hold)',
      actual: `Net Force = ${f.netForce.toFixed(4)} N, a = ${f.acceleration.toFixed(4)} m/s² (${f.frictionState})`,
      passed,
    });
  }

  // Test 4: Angle of Repose Above Critical (Static Friction Broken)
  {
    // At θ = 35° > 26.565°, static friction breaks, accelerates downhill with kinetic friction
    const params: InclineParameters = {
      mass: 5.0,
      angleDeg: 35,
      appliedForceMag: 0,
      appliedForceDirection: 'up',
      frictionEnabled: true,
      staticFrictionCoeff: 0.5,
      kineticFrictionCoeff: 0.4,
      gravity: 9.8,
      initialPosition: 10.0,
      initialVelocity: 0,
      rampLength: 20.0,
    };
    const f = computeInstantaneousForces(params, 0);
    const mgSin = 5.0 * 9.8 * Math.sin((35 * Math.PI) / 180);
    const fk = 0.4 * 5.0 * 9.8 * Math.cos((35 * Math.PI) / 180);
    const expectedA = (-mgSin + fk) / 5.0; // downhill acceleration
    const passed = Math.abs(f.acceleration - expectedA) < 1e-4 && f.acceleration < 0;
    results.push({
      id: 'test-4-angle-of-repose-slip',
      title: 'Angle of Repose Slip (θ > arctan(μs))',
      description: 'At 35° > 26.57°, block slips down: a = -g(sin θ - μk cos θ)',
      expected: `${expectedA.toFixed(4)} m/s²`,
      actual: `${f.acceleration.toFixed(4)} m/s²`,
      passed,
    });
  }

  // Test 5: Pushing Uphill Against Kinetic Friction
  {
    const params: InclineParameters = {
      mass: 4.0,
      angleDeg: 30,
      appliedForceMag: 40.0,
      appliedForceDirection: 'up',
      frictionEnabled: true,
      staticFrictionCoeff: 0.3,
      kineticFrictionCoeff: 0.2,
      gravity: 9.8,
      initialPosition: 5.0,
      initialVelocity: 2.0, // moving UP
      rampLength: 20.0,
    };
    const f = computeInstantaneousForces(params, 2.0);
    // When moving up: F_net = F_app - mg sin(30°) - μk mg cos(30°)
    const mgSin = 4.0 * 9.8 * 0.5; // 19.6 N
    const fk = 0.2 * 4.0 * 9.8 * Math.cos((30 * Math.PI) / 180); // 6.7896 N
    const expectedNet = 40.0 - mgSin - fk; // 13.610 N
    const expectedA = expectedNet / 4.0; // 3.4026 m/s²
    const passed = Math.abs(f.acceleration - expectedA) < 1e-4;
    results.push({
      id: 'test-5-pushing-uphill',
      title: 'Uphill Applied Force Dynamics',
      description: 'Moving up: F_net = F_app - mg sin(θ) - fk',
      expected: `Net = ${expectedNet.toFixed(4)} N, a = ${expectedA.toFixed(4)} m/s²`,
      actual: `Net = ${f.netForce.toFixed(4)} N, a = ${f.acceleration.toFixed(4)} m/s²`,
      passed,
    });
  }

  // Test 6: Kinetic Friction Direction Reversal
  {
    const params: InclineParameters = {
      mass: 2.0,
      angleDeg: 25,
      appliedForceMag: 0,
      appliedForceDirection: 'up',
      frictionEnabled: true,
      staticFrictionCoeff: 0.4,
      kineticFrictionCoeff: 0.3,
      gravity: 9.8,
      initialPosition: 5.0,
      initialVelocity: 0,
      rampLength: 20.0,
    };
    const fMovingUp = computeInstantaneousForces(params, +3.0);
    const fMovingDown = computeInstantaneousForces(params, -3.0);
    // When v > 0, friction is negative (-s); when v < 0, friction is positive (+s)
    const passed =
      fMovingUp.currentFrictionForce < 0 && fMovingDown.currentFrictionForce > 0;
    results.push({
      id: 'test-6-friction-reversal',
      title: 'Friction Always Opposes Relative Motion',
      description: 'Sign of friction vector reverses when velocity direction flips',
      expected: 'v > 0 => f < 0 (-s), v < 0 => f > 0 (+s)',
      actual: `v = +3 => f = ${fMovingUp.currentFrictionForce.toFixed(2)} N, v = -3 => f = ${fMovingDown.currentFrictionForce.toFixed(2)} N`,
      passed,
    });
  }

  return results;
}
