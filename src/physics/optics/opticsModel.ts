/**
 * EQUATION 1 — Optics Physics Engine & Snell's Law Computations
 * Scientifically verified equations for reflection, refraction, TIR,
 * Fresnel intensity, dispersion, lateral shift, and prism minimum deviation.
 */

import {
  OpticalMedium,
  SnellParameters,
  PlanarOpticsResult,
  SlabOpticsResult,
  PrismOpticsResult,
  PrismSpectralRay,
  FiberOpticsResult,
  FresnelCoefficients,
} from './types';

export const SPEED_OF_LIGHT_C = 299792458; // m/s

/**
 * Standard Optical Media Database (at Sodium D line 589.3 nm)
 */
export const OPTICAL_MEDIA_DATABASE: OpticalMedium[] = [
  {
    id: 'vacuum',
    name: 'Vacuum',
    formulaSymbol: 'Vac',
    refractiveIndex: 1.0,
    cauchyB: 0,
    description: 'Empty space with absolute maximum speed of light c',
    colorTint: '#07111F00',
    speedOfLightKmS: 299792,
  },
  {
    id: 'air',
    name: 'Air (STP)',
    formulaSymbol: 'Air',
    refractiveIndex: 1.00029,
    cauchyB: 0.00005,
    description: 'Standard atmospheric air at sea level and 0 °C',
    colorTint: '#38BDF80A',
    speedOfLightKmS: 299705,
  },
  {
    id: 'water',
    name: 'Water (20 °C)',
    formulaSymbol: 'H₂O',
    refractiveIndex: 1.333,
    cauchyB: 0.0035,
    description: 'Pure liquid water; common medium for underwater acoustics & optics',
    colorTint: '#38BDF822',
    speedOfLightKmS: 224863,
  },
  {
    id: 'ice',
    name: 'Ice',
    formulaSymbol: 'Ice',
    refractiveIndex: 1.309,
    cauchyB: 0.0032,
    description: 'Solid crystallized water, causes 22° atmospheric halos',
    colorTint: '#A78BFA18',
    speedOfLightKmS: 229024,
  },
  {
    id: 'olive_oil',
    name: 'Olive Oil',
    formulaSymbol: 'Oil',
    refractiveIndex: 1.470,
    cauchyB: 0.0051,
    description: 'Vegetable oil, closely matches pyrex glass refractive index',
    colorTint: '#FBBF2424',
    speedOfLightKmS: 203940,
  },
  {
    id: 'crown_glass',
    name: 'Crown Glass',
    formulaSymbol: 'Glass',
    refractiveIndex: 1.520,
    cauchyB: 0.0042,
    description: 'Standard optical window and spectacle lens glass (BK7)',
    colorTint: '#34D39922',
    speedOfLightKmS: 197232,
  },
  {
    id: 'flint_glass',
    name: 'Flint Glass',
    formulaSymbol: 'Flint',
    refractiveIndex: 1.660,
    cauchyB: 0.0084,
    description: 'High-dispersion lead glass used in achromatic doublets and prisms',
    colorTint: '#FB718524',
    speedOfLightKmS: 180598,
  },
  {
    id: 'zircon',
    name: 'Zircon',
    formulaSymbol: 'ZrSiO₄',
    refractiveIndex: 1.920,
    cauchyB: 0.0110,
    description: 'Natural mineral gemstone with high dispersion and fire',
    colorTint: '#A78BFA28',
    speedOfLightKmS: 156142,
  },
  {
    id: 'diamond',
    name: 'Diamond',
    formulaSymbol: 'C (diam)',
    refractiveIndex: 2.417,
    cauchyB: 0.0135,
    description: 'Extreme optical density with small critical angle (24.4°) creating brilliant sparkle',
    colorTint: '#38BDF833',
    speedOfLightKmS: 124035,
  },
  {
    id: 'silicon',
    name: 'Silicon (Infrared)',
    formulaSymbol: 'Si',
    refractiveIndex: 3.500,
    cauchyB: 0.025,
    description: 'High index semiconductor crystal used in infrared lenses and waveguides',
    colorTint: '#94A3B838',
    speedOfLightKmS: 85655,
  },
  {
    id: 'custom',
    name: 'Custom Medium',
    formulaSymbol: 'n_x',
    refractiveIndex: 1.500,
    cauchyB: 0.0045,
    description: 'User-specified arbitrary refractive index between 1.000 and 4.000',
    colorTint: '#FBBF2420',
    speedOfLightKmS: 199861,
  },
];

/**
 * Returns refractive index of a medium taking into account custom overrides
 * and optional Cauchy wavelength dispersion: n(λ) = n_base + B / λ² (λ in µm).
 */
export function getEffectiveRefractiveIndex(
  mediumId: string,
  customN: number,
  wavelengthNm: number = 589.3,
  enableDispersion: boolean = true
): number {
  const med = OPTICAL_MEDIA_DATABASE.find((m) => m.id === mediumId);
  const baseN = mediumId === 'custom' ? customN : med?.refractiveIndex ?? 1.0;

  if (!enableDispersion) return baseN;

  // Cauchy dispersion formula:
  // n(λ) = n(589nm) + B * ( 1 / λ² - 1 / 0.5893² )
  const b = med?.cauchyB ?? 0.004;
  const lambdaMicrons = wavelengthNm / 1000;
  const lambdaD = 0.5893; // 589.3 nm in microns

  const dispersionDelta = b * (1 / (lambdaMicrons * lambdaMicrons) - 1 / (lambdaD * lambdaD));
  const effectiveN = baseN + dispersionDelta;
  return Math.max(1.0, Math.min(4.5, effectiveN));
}

/**
 * Convert wavelength in nanometers to RGB hex code for visualization.
 */
export function wavelengthToHexColor(wavelengthNm: number): string {
  let r = 0, g = 0, b = 0;

  if (wavelengthNm >= 380 && wavelengthNm < 440) {
    r = -(wavelengthNm - 440) / (440 - 380);
    g = 0.0;
    b = 1.0;
  } else if (wavelengthNm >= 440 && wavelengthNm < 490) {
    r = 0.0;
    g = (wavelengthNm - 440) / (490 - 440);
    b = 1.0;
  } else if (wavelengthNm >= 490 && wavelengthNm < 510) {
    r = 0.0;
    g = 1.0;
    b = -(wavelengthNm - 510) / (510 - 490);
  } else if (wavelengthNm >= 510 && wavelengthNm < 580) {
    r = (wavelengthNm - 510) / (580 - 510);
    g = 1.0;
    b = 0.0;
  } else if (wavelengthNm >= 580 && wavelengthNm < 645) {
    r = 1.0;
    g = -(wavelengthNm - 645) / (645 - 580);
    b = 0.0;
  } else if (wavelengthNm >= 645 && wavelengthNm <= 780) {
    r = 1.0;
    g = 0.0;
    b = 0.0;
  } else {
    return '#FBBF24'; // Yellow fallback
  }

  // Intensity falloff at spectrum edges
  let factor = 1.0;
  if (wavelengthNm < 420) {
    factor = 0.3 + (0.7 * (wavelengthNm - 380)) / (420 - 380);
  } else if (wavelengthNm > 700) {
    factor = 0.3 + (0.7 * (780 - wavelengthNm)) / (780 - 700);
  }

  const toHex = (c: number) => {
    const val = Math.round(Math.max(0, Math.min(255, c * factor * 255)));
    return val.toString(16).padStart(2, '0');
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Compute Fresnel Reflection and Transmission coefficients for unpolarized light.
 */
export function computeFresnelCoefficients(
  n1: number,
  n2: number,
  theta1Rad: number,
  theta2Rad: number | null
): FresnelCoefficients {
  // If Total Internal Reflection (TIR), 100% reflectance
  if (theta2Rad === null) {
    return {
      rs: 1.0,
      rp: 1.0,
      rUnpolarized: 1.0,
      tUnpolarized: 0.0,
    };
  }

  const cos1 = Math.cos(theta1Rad);
  const cos2 = Math.cos(theta2Rad);

  // Normal incidence special case: θ1 = 0
  if (Math.abs(theta1Rad) < 1e-6) {
    const r0 = Math.pow((n1 - n2) / (n1 + n2), 2);
    return {
      rs: r0,
      rp: r0,
      rUnpolarized: r0,
      tUnpolarized: 1 - r0,
    };
  }

  // s-polarization (TE wave: electric field perpendicular to plane of incidence)
  const numS = n1 * cos1 - n2 * cos2;
  const denS = n1 * cos1 + n2 * cos2;
  const rs = Math.pow(numS / denS, 2);

  // p-polarization (TM wave: electric field parallel to plane of incidence)
  const numP = n1 * cos2 - n2 * cos1;
  const denP = n1 * cos2 + n2 * cos1;
  const rp = Math.pow(numP / denP, 2);

  // Average for unpolarized natural light
  const rUnpol = 0.5 * (rs + rp);
  const tUnpol = Math.max(0, 1 - rUnpol);

  return {
    rs: Math.min(1.0, Math.max(0.0, rs)),
    rp: Math.min(1.0, Math.max(0.0, rp)),
    rUnpolarized: Math.min(1.0, Math.max(0.0, rUnpol)),
    tUnpolarized: Math.min(1.0, Math.max(0.0, tUnpol)),
  };
}

/**
 * Planar Boundary Snell's Law Calculator
 */
export function computePlanarOptics(params: SnellParameters): PlanarOpticsResult {
  const n1 = getEffectiveRefractiveIndex(
    params.medium1Id,
    params.medium1CustomN,
    params.wavelengthNm,
    true
  );
  const n2 = getEffectiveRefractiveIndex(
    params.medium2Id,
    params.medium2CustomN,
    params.wavelengthNm,
    true
  );

  const theta1Deg = Math.min(89.9, Math.max(0, params.angleDeg));
  const theta1Rad = (theta1Deg * Math.PI) / 180;

  // Speeds in media
  const v1 = SPEED_OF_LIGHT_C / n1;
  const v2 = SPEED_OF_LIGHT_C / n2;

  // Wavelength in vacuum lambda0 = wavelengthNm * 10^-9
  const lambda0Nm = params.wavelengthNm;
  const lambda1Nm = lambda0Nm / n1;
  const lambda2Nm = lambda0Nm / n2;

  // Invariant wave frequency f = c / lambda0 (in THz = 10^12 Hz)
  const frequencyTHz = (SPEED_OF_LIGHT_C / (lambda0Nm * 1e-9)) / 1e12;

  // Critical angle (only exists when n1 > n2)
  let criticalAngleDeg: number | null = null;
  if (n1 > n2) {
    criticalAngleDeg = (Math.asin(n2 / n1) * 180) / Math.PI;
  }

  // Snell's Law: sin(theta2) = (n1 / n2) * sin(theta1)
  const sinTheta2 = (n1 / n2) * Math.sin(theta1Rad);

  let isTIR = false;
  let theta2Rad: number | null = null;
  let theta2Deg: number | null = null;
  let deviationAngleDeg: number | null = null;

  if (sinTheta2 > 1.0) {
    // Total Internal Reflection
    isTIR = true;
    theta2Rad = null;
    theta2Deg = null;
    deviationAngleDeg = 180 - 2 * theta1Deg;
  } else {
    theta2Rad = Math.asin(sinTheta2);
    theta2Deg = (theta2Rad * 180) / Math.PI;
    deviationAngleDeg = Math.abs(theta1Deg - theta2Deg);
  }

  // Brewster's polarization angle tan(θB) = n2 / n1
  const brewsterAngleDeg = (Math.atan(n2 / n1) * 180) / Math.PI;

  // Fresnel coefficients
  const fresnel = computeFresnelCoefficients(n1, n2, theta1Rad, theta2Rad);

  return {
    n1,
    n2,
    v1,
    v2,
    lambda1Nm,
    lambda2Nm,
    frequencyTHz,
    theta1Deg,
    theta1Rad,
    thetaRDeg: theta1Deg,
    theta2Deg,
    theta2Rad,
    criticalAngleDeg,
    isTIR,
    brewsterAngleDeg,
    deviationAngleDeg,
    fresnel,
    relativeRefractiveIndex21: n2 / n1,
  };
}

/**
 * Parallel Slab Lateral Shift Calculator
 * When a ray traverses a slab of thickness t with parallel surfaces,
 * the emerging ray is parallel to the incident ray, displaced by lateral shift:
 * d = t * sin(i - r) / cos(r)
 */
export function computeSlabOptics(params: SnellParameters): SlabOpticsResult {
  const planar = computePlanarOptics(params);
  const tMm = params.slabThicknessMm;

  if (planar.theta2Rad === null || planar.isTIR) {
    return {
      ...planar,
      lateralShiftMm: 0,
      pathLengthInsideMm: 0,
      opticalPathLengthMm: 0,
      timeInsidePicoseconds: 0,
    };
  }

  const iRad = planar.theta1Rad;
  const rRad = planar.theta2Rad;

  // Lateral shift d = t * sin(i - r) / cos(r)
  const lateralShiftMm = (tMm * Math.sin(iRad - rRad)) / Math.cos(rRad);

  // Geometric path length inside slab L = t / cos(r)
  const pathLengthInsideMm = tMm / Math.cos(rRad);

  // Optical Path Length (OPL) = n2 * L
  const opticalPathLengthMm = planar.n2 * pathLengthInsideMm;

  // Time taken inside slab = L / v2
  const timeInsideSec = (pathLengthInsideMm * 1e-3) / planar.v2;
  const timeInsidePicoseconds = timeInsideSec * 1e12;

  return {
    ...planar,
    lateralShiftMm,
    pathLengthInsideMm,
    opticalPathLengthMm,
    timeInsidePicoseconds,
  };
}

/**
 * Triangular Prism Refraction & Spectral Dispersion
 * Apex angle A, entry face 1, exit face 2.
 * r1 = asin( sin(i1) / n_prism )
 * r2 = A - r1
 * sin(e) = n_prism * sin(r2)
 * Total deviation: δ = i1 + e - A
 * Minimum deviation δ_m: occurs when i1 = e and r1 = r2 = A/2
 */
export function computePrismOptics(params: SnellParameters): PrismOpticsResult {
  const nAir = 1.0003;
  const apexAngleDeg = params.prismApexAngleDeg;
  const A_Rad = (apexAngleDeg * Math.PI) / 180;
  const i1Deg = Math.min(85, Math.max(0, params.angleDeg));
  const i1Rad = (i1Deg * Math.PI) / 180;

  const nPrismBase = getEffectiveRefractiveIndex(
    params.medium2Id,
    params.medium2CustomN,
    params.wavelengthNm,
    true
  );

  // Minimum deviation angle formula: n = sin((A + δm)/2) / sin(A/2)
  // => (A + δm)/2 = asin( n * sin(A/2) )
  const sinHalfA = Math.sin(A_Rad / 2);
  const argMinDev = nPrismBase * sinHalfA;
  let minimumDeviationAngleDeg = 0;
  let angleForMinDeviationDeg = 0;

  if (argMinDev <= 1.0) {
    const halfDevPlusA = Math.asin(argMinDev);
    minimumDeviationAngleDeg = ((2 * halfDevPlusA - A_Rad) * 180) / Math.PI;
    // Incident angle for minimum deviation is i = (A + δm)/2
    angleForMinDeviationDeg = (halfDevPlusA * 180) / Math.PI;
  }

  // Single ray calculation for current wavelength
  const sinR1 = (nAir / nPrismBase) * Math.sin(i1Rad);
  const r1Rad = Math.asin(Math.min(1.0, sinR1));
  const r1Deg = (r1Rad * 180) / Math.PI;

  const r2Rad = A_Rad - r1Rad;
  const r2Deg = (r2Rad * 180) / Math.PI;

  const sinE = (nPrismBase / nAir) * Math.sin(r2Rad);
  let isTIRFace2 = false;
  let eDeg: number | null = null;
  let deviationAngleDeg: number | null = null;

  if (sinE > 1.0 || r2Rad < 0) {
    isTIRFace2 = true;
  } else {
    const eRad = Math.asin(sinE);
    eDeg = (eRad * 180) / Math.PI;
    deviationAngleDeg = i1Deg + eDeg - apexAngleDeg;
  }

  // 7-Spectral Rainbow Rays (Red to Violet)
  const spectralColors = [
    { name: 'Red', hex: '#EF4444', nm: 700 },
    { name: 'Orange', hex: '#F97316', nm: 620 },
    { name: 'Yellow', hex: '#FBBF24', nm: 580 },
    { name: 'Green', hex: '#10B981', nm: 530 },
    { name: 'Cyan', hex: '#06B6D4', nm: 490 },
    { name: 'Blue', hex: '#3B82F6', nm: 450 },
    { name: 'Violet', hex: '#8B5CF6', nm: 400 },
  ];

  const spectralRays: PrismSpectralRay[] = spectralColors.map((spec) => {
    const nSpec = getEffectiveRefractiveIndex(
      params.medium2Id,
      params.medium2CustomN,
      spec.nm,
      true
    );

    const sinR1_spec = (nAir / nSpec) * Math.sin(i1Rad);
    const r1Rad_spec = Math.asin(Math.min(1.0, sinR1_spec));
    const r1Deg_spec = (r1Rad_spec * 180) / Math.PI;

    const r2Rad_spec = A_Rad - r1Rad_spec;
    const r2Deg_spec = (r2Rad_spec * 180) / Math.PI;

    const sinE_spec = (nSpec / nAir) * Math.sin(r2Rad_spec);
    let tir = false;
    let specEDeg: number | null = null;
    let specDevDeg: number | null = null;

    if (sinE_spec > 1.0 || r2Rad_spec < 0) {
      tir = true;
    } else {
      const eRad_spec = Math.asin(sinE_spec);
      specEDeg = (eRad_spec * 180) / Math.PI;
      specDevDeg = i1Deg + specEDeg - apexAngleDeg;
    }

    return {
      colorName: spec.name,
      colorHex: spec.hex,
      wavelengthNm: spec.nm,
      nPrism: nSpec,
      refractionAngle1Deg: r1Deg_spec,
      incidentAngle2Deg: r2Deg_spec,
      isTIRFace2: tir,
      emergenceAngleDeg: specEDeg,
      deviationAngleDeg: specDevDeg,
    };
  });

  return {
    nAir,
    nPrismBase,
    apexAngleDeg,
    incidenceAngleDeg: i1Deg,
    refractionAngle1Deg: r1Deg,
    incidentAngle2Deg: r2Deg,
    isTIRFace2,
    emergenceAngleDeg: eDeg,
    deviationAngleDeg,
    minimumDeviationAngleDeg,
    angleForMinDeviationDeg,
    spectralRays,
  };
}

/**
 * Optical Fiber Core-Cladding Waveguide Calculator
 * NA = sqrt( n_core² - n_clad² )
 * Acceptance Angle θ_a = asin( NA / n_0 )
 */
export function computeFiberOptics(params: SnellParameters): FiberOpticsResult {
  const nCore = Math.max(
    1.4,
    getEffectiveRefractiveIndex(params.medium1Id, params.medium1CustomN, params.wavelengthNm, false)
  );
  const nClad = Math.min(
    nCore - 0.02,
    Math.max(1.0, params.fiberCladdingN)
  );

  const criticalAngleCoreCladDeg = (Math.asin(nClad / nCore) * 180) / Math.PI;
  const numericalAperture = Math.sqrt(Math.max(0, nCore * nCore - nClad * nClad));

  // Acceptance angle in air (n0 = 1.0)
  const argAccept = Math.min(1.0, numericalAperture);
  const acceptanceAngleDeg = (Math.asin(argAccept) * 180) / Math.PI;

  const launchAngle = params.angleDeg;
  const willPropagate = launchAngle <= acceptanceAngleDeg;

  return {
    nCore,
    nClad,
    criticalAngleCoreCladDeg,
    numericalAperture,
    acceptanceAngleDeg,
    willPropagate,
    internalReflectionsCount: willPropagate ? Math.max(3, Math.round(10 * Math.tan((launchAngle * Math.PI) / 180))) : 0,
  };
}
