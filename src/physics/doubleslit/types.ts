/**
 * EQUATION 1 — Double-Slit Experiment Laboratory Types
 * Comprehensive data types for Young's Double-Slit Experiment,
 * wave optics, diffraction envelope modulation, and quantum photon accumulation.
 */

export type SourceCoherence = 'coherent' | 'partially_coherent' | 'incoherent';

export type OpticalMediumPreset = 'vacuum' | 'air' | 'water' | 'glass';

export type ApparatusSlitMode = 'single' | 'double' | 'three' | 'five' | 'grating';

export interface DoubleSlitParameters {
  // Optical source
  wavelengthNm: number; // 380 nm to 750 nm (e.g. 532 nm)
  isWhiteLight: boolean; // Polychromatic white light source
  coherence: SourceCoherence;

  // Slit geometry
  slitSeparationMm: number; // d: 0.05 mm to 2.00 mm (e.g. 0.25 mm)
  slitWidthMm: number; // a: 0.01 mm to 0.40 mm (e.g. 0.04 mm)
  screenDistanceM: number; // D: 0.3 m to 3.0 m (e.g. 1.2 m)
  slitMode: ApparatusSlitMode;
  slit1Open: boolean;
  slit2Open: boolean;

  // Medium
  mediumPreset: OpticalMediumPreset;
  mediumRefractiveIndex: number; // n >= 1.0 (e.g. 1.0003, 1.333, 1.52)

  // Quantum / Particle mode
  quantumMode: boolean; // Photon-by-photon accumulation
  whichWayDetector: boolean; // Observer measurement at slits (destroys interference)
  photonEmissionRate: number; // photons / sec (10 to 500)

  // Light intensity (0% to 100%, default 70%)
  intensityPercent: number;

  // Display toggles
  showWaveField: boolean; // 2D Huygens wave interference ripples
  showRays: boolean; // Geometric ray paths to detector
  showIntensityGraph: boolean; // 1D curve I(y)
  showEnvelope: boolean; // Single-slit diffraction envelope curve
  showFringes: boolean; // Screen photographic fringe projection
  showGrid: boolean; // Screen measurement grid
  showPhasor: boolean; // Phasor diagram for selected point
  showCentralMarker: boolean;
  showFringeLabels: boolean; // Toggle: Show labels on bright fringes (m = 0, ±1, etc.)
  showIntensityScale: boolean; // Toggle: Show intensity scale along graph / screen
  pureInterferenceMode: boolean; // Toggle: Idealized double slit without diffraction envelope

  // Detector cursor position on the screen
  detectorYMm: number; // -30 mm to +30 mm
}

export interface FringeTableEntry {
  order: number;
  type: 'central' | 'bright' | 'dark';
  orderLabel: string;
  yMm: number;
  pathDiffNm: number;
  phaseDiffDeg: number;
  theoreticalIntensity: number; // 0 to 1
}

export interface DetectorAnalysis {
  yMm: number;
  thetaRad: number;
  thetaDeg: number;
  pathDifferenceNm: number;
  pathDifferenceWavelengths: number; // Delta x / lambda
  phaseDifferenceRad: number;
  phaseDifferenceDeg: number;
  interferenceFactor: number; // cos^2(alpha)
  diffractionFactor: number; // sinc^2(beta)
  normalizedIntensity: number; // 0 to 1
  condition:
    | 'central_max'
    | 'bright_max'
    | 'dark_min'
    | 'diffraction_zero'
    | 'intermediate';
  nearestBrightOrder: number;
  nearestDarkOrder: number;
  isMissingOrder: boolean;
  phasorE1: { x: number; y: number };
  phasorE2: { x: number; y: number };
  phasorResultant: { x: number; y: number; magnitude: number; angleRad: number };
}

export interface MissingOrderInfo {
  m: number; // Interference order
  p: number; // Diffraction zero order
  angleDeg: number;
  yMm: number;
}

export interface DoubleSlitPhysicsResults {
  // Wavelength in medium
  effectiveWavelengthNm: number;
  frequencyThz: number;
  photonEnergyEv: number;

  // Fringe metrics
  fringeWidthMm: number; // beta = lambda * D / d
  angularFringeSeparationMrad: number; // Delta theta = lambda / d
  angularFringeSeparationDeg: number;

  // Diffraction metrics
  centralDiffractionWidthMm: number; // 2 * lambda * D / a
  firstDiffractionZeroAngleDeg: number; // theta = lambda / a
  fringesInCentralMax: number; // 2 * d / a

  // Ratio and missing orders
  daRatio: number; // d / a
  missingOrders: MissingOrderInfo[];

  // Detector point metrics
  detector: DetectorAnalysis;

  // Color rendering
  rgbColor: string;
  glowColor: string;
}

export interface WavelengthPreset {
  name: string;
  wavelengthNm: number;
  colorName: string;
  sourceType: string;
}

export interface PhotonHit {
  id: number;
  yMm: number;
  timestamp: number;
}
