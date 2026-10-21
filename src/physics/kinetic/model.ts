/**
 * EQUATION 1 — Kinetic Theory of Gases Physics Engine
 * Centralized thermodynamic formulas, Maxwell-Boltzmann statistics,
 * and scientific validation routines.
 */

import {
  GasSpecies,
  GasType,
  KineticParameters,
  KineticResults,
} from './types';

// Fundamental SI Physical Constants
export const GAS_CONSTANT_R = 8.314462618; // J mol^-1 K^-1
export const BOLTZMANN_CONSTANT_KB = 1.380649e-23; // J / K
export const AVOGADRO_CONSTANT_NA = 6.02214076e23; // mol^-1
export const STANDARD_ATMOSPHERE_PA = 101325; // Pa

// Gas species catalog with exact molar masses
export const GAS_CATALOG: Record<GasType, GasSpecies> = {
  helium: {
    id: 'helium',
    name: 'Helium',
    formula: 'He',
    molarMassGPerMol: 4.0026,
    molarMassKgPerMol: 0.0040026,
    atomicity: 'monatomic',
    particleColor: '#38BDF8', // Bright Sky Blue
    glowColor: 'rgba(56, 189, 248, 0.4)',
    radiusPm: 31,
    description: 'Lightest noble gas. Very high thermal speeds and small collision cross-section.',
  },
  neon: {
    id: 'neon',
    name: 'Neon',
    formula: 'Ne',
    molarMassGPerMol: 20.1797,
    molarMassKgPerMol: 0.0201797,
    atomicity: 'monatomic',
    particleColor: '#F43F5E', // Vivid Rose / Neon Orange-Red
    glowColor: 'rgba(244, 63, 94, 0.4)',
    radiusPm: 38,
    description: 'Monatomic inert gas with intermediate mass and classic red-orange emission.',
  },
  argon: {
    id: 'argon',
    name: 'Argon',
    formula: 'Ar',
    molarMassGPerMol: 39.948,
    molarMassKgPerMol: 0.039948,
    atomicity: 'monatomic',
    particleColor: '#A78BFA', // Purple / Violet
    glowColor: 'rgba(167, 139, 250, 0.4)',
    radiusPm: 71,
    description: 'Abundant heavy noble gas. Noticeably slower characteristic speeds than helium.',
  },
  nitrogen: {
    id: 'nitrogen',
    name: 'Nitrogen',
    formula: 'N₂',
    molarMassGPerMol: 28.0134,
    molarMassKgPerMol: 0.0280134,
    atomicity: 'diatomic',
    particleColor: '#60A5FA', // Medium Blue
    glowColor: 'rgba(96, 165, 250, 0.4)',
    radiusPm: 56,
    description: 'Primary constituent of Earth’s atmosphere (78%). Diatomic linear molecule.',
  },
  oxygen: {
    id: 'oxygen',
    name: 'Oxygen',
    formula: 'O₂',
    molarMassGPerMol: 31.998,
    molarMassKgPerMol: 0.031998,
    atomicity: 'diatomic',
    particleColor: '#34D399', // Emerald Green
    glowColor: 'rgba(52, 211, 153, 0.4)',
    radiusPm: 48,
    description: 'Essential diatomic atmospheric gas with strong paramagnetic properties.',
  },
};

export const DEFAULT_KINETIC_PARAMS: KineticParameters = {
  temperatureK: 300,
  volumeLiters: 5,
  moles: 1.0,
  gasType: 'nitrogen',
  visibleParticleCount: 100,
  viewMode: 'particles',
  simulationSpeed: 1.0,
  isPaused: false,
  showTrail: false,
  showVelocityVectors: false,
};

/**
 * Computes all macroscopic and microscopic quantities from kinetic theory & ideal gas law.
 */
export function computeKineticResults(params: KineticParameters): KineticResults {
  const species = GAS_CATALOG[params.gasType] || GAS_CATALOG.nitrogen;
  const T = Math.max(1, params.temperatureK);
  const n = Math.max(0.01, params.moles);
  const vLiters = Math.max(0.1, params.volumeLiters);

  // Convert volume: 1 L = 0.001 m^3
  const volumeM3 = vLiters * 1e-3;

  // 1. Ideal Gas Law: P = n R T / V
  const pressurePa = (n * GAS_CONSTANT_R * T) / volumeM3;
  const pressureKPa = pressurePa / 1000;
  const pressureAtm = pressurePa / STANDARD_ATMOSPHERE_PA;

  // 2. Translational Kinetic Energy
  // Average per molecule: <E_k> = (3/2) k_B T (strictly depends only on T, NOT mass!)
  const avgKineticEnergyJ = 1.5 * BOLTZMANN_CONSTANT_KB * T;

  // Total translational kinetic energy for the gas: E_total = (3/2) n R T
  const totalKineticEnergyJ = 1.5 * n * GAS_CONSTANT_R * T;

  // Internal Energy U (includes rotational modes for diatomic at standard temperatures)
  const degreesOfFreedom = species.atomicity === 'monatomic' ? 3 : 5;
  const internalEnergyJ = (degreesOfFreedom / 2) * n * GAS_CONSTANT_R * T;

  // 3. Characteristic Molecular Speeds (m/s)
  // Molar mass M in kg/mol
  const M = species.molarMassKgPerMol;

  // v_mp = sqrt(2 R T / M)
  const vMostProbable = Math.sqrt((2 * GAS_CONSTANT_R * T) / M);

  // v_mean = sqrt(8 R T / (pi M))
  const vMean = Math.sqrt((8 * GAS_CONSTANT_R * T) / (Math.PI * M));

  // v_rms = sqrt(3 R T / M)
  const vRms = Math.sqrt((3 * GAS_CONSTANT_R * T) / M);

  // 4. Kinetic Pressure Consistency Check
  // Gas density: rho = n M / V (kg/m^3)
  const massDensityKgPerM3 = (n * M) / volumeM3;

  // Kinetic theory pressure: P_kinetic = (1/3) * rho * v_rms^2
  // Note: (1/3) * (n M / V) * (3 R T / M) = n R T / V = P_ideal!
  const pressureKineticPa = (1 / 3) * massDensityKgPerM3 * Math.pow(vRms, 2);
  const pressureDifferencePa = Math.abs(pressureKineticPa - pressurePa);

  return {
    pressurePa,
    pressureKPa,
    pressureAtm,
    volumeM3,
    avgKineticEnergyJ,
    totalKineticEnergyJ,
    internalEnergyJ,
    degreesOfFreedom,
    vMostProbable,
    vMean,
    vRms,
    massDensityKgPerM3,
    pressureKineticPa,
    pressureDifferencePa,
    gasSpecies: species,
  };
}

/**
 * Evaluates the Maxwell-Boltzmann speed distribution probability density function f(v).
 *
 * f(v) = 4 * pi * [ M / (2 * pi * R * T) ]^(3/2) * v^2 * exp( - M * v^2 / (2 * R * T) )
 *
 * Guaranteed to be >= 0, f(0) = 0, and integral from 0 to inf is 1.0.
 */
export function maxwellBoltzmannPDF(
  v: number,
  temperatureK: number,
  molarMassKgPerMol: number
): number {
  if (v <= 0 || temperatureK <= 0 || molarMassKgPerMol <= 0) return 0;

  const R = GAS_CONSTANT_R;
  const T = temperatureK;
  const M = molarMassKgPerMol;

  const coefficient =
    4 * Math.PI * Math.pow(M / (2 * Math.PI * R * T), 1.5);

  const exponent = (-M * v * v) / (2 * R * T);

  // Guard against numerical underflow in exp
  if (exponent < -700) return 0;

  return coefficient * (v * v) * Math.exp(exponent);
}

/**
 * Generates an array of discrete points (v, f(v)) for rendering the Maxwell-Boltzmann distribution.
 */
export function generateMaxwellDistributionPoints(
  temperatureK: number,
  molarMassKgPerMol: number,
  maxSpeed?: number,
  numPoints: number = 200
): { speed: number; probabilityDensity: number }[] {
  // Determine cutoff speed: ~3.5 * v_rms ensures 99.9% of the distribution is included
  const vRms = Math.sqrt((3 * GAS_CONSTANT_R * temperatureK) / molarMassKgPerMol);
  const speedLimit = maxSpeed ?? Math.ceil(vRms * 3.5 / 100) * 100;

  const points: { speed: number; probabilityDensity: number }[] = [];
  const dv = speedLimit / (numPoints - 1);

  for (let i = 0; i < numPoints; i++) {
    const v = i * dv;
    const density = maxwellBoltzmannPDF(v, temperatureK, molarMassKgPerMol);
    points.push({ speed: v, probabilityDensity: density });
  }

  return points;
}

/**
 * Numerically integrates the Maxwell-Boltzmann distribution using trapezoidal rule
 * to verify that the area under the curve is identically 1.0.
 */
export function verifyMaxwellDistributionArea(
  temperatureK: number,
  molarMassKgPerMol: number,
  numSteps: number = 1000
): number {
  const vRms = Math.sqrt((3 * GAS_CONSTANT_R * temperatureK) / molarMassKgPerMol);
  const maxV = vRms * 5.0; // Captures practically 100% of distribution
  const dv = maxV / numSteps;

  let totalArea = 0;
  for (let i = 0; i < numSteps; i++) {
    const v1 = i * dv;
    const v2 = (i + 1) * dv;
    const f1 = maxwellBoltzmannPDF(v1, temperatureK, molarMassKgPerMol);
    const f2 = maxwellBoltzmannPDF(v2, temperatureK, molarMassKgPerMol);
    totalArea += 0.5 * (f1 + f2) * dv;
  }

  return totalArea;
}

/**
 * Box-Muller transform: samples 2D random velocities distributed according
 * to the 2D Maxwellian distribution with variance sigma^2 = k_B T / m = R T / M.
 */
export function sampleMaxwellianVelocity(
  temperatureK: number,
  molarMassKgPerMol: number
): { vx: number; vy: number } {
  // sigma in m/s
  const sigma = Math.sqrt((GAS_CONSTANT_R * temperatureK) / molarMassKgPerMol);

  // Box-Muller Gaussian sample
  let u1 = Math.random();
  while (u1 <= 1e-7) u1 = Math.random();
  const u2 = Math.random();

  const radius = Math.sqrt(-2.0 * Math.log(u1));
  const theta = 2.0 * Math.PI * u2;

  return {
    vx: sigma * radius * Math.cos(theta),
    vy: sigma * radius * Math.sin(theta),
  };
}
