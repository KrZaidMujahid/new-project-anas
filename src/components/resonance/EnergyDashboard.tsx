/**
 * EQUATION 1 — Resonance Energy & Power Dashboard (Section 10)
 * Live monitoring of kinetic energy K, spring potential energy U,
 * mechanical work done by driver ∫ P_drive dt, and cumulative viscous dissipation ∫ cv² dt.
 */

import React from 'react';
import { LiveOscillatorState, ResonanceParameters } from '../../physics/resonance/types';
import { Zap, Flame, BatteryCharging, Gauge, RotateCcw } from 'lucide-react';

interface EnergyDashboardProps {
  params: ResonanceParameters;
  state: LiveOscillatorState;
  onResetEnergy: () => void;
}

export const EnergyDashboard: React.FC<EnergyDashboardProps> = ({
  params,
  state,
  onResetEnergy,
}) => {
  const totalE = state.totalMechanicalEnergy;
  const kRatio = totalE > 0 ? (state.kineticEnergy / totalE) * 100 : 0;
  const uRatio = totalE > 0 ? (state.potentialEnergy / totalE) * 100 : 0;

  return (
    <div className="bg-[#101D30] border border-slate-800 rounded-xl p-4 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Energy in the Oscillating System
            </h2>
            <p className="text-[11px] text-slate-400">
              Live thermodynamic accounting of mechanical work, storage, and dissipation
            </p>
          </div>
        </div>

        <button
          onClick={onResetEnergy}
          className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors cursor-pointer"
          title="Reset cumulative energy integrals"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Integrals</span>
        </button>
      </div>

      {/* Energy Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Kinetic Energy K */}
        <div className="p-2.5 rounded-lg bg-[#07111F] border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">
            Kinetic Energy (K)
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-mono font-bold text-emerald-300">
              {state.kineticEnergy.toFixed(3)}
            </span>
            <span className="text-[10px] font-mono text-slate-500">J</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">K = ½ m v²</span>
        </div>

        {/* Potential Energy U */}
        <div className="p-2.5 rounded-lg bg-[#07111F] border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">
            Spring Potential (U)
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-mono font-bold text-cyan-300">
              {state.potentialEnergy.toFixed(3)}
            </span>
            <span className="text-[10px] font-mono text-slate-500">J</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">U = ½ k x²</span>
        </div>

        {/* Total Mechanical Energy E */}
        <div className="p-2.5 rounded-lg bg-[#07111F] border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">
            Total Mechanical (E)
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-mono font-bold text-white">
              {state.totalMechanicalEnergy.toFixed(3)}
            </span>
            <span className="text-[10px] font-mono text-slate-500">J</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">E = K + U</span>
        </div>

        {/* Dissipated Power P_damping */}
        <div className="p-2.5 rounded-lg bg-[#07111F] border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">
            Damping Dissipation Rate
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-mono font-bold text-rose-300">
              {state.powerDamping.toFixed(3)}
            </span>
            <span className="text-[10px] font-mono text-slate-500">W</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">P = c v²</span>
        </div>
      </div>

      {/* Dynamic Energy Proportion Bar */}
      <div className="space-y-1.5 p-3 rounded-lg bg-[#07111F] border border-slate-800">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-emerald-400">Kinetic: {kRatio.toFixed(1)}%</span>
          <span className="text-slate-400">Total: {totalE.toFixed(3)} J</span>
          <span className="text-cyan-400">Potential: {uRatio.toFixed(1)}%</span>
        </div>
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-emerald-500 transition-all duration-75"
            style={{ width: `${kRatio}%` }}
          />
          <div
            className="h-full bg-cyan-500 transition-all duration-75"
            style={{ width: `${uRatio}%` }}
          />
        </div>
      </div>

      {/* Cumulative Work & Dissipation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-2.5 rounded-lg bg-[#07111F] border border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BatteryCharging className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300">Driver Work Injected:</span>
          </div>
          <span className="font-mono font-bold text-amber-300">
            {state.cumulativeDriveWork.toFixed(2)} J
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-[#07111F] border border-rose-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-400" />
            <span className="text-slate-300">Total Viscous Heat Dissipated:</span>
          </div>
          <span className="font-mono font-bold text-rose-300">
            {state.cumulativeDissipatedEnergy.toFixed(2)} J
          </span>
        </div>
      </div>
    </div>
  );
};
