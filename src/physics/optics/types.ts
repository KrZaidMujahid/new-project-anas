/**
 * EQUATION 1 — Optics & Snell's Law Laboratory Types
 * Comprehensive data types for geometrical and physical optics simulation.
 */

export type OpticalGeometry =
  | 'planar'      // Single horizontal boundary between medium 1 and medium 2
  | 'slab'        // Rectangular parallel slab of thickness t
  | 'prism'       // Triangular prism with apex angle A
  | 'semicircle'  // Semicircular glass block (radial rays for TIR demonstration)
  | 'fiber';      // Optical fiber core & cladding demonstrating total internal reflection

export interface OpticalMedium {
  id: string;
  name: string;
  formulaSymbol: string;
  refractiveIndex: number; // At Sodium D-line 589.3 nm
  cauchyB?: number;       // Cauchy dispersion parameter B (in µm²)
  description: string;
  colorTint: string;       // Hex or rgba tint for simulation rendering
  speedOfLightKmS: number; // v = c / n in km/s
}

export interface RayPoint {
  x: number;
  y: number;
}

export interface RaySegment {
  id: string;
  type: 'incident' | 'reflected' | 'refracted' | 'internal' | 'emergent' | 'evanescent';
  start: RayPoint;
  end: RayPoint;
  angleWithNormalDeg: number;
  intensity: number; // 0.0 to 1.0 (based on Fresnel coefficients)
  color: string;
  wavelengthNm: number;
  isTIR?: boolean;
}

export interface SnellParameters {
  geometry: OpticalGeometry;
  medium1Id: string;
  medium1CustomN: number;
  medium2Id: string;
  medium2CustomN: number;
  angleDeg: number;            // Angle of incidence with normal (0° to 89.9°)
  wavelengthNm: number;        // 380 nm to 750 nm (default 589 nm)
  isWhiteLight: boolean;       // Split into polychromatic rainbow
  showNormal: boolean;         // Show normal dashed line
  showProtractor: boolean;     // Show interactive angular protractor overlay
  showWavefronts: boolean;     // Show wavefronts (λ1 vs λ2 spacing)
  showRays: boolean;           // Show optical rays
  showIntensityFading: boolean;// Fade reflected/refracted rays by Fresnel coefficients
  showPhotons: boolean;        // Animate photon particle pulses at speeds v1 and v2
  isReversed: boolean;         // Light path reversibility mode
  
  // Geometry specific params
  slabThicknessMm: number;     // Parallel slab thickness (e.g. 50 to 150 mm)
  prismApexAngleDeg: number;   // Prism vertex angle A (e.g. 30° to 75°, default 60°)
  fiberCoreRadiusMm: number;   // Fiber core thickness
  fiberCladdingN: number;      // Cladding refractive index
}

export interface FresnelCoefficients {
  rs: number; // s-polarization reflectance
  rp: number; // p-polarization reflectance
  rUnpolarized: number; // Average reflectance R (0 to 1)
  tUnpolarized: number; // Transmittance T = 1 - R (0 to 1)
}

export interface PlanarOpticsResult {
  n1: number;
  n2: number;
  v1: number;              // m/s
  v2: number;              // m/s
  lambda1Nm: number;       // nm
  lambda2Nm: number;       // nm
  frequencyTHz: number;    // Constant f = c / lambda0
  theta1Deg: number;       // Angle of incidence
  theta1Rad: number;
  thetaRDeg: number;       // Angle of reflection = theta1
  theta2Deg: number | null;// Angle of refraction (null if TIR)
  theta2Rad: number | null;
  criticalAngleDeg: number | null; // null if n1 <= n2
  isTIR: boolean;
  brewsterAngleDeg: number;
  deviationAngleDeg: number | null;
  fresnel: FresnelCoefficients;
  relativeRefractiveIndex21: number; // n2 / n1
}

export interface SlabOpticsResult extends PlanarOpticsResult {
  lateralShiftMm: number;    // d = t * sin(i - r) / cos(r)
  pathLengthInsideMm: number;// L = t / cos(r)
  opticalPathLengthMm: number; // OPL = n2 * L
  timeInsidePicoseconds: number;
}

export interface PrismSpectralRay {
  colorName: string;
  colorHex: string;
  wavelengthNm: number;
  nPrism: number;
  refractionAngle1Deg: number;
  incidentAngle2Deg: number;
  isTIRFace2: boolean;
  emergenceAngleDeg: number | null;
  deviationAngleDeg: number | null;
}

export interface PrismOpticsResult {
  nAir: number;
  nPrismBase: number;
  apexAngleDeg: number;
  incidenceAngleDeg: number;
  refractionAngle1Deg: number;
  incidentAngle2Deg: number;
  isTIRFace2: boolean;
  emergenceAngleDeg: number | null;
  deviationAngleDeg: number | null;
  minimumDeviationAngleDeg: number;
  angleForMinDeviationDeg: number;
  spectralRays: PrismSpectralRay[];
}

export interface FiberOpticsResult {
  nCore: number;
  nClad: number;
  criticalAngleCoreCladDeg: number;
  numericalAperture: number;
  acceptanceAngleDeg: number;
  willPropagate: boolean;
  internalReflectionsCount: number;
}
