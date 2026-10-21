/**
 * Automated Physical Verification & Unit Tests for Simple Harmonic Motion
 * Tests all key physics functions, formulas, conservation laws, and conversions.
 */

import {
  computeSHMDerivedValues,
  computeSHMStateAtTime,
  convertInitialConditionsToAmplitudePhase,
  generateSHMSamples,
  validateSHMParameters,
} from './model.ts';
import { SHMParameters } from './types.ts';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function assertClose(a: number, b: number, epsilon = 1e-6, message = '') {
  const diff = Math.abs(a - b);
  if (diff > epsilon) {
    throw new Error(`Values not close: ${a} vs ${b} (diff=${diff}, tol=${epsilon}) ${message}`);
  }
}

console.log('Running SHM Physics Model Unit Tests...\n');

// 1. Benchmark: m = 1 kg, k = 20 N/m, A = 0.2 m, phi = 0
{
  const params: SHMParameters = {
    systemType: 'horizontal-spring',
    inputMode: 'amplitude-phase',
    mass: 1.0,
    springConstant: 20.0,
    amplitude: 0.20,
    initialPhaseDeg: 0,
    initialDisplacement: 0.20,
    initialVelocity: 0,
    gravity: 9.80,
    pendulumLength: 1.0,
    pendulumInitialAngleDeg: 12,
  };

  const derived = computeSHMDerivedValues(params);

  // omega = sqrt(20) = 4.472135955
  assertClose(derived.omega, Math.sqrt(20), 1e-9, 'Angular frequency omega');
  // period = 2*pi / sqrt(20) = 1.404962946
  assertClose(derived.period, (2 * Math.PI) / Math.sqrt(20), 1e-9, 'Period T');
  // frequency = 1 / T = sqrt(20)/(2*pi) = 0.7117625
  assertClose(derived.frequency, 1 / derived.period, 1e-9, 'Frequency f');
  // v_max = A * omega = 0.2 * sqrt(20) = 0.894427
  assertClose(derived.vMax, 0.2 * Math.sqrt(20), 1e-9, 'Maximum velocity vMax');
  // a_max = A * omega^2 = 0.2 * 20 = 4.0 m/s^2
  assertClose(derived.aMax, 4.0, 1e-9, 'Maximum acceleration aMax');
  // total energy E = 1/2 * k * A^2 = 0.5 * 20 * 0.04 = 0.40 J
  assertClose(derived.totalEnergy, 0.40, 1e-9, 'Total mechanical energy E');

  console.log('✔ Test 1 Passed: Benchmark mass-spring invariants (m=1kg, k=20N/m, A=0.2m)');

  // Kinematics at t = 0: x(0) = A = 0.2, v(0) = 0, a(0) = -4.0, K = 0, U = 0.4, F = -4.0 N
  const s0 = computeSHMStateAtTime(params, 0);
  assertClose(s0.displacement, 0.20, 1e-9, 'x(0) = A');
  assertClose(s0.velocity, 0.0, 1e-9, 'v(0) = 0');
  assertClose(s0.acceleration, -4.0, 1e-9, 'a(0) = -4.0');
  assertClose(s0.restoringForce, -4.0, 1e-9, 'F(0) = -4.0');
  assertClose(s0.kineticEnergy, 0.0, 1e-9, 'K(0) = 0');
  assertClose(s0.potentialEnergy, 0.40, 1e-9, 'U(0) = E');
  assertClose(s0.totalEnergy, 0.40, 1e-9, 'Total energy at t=0');

  console.log('✔ Test 2 Passed: Kinematic milestones at t=0 (Peak displacement, zero velocity)');

  // Kinematics at quarter cycle t = T / 4:
  // x(T/4) = 0, v(T/4) = -vMax = -0.8944, a(T/4) = 0, K = 0.40, U = 0
  const quarterT = derived.period / 4;
  const sQuarter = computeSHMStateAtTime(params, quarterT);
  assertClose(sQuarter.displacement, 0.0, 1e-7, 'x(T/4) = 0');
  assertClose(sQuarter.velocity, -derived.vMax, 1e-7, 'v(T/4) = -vMax');
  assertClose(sQuarter.acceleration, 0.0, 1e-7, 'a(T/4) = 0');
  assertClose(sQuarter.restoringForce, 0.0, 1e-7, 'F(T/4) = 0');
  assertClose(sQuarter.kineticEnergy, 0.40, 1e-7, 'K(T/4) = E');
  assertClose(sQuarter.potentialEnergy, 0.0, 1e-7, 'U(T/4) = 0');

  console.log('✔ Test 3 Passed: Kinematic milestones at t=T/4 (Equilibrium crossing at maximum speed)');

  // Conservation of energy across 200 time steps:
  for (let i = 0; i <= 200; i++) {
    const t = (i / 200) * (derived.period * 3);
    const st = computeSHMStateAtTime(params, t);
    const sumE = st.kineticEnergy + st.potentialEnergy;
    assertClose(sumE, derived.totalEnergy, 1e-9, `Energy conservation at t=${t}`);
    // Check Hooke's Law: F = -kx
    assertClose(st.restoringForce, -20.0 * st.displacement, 1e-9, `F = -kx at t=${t}`);
    // Check a = -omega^2 x
    assertClose(st.acceleration, -20.0 * st.displacement, 1e-9, `a = -omega^2 x at t=${t}`);
  }

  console.log('✔ Test 4 Passed: Strict conservation of energy and Hooke\'s law across multiple periods');
}

// 2. Initial Condition Inversion: (x0, v0) <-> (A, phi)
{
  const omega = 4.472135955;
  const testCases = [
    { x0: 0.20, v0: 0.0 },
    { x0: 0.0, v0: 0.894427 },
    { x0: -0.15, v0: 0.40 },
    { x0: 0.10, v0: -0.60 },
  ];

  for (const tc of testCases) {
    const converted = convertInitialConditionsToAmplitudePhase(tc.x0, tc.v0, omega);
    const reconX = converted.amplitude * Math.cos(converted.phaseRad);
    const reconV = -converted.amplitude * omega * Math.sin(converted.phaseRad);
    assertClose(reconX, tc.x0, 1e-7, `Reconstructed x0 for (${tc.x0}, ${tc.v0})`);
    assertClose(reconV, tc.v0, 1e-7, `Reconstructed v0 for (${tc.x0}, ${tc.v0})`);
  }

  console.log('✔ Test 5 Passed: Bidirectional initial condition conversion (x0, v0) <-> (A, phi)');
}

// 3. Vertical Spring Static Extension
{
  const paramsVert: SHMParameters = {
    systemType: 'vertical-spring',
    inputMode: 'amplitude-phase',
    mass: 2.0,
    springConstant: 50.0,
    amplitude: 0.10,
    initialPhaseDeg: 0,
    initialDisplacement: 0.10,
    initialVelocity: 0,
    gravity: 9.80,
    pendulumLength: 1.0,
    pendulumInitialAngleDeg: 12,
  };

  const derivedVert = computeSHMDerivedValues(paramsVert);
  // deltaL = mg / k = 2.0 * 9.8 / 50.0 = 0.392 m
  assertClose(derivedVert.staticExtension, 0.392, 1e-9, 'Vertical spring static stretch deltaL');
  // omega = sqrt(50 / 2) = 5.0 rad/s
  assertClose(derivedVert.omega, 5.0, 1e-9, 'Vertical spring omega unchanged by gravity');
  // period = 2*pi / 5.0 = 1.256637 s
  assertClose(derivedVert.period, (2 * Math.PI) / 5.0, 1e-9, 'Vertical spring period unchanged by gravity');

  console.log('✔ Test 6 Passed: Vertical spring static extension and gravity invariance');
}

// 4. Simple Pendulum Small-Angle SHM
{
  const paramsPend: SHMParameters = {
    systemType: 'pendulum',
    inputMode: 'amplitude-phase',
    mass: 1.0,
    springConstant: 20.0,
    amplitude: 0.20,
    initialPhaseDeg: 0,
    initialDisplacement: 0.20,
    initialVelocity: 0,
    gravity: 9.80,
    pendulumLength: 0.994, // seconds pendulum
    pendulumInitialAngleDeg: 10,
  };

  const derivedPend = computeSHMDerivedValues(paramsPend);
  // omega = sqrt(g / L) = sqrt(9.80 / 0.994) = 3.140026 rad/s ~ pi
  // T = 2*pi / omega ~ 2.00 s
  assertClose(derivedPend.period, 2.00, 0.01, 'Seconds pendulum period ~ 2.00s');
  assert(derivedPend.isPendulumSmallAngleValid === true, '10 deg is within small angle approximation');

  console.log('✔ Test 7 Passed: Simple pendulum small-angle approximation & period');
}

// 5. Input Validation
{
  const valid = validateSHMParameters({
    systemType: 'horizontal-spring',
    inputMode: 'amplitude-phase',
    mass: 1.0,
    springConstant: 20.0,
    amplitude: 0.2,
    initialPhaseDeg: 0,
    initialDisplacement: 0.2,
    initialVelocity: 0,
    gravity: 9.8,
    pendulumLength: 1.0,
    pendulumInitialAngleDeg: 10,
  });
  assert(valid.isValid === true, 'Valid parameters accepted');

  const invalid = validateSHMParameters({
    systemType: 'horizontal-spring',
    inputMode: 'amplitude-phase',
    mass: -1.0, // negative mass
    springConstant: 0, // zero spring constant
    amplitude: -0.2, // negative amplitude
    initialPhaseDeg: 0,
    initialDisplacement: 0.2,
    initialVelocity: 0,
    gravity: 9.8,
    pendulumLength: 1.0,
    pendulumInitialAngleDeg: 10,
  });
  assert(invalid.isValid === false, 'Invalid parameters rejected');
  assert(invalid.errors.length === 3, 'All 3 invalid parameters flagged');

  console.log('✔ Test 8 Passed: Input bounds validation and error reporting');
}

console.log('\n=========================================');
console.log('ALL 8 SHM PHYSICS SUITES PASSED SUCCESSFULLY!');
console.log('=========================================');
