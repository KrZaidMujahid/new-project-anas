/**
 * EQUATION 1 — Photoelectric Effect Physics Engine & Theoretical Models
 * Rigorous implementation of Einstein's photoelectric equation, Planck kinematics,
 * spectral conversions, metals database, 8 presets, 5 guided experiments, and quiz.
 */

import {
  MetalSpec,
  PhotoelectricParameters,
  PhotoelectricCalculations,
  WavelengthPreset,
  PhotoelectricPreset,
  PhotoelectricGuidedExperiment,
  PhotoelectricQuizQuestion,
} from './types';

// ============================================================================
// 1. FUNDAMENTAL SCIENTIFIC CONSTANTS (CODATA 2018 / SI Standard)
// ============================================================================
export const PLANCK_CONSTANT = 6.62607015e-34; // J·s
export const SPEED_OF_LIGHT = 299792458; // m/s
export const ELEMENTARY_CHARGE = 1.602176634e-19; // C
export const ELECTRON_MASS = 9.1093837139e-31; // kg

// ============================================================================
// 2. METALS DATABASE (Representative approximate work functions)
// ============================================================================
export const METALS: MetalSpec[] = [
  {
    id: 'cesium',
    name: 'Cesium',
    symbol: 'Cs',
    workFunctionEV: 2.14,
    workFunctionJoules: 2.14 * ELEMENTARY_CHARGE,
    color: '#FBBF24',
    description: 'Highly reactive alkali metal with very low work function; emits photoelectrons even under green and blue visible light.',
  },
  {
    id: 'potassium',
    name: 'Potassium',
    symbol: 'K',
    workFunctionEV: 2.30,
    workFunctionJoules: 2.30 * ELEMENTARY_CHARGE,
    color: '#A78BFA',
    description: 'Alkali metal used in early photoelectric cells; threshold lies in the green visible spectrum (~540 nm).',
  },
  {
    id: 'sodium',
    name: 'Sodium',
    symbol: 'Na',
    workFunctionEV: 2.28,
    workFunctionJoules: 2.28 * ELEMENTARY_CHARGE,
    color: '#38BDF8',
    description: 'Classic textbook photoemitter; emits across green, blue, violet, and ultraviolet light.',
  },
  {
    id: 'calcium',
    name: 'Calcium',
    symbol: 'Ca',
    workFunctionEV: 2.90,
    workFunctionJoules: 2.90 * ELEMENTARY_CHARGE,
    color: '#34D399',
    description: 'Alkaline earth metal with moderate work function; requires high-frequency violet or ultraviolet light to emit.',
  },
  {
    id: 'zinc',
    name: 'Zinc',
    symbol: 'Zn',
    workFunctionEV: 4.30,
    workFunctionJoules: 4.30 * ELEMENTARY_CHARGE,
    color: '#94A3B8',
    description: 'Transition metal used in Hertz’s historic 1887 discovery; requires ultraviolet radiation (λ < 289 nm).',
  },
  {
    id: 'copper',
    name: 'Copper',
    symbol: 'Cu',
    workFunctionEV: 4.70,
    workFunctionJoules: 4.70 * ELEMENTARY_CHARGE,
    color: '#FB923C',
    description: 'Common conductive metal with tightly bound conduction electrons; requires deep ultraviolet (λ < 264 nm).',
  },
];

// ============================================================================
// 3. WAVELENGTH PRESETS (Section 4)
// ============================================================================
export const WAVELENGTH_PRESETS: WavelengthPreset[] = [
  {
    label: '750 nm (Red)',
    wavelengthNm: 750,
    frequencyHz: SPEED_OF_LIGHT / (750 * 1e-9),
    region: 'Visible',
    colorHex: '#FB7185',
    description: 'Far-red visible light (low frequency, long wavelength)',
  },
  {
    label: '650 nm (Red)',
    wavelengthNm: 650,
    frequencyHz: SPEED_OF_LIGHT / (650 * 1e-9),
    region: 'Visible',
    colorHex: '#F43F5E',
    description: 'Red visible laser light (He-Ne laser standard)',
  },
  {
    label: '550 nm (Green)',
    wavelengthNm: 550,
    frequencyHz: SPEED_OF_LIGHT / (550 * 1e-9),
    region: 'Visible',
    colorHex: '#34D399',
    description: 'Mid-spectrum green light (peak human eye sensitivity)',
  },
  {
    label: '450 nm (Blue)',
    wavelengthNm: 450,
    frequencyHz: SPEED_OF_LIGHT / (450 * 1e-9),
    region: 'Visible',
    colorHex: '#38BDF8',
    description: 'Blue visible light (energetic visible photons)',
  },
  {
    label: '400 nm (Violet)',
    wavelengthNm: 400,
    frequencyHz: SPEED_OF_LIGHT / (400 * 1e-9),
    region: 'Visible',
    colorHex: '#8B5CF6',
    description: 'Near-boundary violet light (limit of human vision)',
  },
  {
    label: '350 nm (UV)',
    wavelengthNm: 350,
    frequencyHz: SPEED_OF_LIGHT / (350 * 1e-9),
    region: 'UV',
    colorHex: '#818CF8',
    description: 'Near-ultraviolet (invisible to human eye; energetic photons)',
  },
  {
    label: '250 nm (UV)',
    wavelengthNm: 250,
    frequencyHz: SPEED_OF_LIGHT / (250 * 1e-9),
    region: 'UV',
    colorHex: '#6366F1',
    description: 'Deep ultraviolet radiation (high photon energy ~4.96 eV)',
  },
];

// ============================================================================
// 4. SPECTRAL COLOR DETERMINATION
// ============================================================================
export function getWavelengthColor(wavelengthNm: number): {
  hex: string;
  name: string;
  region: 'UV' | 'Visible' | 'Infrared';
  isUltraviolet: boolean;
} {
  if (wavelengthNm < 380) {
    // Symbolic color for UV (not implying visible to human eye)
    return { hex: '#818CF8', name: 'Ultraviolet (UV)', region: 'UV', isUltraviolet: true };
  } else if (wavelengthNm < 440) {
    return { hex: '#8B5CF6', name: 'Violet', region: 'Visible', isUltraviolet: false };
  } else if (wavelengthNm < 490) {
    return { hex: '#38BDF8', name: 'Blue', region: 'Visible', isUltraviolet: false };
  } else if (wavelengthNm < 560) {
    return { hex: '#34D399', name: 'Green', region: 'Visible', isUltraviolet: false };
  } else if (wavelengthNm < 590) {
    return { hex: '#FBBF24', name: 'Yellow', region: 'Visible', isUltraviolet: false };
  } else if (wavelengthNm < 630) {
    return { hex: '#FB923C', name: 'Orange', region: 'Visible', isUltraviolet: false };
  } else if (wavelengthNm <= 750) {
    return { hex: '#FB7185', name: 'Red', region: 'Visible', isUltraviolet: false };
  } else {
    return { hex: '#F43F5E', name: 'Infrared (IR)', region: 'Infrared', isUltraviolet: false };
  }
}

// ============================================================================
// 5. CENTRAL SCIENTIFIC CALCULATION UTILITIES (Sections 5 & 6)
// ============================================================================

export function calculatePhotonEnergyJoules(frequencyHz: number): number {
  return PLANCK_CONSTANT * frequencyHz;
}

export function calculatePhotonEnergyEV(frequencyHz: number): number {
  return (PLANCK_CONSTANT * frequencyHz) / ELEMENTARY_CHARGE;
}

export function calculateWavelength(frequencyHz: number): { meters: number; nm: number } {
  const meters = SPEED_OF_LIGHT / frequencyHz;
  return { meters, nm: meters * 1e9 };
}

export function calculateThresholdFrequency(workFunctionJoules: number): number {
  return workFunctionJoules / PLANCK_CONSTANT;
}

export function calculateThresholdWavelengthNm(thresholdFrequencyHz: number): number {
  return (SPEED_OF_LIGHT / thresholdFrequencyHz) * 1e9;
}

export function calculateMaximumKineticEnergyEV(
  photonEnergyEV: number,
  workFunctionEV: number
): { isEmissionPossible: boolean; kMaxEV: number } {
  const diff = photonEnergyEV - workFunctionEV;
  if (diff >= 0) {
    return { isEmissionPossible: true, kMaxEV: diff };
  }
  return { isEmissionPossible: false, kMaxEV: 0 };
}

export function calculateMaximumElectronSpeed(kMaxJoules: number): number {
  if (kMaxJoules <= 0) return 0;
  return Math.sqrt((2 * kMaxJoules) / ELECTRON_MASS);
}

/**
 * Computes all photoelectric quantities synchronously from parameters
 */
export function computePhotoelectricCalculations(
  params: PhotoelectricParameters
): PhotoelectricCalculations {
  const metal = METALS.find((m) => m.id === params.selectedMetalId) || METALS[0];
  const f = Math.max(1e12, params.frequencyHz);

  // Wavelength: λ = c / f
  const { meters: wavelengthMeters, nm: wavelengthNm } = calculateWavelength(f);
  const spectral = getWavelengthColor(wavelengthNm);

  // Photon Energy: E = h f
  const photonEnergyJoules = calculatePhotonEnergyJoules(f);
  const photonEnergyEV = photonEnergyJoules / ELEMENTARY_CHARGE;

  // Thresholds: f_0 = φ / h, λ_0 = c / f_0
  const thresholdFrequencyHz = calculateThresholdFrequency(metal.workFunctionJoules);
  const thresholdWavelengthNm = calculateThresholdWavelengthNm(thresholdFrequencyHz);

  // Einstein's Photoelectric Equation: K_max = h f - φ
  const { isEmissionPossible, kMaxEV: maxKineticEnergyEV } = calculateMaximumKineticEnergyEV(
    photonEnergyEV,
    metal.workFunctionEV
  );

  const maxKineticEnergyJoules = maxKineticEnergyEV * ELEMENTARY_CHARGE;

  // Stopping Potential magnitude: V_stop = K_max_eV (positive magnitude in Volts)
  // Idealized stopping condition: collector voltage V = -V_stop
  const stoppingPotentialVolts = maxKineticEnergyEV;

  // Maximum Electron Speed (nonrelativistic): v_max = sqrt(2 K_max / m_e)
  const maxElectronSpeedMs = isEmissionPossible
    ? calculateMaximumElectronSpeed(maxKineticEnergyJoules)
    : 0;

  // Photon flux & particle emission rates (Normalized educational model)
  const intensityFraction = Math.max(0, Math.min(100, params.intensityPercent)) / 100;
  // Let 100% intensity correspond to a normalized photon flux of 1.0 × 10¹⁴ photons/s
  const normalizedPhotonFlux = intensityFraction * 1.0e14;
  const quantumEfficiency = 0.08; // Simplified quantum efficiency η = 8%

  const emittedElectronRate = isEmissionPossible ? normalizedPhotonFlux * quantumEfficiency : 0;

  // Photocurrent model:
  // Base saturation current: 10 µA at 100% intensity
  const maxSaturationCurrent = 10.0; // µA
  const saturationCurrentMicroAmps = isEmissionPossible ? maxSaturationCurrent * intensityFraction : 0;

  let photocurrentMicroAmps = 0;
  let collectedElectronRate = 0;
  const V = params.appliedVoltage;

  if (isEmissionPossible && intensityFraction > 0) {
    if (V <= -stoppingPotentialVolts) {
      // Retarding potential exceeds stopping potential: current strictly 0
      photocurrentMicroAmps = 0;
      collectedElectronRate = 0;
    } else if (V < 0) {
      // Retarding potential between -V_stop and 0 V
      // Model of energy distribution: continuous distribution from 0 up to K_max
      const remainingRatio = (V + stoppingPotentialVolts) / Math.max(0.001, stoppingPotentialVolts);
      const iZeroBias = saturationCurrentMicroAmps * 0.6; // ~60% collection at zero bias
      photocurrentMicroAmps = iZeroBias * Math.pow(Math.max(0, remainingRatio), 1.6);
      collectedElectronRate = emittedElectronRate * (photocurrentMicroAmps / saturationCurrentMicroAmps);
    } else {
      // Accelerating positive voltage (0 V to +10 V)
      const iZeroBias = saturationCurrentMicroAmps * 0.6;
      const approach = 1 - Math.exp(-V / 1.8);
      photocurrentMicroAmps = iZeroBias + (saturationCurrentMicroAmps - iZeroBias) * approach;
      collectedElectronRate = emittedElectronRate * (photocurrentMicroAmps / saturationCurrentMicroAmps);
    }
  }

  // Numerical precision cleanup
  if (photocurrentMicroAmps < 0.005) {
    photocurrentMicroAmps = 0;
    collectedElectronRate = 0;
  }

  const isCollectorCurrentZero = photocurrentMicroAmps === 0;

  let electricFieldDirection: 'accelerating' | 'retarding' | 'none' = 'none';
  if (V > 0.05) electricFieldDirection = 'accelerating';
  else if (V < -0.05) electricFieldDirection = 'retarding';

  // Educational Regime explanation
  let regimeMessage = '';
  if (!isEmissionPossible) {
    regimeMessage = `Photon energy (${photonEnergyEV.toFixed(2)} eV) is strictly below the work function (${metal.workFunctionEV.toFixed(2)} eV). No photoelectrons are emitted regardless of light intensity!`;
  } else if (isCollectorCurrentZero && V <= -stoppingPotentialVolts) {
    regimeMessage = `Retarding voltage (${V.toFixed(2)} V) matches or exceeds the stopping potential (-${stoppingPotentialVolts.toFixed(2)} V). All photoelectrons are arrested; photocurrent is zero!`;
  } else if (V < 0) {
    regimeMessage = `Retarding voltage (${V.toFixed(2)} V) opposes electron motion. Only photoelectrons with initial kinetic energy > e|V| reach the collector plate.`;
  } else if (V > 3.0) {
    regimeMessage = `Positive accelerating voltage collects all emitted photoelectrons. Photocurrent is saturated at ${photocurrentMicroAmps.toFixed(2)} µA.`;
  } else {
    regimeMessage = `Photoelectrons are emitted with maximum kinetic energy ${maxKineticEnergyEV.toFixed(2)} eV and maximum speed ${(maxElectronSpeedMs / 1e5).toFixed(2)} × 10⁵ m/s.`;
  }

  return {
    frequencyHz: f,
    wavelengthMeters,
    wavelengthNm,
    photonEnergyJoules,
    photonEnergyEV,
    spectralRegion: spectral.region,
    spectralColorHex: spectral.hex,
    spectralColorName: spectral.name,
    isUltraviolet: spectral.isUltraviolet,
    metal,
    thresholdFrequencyHz,
    thresholdWavelengthNm,
    isEmissionPossible,
    frequencyRatio: f / thresholdFrequencyHz,
    maxKineticEnergyJoules,
    maxKineticEnergyEV,
    stoppingPotentialVolts,
    maxElectronSpeedMs,
    normalizedPhotonFlux,
    emittedElectronRate,
    collectedElectronRate,
    quantumEfficiency,
    saturationCurrentMicroAmps,
    photocurrentMicroAmps,
    isCollectorCurrentZero,
    electricFieldDirection,
    regimeMessage,
  };
}

// ============================================================================
// 6. 8 PRESET EXPERIMENTS (Section 11)
// ============================================================================
export const PHOTOELECTRIC_PRESETS: PhotoelectricPreset[] = [
  {
    id: 'preset-1-below-threshold',
    title: 'Preset 1: Below Threshold',
    badge: 'No Emission',
    description: 'Selects Cesium (φ = 2.14 eV) and red light (f = 4.0×10¹⁴ Hz, 750 nm, E = 1.65 eV). Photon energy is below work function. No photoelectrons, zero photocurrent.',
    params: {
      selectedMetalId: 'cesium',
      frequencyHz: 4.0e14,
      intensityPercent: 80,
      appliedVoltage: 0,
    },
  },
  {
    id: 'preset-2-just-above-threshold',
    title: 'Preset 2: Just Above Threshold',
    badge: 'Slow Electrons',
    description: 'Selects frequency slightly above threshold for Cesium (f = 5.3×10¹⁴ Hz, 566 nm). Electrons are liberated with small kinetic energy (K_max ≈ 0.05 eV) and small stopping potential.',
    params: {
      selectedMetalId: 'cesium',
      frequencyHz: 5.3e14,
      intensityPercent: 50,
      appliedVoltage: 0,
    },
  },
  {
    id: 'preset-3-high-frequency',
    title: 'Preset 3: High-Frequency Light',
    badge: 'Fast Electrons',
    description: 'Selects ultraviolet radiation (f = 1.2×10¹⁵ Hz, 250 nm). Photons carry 4.96 eV, imparting high K_max (2.82 eV) and high electron speed to emitted photoelectrons.',
    params: {
      selectedMetalId: 'cesium',
      frequencyHz: 1.2e15,
      intensityPercent: 50,
      appliedVoltage: 0,
    },
  },
  {
    id: 'preset-4-change-intensity',
    title: 'Preset 4: Change Intensity',
    badge: 'Intensity Variation',
    description: 'Keeps frequency high (8.0×10¹⁴ Hz) and increases intensity from 20% to 80%. Emits more photoelectrons per second, raising photocurrent without altering K_max or V_stop.',
    params: {
      selectedMetalId: 'cesium',
      frequencyHz: 8.0e14,
      intensityPercent: 80,
      appliedVoltage: 0,
    },
  },
  {
    id: 'preset-5-high-intensity-below-threshold',
    title: 'Preset 5: High Intensity Below Threshold',
    badge: 'Decisive Quantum Proof',
    description: 'Selects sub-threshold red light (f = 4.0×10¹⁴ Hz) and sets intensity to 100%. Demonstrates that extreme brightness cannot produce photoelectrons in the one-photon model.',
    params: {
      selectedMetalId: 'cesium',
      frequencyHz: 4.0e14,
      intensityPercent: 100,
      appliedVoltage: 0,
    },
  },
  {
    id: 'preset-6-compare-metals',
    title: 'Preset 6: Compare Metals',
    badge: 'Work Function Shift',
    description: 'Compares different metal work functions under fixed violet light (f = 7.5×10¹⁴ Hz, 3.10 eV). Cesium emits vigorously, while Zinc (φ = 4.30 eV) emits nothing.',
    params: {
      selectedMetalId: 'zinc',
      frequencyHz: 7.5e14,
      intensityPercent: 70,
      appliedVoltage: 0,
    },
  },
  {
    id: 'preset-7-stopping-potential',
    title: 'Preset 7: Stopping Potential',
    badge: 'V = -V_stop',
    description: 'Adjusts collector voltage to the negative stopping potential (-1.17 V for 8.0×10¹⁴ Hz on Cesium). The opposing electric field turns back all photoelectrons, extinguishing the photocurrent.',
    params: {
      selectedMetalId: 'cesium',
      frequencyHz: 8.0e14,
      intensityPercent: 50,
      appliedVoltage: -1.17,
    },
  },
  {
    id: 'preset-8-intensity-vs-frequency',
    title: 'Preset 8: Intensity vs. Frequency',
    badge: 'Core Distinction',
    description: 'Demonstrates the fundamental contrast: light intensity determines the quantity of emitted electrons, while light frequency determines individual electron kinetic energy.',
    params: {
      selectedMetalId: 'sodium',
      frequencyHz: 9.0e14,
      intensityPercent: 75,
      appliedVoltage: 0,
    },
  },
];

// ============================================================================
// 7. 5 GUIDED EXPERIMENTS (Section 14: Experiments A to E)
// ============================================================================
export const PHOTOELECTRIC_GUIDED_EXPERIMENTS: PhotoelectricGuidedExperiment[] = [
  {
    id: 'exp-a',
    letter: 'A',
    title: 'Experiment A: Find the Threshold Frequency',
    badge: 'f_0 = φ / h',
    objective: 'Locate the exact minimum frequency required for photoelectric emission from Sodium (Na, φ = 2.28 eV).',
    initialParams: {
      selectedMetalId: 'sodium',
      frequencyHz: 4.0e14,
      intensityPercent: 60,
      appliedVoltage: 0,
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Select Metal & Observe Below Threshold',
        instruction: 'Select Sodium (Na) with work function φ = 2.28 eV. Note that at f = 4.0×10¹⁴ Hz (750 nm, red light), no electrons leave the cathode plate.',
        targetParams: { selectedMetalId: 'sodium', frequencyHz: 4.0e14, appliedVoltage: 0 },
        expectedObservation: 'No photoelectrons are emitted; photocurrent reads 0.00 µA.',
        explanation: 'Each red photon carries only E = hf ≈ 1.65 eV, which is less than Sodium’s work function (2.28 eV).',
      },
      {
        stepNumber: 2,
        title: 'Gradually Increase Frequency',
        instruction: 'Move the frequency slider to approximately 5.0×10¹⁴ Hz (600 nm, yellow-orange light). Check whether emission has started.',
        targetParams: { frequencyHz: 5.0e14 },
        expectedObservation: 'Still no photoelectrons emitted; E = 2.07 eV is still below 2.28 eV.',
        explanation: 'Photoemission cannot begin until individual photon energy equals or exceeds the work function.',
      },
      {
        stepNumber: 3,
        title: 'Cross the Threshold Frequency',
        instruction: 'Increase frequency to 5.6×10¹⁴ Hz (535 nm, green light). Observe the first appearance of photoelectrons leaving the cathode.',
        targetParams: { frequencyHz: 5.6e14 },
        expectedObservation: 'Photoelectrons begin emerging from the cathode! Photocurrent is measured.',
        explanation: 'At f = 5.6×10¹⁴ Hz, E_photon = 2.32 eV > 2.28 eV. The theoretical threshold is f_0 = φ/h ≈ 5.51×10¹⁴ Hz (544 nm).',
      },
    ],
    conclusion: 'Threshold frequency f_0 depends exclusively on the metal work function φ. Light with frequency below f_0 cannot liberate photoelectrons.',
  },
  {
    id: 'exp-b',
    letter: 'B',
    title: 'Experiment B: Change Intensity',
    badge: 'Intensity vs. K_max',
    objective: 'Prove that changing light intensity increases photocurrent but leaves maximum kinetic energy and stopping potential completely unchanged.',
    initialParams: {
      selectedMetalId: 'cesium',
      frequencyHz: 8.0e14,
      intensityPercent: 20,
      appliedVoltage: 0,
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Record Initial Low-Intensity Values',
        instruction: 'Set Cesium (φ = 2.14 eV) with frequency 8.0×10¹⁴ Hz and low intensity (20%). Record K_max (1.17 eV) and photocurrent (~2.0 µA).',
        targetParams: { selectedMetalId: 'cesium', frequencyHz: 8.0e14, intensityPercent: 20, appliedVoltage: 0 },
        expectedObservation: 'Small photocurrent (~2.0 µA) with maximum kinetic energy K_max = 1.17 eV and V_stop = 1.17 V.',
        explanation: 'Low light intensity means fewer photons arrive per second, liberating fewer electrons per second.',
      },
      {
        stepNumber: 2,
        title: 'Increase Intensity to 50%',
        instruction: 'Increase the light intensity slider to 50%. Compare the new photocurrent and the new kinetic energy.',
        targetParams: { intensityPercent: 50 },
        expectedObservation: 'Photocurrent increases to ~5.0 µA (2.5× higher), but K_max remains exactly 1.17 eV!',
        explanation: 'More photons strike the cathode, but each photon still carries the identical quantum energy hf = 3.31 eV.',
      },
      {
        stepNumber: 3,
        title: 'Maximize Intensity to 100%',
        instruction: 'Push intensity to 100%. Observe that saturation photocurrent reaches its maximum (~10.0 µA) while K_max and V_stop stay constant.',
        targetParams: { intensityPercent: 100 },
        expectedObservation: 'Maximum photocurrent (10.0 µA) is achieved. K_max and V_stop remain strictly unchanged at 1.17 eV and 1.17 V.',
        explanation: 'Intensity controls the quantity of photons, not the energy per photon. This is direct proof of the quantum photon hypothesis.',
      },
    ],
    conclusion: 'Light intensity controls photon flux and photocurrent, but has zero effect on the maximum kinetic energy or stopping potential.',
  },
  {
    id: 'exp-c',
    letter: 'C',
    title: 'Experiment C: Change Frequency',
    badge: 'Linear Relation',
    objective: 'Investigate how increasing light frequency increases photon energy, maximum kinetic energy, and stopping potential.',
    initialParams: {
      selectedMetalId: 'potassium',
      frequencyHz: 6.0e14,
      intensityPercent: 50,
      appliedVoltage: 0,
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Initial Frequency (f = 6.0×10¹⁴ Hz)',
        instruction: 'Select Potassium (φ = 2.30 eV). At f = 6.0×10¹⁴ Hz (E = 2.48 eV), calculate K_max = 2.48 - 2.30 = 0.18 eV.',
        targetParams: { selectedMetalId: 'potassium', frequencyHz: 6.0e14, intensityPercent: 50, appliedVoltage: 0 },
        expectedObservation: 'Low kinetic energy electrons emerge (K_max = 0.18 eV, V_stop = 0.18 V).',
        explanation: 'Photons have barely enough energy above the work function to release slow electrons.',
      },
      {
        stepNumber: 2,
        title: 'Higher Frequency (f = 9.0×10¹⁴ Hz)',
        instruction: 'Increase frequency to 9.0×10¹⁴ Hz (E = 3.72 eV). Observe the increase in K_max and stopping potential.',
        targetParams: { frequencyHz: 9.0e14 },
        expectedObservation: 'K_max jumps to 1.42 eV and stopping potential jumps to 1.42 V. Emitted electrons move much faster.',
        explanation: 'Because E = hf increases linearly with frequency, the surplus energy (hf - φ) converted into kinetic energy increases by the exact same amount.',
      },
      {
        stepNumber: 3,
        title: 'Deep Ultraviolet (f = 1.3×10¹⁵ Hz)',
        instruction: 'Push frequency to 1.3×10¹⁵ Hz (UV, E = 5.38 eV). Check the resulting maximum kinetic energy.',
        targetParams: { frequencyHz: 1.3e15 },
        expectedObservation: 'K_max reaches 3.08 eV; stopping potential is 3.08 V; electron speed exceeds 1.0 × 10⁶ m/s.',
        explanation: 'The slope of the K_max versus frequency line is Planck’s constant (h/e in eV·s), universal for all metals.',
      },
    ],
    conclusion: 'Maximum photoelectron kinetic energy and stopping potential increase strictly linearly with incident light frequency.',
  },
  {
    id: 'exp-d',
    letter: 'D',
    title: 'Experiment D: Compare Metals',
    badge: 'Work Function Comparison',
    objective: 'Test different metals under identical illumination to discover how work function controls photoemission conditions.',
    initialParams: {
      selectedMetalId: 'cesium',
      frequencyHz: 7.5e14,
      intensityPercent: 60,
      appliedVoltage: 0,
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Test Cesium (φ = 2.14 eV)',
        instruction: 'Illuminate Cesium with violet light (f = 7.5×10¹⁴ Hz, 400 nm, E = 3.10 eV). Note that photoelectrons are emitted with K_max = 0.96 eV.',
        targetParams: { selectedMetalId: 'cesium', frequencyHz: 7.5e14, intensityPercent: 60, appliedVoltage: 0 },
        expectedObservation: 'Vigorous photoemission; K_max = 0.96 eV; photocurrent flows.',
        explanation: 'Cesium has a very low work function (2.14 eV), easily liberated by 3.10 eV photons.',
      },
      {
        stepNumber: 2,
        title: 'Switch to Calcium (φ = 2.90 eV)',
        instruction: 'Switch the metal to Calcium without changing the light source. Observe K_max and electron speed.',
        targetParams: { selectedMetalId: 'calcium' },
        expectedObservation: 'Emission still occurs, but K_max drops to 3.10 - 2.90 = 0.20 eV. Electrons are noticeably slower.',
        explanation: 'More photon energy is consumed to overcome Calcium’s higher work function, leaving less for kinetic energy.',
      },
      {
        stepNumber: 3,
        title: 'Switch to Zinc (φ = 4.30 eV)',
        instruction: 'Switch the metal to Zinc (φ = 4.30 eV) under the same 7.5×10¹⁴ Hz violet light.',
        targetParams: { selectedMetalId: 'zinc' },
        expectedObservation: 'Emission stops completely! Photocurrent drops to 0.00 µA.',
        explanation: 'Because 3.10 eV < 4.30 eV, the light can no longer eject electrons from Zinc. Deep UV light (λ < 289 nm) is required.',
      },
    ],
    conclusion: 'Metals with higher work functions require higher threshold frequencies. Conduction electrons bound more tightly leave less residual kinetic energy.',
  },
  {
    id: 'exp-e',
    letter: 'E',
    title: 'Experiment E: Measure Stopping Potential',
    badge: 'eV_stop = K_max',
    objective: 'Apply an opposing retarding electric field to find the exact stopping voltage where photocurrent reaches zero.',
    initialParams: {
      selectedMetalId: 'sodium',
      frequencyHz: 8.0e14,
      intensityPercent: 50,
      appliedVoltage: 2.0,
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Begin with Positive Accelerating Voltage',
        instruction: 'Set Sodium (φ = 2.28 eV, f = 8.0×10¹⁴ Hz, K_max = 1.03 eV) with V = +2.0 V. Observe that photocurrent is near saturation (~5.0 µA).',
        targetParams: { selectedMetalId: 'sodium', frequencyHz: 8.0e14, intensityPercent: 50, appliedVoltage: 2.0 },
        expectedObservation: 'All emitted electrons are pulled towards the positive collector plate; current is stable.',
        explanation: 'Positive collector voltage accelerates electrons and maximizes collection.',
      },
      {
        stepNumber: 2,
        title: 'Apply Retarding Voltage (V = -0.5 V)',
        instruction: 'Slide voltage into the negative retarding region (V = -0.50 V). Notice that photocurrent decreases.',
        targetParams: { appliedVoltage: -0.5 },
        expectedObservation: 'Photocurrent decreases significantly. Slower electrons are turned back before reaching the collector.',
        explanation: 'The retarding electric field does negative work W = -e|V| on the electrons. Only electrons with initial KE > 0.50 eV reach the anode.',
      },
      {
        stepNumber: 3,
        title: 'Reach Stopping Potential (V = -1.03 V)',
        instruction: 'Set voltage to -1.03 V (matching -V_stop). Observe the ammeter reading.',
        targetParams: { appliedVoltage: -1.03 },
        expectedObservation: 'Photocurrent reaches exactly 0.00 µA! Even the fastest emitted photoelectrons are stopped and turned back.',
        explanation: 'At V = -V_stop, e V_stop = K_max. Measuring V_stop provides an accurate direct measurement of maximum kinetic energy.',
      },
    ],
    conclusion: 'The retarding stopping potential V_stop directly measures maximum electron kinetic energy: K_max = e V_stop.',
  },
];

// ============================================================================
// 8. 14 RIGOROUS QUIZ QUESTIONS (Section 16)
// ============================================================================
export const PHOTOELECTRIC_QUIZ_QUESTIONS: PhotoelectricQuizQuestion[] = [
  {
    id: 1,
    question: 'What is the photoelectric effect?',
    options: [
      'The emission of electrons from a metal surface when light of suitable frequency strikes it',
      'The conversion of electrical current into coherent monochromatic laser light',
      'The deflection of cathode ray particles by an external magnetic field',
      'The scattering of X-rays by graphite carbon atoms',
    ],
    correctIndex: 0,
    explanation: 'The photoelectric effect is the emission of electrons (photoelectrons) from a material (typically a metal) when illuminated by electromagnetic radiation with frequency at or above a characteristic threshold.',
  },
  {
    id: 2,
    question: 'According to Einstein’s equation hf = φ + K_max, what does the symbol φ (phi) represent?',
    options: [
      'The phase angle of the incident light wave',
      'The work function of the metal (minimum energy required to eject an electron)',
      'The electrostatic potential of the collector anode',
      'The luminous flux of the light source',
    ],
    correctIndex: 1,
    explanation: 'The work function φ is the minimum energy required to liberate the least tightly bound conduction electron from the surface of a metal.',
  },
  {
    id: 3,
    question: 'What happens if the frequency f of incident light is less than the threshold frequency f_0 of the metal?',
    options: [
      'Electrons are emitted with negative kinetic energy',
      'Electrons are emitted after a long time delay of several hours',
      'No photoelectric emission occurs, regardless of how intense or bright the light is',
      'Electrons are emitted only if accelerating voltage is greater than 100 V',
    ],
    correctIndex: 2,
    explanation: 'In the one-photon quantum model, energy exchange is strictly one photon to one electron. If hf < φ, no individual photon has sufficient energy to liberate an electron, so increasing intensity simply supplies more sub-threshold photons.',
  },
  {
    id: 4,
    question: 'If the intensity of incident light (with f > f_0) is doubled while frequency remains constant, what happens to the maximum kinetic energy K_max?',
    options: [
      'It doubles',
      'It quadruples (increases 4×)',
      'It remains strictly unchanged',
      'It decreases by half',
    ],
    correctIndex: 2,
    explanation: 'K_max depends strictly on photon energy and work function: K_max = hf - φ. Because frequency f and work function φ have not changed, individual photon energy is identical, so K_max remains completely constant.',
  },
  {
    id: 5,
    question: 'If the intensity of incident light (with f > f_0) is doubled, what happens to the saturation photocurrent?',
    options: [
      'It remains unchanged',
      'It doubles, because twice as many photons strike the surface per second',
      'It drops to zero',
      'It increases quadratically',
    ],
    correctIndex: 1,
    explanation: 'Light intensity is proportional to photon flux. Doubling intensity doubles the number of photons hitting the cathode each second, liberating twice as many photoelectrons per second and doubling saturation photocurrent.',
  },
  {
    id: 6,
    question: 'What is the stopping potential V_stop?',
    options: [
      'The positive voltage required to pull all electrons to the anode',
      'The minimum negative retarding potential applied to the collector that reduces photocurrent to exactly zero',
      'The breakdown voltage of the vacuum tube',
      'The work function divided by Planck’s constant',
    ],
    correctIndex: 1,
    explanation: 'The stopping potential V_stop is the negative retarding voltage that just prevents even the most energetic emitted photoelectrons from reaching the collector plate: e V_stop = K_max.',
  },
  {
    id: 7,
    question: 'What is the slope of the graph of Maximum Kinetic Energy K_max (in Joules) versus incident frequency f (in Hz)?',
    options: [
      'The metal work function φ',
      'Planck’s constant h',
      'The speed of light c',
      'The elementary charge e',
    ],
    correctIndex: 1,
    explanation: 'Differentiating Einstein’s equation K_max = hf - φ with respect to frequency gives d(K_max)/df = h. Therefore, the slope of the line is universally equal to Planck’s constant h (or h/e if energy is plotted in eV).',
  },
  {
    id: 8,
    question: 'A metal has a work function of 2.50 eV. Light of photon energy 4.00 eV shines on it. What is the stopping potential magnitude?',
    options: [
      '1.50 V',
      '2.50 V',
      '4.00 V',
      '6.50 V',
    ],
    correctIndex: 0,
    explanation: 'K_max = E_photon - φ = 4.00 eV - 2.50 eV = 1.50 eV. Since e V_stop = K_max, the stopping potential magnitude is V_stop = 1.50 V.',
  },
  {
    id: 9,
    question: 'Why is there virtually no measurable time lag (less than 10⁻⁹ seconds) between the arrival of light and the emission of photoelectrons?',
    options: [
      'Electrons absorb continuous wave energy over a large surface area simultaneously',
      'A photon delivers its entire concentrated quantum of energy to a single electron in an instantaneous absorption',
      'Electrons are accelerated by gravitational attraction',
      'Thermal heating causes delayed thermionic emission',
    ],
    correctIndex: 1,
    explanation: 'Classical wave theory predicted hours of delay for a single electron to accumulate enough wave energy. In quantum mechanics, a photon transfers its full energy hf instantaneously upon absorption.',
  },
  {
    id: 10,
    question: 'What is the relationship between threshold frequency f_0 and threshold wavelength λ_0?',
    options: [
      'λ_0 = c · f_0',
      'λ_0 = c / f_0',
      'λ_0 = f_0 / c',
      'λ_0 = h / (m · f_0)',
    ],
    correctIndex: 1,
    explanation: 'Because c = f · λ for all electromagnetic waves, the threshold wavelength is λ_0 = c / f_0. Photoemission occurs only for wavelengths λ ≤ λ_0.',
  },
  {
    id: 11,
    question: 'Can increasing light intensity produce photoelectrons when frequency is below the threshold frequency in the standard one-photon model?',
    options: [
      'Yes, if intensity exceeds 90%',
      'Yes, after waiting several minutes',
      'No, because each photon still lacks sufficient energy to overcome the work function',
      'Yes, if the voltage is set to zero',
    ],
    correctIndex: 2,
    explanation: 'In the standard one-photon photoelectric model, photoemission requires E_photon = hf ≥ φ. Increasing intensity increases photon quantity, but does not increase individual photon energy.',
  },
  {
    id: 12,
    question: 'What is the fundamental physical difference between light frequency and light intensity in the photon model?',
    options: [
      'Frequency determines the number of photons; intensity determines photon energy',
      'Frequency determines individual photon energy (E = hf); intensity determines photon arrival rate (photon flux)',
      'They are identical physical quantities with different units',
      'Frequency applies only to visible light, while intensity applies only to ultraviolet radiation',
    ],
    correctIndex: 1,
    explanation: 'Frequency f determines the energy of each individual photon (E = hf), while intensity determines the number of photons passing through a unit area per second (photon flux).',
  },
  {
    id: 13,
    question: 'In an experimental I-V curve, what does the intercept on the negative voltage axis represent?',
    options: [
      'The threshold frequency',
      'The negative stopping potential (-V_stop)',
      'The dielectric breakdown voltage',
      'The saturation photocurrent',
    ],
    correctIndex: 1,
    explanation: 'The negative voltage at which the photocurrent curve reaches zero is the stopping potential -V_stop, where the opposing electric retarding field stops even the fastest photoelectrons.',
  },
  {
    id: 14,
    question: 'For which discovery was Albert Einstein awarded the 1921 Nobel Prize in Physics?',
    options: [
      'The General Theory of Relativity and curved spacetime',
      'The Special Theory of Relativity and mass-energy equivalence (E = mc²)',
      'His explanation of the law of the photoelectric effect and light quantum hypothesis',
      'The discovery of nuclear fission',
    ],
    correctIndex: 2,
    explanation: 'Albert Einstein was awarded the 1921 Nobel Prize in Physics specifically "for his services to Theoretical Physics, and especially for his discovery of the law of the photoelectric effect."',
  },
];
