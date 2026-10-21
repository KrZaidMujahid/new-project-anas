/**
 * EQUATION 1 — Core Mathematical Expression Engine Unit Tests
 * Comprehensive automated verification covering all test groups:
 * - Group A: Operator Precedence & Associativity
 * - Group B: Division, Non-finite, and Domain Boundaries
 * - Group C: Conventional Implicit Multiplication
 * - Group D: Compile-Once API & Contract Integrity
 */

import {
  compileExpression,
  evaluateExpression,
  MathSyntaxError,
} from '../../src/core/math';

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

function assertClose(actual: number, expected: number, epsilon = 1e-9, message = '') {
  totalTests++;
  const diff = Math.abs(actual - expected);
  if (diff > epsilon) {
    console.error(`❌ FAILED: ${message} (Expected ~${expected}, got ${actual}, diff=${diff})`);
    throw new Error(`Assertion failed: ${message} (Expected ${expected}, got ${actual})`);
  }
  passedTests++;
}

function assertThrowsSyntax(fn: () => void, message: string) {
  totalTests++;
  try {
    fn();
    console.error(`❌ FAILED: Expected MathSyntaxError but no error thrown: ${message}`);
    throw new Error(`Expected syntax error: ${message}`);
  } catch (err) {
    if (err instanceof MathSyntaxError) {
      passedTests++;
    } else {
      console.error(`❌ FAILED: Expected MathSyntaxError but got ${err}: ${message}`);
      throw err;
    }
  }
}

console.log('🧪 Starting Mathematical Expression Engine Comprehensive Test Suite...\n');

// ========================================
// TEST GROUP A: OPERATOR PRECEDENCE
// ========================================
console.log('--- TEST GROUP A: OPERATOR PRECEDENCE ---');
{
  // 1. -2^2 -> -4
  assertClose(evaluateExpression('-2^2').value, -4, 1e-9, 'A1: -2^2 = -4 (power binds tighter than unary minus)');

  // 2. (-2)^2 -> 4
  assertClose(evaluateExpression('(-2)^2').value, 4, 1e-9, 'A2: (-2)^2 = 4');

  // 3. 2^3^2 -> 512 (right-associative: 2^(3^2) = 2^9 = 512)
  assertClose(evaluateExpression('2^3^2').value, 512, 1e-9, 'A3: 2^3^2 = 512 (right-associative exponentiation)');

  // 4. -2^3 -> -8
  assertClose(evaluateExpression('-2^3').value, -8, 1e-9, 'A4: -2^3 = -8');

  // 5. (-2)^3 -> -8
  assertClose(evaluateExpression('(-2)^3').value, -8, 1e-9, 'A5: (-2)^3 = -8');

  // 6. 2^-2 -> 0.25
  assertClose(evaluateExpression('2^-2').value, 0.25, 1e-9, 'A6: 2^-2 = 0.25');

  // 7. 2*(-3) -> -6
  assertClose(evaluateExpression('2*(-3)').value, -6, 1e-9, 'A7: 2*(-3) = -6');

  // 8. -(2+3) -> -5
  assertClose(evaluateExpression('-(2+3)').value, -5, 1e-9, 'A8: -(2+3) = -5');
}

// ========================================
// TEST GROUP B: DIVISION AND DOMAIN ERRORS
// ========================================
console.log('--- TEST GROUP B: DIVISION AND DOMAIN ERRORS ---');
{
  // 1. 1/0 -> non-finite, positive infinity, domainError
  const resB1 = evaluateExpression('1/0');
  assert(resB1.value === Infinity, 'B1: 1/0 value is Infinity');
  assert(!resB1.isFinite, 'B1: 1/0 isFinite is false');
  assert(resB1.isReal, 'B1: 1/0 isReal is true (real infinity)');
  assert(resB1.domainError !== undefined, 'B1: 1/0 records domainError');

  // 2. 0/0 -> non-finite, NaN, domainError
  const resB2 = evaluateExpression('0/0');
  assert(Number.isNaN(resB2.value), 'B2: 0/0 value is NaN');
  assert(!resB2.isFinite, 'B2: 0/0 isFinite is false');
  assert(!resB2.isReal, 'B2: 0/0 isReal is false');
  assert(resB2.domainError !== undefined, 'B2: 0/0 records domainError');

  // 3. 1/x when x = 0
  const expr1overX = compileExpression('1/x');
  const resB3 = expr1overX.evaluate({ x: 0 });
  assert(resB3.value === Infinity, 'B3: 1/x at x=0 value is Infinity');
  assert(!resB3.isFinite, 'B3: 1/x at x=0 isFinite is false');
  assert(resB3.domainError !== undefined, 'B3: 1/x at x=0 records domainError');

  // 4. 1/x when x = 2
  const resB4 = expr1overX.evaluate({ x: 2 });
  assertClose(resB4.value, 0.5, 1e-9, 'B4: 1/x at x=2 is 0.5');
  assert(resB4.isFinite, 'B4: 1/x at x=2 isFinite is true');
  assert(resB4.isReal, 'B4: 1/x at x=2 isReal is true');
  assert(resB4.domainError === undefined, 'B4: 1/x at x=2 has no domainError');

  // 5. sqrt(-1) -> non-real, NaN
  const resB5 = evaluateExpression('sqrt(-1)');
  assert(Number.isNaN(resB5.value), 'B5: sqrt(-1) value is NaN');
  assert(!resB5.isFinite, 'B5: sqrt(-1) isFinite is false');
  assert(!resB5.isReal, 'B5: sqrt(-1) isReal is false');
  assert(resB5.domainError !== undefined, 'B5: sqrt(-1) records domainError');

  // 6. sqrt(4) -> 2
  const resB6 = evaluateExpression('sqrt(4)');
  assertClose(resB6.value, 2, 1e-9, 'B6: sqrt(4) = 2');
  assert(resB6.isFinite, 'B6: sqrt(4) isFinite is true');
  assert(resB6.isReal, 'B6: sqrt(4) isReal is true');

  // 7. ln(0) -> -Infinity
  const resB7 = evaluateExpression('ln(0)');
  assert(resB7.value === -Infinity, 'B7: ln(0) value is -Infinity');
  assert(!resB7.isFinite, 'B7: ln(0) isFinite is false');
  assert(resB7.domainError !== undefined, 'B7: ln(0) records domainError');

  // 8. ln(-1) -> non-real, NaN
  const resB8 = evaluateExpression('ln(-1)');
  assert(Number.isNaN(resB8.value), 'B8: ln(-1) value is NaN');
  assert(!resB8.isReal, 'B8: ln(-1) isReal is false');
  assert(resB8.domainError !== undefined, 'B8: ln(-1) records domainError');

  // 9. ln(1) -> 0
  const resB9 = evaluateExpression('ln(1)');
  assertClose(resB9.value, 0, 1e-9, 'B9: ln(1) = 0');
  assert(resB9.isFinite, 'B9: ln(1) isFinite is true');
  assert(resB9.isReal, 'B9: ln(1) isReal is true');

  // 10. log(100) -> 2 (common logarithm, base 10)
  const resB10 = evaluateExpression('log(100)');
  assertClose(resB10.value, 2, 1e-9, 'B10: log(100) = 2 (common base 10)');
  assert(resB10.isFinite, 'B10: log(100) isFinite is true');
  // Also verify ln(e) = 1
  assertClose(evaluateExpression('ln(e)').value, 1, 1e-9, 'B10b: ln(e) = 1 (natural logarithm)');
  // Also verify log with optional base log(8, 2) = 3
  assertClose(evaluateExpression('log(8, 2)').value, 3, 1e-9, 'B10c: log(8, 2) = 3');

  // 11. tan(pi/2) -> non-finite singularity
  const resB11 = evaluateExpression('tan(pi/2)');
  assert(resB11.value === Infinity, 'B11: tan(pi/2) value is Infinity (singularity detected)');
  assert(!resB11.isFinite, 'B11: tan(pi/2) isFinite is false');
  assert(resB11.domainError !== undefined, 'B11: tan(pi/2) records domainError');

  // 12. sqrt(x) for x = -1
  const exprSqrtX = compileExpression('sqrt(x)');
  const resB12 = exprSqrtX.evaluate({ x: -1 });
  assert(Number.isNaN(resB12.value), 'B12: sqrt(x) at x=-1 is NaN');
  assert(!resB12.isReal, 'B12: sqrt(x) at x=-1 isReal is false');
  assert(resB12.domainError !== undefined, 'B12: sqrt(x) at x=-1 records domainError');

  // 13. sqrt(x) for x = 9
  const resB13 = exprSqrtX.evaluate({ x: 9 });
  assertClose(resB13.value, 3, 1e-9, 'B13: sqrt(x) at x=9 is 3');
  assert(resB13.isFinite, 'B13: sqrt(x) at x=9 isFinite is true');
}

// ========================================
// TEST GROUP C: IMPLICIT MULTIPLICATION
// ========================================
console.log('--- TEST GROUP C: IMPLICIT MULTIPLICATION ---');
{
  // 1. 2x, with x = 3 -> 6
  assertClose(compileExpression('2x').evaluate({ x: 3 }).value, 6, 1e-9, 'C1: 2x at x=3 is 6');

  // 2. 2(x+1), with x = 3 -> 8
  assertClose(compileExpression('2(x+1)').evaluate({ x: 3 }).value, 8, 1e-9, 'C2: 2(x+1) at x=3 is 8');

  // 3. (x+1)(x-1), with x = 3 -> 8
  assertClose(compileExpression('(x+1)(x-1)').evaluate({ x: 3 }).value, 8, 1e-9, 'C3: (x+1)(x-1) at x=3 is 8');

  // 4. 4pi -> 4 * Math.PI
  assertClose(evaluateExpression('4pi').value, 4 * Math.PI, 1e-9, 'C4: 4pi is 4 * Math.PI');

  // 5. 2sin(pi/2) -> 2
  assertClose(evaluateExpression('2sin(pi/2)').value, 2, 1e-9, 'C5: 2sin(pi/2) = 2');

  // 6. 3(x+2), with x = 4 -> 18
  assertClose(compileExpression('3(x+2)').evaluate({ x: 4 }).value, 18, 1e-9, 'C6: 3(x+2) at x=4 is 18');

  // 7. xy, with x = 3 and y = 4 -> 12
  const exprXY = compileExpression('xy');
  assert(exprXY.variables.includes('x') && exprXY.variables.includes('y'), 'C7: xy extracts variables x and y');
  assertClose(exprXY.evaluate({ x: 3, y: 4 }).value, 12, 1e-9, 'C7: xy at x=3, y=4 is 12');

  // 8. 2^3x, with x = 2 -> 16
  // Documentation: Exponentiation (^) has higher precedence than implicit multiplication (*).
  // Thus 2^3x parses as (2^3) * x = 8 * 2 = 16.
  const expr23x = compileExpression('2^3x');
  assertClose(expr23x.evaluate({ x: 2 }).value, 16, 1e-9, 'C8: 2^3x at x=2 is 16 ((2^3)*x)');
}

// ========================================
// TEST GROUP D: COMPILE-ONCE API & CONTRACT
// ========================================
console.log('--- TEST GROUP D: COMPILE-ONCE API ---');
{
  // 1. compileExpression(source) successfully compiles
  const compiled = compileExpression('x^2 - 4*x + 4');
  assert(typeof compiled.evaluate === 'function', 'D1: evaluate method exists');
  assert(typeof compiled.evaluateNum === 'function', 'D1: evaluateNum method exists');

  // 2. Evaluated multiple times with different values
  assertClose(compiled.evaluate({ x: 0 }).value, 4, 1e-9, 'D2: f(0) = 4');
  assertClose(compiled.evaluate({ x: 1 }).value, 1, 1e-9, 'D2: f(1) = 1');
  assertClose(compiled.evaluate({ x: 2 }).value, 0, 1e-9, 'D2: f(2) = 0');
  assertClose(compiled.evaluate({ x: 3 }).value, 1, 1e-9, 'D2: f(3) = 1');
  assertClose(compiled.evaluate({ x: 4 }).value, 4, 1e-9, 'D2: f(4) = 4');

  // 3. variables property reports expected names
  const multiVar = compileExpression('a*x^2 + b*y + c*t');
  assert(multiVar.variables.length === 6, 'D3: Has 6 variables (a, x, b, y, c, t)');
  assert(multiVar.variables.includes('a'), 'D3: Includes a');
  assert(multiVar.variables.includes('x'), 'D3: Includes x');
  assert(multiVar.variables.includes('b'), 'D3: Includes b');
  assert(multiVar.variables.includes('y'), 'D3: Includes y');
  assert(multiVar.variables.includes('c'), 'D3: Includes c');
  assert(multiVar.variables.includes('t'), 'D3: Includes t');

  // 4. Constants like pi and e are NOT reported as variables
  const constExpr = compileExpression('pi * x + e * y - tau * z + phi');
  assert(constExpr.variables.length === 3, 'D4: Variables count is exactly 3 (x, y, z)');
  assert(!constExpr.variables.includes('pi'), 'D4: pi is excluded from variables');
  assert(!constExpr.variables.includes('e'), 'D4: e is excluded from variables');
  assert(!constExpr.variables.includes('tau'), 'D4: tau is excluded from variables');
  assert(!constExpr.variables.includes('phi'), 'D4: phi is excluded from variables');

  // 5. evaluateExpression(source, scope) works as documented
  const direct = evaluateExpression('sin(pi/6)');
  assertClose(direct.value, 0.5, 1e-9, 'D5: evaluateExpression direct call');

  // 6. Invalid expressions produce understandable syntax errors
  assertThrowsSyntax(() => compileExpression(''), 'D6: Empty expression throws');
  assertThrowsSyntax(() => compileExpression('('), 'D6: Unclosed parenthesis throws');
  assertThrowsSyntax(() => compileExpression('2 + * 3'), 'D6: Operator without operand throws');
  assertThrowsSyntax(() => compileExpression('foobar(x)'), 'D6: Unknown function throws');

  // 7. Missing variables are handled consistently and do NOT silently become zero
  const missing = compileExpression('x + y');
  const missingResult = missing.evaluate({ x: 5 }); // y omitted
  assert(Number.isNaN(missingResult.value), 'D7: Missing variable produces NaN, not zero');
  assert(!missingResult.isReal, 'D7: Missing variable marked as not real');
  assert(missingResult.domainError?.includes('y') === true, 'D7: domainError identifies missing variable y');
}

console.log(`\n=================================================`);
console.log(`🎉 ALL ${totalTests} TEST ASSERTIONS PASSED SUCCESSFULLY! (${passedTests}/${totalTests})`);
console.log(`=================================================\n`);
