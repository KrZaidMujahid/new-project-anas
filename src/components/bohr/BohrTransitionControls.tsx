/**
 * EQUATION 1 — Bohr Model Transition & Parameter Controls
 * Interactive controls for quantum numbers, transitions, animation speed,
 * and quick-access benchmark spectral presets.
 */

import React from 'react';
import {
  PrincipalQuantumNumber,
  ElectronTransition,
  BohrPreset,
} from '../../physics/bohr/types';
import { BOHR_PRESETS } from '../../physics/bohr/model';
import {
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Zap,
  Flame,
  Layers,
  Eye,
} from 'lucide-react';

interface BohrTransitionControlsProps {
  currentLevel: PrincipalQuantumNumber;
  onSelectLevel: (n: PrincipalQuantumNumber) => void;
  initialLevel: PrincipalQuantumNumber;
  onSelectInitialLevel: (n: PrincipalQuantumNumber) => void;
  finalLevel: PrincipalQuantumNumber;
  onSelectFinalLevel: (n: PrincipalQuantumNumber) => void;
  onRunTransition: () => void;
  onResetTransition: () => void;
  isTransitioning: boolean;
  activeTransition: ElectronTransition | null;
  onApplyPreset: (preset: BohrPreset) => void;
  showOrbitLabels: boolean;
  onToggleOrbitLabels: () => void;
}

export const BohrTransitionControls: React.FC<BohrTransitionControlsProps> = ({
  currentLevel,
  onSelectLevel,
  initialLevel,
  onSelectInitialLevel,
  finalLevel,
  onSelectFinalLevel,
  onRunTransition,
  onResetTransition,
  isTransitioning,
  activeTransition,
  onApplyPreset,
  showOrbitLabels,
  onToggleOrbitLabels,
}) => {
  const levels: PrincipalQuantumNumber[] = [1, 2, 3, 4, 5, 6];
  const isInvalidTransition = initialLevel === finalLevel;
  const isAbsorption = finalLevel > initialLevel;

  return (
    <div className="bg-[#10243D] border border-[#29415F] rounded-xl p-5 shadow-xl flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#29415F]/70">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#38BDF8]" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Quantum Level & Transition Controls
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleOrbitLabels}
            className={`text-xs px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
              showOrbitLabels
                ? 'bg-[#142B47] text-[#38BDF8] border border-[#38BDF8]/40'
                : 'bg-[#0B1B31] text-[#9FB3CC] border border-[#29415F]'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Orbit Labels</span>
          </button>
        </div>
      </div>

      {/* Part A: Direct Current Level Selector (n = 1..6) */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-white flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
            Electron Bound State (Principal Quantum Number n):
          </span>
          <span className="font-mono text-[#38BDF8] font-bold">
            n = {currentLevel} {currentLevel === 1 ? '(Ground State)' : `(Excited ${currentLevel - 1})`}
          </span>
        </div>

        <div className="grid grid-cols-6 gap-2">
          {levels.map((n) => {
            const isSelected = currentLevel === n;
            return (
              <button
                key={`level-btn-${n}`}
                onClick={() => onSelectLevel(n)}
                className={`py-2 px-1 rounded-lg text-center transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#38BDF8] text-slate-950 font-black border-[#38BDF8] shadow-md'
                    : 'bg-[#0B1B31] border-[#29415F] text-[#9FB3CC] hover:border-slate-500 hover:text-white font-mono'
                }`}
              >
                <div className="text-xs">n = {n}</div>
                <div className="text-[10px] opacity-80">{n === 1 ? 'Ground' : `Ex ${n-1}`}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Part C: Quantum Transition Experiment Studio */}
      <div className="p-4 rounded-xl bg-[#0B1B31] border border-[#29415F] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#FBBF24]" />
            Simulate Electron Transition (n_i → n_f)
          </span>

          {!isInvalidTransition && (
            <span
              className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                isAbsorption
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              {isAbsorption ? 'Absorption (Photon IN)' : 'Emission (Photon OUT)'}
            </span>
          )}
        </div>

        {/* Transition Selectors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Initial Level n_i */}
          <div className="space-y-1.5">
            <label className="text-xs text-[#9FB3CC] font-mono">
              Initial Energy State (n_i):
            </label>
            <select
              value={initialLevel}
              onChange={(e) => onSelectInitialLevel(parseInt(e.target.value) as PrincipalQuantumNumber)}
              className="w-full px-3 py-2 rounded-lg bg-[#10243D] border border-[#29415F] text-xs font-bold text-white focus:outline-none focus:border-[#38BDF8] cursor-pointer"
            >
              {levels.map((n) => (
                <option key={`ni-${n}`} value={n}>
                  Level n = {n} ({(-13.6 / (n * n)).toFixed(2)} eV)
                </option>
              ))}
            </select>
          </div>

          {/* Final Level n_f */}
          <div className="space-y-1.5">
            <label className="text-xs text-[#9FB3CC] font-mono">
              Final Energy State (n_f):
            </label>
            <select
              value={finalLevel}
              onChange={(e) => onSelectFinalLevel(parseInt(e.target.value) as PrincipalQuantumNumber)}
              className="w-full px-3 py-2 rounded-lg bg-[#10243D] border border-[#29415F] text-xs font-bold text-white focus:outline-none focus:border-[#38BDF8] cursor-pointer"
            >
              {levels.map((n) => (
                <option key={`nf-${n}`} value={n}>
                  Level n = {n} ({(-13.6 / (n * n)).toFixed(2)} eV)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Validation Warning when n_i === n_f */}
        {isInvalidTransition && (
          <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              Initial and final states cannot be identical. Select different levels (n_i ≠ n_f) to simulate absorption or emission.
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onRunTransition}
            disabled={isInvalidTransition || isTransitioning}
            className={`flex-1 py-2 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
              isInvalidTransition || isTransitioning
                ? 'bg-[#142B47] text-[#9FB3CC] border border-[#29415F] cursor-not-allowed opacity-60'
                : 'bg-[#38BDF8] hover:bg-[#0284C7] text-slate-950 font-black'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isTransitioning ? 'Transitioning...' : 'Run Quantum Transition'}</span>
          </button>

          {activeTransition && (
            <button
              onClick={onResetTransition}
              className="py-2 px-3 rounded-lg bg-[#10243D] hover:bg-[#142B47] text-[#9FB3CC] hover:text-white border border-[#29415F] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Part E: Preset Experiments */}
      <div className="space-y-2 pt-1">
        <span className="text-xs font-mono uppercase text-[#9FB3CC] tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
          Benchmark Presets & Spectral Transitions
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {BOHR_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onApplyPreset(preset)}
              className="p-2 rounded-lg text-left text-xs bg-[#0B1B31] border border-[#29415F] hover:border-[#38BDF8] text-[#9FB3CC] hover:text-white transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="font-bold text-white group-hover:text-[#38BDF8] truncate text-[11px]">
                {preset.title.split('(')[0]}
              </div>
              <div className="text-[10px] font-mono text-[#38BDF8] mt-1">
                {preset.subtitle.split('·')[0]}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
