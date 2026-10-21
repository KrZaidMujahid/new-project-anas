/**
 * EQUATION 1 — Simple Harmonic Motion Parameter Configuration Panel
 * High-precision sliders and numeric input fields with unit labels, bounds checking,
 * and dual mode: (Amplitude, Phase) vs. (Initial Displacement, Initial Velocity).
 */

import React from 'react';
import {
  SHMParameters,
  SHMDerivedValues,
  SHMSystemType,
  SHMInputMode,
} from '../../physics/shm/types';
import {
  Sliders,
  Sparkles,
  RotateCcw,
  Scale,
  Compass,
  ArrowDownUp,
  Info,
} from 'lucide-react';

interface SHMParametersProps {
  params: SHMParameters;
  derived: SHMDerivedValues;
  onChangeParams: (newParams: SHMParameters) => void;
  onOpenPresets: () => void;
  onReset: () => void;
}

const GRAVITY_PRESETS = [
  { label: 'Earth (9.80)', value: 9.8 },
  { label: 'Moon (1.62)', value: 1.62 },
  { label: 'Mars (3.72)', value: 3.72 },
  { label: 'Zero-g (0.0)', value: 0.0 },
];

export const SHMParametersComponent: React.FC<SHMParametersProps> = ({
  params,
  derived,
  onChangeParams,
  onOpenPresets,
  onReset,
}) => {
  const updateField = <K extends keyof SHMParameters>(key: K, value: SHMParameters[K]) => {
    onChangeParams({
      ...params,
      [key]: value,
    });
  };

  const handleNumericInput = (
    key: keyof SHMParameters,
    rawVal: string,
    min: number,
    max: number,
    fallback: number
  ) => {
    const parsed = parseFloat(rawVal);
    if (Number.isNaN(parsed)) return;
    const clamped = Math.max(min, Math.min(max, parsed));
    updateField(key, clamped as any);
  };

  return (
    <div className="bg-[#090d16] border border-slate-800/90 rounded-xl p-4 sm:p-5 select-none space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold text-white tracking-wider uppercase font-mono">
            Physical Parameters
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPresets}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 rounded-md transition-colors cursor-pointer"
            title="Load benchmark preset configurations"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Presets</span>
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-md transition-colors cursor-pointer"
            title="Reset parameters to benchmark defaults"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* System Type Selector (3 Clean Segmented Tabs) */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
          Simulation System
        </label>
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#07090e] border border-slate-800 rounded-lg text-xs font-medium">
          <button
            onClick={() => updateField('systemType', 'horizontal-spring')}
            className={`py-2 px-1 text-center rounded-md transition-colors cursor-pointer ${
              params.systemType === 'horizontal-spring'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Horizontal Spring
          </button>
          <button
            onClick={() => updateField('systemType', 'vertical-spring')}
            className={`py-2 px-1 text-center rounded-md transition-colors cursor-pointer ${
              params.systemType === 'vertical-spring'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Vertical Spring
          </button>
          <button
            onClick={() => updateField('systemType', 'pendulum')}
            className={`py-2 px-1 text-center rounded-md transition-colors cursor-pointer ${
              params.systemType === 'pendulum'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Simple Pendulum
          </button>
        </div>
      </div>

      {/* Primary Parameters */}
      <div className="space-y-4 pt-1">
        {/* 1. Mass (kg) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-200 flex items-center gap-1.5">
              <span>Mass (m)</span>
              <span className="text-slate-500 text-[11px] font-mono">[kg]</span>
            </span>
            <input
              type="number"
              step={0.1}
              min={0.1}
              max={10.0}
              value={params.mass}
              onChange={(e) => handleNumericInput('mass', e.target.value, 0.1, 10.0, 1.0)}
              className="w-20 px-2 py-0.5 text-right font-mono text-xs bg-[#07090e] border border-slate-700/80 rounded text-cyan-400 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <input
            type="range"
            min={0.1}
            max={5.0}
            step={0.1}
            value={params.mass}
            onChange={(e) => updateField('mass', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>0.1 kg</span>
            <span>2.5 kg</span>
            <span>5.0 kg</span>
          </div>
        </div>

        {/* 2. Spring Constant (k) for Spring systems */}
        {params.systemType !== 'pendulum' && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-200 flex items-center gap-1.5">
                <span>Spring Constant (k)</span>
                <span className="text-slate-500 text-[11px] font-mono">[N/m]</span>
              </span>
              <input
                type="number"
                step={1}
                min={1}
                max={100}
                value={params.springConstant}
                onChange={(e) => handleNumericInput('springConstant', e.target.value, 1, 100, 20)}
                className="w-20 px-2 py-0.5 text-right font-mono text-xs bg-[#07090e] border border-slate-700/80 rounded text-cyan-400 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <input
              type="range"
              min={1}
              max={80}
              step={1}
              value={params.springConstant}
              onChange={(e) => updateField('springConstant', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>1 N/m (soft)</span>
              <span>40 N/m</span>
              <span>80 N/m (stiff)</span>
            </div>
          </div>
        )}

        {/* 3. Pendulum Length (L) for Pendulum */}
        {params.systemType === 'pendulum' && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-200 flex items-center gap-1.5">
                <span>Pendulum Length (L)</span>
                <span className="text-slate-500 text-[11px] font-mono">[m]</span>
              </span>
              <input
                type="number"
                step={0.05}
                min={0.1}
                max={3.0}
                value={params.pendulumLength}
                onChange={(e) => handleNumericInput('pendulumLength', e.target.value, 0.1, 3.0, 1.0)}
                className="w-20 px-2 py-0.5 text-right font-mono text-xs bg-[#07090e] border border-slate-700/80 rounded text-cyan-400 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <input
              type="range"
              min={0.2}
              max={2.5}
              step={0.05}
              value={params.pendulumLength}
              onChange={(e) => updateField('pendulumLength', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0.2 m</span>
              <span>1.0 m (standard)</span>
              <span>2.5 m</span>
            </div>
          </div>
        )}

        {/* 4. Gravity (g) for Vertical Spring & Pendulum */}
        {params.systemType !== 'horizontal-spring' && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-200 flex items-center gap-1.5">
                <span>Gravitational Accel. (g)</span>
                <span className="text-slate-500 text-[11px] font-mono">[m/s²]</span>
              </span>
              <input
                type="number"
                step={0.1}
                min={0}
                max={25.0}
                value={params.gravity}
                onChange={(e) => handleNumericInput('gravity', e.target.value, 0, 25.0, 9.8)}
                className="w-20 px-2 py-0.5 text-right font-mono text-xs bg-[#07090e] border border-slate-700/80 rounded text-cyan-400 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {GRAVITY_PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => updateField('gravity', p.value)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                    Math.abs(params.gravity - p.value) < 0.05
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                      : 'bg-slate-800/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {params.systemType === 'vertical-spring' && (
              <div className="p-2 bg-slate-900/80 border border-slate-800 rounded text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>Static extension ΔL:</span>
                <span className="text-cyan-300 font-semibold">
                  {(derived.staticExtension * 100).toFixed(1)} cm
                </span>
              </div>
            )}
          </div>
        )}

        {/* 5. Input Mode Switcher for Mass-Spring: (A, φ) vs. (x0, v0) */}
        {params.systemType !== 'pendulum' && (
          <div className="pt-2 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-slate-400">
                Initial State Configuration
              </span>
              <div className="flex bg-[#07090e] p-0.5 border border-slate-800 rounded">
                <button
                  onClick={() => updateField('inputMode', 'amplitude-phase')}
                  className={`px-2 py-0.5 text-[10px] rounded transition-colors cursor-pointer ${
                    params.inputMode === 'amplitude-phase'
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  A & φ
                </button>
                <button
                  onClick={() => updateField('inputMode', 'initial-conditions')}
                  className={`px-2 py-0.5 text-[10px] rounded transition-colors cursor-pointer ${
                    params.inputMode === 'initial-conditions'
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  x₀ & v₀
                </button>
              </div>
            </div>

            {params.inputMode === 'amplitude-phase' ? (
              <>
                {/* Amplitude A */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200 flex items-center gap-1.5">
                      <span>Amplitude (A)</span>
                      <span className="text-slate-500 text-[11px] font-mono">[m]</span>
                    </span>
                    <input
                      type="number"
                      step={0.01}
                      min={0.01}
                      max={0.50}
                      value={params.amplitude}
                      onChange={(e) => handleNumericInput('amplitude', e.target.value, 0.01, 0.50, 0.20)}
                      className="w-20 px-2 py-0.5 text-right font-mono text-xs bg-[#07090e] border border-slate-700/80 rounded text-cyan-400 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <input
                    type="range"
                    min={0.02}
                    max={0.40}
                    step={0.01}
                    value={params.amplitude}
                    onChange={(e) => updateField('amplitude', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>0.02 m</span>
                    <span>0.20 m</span>
                    <span>0.40 m</span>
                  </div>
                </div>

                {/* Initial Phase φ */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200 flex items-center gap-1.5">
                      <span>Initial Phase (φ)</span>
                      <span className="text-slate-500 text-[11px] font-mono">[deg]</span>
                    </span>
                    <input
                      type="number"
                      step={5}
                      min={-180}
                      max={180}
                      value={params.initialPhaseDeg}
                      onChange={(e) => handleNumericInput('initialPhaseDeg', e.target.value, -180, 180, 0)}
                      className="w-20 px-2 py-0.5 text-right font-mono text-xs bg-[#07090e] border border-slate-700/80 rounded text-cyan-400 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <input
                    type="range"
                    min={-180}
                    max={180}
                    step={5}
                    value={params.initialPhaseDeg}
                    onChange={(e) => updateField('initialPhaseDeg', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>-180°</span>
                    <span>0° (cos peak)</span>
                    <span>+180°</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Initial Displacement x0 */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200 flex items-center gap-1.5">
                      <span>Initial Displacement (x₀)</span>
                      <span className="text-slate-500 text-[11px] font-mono">[m]</span>
                    </span>
                    <input
                      type="number"
                      step={0.01}
                      min={-0.40}
                      max={0.40}
                      value={params.initialDisplacement}
                      onChange={(e) => handleNumericInput('initialDisplacement', e.target.value, -0.40, 0.40, 0.20)}
                      className="w-20 px-2 py-0.5 text-right font-mono text-xs bg-[#07090e] border border-slate-700/80 rounded text-cyan-400 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <input
                    type="range"
                    min={-0.35}
                    max={0.35}
                    step={0.01}
                    value={params.initialDisplacement}
                    onChange={(e) => updateField('initialDisplacement', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                {/* Initial Velocity v0 */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200 flex items-center gap-1.5">
                      <span>Initial Velocity (v₀)</span>
                      <span className="text-slate-500 text-[11px] font-mono">[m/s]</span>
                    </span>
                    <input
                      type="number"
                      step={0.05}
                      min={-2.0}
                      max={2.0}
                      value={params.initialVelocity}
                      onChange={(e) => handleNumericInput('initialVelocity', e.target.value, -2.0, 2.0, 0.0)}
                      className="w-20 px-2 py-0.5 text-right font-mono text-xs bg-[#07090e] border border-slate-700/80 rounded text-cyan-400 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <input
                    type="range"
                    min={-1.5}
                    max={1.5}
                    step={0.05}
                    value={params.initialVelocity}
                    onChange={(e) => updateField('initialVelocity', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                {/* Equivalent (A, φ) readout */}
                <div className="p-2 bg-slate-900 border border-slate-800 rounded text-[11px] font-mono space-y-1">
                  <div className="text-slate-400 flex justify-between">
                    <span>Resulting Amplitude A:</span>
                    <span className="text-cyan-300 font-semibold">
                      {derived.effectiveAmplitude.toFixed(3)} m
                    </span>
                  </div>
                  <div className="text-slate-400 flex justify-between">
                    <span>Resulting Phase φ:</span>
                    <span className="text-purple-300 font-semibold">
                      {((derived.effectivePhaseRad * 180) / Math.PI).toFixed(1)}°
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Pendulum Angle (deg) for Pendulum Mode */}
        {params.systemType === 'pendulum' && (
          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-200 flex items-center gap-1.5">
                <span>Release Angle (θ₀)</span>
                <span className="text-slate-500 text-[11px] font-mono">[deg]</span>
              </span>
              <input
                type="number"
                step={0.5}
                min={1}
                max={25}
                value={params.pendulumInitialAngleDeg}
                onChange={(e) => handleNumericInput('pendulumInitialAngleDeg', e.target.value, 1, 25, 12)}
                className="w-20 px-2 py-0.5 text-right font-mono text-xs bg-[#07090e] border border-slate-700/80 rounded text-cyan-400 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <input
              type="range"
              min={2}
              max={20}
              step={0.5}
              value={params.pendulumInitialAngleDeg}
              onChange={(e) => updateField('pendulumInitialAngleDeg', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>2°</span>
              <span>12°</span>
              <span>20° (small angle limit)</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Summary Strip */}
      <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="bg-[#07090e] p-2 rounded border border-slate-800">
          <span className="text-[10px] text-slate-500 block uppercase">Period (T)</span>
          <span className="text-white font-bold text-sm">
            {derived.period.toFixed(3)}s
          </span>
        </div>
        <div className="bg-[#07090e] p-2 rounded border border-slate-800">
          <span className="text-[10px] text-slate-500 block uppercase">Frequency (f)</span>
          <span className="text-cyan-400 font-bold text-sm">
            {derived.frequency.toFixed(3)} Hz
          </span>
        </div>
      </div>
    </div>
  );
};
