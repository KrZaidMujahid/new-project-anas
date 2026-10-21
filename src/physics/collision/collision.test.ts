/**
 * Automated Physical Verification & Unit Tests for Collision & Momentum Laboratory
 * Tests all 11 required scenarios:
 * 1. Equal-mass elastic collision
 * 2. Perfectly inelastic collision
 * 3. Momentum conservation
 * 4. Elastic energy conservation
 * 5. Inelastic energy loss
 * 6. Zero velocity
 * 7. Negative velocity & vector direction
 * 8. Impulse (J ≈ Δp)
 * 9. Mass scaling
 * 10. Coefficient of restitution
 * 11. Analytical vs numerical final velocities
 */

import {
  computeAnalyticalCollision,
  computeCollisionStateAtTime,
  runNumericalSimulation,
  runCollisionValidationTests,
} from './model.ts';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function assertClose(a: number, b: number, epsilon = 1e-5, message = '') {
  const diff = Math.abs(a - b);
  if (diff > epsilon) {
    throw new Error(`Values not close: ${a} vs ${b} (diff=${diff}, tol=${epsilon}) ${message}`);
  }
}

console.log('Running Collision & Momentum Laboratory Physics Tests...\n');

const suite = runCollisionValidationTests();
for (const test of suite) {
  assert(test.passed, `${test.title} FAILED: expected ${test.expected}, got ${test.actual}`);
  console.log(`✔ ${test.title} Passed!`);
}

// Additional continuous trajectory and conservation check
{
  const params = {
    collisionType: 'inelastic' as const,
    m1: 2.0,
    v1: 5.0,
    x1: 0,
    m2: 3.0,
    v2: -1.0,
    x2: 12.0,
    restitution: 0.6,
    collisionDuration: 0.06,
  };

  const analytical = computeAnalyticalCollision(params);
  assert(analytical.hasCollision, 'Collision must occur');
  assert(analytical.collisionTime !== null && analytical.collisionTime > 0, 'Collision time positive');

  // Verify total momentum conservation across 150 points in time
  const tMax = 6.0;
  for (let i = 0; i <= 150; i++) {
    const t = (i / 150) * tMax;
    const st = computeCollisionStateAtTime(params, t);
    assertClose(st.totalMomentum, analytical.P_total_before, 1e-5, `Momentum conserved at t=${t}`);

    // Objects cannot pass through each other
    if (params.x2 >= params.x1) {
      assert(st.object2.position - st.object1.position >= 0.99, `No interpenetration at t=${t}`);
    }
  }

  console.log('✔ Continuous time trajectory: Momentum conserved at every step, zero interpenetration!');
}

console.log('\n======================================================');
console.log('ALL 11 COLLISION & MOMENTUM PHYSICS TESTS PASSED OK!');
console.log('======================================================');
