/**
 * EQUATION 1 — 2D Graph Sampling Engine Types
 * Pure scientific type definitions for mathematical point sampling,
 * interval configuration, and continuous segmentation.
 */

import { CompiledExpression } from '../math/types';

export interface Point2D {
  x: number;
  y: number;
}

export interface ViewportDimensions {
  /** Viewport width in pixels (must be > 0) */
  width: number;
  /** Viewport height in pixels (must be > 0) */
  height: number;
}

export interface AdaptiveOptions {
  /** Whether adaptive subdivision is enabled. Defaults to true when adaptive configuration is provided. */
  enabled?: boolean;
  /** Maximum recursion depth for interval subdivision. Defaults to 6. */
  maxDepth?: number;
  /**
   * Curve approximation tolerance.
   * When viewport dimensions are available, tolerance is in screen pixels (defaults to 0.5 px).
   * When viewport dimensions are not provided, tolerance is in math units (defaults to 0.01).
   */
  tolerance?: number;
  /** Minimum interval width (x2 - x1) below which subdivision halts. Defaults to 1e-10. */
  minIntervalWidth?: number;
  /** Maximum total points allowed across all generated segments. Defaults to maxEvaluations. */
  maxPoints?: number;
  /** Optional viewport dimensions in pixels for computing screen-space deviation. */
  viewport?: ViewportDimensions;
}

export interface SampleOptions {
  /** Minimum x value of the sampling domain (must be finite, xMin < xMax) */
  xMin: number;
  /** Maximum x value of the sampling domain (must be finite, xMax > xMin) */
  xMax: number;
  /** Optional minimum visible y bound (used for asymptote/viewport context) */
  yMin?: number;
  /** Optional maximum visible y bound (used for asymptote/viewport context) */
  yMax?: number;
  /** Optional viewport dimensions in pixels (used for screen-space deviation calculations) */
  viewport?: ViewportDimensions;
  /** Independent variable name to substitute during evaluation. Defaults to 'x'. */
  variable?: string;
  /** Initial uniform sample resolution (must be integer >= 2). Defaults to 300 for uniform sampling, or 50 when adaptive. */
  sampleCount?: number;
  /** Maximum evaluation budget to prevent uncontrolled computation. Defaults to 5000. */
  maxEvaluations?: number;
  /** Optional parameter values for expressions with auxiliary constants (e.g. { a: 2, b: -1 }) */
  parameters?: Record<string, number>;
  /**
   * Adaptive subdivision configuration.
   * Can be boolean (true/false) or an AdaptiveOptions object.
   */
  adaptive?: boolean | AdaptiveOptions;
}

export interface SampleResult {
  /** Array of continuous segments containing ordered mathematical coordinate points */
  segments: Point2D[][];
  /** Total number of mathematical evaluations performed */
  evaluationsCount: number;
  /** Number of valid, finite points included in segments */
  validPointsCount: number;
  /** Number of rejected points (NaN, Infinity, or outside real domain) */
  rejectedPointsCount: number;
  /** Number of continuous segments generated */
  segmentsCount: number;
  /** Whether the max evaluation budget was exhausted */
  budgetExhausted: boolean;
  /** Domain, singularity, or budget warning notices */
  warnings: string[];
}

export class SamplerValidationError extends Error {
  constructor(message: string) {
    super(`SamplerValidationError: ${message}`);
    this.name = 'SamplerValidationError';
  }
}
