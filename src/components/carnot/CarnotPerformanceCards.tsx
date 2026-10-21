/**
 * EQUATION 1 — Carnot Heat Engine Laboratory
 * Live Performance Cards:
 * A. Carnot Efficiency (eta = 1 - T_C / T_H)
 * B. Heat Absorbed (Q_H)
 * C. Heat Rejected (Q_C)
 * D. Net Useful Work (W_net)
 */

import React from 'react';
import { CarnotCycleResults, CarnotParameters } from '../../physics/carnot/types';
import { Flame, Snowflake, Cog, Zap, CheckCircle2 } from 'lucide-react';

interface CarnotPerformanceCardsProps {
  cycle: CarnotCycleResults;
  params: CarnotParameters;
}

export const CarnotPerformanceCards: React.FC<CarnotPerformanceCardsProps> = ({
  cycle,
  params,
}) => {
  // Format Joules into J or kJ with appropriate precision
  const formatEnergy = (joules: number) => {
    if (Math.abs(joules) >= 1000) {
      return {
        value: (joules / 1000).toFixed(2),
        unit: 'kJ',
      };
    }
    return {
      value: joules.toFixed(1),
      unit: 'J',
    };
  };

  const qH = formatEnergy(cycle.heatAbsorbedJ);
  const qC = formatEnergy(cycle.heatRejectedJ);
  const wNet = formatEnergy(cycle.netWorkJ);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card A: Carnot Efficiency */}
      <div className="bg-[#102740] border border-[#29445F] rounded-xl p-4.5 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-[#38BDF8]/60 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-[#AFC2D8]">
            Card A · Theoretical Max
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
            <Zap className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#F1F5F9] tracking-tight">
            {cycle.carnotEfficiencyPercent.toFixed(1)}
            <span className="text-lg text-[#38BDF8] ml-1">%</span>
          </div>
          <div className="text-xs text-[#AFC2D8] mt-1 flex items-center justify-between">
            <span className="font-medium text-white">Carnot Efficiency (η)</span>
            <span className="font-mono text-[11px] text-[#38BDF8]">
              1 − T_C/T_H
            </span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#29445F]/60 flex items-center justify-between text-[11px] font-mono text-[#AFC2D8]">
          <span>T_H: {params.tHotK} K</span>
          <span className="text-slate-600">·</span>
          <span>T_C: {params.tColdK} K</span>
        </div>
      </div>

      {/* Card B: Heat Absorbed Q_H */}
      <div className="bg-[#102740] border border-[#29445F] rounded-xl p-4.5 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-[#F97316]/60 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-[#AFC2D8]">
            Card B · Heat Input
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 border border-[#F97316]/30 flex items-center justify-center text-[#F97316]">
            <Flame className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#FB923C] tracking-tight">
            {qH.value}
            <span className="text-lg text-[#AFC2D8] ml-1">{qH.unit}</span>
          </div>
          <div className="text-xs text-[#AFC2D8] mt-1 flex items-center justify-between">
            <span className="font-medium text-white">Heat Absorbed (Q_H)</span>
            <span className="font-mono text-[11px] text-[#FB923C]">
              Stage 1 (A→B)
            </span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#29445F]/60 flex items-center justify-between text-[11px] font-mono text-[#AFC2D8]">
          <span>Isothermal at {params.tHotK} K</span>
          <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
            <CheckCircle2 className="w-3 h-3" /> ΔU = 0
          </span>
        </div>
      </div>

      {/* Card C: Heat Rejected Q_C */}
      <div className="bg-[#102740] border border-[#29445F] rounded-xl p-4.5 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-[#60A5FA]/60 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-[#AFC2D8]">
            Card C · Cold Reservoir
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#60A5FA]/10 border border-[#60A5FA]/30 flex items-center justify-center text-[#60A5FA]">
            <Snowflake className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#60A5FA] tracking-tight">
            {qC.value}
            <span className="text-lg text-[#AFC2D8] ml-1">{qC.unit}</span>
          </div>
          <div className="text-xs text-[#AFC2D8] mt-1 flex items-center justify-between">
            <span className="font-medium text-white">Heat Rejected (Q_C)</span>
            <span className="font-mono text-[11px] text-[#60A5FA]">
              Stage 3 (C→D)
            </span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#29445F]/60 flex items-center justify-between text-[11px] font-mono text-[#AFC2D8]">
          <span>Isothermal at {params.tColdK} K</span>
          <span className="text-slate-400 text-[10px] font-mono">
            Loss: {((1 - cycle.carnotEfficiency) * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Card D: Net Work per Cycle W_net */}
      <div className="bg-[#102740] border border-[#29445F] rounded-xl p-4.5 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-[#4ADE80]/60 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-[#AFC2D8]">
            Card D · Shaft / Mechanical
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#4ADE80]/10 border border-[#4ADE80]/30 flex items-center justify-center text-[#4ADE80]">
            <Cog className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#4ADE80] tracking-tight">
            {wNet.value}
            <span className="text-lg text-[#AFC2D8] ml-1">{wNet.unit}</span>
          </div>
          <div className="text-xs text-[#AFC2D8] mt-1 flex items-center justify-between">
            <span className="font-medium text-white">Net Work (W_net)</span>
            <span className="font-mono text-[11px] text-[#4ADE80]">
              Q_H − Q_C
            </span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#29445F]/60 flex items-center justify-between text-[11px] font-mono text-[#AFC2D8]">
          <span>{params.numCycles > 1 ? `${params.numCycles} Cycles: ${(cycle.totalWorkJ >= 1000 ? (cycle.totalWorkJ / 1000).toFixed(2) + ' kJ' : cycle.totalWorkJ.toFixed(0) + ' J')}` : 'Enclosed P-V Area'}</span>
          <span className="text-emerald-400 font-mono text-[10px]">
            ∮ P dV
          </span>
        </div>
      </div>
    </div>
  );
};
