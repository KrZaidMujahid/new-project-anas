/**
 * EQUATION 1 — Kinetic Theory of Gases Laboratory
 * Type Definitions & Data Contracts
 */

export type GasType = 'helium' | 'neon' | 'argon' | 'nitrogen' | 'oxygen';

export interface GasSpecies {
  id: GasType;
  name: string;
  formula: string;
  molarMassGPerMol: number; // in g/mol
  molarMassKgPerMol: number; // in kg/mol
  atomicity: 'monatomic' | 'diatomic';
  particleColor: string;
  glowColor: string;
  radiusPm: number; // visual atomic/molecular radius scale
  description: string;
}

export type GasViewMode = 'particles' | 'collisions';

export interface KineticParameters {
  // Thermodynamic variables
  temperatureK: number; // 100 K to 1000 K (default 300 K)
  volumeLiters: number; // 1 L to 10 L (default 5 L)
  moles: number; // 0.1 mol to 2.0 mol (default 1.0 mol)
  gasType: GasType; // Helium, Neon, Argon, Nitrogen, Oxygen

  // Visual simulation configuration
  visibleParticleCount: number; // 50 to 150 (default 100, illustration only)
  viewMode: GasViewMode; // 'particles' | 'collisions'
  simulationSpeed: number; // 0.25x to 2.0x (default 1.0x)
  isPaused: boolean;
  showTrail: boolean;
  showVelocityVectors: boolean;
}

export interface KineticResults {
  // Macroscopic Thermodynamic Quantities (SI & practical units)
  pressurePa: number; // Ideal gas law: P = n R T / V
  pressureKPa: number; // in kPa
  pressureAtm: number; // in atm (101325 Pa)
  volumeM3: number; // V in m^3 (1 L = 0.001 m^3)

  // Energy
  avgKineticEnergyJ: number; // <E_k> = (3/2) k_B T (J / molecule)
  totalKineticEnergyJ: number; // E_total = (3/2) n R T (J)
  internalEnergyJ: number; // U = (degreesOfFreedom/2) n R T
  degreesOfFreedom: number; // 3 for monatomic, 5 for diatomic (rigid rotor at ~room temp)

  // Characteristic Molecular Speeds (m/s)
  vMostProbable: number; // v_mp = sqrt(2 R T / M)
  vMean: number; // v_mean = sqrt(8 R T / (pi M))
  vRms: number; // v_rms = sqrt(3 R T / M)

  // Density & Kinetic Pressure Consistency
  massDensityKgPerM3: number; // rho = n M / V
  pressureKineticPa: number; // P_kinetic = (1/3) rho v_rms^2
  pressureDifferencePa: number; // |P_kinetic - P_ideal|

  // Gas Properties
  gasSpecies: GasSpecies;
}

export interface Particle2D {
  id: number;
  x: number; // container coordinate [0, width]
  y: number; // container coordinate [0, height]
  vx: number; // velocity x (m/s scale)
  vy: number; // velocity y (m/s scale)
  radius: number;
  color: string;
  lastWallCollisionTime: number; // timestamp of last wall collision for flash
  recentCollisions: number;
}

export interface WallCollisionEvent {
  wall: 'top' | 'bottom' | 'left' | 'right';
  x: number;
  y: number;
  impulse: number;
  timestamp: number;
}

export interface ObservationRecord {
  id: string;
  experimentNumber: number;
  timestamp: string;
  gasType: string;
  gasFormula: string;
  temperatureK: number;
  volumeL: number;
  moles: number;
  pressureKPa: number;
  vMostProbableMs: number;
  vMeanMs: number;
  vRmsMs: number;
  avgKineticEnergyJ: string; // scientific notation string
  notes?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}
