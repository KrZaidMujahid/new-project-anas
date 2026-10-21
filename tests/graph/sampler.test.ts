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

import { sampleFunction, SamplerValidationError, detectDiscontinuity } from '../../src/core/graph';
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

// 9. Adaptive Sampling Fundamentals
console.log('Test Suite 9: Adaptive Sampling Fundamentals');
{
  // Linear function y = 2*x + 1: Midpoint deviation is 0 everywhere, so no extra subdivision
  const resLinear = sampleFunction('2*x + 1', {
    xMin: 0,
    xMax: 10,
    sampleCount: 3,
    adaptive: { enabled: true, tolerance: 0.01 },
  });
  assert(resLinear.segments.length === 1, 'Linear function produces 1 continuous segment');
  assert(resLinear.validPointsCount === 3, 'Linear function requires no extra subdivision (validPoints=3)');
  verifyPointSanity(resLinear.segments, 'adaptive y = 2*x + 1');

  // Parabola y = x^2: Requires adaptive subdivision where curved
  const resParabola = sampleFunction('x^2', {
    xMin: -2,
    xMax: 2,
    sampleCount: 5,
    adaptive: { enabled: true, tolerance: 0.01, maxDepth: 4 },
  });
  assert(resParabola.segments.length === 1, 'y = x^2 produces 1 continuous segment');
  assert(resParabola.validPointsCount > 5, 'y = x^2 subdivides curved intervals (points > 5)');
  
  // Verify strict monotonic ordering of x coordinates
  const pts = resParabola.segments[0];
  for (let i = 0; i < pts.length - 1; i++) {
    assert(pts[i].x < pts[i + 1].x, `Points must be strictly ordered by x: ${pts[i].x} < ${pts[i + 1].x}`);
  }
  verifyPointSanity(resParabola.segments, 'adaptive y = x^2');

  // Tolerance sensitivity test: tighter tolerance produces more points
  const resCoarse = sampleFunction('sin(x)', {
    xMin: 0,
    xMax: Math.PI,
    sampleCount: 3,
    adaptive: { enabled: true, tolerance: 0.1 },
  });
  const resFine = sampleFunction('sin(x)', {
    xMin: 0,
    xMax: Math.PI,
    sampleCount: 3,
    adaptive: { enabled: true, tolerance: 0.005 },
  });
  assert(resFine.validPointsCount > resCoarse.validPointsCount, 'Tighter tolerance produces more points');
}

// 10. Screen-Space Adaptive Sampling
console.log('Test Suite 10: Screen-Space Perpendicular Deviation');
{
  const resScreen = sampleFunction('sin(x)', {
    xMin: 0,
    xMax: 2 * Math.PI,
    yMin: -1.5,
    yMax: 1.5,
    viewport: { width: 800, height: 600 },
    sampleCount: 10,
    adaptive: { enabled: true, tolerance: 0.5, maxDepth: 5 },
  });

  assert(resScreen.segments.length === 1, 'Screen-space adaptive sin(x) produces 1 segment');
  assert(resScreen.validPointsCount > 10, 'Screen-space adaptive sampling refines curve in pixels');
  verifyPointSanity(resScreen.segments, 'screen-space sin(x)');
}

// 11. Discontinuity & Vertical Asymptote Detection
console.log('Test Suite 11: Discontinuity & Vertical Asymptote Detection (1/x, tan(x), 1/(x^2-1))');
{
  // y = 1/x with even sampleCount=200 (x=0 is NOT an exact sample point)
  const resInvEven = sampleFunction('1/x', {
    xMin: -2,
    xMax: 2,
    sampleCount: 200,
    yMin: -10,
    yMax: 10,
  });
  assert(resInvEven.segments.length === 2, 'y = 1/x with even sampleCount splits into 2 segments across 0');
  const negSeg = resInvEven.segments[0];
  const posSeg = resInvEven.segments[1];
  assert(negSeg.every((p) => p.x < 0 && p.y < 0), 'Negative branch points are strictly negative');
  assert(posSeg.every((p) => p.x > 0 && p.y > 0), 'Positive branch points are strictly positive');
  assert(negSeg[negSeg.length - 1].x < posSeg[0].x, 'Segments do not overlap or connect');
  verifyPointSanity(resInvEven.segments, 'uniform 1/x even sampleCount');

  // y = 1/x with adaptive sampling enabled
  const resInvAdaptive = sampleFunction('1/x', {
    xMin: -2,
    xMax: 2,
    sampleCount: 20,
    yMin: -20,
    yMax: 20,
    adaptive: { enabled: true, maxDepth: 5, tolerance: 0.05 },
  });
  assert(resInvAdaptive.segments.length === 2, 'Adaptive 1/x splits cleanly into 2 segments across 0');
  verifyPointSanity(resInvAdaptive.segments, 'adaptive 1/x');

  // y = tan(x) on [0, pi] (asymptote at pi/2 ~ 1.5707963)
  const resTan = sampleFunction('tan(x)', {
    xMin: 0,
    xMax: Math.PI,
    yMin: -20,
    yMax: 20,
    sampleCount: 50,
    adaptive: { enabled: true, maxDepth: 5, tolerance: 0.1 },
  });
  assert(resTan.segments.length === 2, 'tan(x) on [0, pi] splits into exactly 2 segments across pi/2');
  const tanLeft = resTan.segments[0];
  const tanRight = resTan.segments[1];
  assert(tanLeft.every((p) => p.x < Math.PI / 2), 'Left tan branch strictly before pi/2');
  assert(tanRight.every((p) => p.x > Math.PI / 2), 'Right tan branch strictly after pi/2');
  // Left branch ends climbing towards positive values, right branch starts from negative values
  assert(tanLeft[tanLeft.length - 1].y > 0, 'tan left branch ends with positive y');
  assert(tanRight[0].y < 0, 'tan right branch starts with negative y');
  verifyPointSanity(resTan.segments, 'tan(x)');

  // y = 1/(x^2 - 1) on [-2, 2] (singularities at x = -1 and x = 1)
  const resPoles = sampleFunction('1/(x^2 - 1)', {
    xMin: -2,
    xMax: 2,
    yMin: -15,
    yMax: 15,
    sampleCount: 60,
    adaptive: { enabled: true, maxDepth: 5 },
  });
  assert(resPoles.segments.length === 3, '1/(x^2 - 1) splits into 3 distinct continuous segments');
  assert(resPoles.segments[0].every((p) => p.x < -1), 'Branch 1 strictly x < -1');
  assert(resPoles.segments[1].every((p) => p.x > -1 && p.x < 1), 'Branch 2 strictly -1 < x < 1');
  assert(resPoles.segments[2].every((p) => p.x > 1), 'Branch 3 strictly x > 1');
  verifyPointSanity(resPoles.segments, '1/(x^2 - 1)');

  // y = log(x) on [-2, 5]
  const resLog = sampleFunction('log(x)', {
    xMin: -2,
    xMax: 5,
    sampleCount: 30,
    adaptive: { enabled: true },
  });
  assert(resLog.segments.length === 1, 'log(x) produces 1 segment on the valid right branch');
  assert(resLog.segments[0].every((p) => p.x > 0), 'All points of log(x) have x > 0');
  verifyPointSanity(resLog.segments, 'adaptive log(x)');
}

// 12. Steep Continuous Functions (No False Positives)
console.log('Test Suite 12: Steep Continuous Functions (Zero False Positives)');
{
  // Very steep linear function y = 1000*x: Should NOT be treated as a discontinuity!
  const resSteepLinear = sampleFunction('1000*x', {
    xMin: -2,
    xMax: 2,
    sampleCount: 40,
    yMin: -2000,
    yMax: 2000,
  });
  assert(resSteepLinear.segments.length === 1, 'y = 1000*x must NOT be falsely split into multiple segments');
  assertClose(resSteepLinear.segments[0][0].y, -2000, 1e-6, 'y(-2) = -2000');
  assertClose(resSteepLinear.segments[0][resSteepLinear.segments[0].length - 1].y, 2000, 1e-6, 'y(2) = 2000');
  verifyPointSanity(resSteepLinear.segments, 'y = 1000*x');

  // High-order polynomial y = x^5 on [-3, 3]
  const resX5 = sampleFunction('x^5', {
    xMin: -3,
    xMax: 3,
    sampleCount: 30,
    adaptive: { enabled: true },
  });
  assert(resX5.segments.length === 1, 'y = x^5 remains 1 continuous segment');
  verifyPointSanity(resX5.segments, 'y = x^5');
}

// 13. Direct detectDiscontinuity API Unit Tests
console.log('Test Suite 13: Direct detectDiscontinuity API Tests');
{
  const compiledInv = compileExpression('1/x');
  const evalInv = (xVal: number) => compiledInv.evaluate({ x: xVal });

  // 1/x across x=0
  const discInv = detectDiscontinuity(
    { x: -0.01, y: -100 },
    { x: 0.01, y: 100 },
    evalInv,
    { xMin: -2, xMax: 2, yMin: -20, yMax: 20 }
  );
  assert(discInv.isDiscontinuous, 'detectDiscontinuity identifies asymptote on 1/x across 0');

  // tan(x) across pi/2
  const compiledTan = compileExpression('tan(x)');
  const discTan = detectDiscontinuity(
    { x: 1.55, y: 48.08 },
    { x: 1.59, y: -52.07 },
    (xVal) => compiledTan.evaluate({ x: xVal }),
    { xMin: 0, xMax: Math.PI, yMin: -20, yMax: 20 }
  );
  assert(discTan.isDiscontinuous, 'detectDiscontinuity identifies asymptote on tan(x) across pi/2');

  // Smooth line y = 1000*x across 0
  const compiledSteep = compileExpression('1000*x');
  const discSteep = detectDiscontinuity(
    { x: -0.01, y: -10 },
    { x: 0.01, y: 10 },
    (xVal) => compiledSteep.evaluate({ x: xVal }),
    { xMin: -1, xMax: 1, yMin: -1000, yMax: 1000 }
  );
  assert(!discSteep.isDiscontinuous, 'detectDiscontinuity correctly returns false for steep continuous line');
}

// 14. Resource Limits & Stopping Conditions
console.log('Test Suite 14: Resource Limits (maxDepth, maxPoints, minIntervalWidth, maxEvaluations)');
{
  // maxDepth: 1
  const resDepth = sampleFunction('x^3', {
    xMin: -2,
    xMax: 2,
    sampleCount: 3,
    adaptive: { enabled: true, maxDepth: 1, tolerance: 1e-6 },
  });
  // 3 initial points -> 2 intervals -> each subdivided at most once -> at most 2 midpoints -> <= 5 points
  assert(resDepth.validPointsCount <= 5, 'maxDepth=1 strictly limits subdivision depth');

  // maxPoints limit
  const resMaxPts = sampleFunction('sin(10*x)', {
    xMin: 0,
    xMax: 10,
    sampleCount: 5,
    adaptive: { enabled: true, maxPoints: 25, tolerance: 1e-5 },
  });
  assert(resMaxPts.validPointsCount <= 25, 'maxPoints strictly limits total points generated');

  // maxEvaluations budget
  const resBudgetAdaptive = sampleFunction('sin(20*x)', {
    xMin: 0,
    xMax: 10,
    sampleCount: 10,
    maxEvaluations: 30,
    adaptive: { enabled: true, tolerance: 1e-6 },
  });
  assert(resBudgetAdaptive.budgetExhausted, 'Budget exhaustion is correctly flagged');
  assert(resBudgetAdaptive.evaluationsCount <= 30, 'evaluationsCount strictly respects maxEvaluations');
  assert(resBudgetAdaptive.warnings.some((w) => w.includes('exhausted')), 'Warning records budget exhaustion');
}

// 15. Input Validation for Adaptive Options
console.log('Test Suite 15: Input Validation for Adaptive Settings');
{
  // Negative maxDepth
  assertThrowsValidation(
    () => sampleFunction('x', { xMin: 0, xMax: 1, adaptive: { maxDepth: -1 } }),
    'Negative maxDepth throws'
  );

  // Non-positive tolerance
  assertThrowsValidation(
    () => sampleFunction('x', { xMin: 0, xMax: 1, adaptive: { tolerance: 0 } }),
    'Zero tolerance throws'
  );
  assertThrowsValidation(
    () => sampleFunction('x', { xMin: 0, xMax: 1, adaptive: { tolerance: -0.5 } }),
    'Negative tolerance throws'
  );

  // Non-positive minIntervalWidth
  assertThrowsValidation(
    () => sampleFunction('x', { xMin: 0, xMax: 1, adaptive: { minIntervalWidth: -1e-5 } }),
    'Negative minIntervalWidth throws'
  );

  // Invalid maxPoints (< 2)
  assertThrowsValidation(
    () => sampleFunction('x', { xMin: 0, xMax: 1, adaptive: { maxPoints: 1 } }),
    'maxPoints < 2 throws'
  );

  // Invalid viewport dimensions
  assertThrowsValidation(
    () => sampleFunction('x', { xMin: 0, xMax: 1, viewport: { width: -100, height: 600 } }),
    'Negative viewport width throws'
  );
  assertThrowsValidation(
    () => sampleFunction('x', { xMin: 0, xMax: 1, viewport: { width: 800, height: 0 } }),
    'Zero viewport height throws'
  );
}

console.log(`\n=================================================`);
console.log(`🎉 ALL ${totalTests} GRAPH SAMPLER TEST ASSERTIONS PASSED! (${passedTests}/${totalTests})`);
console.log(`=================================================\n`);
