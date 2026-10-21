/**
 * EQUATION 1 — Circular Motion Parameters Control Panel
 * Sliders + exact numeric inputs + SI units beside every field.
 */

import React from 'react';
import {
  CircularParameters,
  CircularMode,
} from '../../physics/circular/types';
import { Sliders, Sparkles, RotateCcw, ShieldCheck, Gauge } from 'lucide-react';

interface CircularParametersProps {
  mode: CircularMode;
  onSelectMode: (mode: CircularMode) => void;
  params: CircularParameters;
  onChangeParams: (newParams: CircularParameters) => void;
  onOpenPresets: () => void;
  onReset: () => void;
  onOpenValidationModal: () => void;
}

export const CircularParametersControl: React.FC<CircularParametersProps> = ({
  mode,
  onSelectMode,
  params,
  onChangeParams,
  onOpenPresets,
  onReset,
  onOpenValidationModal,
}) => {
  const updateParam = <K extends keyof CircularParameters>(
    key: K,
    val: CircularParameters[K]
  ) => {
    onChangeParams({
      ...params,
      [key]: val,
    });
  };

  return (
    <div className="bg-[#0B1728] border border-[#26364D] rounded-xl p-4 select-none space-y-4 shadow-lg text-xs">
      {/* Top Header with Presets & Reset */}
      <div className="flex items-center justify-between pb-2 border-b border-[#26364D]">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#38BDF8]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#F1F5F9]">
            Simulation Controls
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenPresets}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#101D30] hover:bg-[#17263B] border border-[#26364D] hover:border-[#38BDF8]/40 text-[#38BDF8] font-semibold text-[11px] transition-colors cursor-pointer shadow-xs"
            title="Browse standard circular motion presets"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Presets</span>
          </button>
          <button
            onClick={onReset}
            className="p-1 rounded bg-[#101D30] hover:bg-[#17263B] border border-[#26364D] text-[#94A3B8] hover:text-[#F1F5F9] transition-colors cursor-pointer"
            title="Reset parameters to standard defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-mono text-[#94A3B8] uppercase tracking-wider font-semibold">
          Laboratory Mode
        </label>
        <div className="grid grid-cols-3 gap-1 bg-[#07111F] p-1 rounded-lg border border-[#26364D]">
          <button
            onClick={() => onSelectMode('basic')}
            className={`py-1.5 px-2 text-center rounded font-medium transition-all cursor-pointer text-[11px] ${
              mode === 'basic'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Basic Motion
          </button>
          <button
            onClick={() => onSelectMode('force')}
            className={`py-1.5 px-2 text-center rounded font-medium transition-all cursor-pointer text-[11px] ${
              mode === 'force'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Force & Accel
          </button>
          <button
            onClick={() => onSelectMode('parameters')}
            className={`py-1.5 px-2 text-center rounded font-medium transition-all cursor-pointer text-[11px] ${
              mode === 'parameters'
                ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Parameter Lab
          </button>
        </div>
        <p className="text-[10px] text-slate-400 italic">
          {mode === 'basic' && 'Examine circular orbit trajectory, position angle θ, and velocity vector.'}
          {mode === 'force' && 'Investigate centripetal acceleration a_c = v²/r and required net inward force F_c = ma_c.'}
          {mode === 'parameters' && 'Systematically vary radius, angular velocity, and mass to observe scaling relationships.'}
        </p>
      </div>

      {/* Parameter Sliders & Number Inputs */}
      <div className="space-y-3.5 bg-[#07111F] p-3 rounded-lg border border-[#26364D]">
        {/* 1. Radius r */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-300 font-medium">Radius (r)</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0.5}
                max={15}
                step={0.1}
                value={params.radius}
                onChange={(e) =>
                  updateParam('radius', Math.max(0.2, parseFloat(e.target.value) || 0.2))
                }
                className="w-16 px-1.5 py-0.5 bg-[#101D30] border border-[#26364D] rounded font-mono text-cyan-300 text-right text-xs focus:outline-none focus:border-cyan-400"
              />
              <span className="text-slate-400 font-mono text-[11px]">m</span>
            </div>
          </div>
          <input
            type="range"
            min={0.5}
            max={10.0}
            step={0.1}
            value={params.radius}
            onChange={(e) => updateParam('radius', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500">
            <span>0.5 m</span>
            <span>5.0 m</span>
            <span>10.0 m</span>
          </div>
        </div>

        {/* 2. Angular Velocity ω */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-300 font-medium">Angular Velocity (ω)</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={-10}
                max={10}
                step={0.1}
                value={params.angularVelocity}
                onChange={(e) =>
                  updateParam('angularVelocity', parseFloat(e.target.value) || 0)
                }
                className="w-16 px-1.5 py-0.5 bg-[#101D30] border border-[#26364D] rounded font-mono text-cyan-300 text-right text-xs focus:outline-none focus:border-cyan-400"
              />
              <span className="text-slate-400 font-mono text-[11px]">rad/s</span>
            </div>
          </div>
          <input
            type="range"
            min={-8.0}
            max={8.0}
            step={0.1}
            value={params.angularVelocity}
            onChange={(e) => updateParam('angularVelocity', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500">
            <span>-8 (Clockwise)</span>
            <span>0 rad/s</span>
            <span>+8 (Counter-Clockwise)</span>
          </div>
        </div>

        {/* 3. Mass m */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-300 font-medium">Mass (m)</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0.1}
                max={25}
                step={0.1}
                value={params.mass}
                onChange={(e) =>
                  updateParam('mass', Math.max(0.1, parseFloat(e.target.value) || 0.1))
                }
                className="w-16 px-1.5 py-0.5 bg-[#101D30] border border-[#26364D] rounded font-mono text-cyan-300 text-right text-xs focus:outline-none focus:border-cyan-400"
              />
              <span className="text-slate-400 font-mono text-[11px]">kg</span>
            </div>
          </div>
          <input
            type="range"
            min={0.2}
            max={10.0}
            step={0.1}
            value={params.mass}
            onChange={(e) => updateParam('mass', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500">
            <span>0.2 kg</span>
            <span>5.0 kg</span>
            <span>10.0 kg</span>
          </div>
        </div>

        {/* 4. Initial Angle θ₀ */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-300 font-medium">Initial Position Angle (θ₀)</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                max={360}
                step={5}
                value={params.initialAngleDeg}
                onChange={(e) =>
                  updateParam('initialAngleDeg', parseFloat(e.target.value) || 0)
                }
                className="w-16 px-1.5 py-0.5 bg-[#101D30] border border-[#26364D] rounded font-mono text-cyan-300 text-right text-xs focus:outline-none focus:border-cyan-400"
              />
              <span className="text-slate-400 font-mono text-[11px]">deg</span>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={360}
            step={1}
            value={params.initialAngleDeg}
            onChange={(e) => updateParam('initialAngleDeg', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500">
            <span>0° (+x axis)</span>
            <span>90° (+y axis)</span>
            <span>360°</span>
          </div>
        </div>
      </div>

      {/* Quick Derived Metrics Callout */}
      <div className="bg-[#07111F] p-3 rounded-lg border border-[#26364D] space-y-1 font-mono text-[11px]">
        <div className="flex justify-between text-slate-400">
          <span>Linear Speed (v = r|ω|):</span>
          <span className="text-cyan-300 font-bold">
            {(params.radius * Math.abs(params.angularVelocity)).toFixed(2)} m/s
          </span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Centripetal Accel (a_c = rω²):</span>
          <span className="text-amber-300 font-bold">
            {(params.radius * params.angularVelocity * params.angularVelocity).toFixed(2)} m/s²
          </span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Centripetal Force (F_c = ma_c):</span>
          <span className="text-rose-300 font-bold">
            {(params.mass * params.radius * params.angularVelocity * params.angularVelocity).toFixed(1)} N
          </span>
        </div>
      </div>

      {/* Validation suite link */}
      <button
        onClick={onOpenValidationModal}
        className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Run Physics Verification Suite (12 Tests)</span>
      </button>
    </div>
  );
};
