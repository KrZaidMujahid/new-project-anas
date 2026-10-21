/**
 * EQUATION 1 — Photoelectric Effect Laboratory Types & Data Contracts
 * Complete types for Einstein's photoelectric equation, metals, photon kinematics,
 * I-V characteristic curves, guided labs, observations, and educational experiments.
 */

export interface MetalSpec {
  id: string;
  name: string;
  symbol: string;
  workFunctionEV: number; // in eV (approximate representative value)
  workFunctionJoules: number; // in Joules
  color: string;
  description: string;
}

export interface PhotoelectricParameters {
  // Light Source Properties
  frequencyHz: number; // in Hz (suggested range: 3.0e14 to 1.5e15 Hz, default: 8.0e14 Hz)
  intensityPercent: number; // 0% to 100% (default: 50%)
  selectedMetalId: string; // 'cesium' | 'potassium' | 'sodium' | 'calcium' | 'zinc' | 'copper'

  // Electrical Retarding / Accelerating Potential
  appliedVoltage: number; // in Volts (-10.0 V to +10.0 V, default: 0 V)
  // Voltage convention: V = V_collector - V_emitter

  // Visual & Animation Toggles
  showElectricField: boolean;
  showTrajectories: boolean;
  isPaused: boolean;
  animationSpeed: number; // 0.5x, 1.0x, 2.0x
}

export interface PhotoelectricCalculations {
  // Photon properties
  frequencyHz: number;
  wavelengthMeters: number;
  wavelengthNm: number;
  photonEnergyJoules: number;
  photonEnergyEV: number;
  spectralRegion: 'UV' | 'Visible' | 'Infrared';
  spectralColorHex: string;
  spectralColorName: string;
  isUltraviolet: boolean;

  // Metal properties
  metal: MetalSpec;
  thresholdFrequencyHz: number;
  thresholdWavelengthNm: number;

  // Emission status & energetics
  isEmissionPossible: boolean;
  frequencyRatio: number; // f / f_threshold
  maxKineticEnergyJoules: number; // K_max = hf - φ (0 if below threshold)
  maxKineticEnergyEV: number;
  stoppingPotentialVolts: number; // V_stop = K_max_eV (positive magnitude in Volts)
  maxElectronSpeedMs: number; // v_max = sqrt(2 K_max / m_e) (nonrelativistic)

  // Particle flux & Current rates (Normalized illustrative educational model)
  normalizedPhotonFlux: number; // photons/s index based on intensity
  emittedElectronRate: number; // electrons/s index (eta * photon flux if emission possible)
  collectedElectronRate: number; // electrons/s reaching anode
  quantumEfficiency: number; // eta (e.g. 0.05 - 0.10)
  saturationCurrentMicroAmps: number;
  photocurrentMicroAmps: number;
  isCollectorCurrentZero: boolean;
  electricFieldDirection: 'accelerating' | 'retarding' | 'none';
  regimeMessage: string;
}

export interface WavelengthPreset {
  label: string;
  wavelengthNm: number;
  frequencyHz: number;
  region: 'UV' | 'Visible' | 'Infrared';
  colorHex: string;
  description: string;
}

export interface PhotoelectricPreset {
  id: string;
  title: string;
  badge: string;
  description: string;
  params: Partial<PhotoelectricParameters>;
}

export interface PhotoelectricGuidedStep {
  stepNumber: number;
  title: string;
  instruction: string;
  targetParams?: Partial<PhotoelectricParameters>;
  expectedObservation: string;
  explanation: string;
}

export interface PhotoelectricGuidedExperiment {
  id: string;
  letter: string;
  title: string;
  badge: string;
  objective: string;
  initialParams: Partial<PhotoelectricParameters>;
  steps: PhotoelectricGuidedStep[];
  conclusion: string;
}

export interface PhotoelectricObservation {
  id: string;
  timestamp: string;
  metalName: string;
  workFunctionEV: number;
  frequencyHz: number;
  wavelengthNm: number;
  photonEnergyEV: number;
  intensityPercent: number;
  appliedVoltage: number;
  isEmissionPossible: boolean;
  maxKineticEnergyEV: number;
  stoppingPotentialVolts: number;
  photocurrentMicroAmps: number;
  notes: string;
}

export interface PhotoelectricQuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
