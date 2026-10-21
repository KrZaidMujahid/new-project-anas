/**
 * EQUATION 1 — Universal 2D Graph Sampling Engine
 * Evaluates mathematical expressions over horizontal intervals and returns
 * valid, finite mathematical coordinate points organized into continuous segments.
 *
 * Guarantees:
 * - Reuses the compiled AST from src/core/math (compiles once per operation).
 * - Never includes NaN or Infinity in drawable segments.
 * - Splits segments cleanly across domain boundaries and invalid regions (e.g. sqrt(-x), 1/0, ln(0)).
 * - Strictly enforces configurable evaluation budgets and validates domain inputs.
 * - Zero pixel/DOM/rendering dependencies: outputs pure mathematical coordinates.
 */

import { CompiledExpression } from '../math/types';
import { compileExpression } from '../math/evaluator';
import {
  Point2D,
  SampleOptions,
  SampleResult,
  SamplerValidationError,
} from './types';

/**
 * Validates and normalizes sampling options with safe, robust defaults.
 */
export function validateSampleOptions(options: SampleOptions): {
  xMin: number;
  xMax: number;
  yMin?: number;
  yMax?: number;
  variable: string;
  sampleCount: number;
  maxEvaluations: number;
  parameters: Record<string, number>;
} {
  if (!options) {
    throw new SamplerValidationError('Sample options must be provided.');
  }

  const { xMin, xMax, yMin, yMax } = options;

  // Validate horizontal domain [xMin, xMax]
  if (typeof xMin !== 'number' || !Number.isFinite(xMin)) {
    throw new SamplerValidationError(`xMin must be a finite number, received: ${xMin}`);
  }
  if (typeof xMax !== 'number' || !Number.isFinite(xMax)) {
    throw new SamplerValidationError(`xMax must be a finite number, received: ${xMax}`);
  }
  if (xMin >= xMax) {
    throw new SamplerValidationError(
      `xMin (${xMin}) must be strictly less than xMax (${xMax}). Zero-width or inverted domains are invalid.`
    );
  }

  // Validate vertical bounds [yMin, yMax] if specified
  if (yMin !== undefined) {
    if (typeof yMin !== 'number' || !Number.isFinite(yMin)) {
      throw new SamplerValidationError(`yMin must be a finite number when provided, received: ${yMin}`);
    }
  }
  if (yMax !== undefined) {
    if (typeof yMax !== 'number' || !Number.isFinite(yMax)) {
      throw new SamplerValidationError(`yMax must be a finite number when provided, received: ${yMax}`);
    }
  }
  if (yMin !== undefined && yMax !== undefined && yMin >= yMax) {
    throw new SamplerValidationError(
      `yMin (${yMin}) must be strictly less than yMax (${yMax}).`
    );
  }

  // Validate variable name
  const variable = options.variable !== undefined ? options.variable.trim() : 'x';
  if (!variable || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(variable)) {
    throw new SamplerValidationError(
      `Invalid independent variable name '${variable}'. Must be a valid mathematical identifier.`
    );
  }

  // Validate sample count resolution
  const sampleCount = options.sampleCount !== undefined ? options.sampleCount : 300;
  if (!Number.isInteger(sampleCount) || sampleCount < 2) {
    throw new SamplerValidationError(
      `sampleCount must be an integer >= 2, received: ${sampleCount}`
    );
  }

  // Validate evaluation budget
  const maxEvaluations = options.maxEvaluations !== undefined ? options.maxEvaluations : 5000;
  if (!Number.isInteger(maxEvaluations) || maxEvaluations < sampleCount) {
    throw new SamplerValidationError(
      `maxEvaluations (${maxEvaluations}) must be an integer >= sampleCount (${sampleCount}).`
    );
  }

  const parameters = options.parameters || {};

  return {
    xMin,
    xMax,
    yMin,
    yMax,
    variable,
    sampleCount,
    maxEvaluations,
    parameters,
  };
}

/**
 * Samples a mathematical function over a horizontal domain [xMin, xMax].
 *
 * Compiles the expression once (or reuses an already-compiled expression),
 * evaluates uniformly across the interval, rejects invalid or non-finite points,
 * and organizes valid mathematical coordinates into separate continuous segments.
 *
 * @param expression Mathematical expression string or pre-compiled AST object
 * @param options Sampling interval, resolution, budget, and variable configuration
 * @returns SampleResult containing continuous Point2D segments and diagnostic metadata
 */
export function sampleFunction(
  expression: string | CompiledExpression,
  options: SampleOptions
): SampleResult {
  // Step 1: Validate input options
  const config = validateSampleOptions(options);
  const { xMin, xMax, variable, sampleCount, maxEvaluations, parameters } = config;

  // Step 2: Compile expression once (or reuse existing compiled instance)
  const compiled: CompiledExpression =
    typeof expression === 'string'
      ? compileExpression(expression)
      : expression;

  // Step 3: Initialize segmentation structures and diagnostics
  const segments: Point2D[][] = [];
  let currentSegment: Point2D[] = [];
  let evaluationsCount = 0;
  let validPointsCount = 0;
  let rejectedPointsCount = 0;
  let budgetExhausted = false;
  const warningsSet = new Set<string>();

  const stepX = (xMax - xMin) / (sampleCount - 1);

  // Step 4: Uniform sampling loop
  for (let i = 0; i < sampleCount; i++) {
    // Check evaluation budget
    if (evaluationsCount >= maxEvaluations) {
      budgetExhausted = true;
      warningsSet.add(`Sampling budget of ${maxEvaluations} evaluations was exhausted.`);
      break;
    }

    const x = i === sampleCount - 1 ? xMax : xMin + i * stepX;
    evaluationsCount++;

    // Parameter and variable substitution scope
    const scope: Record<string, number> = {
      ...parameters,
      [variable]: x,
    };

    const evalResult = compiled.evaluate(scope);
    const y = evalResult.value;

    // Check validity: must be real and finite
    const isValidPoint =
      evalResult.isReal &&
      evalResult.isFinite &&
      !Number.isNaN(y) &&
      Number.isFinite(y);

    if (isValidPoint) {
      // Valid mathematical coordinate point
      currentSegment.push({ x, y });
      validPointsCount++;
    } else {
      // Invalid point (e.g. sqrt(-1), 1/0, ln(0), ln(-x))
      rejectedPointsCount++;
      if (evalResult.domainError) {
        warningsSet.add(evalResult.domainError);
      }

      // End current continuous segment if it contains points
      if (currentSegment.length > 0) {
        segments.push(currentSegment);
        currentSegment = [];
      }
    }
  }

  // Push final open segment if non-empty
  if (currentSegment.length > 0) {
    segments.push(currentSegment);
  }

  return {
    segments,
    evaluationsCount,
    validPointsCount,
    rejectedPointsCount,
    segmentsCount: segments.length,
    budgetExhausted,
    warnings: Array.from(warningsSet),
  };
}
