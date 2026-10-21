/**
 * EQUATION 1 — Collision & Momentum Parameters & Interactive Controls
 * Sliders + exact numeric inputs + SI units beside every field.
 */

import React from 'react';
import {
  CollisionParameters,
  CollisionType,
  CollisionVectorOptions,
} from '../../physics/collision/types';
import { Sliders, Sparkles, RotateCcw, Info, ArrowRight, ShieldCheck } from 'lucide-react';

interface CollisionParametersProps {
  params: CollisionParameters;
  onChangeParams: (newParams: CollisionParameters) => void;
  onOpenPresets: () => void;
  onReset: () => void;
  onOpenValidationModal: () => void;
}

export const CollisionParametersControl: React.FC<CollisionParametersProps> = ({
  params,
  onChangeParams,
  onOpenPresets,
  onReset,
  onOpenValidationModal,
}) => {
  const updateParam = <K extends keyof CollisionParameters>(
    key: K,
    val: CollisionParameters[K]
  ) => {
    onChangeParams({
      ...params,
      [key]: val,
    });
  };

  const handleTypeChange = (type: CollisionType) => {
    let newRestitution = params.restitution;
    if (type === 'elastic') newRestitution = 1.0;
    else if (type === 'perfectly-inelastic') newRestitution = 0.0;
    else if (params.restitution === 1.0 || params.restitution === 0.0) newRestitution = 0.6;

    onChangeParams({
      ...params,
      collisionType: type,
      restitution: newRestitution,
    });
  };

  return (
    <div className="bg-[#0B1728] border border-[#26364D] rounded-xl p-4 select-none space-y-4 shadow-lg text-xs">
      {/* Header with Presets & Reset */}
      <div className="flex items-center justify-between pb-2 border-b border-[#26364D]">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#38BDF8]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#F1F5F9]">
            Simulation Parameters
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenPresets}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#101D30] hover:bg-[#17263B] border border-[#26364D] hover:border-[#38BDF8]/40 text-[#38BDF8] font-semibold text-[11px] transition-colors cursor-pointer shadow-xs"
            title="Browse standard physics collision presets"
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

      {/* 1. Collision Mode Selector */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-mono text-[#94A3B8] uppercase tracking-wider font-semibold">
          Collision Type
        </label>
        <div className="grid grid-cols-3 gap-1.5 bg-[#07111F] p-1 rounded-lg border border-[#26364D]">
          <button
            onClick={() => handleTypeChange('elastic')}
            className={`py-1.5 px-2 text-center rounded font-medium transition-all cursor-pointer ${
              params.collisionType === 'elastic'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Elastic
          </button>
          <button
            onClick={() => handleTypeChange('inelastic')}
            className={`py-1.5 px-2 text-center rounded font-medium transition-all cursor-pointer ${
              params.collisionType === 'inelastic'
                ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Inelastic
          </button>
          <button
            onClick={() => handleTypeChange('perfectly-inelastic')}
            className={`py-1.5 px-2 text-center rounded font-medium transition-all cursor-pointer ${
              params.collisionType === 'perfectly-inelastic'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Perfect Inelastic
          </button>
        </div>
        <p className="text-[10px] text-slate-400 italic">
          {params.collisionType === 'elastic' &&
            'Momentum & kinetic energy are both strictly conserved (e = 1.0).'}
          {params.collisionType === 'inelastic' &&
            'Momentum conserved, partial kinetic energy lost to deformation (0 < e < 1).'}
          {params.collisionType === 'perfectly-inelastic' &&
            'Carts stick together after impact. Maximum kinetic energy lost (e = 0.0).'}
        </p>
      </div>

      {/* Restitution Slider (for inelastic mode) */}
      {params.collisionType === 'inelastic' && (
        <div className="bg-[#07111F] p-2.5 rounded-lg border border-purple-500/30 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-purple-300 font-semibold">
              Restitution Coefficient (e)
            </span>
            <span className="font-mono text-xs text-purple-200 font-bold">
              {params.restitution.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={0.01}
            max={0.99}
            step={0.01}
            value={params.restitution}
            onChange={(e) => updateParam('restitution', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500">
            <span>0.01 (near sticky)</span>
            <span>0.99 (near elastic)</span>
          </div>
        </div>
      )}

      {/* 2. OBJECT 1 PARAMETERS (Cyan) */}
      <div className="bg-[#07111F] p-3 rounded-lg border border-[#26364D] space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-[#1E293B]">
          <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            Object 1 (Left Cart)
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            Initial p₁ = {(params.m1 * params.v1).toFixed(2)} kg·m/s
          </span>
        </div>

        {/* Mass m1 */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-300">Mass (m₁)</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0.1}
                max={20}
                step={0.1}
                value={params.m1}
                onChange={(e) => updateParam('m1', Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                className="w-16 px-1.5 py-0.5 bg-[#101D30] border border-[#26364D] rounded font-mono text-cyan-300 text-right text-xs focus:outline-none focus:border-cyan-400"
              />
              <span className="text-slate-400 font-mono text-[11px]">kg</span>
            </div>
          </div>
          <input
            type="range"
            min={0.5}
            max={10}
            step={0.1}
            value={params.m1}
            onChange={(e) => updateParam('m1', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Initial Velocity v1 */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-300">Initial Velocity (v₁)</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={-15}
                max={15}
                step={0.1}
                value={params.v1}
                onChange={(e) => updateParam('v1', parseFloat(e.target.value) || 0)}
                className="w-16 px-1.5 py-0.5 bg-[#101D30] border border-[#26364D] rounded font-mono text-cyan-300 text-right text-xs focus:outline-none focus:border-cyan-400"
              />
              <span className="text-slate-400 font-mono text-[11px]">m/s</span>
            </div>
          </div>
          <input
            type="range"
            min={-10}
            max={10}
            step={0.2}
            value={params.v1}
            onChange={(e) => updateParam('v1', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500">
            <span>-10 m/s (Left)</span>
            <span>0 m/s (Rest)</span>
            <span>+10 m/s (Right)</span>
          </div>
        </div>

        {/* Initial Position x1 */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-300">Initial Position (x₁)</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={-10}
                max={20}
                step={0.5}
                value={params.x1}
                onChange={(e) => updateParam('x1', parseFloat(e.target.value) || 0)}
                className="w-16 px-1.5 py-0.5 bg-[#101D30] border border-[#26364D] rounded font-mono text-cyan-300 text-right text-xs focus:outline-none focus:border-cyan-400"
              />
              <span className="text-slate-400 font-mono text-[11px]">m</span>
            </div>
          </div>
          <input
            type="range"
            min={-5}
            max={15}
            step={0.5}
            value={params.x1}
            onChange={(e) => updateParam('x1', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>
      </div>

      {/* 3. OBJECT 2 PARAMETERS (Purple) */}
      <div className="bg-[#07111F] p-3 rounded-lg border border-[#26364D] space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-[#1E293B]">
          <span className="text-[11px] font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            Object 2 (Right Cart)
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            Initial p₂ = {(params.m2 * params.v2).toFixed(2)} kg·m/s
          </span>
        </div>

        {/* Mass m2 */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-300">Mass (m₂)</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0.1}
                max={20}
                step={0.1}
                value={params.m2}
                onChange={(e) => updateParam('m2', Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                className="w-16 px-1.5 py-0.5 bg-[#101D30] border border-[#26364D] rounded font-mono text-purple-300 text-right text-xs focus:outline-none focus:border-purple-400"
              />
              <span className="text-slate-400 font-mono text-[11px]">kg</span>
            </div>
          </div>
          <input
            type="range"
            min={0.5}
            max={10}
            step={0.1}
            value={params.m2}
            onChange={(e) => updateParam('m2', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
          />
        </div>

        {/* Initial Velocity v2 */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-300">Initial Velocity (v₂)</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={-15}
                max={15}
                step={0.1}
                value={params.v2}
                onChange={(e) => updateParam('v2', parseFloat(e.target.value) || 0)}
                className="w-16 px-1.5 py-0.5 bg-[#101D30] border border-[#26364D] rounded font-mono text-purple-300 text-right text-xs focus:outline-none focus:border-purple-400"
              />
              <span className="text-slate-400 font-mono text-[11px]">m/s</span>
            </div>
          </div>
          <input
            type="range"
            min={-10}
            max={10}
            step={0.2}
            value={params.v2}
            onChange={(e) => updateParam('v2', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500">
            <span>-10 m/s (Left)</span>
            <span>0 m/s (Rest)</span>
            <span>+10 m/s (Right)</span>
          </div>
        </div>

        {/* Initial Position x2 */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-300">Initial Position (x₂)</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={-10}
                max={25}
                step={0.5}
                value={params.x2}
                onChange={(e) => updateParam('x2', parseFloat(e.target.value) || 0)}
                className="w-16 px-1.5 py-0.5 bg-[#101D30] border border-[#26364D] rounded font-mono text-purple-300 text-right text-xs focus:outline-none focus:border-purple-400"
              />
              <span className="text-slate-400 font-mono text-[11px]">m</span>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={20}
            step={0.5}
            value={params.x2}
            onChange={(e) => updateParam('x2', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
          />
        </div>
      </div>

      {/* 4. Physical Contact Duration Control */}
      <div className="bg-[#07111F] p-3 rounded-lg border border-[#26364D] space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-300 font-medium">Contact Duration (Δt)</span>
          <div className="flex items-center gap-1">
            <input
              type="number"
              min={0.02}
              max={0.25}
              step={0.01}
              value={params.collisionDuration}
              onChange={(e) => updateParam('collisionDuration', Math.max(0.01, parseFloat(e.target.value) || 0.05))}
              className="w-16 px-1.5 py-0.5 bg-[#101D30] border border-[#26364D] rounded font-mono text-amber-300 text-right text-xs focus:outline-none focus:border-amber-400"
            />
            <span className="text-slate-400 font-mono text-[11px]">s</span>
          </div>
        </div>
        <input
          type="range"
          min={0.02}
          max={0.20}
          step={0.01}
          value={params.collisionDuration}
          onChange={(e) => updateParam('collisionDuration', parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
        />
        <p className="text-[10px] text-slate-400 italic">
          Affects average collision force F_avg = Δp / Δt without altering net impulse.
        </p>
      </div>

      {/* Validation suite link */}
      <button
        onClick={onOpenValidationModal}
        className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Run Automated Invariant Tests (11 Tests)</span>
      </button>
    </div>
  );
};
