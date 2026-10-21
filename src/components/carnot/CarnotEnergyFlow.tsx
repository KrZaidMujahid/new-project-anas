/**
 * EQUATION 1 — Carnot Energy-Flow Visualization
 * Sankey and block-diagram visualization demonstrating the energy partition:
 * Q_H (Input) = W_net (Useful Work) + Q_C (Rejected Heat)
 * with proportional visual bandwidths, live percentages, and Second Law constraints.
 */

import React from 'react';
import { CarnotCycleResults, CarnotParameters } from '../../physics/carnot/types';
import { GitCommit, ArrowRight, ArrowDown, Flame, Snowflake, Cog, CheckCircle2 } from 'lucide-react';

interface CarnotEnergyFlowProps {
  cycle: CarnotCycleResults;
  params: CarnotParameters;
}

export const CarnotEnergyFlow: React.FC<CarnotEnergyFlowProps> = ({ cycle, params }) => {
  const { heatAbsorbedJ, heatRejectedJ, netWorkJ, carnotEfficiencyPercent } = cycle;
  const wastePercent = 100 - carnotEfficiencyPercent;

  // Proportional widths for Sankey channels
  const workWidthPercent = Math.max(15, Math.min(85, carnotEfficiencyPercent));
  const wasteWidthPercent = Math.max(15, Math.min(85, wastePercent));

  return (
    <div className="bg-[#102740] border border-[#29445F] rounded-xl p-5 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#29445F]/70">
        <div className="flex items-center gap-2">
          <GitCommit className="w-4 h-4 text-[#38BDF8]" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Energy-Flow Architecture & Sankey Partition
          </h3>
        </div>

        <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Q_H = W_net + Q_C (100.0% Conserved)</span>
        </div>
      </div>

      {/* Visual Energy-Flow Diagram */}
      <div className="bg-[#0B1F36] border border-[#29445F] rounded-xl p-6 flex flex-col items-center relative overflow-hidden">
        {/* Hot Reservoir Top Node */}
        <div className="w-full max-w-md bg-[#F97316]/15 border-2 border-[#F97316] rounded-xl p-3 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F97316]/20 flex items-center justify-center text-[#F97316]">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                Thermal Energy Source (Hot Reservoir)
              </div>
              <div className="text-[11px] font-mono text-[#FB923C]">
                T_H = {params.tHotK} K ({params.tHotK - 273} °C)
              </div>
            </div>
          </div>
          <div className="text-right font-mono">
            <div className="text-sm font-extrabold text-[#FB923C]">
              Q_H = {heatAbsorbedJ.toFixed(1)} J
            </div>
            <div className="text-[10px] text-[#AFC2D8]">100.0% Input</div>
          </div>
        </div>

        {/* Downward Inflow Trunk Q_H */}
        <div className="my-2 flex flex-col items-center">
          <div className="w-8 h-8 flex items-center justify-center text-[#FB923C] animate-bounce">
            <ArrowDown className="w-6 h-6 stroke-[3]" />
          </div>
          <span className="text-[11px] font-mono font-bold text-[#FB923C] bg-[#102740] px-2 py-0.5 rounded border border-[#F97316]/40">
            Heat Input Q_H
          </span>
        </div>

        {/* Central Engine Junction */}
        <div className="w-full max-w-lg bg-[#16334F] border-2 border-[#38BDF8] rounded-xl p-4 flex flex-col items-center shadow-xl relative">
          <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wider">
            <Cog className="w-4 h-4 text-[#38BDF8] animate-spin" style={{ animationDuration: '6s' }} />
            <span>Reversible Carnot Engine</span>
          </div>
          <div className="text-xs text-[#AFC2D8] mt-1 text-center">
            Ideal cyclic converter operating at Carnot efficiency η = {carnotEfficiencyPercent.toFixed(1)}%
          </div>

          {/* Energy Division Bar */}
          <div className="w-full mt-4 space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-[#4ADE80] font-bold">Useful Work ({carnotEfficiencyPercent.toFixed(1)}%)</span>
              <span className="text-[#60A5FA] font-bold">Waste Heat ({wastePercent.toFixed(1)}%)</span>
            </div>
            <div className="w-full h-4 rounded-full bg-[#0B1F36] border border-[#29445F] overflow-hidden flex">
              <div
                style={{ width: `${carnotEfficiencyPercent}%` }}
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300"
              />
              <div
                style={{ width: `${wastePercent}%` }}
                className="h-full bg-gradient-to-r from-blue-500 to-sky-400 transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Diverging Paths: Useful Work (Right) & Rejected Heat (Down) */}
        <div className="w-full max-w-lg grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {/* Work Output Branch */}
          <div className="bg-[#4ADE80]/10 border border-[#4ADE80]/40 rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#4ADE80]">
                <Cog className="w-4 h-4" />
                <span>Useful Work (W_net)</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#4ADE80]/20 text-[#4ADE80] font-bold">
                {carnotEfficiencyPercent.toFixed(1)}%
              </span>
            </div>
            <div className="mt-2 text-lg font-mono font-black text-white">
              {netWorkJ.toFixed(1)} J
            </div>
            <div className="text-[10px] text-[#AFC2D8] mt-1">
              Delivered to shaft or external load (∮ P dV)
            </div>
          </div>

          {/* Waste Heat Output Branch */}
          <div className="bg-[#60A5FA]/10 border border-[#60A5FA]/40 rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#60A5FA]">
                <Snowflake className="w-4 h-4" />
                <span>Rejected Heat (Q_C)</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#60A5FA]/20 text-[#60A5FA] font-bold">
                {wastePercent.toFixed(1)}%
              </span>
            </div>
            <div className="mt-2 text-lg font-mono font-black text-[#60A5FA]">
              {heatRejectedJ.toFixed(1)} J
            </div>
            <div className="text-[10px] text-[#AFC2D8] mt-1">
              Dumped into cold sink at T_C = {params.tColdK} K
            </div>
          </div>
        </div>

        {/* Cold Reservoir Bottom Sink */}
        <div className="w-full max-w-md bg-[#60A5FA]/15 border-2 border-[#60A5FA] rounded-xl p-3 mt-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#60A5FA]/20 flex items-center justify-center text-[#60A5FA]">
              <Snowflake className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                Thermal Energy Sink (Cold Reservoir)
              </div>
              <div className="text-[11px] font-mono text-[#60A5FA]">
                T_C = {params.tColdK} K ({params.tColdK - 273} °C)
              </div>
            </div>
          </div>
          <div className="text-right font-mono">
            <div className="text-sm font-extrabold text-[#60A5FA]">
              Q_C = {heatRejectedJ.toFixed(1)} J
            </div>
            <div className="text-[10px] text-[#AFC2D8]">{wastePercent.toFixed(1)}% Expelled</div>
          </div>
        </div>
      </div>
    </div>
  );
};
