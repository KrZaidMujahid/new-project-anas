/**
 * EQUATION 1 — Free Fall Laboratory Physics Model
 * 100% testable, pure functions for 1D vertical motion under uniform gravity.
 */

import {
  FreeFallAnalytical,
  FreeFallParameters,
  FreeFallPreset,
  FreeFallSample,
  FreeFallState,
  NumericalVsAnalyticalComparison,
  TestCaseResult,
} from './types';

/**
 * Validates input parameters with strict boundary checking.
 */
export function validateFreeFallParameters(
  params: Partial<FreeFallParameters>
): { isValid: boolean; errors: Partial<Record<keyof FreeFallParameters, string>> } {
  const errors: Partial<Record<keyof FreeFallParameters, string>> = {};

  if (params.initialHeight === undefined || isNaN(params.initialHeight)) {
    errors.initialHeight = 'Height must be a valid number';
  } else if (params.initialHeight < 0) {
    errors.initialHeight = 'Initial height cannot be negative';
  } else if (params.initialHeight > 500) {
    errors.initialHeight = 'Height maximum is 500 m';
  }

  if (params.initialVelocity === undefined || isNaN(params.initialVelocity)) {
    errors.initialVelocity = 'Velocity must be a valid number';
  } else if (params.initialVelocity < -100 || params.initialVelocity > 100) {
    errors.initialVelocity = 'Velocity must be between -100 and +100 m/s';
  }

  if (params.gravity === undefined || isNaN(params.gravity)) {
    errors.gravity = 'Gravity must be a valid number';
  } else if (params.gravity < 0) {
    errors.gravity = 'Gravity cannot be negative';
  } else if (params.gravity > 100) {
    errors.gravity = 'Gravity maximum is 100 m/s²';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Calculates closed-form analytical results.
 * Solves y(T) = y0 + v0*T - 0.5*g*T^2 = 0.
 */
export function calculateFreeFallAnalytical(
  params: FreeFallParameters
): FreeFallAnalytical {
  const { initialHeight, initialVelocity, gravity } = params;

  const isReleasedFromRest = initialVelocity === 0;
  const isZeroGravity = gravity === 0;

  // Case: Zero Gravity (g = 0)
  if (isZeroGravity) {
    if (initialVelocity < 0) {
      // Moving downward with constant speed
      const timeToGround = initialHeight / Math.abs(initialVelocity);
      return {
        timeToGround,
        finalVelocity: initialVelocity,
        finalSpeed: Math.abs(initialVelocity),
        maxHeight: initialHeight,
        timeToApex: 0,
        totalDistanceTravelled: initialHeight,
        isReleasedFromRest: false,
        isZeroGravity: true,
      };
    } else {
      // At rest or moving upward forever
      return {
        timeToGround: Infinity,
        finalVelocity: initialVelocity,
        finalSpeed: Math.abs(initialVelocity),
        maxHeight: Infinity,
        timeToApex: 0,
        totalDistanceTravelled: 0,
        isReleasedFromRest,
        isZeroGravity: true,
      };
    }
  }

  // General case: g > 0
  // Quadratic equation: 0.5 * g * T^2 - v0 * T - y0 = 0
  // Discriminant = v0^2 - 4 * (0.5 * g) * (-y0) = v0^2 + 2 * g * y0
  const discriminant = initialVelocity * initialVelocity + 2 * gravity * initialHeight;

  let timeToGround = 0;
  if (discriminant >= 0) {
    timeToGround = (initialVelocity + Math.sqrt(discriminant)) / gravity;
  }
  timeToGround = Math.max(0, timeToGround);

  // Velocity at impact: v(T) = v0 - g * T
  // (In ideal free fall, v(T) = -sqrt(v0^2 + 2 * g * y0))
  const finalVelocity = initialVelocity - gravity * timeToGround;
  const finalSpeed = Math.abs(finalVelocity);

  // Apex (maximum height): reached when v(t) = 0 => t_apex = v0 / g (only if v0 > 0)
  let timeToApex = 0;
  let maxHeight = initialHeight;

  if (initialVelocity > 0) {
    timeToApex = initialVelocity / gravity;
    maxHeight = initialHeight + (initialVelocity * initialVelocity) / (2 * gravity);
  }

  // Total distance traveled along the 1D path
  let totalDistanceTravelled = initialHeight;
  if (initialVelocity > 0) {
    const upwardGain = maxHeight - initialHeight;
    totalDistanceTravelled = upwardGain + maxHeight; // Up to peak + down from peak to ground
  }

  return {
    timeToGround,
    finalVelocity,
    finalSpeed,
    maxHeight,
    timeToApex,
    totalDistanceTravelled,
    isReleasedFromRest,
    isZeroGravity: false,
  };
}

/**
 * Computes exact state at any arbitrary simulation time t.
 */
export function computeFreeFallStateAtTime(
  params: FreeFallParameters,
  t: number
): FreeFallState {
  const { initialHeight, initialVelocity, gravity } = params;
  const clampedTime = Math.max(0, t);

  // Height y(t) = y0 + v0*t - 0.5*g*t^2
  const rawY = initialHeight + initialVelocity * clampedTime - 0.5 * gravity * clampedTime * clampedTime;
  const height = Math.max(0, rawY);
  const isGrounded = rawY <= 0 && clampedTime > 0.0001;

  // Velocity v(t) = v0 - g*t
  const velocity = initialVelocity - gravity * clampedTime;
  const speed = Math.abs(velocity);

  // Acceleration a(t) = -g
  const acceleration = -gravity;

  // Displacement Delta y = y(t) - y0
  const displacement = height - initialHeight;

  // Distance traveled
  let distanceTravelled = 0;
  if (initialVelocity <= 0) {
    distanceTravelled = initialHeight - height;
  } else {
    const tApex = gravity > 0 ? initialVelocity / gravity : Infinity;
    if (clampedTime <= tApex) {
      distanceTravelled = height - initialHeight;
    } else {
      const yMax = initialHeight + (initialVelocity * initialVelocity) / (2 * gravity);
      distanceTravelled = (yMax - initialHeight) + (yMax - height);
    }
  }

  return {
    time: clampedTime,
    height,
    displacement,
    velocity,
    speed,
    acceleration,
    distanceTravelled: Math.max(0, distanceTravelled),
    isGrounded,
  };
}

/**
 * Samples trajectory at discrete time points for graphing and rendering.
 */
export function generateFreeFallTrajectory(
  params: FreeFallParameters,
  analytical: FreeFallAnalytical,
  numSamples = 200
): FreeFallSample[] {
  const maxTime = isFinite(analytical.timeToGround) && analytical.timeToGround > 0
    ? analytical.timeToGround
    : 10;

  const samples: FreeFallSample[] = [];
  const dt = maxTime / (numSamples - 1);

  for (let i = 0; i < numSamples; i++) {
    const t = i === numSamples - 1 ? maxTime : i * dt;
    const state = computeFreeFallStateAtTime(params, t);
    samples.push({
      time: t,
      height: state.height,
      velocity: state.velocity,
      acceleration: state.acceleration,
      speed: state.speed,
    });
  }

  return samples;
}

/**
 * Numerical integration simulation runner.
 * Stepped discrete Euler-Cromer integration to compare simulation vs analytical results.
 */
export function runNumericalIntegration(
  params: FreeFallParameters,
  dt = 0.005
): {
  timeToGround: number;
  finalVelocity: number;
  finalSpeed: number;
  totalDistance: number;
  stepsCount: number;
} {
  const { initialHeight, initialVelocity, gravity } = params;

  if (gravity === 0 && initialVelocity >= 0) {
    return {
      timeToGround: Infinity,
      finalVelocity: initialVelocity,
      finalSpeed: Math.abs(initialVelocity),
      totalDistance: 0,
      stepsCount: 0,
    };
  }

  let t = 0;
  let y = initialHeight;
  let v = initialVelocity;
  let dist = 0;
  let prevY = y;
  let steps = 0;
  const maxSteps = 200000;

  while (y > 0 && steps < maxSteps) {
    steps++;
    // Semi-implicit Euler (Euler-Cromer)
    v -= gravity * dt;
    y += v * dt;
    t += dt;

    dist += Math.abs(y - prevY);
    prevY = y;
  }

  // Linear interpolation for exact zero-crossing
  if (y < 0 && steps > 1) {
    const fraction = -y / (v * dt);
    t -= (1 - fraction) * dt;
    y = 0;
  }

  return {
    timeToGround: Math.max(0, t),
    finalVelocity: v,
    finalSpeed: Math.abs(v),
    totalDistance: dist,
    stepsCount: steps,
  };
}

/**
 * Compare analytical formulas with discrete numerical simulation.
 */
export function compareSimulationWithAnalytical(
  params: FreeFallParameters
): NumericalVsAnalyticalComparison {
  const analytical = calculateFreeFallAnalytical(params);
  const numerical = runNumericalIntegration(params, 0.005);

  const timeDelta = Math.abs(analytical.timeToGround - numerical.timeToGround);
  const velocityDelta = Math.abs(analytical.finalVelocity - numerical.finalVelocity);
  const speedDelta = Math.abs(analytical.finalSpeed - numerical.finalSpeed);

  return {
    analyticalTime: analytical.timeToGround,
    simulationTime: numerical.timeToGround,
    timeDelta,
    analyticalFinalVelocity: analytical.finalVelocity,
    simulationFinalVelocity: numerical.finalVelocity,
    velocityDelta,
    analyticalFinalSpeed: analytical.finalSpeed,
    simulationFinalSpeed: numerical.finalSpeed,
    speedDelta,
    integrationTimestep: 0.005,
    stepsCount: numerical.stepsCount,
  };
}

/**
 * Canonical test cases from Section 9 of the prompt.
 * Verifies physics model invariants automatically.
 */
export function runPhysicsValidationSuite(): TestCaseResult[] {
  const results: TestCaseResult[] = [];

  // Case 1: y0 = 20 m, v0 = 0, g = 9.8 m/s²
  // Expected: T ≈ sqrt(2*20/9.8) = 2.0203 s, v ≈ -sqrt(2*9.8*20) = -19.7989 m/s
  const case1Params: FreeFallParameters = { initialHeight: 20, initialVelocity: 0, gravity: 9.8 };
  const c1 = calculateFreeFallAnalytical(case1Params);
  const c1TimePass = Math.abs(c1.timeToGround - 2.02) < 0.01;
  const c1SpeedPass = Math.abs(c1.finalSpeed - 19.8) < 0.05;
  results.push({
    id: 'case-1',
    title: 'Case 1: Standard Earth Drop (20m, v₀ = 0, g = 9.8)',
    description: 'Object released from 20m under standard 9.8 m/s² gravity.',
    expected: 'Time to ground ≈ 2.02 s, Final speed ≈ 19.80 m/s',
    actual: `T = ${c1.timeToGround.toFixed(2)} s, |v| = ${c1.finalSpeed.toFixed(2)} m/s`,
    passed: c1TimePass && c1SpeedPass,
  });

  // Case 2: g = 0
  // Object should maintain constant velocity
  const case2Params: FreeFallParameters = { initialHeight: 20, initialVelocity: -5, gravity: 0 };
  const c2State0 = computeFreeFallStateAtTime(case2Params, 0);
  const c2State2 = computeFreeFallStateAtTime(case2Params, 2);
  const c2Pass = c2State0.velocity === -5 && c2State2.velocity === -5 && c2State2.acceleration === 0;
  results.push({
    id: 'case-2',
    title: 'Case 2: Zero Gravity Invariance (g = 0 m/s²)',
    description: 'Object in zero-g must maintain constant velocity (Newton\'s 1st Law).',
    expected: 'v(t) = v₀ = -5.00 m/s at all t, a(t) = 0 m/s²',
    actual: `v(0) = ${c2State0.velocity.toFixed(2)} m/s, v(2) = ${c2State2.velocity.toFixed(2)} m/s, a = ${c2State2.acceleration} m/s²`,
    passed: c2Pass,
  });

  // Case 3: v0 = 0
  // Object must begin from rest
  const case3Params: FreeFallParameters = { initialHeight: 35, initialVelocity: 0, gravity: 9.8 };
  const c3State0 = computeFreeFallStateAtTime(case3Params, 0);
  const c3Pass = c3State0.velocity === 0 && c3State0.speed === 0;
  results.push({
    id: 'case-3',
    title: 'Case 3: Rest Initial State (v₀ = 0 m/s)',
    description: 'Object released from rest must have exactly zero speed at t = 0.',
    expected: 'v(0) = 0.00 m/s, |v(0)| = 0.00 m/s',
    actual: `v(0) = ${c3State0.velocity.toFixed(2)} m/s, |v(0)| = ${c3State0.speed.toFixed(2)} m/s`,
    passed: c3Pass,
  });

  // Case 4: Moon gravity = 1.62 m/s²
  // Object should fall significantly slower than on Earth
  const moonParams: FreeFallParameters = { initialHeight: 20, initialVelocity: 0, gravity: 1.62 };
  const cMoon = calculateFreeFallAnalytical(moonParams);
  const c4Pass = cMoon.timeToGround > c1.timeToGround * 2; // Moon takes ~4.97s vs 2.02s
  results.push({
    id: 'case-4',
    title: 'Case 4: Lunar Gravity Comparison (g = 1.62 m/s²)',
    description: 'Object falls significantly slower on Moon than on Earth for same height.',
    expected: `T_moon (${cMoon.timeToGround.toFixed(2)}s) >> T_earth (2.02s)`,
    actual: `T_moon = ${cMoon.timeToGround.toFixed(2)} s (approx 2.46× slower than Earth)`,
    passed: c4Pass,
  });

  // Case 5: Mars gravity = 3.71 m/s²
  // Object should fall slower than Earth but faster than Moon
  const marsParams: FreeFallParameters = { initialHeight: 20, initialVelocity: 0, gravity: 3.71 };
  const cMars = calculateFreeFallAnalytical(marsParams);
  const c5Pass = cMars.timeToGround > c1.timeToGround && cMars.timeToGround < cMoon.timeToGround;
  results.push({
    id: 'case-5',
    title: 'Case 5: Martian Gravity Hierarchy (g = 3.71 m/s²)',
    description: 'Mars fall duration must satisfy: T_earth < T_mars < T_moon.',
    expected: `T_earth (${c1.timeToGround.toFixed(2)}s) < T_mars (${cMars.timeToGround.toFixed(2)}s) < T_moon (${cMoon.timeToGround.toFixed(2)}s)`,
    actual: `T_earth=${c1.timeToGround.toFixed(2)}s < T_mars=${cMars.timeToGround.toFixed(2)}s < T_moon=${cMoon.timeToGround.toFixed(2)}s`,
    passed: c5Pass,
  });

  return results;
}

/**
 * Free fall curated presets.
 */
export const FREE_FALL_PRESETS: FreeFallPreset[] = [
  {
    id: 'earth-drop-20m',
    name: '20m Tower Drop (Earth)',
    description: 'Classic release from rest at 20 meters under Earth gravity (9.8 m/s²).',
    params: {
      initialHeight: 20,
      initialVelocity: 0,
      gravity: 9.8,
    },
  },
  {
    id: 'upward-toss',
    name: 'Upward Toss (+15 m/s)',
    description: 'Object thrown vertically upward from 10m elevation, climbing to apex before falling.',
    params: {
      initialHeight: 10,
      initialVelocity: 15,
      gravity: 9.8,
    },
  },
  {
    id: 'downward-throw',
    name: 'Downward Spike (-12 m/s)',
    description: 'Object thrown downward from 30m with initial downward velocity.',
    params: {
      initialHeight: 30,
      initialVelocity: -12,
      gravity: 9.8,
    },
  },
  {
    id: 'lunar-drop',
    name: 'Apollo Lunar Drop (Moon)',
    description: 'Feather-and-hammer drop from 20m under lunar gravity (1.62 m/s²).',
    params: {
      initialHeight: 20,
      initialVelocity: 0,
      gravity: 1.62,
    },
  },
  {
    id: 'martian-drop',
    name: 'Mars Surface Drop',
    description: 'Fall from 20m under Martian gravitational acceleration (3.71 m/s²).',
    params: {
      initialHeight: 20,
      initialVelocity: 0,
      gravity: 3.71,
    },
  },
  {
    id: 'high-cliff-drop',
    name: '100m Cliff Drop',
    description: 'Extended vertical fall from 100 meters demonstrating high impact velocity.',
    params: {
      initialHeight: 100,
      initialVelocity: 0,
      gravity: 9.8,
    },
  },
  {
    id: 'zero-g-drift',
    name: 'Deep Space Zero-G Drift',
    description: 'Pure zero gravity condition (g = 0) with downward drift at constant speed.',
    params: {
      initialHeight: 30,
      initialVelocity: -6,
      gravity: 0,
    },
  },
];

export const FREE_FALL_GRAVITY_PRESETS = [
  { name: 'Earth (9.8)', value: 9.8, symbol: 'g_⊕' },
  { name: 'Earth Std (9.81)', value: 9.81, symbol: 'g_std' },
  { name: 'Moon (1.62)', value: 1.62, symbol: 'g_☾' },
  { name: 'Mars (3.71)', value: 3.71, symbol: 'g_♂' },
  { name: 'Zero-G (0.0)', value: 0.0, symbol: 'g_0' },
  { name: 'Jupiter (24.79)', value: 24.79, symbol: 'g_♃' },
];
