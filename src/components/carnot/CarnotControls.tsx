/**
 * EQUATION 1 — Carnot Thermodynamic Controls
 * Sliders, numerical input, temperature constraint enforcement,
 * gas type selection, cycle multiplier, and quick benchmark presets.
 */

import React from 'react';
import { CarnotParameters, WorkingGasType } from '../../physics/carnot/types';
import { CARNOT_PRESETS } from '../../physics/carnot/model';
import { Sliders, Flame, Snowflake, Box, Atom, RotateCcw, Sparkles } from 'lucide-react';

interface CarnotControlsProps {
  params: CarnotParameters;
  onChange: (newParams: CarnotParameters) => void;
  onReset: () => void;
  calculatedPA: number; // in kPa
}

export const CarnotControls: React.FC<CarnotControlsProps> = ({
  params,
  onChange,
  onReset,
  calculatedPA,
}) => {
  // Handler for T_H with strict constraint T_H > T_C + 10
  const handleTHChange = (val: number) => {
    const tHotK = Math.max(300, Math.min(1000, val));
    let tColdK = params.tColdK;
    if (tHotK <= tColdK + 10) {
      tColdK = Math.max(100, tHotK - 10);
    }
    onChange({ ...params, tHotK, tColdK });
  };

  // Handler for T_C with strict constraint T_C < T_H - 10
  const handleTCChange = (val: number) => {
    const tColdK = Math.max(100, Math.min(500, val));
    let tHotK = params.tHotK;
    if (tColdK >= tHotK - 10) {
      tHotK = Math.min(1000, tColdK + 10);
    }
    onChange({ ...params, tHotK, tColdK });
  };

  const handleMolesChange = (val: number) => {
    onChange({ ...params, moles: Math.max(0.1, Math.min(2.0, val)) });
  };

  const handleVolumeChange = (val: number) => {
    onChange({ ...params, initialVolumeL: Math.max(1.0, Math.min(10.0, val)) });
  };

  const handleGasTypeChange = (gasType: WorkingGasType) => {
    onChange({ ...params, gasType });
  };

  const handleCyclesChange = (val: number) => {
    onChange({ ...params, numCycles: Math.max(1, Math.min(100, Math.round(val))) });
  };

  const applyPreset = (tHotK: number, tColdK: number) => {
    onChange({ ...params, tHotK, tColdK });
  };

  return (
    <div className="bg-[#102740] border border-[#29445F] rounded-xl p-5 shadow-xl flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#29445F]/70">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#38BDF8]" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Thermodynamic Parameters & Reservoir Controls
          </h3>
        </div>

        <button
          onClick={onReset}
          className="text-xs px-2.5 py-1 rounded bg-[#0B1F36] hover:bg-[#16334F] text-[#AFC2D8] hover:text-white border border-[#29445F] transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Quick Benchmark Preset Buttons */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-mono uppercase text-[#AFC2D8] tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
          Quick Thermodynamic Regimes
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CARNOT_PRESETS.slice(0, 4).map((preset) => {
            const isSelected =
              params.tHotK === preset.tHotK && params.tColdK === preset.tColdK;
            return (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset.tHotK, preset.tColdK)}
                className={`p-2 rounded-lg text-left text-xs transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#16334F] border-[#38BDF8] text-white shadow-sm'
                    : 'bg-[#0B1F36] border-[#29445F] text-[#AFC2D8] hover:border-slate-500 hover:text-white'
                }`}
              >
                <div className="font-bold truncate text-[11px]">{preset.name.split('(')[0]}</div>
                <div className="text-[10px] font-mono text-[#38BDF8] mt-0.5">
                  {preset.tHotK} K / {preset.tColdK} K · η = {((1 - preset.tColdK / preset.tHotK) * 100).toFixed(0)}%
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        {/* Hot Reservoir Slider (T_H) */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-white flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#F97316]" />
              Hot Reservoir (T_H)
            </span>
            <div className="flex items-center gap-1 font-mono">
              <input
                type="number"
                min="300"
                max="1000"
                step="10"
                value={params.tHotK}
                onChange={(e) => handleTHChange(parseFloat(e.target.value) || 300)}
                className="w-16 px-1.5 py-0.5 rounded bg-[#0B1F36] border border-[#29445F] text-[#FB923C] text-right font-bold text-xs focus:outline-none focus:border-[#FB923C]"
              />
              <span className="text-[#AFC2D8]">K</span>
            </div>
          </div>
          <input
            type="range"
            min="300"
            max="1000"
            step="10"
            value={params.tHotK}
            onChange={(e) => handleTHChange(parseFloat(e.target.value))}
            className="w-full accent-[#F97316] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-[#94A3B8]">
            <span>300 K</span>
            <span className="text-[#F97316]">Default: 600 K</span>
            <span>1000 K</span>
          </div>
        </div>

        {/* Cold Reservoir Slider (T_C) */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-white flex items-center gap-1.5">
              <Snowflake className="w-4 h-4 text-[#60A5FA]" />
              Cold Reservoir (T_C)
            </span>
            <div className="flex items-center gap-1 font-mono">
              <input
                type="number"
                min="100"
                max="500"
                step="10"
                value={params.tColdK}
                onChange={(e) => handleTCChange(parseFloat(e.target.value) || 100)}
                className="w-16 px-1.5 py-0.5 rounded bg-[#0B1F36] border border-[#29445F] text-[#60A5FA] text-right font-bold text-xs focus:outline-none focus:border-[#60A5FA]"
              />
              <span className="text-[#AFC2D8]">K</span>
            </div>
          </div>
          <input
            type="range"
            min="100"
            max="500"
            step="10"
            value={params.tColdK}
            onChange={(e) => handleTCChange(parseFloat(e.target.value))}
            className="w-full accent-[#60A5FA] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-[#94A3B8]">
            <span>100 K</span>
            <span className="text-[#60A5FA]">Default: 300 K</span>
            <span>500 K</span>
          </div>
        </div>

        {/* Initial Gas Volume Slider (V_A) */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-white flex items-center gap-1.5">
              <Box className="w-4 h-4 text-[#38BDF8]" />
              Initial Gas Volume (V_A)
            </span>
            <div className="flex items-center gap-1 font-mono">
              <input
                type="number"
                min="1.0"
                max="10.0"
                step="0.5"
                value={params.initialVolumeL}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value) || 1.0)}
                className="w-16 px-1.5 py-0.5 rounded bg-[#0B1F36] border border-[#29445F] text-[#38BDF8] text-right font-bold text-xs focus:outline-none focus:border-[#38BDF8]"
              />
              <span className="text-[#AFC2D8]">L</span>
            </div>
          </div>
          <input
            type="range"
            min="1.0"
            max="10.0"
            step="0.5"
            value={params.initialVolumeL}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-full accent-[#38BDF8] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-[#94A3B8]">
            <span>1.0 L</span>
            <span className="text-[#38BDF8]">Default: 2.0 L</span>
            <span>10.0 L</span>
          </div>
        </div>

        {/* Number of Moles Slider (n) */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-white flex items-center gap-1.5">
              <Atom className="w-4 h-4 text-[#4ADE80]" />
              Number of Moles (n)
            </span>
            <div className="flex items-center gap-1 font-mono">
              <input
                type="number"
                min="0.1"
                max="2.0"
                step="0.1"
                value={params.moles}
                onChange={(e) => handleMolesChange(parseFloat(e.target.value) || 0.1)}
                className="w-16 px-1.5 py-0.5 rounded bg-[#0B1F36] border border-[#29445F] text-[#4ADE80] text-right font-bold text-xs focus:outline-none focus:border-[#4ADE80]"
              />
              <span className="text-[#AFC2D8]">mol</span>
            </div>
          </div>
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={params.moles}
            onChange={(e) => handleMolesChange(parseFloat(e.target.value))}
            className="w-full accent-[#4ADE80] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-[#94A3B8]">
            <span>0.1 mol</span>
            <span className="text-[#4ADE80]">Default: 1.0 mol</span>
            <span>2.0 mol</span>
          </div>
        </div>
      </div>

      {/* Gas Type Selection & Number of Cycles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#29445F]/70">
        {/* Working Gas Type */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-white">Working Gas (Heat Capacity Ratio γ)</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleGasTypeChange('monatomic')}
              className={`p-2 rounded-lg text-xs font-medium text-left border transition-all cursor-pointer ${
                params.gasType === 'monatomic'
                  ? 'bg-[#16334F] border-[#38BDF8] text-white shadow-sm'
                  : 'bg-[#0B1F36] border-[#29445F] text-[#AFC2D8] hover:text-white'
              }`}
            >
              <div className="font-bold">Monatomic</div>
              <div className="text-[10px] font-mono text-[#38BDF8] mt-0.5">γ = 5/3 ≈ 1.67 (He, Ar)</div>
            </button>

            <button
              onClick={() => handleGasTypeChange('diatomic')}
              className={`p-2 rounded-lg text-xs font-medium text-left border transition-all cursor-pointer ${
                params.gasType === 'diatomic'
                  ? 'bg-[#16334F] border-[#38BDF8] text-white shadow-sm'
                  : 'bg-[#0B1F36] border-[#29445F] text-[#AFC2D8] hover:text-white'
              }`}
            >
              <div className="font-bold">Diatomic (Default)</div>
              <div className="text-[10px] font-mono text-[#38BDF8] mt-0.5">γ = 7/5 = 1.40 (N₂, O₂)</div>
            </button>
          </div>
        </div>

        {/* Number of Cycles */}
        <div className="flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-white">Number of Engine Cycles (N)</span>
            <span className="font-mono text-[#38BDF8] font-bold">{params.numCycles} cycle{params.numCycles > 1 ? 's' : ''}</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            step="1"
            value={params.numCycles}
            onChange={(e) => handleCyclesChange(parseInt(e.target.value) || 1)}
            className="w-full accent-[#38BDF8] cursor-pointer mt-2"
          />
          <div className="flex justify-between text-[10px] font-mono text-[#94A3B8] mt-1">
            <span>1</span>
            <span>25</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>
      </div>

      {/* Ideal Gas Law Starting Pressure Indicator */}
      <div className="p-3 rounded-lg bg-[#0B1F36] border border-[#29445F] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#AFC2D8]">
          <span className="font-mono text-[#38BDF8] font-bold">Ideal Gas Law:</span>
          <span>P_A = n R T_H / V_A</span>
        </div>
        <div className="font-mono text-[#38BDF8] font-bold">
          Initial Pressure P_A = {calculatedPA.toFixed(1)} kPa ({(calculatedPA / 101.325).toFixed(2)} atm)
        </div>
      </div>
    </div>
  );
};
