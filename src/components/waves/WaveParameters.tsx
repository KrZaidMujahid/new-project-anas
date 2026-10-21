/**
 * EQUATION 1 — Wave Interference Parameter Control Panel
 * Sliders and precision numeric inputs with physical units, boundary enforcement,
 * same-medium constraint locking, and dynamic adaptation per experiment mode.
 */

import React from 'react';
import {
  WaveExperimentMode,
  WaveSuperpositionParameters,
  TwoSourceParameters,
} from '../../physics/waves/types';
import { Sliders, Sparkles, RotateCcw, Link, Unlink, ArrowRightLeft } from 'lucide-react';

interface WaveParametersProps {
  mode: WaveExperimentMode;
  superpositionParams: WaveSuperpositionParameters;
  twoSourceParams: TwoSourceParameters;
  onChangeSuperpositionParams: (params: WaveSuperpositionParameters) => void;
  onChangeTwoSourceParams: (params: TwoSourceParameters) => void;
  onOpenPresets: () => void;
  onReset: () => void;
}

export const WaveParameters: React.FC<WaveParametersProps> = ({
  mode,
  superpositionParams,
  twoSourceParams,
  onChangeSuperpositionParams,
  onChangeTwoSourceParams,
  onOpenPresets,
  onReset,
}) => {
  // Helper for numeric inputs
  const handleNumericInput = (
    valStr: string,
    min: number,
    max: number,
    onApply: (v: number) => void
  ) => {
    const parsed = parseFloat(valStr);
    if (Number.isNaN(parsed)) return;
    const clamped = Math.max(min, Math.min(max, parsed));
    onApply(clamped);
  };

  return (
    <div className="bg-[#090d16] border border-slate-800/90 rounded-xl p-4 sm:p-5 select-none space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold text-white tracking-wider uppercase font-mono">
            {mode === 'superposition' ? 'Wave Superposition Controls' : 'Two-Source Spatial Controls'}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPresets}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 rounded-md transition-colors cursor-pointer"
            title="Load benchmark interference presets"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Presets</span>
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-md transition-colors cursor-pointer"
            title="Reset parameters to defaults"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* ---------------- MODE A: SUPERPOSITION CONTROLS ---------------- */}
      {mode === 'superposition' && (
        <div className="space-y-4">
          {/* Same Medium Lock Toggle */}
          <div className="flex items-center justify-between p-2.5 bg-[#07090e] border border-slate-800 rounded-lg">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                {superpositionParams.sameMediumLocked ? (
                  <Link className="w-3.5 h-3.5 text-cyan-400" />
                ) : (
                  <Unlink className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>Identical Medium (Same Speed v)</span>
              </span>
              <p className="text-[10px] text-slate-500">
                Enforces equal propagation speed v = fλ across both traveling waves.
              </p>
            </div>
            <button
              onClick={() => {
                const newLocked = !superpositionParams.sameMediumLocked;
                onChangeSuperpositionParams({
                  ...superpositionParams,
                  sameMediumLocked: newLocked,
                  wave2: newLocked
                    ? {
                        ...superpositionParams.wave2,
                        wavelength: superpositionParams.wave1.wavelength,
                        frequency: superpositionParams.wave1.frequency,
                      }
                    : superpositionParams.wave2,
                });
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-colors cursor-pointer ${
                superpositionParams.sameMediumLocked
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {superpositionParams.sameMediumLocked ? 'LOCKED' : 'INDEPENDENT'}
            </button>
          </div>

          {/* Wave 1 Parameters (Cyan) */}
          <div className="p-3 bg-cyan-950/10 border border-cyan-500/20 rounded-lg space-y-3">
            <span className="text-xs font-bold text-cyan-400 font-mono flex items-center justify-between">
              <span>WAVE 1 (Cyan)</span>
              <span className="text-[10px] text-slate-500">
                v₁ = {(superpositionParams.wave1.frequency * superpositionParams.wave1.wavelength).toFixed(2)} m/s
              </span>
            </span>

            {/* A1 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Amplitude A₁ [m]:</span>
                <input
                  type="number"
                  step={0.1}
                  min={0}
                  max={2.0}
                  value={superpositionParams.wave1.amplitude}
                  onChange={(e) =>
                    handleNumericInput(e.target.value, 0, 2.0, (val) =>
                      onChangeSuperpositionParams({
                        ...superpositionParams,
                        wave1: { ...superpositionParams.wave1, amplitude: val },
                      })
                    )
                  }
                  className="w-16 px-1.5 py-0.5 text-right font-mono text-xs bg-[#07090e] border border-slate-700 rounded text-cyan-400"
                />
              </div>
              <input
                type="range"
                min={0}
                max={2.0}
                step={0.05}
                value={superpositionParams.wave1.amplitude}
                onChange={(e) =>
                  onChangeSuperpositionParams({
                    ...superpositionParams,
                    wave1: { ...superpositionParams.wave1, amplitude: parseFloat(e.target.value) },
                  })
                }
                className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* λ1 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Wavelength λ₁ [m]:</span>
                <input
                  type="number"
                  step={0.2}
                  min={0.5}
                  max={8.0}
                  value={superpositionParams.wave1.wavelength}
                  onChange={(e) =>
                    handleNumericInput(e.target.value, 0.5, 8.0, (val) => {
                      const next = { ...superpositionParams };
                      next.wave1.wavelength = val;
                      if (next.sameMediumLocked) next.wave2.wavelength = val;
                      onChangeSuperpositionParams(next);
                    })
                  }
                  className="w-16 px-1.5 py-0.5 text-right font-mono text-xs bg-[#07090e] border border-slate-700 rounded text-cyan-400"
                />
              </div>
              <input
                type="range"
                min={0.8}
                max={6.0}
                step={0.1}
                value={superpositionParams.wave1.wavelength}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  const next = { ...superpositionParams };
                  next.wave1.wavelength = val;
                  if (next.sameMediumLocked) next.wave2.wavelength = val;
                  onChangeSuperpositionParams(next);
                }}
                className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* f1 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Frequency f₁ [Hz]:</span>
                <input
                  type="number"
                  step={0.1}
                  min={0.1}
                  max={4.0}
                  value={superpositionParams.wave1.frequency}
                  onChange={(e) =>
                    handleNumericInput(e.target.value, 0.1, 4.0, (val) => {
                      const next = { ...superpositionParams };
                      next.wave1.frequency = val;
                      if (next.sameMediumLocked) next.wave2.frequency = val;
                      onChangeSuperpositionParams(next);
                    })
                  }
                  className="w-16 px-1.5 py-0.5 text-right font-mono text-xs bg-[#07090e] border border-slate-700 rounded text-cyan-400"
                />
              </div>
              <input
                type="range"
                min={0.2}
                max={3.0}
                step={0.1}
                value={superpositionParams.wave1.frequency}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  const next = { ...superpositionParams };
                  next.wave1.frequency = val;
                  if (next.sameMediumLocked) next.wave2.frequency = val;
                  onChangeSuperpositionParams(next);
                }}
                className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>

          {/* Wave 2 Parameters (Violet) */}
          <div className="p-3 bg-purple-950/10 border border-purple-500/20 rounded-lg space-y-3">
            <span className="text-xs font-bold text-purple-400 font-mono flex items-center justify-between">
              <span>WAVE 2 (Violet)</span>
              <span className="text-[10px] text-slate-500">
                v₂ = {(superpositionParams.wave2.frequency * superpositionParams.wave2.wavelength).toFixed(2)} m/s
              </span>
            </span>

            {/* A2 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Amplitude A₂ [m]:</span>
                <input
                  type="number"
                  step={0.1}
                  min={0}
                  max={2.0}
                  value={superpositionParams.wave2.amplitude}
                  onChange={(e) =>
                    handleNumericInput(e.target.value, 0, 2.0, (val) =>
                      onChangeSuperpositionParams({
                        ...superpositionParams,
                        wave2: { ...superpositionParams.wave2, amplitude: val },
                      })
                    )
                  }
                  className="w-16 px-1.5 py-0.5 text-right font-mono text-xs bg-[#07090e] border border-slate-700 rounded text-purple-400"
                />
              </div>
              <input
                type="range"
                min={0}
                max={2.0}
                step={0.05}
                value={superpositionParams.wave2.amplitude}
                onChange={(e) =>
                  onChangeSuperpositionParams({
                    ...superpositionParams,
                    wave2: { ...superpositionParams.wave2, amplitude: parseFloat(e.target.value) },
                  })
                }
                className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-purple-400"
              />
            </div>

            {/* λ2 (Enabled if not locked) */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Wavelength λ₂ [m]:</span>
                <input
                  type="number"
                  step={0.2}
                  min={0.5}
                  max={8.0}
                  disabled={superpositionParams.sameMediumLocked}
                  value={superpositionParams.wave2.wavelength}
                  onChange={(e) =>
                    handleNumericInput(e.target.value, 0.5, 8.0, (val) =>
                      onChangeSuperpositionParams({
                        ...superpositionParams,
                        wave2: { ...superpositionParams.wave2, wavelength: val },
                      })
                    )
                  }
                  className="w-16 px-1.5 py-0.5 text-right font-mono text-xs bg-[#07090e] border border-slate-700 rounded text-purple-400 disabled:opacity-50"
                />
              </div>
              <input
                type="range"
                min={0.8}
                max={6.0}
                step={0.1}
                disabled={superpositionParams.sameMediumLocked}
                value={superpositionParams.wave2.wavelength}
                onChange={(e) =>
                  onChangeSuperpositionParams({
                    ...superpositionParams,
                    wave2: { ...superpositionParams.wave2, wavelength: parseFloat(e.target.value) },
                  })
                }
                className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-purple-400 disabled:opacity-40"
              />
            </div>

            {/* f2 (Enabled if not locked) */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Frequency f₂ [Hz]:</span>
                <input
                  type="number"
                  step={0.1}
                  min={0.1}
                  max={4.0}
                  disabled={superpositionParams.sameMediumLocked}
                  value={superpositionParams.wave2.frequency}
                  onChange={(e) =>
                    handleNumericInput(e.target.value, 0.1, 4.0, (val) =>
                      onChangeSuperpositionParams({
                        ...superpositionParams,
                        wave2: { ...superpositionParams.wave2, frequency: val },
                      })
                    )
                  }
                  className="w-16 px-1.5 py-0.5 text-right font-mono text-xs bg-[#07090e] border border-slate-700 rounded text-purple-400 disabled:opacity-50"
                />
              </div>
              <input
                type="range"
                min={0.2}
                max={3.0}
                step={0.1}
                disabled={superpositionParams.sameMediumLocked}
                value={superpositionParams.wave2.frequency}
                onChange={(e) =>
                  onChangeSuperpositionParams({
                    ...superpositionParams,
                    wave2: { ...superpositionParams.wave2, frequency: parseFloat(e.target.value) },
                  })
                }
                className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-purple-400 disabled:opacity-40"
              />
            </div>
          </div>

          {/* Relative Phase Difference Δφ Slider */}
          <div className="p-3 bg-amber-950/10 border border-amber-500/20 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-amber-300">
                Relative Phase Δφ (φ₂ - φ₁)
              </span>
              <div className="flex items-center gap-1 font-mono text-xs text-amber-400">
                <span>{superpositionParams.wave2.initialPhaseDeg.toFixed(0)}°</span>
                <span className="text-slate-500">/</span>
                <span>{((superpositionParams.wave2.initialPhaseDeg * Math.PI) / 180).toFixed(2)} rad</span>
              </div>
            </div>
            <input
              type="range"
              min={-180}
              max={180}
              step={5}
              value={superpositionParams.wave2.initialPhaseDeg}
              onChange={(e) =>
                onChangeSuperpositionParams({
                  ...superpositionParams,
                  wave2: { ...superpositionParams.wave2, initialPhaseDeg: parseFloat(e.target.value) },
                })
              }
              className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>-180° (Destructive)</span>
              <span>0° (Constructive)</span>
              <span>+180° (Destructive)</span>
            </div>
          </div>

          {/* Propagation Directions (Forward vs. Standing Waves) */}
          <div className="space-y-1 text-xs">
            <span className="font-mono text-slate-400 uppercase text-[10px] block">
              Propagation Direction
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() =>
                  onChangeSuperpositionParams({
                    ...superpositionParams,
                    wave2: { ...superpositionParams.wave2, direction: 'forward' },
                  })
                }
                className={`py-1.5 px-2 rounded text-[11px] font-mono font-medium border transition-colors cursor-pointer ${
                  superpositionParams.wave2.direction === 'forward'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-[#07090e] text-slate-400 border-slate-800'
                }`}
              >
                Same Direction (+x, +x)
              </button>
              <button
                onClick={() =>
                  onChangeSuperpositionParams({
                    ...superpositionParams,
                    wave2: { ...superpositionParams.wave2, direction: 'backward' },
                  })
                }
                className={`py-1.5 px-2 rounded text-[11px] font-mono font-medium border transition-colors cursor-pointer ${
                  superpositionParams.wave2.direction === 'backward'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                    : 'bg-[#07090e] text-slate-400 border-slate-800'
                }`}
                title="Create stationary Standing Waves with fixed nodes!"
              >
                Opposite (+x, -x) [Standing]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODE B & C: TWO-SOURCE CONTROLS ---------------- */}
      {mode !== 'superposition' && (
        <div className="space-y-4">
          {/* Source Separation d */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Source Separation (d) [m]:</span>
              <input
                type="number"
                step={0.2}
                min={0.5}
                max={6.0}
                value={twoSourceParams.separation}
                onChange={(e) =>
                  handleNumericInput(e.target.value, 0.5, 6.0, (val) =>
                    onChangeTwoSourceParams({ ...twoSourceParams, separation: val })
                  )
                }
                className="w-16 px-1.5 py-0.5 text-right font-mono text-xs bg-[#07090e] border border-slate-700 rounded text-cyan-400"
              />
            </div>
            <input
              type="range"
              min={0.8}
              max={5.0}
              step={0.1}
              value={twoSourceParams.separation}
              onChange={(e) =>
                onChangeTwoSourceParams({
                  ...twoSourceParams,
                  separation: parseFloat(e.target.value),
                })
              }
              className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0.8 m</span>
              <span>3.0 m (standard)</span>
              <span>5.0 m</span>
            </div>
          </div>

          {/* Wavelength λ */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Wavelength (λ) [m]:</span>
              <input
                type="number"
                step={0.1}
                min={0.2}
                max={4.0}
                value={twoSourceParams.wavelength}
                onChange={(e) =>
                  handleNumericInput(e.target.value, 0.2, 4.0, (val) =>
                    onChangeTwoSourceParams({ ...twoSourceParams, wavelength: val })
                  )
                }
                className="w-16 px-1.5 py-0.5 text-right font-mono text-xs bg-[#07090e] border border-slate-700 rounded text-cyan-400"
              />
            </div>
            <input
              type="range"
              min={0.4}
              max={2.5}
              step={0.05}
              value={twoSourceParams.wavelength}
              onChange={(e) =>
                onChangeTwoSourceParams({
                  ...twoSourceParams,
                  wavelength: parseFloat(e.target.value),
                })
              }
              className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0.4 m</span>
              <span>1.0 m</span>
              <span>2.5 m</span>
            </div>
          </div>

          {/* Frequency f */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Frequency (f) [Hz]:</span>
              <input
                type="number"
                step={0.1}
                min={0.2}
                max={4.0}
                value={twoSourceParams.frequency}
                onChange={(e) =>
                  handleNumericInput(e.target.value, 0.2, 4.0, (val) =>
                    onChangeTwoSourceParams({ ...twoSourceParams, frequency: val })
                  )
                }
                className="w-16 px-1.5 py-0.5 text-right font-mono text-xs bg-[#07090e] border border-slate-700 rounded text-cyan-400"
              />
            </div>
            <input
              type="range"
              min={0.3}
              max={3.0}
              step={0.1}
              value={twoSourceParams.frequency}
              onChange={(e) =>
                onChangeTwoSourceParams({
                  ...twoSourceParams,
                  frequency: parseFloat(e.target.value),
                })
              }
              className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Initial Relative Phase Difference Δφ0 */}
          <div className="p-3 bg-[#07090e] border border-slate-800 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">
                Source Phase Shift Δφ₀
              </span>
              <span className="font-mono text-xs text-amber-400">
                {twoSourceParams.sourcePhase2Deg.toFixed(0)}°
              </span>
            </div>
            <input
              type="range"
              min={-180}
              max={180}
              step={10}
              value={twoSourceParams.sourcePhase2Deg}
              onChange={(e) =>
                onChangeTwoSourceParams({
                  ...twoSourceParams,
                  sourcePhase2Deg: parseFloat(e.target.value),
                })
              }
              className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>-180° (Opposite Phase)</span>
              <span>0° (In Phase)</span>
              <span>+180°</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
