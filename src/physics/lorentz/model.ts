/**
 * EQUATION 1 — Lorentz Force Physics Engine & Numerical Integrator
 * Full vector algebra, cross products, cyclotron resonance kinematics,
 * Boris electromagnetic particle pusher, and presets.
 */

import {
  LorentzParameters,
  LorentzDerivedValues,
  Vector3D,
  LorentzPreset,
} from './types';

export const ELEMENTARY_CHARGE = 1.602176634e-19; // Coulombs
export const PROTON_MASS = 1.67262192e-27; // kg
export const ELECTRON_MASS = 9.1093837e-31; // kg
export const ALPHA_MASS = 6.64465723e-27; // kg

/**
 * Computes 3D cross product: A × B
 */
export function vectorCross(a: Vector3D, b: Vector3D): Vector3D {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

/**
 * Computes 3D vector dot product: A · B
 */
export function vectorDot(a: Vector3D, b: Vector3D): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

/**
 * Computes 3D vector magnitude: |A|
 */
export function vectorMagnitude(v: Vector3D): number {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

/**
 * Converts parameters into physical 3D field vectors
 */
export function getFieldVectors(params: LorentzParameters): {
  bVec: Vector3D;
  eVec: Vector3D;
  vVec: Vector3D;
} {
  const {
    speed,
    angleThetaDeg,
    bFieldStrength,
    bFieldDirection,
    electricFieldEnabled,
    eFieldStrength,
    eFieldDirection,
    initialVelocityAngleDeg,
  } = params;

  // Coordinate conventions:
  // Screen plane is xy: +x is Right, +y is Down (SVG standard) or Up in math.
  // In our physics coordinate frame:
  // +x = Right
  // +y = Up (towards top of screen)
  // +z = Out of screen (towards viewer ⊙)
  // -z = Into screen (away from viewer ⊗)

  // B-field vector: directed along z-axis
  const bZ = bFieldDirection === 'out-of-screen' ? bFieldStrength : -bFieldStrength;
  const bVec: Vector3D = { x: 0, y: 0, z: bZ };

  // E-field vector
  let eVec: Vector3D = { x: 0, y: 0, z: 0 };
  if (electricFieldEnabled && eFieldStrength > 0) {
    if (eFieldDirection === 'up') eVec = { x: 0, y: eFieldStrength, z: 0 };
    else if (eFieldDirection === 'down') eVec = { x: 0, y: -eFieldStrength, z: 0 };
    else if (eFieldDirection === 'right') eVec = { x: eFieldStrength, y: 0, z: 0 };
    else if (eFieldDirection === 'left') eVec = { x: -eFieldStrength, y: 0, z: 0 };
  }

  // Velocity vector:
  // Angle theta is angle relative to B-field (z-axis)
  // theta = 90° -> velocity completely in xy-plane (perpendicular to B)
  // theta = 0°  -> velocity completely along +z (parallel to B)
  // theta = 180° -> velocity completely along -z (antiparallel to B)
  const thetaRad = (angleThetaDeg * Math.PI) / 180;
  const phiRad = (initialVelocityAngleDeg * Math.PI) / 180;

  const vPerp = speed * Math.sin(thetaRad);
  const vPar = speed * Math.cos(thetaRad);

  const vVec: Vector3D = {
    x: vPerp * Math.cos(phiRad),
    y: vPerp * Math.sin(phiRad),
    z: vPar,
  };

  return { bVec, eVec, vVec };
}

/**
 * Calculates instantaneous Lorentz Force vector: F = q(E + v × B)
 */
export function calculateLorentzForce(
  q: number,
  v: Vector3D,
  E: Vector3D,
  B: Vector3D
): {
  fMag: number;
  fVec: Vector3D;
  fbMag: number;
  fbVec: Vector3D;
  feMag: number;
  feVec: Vector3D;
} {
  // v × B
  const vCrossB = vectorCross(v, B);

  // F_B = q(v × B)
  const fbVec: Vector3D = {
    x: q * vCrossB.x,
    y: q * vCrossB.y,
    z: q * vCrossB.z,
  };
  const fbMag = vectorMagnitude(fbVec);

  // F_E = q E
  const feVec: Vector3D = {
    x: q * E.x,
    y: q * E.y,
    z: q * E.z,
  };
  const feMag = vectorMagnitude(feVec);

  // Total force F = F_E + F_B
  const fVec: Vector3D = {
    x: feVec.x + fbVec.x,
    y: feVec.y + fbVec.y,
    z: feVec.z + fbVec.z,
  };
  const fMag = vectorMagnitude(fVec);

  return { fMag, fVec, fbMag, fbVec, feMag, feVec };
}

/**
 * Computes all derived invariant quantities, cyclotron parameters, and explanations
 */
export function computeLorentzDerivedValues(
  params: LorentzParameters
): LorentzDerivedValues {
  const { charge: q, mass: m, speed: v, angleThetaDeg, bFieldStrength: B, electricFieldEnabled, eFieldStrength: E } = params;

  const { bVec, eVec, vVec } = getFieldVectors(params);
  const { fMag, fVec, fbMag, fbVec, feMag, feVec } = calculateLorentzForce(q, vVec, eVec, bVec);

  const thetaRad = (angleThetaDeg * Math.PI) / 180;
  const vParallel = v * Math.cos(thetaRad);
  const vPerpendicular = v * Math.sin(thetaRad);

  const safeMass = Math.max(1e-35, m);
  const absQ = Math.abs(q);
  const safeB = Math.abs(B);

  // Cyclotron radius: r = m v_perp / (|q| B)
  let cyclotronRadius: number | null = null;
  let cyclotronAngularFreq: number | null = null;
  let cyclotronFrequency: number | null = null;
  let cyclotronPeriod: number | null = null;
  let helicalPitch: number | null = null;

  if (safeB > 1e-6 && absQ > 1e-25) {
    cyclotronRadius = (safeMass * vPerpendicular) / (absQ * safeB);
    cyclotronAngularFreq = (absQ * safeB) / safeMass;
    cyclotronFrequency = cyclotronAngularFreq / (2 * Math.PI);
    cyclotronPeriod = cyclotronFrequency > 0 ? 1 / cyclotronFrequency : null;

    if (cyclotronPeriod !== null && Math.abs(vParallel) > 1e-3) {
      helicalPitch = Math.abs(vParallel) * cyclotronPeriod;
    }
  }

  const accelerationMagnitude = fMag / safeMass;

  // Kinetic energy: K = 1/2 m v²
  const kineticEnergyJoules = 0.5 * safeMass * v * v;
  const kineticEnergyEV = kineticEnergyJoules / ELEMENTARY_CHARGE;

  // Crossed fields velocity balance: v_balance = E / B
  let crossedFieldsBalanceSpeed: number | null = null;
  if (electricFieldEnabled && safeB > 1e-4 && E > 0) {
    crossedFieldsBalanceSpeed = E / safeB;
  }

  const isNetForceZero = fMag < 1e-15;

  // Explanation message
  let explanationText = '';
  if (angleThetaDeg === 0 || angleThetaDeg === 180) {
    explanationText = 'Velocity is parallel to the magnetic field (θ = 0° or 180°). The cross product v × B vanishes, so magnetic force is zero.';
  } else if (angleThetaDeg === 90 && !electricFieldEnabled) {
    explanationText = 'Velocity is perpendicular to B (θ = 90°). The magnetic force acts as a centripetal force of constant magnitude, producing circular motion.';
  } else if (!electricFieldEnabled && angleThetaDeg > 0 && angleThetaDeg < 180) {
    explanationText = `Velocity has parallel (${vParallel.toExponential(2)} m/s) and perpendicular (${vPerpendicular.toExponential(2)} m/s) components, generating a helical spiral.`;
  } else if (electricFieldEnabled && safeB < 1e-4) {
    explanationText = 'Pure electric field regime: F = qE accelerates the particle in a parabolic trajectory.';
  } else if (electricFieldEnabled && crossedFieldsBalanceSpeed !== null) {
    const speedDiff = Math.abs(v - crossedFieldsBalanceSpeed);
    if (speedDiff < 1e4) {
      explanationText = 'Wien velocity filter condition met! The upward and downward electromagnetic forces cancel (qE = qvB), allowing undeflected straight-line transit.';
    } else {
      explanationText = 'Crossed electric and magnetic fields produce combined deflection (cycloid-type motion).';
    }
  } else {
    explanationText = 'The particle responds dynamically to the combined vector sum of electric and magnetic Lorentz forces.';
  }

  return {
    magneticForceMagnitude: fbMag,
    magneticForceVector: fbVec,
    electricForceMagnitude: feMag,
    electricForceVector: feVec,
    totalForceMagnitude: fMag,
    totalForceVector: fVec,
    accelerationMagnitude,
    vParallel,
    vPerpendicular,
    cyclotronRadius,
    cyclotronAngularFreq,
    cyclotronFrequency,
    cyclotronPeriod,
    helicalPitch,
    kineticEnergyJoules,
    kineticEnergyEV,
    crossedFieldsBalanceSpeed,
    isNetForceZero,
    explanationText,
  };
}

/**
 * Boris electromagnetic particle pusher (standard in plasma & accelerator physics)
 * Guarantees zero spurious energy drift under pure magnetic fields.
 */
export function borisStep(
  pos: Vector3D,
  vel: Vector3D,
  q: number,
  m: number,
  E: Vector3D,
  B: Vector3D,
  dt: number
): { nextPos: Vector3D; nextVel: Vector3D } {
  const safeM = Math.max(1e-35, m);
  const qOverM = q / safeM;

  // Step 1: Half-step electric acceleration: v_minus = v + (q*E/m) * (dt/2)
  const vMinus: Vector3D = {
    x: vel.x + qOverM * E.x * (dt * 0.5),
    y: vel.y + qOverM * E.y * (dt * 0.5),
    z: vel.z + qOverM * E.z * (dt * 0.5),
  };

  // Step 2: Magnetic rotation
  // t-vector = (q*B/m) * (dt/2)
  const tVec: Vector3D = {
    x: qOverM * B.x * (dt * 0.5),
    y: qOverM * B.y * (dt * 0.5),
    z: qOverM * B.z * (dt * 0.5),
  };
  const tMagSq = tVec.x * tVec.x + tVec.y * tVec.y + tVec.z * tVec.z;

  // s-vector = 2 * t / (1 + |t|²)
  const denom = 1 + tMagSq;
  const sVec: Vector3D = {
    x: (2 * tVec.x) / denom,
    y: (2 * tVec.y) / denom,
    z: (2 * tVec.z) / denom,
  };

  // v_prime = v_minus + (v_minus × t)
  const vMinusCrossT = vectorCross(vMinus, tVec);
  const vPrime: Vector3D = {
    x: vMinus.x + vMinusCrossT.x,
    y: vMinus.y + vMinusCrossT.y,
    z: vMinus.z + vMinusCrossT.z,
  };

  // v_plus = v_minus + (v_prime × s)
  const vPrimeCrossS = vectorCross(vPrime, sVec);
  const vPlus: Vector3D = {
    x: vMinus.x + vPrimeCrossS.x,
    y: vMinus.y + vPrimeCrossS.y,
    z: vMinus.z + vPrimeCrossS.z,
  };

  // Step 3: Second half-step electric acceleration: v_next = v_plus + (q*E/m) * (dt/2)
  const nextVel: Vector3D = {
    x: vPlus.x + qOverM * E.x * (dt * 0.5),
    y: vPlus.y + qOverM * E.y * (dt * 0.5),
    z: vPlus.z + qOverM * E.z * (dt * 0.5),
  };

  // Step 4: Position update: x_next = x + v_next * dt
  const nextPos: Vector3D = {
    x: pos.x + nextVel.x * dt,
    y: pos.y + nextVel.y * dt,
    z: pos.z + nextVel.z * dt,
  };

  return { nextPos, nextVel };
}

/**
 * 8 Presets conforming to Part 11 requirements
 */
export const LORENTZ_PRESETS: LorentzPreset[] = [
  {
    id: 'exp-a',
    name: 'Exp A: Positive Charge',
    badge: 'Right-Hand Rule',
    tagline: '+q, v Right, B Out (⊙)',
    description: 'A proton moves right through an out-of-screen magnetic field. Right-hand rule (v × B) points downward.',
    params: {
      charge: ELEMENTARY_CHARGE,
      chargeNumber: 1,
      mass: PROTON_MASS,
      speed: 2.0e6,
      initialVelocityAngleDeg: 0,
      bFieldStrength: 0.5,
      bFieldDirection: 'out-of-screen',
      angleThetaDeg: 90,
      electricFieldEnabled: false,
      mode: 'perpendicular',
    },
  },
  {
    id: 'exp-b',
    name: 'Exp B: Negative Charge',
    badge: 'Reversed Deflection',
    tagline: '-q, v Right, B Out (⊙)',
    description: 'Reversing charge to negative electron-equivalent reverses force direction upward (-v × B).',
    params: {
      charge: -ELEMENTARY_CHARGE,
      chargeNumber: -1,
      mass: PROTON_MASS, // normalized for clear visual comparison
      speed: 2.0e6,
      initialVelocityAngleDeg: 0,
      bFieldStrength: 0.5,
      bFieldDirection: 'out-of-screen',
      angleThetaDeg: 90,
      electricFieldEnabled: false,
      mode: 'perpendicular',
    },
  },
  {
    id: 'exp-c',
    name: 'Exp C: Zero Magnetic Force',
    badge: 'Parallel Motion',
    tagline: 'θ = 0° (v ∥ B)',
    description: 'Velocity is aligned with the magnetic field. sin(0°) = 0, so magnetic force vanishes completely.',
    params: {
      charge: ELEMENTARY_CHARGE,
      chargeNumber: 1,
      mass: PROTON_MASS,
      speed: 2.0e6,
      angleThetaDeg: 0,
      bFieldStrength: 0.5,
      bFieldDirection: 'out-of-screen',
      electricFieldEnabled: false,
      mode: 'parallel',
    },
  },
  {
    id: 'exp-d',
    name: 'Exp D: Maximum Force',
    badge: 'Perpendicular',
    tagline: 'θ = 90° (v ⊥ B)',
    description: 'Perpendicular velocity maximizes magnetic force magnitude |q|vB sin(90°) = |q|vB.',
    params: {
      charge: ELEMENTARY_CHARGE,
      chargeNumber: 1,
      mass: PROTON_MASS,
      speed: 2.0e6,
      angleThetaDeg: 90,
      bFieldStrength: 0.5,
      bFieldDirection: 'out-of-screen',
      electricFieldEnabled: false,
      mode: 'perpendicular',
    },
  },
  {
    id: 'exp-e',
    name: 'Exp E: Stronger Field',
    badge: 'Smaller Radius',
    tagline: 'B = 1.5 T (3× increase)',
    description: 'Tripling magnetic field strength increases force by 3×, shrinking orbit radius r = mv/(qB) to one third.',
    params: {
      charge: ELEMENTARY_CHARGE,
      chargeNumber: 1,
      mass: PROTON_MASS,
      speed: 2.0e6,
      bFieldStrength: 1.5,
      bFieldDirection: 'out-of-screen',
      angleThetaDeg: 90,
      electricFieldEnabled: false,
      mode: 'perpendicular',
    },
  },
  {
    id: 'exp-f',
    name: 'Exp F: Particle Mass',
    badge: 'Inertia Comparison',
    tagline: 'm = 4× (Alpha particle)',
    description: 'Higher inertia increases circular orbit radius r ∝ m and lowers cyclotron frequency f_c ∝ 1/m.',
    params: {
      charge: 2 * ELEMENTARY_CHARGE,
      chargeNumber: 2,
      mass: ALPHA_MASS,
      speed: 2.0e6,
      bFieldStrength: 0.5,
      bFieldDirection: 'out-of-screen',
      angleThetaDeg: 90,
      electricFieldEnabled: false,
      mode: 'perpendicular',
    },
  },
  {
    id: 'exp-g',
    name: 'Exp G: Electric Acceleration',
    badge: 'Pure E-Field',
    tagline: 'B = 0, E = 5×10⁵ N/C',
    description: 'Disables magnetic field and applies pure electric force F = qE, accelerating the charge linearly or parabolically.',
    params: {
      charge: ELEMENTARY_CHARGE,
      chargeNumber: 1,
      mass: PROTON_MASS,
      speed: 1.0e6,
      bFieldStrength: 0.0,
      electricFieldEnabled: true,
      eFieldStrength: 5.0e5,
      eFieldDirection: 'up',
      mode: 'electric-only',
    },
  },
  {
    id: 'exp-h',
    name: 'Exp H: Crossed Fields (Wien Filter)',
    badge: 'Velocity Selector',
    tagline: 'E = 10⁶ N/C, B = 0.5 T, v = E/B',
    description: 'Electric force points up, magnetic force points down. At v = E/B = 2×10⁶ m/s, net force is zero and path is straight.',
    params: {
      charge: ELEMENTARY_CHARGE,
      chargeNumber: 1,
      mass: PROTON_MASS,
      speed: 2.0e6, // exactly E/B
      bFieldStrength: 0.5,
      bFieldDirection: 'out-of-screen',
      angleThetaDeg: 90,
      electricFieldEnabled: true,
      eFieldStrength: 1.0e6,
      eFieldDirection: 'up',
      initialVelocityAngleDeg: 0,
      mode: 'crossed-fields',
    },
  },
];
