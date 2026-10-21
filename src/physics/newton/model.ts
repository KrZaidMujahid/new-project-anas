/**
 * EQUATION 1 — Newton's Laws Physics Engine & Mathematical Model
 * Pure, deterministic physics calculation routines for 1D dynamics,
 * friction models, and action-reaction interaction pairs.
 */

import {
  NewtonFirstLawParameters,
  NewtonFirstLawState,
  NewtonPreset,
  NewtonSample,
  NewtonSecondLawParameters,
  NewtonSecondLawState,
  NewtonTestCaseResult,
  NewtonThirdLawParameters,
  NewtonThirdLawState,
} from './types';

/**
 * Validates Second Law inputs.
 * Mass must strictly be greater than zero.
 */
export function validateNewtonSecondLawParams(
  params: Partial<NewtonSecondLawParameters>
): { isValid: boolean; errors: Partial<Record<keyof NewtonSecondLawParameters, string>> } {
  const errors: Partial<Record<keyof NewtonSecondLawParameters, string>> = {};

  if (params.mass === undefined || isNaN(params.mass)) {
    errors.mass = 'Mass must be a valid number';
  } else if (params.mass <= 0) {
    errors.mass = 'Mass must be strictly greater than 0 kg';
  } else if (params.mass > 100) {
    errors.mass = 'Mass maximum is 100 kg';
  }

  if (params.appliedForce === undefined || isNaN(params.appliedForce)) {
    errors.appliedForce = 'Applied force must be a number';
  } else if (params.appliedForce < -250 || params.appliedForce > 250) {
    errors.appliedForce = 'Applied force must be between -250 N and +250 N';
  }

  if (params.opposingForce !== undefined && !isNaN(params.opposingForce)) {
    if (params.opposingForce < -250 || params.opposingForce > 250) {
      errors.opposingForce = 'Opposing force must be between -250 N and +250 N';
    }
  }

  if (params.frictionCoeff !== undefined && !isNaN(params.frictionCoeff)) {
    if (params.frictionCoeff < 0 || params.frictionCoeff > 1) {
      errors.frictionCoeff = 'Friction coefficient must be between 0 and 1';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Computes Second Law state at time t with support for constant applied forces and kinetic friction.
 */
export function computeSecondLawStateAtTime(
  params: NewtonSecondLawParameters,
  t: number
): NewtonSecondLawState {
  const { mass, appliedForce, opposingForce, initialVelocity, frictionEnabled, frictionCoeff, gravity } = params;
  const clampedTime = Math.max(0, t);
  const totalAppliedForce = appliedForce + opposingForce;
  const normalForce = mass * gravity;

  // Case 1: Friction Disabled (Ideal frictionless surface)
  if (!frictionEnabled || frictionCoeff === 0) {
    const netForce = totalAppliedForce;
    const acceleration = netForce / mass;
    const velocity = initialVelocity + acceleration * clampedTime;
    const position = initialVelocity * clampedTime + 0.5 * acceleration * clampedTime * clampedTime;

    return {
      time: clampedTime,
      position,
      velocity,
      speed: Math.abs(velocity),
      acceleration,
      appliedForceTotal: totalAppliedForce,
      frictionForce: 0,
      netForce,
      normalForce,
      isMoving: Math.abs(velocity) > 0.001 || Math.abs(acceleration) > 0.001,
    };
  }

  // Case 2: Friction Enabled (Kinetic Friction Model with Static Hold)
  const maxFriction = frictionCoeff * normalForce;

  // Numerical timestep resolution for accurate braking
  const dt = 0.01;
  let currT = 0;
  let currX = 0;
  let currV = initialVelocity;
  let currA = 0;
  let currFriction = 0;
  let currNet = 0;

  while (currT < clampedTime) {
    const step = Math.min(dt, clampedTime - currT);

    if (Math.abs(currV) < 0.005) {
      // Near rest: Check if applied force exceeds static/kinetic threshold
      if (Math.abs(totalAppliedForce) <= maxFriction) {
        currFriction = -totalAppliedForce;
        currNet = 0;
        currA = 0;
        currV = 0;
      } else {
        const sign = Math.sign(totalAppliedForce);
        currFriction = -sign * maxFriction;
        currNet = totalAppliedForce + currFriction;
        currA = currNet / mass;
        currV += currA * step;
      }
    } else {
      // Moving: Kinetic friction opposes velocity
      const sign = Math.sign(currV);
      currFriction = -sign * maxFriction;
      currNet = totalAppliedForce + currFriction;
      currA = currNet / mass;

      const prevV = currV;
      currV += currA * step;

      // Handle deceleration through zero velocity (friction brings object to halt, doesn't reverse it)
      if (prevV * currV < 0 && Math.abs(totalAppliedForce) <= maxFriction) {
        currV = 0;
        currA = 0;
        currNet = 0;
        currFriction = -totalAppliedForce;
      }
    }

    currX += currV * step;
    currT += step;
  }

  return {
    time: clampedTime,
    position: currX,
    velocity: currV,
    speed: Math.abs(currV),
    acceleration: currA,
    appliedForceTotal: totalAppliedForce,
    frictionForce: currFriction,
    netForce: currNet,
    normalForce,
    isMoving: Math.abs(currV) > 0.001 || Math.abs(currA) > 0.001,
  };
}

/**
 * Computes First Law (Inertia) state at time t.
 * Demonstrates: If F_net = 0 => a = 0 => v = constant.
 */
export function computeFirstLawStateAtTime(
  params: NewtonFirstLawParameters,
  t: number
): NewtonFirstLawState {
  const { mass, initialVelocity, appliedForce, initialPosition } = params;
  const clampedTime = Math.max(0, t);
  const netForce = appliedForce;
  const acceleration = netForce / mass;
  const velocity = initialVelocity + acceleration * clampedTime;
  const position = initialPosition + initialVelocity * clampedTime + 0.5 * acceleration * clampedTime * clampedTime;

  return {
    time: clampedTime,
    position,
    velocity,
    speed: Math.abs(velocity),
    acceleration,
    netForce,
  };
}

/**
 * Computes Third Law (Action-Reaction) state for two interacting masses.
 * F_A->B = -F_B->A
 * If masses differ, their accelerations differ: a_A = F_BA / m_A, a_B = F_AB / m_B!
 */
export function computeThirdLawStateAtTime(
  params: NewtonThirdLawParameters,
  t: number
): NewtonThirdLawState {
  const { massA, massB, interactionForce, interactionDuration } = params;
  const clampedTime = Math.max(0, t);

  // During push phase (0 <= t <= interactionDuration)
  const isPushing = clampedTime < interactionDuration;

  // Equal and opposite forces
  // Object A is pushed to the left (-F)
  // Object B is pushed to the right (+F)
  const forceMag = isPushing ? interactionForce : 0;
  const forceOnA = -forceMag;
  const forceOnB = +forceMag;

  const pushTime = Math.min(clampedTime, interactionDuration);
  const coastTime = Math.max(0, clampedTime - interactionDuration);

  // Acceleration during push
  const accA_push = -interactionForce / massA;
  const accB_push = +interactionForce / massB;

  // Final velocity after push phase
  const velA_max = accA_push * interactionDuration;
  const velB_max = accB_push * interactionDuration;

  // Position at end of push
  const posA_push = 0.5 * accA_push * pushTime * pushTime;
  const posB_push = 0.5 * accB_push * pushTime * pushTime;

  let posA = posA_push;
  let posB = posB_push;
  let velA = accA_push * pushTime;
  let velB = accB_push * pushTime;
  let accA = isPushing ? accA_push : 0;
  let accB = isPushing ? accB_push : 0;

  if (!isPushing) {
    velA = velA_max;
    velB = velB_max;
    posA = 0.5 * accA_push * interactionDuration * interactionDuration + velA_max * coastTime;
    posB = 0.5 * accB_push * interactionDuration * interactionDuration + velB_max * coastTime;
  }

  return {
    time: clampedTime,
    posA,
    posB,
    velA,
    velB,
    speedA: Math.abs(velA),
    speedB: Math.abs(velB),
    accA,
    accB,
    forceOnA,
    forceOnB,
    isPushing,
  };
}

/**
 * Discretized samples for Second Law graphs.
 */
export function generateNewtonSecondLawSamples(
  params: NewtonSecondLawParameters,
  duration = 8,
  numSamples = 160
): NewtonSample[] {
  const samples: NewtonSample[] = [];
  const dt = duration / (numSamples - 1);

  for (let i = 0; i < numSamples; i++) {
    const t = i * dt;
    const state = computeSecondLawStateAtTime(params, t);
    samples.push({
      time: t,
      position: state.position,
      velocity: state.velocity,
      acceleration: state.acceleration,
      netForce: state.netForce,
      appliedForce: state.appliedForceTotal,
    });
  }

  return samples;
}

/**
 * Section 19: Automated Physics Test Cases Suite
 * Runs and checks all 7 test cases specified in the prompt instructions.
 */
export function runNewtonPhysicsValidationSuite(): NewtonTestCaseResult[] {
  const results: NewtonTestCaseResult[] = [];

  // TEST 1: Zero net force (m = 5 kg, F_net = 0 => a = 0, v = const)
  const test1Params: NewtonSecondLawParameters = {
    mass: 5,
    appliedForce: 0,
    opposingForce: 0,
    initialVelocity: 4,
    frictionEnabled: false,
    frictionCoeff: 0,
    gravity: 9.8,
  };
  const t1_s0 = computeSecondLawStateAtTime(test1Params, 0);
  const t1_s2 = computeSecondLawStateAtTime(test1Params, 2);
  const t1Pass = t1_s0.acceleration === 0 && t1_s2.acceleration === 0 && t1_s2.velocity === 4;
  results.push({
    id: 'test-1',
    title: 'Test 1: Zero Net Force (First Law)',
    description: 'm = 5 kg, F_net = 0 N. Acceleration must be exactly 0, velocity remains constant.',
    expected: 'a = 0 m/s², v(t) = 4.00 m/s at all t',
    actual: `a = ${t1_s2.acceleration.toFixed(2)} m/s², v(2) = ${t1_s2.velocity.toFixed(2)} m/s`,
    passed: t1Pass,
  });

  // TEST 2: Basic Second Law (m = 2 kg, F = 10 N => a = 5 m/s²)
  const test2Params: NewtonSecondLawParameters = {
    mass: 2,
    appliedForce: 10,
    opposingForce: 0,
    initialVelocity: 0,
    frictionEnabled: false,
    frictionCoeff: 0,
    gravity: 9.8,
  };
  const t2_s = computeSecondLawStateAtTime(test2Params, 1);
  const t2Pass = Math.abs(t2_s.acceleration - 5.0) < 0.001;
  results.push({
    id: 'test-2',
    title: 'Test 2: Basic Second Law (m = 2 kg, F = 10 N)',
    description: 'Acceleration is calculated as a = F_net / m = 10 / 2 = 5 m/s².',
    expected: 'a = 5.00 m/s²',
    actual: `a = ${t2_s.acceleration.toFixed(2)} m/s²`,
    passed: t2Pass,
  });

  // TEST 3: Double mass (m = 4 kg, F = 10 N => a = 2.5 m/s²)
  const test3Params: NewtonSecondLawParameters = {
    mass: 4,
    appliedForce: 10,
    opposingForce: 0,
    initialVelocity: 0,
    frictionEnabled: false,
    frictionCoeff: 0,
    gravity: 9.8,
  };
  const t3_s = computeSecondLawStateAtTime(test3Params, 1);
  const t3Pass = Math.abs(t3_s.acceleration - 2.5) < 0.001;
  results.push({
    id: 'test-3',
    title: 'Test 3: Double Mass Inertia (m = 4 kg, F = 10 N)',
    description: 'Doubling the mass halves the resulting acceleration: a = 10 / 4 = 2.5 m/s².',
    expected: 'a = 2.50 m/s²',
    actual: `a = ${t3_s.acceleration.toFixed(2)} m/s²`,
    passed: t3Pass,
  });

  // TEST 4: Opposing forces (F1 = +20 N, F2 = -10 N => F_net = +10 N)
  const test4Params: NewtonSecondLawParameters = {
    mass: 2,
    appliedForce: 20,
    opposingForce: -10,
    initialVelocity: 0,
    frictionEnabled: false,
    frictionCoeff: 0,
    gravity: 9.8,
  };
  const t4_s = computeSecondLawStateAtTime(test4Params, 1);
  const t4Pass = Math.abs(t4_s.netForce - 10.0) < 0.001 && Math.abs(t4_s.acceleration - 5.0) < 0.001;
  results.push({
    id: 'test-4',
    title: 'Test 4: Opposing Forces (F₁ = +20 N, F₂ = -10 N)',
    description: 'Net force vector sum: F_net = 20 + (-10) = +10 N, a = 10 / 2 = 5 m/s².',
    expected: 'F_net = +10.00 N, a = 5.00 m/s²',
    actual: `F_net = ${t4_s.netForce.toFixed(2)} N, a = ${t4_s.acceleration.toFixed(2)} m/s²`,
    passed: t4Pass,
  });

  // TEST 5: Equal opposing forces (F1 = +20 N, F2 = -20 N => F_net = 0 => a = 0)
  const test5Params: NewtonSecondLawParameters = {
    mass: 2,
    appliedForce: 20,
    opposingForce: -20,
    initialVelocity: 0,
    frictionEnabled: false,
    frictionCoeff: 0,
    gravity: 9.8,
  };
  const t5_s = computeSecondLawStateAtTime(test5Params, 1);
  const t5Pass = Math.abs(t5_s.netForce) < 0.001 && Math.abs(t5_s.acceleration) < 0.001;
  results.push({
    id: 'test-5',
    title: 'Test 5: Balanced Opposing Forces (F₁ = +20 N, F₂ = -20 N)',
    description: 'Forces in opposite directions cancel out: F_net = 0 N, a = 0 m/s².',
    expected: 'F_net = 0.00 N, a = 0.00 m/s²',
    actual: `F_net = ${t5_s.netForce.toFixed(2)} N, a = ${t5_s.acceleration.toFixed(2)} m/s²`,
    passed: t5Pass,
  });

  // TEST 6: Third Law Action-Reaction (F_AB = +20 N, F_BA = -20 N)
  const test6Params: NewtonThirdLawParameters = {
    massA: 2,
    massB: 5,
    interactionForce: 20,
    interactionDuration: 1.0,
  };
  const t6_s = computeThirdLawStateAtTime(test6Params, 0.5);
  const t6Pass = t6_s.forceOnA === -20 && t6_s.forceOnB === 20 && Math.abs(t6_s.forceOnA) === Math.abs(t6_s.forceOnB);
  results.push({
    id: 'test-6',
    title: 'Test 6: Third Law Interaction Pair (Action = -Reaction)',
    description: 'Equal magnitude and opposite direction between interacting bodies: F_AB = +20 N, F_BA = -20 N.',
    expected: 'F_A = -20.00 N, F_B = +20.00 N (|F_A| = |F_B|)',
    actual: `F_A = ${t6_s.forceOnA.toFixed(2)} N, F_B = ${t6_s.forceOnB.toFixed(2)} N`,
    passed: t6Pass,
  });

  // TEST 7: Different masses Third Law (F = 20 N, m1 = 2 kg, m2 = 5 kg => a1 = 10 m/s², a2 = 4 m/s²)
  const test7Params: NewtonThirdLawParameters = {
    massA: 2,
    massB: 5,
    interactionForce: 20,
    interactionDuration: 1.0,
  };
  const t7_s = computeThirdLawStateAtTime(test7Params, 0.5);
  const t7Pass = Math.abs(Math.abs(t7_s.accA) - 10) < 0.001 && Math.abs(Math.abs(t7_s.accB) - 4) < 0.001;
  results.push({
    id: 'test-7',
    title: 'Test 7: Equal Force ≠ Equal Acceleration (m₁ = 2 kg, m₂ = 5 kg)',
    description: 'Equal interaction force produces different accelerations: a₁ = 20 / 2 = 10 m/s², a₂ = 20 / 5 = 4 m/s².',
    expected: '|a₁| = 10.00 m/s², |a₂| = 4.00 m/s²',
    actual: `|a₁| = ${Math.abs(t7_s.accA).toFixed(2)} m/s², |a₂| = ${Math.abs(t7_s.accB).toFixed(2)} m/s²`,
    passed: t7Pass,
  });

  return results;
}

/**
 * Curated presets for Newton's Laws.
 */
export const NEWTON_PRESETS: NewtonPreset[] = [
  {
    id: 'second-law-benchmark',
    name: 'Standard Acceleration (10 N, 2 kg)',
    law: 'second-law',
    description: 'Classic F = ma experiment: 10 N applied to 2 kg mass produces 5 m/s² acceleration.',
    params: {
      mass: 2,
      appliedForce: 10,
      opposingForce: 0,
      initialVelocity: 0,
      frictionEnabled: false,
      frictionCoeff: 0.2,
      gravity: 9.8,
    },
  },
  {
    id: 'second-law-heavy',
    name: 'High Mass Resistance (10 N, 5 kg)',
    law: 'second-law',
    description: 'Same 10 N applied to a heavier 5 kg mass produces reduced 2 m/s² acceleration.',
    params: {
      mass: 5,
      appliedForce: 10,
      opposingForce: 0,
      initialVelocity: 0,
      frictionEnabled: false,
      frictionCoeff: 0.2,
      gravity: 9.8,
    },
  },
  {
    id: 'opposing-forces',
    name: 'Opposing Forces (+20 N vs -10 N)',
    law: 'second-law',
    description: 'Two conflicting forces yield net force F_net = +10 N and forward acceleration.',
    params: {
      mass: 2,
      appliedForce: 20,
      opposingForce: -10,
      initialVelocity: 0,
      frictionEnabled: false,
      frictionCoeff: 0.2,
      gravity: 9.8,
    },
  },
  {
    id: 'kinetic-friction-slide',
    name: 'Kinetic Friction Resistance (μ = 0.25)',
    law: 'second-law',
    description: 'Applied force of 15 N on 2 kg block overcoming friction f = μmg ≈ 4.9 N.',
    params: {
      mass: 2,
      appliedForce: 15,
      opposingForce: 0,
      initialVelocity: 0,
      frictionEnabled: true,
      frictionCoeff: 0.25,
      gravity: 9.8,
    },
  },
  {
    id: 'first-law-glide',
    name: 'First Law: Frictionless Glide (F_net = 0)',
    law: 'first-law',
    description: 'Object in motion at 5 m/s with zero net force glides indefinitely at constant velocity.',
    params: {
      mass: 5,
      initialVelocity: 5,
      appliedForce: 0,
      initialPosition: 0,
    },
  },
  {
    id: 'third-law-repulsion',
    name: 'Third Law: Push-Off (2 kg vs 5 kg)',
    law: 'third-law',
    description: 'Two objects push apart with equal 20 N force. Lighter mass accelerates at 10 m/s², heavier at 4 m/s².',
    params: {
      massA: 2,
      massB: 5,
      interactionForce: 20,
      interactionDuration: 1.0,
    },
  },
];
