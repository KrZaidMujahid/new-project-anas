/**
 * Automated Physical Verification & Unit Tests for Circular Motion Laboratory
 * Verifies all 12 required test cases:
 * 1. v = rω
 * 2. a_c = rω²
 * 3. F_c = m a_c
 * 4. Zero angular velocity boundary
 * 5. Radius scaling
 * 6. Angular velocity quadratic scaling
 * 7. Mass invariance of acceleration
 * 8. Period T = 2π/ω
 * 9. Frequency f = 1/T
 * 10. Velocity perpendicular to radius vector (v · r = 0)
 * 11. Acceleration points toward center (a || -r)
 * 12. Analytical vs numerical comparison
 */

import {
  runCircularValidationTests,
  computeCircularDerivedValues,
  computeCircularStateAtTime,
} from './model.ts';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log('Running Circular Motion Laboratory Physics Tests...\n');

const suite = runCircularValidationTests();
for (const test of suite) {
  assert(test.passed, `${test.title} FAILED: expected ${test.expected}, got ${test.actual}`);
  console.log(`✔ ${test.title} Passed!`);
}

// Additional sanity check on continuous kinetic energy conservation
{
  const params = {
    mass: 2.0,
    radius: 4.0,
    angularVelocity: 3.0,
    initialAngleDeg: 15,
  };

  const initialDerived = computeCircularDerivedValues(params);
  // Over 100 time points, speed and kinetic energy must be strictly constant
  for (let i = 0; i <= 100; i++) {
    const t = (i / 100) * 10;
    const st = computeCircularStateAtTime(params, t);
    const speedDiff = Math.abs(st.speed - initialDerived.speed);
    const energyDiff = Math.abs(st.kineticEnergy - initialDerived.kineticEnergy);
    assert(speedDiff < 1e-6, `Speed must be constant at t=${t}`);
    assert(energyDiff < 1e-6, `Kinetic energy must be constant at t=${t}`);
  }

  console.log('✔ Continuous orbital trajectory: Speed and Kinetic Energy strictly invariant across all t!');
}

console.log('\n======================================================');
console.log('ALL 12 CIRCULAR MOTION PHYSICS TESTS PASSED WITH 100% ACCURACY!');
console.log('======================================================');
