/**
 * EQUATION 1 — Wave Interference Physics Types & Contracts
 * Pure scientific type definitions for wave superposition, two-source interference,
 * and interferometric analysis for Class 11 & Class 12 physics.
 */

export type WaveExperimentMode = 'superposition' | 'two-source' | 'analysis';

export type InterferenceVisualizationMode =
  | 'two-source' // Mode 1: Expanding circular wavefronts & overlapping field
  | 'constructive' // Mode 2: In-phase reinforcement & antinodal hyperbolas (Δr = nλ)
  | 'destructive' // Mode 3: Opposite-phase cancellation & nodal hyperbolas (Δr = (n+1/2)λ)
  | 'resultant' // Mode 4: 1D animated wave profiles (Wave 1, Wave 2, Resultant)
  | 'intensity'; // Mode 5: 2D Interference Intensity Map I ∝ 4 cos²(Δφ/2)

export type WavePropagationDirection = 'forward' | 'backward';

export interface SinusoidalWaveParams {
  amplitude: number; // A in arbitrary units / meters (>= 0)
  wavelength: number; // λ in meters (> 0)
  frequency: number; // f in Hz (> 0)
  initialPhaseDeg: number; // φ in degrees (-360 to +360)
  direction: WavePropagationDirection; // +x or -x
  visible: boolean;
}

export interface WaveSuperpositionParameters {
  wave1: SinusoidalWaveParams;
  wave2: SinusoidalWaveParams;
  showResultant: boolean;
  sameMediumLocked: boolean; // if true, v1 = v2 = v (waves share the same medium)
  commonMediumSpeed: number; // v in m/s (e.g. 5.0 m/s)
  spatialSpanMeters: number; // total visible spatial range along x, e.g. 10.0 m
  probeX: number; // x location in meters for time-domain measurement
}

export interface PointSource2D {
  id: 'S1' | 'S2';
  x: number; // meters
  y: number; // meters
  amplitude: number; // A in meters
  wavelength: number; // λ in meters
  frequency: number; // f in Hz
  phaseDeg: number; // φ in degrees
}

export interface TwoSourceParameters {
  separation: number; // d in meters between S1 and S2 (0.5 to 5.0 m, default 2.0 m)
  wavelength: number; // λ in meters (0.2 to 5.0 m, default 1.0 m)
  frequency: number; // f in Hz (0.5 to 10.0 Hz, default 2.0 Hz)
  amplitude: number; // A in arbitrary units (0.1 to 2.0, default 1.0)
  amplitude1: number; // A1
  amplitude2: number; // A2
  phaseDifferenceDeg: number; // Δφ = φ2 - φ1 in degrees (0 to 360°, default 0°)
  sourcePhase1Deg: number; // φ1 in degrees
  sourcePhase2Deg: number; // φ2 in degrees
  waveSpeed: number; // Selected / Medium wave speed in m/s (0.5 to 10 m/s, default 2.0 m/s)
  lockSpeedToPhysics: boolean; // When true, waveSpeed strictly follows v = fλ
  fieldWidthMeters: number; // width of 2D field, e.g. 12.0 m
  fieldHeightMeters: number; // height of 2D field, e.g. 8.0 m
  showWavefronts: boolean; // circular wavefront rings
  showConstructiveHyperbolas: boolean; // antinodal lines (Δr = nλ)
  showDestructiveHyperbolas: boolean; // nodal lines (Δr = (n+1/2)λ)
  renderMode: 'field' | 'intensity' | 'wavefronts'; // 2D rendering style
  activeVizMode: InterferenceVisualizationMode;
  probePoint: { x: number; y: number }; // observation point P(x, y)
}

export type InterferenceClassification = 'constructive' | 'destructive' | 'partial';

export interface PointInterferenceAnalysis {
  r1: number; // distance from S1 to P (m)
  r2: number; // distance from S2 to P (m)
  pathDifference: number; // Δr = r2 - r1 (m)
  pathDifferenceInWavelengths: number; // Δr / λ
  effectivePhaseDiffRad: number; // ΔΦ = kΔr + Δφ0 (rad)
  effectivePhaseDiffDeg: number; // ΔΦ in degrees
  y1Instantaneous: number; // displacement from S1 at P at time t (m)
  y2Instantaneous: number; // displacement from S2 at P at time t (m)
  yResultantInstantaneous: number; // y1 + y2 at P at time t (m)
  resultantAmplitude: number; // local theoretical max amplitude A_R (m)
  relativeIntensity: number; // normalized intensity I / I0 (0 to 4 for equal A)
  classification: InterferenceClassification;
  orderN: number; // nearest order n
}

export interface WaveDerivedProperties {
  waveNumber: number; // k = 2π / λ (rad/m)
  angularFrequency: number; // ω = 2πf (rad/s)
  period: number; // T = 1 / f (s)
  speed: number; // v = fλ (m/s)
  visibleWavefrontsCount?: number; // Approximate number of wavefront rings in field
}

export type WavePreset =
  | {
      id: string;
      name: string;
      category: 'superposition';
      description: string;
      params: Partial<WaveSuperpositionParameters>;
    }
  | {
      id: string;
      name: string;
      category: 'two-source';
      description: string;
      params: Partial<TwoSourceParameters>;
    };

export interface GuidedTask {
  id: number;
  title: string;
  instructions: string;
  expectedObservation: string;
  presetAction?: Partial<TwoSourceParameters>;
  recordedValue: string;
  isCompleted: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ObservationLogEntry {
  id: string;
  timestamp: string;
  experimentName: string;
  mode: WaveExperimentMode;
  parametersSummary: string;
  observedResult: string;
  notes: string;
}
