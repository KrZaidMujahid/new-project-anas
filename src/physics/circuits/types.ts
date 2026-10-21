/**
 * EQUATION 1 — RLC Circuits Laboratory Types & Data Contracts
 * Complete types for AC series/parallel RLC circuits, impedance, resonance,
 * power factor analysis, and DC transient response.
 */

export type CircuitMode = 'series' | 'parallel' | 'transient';

export type TransientType = 'rc' | 'rl' | 'rlc';

export type TransientAction = 'charge' | 'discharge' | 'step';

export type SelectedComponent = 'resistor' | 'inductor' | 'capacitor' | null;

export interface RLCParameters {
  // Mode
  circuitMode: CircuitMode;

  // Passive Component Values
  resistance: number; // in Ohms (1 to 1000 Ω)
  inductanceMilliHenries: number; // in mH (1 to 1000 mH)
  capacitanceMicroFarads: number; // in µF (1 to 1000 µF)

  // AC Source Parameters
  sourceVoltageRMS: number; // in Volts RMS (1 to 240 V)
  voltageDisplayMode: 'rms' | 'peak';
  sourceFrequency: number; // in Hz (1 to 1000 Hz)

  // Live Diagram Toggles
  showComponentVoltages: boolean;
  showCurrentDirection: boolean;

  // DC Transient Parameters
  transientType: TransientType;
  transientAction: TransientAction;
  dcSourceVoltage: number; // in Volts (1 to 50 V)
  transientSimulationTimeMs: number; // in ms
}

export interface SeriesCalculations {
  // Reactances and Impedance
  inductanceH: number; // L in Henries
  capacitanceF: number; // C in Farads
  angularFrequency: number; // ω = 2πf
  inductiveReactance: number; // X_L = 2πfL (Ω)
  capacitiveReactance: number; // X_C = 1/(2πfC) (Ω)
  netReactance: number; // X = X_L - X_C (Ω)
  impedance: number; // Z = sqrt(R² + (X_L - X_C)²) (Ω)

  // Currents
  vPeak: number; // V_peak = sqrt(2) * V_RMS
  currentRMS: number; // I_RMS = V_RMS / Z (A)
  currentPeak: number; // I_peak = sqrt(2) * I_RMS (A)

  // Phase
  phaseAngleRad: number; // φ = atan((X_L - X_C)/R) in radians
  phaseAngleDeg: number; // φ in degrees
  phaseRegime: 'inductive' | 'capacitive' | 'resonant';

  // Component Voltages (RMS)
  voltageResistorRMS: number; // V_R = I * R
  voltageInductorRMS: number; // V_L = I * X_L
  voltageCapacitorRMS: number; // V_C = I * X_C

  // Resonance & Bandwidth
  resonanceFrequency: number; // f_0 = 1 / (2π sqrt(LC)) (Hz)
  resonanceAngularFreq: number; // ω_0 = 1 / sqrt(LC) (rad/s)
  qualityFactor: number; // Q = (1/R) sqrt(L/C)
  bandwidthHz: number; // Δf = R / (2πL) = f_0 / Q

  // Power
  apparentPowerVA: number; // S = V_RMS * I_RMS (VA)
  realPowerWatts: number; // P = V_RMS * I_RMS * cos(φ) (W)
  reactivePowerVar: number; // Q_var = V_RMS * I_RMS * sin(φ) (var)
  powerFactor: number; // PF = cos(φ)
  powerFactorType: 'lagging' | 'leading' | 'unity';
}

export interface ParallelCalculations {
  inductanceH: number;
  capacitanceF: number;
  angularFrequency: number;
  inductiveReactance: number;
  capacitiveReactance: number;

  // Branch Currents (RMS)
  currentResistorRMS: number; // I_R = V_RMS / R
  currentInductorRMS: number; // I_L = V_RMS / X_L
  currentCapacitorRMS: number; // I_C = V_RMS / X_C

  // Total Admittance and Source Current
  admittanceSiemens: number; // Y = sqrt((1/R)² + (1/X_C - 1/X_L)²)
  currentSourceRMS: number; // I_source = V_RMS * Y
  currentSourcePeak: number;
  equivalentImpedance: number; // Z_eq = 1 / Y

  // Resonance
  resonanceFrequency: number; // f_0 = 1 / (2π sqrt(LC))
  phaseAngleDeg: number;
  phaseRegime: 'inductive' | 'capacitive' | 'resonant';
}

export interface TransientCalculations {
  // Time constants
  timeConstantRC: number; // τ_RC = R * C (seconds)
  timeConstantRL: number; // τ_RL = L / R (seconds)

  // RLC Damping parameters
  dampingCoefficientAlpha: number; // α = R / (2L)
  naturalFrequencyOmega0: number; // ω_0 = 1 / sqrt(LC)
  dampingRatioZeta: number; // ζ = α / ω_0
  dampingRegime: 'underdamped' | 'critically_damped' | 'overdamped';
  dampedAngularFreq: number | null; // ω_d = sqrt(ω_0² - α²) if underdamped

  // Pre-calculated time-series points for graph
  timePointsMs: number[];
  voltagePoints: number[];
  currentPoints: number[];
}

export interface RLCGuidedLab {
  id: number;
  title: string;
  badge: string;
  objective: string;
  instructions: string[];
  expectedObservations: string;
  setupParams: Partial<RLCParameters>;
  question: string;
  defaultAnswer?: string;
}

export interface RLCQuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
