/**
 * EQUATION 1 — Bohr Hydrogen Model Types & Interfaces
 * Quantized states, atomic transitions, spectral series, observations, and quiz questions.
 */

export type PrincipalQuantumNumber = 1 | 2 | 3 | 4 | 5 | 6;

export type TransitionType = 'absorption' | 'emission';

export type SpectralSeriesName = 'Lyman' | 'Balmer' | 'Paschen' | 'Brackett' | 'Pfund';

export type SpectralRegion = 'ultraviolet' | 'visible' | 'infrared';

export interface BohrEnergyLevel {
  n: PrincipalQuantumNumber;
  label: string;
  energyEV: number; // E_n = -13.6 / n^2 eV
  energyJoules: number; // E_n in J
  radiusMeters: number; // r_n = a_0 * n^2
  radiusAngstroms: number; // r_n in Å
  speedMetersPerSec: number; // v_n = α * c / n
  speedFractionOfC: number; // v_n / c
}

export interface ElectronTransition {
  initialLevel: PrincipalQuantumNumber;
  finalLevel: PrincipalQuantumNumber;
  type: TransitionType; // n_i < n_f -> absorption; n_i > n_f -> emission
  deltaEnergyEV: number; // |E_f - E_i| > 0
  deltaEnergyJoules: number; // ΔE in Joules
  frequencyHz: number; // f = ΔE_J / h
  wavelengthMeters: number; // λ = c / f
  wavelengthNM: number; // λ in nm
  rydbergWavelengthNM: number; // 1/λ = R_H (1/n_f^2 - 1/n_i^2)
  rydbergAgreementPercent: number; // percentage agreement between Bohr and Rydberg
  spectralSeries?: SpectralSeriesName;
  spectralRegion: SpectralRegion;
  visibleColorHex?: string; // Hex color if visible (380-750 nm), undefined otherwise
  isHAlpha?: boolean; // n=3 -> n=2 (656.3 nm)
  isHBeta?: boolean; // n=4 -> n=2 (486.1 nm)
  isHGamma?: boolean; // n=5 -> n=2 (434.0 nm)
  isHDelta?: boolean; // n=6 -> n=2 (410.2 nm)
}

export interface BohrObservation {
  id: string;
  timestamp: number;
  initialLevel: PrincipalQuantumNumber;
  finalLevel: PrincipalQuantumNumber;
  type: TransitionType;
  initialEnergyEV: number;
  finalEnergyEV: number;
  photonEnergyEV: number;
  wavelengthNM: number;
  frequencyHz: number;
  spectralSeries?: SpectralSeriesName;
  spectralRegion: SpectralRegion;
  notes?: string;
}

export interface BohrPreset {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  initialLevel: PrincipalQuantumNumber;
  finalLevel: PrincipalQuantumNumber;
  isTransition: boolean;
  category: 'State' | 'Balmer Line' | 'Lyman Line' | 'Ionization';
}
