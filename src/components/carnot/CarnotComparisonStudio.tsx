/**
 * EQUATION 1 — Carnot Temperature Comparison Experiment Studio
 * Comparative inquiry tool exploring the Carnot limit across diverse physical systems:
 * - Real-world thermodynamic power cycles (Steam, Combined-cycle, OTEC, Cryogenics)
 * - Interactive parameter sweep graphs (η vs T_H and η vs T_C)
 * - Direct "Load into Laboratory" action for seamless experimental workflows
 */

import React, { useState } from 'react';
import { CarnotParameters } from '../../physics/carnot/types';
import { CARNOT_PRESETS } from '../../physics/carnot/model';
import { BarChart3, ArrowRight, Zap, Flame, Snowflake, Sparkles, TrendingUp } from 'lucide-react';

interface CarnotComparisonStudioProps {
  currentParams: CarnotParameters;
  onApplyPreset: (tHotK: number, tColdK: number) => void;
}

export const CarnotComparisonStudio: React.FC<CarnotComparisonStudioProps> = ({
  currentParams,
  onApplyPreset,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(CARNOT_PRESETS[0].id);

  // Generate sweep data for Carnot efficiency as a function of T_H (from 300 to 1000 K with current T_C)
  const tHotSteps = [350, 400, 500, 600, 700, 800, 900, 1000];
  const sweepData = tHotSteps.map((th) => {
    const eff = Math.max(0, 1 - currentParams.tColdK / th) * 100;
    return { th, eff };
  });

  return (
    <div className="bg-[#102740] border border-[#29445F] rounded-xl p-5 shadow-xl flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#29445F]/70">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#38BDF8]" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Comparative Temperature Inquiry: The Carnot Limit Across Regimes
          </h3>
        </div>

        <span className="text-xs font-mono text-[#AFC2D8]">
          η_Carnot = 1 − T_C / T_H
        </span>
      </div>

      {/* Real-World Systems Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {CARNOT_PRESETS.map((preset) => {
          const efficiency = ((1 - preset.tColdK / preset.tHotK) * 100).toFixed(1);
          const isCurrent =
            currentParams.tHotK === preset.tHotK && currentParams.tColdK === preset.tColdK;

          return (
            <div
              key={preset.id}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                isCurrent
                  ? 'bg-[#16334F] border-[#38BDF8] shadow-md ring-1 ring-[#38BDF8]/40'
                  : 'bg-[#0B1F36] border-[#29445F] hover:border-slate-500'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white tracking-wide">
                    {preset.name.split('(')[0]}
                  </span>
                  <span className="text-xs font-mono font-black text-[#4ADE80]">
                    {efficiency}%
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-2 text-[11px] font-mono text-[#AFC2D8]">
                  <span className="text-[#FB923C] flex items-center gap-1">
                    <Flame className="w-3 h-3" /> {preset.tHotK} K
                  </span>
                  <span className="text-slate-600">→</span>
                  <span className="text-[#60A5FA] flex items-center gap-1">
                    <Snowflake className="w-3 h-3" /> {preset.tColdK} K
                  </span>
                </div>

                <p className="text-[11px] text-[#AFC2D8] mt-2 leading-relaxed">
                  {preset.description}
                </p>
              </div>

              <button
                onClick={() => onApplyPreset(preset.tHotK, preset.tColdK)}
                disabled={isCurrent}
                className={`mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30 cursor-default'
                    : 'bg-[#16334F] hover:bg-[#1E4369] text-white border border-[#29445F]'
                }`}
              >
                {isCurrent ? (
                  <span>Currently Loaded</span>
                ) : (
                  <>
                    <span>Load Reservoir Temps</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Sweep Visualization: Efficiency as a function of Hot Reservoir Temperature */}
      <div className="p-4 rounded-xl bg-[#0B1F36] border border-[#29445F] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <TrendingUp className="w-4 h-4 text-[#4ADE80]" />
            <span>Theoretical Efficiency Scaling (Fixed T_C = {currentParams.tColdK} K, Varying T_H)</span>
          </div>
          <span className="text-[11px] font-mono text-[#4ADE80]">
            As T_H → ∞, η → 100% (Kelvin-Planck Law)
          </span>
        </div>

        {/* Bar chart representation */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-2">
          {sweepData.map((item) => {
            const isMatch = Math.abs(currentParams.tHotK - item.th) < 40;
            return (
              <div key={`sweep-${item.th}`} className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold text-[#4ADE80]">
                  {item.eff.toFixed(0)}%
                </span>
                <div className="w-full h-24 bg-[#102740] rounded-lg p-1 flex items-end">
                  <div
                    style={{ height: `${item.eff}%` }}
                    className={`w-full rounded-sm transition-all duration-300 ${
                      isMatch
                        ? 'bg-[#38BDF8] shadow-[0_0_8px_rgba(56,189,248,0.7)]'
                        : 'bg-gradient-to-t from-emerald-600 to-emerald-400 opacity-80'
                    }`}
                  />
                </div>
                <span className="text-[10px] font-mono text-[#AFC2D8]">
                  {item.th} K
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
