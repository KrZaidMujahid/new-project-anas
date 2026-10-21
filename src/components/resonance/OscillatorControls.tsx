/**
 * EQUATION 1 — Resonance Oscillator Parameters Control Panel
 * Sliders and precise numeric inputs for Mass, Spring Constant,
 * Driving Frequency, Damping Coefficient, Driving Force Amplitude, and Speed.
 */

import React from 'react';
import { ResonanceParameters } from '../../physics/resonance/types';
import { Sliders, RotateCcw, Info, Zap, Sparkles } from 'lucide-react';

interface OscillatorControlsProps {
  params: ResonanceParameters;
  naturalFreqHz: number;
  playbackSpeed: number;
  onChangeParams: (newParams: ResonanceParameters) => void;
  onChangeSpeed: (newSpeed: number) => void;
  onResetDefaults: () => void;
  onSnapToResonance: () => void;
}

export const OscillatorControls: React.FC<OscillatorControlsProps> = ({
  params,
  naturalFreqHz,
  playbackSpeed,
  onChangeParams,
  onChangeSpeed,
  onResetDefaults,
  onSnapToResonance,
}) => {
  const handleMassChange = (val: number) => {
    const clamped = Math.max(0.1, Math.min(5.0, val));
    onChangeParams({ ...params, mass: clamped });
  };

  const handleSpringConstChange = (val: number) => {
    const clamped = Math.max(5, Math.min(200, val));
    onChangeParams({ ...params, springConstant: clamped });
  };

  const handleDrivingFreqChange = (val: number) => {
    const clamped = Math.max(0.1, Math.min(10.0, val));
    onChangeParams({ ...params, drivingFrequencyHz: clamped });
  };

  const handleDampingChange = (val: number) => {
    const clamped = Math.max(0, Math.min(5.0, val));
    onChangeParams({ ...params, dampingCoefficient: clamped });
  };

  const handleForceAmpChange = (val: number) => {
    const clamped = Math.max(0.1, Math.min(10.0, val));
    onChangeParams({ ...params, drivingForceAmplitude: clamped });
  };

  return (
    <div className="bg-[#101D30] border border-slate-800 rounded-xl p-4 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Oscillator Controls
            </h2>
            <p className="text-[11px] text-slate-400">
              Interactive physical parameters & driving source
            </p>
          </div>
        </div>

        <button
          onClick={onResetDefaults}
          className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors cursor-pointer"
          title="Restore standard laboratory defaults"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      <div className="space-y-3.5">
        {/* CONTROL A: MASS (0.1 to 5.0 kg, default 1.0 kg) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <label className="text-slate-300 font-medium">Mass (m)</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0.1"
                max="5.0"
                step="0.1"
                value={params.mass}
                onChange={(e) => handleMassChange(parseFloat(e.target.value) || 0.1)}
                className="w-16 px-1.5 py-0.5 text-right font-mono text-xs bg-[#07111F] border border-slate-700 rounded text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
              <span className="font-mono text-slate-400 text-xs">kg</span>
            </div>
          </div>
          <input
            type="range"
            min="0.1"
            max="5.0"
            step="0.1"
            value={params.mass}
            onChange={(e) => handleMassChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0.1 kg</span>
            <span className="text-slate-500 text-[10px]">Inertia ∝ m (lowers f₀)</span>
            <span>5.0 kg</span>
          </div>
        </div>

        {/* CONTROL B: SPRING CONSTANT (5 to 200 N/m, default 50 N/m) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <label className="text-slate-300 font-medium">Spring Constant (k)</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="5"
                max="200"
                step="1"
                value={params.springConstant}
                onChange={(e) => handleSpringConstChange(parseFloat(e.target.value) || 5)}
                className="w-16 px-1.5 py-0.5 text-right font-mono text-xs bg-[#07111F] border border-slate-700 rounded text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
              <span className="font-mono text-slate-400 text-xs">N/m</span>
            </div>
          </div>
          <input
            type="range"
            min="5"
            max="200"
            step="1"
            value={params.springConstant}
            onChange={(e) => handleSpringConstChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>5 N/m (Soft)</span>
            <span className="text-slate-500 text-[10px]">Stiffness (raises f₀)</span>
            <span>200 N/m (Stiff)</span>
          </div>
        </div>

        {/* CONTROL C: DRIVING FREQUENCY (0.1 to 10.0 Hz) */}
        <div className="space-y-1 p-2.5 rounded-lg bg-[#07111F] border border-amber-500/20">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <label className="text-amber-300 font-bold">Driving Frequency (f_d)</label>
              <button
                onClick={onSnapToResonance}
                className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors cursor-pointer"
                title="Snap driving frequency exactly to natural frequency f₀"
              >
                Snap to f₀
              </button>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0.1"
                max="10.0"
                step="0.05"
                value={params.drivingFrequencyHz}
                onChange={(e) => handleDrivingFreqChange(parseFloat(e.target.value) || 0.1)}
                className="w-16 px-1.5 py-0.5 text-right font-mono text-xs bg-[#101D30] border border-amber-500/50 rounded text-amber-300 focus:outline-none focus:border-amber-400 font-bold"
              />
              <span className="font-mono text-slate-400 text-xs">Hz</span>
            </div>
          </div>
          <input
            type="range"
            min="0.1"
            max="6.0"
            step="0.02"
            value={params.drivingFrequencyHz}
            onChange={(e) => handleDrivingFreqChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>0.1 Hz</span>
            <span className="text-cyan-400 font-semibold">Natural f₀ = {naturalFreqHz.toFixed(3)} Hz</span>
            <span>6.0 Hz</span>
          </div>
        </div>

        {/* CONTROL D: DAMPING COEFFICIENT (0 to 5.0 N·s/m) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <label className="text-slate-300 font-medium">Damping Coefficient (c)</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max="5.0"
                step="0.05"
                value={params.dampingCoefficient}
                onChange={(e) => handleDampingChange(parseFloat(e.target.value) || 0)}
                className="w-16 px-1.5 py-0.5 text-right font-mono text-xs bg-[#07111F] border border-slate-700 rounded text-purple-300 focus:outline-none focus:border-purple-500"
              />
              <span className="font-mono text-slate-400 text-xs">N·s/m</span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="5.0"
            step="0.05"
            value={params.dampingCoefficient}
            onChange={(e) => handleDampingChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0.0 (Undamped)</span>
            <span>0.5 (Low)</span>
            <span>5.0 (High)</span>
          </div>
        </div>

        {/* CONTROL E: DRIVING FORCE AMPLITUDE (0.1 to 10.0 N) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <label className="text-slate-300 font-medium">Driving Force Amplitude (F₀)</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0.1"
                max="10.0"
                step="0.1"
                value={params.drivingForceAmplitude}
                onChange={(e) => handleForceAmpChange(parseFloat(e.target.value) || 0.1)}
                className="w-16 px-1.5 py-0.5 text-right font-mono text-xs bg-[#07111F] border border-slate-700 rounded text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
              <span className="font-mono text-slate-400 text-xs">N</span>
            </div>
          </div>
          <input
            type="range"
            min="0.1"
            max="10.0"
            step="0.1"
            value={params.drivingForceAmplitude}
            onChange={(e) => handleForceAmpChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0.1 N</span>
            <span className="text-slate-500 text-[10px]">Linear Response: A ∝ F₀</span>
            <span>10.0 N</span>
          </div>
        </div>

        {/* CONTROL F: SIMULATION SPEED */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Animation Speed:</span>
          <div className="flex items-center gap-1 bg-[#07111F] p-1 rounded-md border border-slate-800">
            {[0.25, 0.5, 1.0, 1.5, 2.0].map((speed) => (
              <button
                key={speed}
                onClick={() => onChangeSpeed(speed)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                  playbackSpeed === speed
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {speed}×
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
