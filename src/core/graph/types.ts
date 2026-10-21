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

export interface SampleOptions {
  /** Minimum x value of the sampling domain (must be finite, xMin < xMax) */
  xMin: number;
  /** Maximum x value of the sampling domain (must be finite, xMax > xMin) */
  xMax: number;
  /** Optional minimum visible y bound (used for asymptote/viewport context) */
  yMin?: number;
  /** Optional maximum visible y bound (used for asymptote/viewport context) */
  yMax?: number;
  /** Independent variable name to substitute during evaluation. Defaults to 'x'. */
  variable?: string;
  /** Initial uniform sample resolution (must be integer >= 2). Defaults to 300. */
  sampleCount?: number;
  /** Maximum evaluation budget to prevent uncontrolled computation. Defaults to 5000. */
  maxEvaluations?: number;
  /** Optional parameter values for expressions with auxiliary constants (e.g. { a: 2, b: -1 }) */
  parameters?: Record<string, number>;
  /** Optional placeholder for future adaptive sampling settings */
  adaptive?: {
    enabled?: boolean;
    maxDepth?: number;
    tolerance?: number;
  };
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
