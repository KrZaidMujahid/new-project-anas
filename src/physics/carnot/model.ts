/**
 * EQUATION 1 — Carnot Heat Engine Physics Engine
 * Centralized thermodynamic calculations, analytical state equations,
 * instantaneous stage trajectories, and energy balance verification.
 */

import {
  CarnotParameters,
  CarnotCycleResults,
  ThermodynamicState,
  StageDetails,
  InstantaneousEngineState,
  CarnotStageId,
  CycleStateId,
  TemperaturePreset,
} from './types';

// Universal Gas Constant
export const R_UNIVERSAL = 8.314462618; // J / (mol * K)

// Heat capacity ratios
export const GAMMA_MONATOMIC = 5 / 3; // ~1.6667
export const GAMMA_DIATOMIC = 7 / 5; // 1.4

export function getGamma(gasType: 'monatomic' | 'diatomic'): number {
  return gasType === 'monatomic' ? GAMMA_MONATOMIC : GAMMA_DIATOMIC;
}

/**
 * Standard Temperature Presets for thermodynamic inquiry
 */
export const CARNOT_PRESETS: TemperaturePreset[] = [
  {
    id: 'classroom-standard',
    name: 'Classroom Benchmark (600 K / 300 K)',
    tHotK: 600,
    tColdK: 300,
    description: 'Classic textbook example with exactly 50% Carnot efficiency.',
  },
  {
    id: 'steam-engine',
    name: 'Historic Watt Steam Engine (373 K / 293 K)',
    tHotK: 373,
    tColdK: 293,
    description: 'Early industrial steam cycle operating between boiling water and ambient cooling water (21.4% max efficiency).',
  },
  {
    id: 'modern-gas-turbine',
    name: 'Modern Supercritical Turbine (850 K / 300 K)',
    tHotK: 850,
    tColdK: 300,
    description: 'Advanced aerospace and combined-cycle turbine threshold (64.7% theoretical efficiency).',
  },
  {
    id: 'cryogenic-cooler',
    name: 'Cryogenic Regime (300 K / 120 K)',
    tHotK: 300,
    tColdK: 120,
    description: 'Room-temperature heat source rejecting heat into a liquid-nitrogen cold reservoir (60.0% efficiency).',
  },
  {
    id: 'low-delta-t',
    name: 'Ocean Thermal Energy / Low-ΔT (310 K / 280 K)',
    tHotK: 310,
    tColdK: 280,
    description: 'Ocean thermal energy conversion (OTEC) with only 30 K temperature differential (9.7% efficiency).',
  },
  {
    id: 'fusion-limit',
    name: 'High-Temperature Reactor (1000 K / 300 K)',
    tHotK: 1000,
    tColdK: 300,
    description: 'Upper material boundary of modern ceramic heat exchangers (70.0% maximum efficiency).',
  },
];

/**
 * Validates and sanitizes thermodynamic parameters, guaranteeing T_H > T_C.
 */
export function sanitizeParameters(params: CarnotParameters): CarnotParameters {
  const tHotK = Math.min(1000, Math.max(300, params.tHotK));
  // Guarantee T_C is strictly less than T_H with at least a 10 K delta
  const maxTCold = Math.min(500, tHotK - 10);
  const tColdK = Math.min(maxTCold, Math.max(100, params.tColdK));
  const moles = Math.min(2.0, Math.max(0.1, params.moles));
  const initialVolumeL = Math.min(10.0, Math.max(1.0, params.initialVolumeL));
  const numCycles = Math.min(100, Math.max(1, Math.round(params.numCycles)));

  return {
    tHotK,
    tColdK,
    moles,
    initialVolumeL,
    gasType: params.gasType,
    numCycles,
  };
}

/**
 * Computes all state points (A, B, C, D), stage energetics, and integral efficiency.
 * Following Section 9:
 * r = (T_H / T_C)^(1 / (gamma - 1))
 * V_A = initialVolumeL
 * V_B = r * V_A
 * V_C = r^2 * V_A
 * V_D = r * V_A
 */
export function computeCarnotCycle(params: CarnotParameters): CarnotCycleResults {
  const sanitized = sanitizeParameters(params);
  const { tHotK, tColdK, moles, initialVolumeL, gasType, numCycles } = sanitized;
  const gamma = getGamma(gasType);
  const R = R_UNIVERSAL;

  // Expansion ratio r
  const adiabaticRatio = Math.pow(tHotK / tColdK, 1 / (gamma - 1));
  const isothermalRatio = adiabaticRatio; // V_B / V_A = r

  // Volumes in Liters and m^3
  const vAL = initialVolumeL;
  const vBL = adiabaticRatio * vAL;
  const vCL = adiabaticRatio * vBL; // r^2 * V_A
  const vDL = adiabaticRatio * vAL; // r * V_A

  const vAM3 = vAL * 1e-3;
  const vBM3 = vBL * 1e-3;
  const vCM3 = vCL * 1e-3;
  const vDM3 = vDL * 1e-3;

  // Pressures from Ideal Gas Law: P = n R T / V
  // Pa = (mol * J/(mol*K) * K) / m^3 = N/m^2 = Pa
  const pAPa = (moles * R * tHotK) / vAM3;
  const pBPa = (moles * R * tHotK) / vBM3;
  const pCPa = (moles * R * tColdK) / vCM3;
  const pDPa = (moles * R * tColdK) / vDM3;

  const pAKPa = pAPa / 1000;
  const pBKPa = pBPa / 1000;
  const pCKPa = pCPa / 1000;
  const pDKPa = pDPa / 1000;

  // State objects
  const stateA: ThermodynamicState = {
    id: 'A',
    name: 'State A (Start of Isothermal Expansion)',
    processArriving: 'From D via Reversible Adiabatic Compression',
    temperatureK: tHotK,
    temperatureC: tHotK - 273.15,
    volumeL: vAL,
    volumeM3: vAM3,
    pressureKPa: pAKPa,
    pressurePa: pAPa,
  };

  const stateB: ThermodynamicState = {
    id: 'B',
    name: 'State B (End of Isothermal Expansion)',
    processArriving: 'From A via Reversible Isothermal Expansion at T_H',
    temperatureK: tHotK,
    temperatureC: tHotK - 273.15,
    volumeL: vBL,
    volumeM3: vBM3,
    pressureKPa: pBKPa,
    pressurePa: pBPa,
  };

  const stateC: ThermodynamicState = {
    id: 'C',
    name: 'State C (End of Adiabatic Expansion)',
    processArriving: 'From B via Reversible Adiabatic Expansion (T_H -> T_C)',
    temperatureK: tColdK,
    temperatureC: tColdK - 273.15,
    volumeL: vCL,
    volumeM3: vCM3,
    pressureKPa: pCKPa,
    pressurePa: pCPa,
  };

  const stateD: ThermodynamicState = {
    id: 'D',
    name: 'State D (End of Isothermal Compression)',
    processArriving: 'From C via Reversible Isothermal Compression at T_C',
    temperatureK: tColdK,
    temperatureC: tColdK - 273.15,
    volumeL: vDL,
    volumeM3: vDM3,
    pressureKPa: pDKPa,
    pressurePa: pDPa,
  };

  // Stage 1: Isothermal Expansion A -> B
  // W_AB = n R T_H ln(V_B / V_A) = Q_AB; Delta U_AB = 0
  const work1 = moles * R * tHotK * Math.log(vBL / vAL);
  const heat1 = work1;
  const deltaU1 = 0;

  const stage1: StageDetails = {
    id: 1,
    name: 'Stage 1: Isothermal Expansion (A → B)',
    type: 'isothermal_expansion',
    fromState: 'A',
    toState: 'B',
    startVolumeL: vAL,
    endVolumeL: vBL,
    startPressureKPa: pAKPa,
    endPressureKPa: pBKPa,
    startTempK: tHotK,
    endTempK: tHotK,
    heatJ: heat1,
    workJ: work1,
    deltaInternalEnergyJ: deltaU1,
    reservoirInContact: 'hot',
    description: 'Gas absorbs heat Q_H from the hot reservoir at constant T_H, doing positive work as the piston expands outward.',
    keyEquation: 'W_{AB} = n R T_H \\ln\\left(\\frac{V_B}{V_A}\\right) = Q_H',
  };

  // Stage 2: Adiabatic Expansion B -> C
  // Q_BC = 0; W_BC = n R (T_H - T_C) / (gamma - 1); Delta U_BC = -W_BC
  const work2 = (moles * R * (tHotK - tColdK)) / (gamma - 1);
  const heat2 = 0;
  const deltaU2 = -work2;

  const stage2: StageDetails = {
    id: 2,
    name: 'Stage 2: Adiabatic Expansion (B → C)',
    type: 'adiabatic_expansion',
    fromState: 'B',
    toState: 'C',
    startVolumeL: vBL,
    endVolumeL: vCL,
    startPressureKPa: pBKPa,
    endPressureKPa: pCKPa,
    startTempK: tHotK,
    endTempK: tColdK,
    heatJ: heat2,
    workJ: work2,
    deltaInternalEnergyJ: deltaU2,
    reservoirInContact: 'none',
    description: 'Cylinder is thermally insulated (Q = 0). Gas expands doing work at the expense of its internal energy, cooling to T_C.',
    keyEquation: 'W_{BC} = \\frac{n R (T_H - T_C)}{\\gamma - 1} = -\\Delta U_{BC}',
  };

  // Stage 3: Isothermal Compression C -> D
  // W_CD = n R T_C ln(V_D / V_C) < 0; Q_CD = W_CD; Delta U_CD = 0; Q_C = -Q_CD > 0
  const work3 = moles * R * tColdK * Math.log(vDL / vCL);
  const heat3 = work3;
  const deltaU3 = 0;

  const stage3: StageDetails = {
    id: 3,
    name: 'Stage 3: Isothermal Compression (C → D)',
    type: 'isothermal_compression',
    fromState: 'C',
    toState: 'D',
    startVolumeL: vCL,
    endVolumeL: vDL,
    startPressureKPa: pCKPa,
    endPressureKPa: pDKPa,
    startTempK: tColdK,
    endTempK: tColdK,
    heatJ: heat3,
    workJ: work3,
    deltaInternalEnergyJ: deltaU3,
    reservoirInContact: 'cold',
    description: 'Cylinder touches cold reservoir at T_C. Work is done ON the gas (W < 0) as it rejects heat Q_C into the reservoir.',
    keyEquation: 'Q_C = -W_{CD} = n R T_C \\ln\\left(\\frac{V_C}{V_D}\\right)',
  };

  // Stage 4: Adiabatic Compression D -> A
  // Q_DA = 0; W_DA = n R (T_C - T_H) / (gamma - 1) = -W_BC; Delta U_DA = -W_DA = +W_BC
  const work4 = (moles * R * (tColdK - tHotK)) / (gamma - 1);
  const heat4 = 0;
  const deltaU4 = -work4;

  const stage4: StageDetails = {
    id: 4,
    name: 'Stage 4: Adiabatic Compression (D → A)',
    type: 'adiabatic_compression',
    fromState: 'D',
    toState: 'A',
    startVolumeL: vDL,
    endVolumeL: vAL,
    startPressureKPa: pDKPa,
    endPressureKPa: pAKPa,
    startTempK: tColdK,
    endTempK: tHotK,
    heatJ: heat4,
    workJ: work4,
    deltaInternalEnergyJ: deltaU4,
    reservoirInContact: 'none',
    description: 'Cylinder is insulated (Q = 0). Compressing the gas increases its internal energy, heating it back to initial state A (T_H).',
    keyEquation: 'W_{DA} = \\frac{n R (T_C - T_H)}{\\gamma - 1} = -W_{BC}',
  };

  // Integral Energetics
  const heatAbsorbedJ = heat1; // Q_H > 0
  const heatRejectedJ = -heat3; // Q_C > 0
  const netWorkJ = work1 + work2 + work3 + work4; // = work1 + work3
  const carnotEfficiency = 1 - tColdK / tHotK;
  const carnotEfficiencyPercent = carnotEfficiency * 100;

  const totalWorkJ = netWorkJ * numCycles;
  const totalHeatAbsorbedJ = heatAbsorbedJ * numCycles;
  const totalHeatRejectedJ = heatRejectedJ * numCycles;

  // Energy Conservation Check: Q_H = W_net + Q_C
  const energyResidualJ = Math.abs(heatAbsorbedJ - (heatRejectedJ + netWorkJ));
  const energyConserved = energyResidualJ < 1e-6;

  // Efficiency consistency check: W_net / Q_H = eta
  const efficiencyByWork = heatAbsorbedJ > 0 ? netWorkJ / heatAbsorbedJ : 0;
  const efficiencyAgrees = Math.abs(efficiencyByWork - carnotEfficiency) < 1e-6;

  return {
    gamma,
    rUniversal: R,
    states: {
      A: stateA,
      B: stateB,
      C: stateC,
      D: stateD,
    },
    stages: {
      1: stage1,
      2: stage2,
      3: stage3,
      4: stage4,
    },
    heatAbsorbedJ,
    heatRejectedJ,
    netWorkJ,
    carnotEfficiency,
    carnotEfficiencyPercent,
    totalWorkJ,
    totalHeatAbsorbedJ,
    totalHeatRejectedJ,
    energyConserved,
    energyResidualJ,
    efficiencyAgrees,
    adiabaticRatio,
    isothermalRatio,
  };
}

/**
 * Calculates instantaneous engine state given current stage and fraction (0 to 1).
 */
export function getInstantaneousEngineState(
  cycle: CarnotCycleResults,
  currentStage: CarnotStageId,
  progress: number // clamped 0 to 1
): InstantaneousEngineState {
  const p = Math.max(0, Math.min(1, progress));
  const { states, stages } = cycle;
  const vMin = states.A.volumeL;
  const vMax = states.C.volumeL;

  let volumeL = vMin;
  let temperatureK = states.A.temperatureK;
  let pressureKPa = states.A.pressureKPa;
  let currentStateId: CycleStateId = 'A';
  let heatTransferCurrentStageJ = 0;
  let workDoneCurrentStageJ = 0;
  let heatFlowActive: 'in' | 'out' | 'none' = 'none';
  let heatFlowRateNormalized = 0;
  let pistonVelocityDirection: 'expanding' | 'compressing' | 'stationary' = 'expanding';

  if (currentStage === 1) {
    // Stage 1: Isothermal expansion A -> B at T_H
    // V(p) = V_A * (V_B / V_A)^p
    currentStateId = p < 0.5 ? 'A' : 'B';
    temperatureK = states.A.temperatureK;
    volumeL = states.A.volumeL * Math.pow(states.B.volumeL / states.A.volumeL, p);
    pressureKPa = states.A.pressureKPa * (states.A.volumeL / volumeL);
    workDoneCurrentStageJ = stages[1].workJ * p;
    heatTransferCurrentStageJ = stages[1].heatJ * p;
    heatFlowActive = 'in';
    heatFlowRateNormalized = Math.sin(p * Math.PI) * 0.8 + 0.2;
    pistonVelocityDirection = 'expanding';
  } else if (currentStage === 2) {
    // Stage 2: Adiabatic expansion B -> C from T_H to T_C
    // V(p) = V_B * (V_C / V_B)^p
    currentStateId = p < 0.5 ? 'B' : 'C';
    volumeL = states.B.volumeL * Math.pow(states.C.volumeL / states.B.volumeL, p);
    // T * V^(gamma - 1) = const
    temperatureK = states.B.temperatureK * Math.pow(states.B.volumeL / volumeL, cycle.gamma - 1);
    // P * V^gamma = const
    pressureKPa = states.B.pressureKPa * Math.pow(states.B.volumeL / volumeL, cycle.gamma);
    workDoneCurrentStageJ = stages[2].workJ * p;
    heatTransferCurrentStageJ = 0;
    heatFlowActive = 'none';
    heatFlowRateNormalized = 0;
    pistonVelocityDirection = 'expanding';
  } else if (currentStage === 3) {
    // Stage 3: Isothermal compression C -> D at T_C
    // V(p) = V_C * (V_D / V_C)^p
    currentStateId = p < 0.5 ? 'C' : 'D';
    temperatureK = states.C.temperatureK;
    volumeL = states.C.volumeL * Math.pow(states.D.volumeL / states.C.volumeL, p);
    pressureKPa = states.C.pressureKPa * (states.C.volumeL / volumeL);
    workDoneCurrentStageJ = stages[3].workJ * p;
    heatTransferCurrentStageJ = stages[3].heatJ * p;
    heatFlowActive = 'out';
    heatFlowRateNormalized = Math.sin(p * Math.PI) * 0.8 + 0.2;
    pistonVelocityDirection = 'compressing';
  } else {
    // Stage 4: Adiabatic compression D -> A from T_C to T_H
    // V(p) = V_D * (V_A / V_D)^p
    currentStateId = p < 0.5 ? 'D' : 'A';
    volumeL = states.D.volumeL * Math.pow(states.A.volumeL / states.D.volumeL, p);
    temperatureK = states.D.temperatureK * Math.pow(states.D.volumeL / volumeL, cycle.gamma - 1);
    pressureKPa = states.D.pressureKPa * Math.pow(states.D.volumeL / volumeL, cycle.gamma);
    workDoneCurrentStageJ = stages[4].workJ * p;
    heatTransferCurrentStageJ = 0;
    heatFlowActive = 'none';
    heatFlowRateNormalized = 0;
    pistonVelocityDirection = 'compressing';
  }

  // Normalized piston displacement between min volume (A) and max volume (C)
  const pistonPositionNormalized = vMax > vMin ? (volumeL - vMin) / (vMax - vMin) : 0;

  return {
    currentStage,
    progressInStage: p,
    currentStateId,
    temperatureK,
    temperatureC: temperatureK - 273.15,
    volumeL,
    pressureKPa,
    pistonPositionNormalized: Math.max(0, Math.min(1, pistonPositionNormalized)),
    heatTransferCurrentStageJ,
    workDoneCurrentStageJ,
    heatFlowActive,
    heatFlowRateNormalized,
    pistonVelocityDirection,
  };
}

/**
 * Generates an array of points for the P-V diagram curves.
 */
export interface PVCurvePoint {
  volumeL: number;
  pressureKPa: number;
}

export function generatePVPath(
  cycle: CarnotCycleResults,
  numSamplesPerStage = 60
): {
  stage1: PVCurvePoint[];
  stage2: PVCurvePoint[];
  stage3: PVCurvePoint[];
  stage4: PVCurvePoint[];
  fullCycleSvgPath: string;
} {
  const stage1: PVCurvePoint[] = [];
  const stage2: PVCurvePoint[] = [];
  const stage3: PVCurvePoint[] = [];
  const stage4: PVCurvePoint[] = [];

  // Stage 1: Isothermal A -> B
  for (let i = 0; i <= numSamplesPerStage; i++) {
    const p = i / numSamplesPerStage;
    const v = cycle.states.A.volumeL * Math.pow(cycle.states.B.volumeL / cycle.states.A.volumeL, p);
    const pres = cycle.states.A.pressureKPa * (cycle.states.A.volumeL / v);
    stage1.push({ volumeL: v, pressureKPa: pres });
  }

  // Stage 2: Adiabatic B -> C
  for (let i = 0; i <= numSamplesPerStage; i++) {
    const p = i / numSamplesPerStage;
    const v = cycle.states.B.volumeL * Math.pow(cycle.states.C.volumeL / cycle.states.B.volumeL, p);
    const pres = cycle.states.B.pressureKPa * Math.pow(cycle.states.B.volumeL / v, cycle.gamma);
    stage2.push({ volumeL: v, pressureKPa: pres });
  }

  // Stage 3: Isothermal C -> D
  for (let i = 0; i <= numSamplesPerStage; i++) {
    const p = i / numSamplesPerStage;
    const v = cycle.states.C.volumeL * Math.pow(cycle.states.D.volumeL / cycle.states.C.volumeL, p);
    const pres = cycle.states.C.pressureKPa * (cycle.states.C.volumeL / v);
    stage3.push({ volumeL: v, pressureKPa: pres });
  }

  // Stage 4: Adiabatic D -> A
  for (let i = 0; i <= numSamplesPerStage; i++) {
    const p = i / numSamplesPerStage;
    const v = cycle.states.D.volumeL * Math.pow(cycle.states.A.volumeL / cycle.states.D.volumeL, p);
    const pres = cycle.states.D.pressureKPa * Math.pow(cycle.states.D.volumeL / v, cycle.gamma);
    stage4.push({ volumeL: v, pressureKPa: pres });
  }

  return {
    stage1,
    stage2,
    stage3,
    stage4,
    fullCycleSvgPath: '', // Computed in UI with coordinate mapper
  };
}
