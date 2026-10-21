/**
 * EQUATION 1 — Bohr Hydrogen Model Physics Engine
 * Exact analytical formulas for energy levels, orbital radii, orbital speeds,
 * transitions, photon frequencies/wavelengths, and spectral series classifications.
 */

import {
  BOHR_RADIUS_METERS,
  BOHR_RADIUS_ANGSTROMS,
  GROUND_STATE_ENERGY_EV,
  PLANCK_CONSTANT,
  SPEED_OF_LIGHT,
  ELEMENTARY_CHARGE,
  FINE_STRUCTURE_CONSTANT,
  RYDBERG_CONSTANT_HYDROGEN,
} from './constants';

import {
  PrincipalQuantumNumber,
  BohrEnergyLevel,
  ElectronTransition,
  SpectralSeriesName,
  SpectralRegion,
  BohrPreset,
} from './types';

/**
 * Calculates all analytical properties for a given principal quantum number n.
 */
export function calculateEnergyLevel(n: PrincipalQuantumNumber): BohrEnergyLevel {
  const nSquared = n * n;
  const energyEV = GROUND_STATE_ENERGY_EV / nSquared; // -13.6 / n^2
  const energyJoules = energyEV * ELEMENTARY_CHARGE;
  const radiusMeters = BOHR_RADIUS_METERS * nSquared; // a_0 * n^2
  const radiusAngstroms = BOHR_RADIUS_ANGSTROMS * nSquared;
  const speedMetersPerSec = (FINE_STRUCTURE_CONSTANT * SPEED_OF_LIGHT) / n; // α * c / n
  const speedFractionOfC = FINE_STRUCTURE_CONSTANT / n;

  const labels: Record<PrincipalQuantumNumber, string> = {
    1: 'Ground State (n=1)',
    2: '1st Excited State (n=2)',
    3: '2nd Excited State (n=3)',
    4: '3rd Excited State (n=4)',
    5: '4th Excited State (n=5)',
    6: '5th Excited State (n=6)',
  };

  return {
    n,
    label: labels[n],
    energyEV,
    energyJoules,
    radiusMeters,
    radiusAngstroms,
    speedMetersPerSec,
    speedFractionOfC,
  };
}

/**
 * Precomputed data for all allowed levels n = 1 to 6
 */
export const ALL_ENERGY_LEVELS: BohrEnergyLevel[] = [
  calculateEnergyLevel(1),
  calculateEnergyLevel(2),
  calculateEnergyLevel(3),
  calculateEnergyLevel(4),
  calculateEnergyLevel(5),
  calculateEnergyLevel(6),
];

/**
 * Maps an optical wavelength in nm (approx. 380-750 nm) to RGB hex.
 * Outside the visible range, returns undefined.
 */
export function wavelengthToRGB(wavelengthNM: number): string | undefined {
  if (wavelengthNM < 380 || wavelengthNM > 750) {
    return undefined;
  }

  let r = 0;
  let g = 0;
  let b = 0;

  if (wavelengthNM >= 380 && wavelengthNM < 440) {
    r = -(wavelengthNM - 440) / (440 - 380);
    g = 0.0;
    b = 1.0;
  } else if (wavelengthNM >= 440 && wavelengthNM < 490) {
    r = 0.0;
    g = (wavelengthNM - 440) / (490 - 440);
    b = 1.0;
  } else if (wavelengthNM >= 490 && wavelengthNM < 510) {
    r = 0.0;
    g = 1.0;
    b = -(wavelengthNM - 510) / (510 - 490);
  } else if (wavelengthNM >= 510 && wavelengthNM < 580) {
    r = (wavelengthNM - 510) / (580 - 510);
    g = 1.0;
    b = 0.0;
  } else if (wavelengthNM >= 580 && wavelengthNM < 645) {
    r = 1.0;
    g = -(wavelengthNM - 645) / (645 - 580);
    b = 0.0;
  } else if (wavelengthNM >= 645 && wavelengthNM <= 750) {
    r = 1.0;
    g = 0.0;
    b = 0.0;
  }

  // Intensity falloff near vision limits (380-420 and 700-750)
  let factor = 1.0;
  if (wavelengthNM >= 380 && wavelengthNM < 420) {
    factor = 0.3 + (0.7 * (wavelengthNM - 380)) / (420 - 380);
  } else if (wavelengthNM >= 700 && wavelengthNM <= 750) {
    factor = 0.3 + (0.7 * (750 - wavelengthNM)) / (750 - 700);
  }

  const red = Math.round(255 * Math.pow(r * factor, 0.8));
  const green = Math.round(255 * Math.pow(g * factor, 0.8));
  const blue = Math.round(255 * Math.pow(b * factor, 0.8));

  return `#${((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1)}`;
}

/**
 * Determines the spectral region for a given wavelength in nm.
 */
export function determineSpectralRegion(wavelengthNM: number): SpectralRegion {
  if (wavelengthNM < 380) return 'ultraviolet';
  if (wavelengthNM <= 750) return 'visible';
  return 'infrared';
}

/**
 * Identifies the classical hydrogen spectral series given the lower level.
 */
export function determineSpectralSeries(lowerLevel: PrincipalQuantumNumber): SpectralSeriesName | undefined {
  switch (lowerLevel) {
    case 1:
      return 'Lyman';
    case 2:
      return 'Balmer';
    case 3:
      return 'Paschen';
    case 4:
      return 'Brackett';
    case 5:
      return 'Pfund';
    default:
      return undefined;
  }
}

/**
 * Calculates the wavelength using the Rydberg formula:
 * 1 / λ = R_H * |1 / n_f^2 - 1 / n_i^2|
 */
export function calculateRydbergWavelength(
  ni: PrincipalQuantumNumber,
  nf: PrincipalQuantumNumber
): number {
  const term = Math.abs(1 / (nf * nf) - 1 / (ni * ni));
  if (term === 0) return Infinity;
  const invLambda = RYDBERG_CONSTANT_HYDROGEN * term;
  return (1 / invLambda) * 1e9; // in nanometers
}

/**
 * Evaluates an electron transition between n_i and n_f.
 * Returns null if n_i === n_f.
 */
export function calculateTransition(
  ni: PrincipalQuantumNumber,
  nf: PrincipalQuantumNumber
): ElectronTransition | null {
  if (ni === nf) return null;

  const levelI = calculateEnergyLevel(ni);
  const levelF = calculateEnergyLevel(nf);

  // Transition type: Absorption (going up in energy) or Emission (going down)
  const isAbsorption = nf > ni;
  const type = isAbsorption ? 'absorption' : 'emission';

  // Lower and higher quantum numbers
  const lowerN = Math.min(ni, nf) as PrincipalQuantumNumber;
  const higherN = Math.max(ni, nf) as PrincipalQuantumNumber;

  // Energy difference ΔE is always positive magnitude
  const deltaEnergyEV = Math.abs(levelF.energyEV - levelI.energyEV);
  const deltaEnergyJoules = deltaEnergyEV * ELEMENTARY_CHARGE;

  // Frequency: f = E / h
  const frequencyHz = deltaEnergyJoules / PLANCK_CONSTANT;

  // Wavelength: λ = c / f = hc / E
  const wavelengthMeters = SPEED_OF_LIGHT / frequencyHz;
  const wavelengthNM = wavelengthMeters * 1e9;

  // Rydberg wavelength comparison
  const rydbergWavelengthNM = calculateRydbergWavelength(ni, nf);
  const diff = Math.abs(wavelengthNM - rydbergWavelengthNM);
  const rydbergAgreementPercent = Math.max(0, 100 - (diff / wavelengthNM) * 100);

  // Spectral Series (based on lower level of transition)
  const spectralSeries = determineSpectralSeries(lowerN);

  // Spectral Region
  const spectralRegion = determineSpectralRegion(wavelengthNM);

  // Color mapping
  const visibleColorHex = wavelengthToRGB(wavelengthNM);

  // Notable Balmer spectral lines
  const isBalmer = lowerN === 2;
  const isHAlpha = isBalmer && higherN === 3;
  const isHBeta = isBalmer && higherN === 4;
  const isHGamma = isBalmer && higherN === 5;
  const isHDelta = isBalmer && higherN === 6;

  return {
    initialLevel: ni,
    finalLevel: nf,
    type,
    deltaEnergyEV,
    deltaEnergyJoules,
    frequencyHz,
    wavelengthMeters,
    wavelengthNM,
    rydbergWavelengthNM,
    rydbergAgreementPercent,
    spectralSeries,
    spectralRegion,
    visibleColorHex,
    isHAlpha,
    isHBeta,
    isHGamma,
    isHDelta,
  };
}

/**
 * Standard Educational Presets for the Bohr Model Laboratory
 */
export const BOHR_PRESETS: BohrPreset[] = [
  {
    id: 'ground-state',
    title: 'Ground State (n = 1)',
    subtitle: 'Lowest Allowed Energy State',
    description: 'The electron is in its most tightly bound state at E₁ = -13.60 eV and r₁ = 0.529 Å.',
    initialLevel: 1,
    finalLevel: 1,
    isTransition: false,
    category: 'State',
  },
  {
    id: 'first-excited',
    title: 'First Excited State (n = 2)',
    subtitle: 'Orbital Radius Quadrupled (r = 4 a₀)',
    description: 'The electron occupies n = 2 with E₂ = -3.40 eV. Binding energy drops to 25% of the ground state.',
    initialLevel: 2,
    finalLevel: 2,
    isTransition: false,
    category: 'State',
  },
  {
    id: 'second-excited',
    title: 'Second Excited State (n = 3)',
    subtitle: 'Orbital Radius 9× (r = 9 a₀)',
    description: 'The electron occupies n = 3 with E₃ = -1.51 eV, ready to emit the iconic red H-alpha photon.',
    initialLevel: 3,
    finalLevel: 3,
    isTransition: false,
    category: 'State',
  },
  {
    id: 'balmer-alpha',
    title: 'Balmer-α / H-α Emission (n = 3 → 2)',
    subtitle: 'λ = 656.3 nm · Vibrant Red Light',
    description: 'The most prominent visible line in astronomy, giving emission nebulae their deep crimson glow.',
    initialLevel: 3,
    finalLevel: 2,
    isTransition: true,
    category: 'Balmer Line',
  },
  {
    id: 'balmer-beta',
    title: 'Balmer-β / H-β Emission (n = 4 → 2)',
    subtitle: 'λ = 486.1 nm · Cyan / Blue-Green',
    description: 'Transition from n = 4 to n = 2 releasing 2.55 eV of energy as cyan visible light.',
    initialLevel: 4,
    finalLevel: 2,
    isTransition: true,
    category: 'Balmer Line',
  },
  {
    id: 'balmer-gamma',
    title: 'Balmer-γ / H-γ Emission (n = 5 → 2)',
    subtitle: 'λ = 434.0 nm · Deep Blue / Violet',
    description: 'High-energy Balmer transition releasing 2.86 eV photon at 434.0 nm.',
    initialLevel: 5,
    finalLevel: 2,
    isTransition: true,
    category: 'Balmer Line',
  },
  {
    id: 'lyman-alpha',
    title: 'Lyman-α Emission (n = 2 → 1)',
    subtitle: 'λ = 121.6 nm · Extreme Ultraviolet',
    description: 'A 10.20 eV jump down into the ground state, releasing powerful ultraviolet radiation (Lyman forest).',
    initialLevel: 2,
    finalLevel: 1,
    isTransition: true,
    category: 'Lyman Line',
  },
  {
    id: 'absorption-1-to-3',
    title: 'Photon Absorption (n = 1 → 3)',
    subtitle: 'Requires 12.09 eV UV Photon',
    description: 'The atom absorbs an incoming 12.09 eV photon, boosting the electron from ground state to n = 3.',
    initialLevel: 1,
    finalLevel: 3,
    isTransition: true,
    category: 'State',
  },
];
