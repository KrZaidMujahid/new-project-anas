/**
 * EQUATION 1 — RLC Circuits Laboratory Physics Engine & Mathematical Solver
 * Exact electrodynamic AC phasor calculations, series/parallel resonance curves,
 * power factor analysis, and numerical DC transient response integration.
 */

import {
  RLCParameters,
  SeriesCalculations,
  ParallelCalculations,
  TransientCalculations,
  RLCGuidedLab,
  RLCQuizQuestion,
} from './types';

/**
 * Computes all AC series RLC parameters
 */
export function computeSeriesRLC(params: RLCParameters): SeriesCalculations {
  const R = Math.max(0.1, params.resistance);
  const L = Math.max(1e-6, params.inductanceMilliHenries * 1e-3); // H
  const C = Math.max(1e-12, params.capacitanceMicroFarads * 1e-6); // F
  const f = Math.max(0.1, params.sourceFrequency);
  const vRMS = Math.max(0.1, params.sourceVoltageRMS);

  const omega = 2 * Math.PI * f;
  const XL = omega * L;
  const XC = 1 / (omega * C);
  const netX = XL - XC;
  const Z = Math.sqrt(R * R + netX * netX);

  const vPeak = Math.SQRT2 * vRMS;
  const iRMS = vRMS / Z;
  const iPeak = Math.SQRT2 * iRMS;

  const phaseRad = Math.atan2(netX, R);
  const phaseDeg = (phaseRad * 180) / Math.PI;

  let phaseRegime: 'inductive' | 'capacitive' | 'resonant' = 'resonant';
  if (Math.abs(phaseDeg) < 0.5) {
    phaseRegime = 'resonant';
  } else if (phaseDeg > 0) {
    phaseRegime = 'inductive';
  } else {
    phaseRegime = 'capacitive';
  }

  const vR = iRMS * R;
  const vL = iRMS * XL;
  const vC = iRMS * XC;

  // Resonance & Bandwidth
  const f0 = 1 / (2 * Math.PI * Math.sqrt(L * C));
  const omega0 = 1 / Math.sqrt(L * C);
  const Q = (1 / R) * Math.sqrt(L / C);
  const bandwidth = R / (2 * Math.PI * L);

  // Power Calculations
  const apparentPower = vRMS * iRMS;
  const realPower = apparentPower * Math.cos(phaseRad);
  const reactivePower = apparentPower * Math.sin(phaseRad);
  const powerFactor = Math.cos(phaseRad);

  let powerFactorType: 'lagging' | 'leading' | 'unity' = 'unity';
  if (Math.abs(phaseDeg) < 0.5) {
    powerFactorType = 'unity';
  } else if (phaseDeg > 0) {
    powerFactorType = 'lagging'; // current lags voltage in inductive circuit
  } else {
    powerFactorType = 'leading'; // current leads voltage in capacitive circuit
  }

  return {
    inductanceH: L,
    capacitanceF: C,
    angularFrequency: omega,
    inductiveReactance: XL,
    capacitiveReactance: XC,
    netReactance: netX,
    impedance: Z,
    vPeak,
    currentRMS: iRMS,
    currentPeak: iPeak,
    phaseAngleRad: phaseRad,
    phaseAngleDeg: phaseDeg,
    phaseRegime,
    voltageResistorRMS: vR,
    voltageInductorRMS: vL,
    voltageCapacitorRMS: vC,
    resonanceFrequency: f0,
    resonanceAngularFreq: omega0,
    qualityFactor: Q,
    bandwidthHz: bandwidth,
    apparentPowerVA: apparentPower,
    realPowerWatts: realPower,
    reactivePowerVar: reactivePower,
    powerFactor,
    powerFactorType,
  };
}

/**
 * Computes all AC parallel RLC parameters
 */
export function computeParallelRLC(params: RLCParameters): ParallelCalculations {
  const R = Math.max(0.1, params.resistance);
  const L = Math.max(1e-6, params.inductanceMilliHenries * 1e-3);
  const C = Math.max(1e-12, params.capacitanceMicroFarads * 1e-6);
  const f = Math.max(0.1, params.sourceFrequency);
  const vRMS = Math.max(0.1, params.sourceVoltageRMS);

  const omega = 2 * Math.PI * f;
  const XL = omega * L;
  const XC = 1 / (omega * C);

  const iR = vRMS / R;
  const iL = vRMS / XL;
  const iC = vRMS / XC;

  // Total admittance magnitude: Y = sqrt((1/R)² + (1/XC - 1/XL)²)
  // reactive susceptance B = BC - BL = (1/XC - 1/XL)
  const susceptance = 1 / XC - 1 / XL;
  const conductance = 1 / R;
  const Y = Math.sqrt(conductance * conductance + susceptance * susceptance);
  const iSource = vRMS * Y;
  const iSourcePeak = Math.SQRT2 * iSource;
  const Zeq = Y > 0 ? 1 / Y : 0;

  const f0 = 1 / (2 * Math.PI * Math.sqrt(L * C));
  const phaseRad = Math.atan2(susceptance, conductance);
  const phaseDeg = (phaseRad * 180) / Math.PI;

  let phaseRegime: 'inductive' | 'capacitive' | 'resonant' = 'resonant';
  if (Math.abs(phaseDeg) < 0.5) {
    phaseRegime = 'resonant';
  } else if (susceptance > 0) {
    phaseRegime = 'capacitive';
  } else {
    phaseRegime = 'inductive';
  }

  return {
    inductanceH: L,
    capacitanceF: C,
    angularFrequency: omega,
    inductiveReactance: XL,
    capacitiveReactance: XC,
    currentResistorRMS: iR,
    currentInductorRMS: iL,
    currentCapacitorRMS: iC,
    admittanceSiemens: Y,
    currentSourceRMS: iSource,
    currentSourcePeak: iSourcePeak,
    equivalentImpedance: Zeq,
    resonanceFrequency: f0,
    phaseAngleDeg: phaseDeg,
    phaseRegime,
  };
}

/**
 * Computes DC Transient Response (RC, RL, and Series RLC)
 */
export function computeTransientResponse(params: RLCParameters): TransientCalculations {
  const R = Math.max(0.1, params.resistance);
  const L = Math.max(1e-6, params.inductanceMilliHenries * 1e-3);
  const C = Math.max(1e-12, params.capacitanceMicroFarads * 1e-6);
  const vSource = Math.max(0.1, params.dcSourceVoltage);

  const tauRC = R * C; // seconds
  const tauRL = L / R; // seconds

  const alpha = R / (2 * L); // damping coefficient
  const omega0 = 1 / Math.sqrt(L * C); // natural frequency
  const zeta = alpha / omega0; // damping ratio

  let dampingRegime: 'underdamped' | 'critically_damped' | 'overdamped' = 'underdamped';
  let omegaD: number | null = null;

  if (Math.abs(zeta - 1.0) < 0.05) {
    dampingRegime = 'critically_damped';
  } else if (zeta < 1.0) {
    dampingRegime = 'underdamped';
    omegaD = Math.sqrt(Math.max(0, omega0 * omega0 - alpha * alpha));
  } else {
    dampingRegime = 'overdamped';
  }

  // Determine appropriate simulation duration T_max
  let tMax = 0.01; // default 10 ms
  if (params.transientType === 'rc') {
    tMax = Math.min(2.0, Math.max(1e-4, 5 * tauRC));
  } else if (params.transientType === 'rl') {
    tMax = Math.min(2.0, Math.max(1e-4, 5 * tauRL));
  } else {
    // RLC step response
    const period0 = (2 * Math.PI) / omega0;
    const decayTime = alpha > 0 ? 5 / alpha : 0.05;
    tMax = Math.min(2.0, Math.max(period0 * 4, decayTime));
  }

  const numPoints = 250;
  const dt = tMax / numPoints;
  const timePointsMs: number[] = [];
  const voltagePoints: number[] = [];
  const currentPoints: number[] = [];

  if (params.transientType === 'rc') {
    for (let i = 0; i <= numPoints; i++) {
      const t = i * dt;
      timePointsMs.push(t * 1000);

      if (params.transientAction === 'charge') {
        const vC = vSource * (1 - Math.exp(-t / tauRC));
        const iC = (vSource / R) * Math.exp(-t / tauRC);
        voltagePoints.push(vC);
        currentPoints.push(iC);
      } else {
        // Discharging from initial V_source
        const vC = vSource * Math.exp(-t / tauRC);
        const iC = -(vSource / R) * Math.exp(-t / tauRC);
        voltagePoints.push(vC);
        currentPoints.push(iC);
      }
    }
  } else if (params.transientType === 'rl') {
    for (let i = 0; i <= numPoints; i++) {
      const t = i * dt;
      timePointsMs.push(t * 1000);

      if (params.transientAction === 'charge' || params.transientAction === 'step') {
        // Current growth: i(t) = (V/R)(1 - e^(-t/tau))
        const iL = (vSource / R) * (1 - Math.exp(-t / tauRL));
        const vL = vSource * Math.exp(-t / tauRL);
        currentPoints.push(iL);
        voltagePoints.push(vL);
      } else {
        // Current decay: i(t) = (V/R) e^(-t/tau)
        const iL = (vSource / R) * Math.exp(-t / tauRL);
        const vL = -vSource * Math.exp(-t / tauRL);
        currentPoints.push(iL);
        voltagePoints.push(vL);
      }
    }
  } else {
    // Series RLC Step Response (L d²q/dt² + R dq/dt + q/C = V_source)
    // Initial conditions: q(0) = 0, i(0) = dq/dt = 0.
    // Steady state: q(∞) = C * V_source, v_C(∞) = V_source, i(∞) = 0.
    for (let i = 0; i <= numPoints; i++) {
      const t = i * dt;
      timePointsMs.push(t * 1000);

      let vC = 0;
      let iVal = 0;

      if (dampingRegime === 'underdamped' && omegaD !== null && omegaD > 0) {
        // v_C(t) = V_source [1 - e^(-alpha t) (cos(omega_d t) + (alpha/omega_d) sin(omega_d t))]
        const decay = Math.exp(-alpha * t);
        const term = Math.cos(omegaD * t) + (alpha / omegaD) * Math.sin(omegaD * t);
        vC = vSource * (1 - decay * term);

        // i(t) = C dv_C/dt = (V_source / (omega_d * L)) * e^(-alpha t) * sin(omega_d t)
        iVal = (vSource / (omegaD * L)) * decay * Math.sin(omegaD * t);
      } else if (dampingRegime === 'critically_damped') {
        // v_C(t) = V_source [1 - (1 + alpha t) e^(-alpha t)]
        const decay = Math.exp(-alpha * t);
        vC = vSource * (1 - (1 + alpha * t) * decay);
        // i(t) = (V_source / L) * t * e^(-alpha t)
        iVal = (vSource / L) * t * decay;
      } else {
        // Overdamped: two real roots s1, s2 = -alpha ± sqrt(alpha² - omega0²)
        const beta = Math.sqrt(Math.max(0, alpha * alpha - omega0 * omega0));
        const s1 = -alpha + beta;
        const s2 = -alpha - beta;

        // v_C(t) = V_source [1 - (s2 e^(s1 t) - s1 e^(s2 t)) / (s2 - s1)]
        const denom = s2 - s1;
        const vC_t = vSource * (1 - (s2 * Math.exp(s1 * t) - s1 * Math.exp(s2 * t)) / denom);
        vC = vC_t;

        // i(t) = C dv_C/dt = (V_source * C * s1 * s2 / denom) * (e^(s2 t) - e^(s1 t))
        iVal = (vSource / (L * (s1 - s2))) * (Math.exp(s1 * t) - Math.exp(s2 * t));
      }

      voltagePoints.push(vC);
      currentPoints.push(iVal);
    }
  }

  return {
    timeConstantRC: tauRC,
    timeConstantRL: tauRL,
    dampingCoefficientAlpha: alpha,
    naturalFrequencyOmega0: omega0,
    dampingRatioZeta: zeta,
    dampingRegime,
    dampedAngularFreq: omegaD,
    timePointsMs,
    voltagePoints,
    currentPoints,
  };
}

/**
 * 8 Guided Student Experiments
 */
export const RLC_GUIDED_LABS: RLCGuidedLab[] = [
  {
    id: 1,
    title: 'Experiment 1: Influence of Resistance R',
    badge: 'Damping & Peak Current',
    objective:
      'Investigate how increasing resistance R impacts total impedance Z, peak resonant current I_0, and the bandwidth of the resonance curve.',
    instructions: [
      'Load the baseline Series RLC setup with R = 50 Ω, L = 100 mH, C = 100 µF.',
      'Check the resonance frequency f_0 (~50.3 Hz) and current peak (~0.24 A at 12 V RMS).',
      'Increase R to 200 Ω (4×). Observe how the resonance curve flattens and peak current drops to 1/4.',
      'Notice that the resonance frequency f_0 remains completely unchanged by R!',
    ],
    expectedObservations:
      'Resistance controls the peak height (I = V/R at resonance) and broadens the bandwidth (Δf = R / 2πL), but does not shift the resonance frequency f_0.',
    setupParams: {
      circuitMode: 'series',
      resistance: 50,
      inductanceMilliHenries: 100,
      capacitanceMicroFarads: 100,
      sourceVoltageRMS: 12,
      sourceFrequency: 50.3,
    },
    question: 'Why does changing R leave the resonance frequency f_0 unaffected?',
    defaultAnswer: 'Because f_0 = 1 / (2π√(LC)) depends only on L and C, not on R.',
  },
  {
    id: 2,
    title: 'Experiment 2: Inductive Reactance & Inductance L',
    badge: 'X_L = 2πfL',
    objective:
      'Observe how changing inductance L scales inductive reactance X_L and alters the resonance frequency.',
    instructions: [
      'Load the setup with L = 50 mH and f = 100 Hz. Note X_L = 2π(100)(0.05) ≈ 31.4 Ω.',
      'Double L to 100 mH. Verify that X_L doubles to ≈ 62.8 Ω.',
      'Observe how increasing L lowers the resonance frequency f_0 ∝ 1/√L.',
    ],
    expectedObservations:
      'Inductive reactance X_L is strictly proportional to both inductance L and frequency f. Larger coils produce higher inductive opposition.',
    setupParams: {
      circuitMode: 'series',
      resistance: 50,
      inductanceMilliHenries: 50,
      capacitanceMicroFarads: 50,
      sourceVoltageRMS: 12,
      sourceFrequency: 100,
    },
    question: 'If L is quadrupled (4×), by what factor does the resonance frequency f_0 change?',
    defaultAnswer: 'f_0 decreases by a factor of 2 (halved), since f_0 ∝ 1/√L.',
  },
  {
    id: 3,
    title: 'Experiment 3: Capacitive Reactance & Capacitance C',
    badge: 'X_C = 1 / (2πfC)',
    objective:
      'Explore capacitive reactance X_C and verify its inverse relationship with capacitance C and frequency f.',
    instructions: [
      'Load the setup with C = 50 µF at f = 50 Hz. Note X_C = 1 / (2π · 50 · 50×10⁻⁶) ≈ 63.7 Ω.',
      'Double C to 100 µF. Notice X_C halves to ≈ 31.8 Ω.',
      'Verify that at very low frequency (approaching DC), X_C approaches infinity (open circuit).',
    ],
    expectedObservations:
      'Capacitive reactance opposes low frequencies strongly and lets high frequencies pass with minimal impedance.',
    setupParams: {
      circuitMode: 'series',
      resistance: 50,
      inductanceMilliHenries: 100,
      capacitanceMicroFarads: 50,
      sourceVoltageRMS: 12,
      sourceFrequency: 50,
    },
    question: 'What happens to capacitive reactance X_C at zero frequency (DC)?',
    defaultAnswer: 'At DC (f = 0), X_C approaches infinity, meaning a capacitor acts as an open circuit to steady DC.',
  },
  {
    id: 4,
    title: 'Experiment 4: Finding Electrical Resonance',
    badge: 'X_L = X_C & Maximum Current',
    objective:
      'Sweep the source frequency to locate the resonance frequency f_0 where net reactance vanishes and current peaks.',
    instructions: [
      'Load the default setup (R = 100 Ω, L = 100 mH, C = 100 µF).',
      'Start at f = 20 Hz (X_C > X_L, capacitive regime, low current).',
      'Sweep frequency upwards until current reaches its highest value (~0.12 A at ~50.3 Hz).',
      'Click the "Set Frequency to Resonance" shortcut and observe that X_L = X_C ≈ 31.6 Ω and Z = R.',
    ],
    expectedObservations:
      'At resonance, inductive and capacitive reactances cancel out entirely (X_L - X_C = 0). The circuit impedance collapses to pure resistance R.',
    setupParams: {
      circuitMode: 'series',
      resistance: 100,
      inductanceMilliHenries: 100,
      capacitanceMicroFarads: 100,
      sourceVoltageRMS: 12,
      sourceFrequency: 20,
    },
    question: 'What is the circuit impedance Z equal to at the exact resonance frequency in a series RLC circuit?',
    defaultAnswer: 'At resonance, Z = R because (X_L - X_C) = 0.',
  },
  {
    id: 5,
    title: 'Experiment 5: Phase Difference & Power Factor',
    badge: 'Lagging vs Leading',
    objective:
      'Observe how current lags voltage when inductive (f > f_0), leads voltage when capacitive (f < f_0), and is in phase at resonance (f = f_0).',
    instructions: [
      'Load setup at f = 100 Hz (f > f_0 = 50.3 Hz). Note phase angle φ > 0 (+32°), current waveform LAGS voltage, PF is lagging.',
      'Now set f = 25 Hz (f < f_0). Note φ < 0 (-50°), current waveform LEADS voltage, PF is leading.',
      'Click "Set Frequency to Resonance" (f = 50.3 Hz). Note φ = 0°, current and voltage peak at the exact same instant, PF = 1.0 (unity).',
    ],
    expectedObservations:
      'The impedance triangle and AC waveform graph dynamically illustrate phase shifts. Energy exchange between L and C governs whether voltage or current leads.',
    setupParams: {
      circuitMode: 'series',
      resistance: 100,
      inductanceMilliHenries: 100,
      capacitanceMicroFarads: 100,
      sourceVoltageRMS: 12,
      sourceFrequency: 100,
    },
    question: 'When a circuit is capacitive (f < f_0), does current lead or lag source voltage?',
    defaultAnswer: 'Current leads voltage (ICE: in a Capacitor, Current leads voltage by phase angle φ).',
  },
  {
    id: 6,
    title: 'Experiment 6: Series vs. Parallel RLC Resonance',
    badge: 'Max vs Min Source Current',
    objective:
      'Contrast the opposite resonance characteristics of Series RLC (current maximum) versus Parallel RLC (source current minimum).',
    instructions: [
      'In Series mode, note that at f = f_0, total current is at its maximum peak because Z is minimized.',
      'Switch Circuit Mode to "PARALLEL RLC CIRCUIT".',
      'Look at the Parallel Source Current vs Frequency curve: at f = f_0, the source current is at a MINIMUM antiresonant dip!',
      'Inspect the branch currents I_L and I_C: they are equal in magnitude and 180° out of phase, circulating between L and C without drawing net reactive current from the source.',
    ],
    expectedObservations:
      'Ideal series RLC acts as an acceptor circuit (minimum Z, maximum I at f_0); ideal parallel RLC acts as a rejector circuit (maximum Z, minimum source I at f_0).',
    setupParams: {
      circuitMode: 'parallel',
      resistance: 100,
      inductanceMilliHenries: 100,
      capacitanceMicroFarads: 100,
      sourceVoltageRMS: 12,
      sourceFrequency: 50.3,
    },
    question: 'Why is total source current minimized at resonance in an ideal parallel RLC circuit?',
    defaultAnswer: 'Because inductor and capacitor branch currents are equal in magnitude and opposite in phase, canceling each other out.',
  },
  {
    id: 7,
    title: 'Experiment 7: RC Transient Time Constant τ = RC',
    badge: 'Exponential Charging',
    objective:
      'Investigate the exponential charging and discharging of a capacitor through resistor R under DC voltage.',
    instructions: [
      'Switch Circuit Mode to "DC TRANSIENT RESPONSE" and select "RC Circuit".',
      'Set R = 100 Ω and C = 100 µF. Calculate τ = RC = (100)(100×10⁻⁶) = 10 ms.',
      'Check the voltage curve V_C(t): at t = 1τ (10 ms), the capacitor reaches ~63.2% of source voltage (12 V × 0.632 ≈ 7.58 V).',
      'At t = 5τ (50 ms), the capacitor is practically 99.3% fully charged.',
    ],
    expectedObservations:
      'The rate of charging slows down exponentially as the capacitor voltage approaches source voltage and charging current drops toward zero.',
    setupParams: {
      circuitMode: 'transient',
      transientType: 'rc',
      transientAction: 'charge',
      resistance: 100,
      capacitanceMicroFarads: 100,
      dcSourceVoltage: 12,
    },
    question: 'What percentage of full voltage does a charging capacitor reach after one time constant (t = τ = RC)?',
    defaultAnswer: 'Approximately 63.2% (1 - 1/e ≈ 0.6321).',
  },
  {
    id: 8,
    title: 'Experiment 8: RLC Damping Classification',
    badge: 'Underdamped, Critical, Overdamped',
    objective:
      'Adjust resistance R in the Series RLC step response to transition across underdamped oscillations, critical damping, and sluggish overdamped response.',
    instructions: [
      'Switch to "DC TRANSIENT RESPONSE" and select "Series RLC Step Response".',
      'Set L = 100 mH, C = 100 µF. The natural angular frequency is ω_0 = 1/√(LC) = 316.2 rad/s.',
      'Critical resistance is R_crit = 2√(L/C) = 2√(0.1 / 10⁻⁴) = 2 × 31.62 ≈ 63.2 Ω.',
      'Test R = 15 Ω (R < R_crit): observe underdamped ringing oscillations with overshoot.',
      'Test R = 63 Ω (R ≈ R_crit): observe fastest arrival at 12 V with zero overshoot (critically damped).',
      'Test R = 300 Ω (R > R_crit): observe slow, sluggish non-oscillatory rise (overdamped).',
    ],
    expectedObservations:
      'The damping factor α = R / (2L) relative to ω_0 controls whether energy oscillates between L and C before settling or is dissipated slowly without overshoot.',
    setupParams: {
      circuitMode: 'transient',
      transientType: 'rlc',
      transientAction: 'step',
      resistance: 15,
      inductanceMilliHenries: 100,
      capacitanceMicroFarads: 100,
      dcSourceVoltage: 12,
    },
    question: 'What is the condition on R for critical damping in a series RLC circuit?',
    defaultAnswer: 'R = 2√(L/C), which corresponds to damping coefficient α = ω_0.',
  },
];

/**
 * 14 Rigorous Multiple-Choice Questions for Class 11/12 and Introductory Electronics
 */
export const RLC_QUIZ_QUESTIONS: RLCQuizQuestion[] = [
  {
    id: 1,
    question: 'How does inductive reactance X_L behave as the AC source frequency increases?',
    options: [
      'It decreases inversely with frequency (1/f)',
      'It increases linearly with frequency (X_L = 2πfL)',
      'It remains constant because inductance is constant',
      'It fluctuates sinusoidally',
    ],
    correctIndex: 1,
    explanation:
      'Inductive reactance is X_L = 2πfL = ωL. Because an inductor opposes changes in current (v = L di/dt), faster-changing signals encounter greater opposing back-EMF, causing X_L to increase linearly with frequency.',
  },
  {
    id: 2,
    question: 'What is the capacitive reactance X_C of an ideal capacitor connected to a pure DC voltage source (f = 0 Hz)?',
    options: [
      '0 Ω (short circuit)',
      'Infinity (open circuit)',
      'Equal to the resistance of the connecting wire',
      '1 Ω',
    ],
    correctIndex: 1,
    explanation:
      'Capacitive reactance is X_C = 1 / (2πfC). As frequency f approaches 0 (DC), X_C approaches infinity. Therefore, a capacitor completely blocks steady direct current (acting as an open circuit).',
  },
  {
    id: 3,
    question: 'In a series RLC circuit at the exact electrical resonance frequency f_0, what is the total impedance Z?',
    options: [
      'Z = 0 Ω',
      'Z = R (purely resistive)',
      'Z = X_L + X_C',
      'Z = √(R² + X_L²)',
    ],
    correctIndex: 1,
    explanation:
      'At resonance, X_L = X_C, so the net reactance (X_L - X_C) = 0. The impedance formula Z = √(R² + (X_L - X_C)²) reduces to Z = √(R²) = R. The impedance is at its minimum possible value.',
  },
  {
    id: 4,
    question: 'In a series RLC circuit where X_L > X_C, what is the phase relationship between current and source voltage?',
    options: [
      'Current leads source voltage by phase angle φ',
      'Current lags source voltage by phase angle φ',
      'Current and voltage are exactly 180° out of phase',
      'Current and voltage are in phase',
    ],
    correctIndex: 1,
    explanation:
      'When X_L > X_C, the circuit is inductive. In an inductor, voltage leads current (ELI: EMF leads Current in an Inductor). Therefore, the current LAGS the source voltage by angle φ = arctan((X_L - X_C)/R).',
  },
  {
    id: 5,
    question: 'What is the formula for the electrical resonance frequency f_0 of an RLC circuit?',
    options: [
      'f_0 = 1 / (2π √(LC))',
      'f_0 = 2π √(LC)',
      'f_0 = R / (2πL)',
      'f_0 = √(L / C) / (2πR)',
    ],
    correctIndex: 0,
    explanation:
      'Resonance occurs when X_L = X_C ⇒ 2πfL = 1 / (2πfC) ⇒ (2πf)² = 1 / (LC) ⇒ f_0 = 1 / (2π√(LC)).',
  },
  {
    id: 6,
    question: 'In an AC circuit, what does a power factor of cos(φ) = 1.0 (unity) signify?',
    options: [
      'All supplied power is stored as reactive energy',
      'Current and voltage are completely in phase, and all delivered power is real power dissipated in resistance',
      'The circuit has zero resistance',
      'Current is lagging voltage by 90°',
    ],
    correctIndex: 1,
    explanation:
      'A power factor of 1.0 means phase angle φ = 0°. Source voltage and current are in phase, reactive power Q_var = V I sin(0°) = 0, and apparent power S equals real dissipated power P = V I.',
  },
  {
    id: 7,
    question: 'How do ideal inductors and capacitors behave regarding average real power dissipation in AC steady state?',
    options: [
      'They dissipate real heat according to P = I²X',
      'They do not dissipate real power; they only store and return energy each half-cycle (average real power = 0 W)',
      'Inductors dissipate power, but capacitors generate power',
      'They dissipate power proportional to frequency',
    ],
    correctIndex: 1,
    explanation:
      'In ideal inductors and capacitors, current and voltage are 90° out of phase (cos(90°) = 0). Consequently, real average power P = V I cos(90°) = 0 W. They merely exchange reactive energy with the source and each other.',
  },
  {
    id: 8,
    question: 'In a parallel RLC circuit connected across an ideal AC voltage source, what happens to the total source current at the resonance frequency f_0?',
    options: [
      'Source current reaches its maximum peak value',
      'Source current reaches its minimum value because reactive branch currents cancel each other',
      'Source current drops to exactly zero regardless of resistance',
      'Source current becomes purely reactive',
    ],
    correctIndex: 1,
    explanation:
      'In an ideal parallel RLC circuit, branch currents I_L and I_C are 180° out of phase. At resonance, |I_L| = |I_C|, canceling out the reactive current entirely. The source only supplies the resistive current I_R = V/R, which is the minimum source current.',
  },
  {
    id: 9,
    question: 'What is the time constant τ of a series RC circuit during DC charging or discharging?',
    options: [
      'τ = R / C',
      'τ = R · C',
      'τ = 1 / (R · C)',
      'τ = √(R · C)',
    ],
    correctIndex: 1,
    explanation:
      'The time constant of an RC circuit is τ = R · C (ohms × farads = seconds). During charging from 0 V, after t = τ the capacitor voltage reaches V(1 - e⁻¹) ≈ 63.2% of the applied voltage.',
  },
  {
    id: 10,
    question: 'What is the time constant τ of an RL circuit connected to a DC source?',
    options: [
      'τ = L · R',
      'τ = L / R',
      'τ = R / L',
      'τ = 1 / (L · R)',
    ],
    correctIndex: 1,
    explanation:
      'For an RL circuit, the time constant is τ = L / R (henries / ohms = seconds). It governs the exponential rate at which current grows toward its steady-state Ohm’s law limit I_max = V / R.',
  },
  {
    id: 11,
    question: 'In a series RLC circuit, what condition on resistance R produces a critically damped step response?',
    options: [
      'R = 0 Ω',
      'R = 2 √(L / C)',
      'R = √(L / C) / 2',
      'R > 2 √(L / C)',
    ],
    correctIndex: 1,
    explanation:
      'Critical damping occurs when damping coefficient α = R / (2L) equals natural frequency ω_0 = 1 / √(LC). Equating them gives R / (2L) = 1 / √(LC) ⇒ R = 2 L / √(LC) = 2 √(L / C). This allows the circuit to settle to steady state in the fastest possible time without overshoot.',
  },
  {
    id: 12,
    question: 'What is the Quality Factor Q of a series RLC resonant circuit, and what does a high Q indicate?',
    options: [
      'Q = (1/R)√(L/C); a high Q indicates a sharp, narrow resonance peak with strong voltage magnification across L and C',
      'Q = R √(L/C); a high Q indicates high energy loss',
      'Q = 2πfL; a high Q indicates purely capacitive behavior',
      'Q = R / (2πL); a high Q indicates wide bandwidth',
    ],
    correctIndex: 0,
    explanation:
      'For a series RLC circuit, Q = (1/R)√(L/C) = ω_0 L / R. A high Q value means minimal resistive energy loss, leading to a sharp, narrow frequency selectivity curve (Δf = f_0 / Q) and large resonant voltage magnification across the inductor and capacitor (V_L = V_C = Q · V_source).',
  },
  {
    id: 13,
    question: 'At resonance in a high-Q series RLC circuit, can the RMS voltage across the inductor V_L exceed the source voltage V_source?',
    options: [
      'No, because energy conservation forbids any component voltage from exceeding the supply voltage',
      'Yes, V_L can be Q times larger than the source voltage (V_L = Q · V_source)',
      'Only if the frequency is above 10 kHz',
      'Only if the resistor is removed completely',
    ],
    correctIndex: 1,
    explanation:
      'Yes! At resonance, I = V_source / R. The voltage across the inductor is V_L = I · X_L = (V_source / R) · (ω_0 L) = Q · V_source. Because V_L and V_C are 180° out of phase, their voltages cancel in Kirchhoff’s loop (V_L + V_C = 0), allowing each individual voltage to be much larger than the input.',
  },
  {
    id: 14,
    question: 'What is the relationship between real power P (watts), apparent power S (volt-amperes), and power factor PF?',
    options: [
      'P = S / PF',
      'P = S · PF = V_RMS · I_RMS · cos(φ)',
      'P = S + PF',
      'P = S · sin(φ)',
    ],
    correctIndex: 1,
    explanation:
      'Real power is the actual rate of usable energy dissipated: P = S · cos(φ) = V_RMS · I_RMS · PF. Apparent power S represents the total volt-ampere product supplied by the generator.',
  },
];
