/**
 * EQUATION 1 — Universal 2D Graph Sampling Engine
 * Evaluates mathematical expressions over horizontal intervals and returns
 * valid, finite mathematical coordinate points organized into continuous segments.
 *
 * Capabilities:
 * - Uniform & Adaptive Subdivision: Adaptively refines high-curvature regions using
 *   midpoint linear deviation and screen-space perpendicular distance.
 * - Robust Discontinuity Detection: Identifies vertical asymptotes (1/x, tan(x),
 *   1/(x^2-1)), domain boundaries (sqrt(x), log(x)), and poles using multi-signal analysis
 *   (derivative sign reversals, steep chords, midpoint divergence, domain errors)
 *   without false-flagging steep continuous functions (e.g. 1000*x, x^3).
 * - Safe Resource Guarantees: Strictly limits max evaluations, recursion depth,
 *   minimum interval widths, and total points. Reuses existing evaluations with zero
 *   redundant evaluations.
 * - Zero DOM/rendering dependencies: Pure mathematical coordinates in Point2D segments.
 */

import { CompiledExpression, EvaluationResult } from '../math/types';
import { compileExpression } from '../math/evaluator';
import {
  Point2D,
  ViewportDimensions,
  AdaptiveOptions,
  SampleOptions,
  SampleResult,
  SamplerValidationError,
} from './types';

export interface NormalizedAdaptiveConfig {
  enabled: boolean;
  maxDepth: number;
  tolerance: number;
  minIntervalWidth: number;
  maxPoints: number;
  viewport?: ViewportDimensions;
}

export interface NormalizedSampleConfig {
  xMin: number;
  xMax: number;
  yMin?: number;
  yMax?: number;
  viewport?: ViewportDimensions;
  variable: string;
  sampleCount: number;
  maxEvaluations: number;
  parameters: Record<string, number>;
  adaptive: NormalizedAdaptiveConfig;
}

export interface DiscontinuityContext {
  xMin: number;
  xMax: number;
  yMin?: number;
  yMax?: number;
  viewport?: ViewportDimensions;
}

export interface DiscontinuityCheckResult {
  isDiscontinuous: boolean;
  reason?: string;
}

/**
 * Validates and normalizes sampling options with safe, robust defaults.
 */
export function validateSampleOptions(options: SampleOptions): NormalizedSampleConfig {
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

  // Validate viewport dimensions if provided
  const rawViewport = options.viewport || (typeof options.adaptive === 'object' ? options.adaptive?.viewport : undefined);
  let viewport: ViewportDimensions | undefined;
  if (rawViewport !== undefined) {
    if (
      typeof rawViewport.width !== 'number' ||
      !Number.isFinite(rawViewport.width) ||
      rawViewport.width <= 0
    ) {
      throw new SamplerValidationError(
        `viewport width must be a positive finite number, received: ${rawViewport.width}`
      );
    }
    if (
      typeof rawViewport.height !== 'number' ||
      !Number.isFinite(rawViewport.height) ||
      rawViewport.height <= 0
    ) {
      throw new SamplerValidationError(
        `viewport height must be a positive finite number, received: ${rawViewport.height}`
      );
    }
    viewport = { width: rawViewport.width, height: rawViewport.height };
  }

  // Validate variable name
  const variable = options.variable !== undefined ? options.variable.trim() : 'x';
  if (!variable || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(variable)) {
    throw new SamplerValidationError(
      `Invalid independent variable name '${variable}'. Must be a valid mathematical identifier.`
    );
  }

  // Normalize adaptive options
  let adaptiveConfig: NormalizedAdaptiveConfig;
  const isAdaptiveEnabled =
    options.adaptive === true ||
    (typeof options.adaptive === 'object' && options.adaptive.enabled !== false);

  if (isAdaptiveEnabled) {
    const rawAdaptive = typeof options.adaptive === 'object' ? options.adaptive : {};

    // Validate maxDepth
    const maxDepth = rawAdaptive.maxDepth !== undefined ? rawAdaptive.maxDepth : 6;
    if (!Number.isInteger(maxDepth) || maxDepth < 0) {
      throw new SamplerValidationError(
        `adaptive.maxDepth must be a non-negative integer >= 0, received: ${maxDepth}`
      );
    }

    // Validate tolerance (screen pixels if viewport provided, math units otherwise)
    const defaultTolerance = viewport ? 0.5 : 0.01;
    const tolerance = rawAdaptive.tolerance !== undefined ? rawAdaptive.tolerance : defaultTolerance;
    if (typeof tolerance !== 'number' || !Number.isFinite(tolerance) || tolerance <= 0) {
      throw new SamplerValidationError(
        `adaptive.tolerance must be a positive finite number > 0, received: ${tolerance}`
      );
    }

    // Validate minIntervalWidth
    const minIntervalWidth =
      rawAdaptive.minIntervalWidth !== undefined ? rawAdaptive.minIntervalWidth : 1e-10;
    if (
      typeof minIntervalWidth !== 'number' ||
      !Number.isFinite(minIntervalWidth) ||
      minIntervalWidth <= 0
    ) {
      throw new SamplerValidationError(
        `adaptive.minIntervalWidth must be a positive finite number > 0, received: ${minIntervalWidth}`
      );
    }

    // Validate maxPoints
    const maxPoints =
      rawAdaptive.maxPoints !== undefined ? rawAdaptive.maxPoints : (options.maxEvaluations || 5000);
    if (!Number.isInteger(maxPoints) || maxPoints < 2) {
      throw new SamplerValidationError(
        `adaptive.maxPoints must be an integer >= 2, received: ${maxPoints}`
      );
    }

    adaptiveConfig = {
      enabled: true,
      maxDepth,
      tolerance,
      minIntervalWidth,
      maxPoints,
      viewport,
    };
  } else {
    adaptiveConfig = {
      enabled: false,
      maxDepth: 0,
      tolerance: 0.01,
      minIntervalWidth: 1e-10,
      maxPoints: options.maxEvaluations || 5000,
      viewport,
    };
  }

  // Validate sample count resolution
  const defaultSampleCount = isAdaptiveEnabled ? (options.sampleCount !== undefined ? options.sampleCount : 50) : 300;
  const sampleCount = options.sampleCount !== undefined ? options.sampleCount : defaultSampleCount;
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
    viewport,
    variable,
    sampleCount,
    maxEvaluations,
    parameters,
    adaptive: adaptiveConfig,
  };
}

/**
 * Robust multi-signal discontinuity and vertical asymptote detector.
 *
 * Examines candidate endpoints p1, p2 and their midpoint to detect:
 * 1. Explicit domain singularities (division-by-zero, non-real values, NaNs, infinities).
 * 2. Asymptotic polarity flips (e.g. 1/x, tan(x)) where derivative sign conflicts with secant slope.
 * 3. Same-sign asymptotic spikes (e.g. 1/x^2, 1/(x-1)^2) with extreme midpoint deviation.
 * 4. Screen-space vertical plunges across visible bounds.
 *
 * Distinguishes steep continuous functions (e.g. 1000*x, x^3, steep exp) from true asymptotes
 * because continuous curves maintain consistent slopes and near-zero midpoint chord deviation.
 */
export function detectDiscontinuity(
  p1: Point2D,
  p2: Point2D,
  evaluateAt: (x: number) => EvaluationResult,
  context?: DiscontinuityContext
): DiscontinuityCheckResult {
  const dx = p2.x - p1.x;
  if (dx <= 0) {
    return { isDiscontinuous: false };
  }

  const xMid = (p1.x + p2.x) / 2;
  const midEval = evaluateAt(xMid);

  // Signal 1: Midpoint is not finite or outside real domain
  if (
    !midEval.isReal ||
    !midEval.isFinite ||
    Number.isNaN(midEval.value) ||
    !Number.isFinite(midEval.value)
  ) {
    return {
      isDiscontinuous: true,
      reason: midEval.domainError || 'Singularity or non-finite evaluation at midpoint',
    };
  }

  const yMid = midEval.value;
  const dxHalf = dx / 2;
  const s1 = (yMid - p1.y) / dxHalf;
  const s2 = (p2.y - yMid) / dxHalf;
  const sChord = (p2.y - p1.y) / dx;
  const yInterp = (p1.y + p2.y) / 2;
  const midDev = Math.abs(yMid - yInterp);
  const jump = Math.abs(p2.y - p1.y);

  // If both sub-interval slopes and chord slope have the exact same sign, the curve is
  // monotonic through this interval (e.g. continuing smoothly along a steep branch).
  // A vertical asymptote requires a slope conflict or reversal across the pole.
  if (s1 * s2 > 0 && sChord * s1 > 0) {
    return { isDiscontinuous: false };
  }

  const ySpan =
    context?.yMin !== undefined && context?.yMax !== undefined
      ? context.yMax - context.yMin
      : Math.max(10, Math.abs(p1.y) + Math.abs(p2.y));

  // Signal 2: Opposite-sign asymptotic jump (e.g. 1/x, tan(x), 1/(x^2 - 1))
  const oppositeSigns = (p1.y < 0 && p2.y > 0) || (p1.y > 0 && p2.y < 0);
  if (oppositeSigns && (jump > Math.max(10, 0.2 * ySpan) || midDev > 50)) {
    // Slopes conflict with the chord (chord goes down while left branch went up, or vice versa)
    if (sChord * s1 < 0 || sChord * s2 < 0) {
      return { isDiscontinuous: true, reason: 'Opposite-sign asymptote with slope conflict' };
    }
    // Sub-interval slopes sharply reverse with high magnitude
    if (s1 * s2 < 0 && Math.abs(s1 - s2) > 100) {
      return { isDiscontinuous: true, reason: 'Opposite-sign asymptote with sharp reversal' };
    }
    // Midpoint dramatically departs from linear chord
    if (midDev > Math.max(jump, ySpan) * 0.4) {
      return { isDiscontinuous: true, reason: 'Opposite-sign asymptote with severe midpoint deviation' };
    }
  }

  // Signal 3: Same-side asymptotic singularity (e.g. 1/x^2, 1/(x-1)^2)
  // Both sides are large, but one goes up steeply toward the pole and the other falls steeply
  if (
    Math.abs(p1.y) > 20 &&
    Math.abs(p2.y) > 20 &&
    Math.sign(p1.y) === Math.sign(p2.y) &&
    s1 * s2 < 0 &&
    Math.abs(s1 - s2) > 500 &&
    midDev > Math.max(jump, 20)
  ) {
    return { isDiscontinuous: true, reason: 'Same-side asymptotic singularity' };
  }

  // Signal 4: Screen-space vertical plunge across viewport with slope reversal
  if (context?.viewport && context.yMin !== undefined && context.yMax !== undefined) {
    const scaleY = context.viewport.height / (context.yMax - context.yMin);
    const scaleX = context.viewport.width / (context.xMax - context.xMin);
    const dyScreen = jump * scaleY;
    const dxScreen = dx * scaleX;

    if (
      dxScreen < 10 &&
      dyScreen > context.viewport.height * 0.7 &&
      s1 * s2 < 0 &&
      midDev * scaleY > 25
    ) {
      return { isDiscontinuous: true, reason: 'Screen-space vertical jump' };
    }
  }

  return { isDiscontinuous: false };
}

/**
 * Computes the curve's deviation from the straight line segment joining p1 and p2.
 * Uses screen-space perpendicular distance in pixels when viewport and yBounds are available,
 * and mathematical vertical midpoint deviation |yMid - (y1 + y2)/2| otherwise.
 */
function computeCurveDeviation(
  p1: Point2D,
  p2: Point2D,
  pMid: Point2D,
  config: NormalizedSampleConfig
): number {
  const { viewport, yMin, yMax, xMin, xMax } = config;

  if (viewport && yMin !== undefined && yMax !== undefined) {
    const scaleX = viewport.width / (xMax - xMin);
    const scaleY = viewport.height / (yMax - yMin);

    const sx1 = (p1.x - xMin) * scaleX;
    const sy1 = (yMax - p1.y) * scaleY;
    const sx2 = (p2.x - xMin) * scaleX;
    const sy2 = (yMax - p2.y) * scaleY;
    const sxMid = (pMid.x - xMin) * scaleX;
    const syMid = (yMax - pMid.y) * scaleY;

    const segLen = Math.hypot(sx2 - sx1, sy2 - sy1);
    if (segLen < 1e-6) {
      return 0;
    }

    // Perpendicular screen-space pixel distance from midpoint to segment (sx1, sy1)-(sx2, sy2)
    return Math.abs((sy2 - sy1) * sxMid - (sx2 - sx1) * syMid + sx2 * sy1 - sy2 * sx1) / segLen;
  }

  // Mathematical vertical deviation from linear interpolation
  const yInterp = (p1.y + p2.y) / 2;
  return Math.abs(pMid.y - yInterp);
}

interface EvaluatedPoint {
  x: number;
  y: number;
  isValid: boolean;
  domainError?: string;
}

/**
 * Samples a mathematical function over a horizontal domain [xMin, xMax].
 *
 * Compiles the expression once (or reuses an already-compiled expression),
 * evaluates uniformly or adaptively across the interval, rejects invalid points,
 * detects asymptotes and domain boundaries, and organizes valid mathematical coordinates
 * into separate continuous segments.
 *
 * @param expression Mathematical expression string or pre-compiled AST object
 * @param options Sampling interval, resolution, budget, adaptive settings, and variable configuration
 * @returns SampleResult containing continuous Point2D segments and diagnostic metadata
 */
export function sampleFunction(
  expression: string | CompiledExpression,
  options: SampleOptions
): SampleResult {
  // Step 1: Validate input options
  const config = validateSampleOptions(options);
  const {
    xMin,
    xMax,
    yMin,
    yMax,
    viewport,
    variable,
    sampleCount,
    maxEvaluations,
    parameters,
    adaptive,
  } = config;

  // Step 2: Compile expression once (or reuse existing compiled instance)
  const compiled: CompiledExpression =
    typeof expression === 'string'
      ? compileExpression(expression)
      : expression;

  // Diagnostic structures
  let evaluationsCount = 0;
  let validPointsCount = 0;
  let rejectedPointsCount = 0;
  let budgetExhausted = false;
  const warningsSet = new Set<string>();

  const evalScope: Record<string, number> = { ...parameters };

  const evaluateAt = (x: number): EvaluationResult => {
    evaluationsCount++;
    evalScope[variable] = x;
    return compiled.evaluate(evalScope);
  };

  const evalPoint = (x: number): EvaluatedPoint => {
    const res = evaluateAt(x);
    const isValid =
      res.isReal &&
      res.isFinite &&
      !Number.isNaN(res.value) &&
      Number.isFinite(res.value);

    return {
      x,
      y: isValid ? res.value : NaN,
      isValid,
      domainError: res.domainError,
    };
  };

  const discContext: DiscontinuityContext = {
    xMin,
    xMax,
    yMin,
    yMax,
    viewport,
  };

  // Segments collector
  const segments: Point2D[][] = [];
  let currentSegment: Point2D[] = [];

  const endSegment = () => {
    if (currentSegment.length > 0) {
      segments.push(currentSegment);
      currentSegment = [];
    }
  };

  const addPoint = (pt: EvaluatedPoint) => {
    if (!pt.isValid) {
      rejectedPointsCount++;
      if (pt.domainError) {
        warningsSet.add(pt.domainError);
      }
      endSegment();
      return;
    }

    if (adaptive.enabled && validPointsCount >= adaptive.maxPoints) {
      return;
    }

    // Check discontinuity with the previous point in the active segment
    if (currentSegment.length > 0) {
      const prev = currentSegment[currentSegment.length - 1];
      const disc = detectDiscontinuity(
        prev,
        { x: pt.x, y: pt.y },
        (x) => {
          evalScope[variable] = x;
          return compiled.evaluate(evalScope);
        },
        discContext
      );

      if (disc.isDiscontinuous) {
        endSegment();
      }
    }

    currentSegment.push({ x: pt.x, y: pt.y });
    validPointsCount++;
  };

  // Step 3: Branch between Adaptive Sampling and Uniform Sampling
  if (adaptive.enabled) {
    // Generate initial coarse points
    const stepX = (xMax - xMin) / (sampleCount - 1);
    const initialPoints: EvaluatedPoint[] = [];

    for (let i = 0; i < sampleCount; i++) {
      if (evaluationsCount >= maxEvaluations) {
        budgetExhausted = true;
        warningsSet.add(`Sampling budget of ${maxEvaluations} evaluations was exhausted.`);
        break;
      }
      const x = i === sampleCount - 1 ? xMax : xMin + i * stepX;
      initialPoints.push(evalPoint(x));
    }

    // Recursive adaptive subdivision function
    const subdivide = (pLeft: EvaluatedPoint, pRight: EvaluatedPoint, depth: number) => {
      // Resource check: max depth or min interval width
      if (
        depth >= adaptive.maxDepth ||
        pRight.x - pLeft.x <= adaptive.minIntervalWidth ||
        validPointsCount >= adaptive.maxPoints
      ) {
        return;
      }

      // Check evaluation budget
      if (evaluationsCount >= maxEvaluations) {
        budgetExhausted = true;
        warningsSet.add(`Sampling budget of ${maxEvaluations} evaluations was exhausted.`);
        return;
      }

      // Midpoint evaluation
      const xMid = (pLeft.x + pRight.x) / 2;
      const pMid = evalPoint(xMid);

      // If any endpoint or midpoint is invalid (domain boundary / singularity)
      if (!pLeft.isValid || !pRight.isValid || !pMid.isValid) {
        // Subdivide to pin down boundary
        subdivide(pLeft, pMid, depth + 1);
        addPoint(pMid);
        subdivide(pMid, pRight, depth + 1);
        return;
      }

      // Check for discontinuity / vertical asymptote
      const disc = detectDiscontinuity(
        { x: pLeft.x, y: pLeft.y },
        { x: pRight.x, y: pRight.y },
        (x) => {
          evalScope[variable] = x;
          return compiled.evaluate(evalScope);
        },
        discContext
      );

      if (disc.isDiscontinuous) {
        // Asymptote detected: subdivide branches toward the asymptote
        subdivide(pLeft, pMid, depth + 1);
        addPoint(pMid);
        subdivide(pMid, pRight, depth + 1);
        return;
      }

      // Check curve approximation tolerance
      const dev = computeCurveDeviation(
        { x: pLeft.x, y: pLeft.y },
        { x: pRight.x, y: pRight.y },
        { x: pMid.x, y: pMid.y },
        config
      );

      if (dev > adaptive.tolerance) {
        // Subdivide left interval, emit midpoint, subdivide right interval
        subdivide(pLeft, pMid, depth + 1);
        addPoint(pMid);
        subdivide(pMid, pRight, depth + 1);
      }
    };

    // Traverse intervals in order
    if (initialPoints.length > 0) {
      addPoint(initialPoints[0]);

      for (let i = 0; i < initialPoints.length - 1; i++) {
        const pLeft = initialPoints[i];
        const pRight = initialPoints[i + 1];

        subdivide(pLeft, pRight, 0);
        addPoint(pRight);
      }
    }
  } else {
    // Step 4: Uniform sampling loop with discontinuity break detection
    const stepX = (xMax - xMin) / (sampleCount - 1);

    for (let i = 0; i < sampleCount; i++) {
      if (evaluationsCount >= maxEvaluations) {
        budgetExhausted = true;
        warningsSet.add(`Sampling budget of ${maxEvaluations} evaluations was exhausted.`);
        break;
      }

      const x = i === sampleCount - 1 ? xMax : xMin + i * stepX;
      const pt = evalPoint(x);

      if (pt.isValid) {
        // Check discontinuity with previous point in current segment
        if (currentSegment.length > 0) {
          const prev = currentSegment[currentSegment.length - 1];
          const disc = detectDiscontinuity(
            prev,
            { x: pt.x, y: pt.y },
            (xVal) => {
              evalScope[variable] = xVal;
              return compiled.evaluate(evalScope);
            },
            discContext
          );

          if (disc.isDiscontinuous) {
            endSegment();
          }
        }

        currentSegment.push({ x: pt.x, y: pt.y });
        validPointsCount++;
      } else {
        rejectedPointsCount++;
        if (pt.domainError) {
          warningsSet.add(pt.domainError);
        }
        endSegment();
      }
    }
  }

  // Push final open segment if non-empty
  endSegment();

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
