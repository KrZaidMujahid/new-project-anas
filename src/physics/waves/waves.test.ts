/**
 * Automated Physical Verification & Unit Tests for Wave Superposition & Interference
 * Verifies all 12 mandatory scientific tests required by Section 18.
 */

import {
  calculateWaveNumber,
  calculateAngularFrequency,
  calculatePeriod,
  calculateWaveSpeed,
  calculateSinusoidalDisplacement,
  calculateSuperposition,
  calculateResultantAmplitude,
  calculateDistance,
  calculatePathDifference,
  calculateEffectivePhaseDifference,
  classifyInterference,
  analyzeTwoSourcePoint,
} from './model.ts';
import { TwoSourceParameters } from './types.ts';

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

console.log('Running Wave Interference Physics Unit Tests...\n');

// TEST 1: The sum of two zero-displacement waves is zero.
{
  const y1 = 0;
  const y2 = 0;
  const yResult = calculateSuperposition(y1, y2);
  assert(yResult === 0, 'Zero displacement superposition must be 0');
  console.log('✔ TEST 1 Passed: The sum of two zero-displacement waves is zero.');
}

// TEST 2: Two equal, in-phase waves with amplitude A produce a resultant amplitude of 2A.
{
  const A = 1.25;
  const deltaPhiInPhase = 0; // 0 radians
  const A_result = calculateResultantAmplitude(A, A, deltaPhiInPhase);
  assertClose(A_result, 2 * A, 1e-12, 'In-phase waves produce 2A');
  console.log('✔ TEST 2 Passed: Two equal, in-phase waves with amplitude A produce a resultant amplitude of 2A.');
}

// TEST 3: Two equal-amplitude waves that are exactly out of phase cancel at every matching point in the equal-frequency, equal-wavelength model.
{
  const A = 1.5;
  const lambda = 2.0;
  const f = 1.0;
  const k = calculateWaveNumber(lambda);
  const omega = calculateAngularFrequency(f);
  const phi1 = 0;
  const phi2 = Math.PI; // exactly 180° out of phase

  // Verify resultant amplitude is 0
  const A_res = calculateResultantAmplitude(A, A, Math.PI);
  assertClose(A_res, 0.0, 1e-12, 'Resultant amplitude must be 0 for exact destructive interference');

  // Check across 50 spatial positions and 10 timestamps
  for (let x = 0; x <= 10; x += 0.5) {
    for (let t = 0; t <= 2; t += 0.2) {
      const y1 = calculateSinusoidalDisplacement(A, k, omega, phi1, x, t, 'forward');
      const y2 = calculateSinusoidalDisplacement(A, k, omega, phi2, x, t, 'forward');
      const yR = calculateSuperposition(y1, y2);
      assertClose(yR, 0.0, 1e-12, `Destructive cancellation at x=${x}, t=${t}`);
    }
  }
  console.log('✔ TEST 3 Passed: Two equal-amplitude out-of-phase waves cancel at every matching point.');
}

// TEST 4: Two waves with unequal amplitudes and opposite phase do not cancel completely.
{
  const A1 = 2.0;
  const A2 = 0.8;
  const deltaPhi = Math.PI;
  const A_res = calculateResultantAmplitude(A1, A2, deltaPhi);
  assertClose(A_res, A1 - A2, 1e-12, 'Unequal amplitudes destructive interference leaves residual amplitude |A1 - A2|');
  assert(A_res > 0, 'Residual amplitude must be strictly positive');
  console.log('✔ TEST 4 Passed: Two waves with unequal amplitudes and opposite phase do not cancel completely.');
}

// TEST 5: The calculated wave number satisfies k = 2π/λ.
{
  const lambda = 4.0;
  const k = calculateWaveNumber(lambda);
  assertClose(k, (2 * Math.PI) / 4.0, 1e-12, 'k = 2π / λ');
  console.log('✔ TEST 5 Passed: Calculated wave number satisfies k = 2π/λ.');
}

// TEST 6: The calculated angular frequency satisfies ω = 2πf.
{
  const f = 2.5;
  const omega = calculateAngularFrequency(f);
  assertClose(omega, 2 * Math.PI * 2.5, 1e-12, 'ω = 2πf');
  console.log('✔ TEST 6 Passed: Calculated angular frequency satisfies ω = 2πf.');
}

// TEST 7: The calculated period satisfies T = 1/f for positive frequency.
{
  const f = 4.0;
  const T = calculatePeriod(f);
  assertClose(T, 0.25, 1e-12, 'T = 1/f');
  console.log('✔ TEST 7 Passed: Calculated period satisfies T = 1/f for positive frequency.');
}

// TEST 8: The calculated path difference agrees with the source-to-point distances.
{
  const s1X = 0, s1Y = 1.5;
  const s2X = 0, s2Y = -1.5;
  const pX = 4.0, pY = 1.5; // P is directly horizontally in line with S1

  const r1 = calculateDistance(s1X, s1Y, pX, pY); // 4.0 m
  const r2 = calculateDistance(s2X, s2Y, pX, pY); // sqrt(4^2 + 3^2) = 5.0 m
  const deltaR = calculatePathDifference(r1, r2);

  assertClose(r1, 4.0, 1e-12, 'r1 calculation');
  assertClose(r2, 5.0, 1e-12, 'r2 calculation');
  assertClose(deltaR, 1.0, 1e-12, 'Path difference Δr = r2 - r1 = 1.0 m');
  console.log('✔ TEST 8 Passed: Path difference agrees with source-to-point distances.');
}

// TEST 9: Constructive and destructive interference conditions are correctly identified within a documented numerical tolerance.
{
  // ΔΦ = 0 (Constructive)
  const c1 = classifyInterference(0, 0.2);
  assert(c1.classification === 'constructive', 'ΔΦ=0 is constructive');

  // ΔΦ = 2π (Constructive order 1)
  const c2 = classifyInterference(2 * Math.PI, 0.2);
  assert(c2.classification === 'constructive', 'ΔΦ=2π is constructive');

  // ΔΦ = π (Destructive)
  const d1 = classifyInterference(Math.PI, 0.2);
  assert(d1.classification === 'destructive', 'ΔΦ=π is destructive');

  // ΔΦ = 3π (Destructive order 1)
  const d2 = classifyInterference(3 * Math.PI, 0.2);
  assert(d2.classification === 'destructive', 'ΔΦ=3π is destructive');

  // ΔΦ = π / 2 (Partial)
  const p1 = classifyInterference(Math.PI / 2, 0.2);
  assert(p1.classification === 'partial', 'ΔΦ=π/2 is partial');

  console.log('✔ TEST 9 Passed: Constructive and destructive conditions correctly identified within tolerance.');
}

// TEST 10: The effective phase difference changes correctly when the source phase difference or path difference changes.
{
  const lambda = 2.0;
  const k = (2 * Math.PI) / lambda; // π rad/m

  // Case A: in-phase sources, path difference = 0.5 m -> ΔΦ = k * 0.5 = 0.5π
  const phaseA = calculateEffectivePhaseDifference(k, 0.5, 0);
  assertClose(phaseA, 0.5 * Math.PI, 1e-12, 'Effective phase for Δr=0.5m');

  // Case B: source 2 has initial phase shift +π/2 -> ΔΦ = 0.5π + 0.5π = π (destructive!)
  const phaseB = calculateEffectivePhaseDifference(k, 0.5, 0.5 * Math.PI);
  assertClose(phaseB, Math.PI, 1e-12, 'Effective phase with source phase shift');

  console.log('✔ TEST 10 Passed: Effective phase difference changes correctly with path and source phase.');
}

// TEST 11: Zero amplitudes and boundary values do not produce NaN or Infinity unexpectedly.
{
  const kZero = calculateWaveNumber(0);
  assert(Number.isFinite(kZero) && !Number.isNaN(kZero), 'k with λ=0 is finite');

  const fZero = calculateAngularFrequency(0);
  assert(Number.isFinite(fZero) && !Number.isNaN(fZero), 'ω with f=0 is finite');

  const tZero = calculatePeriod(0);
  assert(Number.isFinite(tZero) && !Number.isNaN(tZero), 'T with f=0 is finite (0)');

  const aZero = calculateResultantAmplitude(0, 0, 1.23);
  assert(aZero === 0 && !Number.isNaN(aZero), 'A_R with zero amplitudes is 0');

  const pZero = calculateDistance(0, 0, 0, 0);
  assert(pZero === 0 && !Number.isNaN(pZero), 'Distance 0 is valid');

  console.log('✔ TEST 11 Passed: Zero amplitudes and boundary values do not produce NaN or Infinity.');
}

// TEST 12: The equal-amplitude resultant-amplitude formula agrees with direct wave superposition under its assumptions.
{
  const A = 1.4;
  const lambda = 3.0;
  const f = 2.0;
  const k = calculateWaveNumber(lambda);
  const omega = calculateAngularFrequency(f);

  // Test across multiple relative phase differences: Δφ = 0, 45°, 90°, 120°, 180°
  const testPhases = [0, Math.PI / 4, Math.PI / 2, (2 * Math.PI) / 3, Math.PI];

  for (const deltaPhi of testPhases) {
    const theoreticalMax = calculateResultantAmplitude(A, A, deltaPhi);

    // Now find the maximum over one complete cycle (0 to T) from direct superposition
    const period = 1 / f;
    let empiricalMax = 0;
    const steps = 100;
    for (let i = 0; i < steps; i++) {
      const t = (i / steps) * period;
      const y1 = calculateSinusoidalDisplacement(A, k, omega, 0, 0, t, 'forward');
      const y2 = calculateSinusoidalDisplacement(A, k, omega, deltaPhi, 0, t, 'forward');
      const yR = Math.abs(calculateSuperposition(y1, y2));
      if (yR > empiricalMax) empiricalMax = yR;
    }

    assertClose(
      theoreticalMax,
      empiricalMax,
      0.005,
      `Theoretical A_R (${theoreticalMax}) vs direct peak superposition (${empiricalMax}) for Δφ=${deltaPhi}`
    );
  }

  console.log('✔ TEST 12 Passed: Equal-amplitude analytical formula strictly agrees with peak superposition.');
}

console.log('\n======================================================');
console.log('ALL 12 WAVE INTERFERENCE PHYSICS TESTS PASSED WITH 100% ACCURACY!');
console.log('======================================================');
