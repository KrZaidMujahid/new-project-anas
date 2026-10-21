/**
 * EQUATION 1 — Double-Slit Experiment Physics Engine
 * Rigorous wave-optics computations:
 * - Fraunhofer diffraction envelope: sinc^2(beta)
 * - N-slit interference: (sin(N*alpha)/sin(alpha))^2 (reduces to cos^2(alpha) for N=2)
 * - Path difference Delta x = d * sin(theta) and phase difference Delta phi = (2pi/lambda)*Delta x
 * - Missing orders condition: d/a = m/p
 * - Dispersion and immersion in dielectric media: lambda' = lambda / n
 * - Quantum photon generation from probability density P(y) proportional to I(y)
 * - Accurate CIE visible spectrum color conversion
 */

import {
  DoubleSlitParameters,
  DoubleSlitPhysicsResults,
  DetectorAnalysis,
  MissingOrderInfo,
  WavelengthPreset,
  FringeTableEntry,
} from './types';

export const SPEED_OF_LIGHT = 299792458; // m/s
export const PLANCK_CONSTANT = 6.62607015e-34; // J*s
export const EV_PER_JOULE = 1 / 1.602176634e-19;

export const WAVELENGTH_PRESETS: WavelengthPreset[] = [
  { name: 'Violet Laser', wavelengthNm: 405, colorName: '#8B5CF6', sourceType: 'GaN Diode' },
  { name: 'Blue Laser', wavelengthNm: 450, colorName: '#3B82F6', sourceType: 'InGaN Laser' },
  { name: 'Cyan Gas Laser', wavelengthNm: 488, colorName: '#06B6D4', sourceType: 'Argon-Ion' },
  { name: 'Green DPSS Laser', wavelengthNm: 532, colorName: '#22C55E', sourceType: 'Nd:YAG Doubled' },
  { name: 'Yellow Sodium D-line', wavelengthNm: 589, colorName: '#EAB308', sourceType: 'Na Vapor' },
  { name: 'Orange He-Ne', wavelengthNm: 612, colorName: '#F97316', sourceType: 'He-Ne Gas' },
  { name: 'Red He-Ne Standard', wavelengthNm: 632.8, colorName: '#EF4444', sourceType: 'Laboratory Standard' },
  { name: 'Deep Red Diode', wavelengthNm: 670, colorName: '#DC2626', sourceType: 'AlGaInP Diode' },
];

/**
 * Converts a visible light wavelength in nanometers (380 - 750 nm)
 * to an approximate sRGB hex code and glow style.
 */
export function wavelengthToRGB(wavelengthNm: number): { hex: string; rgba: (alpha: number) => string } {
  let r = 0;
  let g = 0;
  let b = 0;

  const wl = wavelengthNm;

  if (wl >= 380 && wl < 440) {
    r = -(wl - 440) / (440 - 380);
    g = 0.0;
    b = 1.0;
  } else if (wl >= 440 && wl < 490) {
    r = 0.0;
    g = (wl - 440) / (490 - 440);
    b = 1.0;
  } else if (wl >= 490 && wl < 510) {
    r = 0.0;
    g = 1.0;
    b = -(wl - 510) / (510 - 490);
  } else if (wl >= 510 && wl < 580) {
    r = (wl - 510) / (580 - 510);
    g = 1.0;
    b = 0.0;
  } else if (wl >= 580 && wl < 645) {
    r = 1.0;
    g = -(wl - 645) / (645 - 580);
    b = 0.0;
  } else if (wl >= 645 && wl <= 780) {
    r = 1.0;
    g = 0.0;
    b = 0.0;
  }

  // Intensity factor drops near human vision limits (380-420 nm and 700-780 nm)
  let factor = 1.0;
  if (wl >= 380 && wl < 420) {
    factor = 0.3 + 0.7 * (wl - 380) / (420 - 380);
  } else if (wl >= 700 && wl <= 780) {
    factor = 0.3 + 0.7 * (780 - wl) / (780 - 700);
  }

  const gamma = 0.8;
  const red = Math.round(255 * Math.pow(Math.max(0, r * factor), gamma));
  const green = Math.round(255 * Math.pow(Math.max(0, g * factor), gamma));
  const blue = Math.round(255 * Math.pow(Math.max(0, b * factor), gamma));

  const hex = `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
  return {
    hex,
    rgba: (alpha: number) => `rgba(${red}, ${green}, ${blue}, ${alpha})`,
  };
}

/**
 * Evaluates the normalized optical intensity at a screen coordinate y (meters).
 * Supports:
 * - Single slit: sinc^2(beta)
 * - Double slit: sinc^2(beta) * cos^2(alpha)
 * - Which-way detector: destroys interference => sinc^2(beta) (sum of classical single-slit intensities)
 * - N slits: sinc^2(beta) * [sin(N*alpha)/(N*sin(alpha))]^2
 */
export function calculateIntensityAtY(
  yM: number,
  params: DoubleSlitParameters
): {
  intensity: number; // 0 to 1
  diffractionFactor: number; // sinc^2(beta)
  interferenceFactor: number; // cos^2(alpha) or N-slit term
  thetaRad: number;
  pathDifferenceNm: number;
  phaseDifferenceRad: number;
} {
  const D = params.screenDistanceM;
  const lambdaM = (params.wavelengthNm * 1e-9) / params.mediumRefractiveIndex;
  const dM = params.slitSeparationMm * 1e-3;
  const aM = params.slitWidthMm * 1e-3;

  // Exact angle theta: tan(theta) = y / D => sin(theta) = y / sqrt(y^2 + D^2)
  const sinTheta = yM / Math.sqrt(yM * yM + D * D);
  const thetaRad = Math.atan2(yM, D);

  // Single-slit diffraction parameter beta = (pi * a * sin(theta)) / lambda
  const beta = (Math.PI * aM * sinTheta) / lambdaM;
  let diffractionFactor = 1.0;
  if (params.pureInterferenceMode) {
    // Mode 2 from Part 13: Double-slit interference without a finite-width envelope
    diffractionFactor = 1.0;
  } else if (Math.abs(beta) < 1e-7) {
    diffractionFactor = 1.0;
  } else {
    diffractionFactor = Math.pow(Math.sin(beta) / beta, 2);
  }

  // Double-slit phase parameter alpha = (pi * d * sin(theta)) / lambda
  const alpha = (Math.PI * dM * sinTheta) / lambdaM;
  const pathDifferenceM = dM * sinTheta;
  const pathDifferenceNm = pathDifferenceM * 1e9;
  const phaseDifferenceRad = 2 * alpha;

  let interferenceFactor = 1.0;

  // If both slits are closed
  if (!params.slit1Open && !params.slit2Open) {
    return {
      intensity: 0,
      diffractionFactor: 0,
      interferenceFactor: 0,
      thetaRad,
      pathDifferenceNm: 0,
      phaseDifferenceRad: 0,
    };
  }

  // If only one slit is open, pure single slit diffraction from that slit
  if ((params.slit1Open && !params.slit2Open) || (!params.slit1Open && params.slit2Open)) {
    return {
      intensity: 0.25 * diffractionFactor,
      diffractionFactor,
      interferenceFactor: 0.25,
      thetaRad,
      pathDifferenceNm: 0,
      phaseDifferenceRad: 0,
    };
  }

  // If which-way detector is ON: quantum measurement collapses phase coherence!
  // Intensities add classically: I = I_1 + I_2 = 2 * (1/4) * sinc^2(beta) = 0.5 * sinc^2(beta)
  if (params.quantumMode && params.whichWayDetector) {
    interferenceFactor = 0.5;
    return {
      intensity: 0.5 * diffractionFactor,
      diffractionFactor,
      interferenceFactor: 0.5,
      thetaRad,
      pathDifferenceNm,
      phaseDifferenceRad,
    };
  }

  // Standard coherence mode
  if (params.slitMode === 'single') {
    interferenceFactor = 1.0;
    return {
      intensity: diffractionFactor,
      diffractionFactor,
      interferenceFactor: 1.0,
      thetaRad,
      pathDifferenceNm: 0,
      phaseDifferenceRad: 0,
    };
  }

  if (params.slitMode === 'double') {
    if (params.coherence === 'incoherent') {
      interferenceFactor = 0.5;
    } else if (params.coherence === 'partially_coherent') {
      // Partial fringe visibility V = 0.5
      interferenceFactor = 0.5 * (1 + 0.5 * Math.cos(phaseDifferenceRad));
    } else {
      // Fully coherent Young's interference: cos^2(alpha)
      interferenceFactor = Math.pow(Math.cos(alpha), 2);
    }
    const total = diffractionFactor * interferenceFactor;
    return {
      intensity: Math.max(0, Math.min(1, total)),
      diffractionFactor,
      interferenceFactor,
      thetaRad,
      pathDifferenceNm,
      phaseDifferenceRad,
    };
  }

  // Multi-slit N = 3, 5, or grating (N=10)
  const N = params.slitMode === 'three' ? 3 : params.slitMode === 'five' ? 5 : 10;
  if (Math.abs(Math.sin(alpha)) < 1e-6) {
    interferenceFactor = 1.0;
  } else {
    interferenceFactor = Math.pow(Math.sin(N * alpha) / (N * Math.sin(alpha)), 2);
  }

  const multiTotal = diffractionFactor * interferenceFactor;
  return {
    intensity: Math.max(0, Math.min(1, multiTotal)),
    diffractionFactor,
    interferenceFactor,
    thetaRad,
    pathDifferenceNm,
    phaseDifferenceRad,
  };
}

/**
 * Calculates complete physics metrics and detector analysis for the Double-Slit Laboratory.
 */
export function computeDoubleSlitPhysics(params: DoubleSlitParameters): DoubleSlitPhysicsResults {
  const n = Math.max(1.0, params.mediumRefractiveIndex);
  const effectiveWavelengthNm = params.wavelengthNm / n;
  const effectiveWavelengthM = effectiveWavelengthNm * 1e-9;
  const dM = params.slitSeparationMm * 1e-3;
  const aM = params.slitWidthMm * 1e-3;
  const DM = params.screenDistanceM;

  // Wave electrodynamics
  const frequencyHz = SPEED_OF_LIGHT / (params.wavelengthNm * 1e-9);
  const frequencyThz = frequencyHz / 1e12;
  const photonEnergyJ = (PLANCK_CONSTANT * SPEED_OF_LIGHT) / (params.wavelengthNm * 1e-9);
  const photonEnergyEv = photonEnergyJ * EV_PER_JOULE;

  // Fringe metrics (beta = lambda * D / d)
  const fringeWidthM = (effectiveWavelengthM * DM) / dM;
  const fringeWidthMm = fringeWidthM * 1000;

  // Angular fringe separation Delta theta = lambda / d
  const angularFringeSeparationRad = effectiveWavelengthM / dM;
  const angularFringeSeparationMrad = angularFringeSeparationRad * 1000;
  const angularFringeSeparationDeg = (angularFringeSeparationRad * 180) / Math.PI;

  // Central diffraction peak width (2 * lambda * D / a)
  const centralDiffractionWidthM = (2 * effectiveWavelengthM * DM) / aM;
  const centralDiffractionWidthMm = centralDiffractionWidthM * 1000;
  const firstDiffractionZeroAngleRad = effectiveWavelengthM / aM;
  const firstDiffractionZeroAngleDeg = (firstDiffractionZeroAngleRad * 180) / Math.PI;

  // Number of interference fringes inside central diffraction envelope
  const fringesInCentralMax = Math.round((2 * dM) / aM);
  const daRatio = dM / aM;

  // Missing orders: d / a = m / p => m = p * (d/a)
  const missingOrders: MissingOrderInfo[] = [];
  const roundedRatio = Math.round(daRatio);
  const isIntegerRatio = Math.abs(daRatio - roundedRatio) < 0.05;

  if (isIntegerRatio && roundedRatio >= 1) {
    for (let p = 1; p <= 4; p++) {
      const m = p * roundedRatio;
      const angleRad = Math.asin(Math.min(0.999, (m * effectiveWavelengthM) / dM));
      const yM = DM * Math.tan(angleRad);
      missingOrders.push({
        m,
        p,
        angleDeg: (angleRad * 180) / Math.PI,
        yMm: yM * 1000,
      });
    }
  }

  // Detector cursor analysis
  const yM = params.detectorYMm * 1e-3;
  const pointCalc = calculateIntensityAtY(yM, params);

  const pathDiffLambda = pointCalc.pathDifferenceNm / effectiveWavelengthNm;
  const nearestBrightOrder = Math.round(pathDiffLambda);
  const nearestDarkOrder = Math.round(pathDiffLambda - 0.5);

  let condition: DetectorAnalysis['condition'] = 'intermediate';
  if (Math.abs(params.detectorYMm) < 0.05) {
    condition = 'central_max';
  } else if (pointCalc.diffractionFactor < 0.01) {
    condition = 'diffraction_zero';
  } else if (Math.abs(pathDiffLambda - nearestBrightOrder) < 0.05) {
    condition = 'bright_max';
  } else if (Math.abs(pathDiffLambda - (nearestDarkOrder + 0.5)) < 0.05) {
    condition = 'dark_min';
  }

  const isMissingOrder = missingOrders.some(
    (mo) => Math.abs(mo.m - Math.abs(nearestBrightOrder)) === 0 && Math.abs(params.detectorYMm - mo.yMm) < fringeWidthMm * 0.3
  );

  // Phasor components: E1 at angle 0, E2 at angle delta phi
  const e1 = { x: 1, y: 0 };
  const e2 = {
    x: Math.cos(pointCalc.phaseDifferenceRad),
    y: Math.sin(pointCalc.phaseDifferenceRad),
  };
  const resultantX = e1.x + e2.x;
  const resultantY = e1.y + e2.y;
  const resultantMag = Math.sqrt(resultantX * resultantX + resultantY * resultantY);
  const resultantAngleRad = Math.atan2(resultantY, resultantX);

  const detector: DetectorAnalysis = {
    yMm: params.detectorYMm,
    thetaRad: pointCalc.thetaRad,
    thetaDeg: (pointCalc.thetaRad * 180) / Math.PI,
    pathDifferenceNm: pointCalc.pathDifferenceNm,
    pathDifferenceWavelengths: pathDiffLambda,
    phaseDifferenceRad: pointCalc.phaseDifferenceRad,
    phaseDifferenceDeg: (pointCalc.phaseDifferenceRad * 180) / Math.PI,
    interferenceFactor: pointCalc.interferenceFactor,
    diffractionFactor: pointCalc.diffractionFactor,
    normalizedIntensity: pointCalc.intensity,
    condition,
    nearestBrightOrder,
    nearestDarkOrder,
    isMissingOrder,
    phasorE1: e1,
    phasorE2: e2,
    phasorResultant: {
      x: resultantX,
      y: resultantY,
      magnitude: resultantMag,
      angleRad: resultantAngleRad,
    },
  };

  const colorInfo = wavelengthToRGB(params.wavelengthNm);

  return {
    effectiveWavelengthNm,
    frequencyThz,
    photonEnergyEv,
    fringeWidthMm,
    angularFringeSeparationMrad,
    angularFringeSeparationDeg,
    centralDiffractionWidthMm,
    firstDiffractionZeroAngleDeg,
    fringesInCentralMax,
    daRatio,
    missingOrders,
    detector,
    rgbColor: colorInfo.hex,
    glowColor: colorInfo.rgba(0.4),
  };
}

/**
 * Samples a photon y-coordinate based on the normalized intensity PDF.
 * Uses rejection sampling within the screen range [-screenHalfSpanMm, +screenHalfSpanMm].
 */
export function samplePhotonHit(
  params: DoubleSlitParameters,
  screenHalfSpanMm: number = 30
): number {
  const maxAttempts = 80;
  for (let i = 0; i < maxAttempts; i++) {
    const candidateYMm = (Math.random() * 2 - 1) * screenHalfSpanMm;
    const { intensity } = calculateIntensityAtY(candidateYMm * 1e-3, params);
    if (Math.random() < intensity) {
      return candidateYMm;
    }
  }
  // Fallback
  return (Math.random() * 2 - 1) * (screenHalfSpanMm * 0.2);
}

/**
 * Default parameters conforming strictly to user specification requirements:
 * λ = 550 nm, d = 0.25 mm, a = 0.05 mm, L = 2.0 m, Intensity = 70%
 */
export const DEFAULT_DOUBLE_SLIT_PARAMS: DoubleSlitParameters = {
  wavelengthNm: 550,
  isWhiteLight: false,
  coherence: 'coherent',
  slitSeparationMm: 0.25,
  slitWidthMm: 0.05,
  screenDistanceM: 2.0,
  slitMode: 'double',
  slit1Open: true,
  slit2Open: true,
  mediumPreset: 'air',
  mediumRefractiveIndex: 1.0,
  intensityPercent: 70,
  quantumMode: false,
  whichWayDetector: false,
  photonEmissionRate: 60,
  showWaveField: true,
  showRays: true,
  showIntensityGraph: true,
  showEnvelope: true,
  showFringes: true,
  showGrid: true,
  showPhasor: true,
  showCentralMarker: true,
  showFringeLabels: true,
  showIntensityScale: true,
  pureInterferenceMode: false,
  detectorYMm: 0.0,
};

/**
 * Computes live table entries for bright fringes from m = -5 to +5,
 * along with intermediate dark fringes.
 * Far-field approximation: y_m = m * lambda * L / d
 * Dark fringes: y_dark = (m + 0.5) * lambda * L / d
 */
export function generateFringeOrdersTable(params: DoubleSlitParameters): FringeTableEntry[] {
  const n = Math.max(1.0, params.mediumRefractiveIndex);
  const lambdaM = (params.wavelengthNm * 1e-9) / n;
  const dM = params.slitSeparationMm * 1e-3;
  const LM = params.screenDistanceM;

  const entries: FringeTableEntry[] = [];

  for (let m = -5; m <= 5; m++) {
    // Bright fringe
    const yBrightM = (m * lambdaM * LM) / dM;
    const yBrightMm = yBrightM * 1000;
    const pathDiffNm = Math.abs(m) * (params.wavelengthNm / n);
    const phaseDiffDeg = Math.abs(m) * 360;

    // Calculate theoretical intensity from combined equation
    const calc = calculateIntensityAtY(yBrightM, params);

    entries.push({
      order: m,
      type: m === 0 ? 'central' : 'bright',
      orderLabel: m === 0 ? 'Central Max (m=0)' : `Bright (m=${m > 0 ? `+${m}` : m})`,
      yMm: yBrightMm,
      pathDiffNm,
      phaseDiffDeg,
      theoreticalIntensity: calc.intensity,
    });

    // Dark fringe following m (for m from -5 to +4)
    if (m < 5) {
      const darkOrder = m + 0.5;
      const yDarkM = (darkOrder * lambdaM * LM) / dM;
      const yDarkMm = yDarkM * 1000;
      const darkPathDiffNm = Math.abs(darkOrder) * (params.wavelengthNm / n);
      const darkPhaseDiffDeg = Math.abs(darkOrder) * 360;
      const darkCalc = calculateIntensityAtY(yDarkM, params);

      entries.push({
        order: darkOrder,
        type: 'dark',
        orderLabel: `Dark Min (m=${darkOrder > 0 ? `+${darkOrder}` : darkOrder})`,
        yMm: yDarkMm,
        pathDiffNm: darkPathDiffNm,
        phaseDiffDeg: darkPhaseDiffDeg,
        theoreticalIntensity: darkCalc.intensity,
      });
    }
  }

  // Sort by yMm ascending
  return entries.sort((a, b) => a.yMm - b.yMm);
}

