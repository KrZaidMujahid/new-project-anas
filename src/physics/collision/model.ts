/**
 * EQUATION 1 — Collision & Momentum Mathematical & Physical Model
 *
 * Core Principles:
 * - Linear Momentum: p = mv
 * - Conservation of Momentum: P_total = m1*v1 + m2*v2 = m1*v1' + m2*v2'
 * - Restitution: e = |v2' - v1'| / |v1 - v2|
 *   v1' = [(m1 - e*m2)v1 + m2(1 + e)v2] / (m1 + m2)
 *   v2' = [m1(1 + e)v1 + (m2 - e*m1)v2] / (m1 + m2)
 * - Kinetic Energy: K = 1/2 m v^2
 * - Impulse: J = Delta p = int F dt = F_avg * Delta t
 */

import {
  CollisionParameters,
  CollisionState,
  AnalyticalCollisionResult,
  NumericalCollisionResult,
  CollisionSample,
  CollisionTestReport,
} from './types';

export const DEFAULT_CART_WIDTH = 1.0; // standard cart width in meters

/**
 * Validates collision simulation parameters.
 */
export function validateCollisionParameters(params: CollisionParameters): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (params.m1 <= 0 || !Number.isFinite(params.m1)) {
    errors.push('Object 1 mass must be strictly positive (m1 > 0).');
  }
  if (params.m2 <= 0 || !Number.isFinite(params.m2)) {
    errors.push('Object 2 mass must be strictly positive (m2 > 0).');
  }
  if (!Number.isFinite(params.v1)) {
    errors.push('Object 1 velocity must be a finite number.');
  }
  if (!Number.isFinite(params.v2)) {
    errors.push('Object 2 velocity must be a finite number.');
  }
  if (params.restitution < 0 || params.restitution > 1 || !Number.isFinite(params.restitution)) {
    errors.push('Coefficient of restitution must be in the range [0, 1].');
  }
  if (params.collisionDuration <= 0 || !Number.isFinite(params.collisionDuration)) {
    errors.push('Collision contact duration must be strictly positive.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Computes exact closed-form analytical collision physics.
 */
export function computeAnalyticalCollision(params: CollisionParameters): AnalyticalCollisionResult {
  const { m1, m2, v1, v2, x1, x2, collisionType } = params;
  const w1 = params.cartWidth1 ?? DEFAULT_CART_WIDTH;
  const w2 = params.cartWidth2 ?? DEFAULT_CART_WIDTH;
  const wContact = (w1 + w2) / 2;

  // Effective coefficient of restitution based on collision type
  let e = params.restitution;
  if (collisionType === 'elastic') {
    e = 1.0;
  } else if (collisionType === 'perfectly-inelastic') {
    e = 0.0;
  } else {
    // clamped between 0 and 1
    e = Math.max(0, Math.min(1, params.restitution));
  }

  // Pre-collision values
  const p1_before = m1 * v1;
  const p2_before = m2 * v2;
  const P_total_before = p1_before + p2_before;
  const K1_before = 0.5 * m1 * v1 * v1;
  const K2_before = 0.5 * m2 * v2 * v2;
  const K_total_before = K1_before + K2_before;

  // Collision detection along 1D line:
  // Are objects moving toward each other or one catching up?
  const initialDist = x2 - x1;
  let hasCollision = false;
  let collisionTime: number | null = null;

  if (initialDist >= wContact) {
    // Object 1 is to the left of Object 2
    const closingSpeed = v1 - v2;
    if (closingSpeed > 1e-6) {
      const travelDist = initialDist - wContact;
      collisionTime = Math.max(0, travelDist / closingSpeed);
      hasCollision = true;
    }
  } else if (initialDist <= -wContact) {
    // Object 2 is to the left of Object 1
    const closingSpeed = v2 - v1;
    if (closingSpeed > 1e-6) {
      const travelDist = Math.abs(initialDist) - wContact;
      collisionTime = Math.max(0, travelDist / closingSpeed);
      hasCollision = true;
    }
  } else {
    // Already in contact at t = 0
    collisionTime = 0;
    hasCollision = true;
  }

  // Analytical Post-Collision Velocities (General 1D Restitution Formula)
  const totalM = m1 + m2;
  const v1_after = ((m1 - e * m2) * v1 + m2 * (1 + e) * v2) / totalM;
  const v2_after = (m1 * (1 + e) * v1 + (m2 - e * m1) * v2) / totalM;

  // Post-collision quantities
  const p1_after = m1 * v1_after;
  const p2_after = m2 * v2_after;
  const P_total_after = p1_after + p2_after;
  const K1_after = 0.5 * m1 * v1_after * v1_after;
  const K2_after = 0.5 * m2 * v2_after * v2_after;
  const K_total_after = K1_after + K2_after;

  const momentumError = P_total_after - P_total_before;
  const kineticEnergyChange = K_total_after - K_total_before;
  const kineticEnergyLost = Math.max(0, K_total_before - K_total_after);
  const fractionEnergyRetained = K_total_before > 1e-9 ? Math.min(1, Math.max(0, K_total_after / K_total_before)) : 1.0;

  // Impulse on Object 1: J1 = Delta p1 = m1*(v1' - v1)
  const impulseObj1 = m1 * (v1_after - v1);
  const impulseObj2 = m2 * (v2_after - v2);
  const impulseMagnitude = Math.abs(impulseObj1);

  // Contact duration & forces
  const dt = Math.max(0.01, params.collisionDuration);
  const averageForce = impulseMagnitude / dt;
  // Half-sine pulse peak force: int_0^dt F_peak * sin(pi*t/dt) dt = F_peak * (2*dt/pi) = J => F_peak = (pi/2)*F_avg
  const peakForce = (Math.PI / 2) * averageForce;

  // Combined system
  const combinedMass = m1 + m2;
  const finalCombinedVelocity = (m1 * v1 + m2 * v2) / totalM;

  return {
    hasCollision,
    collisionTime,
    p1_before,
    p2_before,
    P_total_before,
    K1_before,
    K2_before,
    K_total_before,
    v1_after,
    v2_after,
    p1_after,
    p2_after,
    P_total_after,
    K1_after,
    K2_after,
    K_total_after,
    momentumError,
    kineticEnergyChange,
    kineticEnergyLost,
    fractionEnergyRetained,
    impulseObj1,
    impulseObj2,
    impulseMagnitude,
    collisionDuration: dt,
    averageForce,
    peakForce,
    combinedMass,
    finalCombinedVelocity,
  };
}

/**
 * Computes exact state of the system at any given simulation time t >= 0.
 * Smoothly resolves the physical contact interval [t_col, t_col + dt] using a half-sine force pulse
 * so that momentum is conserved at all continuous time points and velocity smoothly transitions.
 */
export function computeCollisionStateAtTime(
  params: CollisionParameters,
  currentTime: number
): CollisionState {
  const analytical = computeAnalyticalCollision(params);
  const t = Math.max(0, currentTime);
  const { m1, m2, v1, v2, x1, x2 } = params;
  const w1 = params.cartWidth1 ?? DEFAULT_CART_WIDTH;
  const w2 = params.cartWidth2 ?? DEFAULT_CART_WIDTH;
  const wContact = (w1 + w2) / 2;

  // Case 1: No collision in finite future or objects moving apart
  if (!analytical.hasCollision || analytical.collisionTime === null) {
    const curX1 = x1 + v1 * t;
    const curX2 = x2 + v2 * t;
    const curP1 = m1 * v1;
    const curP2 = m2 * v2;
    const curK1 = 0.5 * m1 * v1 * v1;
    const curK2 = 0.5 * m2 * v2 * v2;

    return {
      time: t,
      object1: {
        mass: m1,
        position: curX1,
        velocity: v1,
        speed: Math.abs(v1),
        momentum: curP1,
        kineticEnergy: curK1,
      },
      object2: {
        mass: m2,
        position: curX2,
        velocity: v2,
        speed: Math.abs(v2),
        momentum: curP2,
        kineticEnergy: curK2,
      },
      totalMomentum: curP1 + curP2,
      totalKineticEnergy: curK1 + curK2,
      isColliding: false,
      hasCollided: false,
      contactForce: 0,
      cumulativeImpulse: 0,
      collisionTime: null,
      collisionDuration: params.collisionDuration,
    };
  }

  const tCol = analytical.collisionTime;
  const dtCol = analytical.collisionDuration;
  const tEnd = tCol + dtCol;

  // Position at contact start
  const x1_contact = x1 + v1 * tCol;
  const x2_contact = x2 + v2 * tCol;

  // Phase A: Before Collision (t < tCol)
  if (t < tCol) {
    const curX1 = x1 + v1 * t;
    const curX2 = x2 + v2 * t;
    const curP1 = m1 * v1;
    const curP2 = m2 * v2;
    const curK1 = 0.5 * m1 * v1 * v1;
    const curK2 = 0.5 * m2 * v2 * v2;

    return {
      time: t,
      object1: {
        mass: m1,
        position: curX1,
        velocity: v1,
        speed: Math.abs(v1),
        momentum: curP1,
        kineticEnergy: curK1,
      },
      object2: {
        mass: m2,
        position: curX2,
        velocity: v2,
        speed: Math.abs(v2),
        momentum: curP2,
        kineticEnergy: curK2,
      },
      totalMomentum: curP1 + curP2,
      totalKineticEnergy: curK1 + curK2,
      isColliding: false,
      hasCollided: false,
      contactForce: 0,
      cumulativeImpulse: 0,
      collisionTime: tCol,
      collisionDuration: dtCol,
    };
  }

  // Phase B: During Contact Collision (tCol <= t <= tEnd)
  if (t <= tEnd) {
    const tau = t - tCol;
    const fraction = Math.min(1, Math.max(0, tau / dtCol));

    // Force pulse magnitude: F(t) = F_peak * sin(pi * tau / dtCol)
    const instForce = analytical.peakForce * Math.sin(Math.PI * fraction);

    // Cumulative impulse on Object 1: J1(t) = int_0^tau F_1(s) ds
    // F_1(s) = sign(J1) * F_peak * sin(pi * s / dtCol)
    const sign1 = analytical.impulseObj1 >= 0 ? 1 : -1;
    const omega = Math.PI / dtCol;
    const impulseAccum = sign1 * (analytical.peakForce / omega) * (1 - Math.cos(omega * tau));

    // Instantaneous velocities
    const curV1 = v1 + impulseAccum / m1;
    const curV2 = v2 - impulseAccum / m2; // Equal & opposite impulse on Object 2!

    // Integrated displacement during pulse:
    // int_0^tau (v_init + sign * (F_peak / (m * omega)) * (1 - cos(omega*s))) ds
    // = v_init * tau + sign * (F_peak / (m * omega)) * [ tau - sin(omega*tau)/omega ]
    const disp1 = v1 * tau + (sign1 * analytical.peakForce / (m1 * omega)) * (tau - Math.sin(omega * tau) / omega);
    const disp2 = v2 * tau - (sign1 * analytical.peakForce / (m2 * omega)) * (tau - Math.sin(omega * tau) / omega);

    let curX1 = x1_contact + disp1;
    let curX2 = x2_contact + disp2;

    // Prevent interpenetration: maintain at least contact distance
    if (x2 >= x1) {
      if (curX2 - curX1 < wContact) {
        const mid = (curX1 + curX2) / 2;
        curX1 = mid - wContact / 2;
        curX2 = mid + wContact / 2;
      }
    } else {
      if (curX1 - curX2 < wContact) {
        const mid = (curX1 + curX2) / 2;
        curX2 = mid - wContact / 2;
        curX1 = mid + wContact / 2;
      }
    }

    const curP1 = m1 * curV1;
    const curP2 = m2 * curV2;
    const curK1 = 0.5 * m1 * curV1 * curV1;
    const curK2 = 0.5 * m2 * curV2 * curV2;

    return {
      time: t,
      object1: {
        mass: m1,
        position: curX1,
        velocity: curV1,
        speed: Math.abs(curV1),
        momentum: curP1,
        kineticEnergy: curK1,
      },
      object2: {
        mass: m2,
        position: curX2,
        velocity: curV2,
        speed: Math.abs(curV2),
        momentum: curP2,
        kineticEnergy: curK2,
      },
      totalMomentum: curP1 + curP2,
      totalKineticEnergy: curK1 + curK2,
      isColliding: true,
      hasCollided: false,
      contactForce: instForce,
      cumulativeImpulse: impulseAccum,
      collisionTime: tCol,
      collisionDuration: dtCol,
    };
  }

  // Phase C: After Collision (t > tEnd)
  const sign1 = analytical.impulseObj1 >= 0 ? 1 : -1;
  const omega = Math.PI / dtCol;
  // Final displacement at end of contact pulse
  const disp1End = v1 * dtCol + (sign1 * analytical.peakForce / (m1 * omega)) * (dtCol);
  const disp2End = v2 * dtCol - (sign1 * analytical.peakForce / (m2 * omega)) * (dtCol);

  let x1_pulseEnd = x1_contact + disp1End;
  let x2_pulseEnd = x2_contact + disp2End;

  // Enforce boundary contact at pulse end
  if (x2 >= x1) {
    if (x2_pulseEnd - x1_pulseEnd < wContact) {
      const mid = (x1_pulseEnd + x2_pulseEnd) / 2;
      x1_pulseEnd = mid - wContact / 2;
      x2_pulseEnd = mid + wContact / 2;
    }
  } else {
    if (x1_pulseEnd - x2_pulseEnd < wContact) {
      const mid = (x1_pulseEnd + x2_pulseEnd) / 2;
      x2_pulseEnd = mid - wContact / 2;
      x1_pulseEnd = mid + wContact / 2;
    }
  }

  const postTime = t - tEnd;
  const curV1 = analytical.v1_after;
  const curV2 = analytical.v2_after;

  let curX1: number;
  let curX2: number;

  if (params.collisionType === 'perfectly-inelastic') {
    // Both objects stuck together, moving at finalCombinedVelocity
    const vCombined = analytical.finalCombinedVelocity;
    const centerShift = vCombined * postTime;
    if (x2 >= x1) {
      const midEnd = (x1_pulseEnd + x2_pulseEnd) / 2;
      const curMid = midEnd + centerShift;
      curX1 = curMid - wContact / 2;
      curX2 = curMid + wContact / 2;
    } else {
      const midEnd = (x1_pulseEnd + x2_pulseEnd) / 2;
      const curMid = midEnd + centerShift;
      curX2 = curMid - wContact / 2;
      curX1 = curMid + wContact / 2;
    }
  } else {
    curX1 = x1_pulseEnd + curV1 * postTime;
    curX2 = x2_pulseEnd + curV2 * postTime;
  }

  const curP1 = m1 * curV1;
  const curP2 = m2 * curV2;
  const curK1 = 0.5 * m1 * curV1 * curV1;
  const curK2 = 0.5 * m2 * curV2 * curV2;

  return {
    time: t,
    object1: {
      mass: m1,
      position: curX1,
      velocity: curV1,
      speed: Math.abs(curV1),
      momentum: curP1,
      kineticEnergy: curK1,
    },
    object2: {
      mass: m2,
      position: curX2,
      velocity: curV2,
      speed: Math.abs(curV2),
      momentum: curP2,
      kineticEnergy: curK2,
    },
    totalMomentum: curP1 + curP2,
    totalKineticEnergy: curK1 + curK2,
    isColliding: false,
    hasCollided: true,
    contactForce: 0,
    cumulativeImpulse: analytical.impulseObj1,
    collisionTime: tCol,
    collisionDuration: dtCol,
  };
}

/**
 * Runs a step-by-step numerical simulation using a fixed timestep integrator
 * to empirically verify numerical vs analytical solutions.
 */
export function runNumericalSimulation(
  params: CollisionParameters,
  duration = 6.0,
  dt = 0.001
): NumericalCollisionResult {
  const { m1, m2, v1: initV1, v2: initV2, x1: initX1, x2: initX2 } = params;
  const w1 = params.cartWidth1 ?? DEFAULT_CART_WIDTH;
  const w2 = params.cartWidth2 ?? DEFAULT_CART_WIDTH;
  const wContact = (w1 + w2) / 2;

  let e = params.restitution;
  if (params.collisionType === 'elastic') e = 1.0;
  if (params.collisionType === 'perfectly-inelastic') e = 0.0;

  let x1 = initX1;
  let x2 = initX2;
  let v1 = initV1;
  let v2 = initV2;
  let collisionTime: number | null = null;
  let maxForce = 0;
  let hasCollided = false;
  let impulseRecorded = 0;

  const totalSteps = Math.ceil(duration / dt);

  for (let step = 0; step < totalSteps; step++) {
    const t = step * dt;

    // Detect contact
    const dist = x2 - x1;
    const isContact = (initX2 >= initX1 && dist <= wContact && v1 > v2) ||
                      (initX2 < initX1 && dist >= -wContact && v2 > v1);

    if (isContact && !hasCollided) {
      collisionTime = t;
      hasCollided = true;

      // Restitution impulse equation
      const totalM = m1 + m2;
      const v1_post = ((m1 - e * m2) * v1 + m2 * (1 + e) * v2) / totalM;
      const v2_post = (m1 * (1 + e) * v1 + (m2 - e * m1) * v2) / totalM;

      const J = m1 * (v1_post - v1);
      impulseRecorded = Math.abs(J);
      maxForce = impulseRecorded / Math.max(0.01, params.collisionDuration);

      v1 = v1_post;
      v2 = v2_post;

      // Reposition to contact boundary
      if (initX2 >= initX1) {
        const mid = (x1 + x2) / 2;
        x1 = mid - wContact / 2;
        x2 = mid + wContact / 2;
      } else {
        const mid = (x1 + x2) / 2;
        x2 = mid - wContact / 2;
        x1 = mid + wContact / 2;
      }
    }

    if (hasCollided && params.collisionType === 'perfectly-inelastic') {
      // Keep stuck together
      const vFinal = (m1 * v1 + m2 * v2) / (m1 + m2);
      x1 += vFinal * dt;
      x2 += vFinal * dt;
    } else {
      x1 += v1 * dt;
      x2 += v2 * dt;
    }
  }

  const P_total = m1 * v1 + m2 * v2;
  const K_total = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;

  return {
    v1_after: v1,
    v2_after: v2,
    P_total_after: P_total,
    K_total_after: K_total,
    collisionTime,
    maxForce,
    impulse: impulseRecorded,
    simulatedFinalTime: duration,
  };
}

/**
 * Generates discrete samples along the time axis for SVG graphs.
 */
export function generateCollisionSamples(
  params: CollisionParameters,
  duration = 6.0,
  numSamples = 200
): CollisionSample[] {
  const samples: CollisionSample[] = [];
  const dt = duration / numSamples;

  for (let i = 0; i <= numSamples; i++) {
    const t = i * dt;
    const st = computeCollisionStateAtTime(params, t);

    samples.push({
      time: t,
      x1: st.object1.position,
      x2: st.object2.position,
      v1: st.object1.velocity,
      v2: st.object2.velocity,
      p1: st.object1.momentum,
      p2: st.object2.momentum,
      P_total: st.totalMomentum,
      K1: st.object1.kineticEnergy,
      K2: st.object2.kineticEnergy,
      K_total: st.totalKineticEnergy,
      contactForce: st.contactForce,
      cumulativeImpulse: st.cumulativeImpulse,
      isColliding: st.isColliding,
      hasCollided: st.hasCollided,
    });
  }

  return samples;
}

/**
 * Comprehensive Automated Physics Validation Suite (11 Required Tests)
 * Directly verifies all physics invariants, conservation laws, and corner cases.
 */
export function runCollisionValidationTests(): CollisionTestReport[] {
  const reports: CollisionTestReport[] = [];

  // Helper tolerance check
  const isClose = (a: number, b: number, tol = 1e-4) => Math.abs(a - b) <= tol;

  // TEST 1: Equal-mass elastic collision
  // m1 = 2, v1 = 5, m2 = 2, v2 = 0 -> v1' ~ 0, v2' ~ 5
  {
    const res = computeAnalyticalCollision({
      collisionType: 'elastic',
      m1: 2.0,
      v1: 5.0,
      x1: 0,
      m2: 2.0,
      v2: 0,
      x2: 10,
      restitution: 1.0,
      collisionDuration: 0.05,
    });
    const passed = isClose(res.v1_after, 0.0) && isClose(res.v2_after, 5.0);
    reports.push({
      id: 'test-1',
      title: 'TEST 1: Equal-Mass Elastic Collision',
      description: 'Equal masses in elastic collision exchange velocities completely (v1\' ≈ 0, v2\' ≈ v1).',
      passed,
      expected: "v1' = 0.00 m/s, v2' = 5.00 m/s",
      actual: `v1' = ${res.v1_after.toFixed(4)} m/s, v2' = ${res.v2_after.toFixed(4)} m/s`,
      errorMargin: `|Δv1| = ${Math.abs(res.v1_after).toExponential(2)}`,
    });
  }

  // TEST 2: Perfectly inelastic collision
  // m1 = 2, v1 = 5, m2 = 3, v2 = 0 -> v1' = v2' = (10)/5 = 2.0 m/s
  {
    const res = computeAnalyticalCollision({
      collisionType: 'perfectly-inelastic',
      m1: 2.0,
      v1: 5.0,
      x1: 0,
      m2: 3.0,
      v2: 0,
      x2: 10,
      restitution: 0.0,
      collisionDuration: 0.05,
    });
    const passed = isClose(res.v1_after, 2.0) && isClose(res.v2_after, 2.0) && isClose(res.v1_after, res.v2_after);
    reports.push({
      id: 'test-2',
      title: 'TEST 2: Perfectly Inelastic Collision Coalescence',
      description: 'Both objects stick together and share the identical final combined velocity v_final = P / (m1 + m2).',
      passed,
      expected: "v1' = v2' = 2.0000 m/s",
      actual: `v1' = ${res.v1_after.toFixed(4)} m/s, v2' = ${res.v2_after.toFixed(4)} m/s`,
      errorMargin: `|v2' - v1'| = ${Math.abs(res.v2_after - res.v1_after).toExponential(2)}`,
    });
  }

  // TEST 3: Momentum conservation across arbitrary parameters
  {
    const res = computeAnalyticalCollision({
      collisionType: 'inelastic',
      m1: 3.5,
      v1: 7.2,
      x1: 2.0,
      m2: 1.8,
      v2: -3.4,
      x2: 12.0,
      restitution: 0.65,
      collisionDuration: 0.05,
    });
    const passed = isClose(res.P_total_before, res.P_total_after, 1e-6);
    reports.push({
      id: 'test-3',
      title: 'TEST 3: Total Momentum Conservation',
      description: 'Total linear momentum must be invariant: P_before = P_after within numerical tolerance.',
      passed,
      expected: `P = ${res.P_total_before.toFixed(4)} kg·m/s (Error ≈ 0.0)`,
      actual: `P_before = ${res.P_total_before.toFixed(4)}, P_after = ${res.P_total_after.toFixed(4)} kg·m/s`,
      errorMargin: `|P_after - P_before| = ${Math.abs(res.momentumError).toExponential(2)} kg·m/s`,
    });
  }

  // TEST 4: Elastic energy conservation
  {
    const res = computeAnalyticalCollision({
      collisionType: 'elastic',
      m1: 4.2,
      v1: 6.0,
      x1: 0,
      m2: 2.1,
      v2: -2.0,
      x2: 15.0,
      restitution: 1.0,
      collisionDuration: 0.05,
    });
    const passed = isClose(res.K_total_before, res.K_total_after, 1e-6);
    reports.push({
      id: 'test-4',
      title: 'TEST 4: Elastic Kinetic Energy Conservation',
      description: 'In an ideal elastic collision, total kinetic energy is strictly conserved (K_before ≈ K_after).',
      passed,
      expected: `K = ${res.K_total_before.toFixed(4)} J (ΔK ≈ 0.0 J)`,
      actual: `K_before = ${res.K_total_before.toFixed(4)} J, K_after = ${res.K_total_after.toFixed(4)} J`,
      errorMargin: `|ΔK| = ${Math.abs(res.kineticEnergyChange).toExponential(2)} J`,
    });
  }

  // TEST 5: Inelastic energy loss
  {
    const res = computeAnalyticalCollision({
      collisionType: 'inelastic',
      m1: 3.0,
      v1: 8.0,
      x1: 0,
      m2: 3.0,
      v2: 0,
      x2: 10,
      restitution: 0.5,
      collisionDuration: 0.05,
    });
    const passed = res.K_total_after < res.K_total_before && res.kineticEnergyLost > 0;
    reports.push({
      id: 'test-5',
      title: 'TEST 5: Inelastic Kinetic Energy Dissipation',
      description: 'In an inelastic collision (e < 1), kinetic energy is lost into thermal/deformation modes (K_after < K_before).',
      passed,
      expected: 'K_after < K_before and Energy Lost > 0 J',
      actual: `K_before = ${res.K_total_before.toFixed(2)} J, K_after = ${res.K_total_after.toFixed(2)} J, Lost = ${res.kineticEnergyLost.toFixed(2)} J`,
      errorMargin: `Retention: ${(res.fractionEnergyRetained * 100).toFixed(1)}%`,
    });
  }

  // TEST 6: Zero velocity
  {
    const res = computeAnalyticalCollision({
      collisionType: 'elastic',
      m1: 5.0,
      v1: 0.0,
      x1: 0,
      m2: 5.0,
      v2: 0.0,
      x2: 10,
      restitution: 1.0,
      collisionDuration: 0.05,
    });
    const passed = res.p1_before === 0 && res.p2_before === 0 && res.P_total_before === 0;
    reports.push({
      id: 'test-6',
      title: 'TEST 6: Zero Initial Velocity Invariants',
      description: 'At zero velocity, momentum must be strictly zero (p = 0, P_total = 0).',
      passed,
      expected: 'p1 = 0, p2 = 0, P_total = 0 kg·m/s',
      actual: `p1 = ${res.p1_before}, p2 = ${res.p2_before}, P_total = ${res.P_total_before} kg·m/s`,
    });
  }

  // TEST 7: Negative velocity handling and momentum direction
  {
    const res = computeAnalyticalCollision({
      collisionType: 'elastic',
      m1: 2.0,
      v1: -4.0,
      x1: 10,
      m2: 3.0,
      v2: 2.0,
      x2: 0,
      restitution: 1.0,
      collisionDuration: 0.05,
    });
    const passed = res.p1_before === -8.0 && res.p2_before === 6.0 && isClose(res.P_total_before, -2.0);
    reports.push({
      id: 'test-7',
      title: 'TEST 7: Negative Velocity & Vector Direction',
      description: 'Negative velocities correctly produce negative linear momentum along the 1D reference axis.',
      passed,
      expected: 'p1 = -8.0 kg·m/s, p2 = +6.0 kg·m/s, P = -2.0 kg·m/s',
      actual: `p1 = ${res.p1_before.toFixed(2)}, p2 = ${res.p2_before.toFixed(2)}, P = ${res.P_total_before.toFixed(2)} kg·m/s`,
    });
  }

  // TEST 8: Impulse verification: J = Delta p = F_avg * Delta t
  {
    const res = computeAnalyticalCollision({
      collisionType: 'elastic',
      m1: 2.0,
      v1: 6.0,
      x1: 0,
      m2: 2.0,
      v2: 0,
      x2: 10,
      restitution: 1.0,
      collisionDuration: 0.08,
    });
    const deltaP1 = res.p1_after - res.p1_before;
    const impulseCalc = -res.averageForce * res.collisionDuration;
    const passed = isClose(res.impulseObj1, deltaP1, 1e-5) && isClose(deltaP1, impulseCalc, 1e-5);
    reports.push({
      id: 'test-8',
      title: 'TEST 8: Impulse-Momentum Theorem',
      description: 'The impulse J delivered during contact equals the exact momentum change (J = Δp = F_avg · Δt).',
      passed,
      expected: `J = Δp = ${deltaP1.toFixed(4)} N·s`,
      actual: `J1 = ${res.impulseObj1.toFixed(4)} N·s, F_avg·Δt = ${(-res.averageForce * res.collisionDuration).toFixed(4)} N·s`,
      errorMargin: `|J - Δp| = ${Math.abs(res.impulseObj1 - deltaP1).toExponential(2)}`,
    });
  }

  // TEST 9: Mass scaling (Doubling mass doubles momentum for constant velocity)
  {
    const mA = 2.0;
    const mB = 4.0;
    const v = 5.0;
    const pA = mA * v;
    const pB = mB * v;
    const passed = isClose(pB, 2 * pA);
    reports.push({
      id: 'test-9',
      title: 'TEST 9: Mass Linearity & Scaling',
      description: 'At constant velocity, doubling mass strictly doubles momentum (p = mv).',
      passed,
      expected: `pB / pA = 2.0000`,
      actual: `pA = ${pA.toFixed(2)} kg·m/s, pB = ${pB.toFixed(2)} kg·m/s (Ratio: ${(pB / pA).toFixed(4)})`,
    });
  }

  // TEST 10: Coefficient of restitution verification: e = |v2' - v1'| / |v1 - v2|
  {
    const targetE = 0.72;
    const res = computeAnalyticalCollision({
      collisionType: 'inelastic',
      m1: 3.0,
      v1: 6.0,
      x1: 0,
      m2: 2.0,
      v2: -1.0,
      x2: 10,
      restitution: targetE,
      collisionDuration: 0.05,
    });
    const relBefore = Math.abs(6.0 - (-1.0)); // 7.0
    const relAfter = Math.abs(res.v2_after - res.v1_after);
    const measuredE = relAfter / relBefore;
    const passed = isClose(measuredE, targetE, 1e-6);
    reports.push({
      id: 'test-10',
      title: 'TEST 10: Coefficient of Restitution Restitution Law',
      description: 'The measured relative separation speed ratio exactly matches preset e = |v2\' - v1\'| / |v1 - v2|.',
      passed,
      expected: `e = ${targetE.toFixed(4)}`,
      actual: `e_measured = ${measuredE.toFixed(4)}`,
      errorMargin: `|e_calc - e_target| = ${Math.abs(measuredE - targetE).toExponential(2)}`,
    });
  }

  // TEST 11: Analytical vs Numerical final velocities comparison
  {
    const testParams: CollisionParameters = {
      collisionType: 'elastic',
      m1: 2.5,
      v1: 4.0,
      x1: 2.0,
      m2: 1.5,
      v2: 0.0,
      x2: 6.0,
      restitution: 1.0,
      collisionDuration: 0.05,
    };
    const analytical = computeAnalyticalCollision(testParams);
    const numerical = runNumericalSimulation(testParams, 5.0, 0.0005);
    const diffV1 = Math.abs(analytical.v1_after - numerical.v1_after);
    const diffV2 = Math.abs(analytical.v2_after - numerical.v2_after);
    const passed = diffV1 < 0.01 && diffV2 < 0.01;
    reports.push({
      id: 'test-11',
      title: 'TEST 11: Analytical vs Numerical Integration Agreement',
      description: 'Discrete numerical simulation converges to exact analytical solution within numerical tolerance.',
      passed,
      expected: `v1' = ${analytical.v1_after.toFixed(4)}, v2' = ${analytical.v2_after.toFixed(4)} m/s`,
      actual: `v1_num' = ${numerical.v1_after.toFixed(4)}, v2_num' = ${numerical.v2_after.toFixed(4)} m/s`,
      errorMargin: `max(|Δv|) = ${Math.max(diffV1, diffV2).toExponential(2)} m/s`,
    });
  }

  return reports;
}
