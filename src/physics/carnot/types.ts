/**
 * EQUATION 1 — Carnot Heat Engine Laboratory Types
 * Comprehensive data types for ideal reversible Carnot cycle,
 * thermodynamic states, cycle stages, energy balance, and experiment logs.
 */

export type WorkingGasType = 'monatomic' | 'diatomic';

export interface CarnotParameters {
  // Thermal reservoirs
  tHotK: number; // T_H: 300 K to 1000 K (default: 600 K)
  tColdK: number; // T_C: 100 K to 500 K (default: 300 K, constraint: tColdK < tHotK)

  // Working gas properties
  moles: number; // n: 0.1 mol to 2.0 mol (default: 1.0 mol)
  initialVolumeL: number; // V_A: 1.0 L to 10.0 L (default: 2.0 L)
  gasType: WorkingGasType; // 'monatomic' (gamma = 5/3) or 'diatomic' (gamma = 7/5)

  // Multi-cycle calculation
  numCycles: number; // N: 1 to 100 (default: 1)
}

export type CarnotStageId = 1 | 2 | 3 | 4;

export type CycleStateId = 'A' | 'B' | 'C' | 'D';

export interface ThermodynamicState {
  id: CycleStateId;
  name: string;
  processArriving: string;
  temperatureK: number;
  temperatureC: number;
  volumeL: number;
  volumeM3: number;
  pressureKPa: number;
  pressurePa: number;
}

export interface StageDetails {
  id: CarnotStageId;
  name: string;
  type: 'isothermal_expansion' | 'adiabatic_expansion' | 'isothermal_compression' | 'adiabatic_compression';
  fromState: CycleStateId;
  toState: CycleStateId;
  startVolumeL: number;
  endVolumeL: number;
  startPressureKPa: number;
  endPressureKPa: number;
  startTempK: number;
  endTempK: number;
  heatJ: number; // Positive into gas, negative out
  workJ: number; // Work done BY gas
  deltaInternalEnergyJ: number; // Delta U = Q - W
  reservoirInContact: 'hot' | 'cold' | 'none';
  description: string;
  keyEquation: string;
}

export interface CarnotCycleResults {
  // Gas constant and ratio
  gamma: number;
  rUniversal: number; // 8.314462618 J/(mol*K)

  // States A, B, C, D
  states: {
    A: ThermodynamicState;
    B: ThermodynamicState;
    C: ThermodynamicState;
    D: ThermodynamicState;
  };

  // Stage details
  stages: {
    1: StageDetails;
    2: StageDetails;
    3: StageDetails;
    4: StageDetails;
  };

  // Integral energetics for 1 cycle
  heatAbsorbedJ: number; // Q_H = Q_AB (> 0)
  heatRejectedJ: number; // Q_C = -Q_CD (> 0)
  netWorkJ: number; // W_net = Q_H - Q_C = W_AB + W_BC + W_CD + W_DA
  carnotEfficiency: number; // eta = 1 - T_C / T_H (0 to 1)
  carnotEfficiencyPercent: number; // eta * 100%

  // Multi-cycle totals
  totalWorkJ: number; // numCycles * netWorkJ
  totalHeatAbsorbedJ: number; // numCycles * heatAbsorbedJ
  totalHeatRejectedJ: number; // numCycles * heatRejectedJ

  // Energy conservation check
  energyConserved: boolean;
  energyResidualJ: number; // |Q_H - (Q_C + W_net)|
  efficiencyAgrees: boolean;

  // Expansion ratios
  adiabaticRatio: number; // (T_H / T_C)^(1 / (gamma - 1))
  isothermalRatio: number; // V_B / V_A = V_C / V_D
}

export interface InstantaneousEngineState {
  currentStage: CarnotStageId;
  progressInStage: number; // 0 to 1
  currentStateId: CycleStateId;
  temperatureK: number;
  temperatureC: number;
  volumeL: number;
  pressureKPa: number;
  pistonPositionNormalized: number; // 0 (min volume) to 1 (max volume)
  heatTransferCurrentStageJ: number;
  workDoneCurrentStageJ: number;
  heatFlowActive: 'in' | 'out' | 'none';
  heatFlowRateNormalized: number; // 0 to 1
  pistonVelocityDirection: 'expanding' | 'compressing' | 'stationary';
}

export interface CarnotObservation {
  id: string;
  experimentNumber: number;
  timestamp: number;
  tHotK: number;
  tColdK: number;
  moles: number;
  initialVolumeL: number;
  gasType: WorkingGasType;
  efficiencyPercent: number;
  heatAbsorbedJ: number;
  heatRejectedJ: number;
  netWorkJ: number;
  notes?: string;
}

export interface TemperaturePreset {
  id: string;
  name: string;
  tHotK: number;
  tColdK: number;
  description: string;
}
