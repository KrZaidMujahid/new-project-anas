/**
 * EQUATION 1 — Universal 2D Graph Sampling Engine Tests
 * Comprehensive automated verification covering:
 * - Basic standard functions (x, x^2, x^3, sin, exp)
 * - Domain-restricted functions (sqrt, log, ln)
 * - Singularities and segmentation (1/x across 0, multi-segment islands)
 * - Variable substitution (t, theta, parameters)
 * - Input validation & error rejection
 * - Evaluation budget enforcement
 * - Strict absence of NaN and Infinity in drawable points
 */

import { sampleFunction, SamplerValidationError } from '../../src/core/graph';
import { compileExpression } from '../../src/core/math';

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passedTests++;
}

function assertClose(actual: number, expected: number, epsilon = 1e-6, message = '') {
  totalTests++;
  const diff = Math.abs(actual - expected);
  if (diff > epsilon) {
    console.error(`❌ FAILED: ${message} (Expected ~${expected}, got ${actual}, diff=${diff})`);
    throw new Error(`Assertion failed: ${message} (Expected ${expected}, got ${actual})`);
  }
  passedTests++;
}

function assertThrowsValidation(fn: () => void, message: string) {
  totalTests++;
  try {
    fn();
    console.error(`❌ FAILED: Expected SamplerValidationError but no error thrown: ${message}`);
    throw new Error(`Expected validation error: ${message}`);
  } catch (err) {
    if (err instanceof SamplerValidationError) {
      passedTests++;
    } else {
      console.error(`❌ FAILED: Expected SamplerValidationError but got ${err}: ${message}`);
      throw err;
    }
  }
}

/** Verifies that every point in every segment has finite, non-NaN coordinates */
function verifyPointSanity(segments: { x: number; y: number }[][], testName: string) {
  for (let s = 0; s < segments.length; s++) {
    const seg = segments[s];
    for (let p = 0; p < seg.length; p++) {
      const pt = seg[p];
      assert(
        Number.isFinite(pt.x) && !Number.isNaN(pt.x),
        `${testName}: Segment ${s} point ${p} has invalid x: ${pt.x}`
      );
      assert(
        Number.isFinite(pt.y) && !Number.isNaN(pt.y),
        `${testName}: Segment ${s} point ${p} has invalid y: ${pt.y}`
      );
    }
  }
}

console.log('🧪 Starting 2D Graph Sampling Engine Test Suite...\n');

// 1. Basic Functions: y = x, y = x^2, y = x^3
console.log('Test Suite 1: Standard Polynomials (y = x, y = x^2, y = x^3)');
{
  // y = x on [-5, 5]
  const resX = sampleFunction('x', { xMin: -5, xMax: 5, sampleCount: 101 });
  assert(resX.segments.length === 1, 'y = x produces 1 continuous segment');
  assert(resX.validPointsCount === 101, 'y = x has 101 valid points');
  assert(resX.rejectedPointsCount === 0, 'y = x has 0 rejected points');
  assertClose(resX.segments[0][0].y, -5, 1e-9, 'y(-5) = -5');
  assertClose(resX.segments[0][100].y, 5, 1e-9, 'y(5) = 5');
  verifyPointSanity(resX.segments, 'y = x');

  // y = x^2 on [-3, 3]
  const resX2 = sampleFunction('x^2', { xMin: -3, xMax: 3, sampleCount: 61 });
  assert(resX2.segments.length === 1, 'y = x^2 produces 1 continuous segment');
  assertClose(resX2.segments[0][0].y, 9, 1e-9, 'y(-3) = 9');
  assertClose(resX2.segments[0][30].y, 0, 1e-9, 'y(0) = 0');
  assertClose(resX2.segments[0][60].y, 9, 1e-9, 'y(3) = 9');
  verifyPointSanity(resX2.segments, 'y = x^2');

  // y = x^3 on [-2, 2]
  const resX3 = sampleFunction('x^3', { xMin: -2, xMax: 2, sampleCount: 41 });
  assert(resX3.segments.length === 1, 'y = x^3 produces 1 continuous segment');
  assertClose(resX3.segments[0][0].y, -8, 1e-9, 'y(-2) = -8');
  assertClose(resX3.segments[0][40].y, 8, 1e-9, 'y(2) = 8');
  verifyPointSanity(resX3.segments, 'y = x^3');
}

// 2. Trigonometric & Exponential: y = sin(x), y = exp(x)
console.log('Test Suite 2: Smooth Functions (y = sin(x), y = exp(x))');
{
  // y = sin(x) on [0, 2*pi]
  const resSin = sampleFunction('sin(x)', { xMin: 0, xMax: 2 * Math.PI, sampleCount: 101 });
  assert(resSin.segments.length === 1, 'sin(x) produces 1 continuous segment');
  assertClose(resSin.segments[0][0].y, 0, 1e-6, 'sin(0) = 0');
  assertClose(resSin.segments[0][25].y, 1, 1e-4, 'sin(pi/2) ~ 1');
  assertClose(resSin.segments[0][50].y, 0, 1e-4, 'sin(pi) ~ 0');
  assertClose(resSin.segments[0][75].y, -1, 1e-4, 'sin(3pi/2) ~ -1');
  verifyPointSanity(resSin.segments, 'y = sin(x)');

  // y = exp(x) on [-2, 2]
  const resExp = sampleFunction('exp(x)', { xMin: -2, xMax: 2, sampleCount: 51 });
  assert(resExp.segments.length === 1, 'exp(x) produces 1 continuous segment');
  assertClose(resExp.segments[0][0].y, Math.exp(-2), 1e-9, 'exp(-2)');
  assertClose(resExp.segments[0][25].y, 1, 1e-9, 'exp(0) = 1');
  assertClose(resExp.segments[0][50].y, Math.exp(2), 1e-9, 'exp(2)');
  verifyPointSanity(resExp.segments, 'y = exp(x)');
}

// 3. Domain Boundaries: y = sqrt(x), y = log(x)
console.log('Test Suite 3: Domain-Restricted Functions (sqrt(x), log(x))');
{
  // y = sqrt(x) on [-4, 4] with sampleCount=81 (x=0 is sampled exactly)
  const resSqrt = sampleFunction('sqrt(x)', { xMin: -4, xMax: 4, sampleCount: 81 });
  assert(resSqrt.segments.length === 1, 'sqrt(x) produces 1 segment on the valid right branch');
  assert(resSqrt.rejectedPointsCount === 40, 'Negative half x < 0 rejected (40 points)');
  assert(resSqrt.validPointsCount === 41, 'Non-negative half x >= 0 preserved (41 points)');
  // Starting point must have x >= 0
  assert(resSqrt.segments[0][0].x >= 0, 'First point of sqrt(x) has x >= 0');
  assertClose(resSqrt.segments[0][0].y, 0, 1e-9, 'sqrt(0) = 0');
  assertClose(resSqrt.segments[0][40].y, 2, 1e-9, 'sqrt(4) = 2');
  assert(resSqrt.warnings.some((w) => w.includes('real domain')), 'Warning records real domain error');
  verifyPointSanity(resSqrt.segments, 'y = sqrt(x)');

  // y = log(x) on [-2, 10] with sampleCount=61 (x=0 is sampled exactly)
  const resLog = sampleFunction('log(x)', { xMin: -2, xMax: 10, sampleCount: 61 });
  assert(resLog.segments.length === 1, 'log(x) produces 1 segment on positive branch');
  assert(resLog.rejectedPointsCount > 0, 'log(x) rejects points where x <= 0');
  assert(resLog.segments[0][0].x > 0, 'First point has strictly positive x');
  verifyPointSanity(resLog.segments, 'y = log(x)');
}

// 4. Discontinuities and Multi-Branch Segmentation: y = 1/x
console.log('Test Suite 4: Discontinuities & Asymptote Segmentation (y = 1/x)');
{
  // y = 1/x on [-2, 2] with sampleCount=201 (x = 0 is hit exactly at index 100)
  const resInv = sampleFunction('1/x', { xMin: -2, xMax: 2, sampleCount: 201 });
  assert(resInv.segments.length === 2, 'y = 1/x splits into exactly 2 separate continuous segments');
  assert(resInv.rejectedPointsCount === 1, '1/x rejects the pole point x=0 (1/0 = Infinity)');

  const negBranch = resInv.segments[0];
  const posBranch = resInv.segments[1];

  // Negative branch verification
  assert(negBranch.every((p) => p.x < 0 && p.y < 0), 'Negative branch points all have x < 0 and y < 0');
  assertClose(negBranch[0].y, -0.5, 1e-9, '1/(-2) = -0.5');

  // Positive branch verification
  assert(posBranch.every((p) => p.x > 0 && p.y > 0), 'Positive branch points all have x > 0 and y > 0');
  assertClose(posBranch[posBranch.length - 1].y, 0.5, 1e-9, '1/(2) = 0.5');

  // Strict check: branches are NOT connected together
  assert(negBranch[negBranch.length - 1].x < 0, 'Last point of neg branch is negative');
  assert(posBranch[0].x > 0, 'First point of pos branch is positive');

  verifyPointSanity(resInv.segments, 'y = 1/x');
}

// 5. Multi-Segment Function: sqrt(abs(x) - 1) on [-3, 3]
console.log('Test Suite 5: Disjoint Domain Islands (sqrt(abs(x) - 1))');
{
  // Valid on x <= -1 and x >= 1; invalid on (-1, 1)
  const resIslands = sampleFunction('sqrt(abs(x) - 1)', { xMin: -3, xMax: 3, sampleCount: 61 });
  assert(resIslands.segments.length === 2, 'sqrt(abs(x) - 1) produces 2 distinct segments separated by invalid region');
  assert(resIslands.rejectedPointsCount > 0, 'Interior region (-1, 1) points rejected');

  // Segment 1 on [-3, -1]
  assert(resIslands.segments[0].every((p) => p.x <= -1), 'First island points all have x <= -1');
  // Segment 2 on [1, 3]
  assert(resIslands.segments[1].every((p) => p.x >= 1), 'Second island points all have x >= 1');

  verifyPointSanity(resIslands.segments, 'sqrt(abs(x) - 1)');
}

// 6. Pre-Compiled Expression & Variable Substitution (variable !== 'x')
console.log('Test Suite 6: Compiled Expressions & Custom Variable Names');
{
  const compiledT = compileExpression('t^2 + 1');
  const resT = sampleFunction(compiledT, {
    variable: 't',
    xMin: -2,
    xMax: 2,
    sampleCount: 51,
  });

  assert(resT.segments.length === 1, 'Custom variable t produces 1 segment');
  assertClose(resT.segments[0][0].y, 5, 1e-9, '(-2)^2 + 1 = 5');
  assertClose(resT.segments[0][25].y, 1, 1e-9, '0^2 + 1 = 1');
  assertClose(resT.segments[0][50].y, 5, 1e-9, '(2)^2 + 1 = 5');
  verifyPointSanity(resT.segments, 'variable t');

  // With auxiliary parameters: a*x + b
  const resParam = sampleFunction('a*x + b', {
    xMin: 0,
    xMax: 4,
    sampleCount: 5,
    parameters: { a: 3, b: 2 },
  });
  assertClose(resParam.segments[0][0].y, 2, 1e-9, '3(0) + 2 = 2');
  assertClose(resParam.segments[0][4].y, 14, 1e-9, '3(4) + 2 = 14');
  verifyPointSanity(resParam.segments, 'parameters a, b');
}

// 7. Input Validation & Error Handling
console.log('Test Suite 7: Input Validation & Boundary Errors');
{
  // xMin >= xMax
  assertThrowsValidation(
    () => sampleFunction('x', { xMin: 5, xMax: 2 }),
    'xMin >= xMax throws'
  );
  assertThrowsValidation(
    () => sampleFunction('x', { xMin: 3, xMax: 3 }),
    'xMin === xMax throws'
  );

  // Non-finite domain
  assertThrowsValidation(
    () => sampleFunction('x', { xMin: NaN, xMax: 5 }),
    'xMin=NaN throws'
  );
  assertThrowsValidation(
    () => sampleFunction('x', { xMin: 0, xMax: Infinity }),
    'xMax=Infinity throws'
  );

  // yMin >= yMax
  assertThrowsValidation(
    () => sampleFunction('x', { xMin: -1, xMax: 1, yMin: 5, yMax: 2 }),
    'yMin >= yMax throws'
  );

  // sampleCount < 2 or non-integer
  assertThrowsValidation(
    () => sampleFunction('x', { xMin: -1, xMax: 1, sampleCount: 1 }),
    'sampleCount=1 throws'
  );
  assertThrowsValidation(
    () => sampleFunction('x', { xMin: -1, xMax: 1, sampleCount: 2.5 }),
    'sampleCount=2.5 throws'
  );

  // maxEvaluations < sampleCount
  assertThrowsValidation(
    () => sampleFunction('x', { xMin: -1, xMax: 1, sampleCount: 100, maxEvaluations: 50 }),
    'maxEvaluations < sampleCount throws'
  );

  // Invalid variable name
  assertThrowsValidation(
    () => sampleFunction('x', { xMin: -1, xMax: 1, variable: '123bad' }),
    'Invalid variable name throws'
  );
}

// 8. Evaluation Budget Enforcement
console.log('Test Suite 8: Evaluation Budget Enforcement');
{
  const resBudget = sampleFunction('x^2', {
    xMin: 0,
    xMax: 10,
    sampleCount: 100,
    maxEvaluations: 100,
  });

  assert(resBudget.evaluationsCount === 100, 'Evaluated exactly to budget');
  assert(!resBudget.budgetExhausted, 'Budget was sufficient');
}

console.log(`\n=================================================`);
console.log(`🎉 ALL ${totalTests} GRAPH SAMPLER TEST ASSERTIONS PASSED! (${passedTests}/${totalTests})`);
console.log(`=================================================\n`);
