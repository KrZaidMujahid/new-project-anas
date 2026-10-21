/**
 * EQUATION 1 — Uniform Circular Motion Mathematical & Physical Model
 *
 * Governing Equations:
 * - Angular position: θ(t) = θ₀ + ωt
 * - Cartesian coordinates:
 *   x(t) = x_c + r cos(θ)
 *   y(t) = y_c + r sin(θ)
 * - Linear Velocity:
 *   vx(t) = -r ω sin(θ)
 *   vy(t) = r ω cos(θ)
 *   Speed v = r|ω| (perpendicular to radius vector: v · r = 0)
 * - Centripetal Acceleration:
 *   ax(t) = -r ω² cos(θ)
 *   ay(t) = -r ω² sin(θ)
 *   Magnitude a_c = v²/r = r ω² (points radially inward: a · r < 0)
 * - Centripetal Force:
 *   F_c = m a_c = m v²/r = m r ω²
 * - Period & Frequency:
 *   T = 2π / |ω|,  f = 1 / T = |ω| / 2π
 */

import {
  CircularParameters,
  CircularState,
  CircularDerivedValues,
  CircularSample,
  CircularTestReport,
} from './types';

/**
 * Validates circular motion parameters against physical constraints.
 */
export function validateCircularParameters(params: CircularParameters): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (params.mass <= 0 || !Number.isFinite(params.mass)) {
    errors.push('Mass must be strictly positive (m > 0 kg).');
  }
  if (params.radius <= 0 || !Number.isFinite(params.radius)) {
    errors.push('Radius must be strictly positive (r > 0 m).');
  }
  if (!Number.isFinite(params.angularVelocity)) {
    errors.push('Angular velocity must be a valid number.');
  }
  if (!Number.isFinite(params.initialAngleDeg)) {
    errors.push('Initial angle must be a valid number.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Computes derived time-invariant properties for uniform circular motion.
 */
export function computeCircularDerivedValues(
  params: CircularParameters
): CircularDerivedValues {
  const { mass, radius, angularVelocity } = params;
  const absOmega = Math.abs(angularVelocity);
  const speed = radius * absOmega;
  const centripetalAccel = radius * angularVelocity * angularVelocity; // v²/r = r*ω²
  const centripetalForce = mass * centripetalAccel; // m*a_c
  const period = absOmega > 1e-9 ? (2 * Math.PI) / absOmega : Infinity;
  const frequency = absOmega > 1e-9 ? absOmega / (2 * Math.PI) : 0;
  const angularVelocityRpm = (absOmega * 60) / (2 * Math.PI);
  const kineticEnergy = 0.5 * mass * speed * speed;

  return {
    speed,
    centripetalAccel,
    centripetalForce,
    period,
    frequency,
    angularVelocityRpm,
    kineticEnergy,
  };
}

/**
 * Computes exact state at any given simulation time t.
 */
export function computeCircularStateAtTime(
  params: CircularParameters,
  time: number
): CircularState {
  const t = Math.max(0, time);
  const { mass, radius, angularVelocity, initialAngleDeg } = params;
  const cx = params.centerX ?? 0;
  const cy = params.centerY ?? 0;

  const theta0Rad = (initialAngleDeg * Math.PI) / 180;
  const totalThetaRad = theta0Rad + angularVelocity * t;
  const normalizedThetaRad = ((totalThetaRad % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  const thetaDeg = (normalizedThetaRad * 180) / Math.PI;

  const cosTheta = Math.cos(totalThetaRad);
  const sinTheta = Math.sin(totalThetaRad);

  // Position
  const x = cx + radius * cosTheta;
  const y = cy + radius * sinTheta;

  // Velocity components (d/dt of position)
  // vx = d/dt (cx + r cos(theta0 + omega t)) = -r omega sin(theta)
  // vy = d/dt (cy + r sin(theta0 + omega t)) = r omega cos(theta)
  const vx = -radius * angularVelocity * sinTheta;
  const vy = radius * angularVelocity * cosTheta;
  const speed = radius * Math.abs(angularVelocity);

  // Acceleration components (d/dt of velocity)
  // ax = -r omega^2 cos(theta)
  // ay = -r omega^2 sin(theta)
  const omegaSq = angularVelocity * angularVelocity;
  const ax = -radius * omegaSq * cosTheta;
  const ay = -radius * omegaSq * sinTheta;
  const centripetalAccel = radius * omegaSq;

  // Force
  const centripetalForce = mass * centripetalAccel;

  // Period and frequency
  const absOmega = Math.abs(angularVelocity);
  const period = absOmega > 1e-9 ? (2 * Math.PI) / absOmega : Infinity;
  const frequency = absOmega > 1e-9 ? absOmega / (2 * Math.PI) : 0;
  const kineticEnergy = 0.5 * mass * speed * speed;

  return {
    time: t,
    thetaRad: totalThetaRad,
    thetaDeg,
    x,
    y,
    vx,
    vy,
    ax,
    ay,
    speed,
    centripetalAccel,
    centripetalForce,
    period,
    frequency,
    kineticEnergy,
  };
}

/**
 * Generates discrete time samples along trajectory for SVG graphing.
 */
export function generateCircularSamples(
  params: CircularParameters,
  duration = 6.0,
  numSamples = 200
): CircularSample[] {
  const samples: CircularSample[] = [];
  const dt = duration / numSamples;

  for (let i = 0; i <= numSamples; i++) {
    const t = i * dt;
    const st = computeCircularStateAtTime(params, t);

    samples.push({
      time: t,
      thetaRad: st.thetaRad,
      thetaDeg: st.thetaDeg,
      x: st.x,
      y: st.y,
      vx: st.vx,
      vy: st.vy,
      ax: st.ax,
      ay: st.ay,
      speed: st.speed,
      centripetalAccel: st.centripetalAccel,
      centripetalForce: st.centripetalForce,
      kineticEnergy: st.kineticEnergy,
    });
  }

  return samples;
}

/**
 * Runs a discrete time-step numerical integration (Symplectic Euler-Cromer)
 * to benchmark against theoretical analytical equations.
 */
export function runNumericalCircularSimulation(
  params: CircularParameters,
  duration = 6.0,
  dt = 0.0005
) {
  const { mass, radius, angularVelocity, initialAngleDeg } = params;
  const theta0 = (initialAngleDeg * Math.PI) / 180;

  // Initial state
  let x = radius * Math.cos(theta0);
  let y = radius * Math.sin(theta0);
  let vx = -radius * angularVelocity * Math.sin(theta0);
  let vy = radius * angularVelocity * Math.cos(theta0);

  const omegaSq = angularVelocity * angularVelocity;
  const steps = Math.ceil(duration / dt);

  for (let i = 0; i < steps; i++) {
    // a = -omega^2 * r_vec
    const ax = -omegaSq * x;
    const ay = -omegaSq * y;

    // Velocity update
    vx += ax * dt;
    vy += ay * dt;

    // Position update
    x += vx * dt;
    y += vy * dt;
  }

  const speed = Math.hypot(vx, vy);
  const ax = -omegaSq * x;
  const ay = -omegaSq * y;
  const a_c = Math.hypot(ax, ay);
  const F_c = mass * a_c;

  return {
    finalTime: duration,
    x,
    y,
    vx,
    vy,
    ax,
    ay,
    speed,
    a_c,
    F_c,
  };
}

/**
 * Automated Physical Invariant Verification Suite (All 12 Required Tests)
 */
export function runCircularValidationTests(): CircularTestReport[] {
  const reports: CircularTestReport[] = [];
  const isClose = (a: number, b: number, tol = 1e-4) => Math.abs(a - b) <= tol;

  // TEST 1: r = 5 m, ω = 2 rad/s => v = 10 m/s
  {
    const derived = computeCircularDerivedValues({
      mass: 1.0,
      radius: 5.0,
      angularVelocity: 2.0,
      initialAngleDeg: 0,
    });
    const passed = isClose(derived.speed, 10.0);
    reports.push({
      id: 'test-1',
      title: 'TEST 1: Linear Speed Equation (v = rω)',
      description: 'With r = 5 m and ω = 2 rad/s, linear speed v must equal exactly 10.00 m/s.',
      passed,
      expected: 'v = 10.0000 m/s',
      actual: `v = ${derived.speed.toFixed(4)} m/s`,
      errorMargin: `|Δv| = ${Math.abs(derived.speed - 10.0).toExponential(2)} m/s`,
    });
  }

  // TEST 2: r = 5 m, ω = 2 rad/s => a_c = 20 m/s²
  {
    const derived = computeCircularDerivedValues({
      mass: 1.0,
      radius: 5.0,
      angularVelocity: 2.0,
      initialAngleDeg: 0,
    });
    const passed = isClose(derived.centripetalAccel, 20.0);
    reports.push({
      id: 'test-2',
      title: 'TEST 2: Centripetal Acceleration Equation (a_c = rω² = v²/r)',
      description: 'With r = 5 m and ω = 2 rad/s, centripetal acceleration must equal exactly 20.00 m/s².',
      passed,
      expected: 'a_c = 20.0000 m/s²',
      actual: `a_c = ${derived.centripetalAccel.toFixed(4)} m/s²`,
      errorMargin: `|Δa_c| = ${Math.abs(derived.centripetalAccel - 20.0).toExponential(2)} m/s²`,
    });
  }

  // TEST 3: m = 2 kg, r = 5 m, ω = 2 rad/s => F_c = 40 N
  {
    const derived = computeCircularDerivedValues({
      mass: 2.0,
      radius: 5.0,
      angularVelocity: 2.0,
      initialAngleDeg: 0,
    });
    const passed = isClose(derived.centripetalForce, 40.0);
    reports.push({
      id: 'test-3',
      title: 'TEST 3: Centripetal Force Equation (F_c = m a_c)',
      description: 'With m = 2 kg, r = 5 m, and ω = 2 rad/s, required centripetal force is F_c = 40.00 N.',
      passed,
      expected: 'F_c = 40.0000 N',
      actual: `F_c = ${derived.centripetalForce.toFixed(4)} N`,
      errorMargin: `|ΔF_c| = ${Math.abs(derived.centripetalForce - 40.0).toExponential(2)} N`,
    });
  }

  // TEST 4: ω = 0 => v = 0, a_c = 0, F_c = 0
  {
    const derived = computeCircularDerivedValues({
      mass: 2.0,
      radius: 5.0,
      angularVelocity: 0.0,
      initialAngleDeg: 0,
    });
    const passed = derived.speed === 0 && derived.centripetalAccel === 0 && derived.centripetalForce === 0;
    reports.push({
      id: 'test-4',
      title: 'TEST 4: Zero Angular Velocity Boundary (ω = 0)',
      description: 'At zero rotation, all dynamic quantities must strictly evaluate to zero (v = 0, a_c = 0, F_c = 0).',
      passed,
      expected: 'v = 0 m/s, a_c = 0 m/s², F_c = 0 N',
      actual: `v = ${derived.speed}, a_c = ${derived.centripetalAccel}, F_c = ${derived.centripetalForce}`,
    });
  }

  // TEST 5: Double radius while keeping ω constant => v doubles, a_c doubles
  {
    const d1 = computeCircularDerivedValues({ mass: 1, radius: 3, angularVelocity: 2, initialAngleDeg: 0 });
    const d2 = computeCircularDerivedValues({ mass: 1, radius: 6, angularVelocity: 2, initialAngleDeg: 0 });
    const passed = isClose(d2.speed, 2 * d1.speed) && isClose(d2.centripetalAccel, 2 * d1.centripetalAccel);
    reports.push({
      id: 'test-5',
      title: 'TEST 5: Radius Linearity Scaling (v ∝ r and a_c ∝ r at fixed ω)',
      description: 'Doubling radius strictly doubles linear speed and doubles centripetal acceleration.',
      passed,
      expected: 'v_ratio = 2.000, a_ratio = 2.000',
      actual: `v_ratio = ${(d2.speed / d1.speed).toFixed(4)}, a_ratio = ${(d2.centripetalAccel / d1.centripetalAccel).toFixed(4)}`,
    });
  }

  // TEST 6: Double angular velocity while keeping radius constant => v doubles, a_c quadruples
  {
    const d1 = computeCircularDerivedValues({ mass: 1, radius: 4, angularVelocity: 1.5, initialAngleDeg: 0 });
    const d2 = computeCircularDerivedValues({ mass: 1, radius: 4, angularVelocity: 3.0, initialAngleDeg: 0 });
    const passed = isClose(d2.speed, 2 * d1.speed) && isClose(d2.centripetalAccel, 4 * d1.centripetalAccel);
    reports.push({
      id: 'test-6',
      title: 'TEST 6: Angular Velocity Quadratic Scaling (v ∝ ω, a_c ∝ ω²)',
      description: 'Doubling angular velocity doubles linear speed and quadruples centripetal acceleration (2² = 4).',
      passed,
      expected: 'v_ratio = 2.000, a_ratio = 4.000',
      actual: `v_ratio = ${(d2.speed / d1.speed).toFixed(4)}, a_ratio = ${(d2.centripetalAccel / d1.centripetalAccel).toFixed(4)}`,
    });
  }

  // TEST 7: Double mass while keeping r and ω constant => a_c unchanged, F_c doubles
  {
    const d1 = computeCircularDerivedValues({ mass: 2, radius: 4, angularVelocity: 2, initialAngleDeg: 0 });
    const d2 = computeCircularDerivedValues({ mass: 4, radius: 4, angularVelocity: 2, initialAngleDeg: 0 });
    const passed = isClose(d1.centripetalAccel, d2.centripetalAccel) && isClose(d2.centripetalForce, 2 * d1.centripetalForce);
    reports.push({
      id: 'test-7',
      title: 'TEST 7: Mass Invariance of Acceleration (a_c independent of m, F_c ∝ m)',
      description: 'Changing mass has zero effect on centripetal acceleration, but scales centripetal force linearly.',
      passed,
      expected: 'a_c unchanged (diff = 0), F_ratio = 2.000',
      actual: `Δa_c = ${Math.abs(d2.centripetalAccel - d1.centripetalAccel).toFixed(4)}, F_ratio = ${(d2.centripetalForce / d1.centripetalForce).toFixed(4)}`,
    });
  }

  // TEST 8: Verify Period T = 2π / ω
  {
    const omega = 3.14159265;
    const derived = computeCircularDerivedValues({ mass: 1, radius: 2, angularVelocity: omega, initialAngleDeg: 0 });
    const expectedT = (2 * Math.PI) / omega;
    const passed = isClose(derived.period, expectedT, 1e-6);
    reports.push({
      id: 'test-8',
      title: 'TEST 8: Period Formulation (T = 2π / ω)',
      description: 'Rotational period must satisfy T = 2π / ω identically.',
      passed,
      expected: `T = ${expectedT.toFixed(4)} s`,
      actual: `T = ${derived.period.toFixed(4)} s`,
      errorMargin: `|ΔT| = ${Math.abs(derived.period - expectedT).toExponential(2)} s`,
    });
  }

  // TEST 9: Verify Frequency f = 1 / T
  {
    const derived = computeCircularDerivedValues({ mass: 1, radius: 2, angularVelocity: 4.0, initialAngleDeg: 0 });
    const passed = isClose(derived.frequency * derived.period, 1.0, 1e-6);
    reports.push({
      id: 'test-9',
      title: 'TEST 9: Frequency-Period Inversion (f = 1 / T)',
      description: 'Rotational frequency must strictly equal the reciprocal of orbital period (f · T = 1).',
      passed,
      expected: 'f · T = 1.000000',
      actual: `f · T = ${(derived.frequency * derived.period).toFixed(6)}`,
    });
  }

  // TEST 10: Verify Velocity vector is perpendicular to Radius vector (v · r = 0)
  {
    const params: CircularParameters = { mass: 2, radius: 3.5, angularVelocity: 2.5, initialAngleDeg: 37 };
    let maxDotProduct = 0;
    for (let t = 0; t <= 4; t += 0.2) {
      const st = computeCircularStateAtTime(params, t);
      // dot product: r_vec · v_vec = x * vx + y * vy
      const dot = st.x * st.vx + st.y * st.vy;
      if (Math.abs(dot) > maxDotProduct) maxDotProduct = Math.abs(dot);
    }
    const passed = maxDotProduct < 1e-6;
    reports.push({
      id: 'test-10',
      title: 'TEST 10: Orthogonality of Velocity (v ⊥ r, v · r = 0)',
      description: 'The linear velocity vector must remain strictly perpendicular to the position vector for all t.',
      passed,
      expected: 'r · v = 0.0000',
      actual: `max(|r · v|) = ${maxDotProduct.toExponential(2)}`,
    });
  }

  // TEST 11: Verify Acceleration vector points toward center (a || -r, a · r = -r * a_c)
  {
    const params: CircularParameters = { mass: 2, radius: 4.0, angularVelocity: 3.0, initialAngleDeg: 45 };
    let pointsInward = true;
    for (let t = 0; t <= 4; t += 0.25) {
      const st = computeCircularStateAtTime(params, t);
      // dot product of r and a: should be -r^2 * omega^2 = -r * a_c
      const dot = st.x * st.ax + st.y * st.ay;
      const expectedDot = -params.radius * st.centripetalAccel;
      if (!isClose(dot, expectedDot, 1e-5)) pointsInward = false;
    }
    reports.push({
      id: 'test-11',
      title: 'TEST 11: Centripetal Orientation of Acceleration (a points radially inward)',
      description: 'The acceleration vector points antiparallel to position (a · r = -r · a_c < 0).',
      passed: pointsInward,
      expected: 'a = -ω² r (strictly inward)',
      actual: pointsInward ? 'Verified antiparallel across all t' : 'Vector misalignment detected',
    });
  }

  // TEST 12: Compare analytical and numerical positions over time
  {
    const params: CircularParameters = { mass: 1.5, radius: 3.0, angularVelocity: 2.0, initialAngleDeg: 0 };
    const analytical = computeCircularStateAtTime(params, 3.0);
    const numerical = runNumericalCircularSimulation(params, 3.0, 0.0005);
    const diffPos = Math.hypot(analytical.x - numerical.x, analytical.y - numerical.y);
    const passed = diffPos < 0.05;
    reports.push({
      id: 'test-12',
      title: 'TEST 12: Analytical vs Numerical Integration Trajectory Agreement',
      description: 'Discrete numerical time-stepping agrees with closed-form trajectory within numerical tolerance.',
      passed,
      expected: `x = ${analytical.x.toFixed(3)} m, y = ${analytical.y.toFixed(3)} m`,
      actual: `x_num = ${numerical.x.toFixed(3)} m, y_num = ${numerical.y.toFixed(3)} m`,
      errorMargin: `|Δr| = ${diffPos.toExponential(2)} m`,
    });
  }

  return reports;
}
