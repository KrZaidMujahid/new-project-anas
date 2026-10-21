/**
 * EQUATION 1 — Doppler Effect Physics Contracts & Types
 * Complete scientific models for acoustic wave propagation,
 * relative motion, wavelength compression/expansion, and observer telemetry.
 */

export interface DopplerParameters {
  sourceFrequency: number; // f_source in Hz (100 to 1000 Hz, default 500 Hz)
  speedOfSound: number; // v in m/s (250 to 400 m/s, default 343 m/s)
  sourceVelocity: number; // v_source in m/s (-100 to +100 m/s, default +30 m/s; + = toward observer)
  observerVelocity: number; // v_observer in m/s (-50 to +50 m/s, default 0 m/s; + = toward source)
  animationSpeed: number; // visual playback multiplier: 0.5, 1.0, 2.0
}

export interface DopplerDerivedValues {
  observedFrequency: number; // f_observed in Hz
  frequencyShift: number; // Δf = f_observed - f_source in Hz
  relativeShiftPercent: number; // (Δf / f_source) * 100
  wavelengthFront: number; // λ_front in meters = (v - v_s) / f_s
  wavelengthBehind: number; // λ_behind in meters = (v + v_s) / f_s
  stationaryWavelength: number; // λ_0 in meters = v / f_s
  machNumberSource: number; // |v_s| / v
  machNumberObserver: number; // |v_o| / v
  regime: 'approaching' | 'receding' | 'stationary';
  explanationText: string;
}

export interface WavefrontPoint {
  id: number;
  emissionTime: number;
  originX: number; // X position where source was when wave was emitted
  originY: number; // Y position of emission
  radius: number; // current expanding radius
}

export interface DopplerPreset {
  id: string;
  name: string;
  tagline: string;
  description: string;
  params: DopplerParameters;
}

export interface GuidedDopplerActivity {
  id: number;
  title: string;
  objective: string;
  instructions: string[];
  expectedObservation: string;
  presetParams?: Partial<DopplerParameters>;
}

export interface DopplerQuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
