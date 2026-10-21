/**
 * EQUATION 1 — Newton's Laws Parameters Panel
 * Adapts controls to First Law, Second Law, and Third Law modes.
 */

import React from 'react';
import {
  NewtonFirstLawParameters,
  NewtonMode,
  NewtonSecondLawParameters,
  NewtonThirdLawParameters,
  NewtonVectorOptions,
} from '../../physics/newton/types';
import { Sliders, Eye, Sparkles, RotateCcw } from 'lucide-react';

interface NewtonParametersProps {
  mode: NewtonMode;
  secondLawParams: NewtonSecondLawParameters;
  onChangeSecondLawParams: (params: NewtonSecondLawParameters) => void;
  firstLawParams: NewtonFirstLawParameters;
  onChangeFirstLawParams: (params: NewtonFirstLawParameters) => void;
  thirdLawParams: NewtonThirdLawParameters;
  onChangeThirdLawParams: (params: NewtonThirdLawParameters) => void;
  vectorOptions: NewtonVectorOptions;
  onChangeVectorOptions: (opts: NewtonVectorOptions) => void;
  onOpenPresets: () => void;
  onReset: () => void;
}

export const NewtonParameters: React.FC<NewtonParametersProps> = ({
  mode,
  secondLawParams,
  onChangeSecondLawParams,
  firstLawParams,
  onChangeFirstLawParams,
  thirdLawParams,
  onChangeThirdLawParams,
  vectorOptions,
  onChangeVectorOptions,
  onOpenPresets,
  onReset,
}) => {
  const toggleVectorOpt = (key: keyof NewtonVectorOptions) => {
    onChangeVectorOptions({
      ...vectorOptions,
      [key]: !vectorOptions[key],
    });
  };

  return (
    <div className="bg-[#0b101b] border border-slate-800/90 rounded-lg p-4 select-none space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Experiment Controls
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPresets}
            className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
            title="Browse scenario presets"
          >
            <Sparkles className="w-3 h-3" />
            <span>Presets</span>
          </button>
          <button
            onClick={onReset}
            className="text-[11px] font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Reset to default experiment state"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Mode 2: Second Law Parameters */}
      {mode === 'second-law' && (
        <div className="space-y-3.5">
          {/* Mass m */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="param-mass" className="text-slate-300 font-medium">
                Mass <span className="text-slate-400 font-mono">(m)</span>
              </label>
              <div className="flex items-center gap-1">
                <input
                  id="param-mass"
                  type="number"
                  min={0.5}
                  max={50}
                  step={0.5}
                  value={secondLawParams.mass}
                  onChange={(e) =>
                    onChangeSecondLawParams({
                      ...secondLawParams,
                      mass: Math.max(0.1, parseFloat(e.target.value) || 0.1),
                    })
                  }
                  className="w-16 px-2 py-0.5 bg-[#07090e] border border-slate-700 rounded text-right font-mono text-xs text-white tabular-nums focus:outline-none focus:border-cyan-400"
                />
                <span className="text-[11px] font-mono text-slate-400 w-6">kg</span>
              </div>
            </div>
            <input
              type="range"
              min={0.5}
              max={20}
              step={0.5}
              value={secondLawParams.mass}
              onChange={(e) =>
                onChangeSecondLawParams({
                  ...secondLawParams,
                  mass: parseFloat(e.target.value),
                })
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>0.5 kg</span>
              <span>2.0 kg (Default)</span>
              <span>20 kg</span>
            </div>
          </div>

          {/* Primary Applied Force F1 */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="param-force1" className="text-slate-300 font-medium">
                Applied Force <span className="text-slate-400 font-mono">(F₁)</span>
              </label>
              <div className="flex items-center gap-1">
                <input
                  id="param-force1"
                  type="number"
                  min={-100}
                  max={100}
                  step={1}
                  value={secondLawParams.appliedForce}
                  onChange={(e) =>
                    onChangeSecondLawParams({
                      ...secondLawParams,
                      appliedForce: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-16 px-2 py-0.5 bg-[#07090e] border border-slate-700 rounded text-right font-mono text-xs text-white tabular-nums focus:outline-none focus:border-cyan-400"
                />
                <span className="text-[11px] font-mono text-slate-400 w-6">N</span>
              </div>
            </div>
            <input
              type="range"
              min={-50}
              max={50}
              step={1}
              value={secondLawParams.appliedForce}
              onChange={(e) =>
                onChangeSecondLawParams({
                  ...secondLawParams,
                  appliedForce: parseFloat(e.target.value),
                })
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>-50 N (←)</span>
              <span>0 N</span>
              <span>+50 N (→)</span>
            </div>
          </div>

          {/* Opposing Secondary Force F2 */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="param-force2" className="text-slate-300 font-medium">
                Opposing Force <span className="text-slate-400 font-mono">(F₂)</span>
              </label>
              <div className="flex items-center gap-1">
                <input
                  id="param-force2"
                  type="number"
                  min={-100}
                  max={100}
                  step={1}
                  value={secondLawParams.opposingForce}
                  onChange={(e) =>
                    onChangeSecondLawParams({
                      ...secondLawParams,
                      opposingForce: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-16 px-2 py-0.5 bg-[#07090e] border border-slate-700 rounded text-right font-mono text-xs text-white tabular-nums focus:outline-none focus:border-cyan-400"
                />
                <span className="text-[11px] font-mono text-slate-400 w-6">N</span>
              </div>
            </div>
            <input
              type="range"
              min={-50}
              max={50}
              step={1}
              value={secondLawParams.opposingForce}
              onChange={(e) =>
                onChangeSecondLawParams({
                  ...secondLawParams,
                  opposingForce: parseFloat(e.target.value),
                })
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
            />
          </div>

          {/* Initial Velocity v0 */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="param-vel0" className="text-slate-300 font-medium">
                Initial Velocity <span className="text-slate-400 font-mono">(v₀)</span>
              </label>
              <div className="flex items-center gap-1">
                <input
                  id="param-vel0"
                  type="number"
                  min={-20}
                  max={20}
                  step={0.5}
                  value={secondLawParams.initialVelocity}
                  onChange={(e) =>
                    onChangeSecondLawParams({
                      ...secondLawParams,
                      initialVelocity: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-16 px-2 py-0.5 bg-[#07090e] border border-slate-700 rounded text-right font-mono text-xs text-white tabular-nums focus:outline-none focus:border-cyan-400"
                />
                <span className="text-[11px] font-mono text-slate-400 w-6">m/s</span>
              </div>
            </div>
            <input
              type="range"
              min={-20}
              max={20}
              step={0.5}
              value={secondLawParams.initialVelocity}
              onChange={(e) =>
                onChangeSecondLawParams({
                  ...secondLawParams,
                  initialVelocity: parseFloat(e.target.value),
                })
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
            />
          </div>

          {/* Section 13: Optional Friction Toggle */}
          <div className="p-2.5 bg-[#07090e] border border-slate-800 rounded space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-300 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={secondLawParams.frictionEnabled}
                  onChange={(e) =>
                    onChangeSecondLawParams({
                      ...secondLawParams,
                      frictionEnabled: e.target.checked,
                    })
                  }
                  className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0 accent-amber-400"
                />
                <span>Surface Friction (f_k = μ_k N)</span>
              </label>
              <span className="text-[11px] font-mono text-amber-400">
                μ = {secondLawParams.frictionCoeff.toFixed(2)}
              </span>
            </div>

            {secondLawParams.frictionEnabled && (
              <div className="space-y-1 pt-1">
                <input
                  type="range"
                  min={0.05}
                  max={0.8}
                  step={0.05}
                  value={secondLawParams.frictionCoeff}
                  onChange={(e) =>
                    onChangeSecondLawParams({
                      ...secondLawParams,
                      frictionCoeff: parseFloat(e.target.value),
                    })
                  }
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
                />
                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                  <span>0.05 (Smooth Ice)</span>
                  <span>0.25 (Wood)</span>
                  <span>0.80 (Rubber)</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 1: First Law Parameters */}
      {mode === 'first-law' && (
        <div className="space-y-3.5">
          <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-emerald-400 block mb-1">Principle of Inertia:</span>
            When the net external force is zero (<span className="font-mono text-white">F_net = 0</span>), acceleration is zero (<span className="font-mono text-white">a = 0</span>). The object maintains its exact velocity indefinitely.
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="fl-param-v0" className="text-slate-300 font-medium">
                Initial Velocity <span className="font-mono text-slate-400">(v₀)</span>
              </label>
              <span className="font-mono text-white text-xs">{firstLawParams.initialVelocity} m/s</span>
            </div>
            <input
              id="fl-param-v0"
              type="range"
              min={-15}
              max={15}
              step={1}
              value={firstLawParams.initialVelocity}
              onChange={(e) =>
                onChangeFirstLawParams({
                  ...firstLawParams,
                  initialVelocity: parseFloat(e.target.value),
                })
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>-15 m/s</span>
              <span>0 m/s (Rest)</span>
              <span>+15 m/s</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="fl-param-force" className="text-slate-300 font-medium">
                Net External Force <span className="font-mono text-slate-400">(F)</span>
              </label>
              <span className="font-mono text-emerald-400 text-xs">{firstLawParams.appliedForce} N</span>
            </div>
            <input
              id="fl-param-force"
              type="range"
              min={-20}
              max={20}
              step={1}
              value={firstLawParams.appliedForce}
              onChange={(e) =>
                onChangeFirstLawParams({
                  ...firstLawParams,
                  appliedForce: parseFloat(e.target.value),
                })
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>-20 N</span>
              <span>0 N (Zero Net Force)</span>
              <span>+20 N</span>
            </div>
          </div>
        </div>
      )}

      {/* Mode 3: Third Law Parameters */}
      {mode === 'third-law' && (
        <div className="space-y-3.5">
          <div className="p-3 bg-purple-950/30 border border-purple-500/30 rounded text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-purple-400 block mb-1">Action & Reaction:</span>
            For every action, there is an equal and opposite reaction force (<span className="font-mono text-white">F_AB = -F_BA</span>).
            Equal forces produce <span className="text-purple-300 font-semibold">different accelerations</span> if the masses differ!
          </div>

          {/* Mass A */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="param-mass-a" className="text-slate-300 font-medium">
                Mass of Object A <span className="text-cyan-400 font-mono">(m_A)</span>
              </label>
              <span className="font-mono text-cyan-400 text-xs">{thirdLawParams.massA.toFixed(1)} kg</span>
            </div>
            <input
              id="param-mass-a"
              type="range"
              min={1}
              max={15}
              step={0.5}
              value={thirdLawParams.massA}
              onChange={(e) =>
                onChangeThirdLawParams({
                  ...thirdLawParams,
                  massA: parseFloat(e.target.value),
                })
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
            />
          </div>

          {/* Mass B */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="param-mass-b" className="text-slate-300 font-medium">
                Mass of Object B <span className="text-purple-400 font-mono">(m_B)</span>
              </label>
              <span className="font-mono text-purple-400 text-xs">{thirdLawParams.massB.toFixed(1)} kg</span>
            </div>
            <input
              id="param-mass-b"
              type="range"
              min={1}
              max={15}
              step={0.5}
              value={thirdLawParams.massB}
              onChange={(e) =>
                onChangeThirdLawParams({
                  ...thirdLawParams,
                  massB: parseFloat(e.target.value),
                })
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400 focus:outline-none"
            />
          </div>

          {/* Mutual Interaction Force F */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="param-force-int" className="text-slate-300 font-medium">
                Mutual Push Force <span className="font-mono text-slate-400">(|F|)</span>
              </label>
              <span className="font-mono text-white text-xs">{thirdLawParams.interactionForce} N</span>
            </div>
            <input
              id="param-force-int"
              type="range"
              min={5}
              max={50}
              step={1}
              value={thirdLawParams.interactionForce}
              onChange={(e) =>
                onChangeThirdLawParams({
                  ...thirdLawParams,
                  interactionForce: parseFloat(e.target.value),
                })
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400 focus:outline-none"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>5 N</span>
              <span>20 N (Default)</span>
              <span>50 N</span>
            </div>
          </div>
        </div>
      )}

      {/* Vector & Overlay Toggles */}
      <div className="pt-2 border-t border-slate-800/60 space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>Vector Overlays</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer">
            <input
              type="checkbox"
              checked={vectorOptions.showAppliedForce}
              onChange={() => toggleVectorOpt('showAppliedForce')}
              className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 accent-cyan-400"
            />
            <span>Applied Force (F)</span>
          </label>

          <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer">
            <input
              type="checkbox"
              checked={vectorOptions.showNetForce}
              onChange={() => toggleVectorOpt('showNetForce')}
              className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-0 accent-emerald-400"
            />
            <span>Net Force (ΣF)</span>
          </label>

          <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer">
            <input
              type="checkbox"
              checked={vectorOptions.showAccelerationVector}
              onChange={() => toggleVectorOpt('showAccelerationVector')}
              className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0 accent-amber-400"
            />
            <span>Acceleration (a)</span>
          </label>

          <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer">
            <input
              type="checkbox"
              checked={vectorOptions.showVelocityVector}
              onChange={() => toggleVectorOpt('showVelocityVector')}
              className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 accent-cyan-400"
            />
            <span>Velocity (v)</span>
          </label>

          <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer">
            <input
              type="checkbox"
              checked={vectorOptions.showForceLabels}
              onChange={() => toggleVectorOpt('showForceLabels')}
              className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 accent-cyan-400"
            />
            <span>Force Values</span>
          </label>

          <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer">
            <input
              type="checkbox"
              checked={vectorOptions.showSurfaceGrid}
              onChange={() => toggleVectorOpt('showSurfaceGrid')}
              className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 accent-cyan-400"
            />
            <span>Metric Track</span>
          </label>
        </div>
      </div>
    </div>
  );
};
