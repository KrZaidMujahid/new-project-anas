/**
 * EQUATION 1 — Graph Module Public API
 * Reusable interfaces and functions for 2D mathematical graph sampling and analysis.
 */

export * from './types';
export { validateSampleOptions, sampleFunction, detectDiscontinuity } from './sampler';
export type {
  NormalizedAdaptiveConfig,
  NormalizedSampleConfig,
  DiscontinuityContext,
  DiscontinuityCheckResult,
} from './sampler';
