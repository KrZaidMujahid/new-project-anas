/**
 * EQUATION 1 — Interactive Wave Source Controls Panel
 * Sliders and precise numeric input fields for Frequency, Wavelength,
 * Amplitude, Source Separation, Phase Difference, and Wave Speed.
 */

import React from 'react';
import { TwoSourceParameters } from '../../physics/waves/types';
import { Sliders, RotateCcw, Link2, Link2Off, Sparkles, Info } from 'lucide-react';

interface WaveSourceControlsProps {
  params: TwoSourceParameters;
  onChangeParams: (newParams: TwoSourceParameters) => void;
  onResetDefaults: () => void;
}

export const WaveSourceControls: React.FC<WaveSourceControlsProps> = ({
  params,
  onChangeParams,
  onResetDefaults,
}) => {
  const calculatedSpeed = params.frequency * params.wavelength;

  const handleFrequencyChange = (val: number) => {
    const clamped = Math.max(0.5, Math.min(10.0, val));
    onChangeParams({
      ...params,
      frequency: clamped,
      waveSpeed: params.lockSpeedToPhysics ? clamped * params.wavelength : params.waveSpeed,
    });
  };

  const handleWavelengthChange = (val: number) => {
    const clamped = Math.max(0.2, Math.min(5.0, val));
    onChangeParams({
      ...params,
      wavelength: clamped,
      waveSpeed: params.lockSpeedToPhysics ? params.frequency * clamped : params.waveSpeed,
    });
  };

  const handleAmplitudeChange = (val: number) => {
    const clamped = Math.max(0.1, Math.min(2.0, val));
    onChangeParams({
      ...params,
      amplitude: clamped,
      amplitude1: clamped,
      amplitude2: clamped,
    });
  };

  const handleSeparationChange = (val: number) => {
    const clamped = Math.max(0.5, Math.min(5.0, val));
    onChangeParams({
      ...params,
      separation: clamped,
    });
  };

  const handlePhaseDiffChange = (val: number) => {
    const clamped = Math.max(0, Math.min(360, val));
    onChangeParams({
      ...params,
      phaseDifferenceDeg: clamped,
      sourcePhase1Deg: 0,
      sourcePhase2Deg: clamped,
    });
  };

  const handleWaveSpeedChange = (val: number) => {
    const clamped = Math.max(0.5, Math.min(10.0, val));
    onChangeParams({
      ...params,
      waveSpeed: clamped,
    });
  };

  const toggleLockSpeed = () => {
    const nextLocked = !params.lockSpeedToPhysics;
    onChangeParams({
      ...params,
      lockSpeedToPhysics: nextLocked,
      waveSpeed: nextLocked ? calculatedSpeed : params.waveSpeed,
    });
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
              Wave Source Controls
            </h2>
            <p className="text-[11px] text-slate-400">
              Real-time physical parameter configuration
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

      <div className="space-y-4">
        {/* A. Frequency Slider & Input (0.5 to 10 Hz, default 2 Hz) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="text-slate-300 font-medium">Frequency (f)</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0.5"
                max="10.0"
                step="0.1"
                value={params.frequency}
                onChange={(e) => handleFrequencyChange(parseFloat(e.target.value) || 0.5)}
                className="w-16 px-1.5 py-0.5 text-right font-mono text-xs bg-[#07111F] border border-slate-700 rounded text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
              <span className="font-mono text-slate-400 text-xs">Hz</span>
            </div>
          </div>
          <input
            type="range"
            min="0.5"
            max="10.0"
            step="0.1"
            value={params.frequency}
            onChange={(e) => handleFrequencyChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0.5 Hz</span>
            <span>Default: 2.0 Hz</span>
            <span>10.0 Hz</span>
          </div>
        </div>

        {/* B. Wavelength Slider & Input (0.2 to 5 m, default 1 m) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="text-slate-300 font-medium">Wavelength (λ)</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0.2"
                max="5.0"
                step="0.1"
                value={params.wavelength}
                onChange={(e) => handleWavelengthChange(parseFloat(e.target.value) || 0.2)}
                className="w-16 px-1.5 py-0.5 text-right font-mono text-xs bg-[#07111F] border border-slate-700 rounded text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
              <span className="font-mono text-slate-400 text-xs">m</span>
            </div>
          </div>
          <input
            type="range"
            min="0.2"
            max="5.0"
            step="0.1"
            value={params.wavelength}
            onChange={(e) => handleWavelengthChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0.2 m</span>
            <span>Default: 1.0 m</span>
            <span>5.0 m</span>
          </div>
        </div>

        {/* C. Amplitude Slider & Input (0.1 to 2.0, default 1.0) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="text-slate-300 font-medium">Source Amplitude (A)</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0.1"
                max="2.0"
                step="0.1"
                value={params.amplitude}
                onChange={(e) => handleAmplitudeChange(parseFloat(e.target.value) || 0.1)}
                className="w-16 px-1.5 py-0.5 text-right font-mono text-xs bg-[#07111F] border border-slate-700 rounded text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
              <span className="font-mono text-slate-400 text-xs">a.u.</span>
            </div>
          </div>
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={params.amplitude}
            onChange={(e) => handleAmplitudeChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0.1 a.u.</span>
            <span>Default: 1.0</span>
            <span>2.0 a.u.</span>
          </div>
        </div>

        {/* D. Distance Between Sources Slider & Input (0.5 to 5 m, default 2 m) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="text-slate-300 font-medium">Distance Between Sources (d)</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0.5"
                max="5.0"
                step="0.1"
                value={params.separation}
                onChange={(e) => handleSeparationChange(parseFloat(e.target.value) || 0.5)}
                className="w-16 px-1.5 py-0.5 text-right font-mono text-xs bg-[#07111F] border border-slate-700 rounded text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
              <span className="font-mono text-slate-400 text-xs">m</span>
            </div>
          </div>
          <input
            type="range"
            min="0.5"
            max="5.0"
            step="0.1"
            value={params.separation}
            onChange={(e) => handleSeparationChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0.5 m</span>
            <span>Default: 2.0 m</span>
            <span>5.0 m</span>
          </div>
        </div>

        {/* E. Phase Difference Slider & Input (0° to 360°, default 0°) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="text-slate-300 font-medium">Initial Phase Difference (Δφ₀)</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max="360"
                step="5"
                value={params.phaseDifferenceDeg}
                onChange={(e) => handlePhaseDiffChange(parseFloat(e.target.value) || 0)}
                className="w-16 px-1.5 py-0.5 text-right font-mono text-xs bg-[#07111F] border border-slate-700 rounded text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
              <span className="font-mono text-slate-400 text-xs">deg</span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            step="5"
            value={params.phaseDifferenceDeg}
            onChange={(e) => handlePhaseDiffChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0° (In-Phase)</span>
            <span>180° (Anti-Phase)</span>
            <span>360°</span>
          </div>
        </div>

        {/* F. Wave Speed & Relationship Section */}
        <div className="p-3 rounded-lg bg-[#07111F] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <label className="text-slate-300 font-medium">Wave Speed (v)</label>
              <button
                onClick={toggleLockSpeed}
                className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                  params.lockSpeedToPhysics
                    ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/40'
                    : 'text-amber-400 bg-amber-950/40 border border-amber-500/40'
                }`}
                title={
                  params.lockSpeedToPhysics
                    ? 'Speed strictly locked to physical relation v = fλ'
                    : 'Speed independently adjustable (experimental setting)'
                }
              >
                {params.lockSpeedToPhysics ? (
                  <span className="flex items-center gap-1 text-[10px]">
                    <Link2 className="w-3 h-3" /> v = fλ Locked
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px]">
                    <Link2Off className="w-3 h-3" /> Independent
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0.5"
                max="10.0"
                step="0.1"
                disabled={params.lockSpeedToPhysics}
                value={params.lockSpeedToPhysics ? calculatedSpeed.toFixed(1) : params.waveSpeed}
                onChange={(e) => handleWaveSpeedChange(parseFloat(e.target.value) || 0.5)}
                className={`w-16 px-1.5 py-0.5 text-right font-mono text-xs bg-[#101D30] border rounded ${
                  params.lockSpeedToPhysics
                    ? 'border-emerald-500/50 text-emerald-300 cursor-not-allowed'
                    : 'border-slate-700 text-cyan-300'
                }`}
              />
              <span className="font-mono text-slate-400 text-xs">m/s</span>
            </div>
          </div>

          {!params.lockSpeedToPhysics && (
            <input
              type="range"
              min="0.5"
              max="10.0"
              step="0.1"
              value={params.waveSpeed}
              onChange={(e) => handleWaveSpeedChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          )}

          <div className="flex items-start gap-1.5 pt-1 text-[11px] text-slate-400">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              Fundamental physical relation: <strong className="text-white">v = fλ</strong> = ({params.frequency} Hz × {params.wavelength} m) = <span className="font-mono font-bold text-emerald-300">{calculatedSpeed.toFixed(2)} m/s</span>.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
