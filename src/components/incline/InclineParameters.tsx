/**
 * EQUATION 1 — Inclined Plane Parameters Panel
 * Provides continuous sliders, numeric inputs, preset shortcuts, and vector display toggles.
 */

import React from 'react';
import {
  InclineMode,
  type InclineParameters as InclineParamsType,
  InclineVectorOptions,
} from '../../physics/incline/types';
import { GRAVITY_PRESETS } from '../../physics/incline/model';
import { Sliders, Eye, Sparkles, RotateCcw, ArrowUp, ArrowDown } from 'lucide-react';

interface InclineParametersProps {
  mode: InclineMode;
  params: InclineParamsType;
  onChangeParams: (params: InclineParamsType) => void;
  vectorOptions: InclineVectorOptions;
  onChangeVectorOptions: (opts: InclineVectorOptions) => void;
  onOpenPresets: () => void;
  onReset: () => void;
}

export const InclineParameters: React.FC<InclineParametersProps> = ({
  mode,
  params,
  onChangeParams,
  vectorOptions,
  onChangeVectorOptions,
  onOpenPresets,
  onReset,
}) => {
  const toggleVectorOpt = (key: keyof InclineVectorOptions) => {
    onChangeVectorOptions({
      ...vectorOptions,
      [key]: !vectorOptions[key],
    });
  };

  const angleOfReposeDeg = params.frictionEnabled
    ? ((Math.atan(params.staticFrictionCoeff) * 180) / Math.PI).toFixed(1)
    : null;

  return (
    <div className="bg-[#0b101b] border border-slate-800/90 rounded-lg p-4 select-none space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Physical Parameters
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
            title="Reset to default experiment parameters"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Incline Angle θ */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="param-angle" className="text-slate-300 font-medium">
              Incline Angle <span className="text-cyan-400 font-mono">(θ)</span>
            </label>
            <div className="flex items-center gap-1">
              <input
                id="param-angle"
                type="number"
                min={0}
                max={85}
                step={0.5}
                value={params.angleDeg}
                onChange={(e) =>
                  onChangeParams({
                    ...params,
                    angleDeg: Math.max(0, Math.min(85, parseFloat(e.target.value) || 0)),
                  })
                }
                className="w-16 px-1.5 py-0.5 text-right font-mono text-xs bg-slate-900 border border-slate-700 rounded text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
              <span className="text-slate-400 text-[11px] font-mono">°</span>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={85}
            step={0.5}
            value={params.angleDeg}
            onChange={(e) =>
              onChangeParams({
                ...params,
                angleDeg: parseFloat(e.target.value),
              })
            }
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          {/* Quick Angle Buttons */}
          <div className="flex items-center gap-1.5 pt-0.5">
            {[0, 15, 30, 45, 60, 75].map((ang) => (
              <button
                key={ang}
                onClick={() => onChangeParams({ ...params, angleDeg: ang })}
                className={`flex-1 py-0.5 text-[10px] font-mono rounded transition-colors ${
                  params.angleDeg === ang
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {ang}°
              </button>
            ))}
          </div>
        </div>

        {/* Mass m */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="param-mass" className="text-slate-300 font-medium">
              Block Mass <span className="text-slate-400 font-mono">(m)</span>
            </label>
            <div className="flex items-center gap-1">
              <input
                id="param-mass"
                type="number"
                min={0.5}
                max={50}
                step={0.5}
                value={params.mass}
                onChange={(e) =>
                  onChangeParams({
                    ...params,
                    mass: Math.max(0.1, parseFloat(e.target.value) || 0.1),
                  })
                }
                className="w-16 px-1.5 py-0.5 text-right font-mono text-xs bg-slate-900 border border-slate-700 rounded text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
              <span className="text-slate-400 text-[11px] font-mono">kg</span>
            </div>
          </div>
          <input
            type="range"
            min={0.5}
            max={50}
            step={0.5}
            value={params.mass}
            onChange={(e) =>
              onChangeParams({
                ...params,
                mass: parseFloat(e.target.value),
              })
            }
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Applied Force F_app (Shown in force-lab and friction-lab) */}
        {mode !== 'basic' && (
          <div className="space-y-1.5 p-2.5 bg-slate-900/40 border border-slate-800/80 rounded-md">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="param-fapp" className="text-slate-300 font-medium flex items-center gap-1.5">
                <span>Applied Force</span>
                <span className="text-blue-400 font-mono">(F_app)</span>
              </label>
              <div className="flex items-center gap-1">
                <input
                  id="param-fapp"
                  type="number"
                  min={0}
                  max={200}
                  step={1}
                  value={params.appliedForceMag}
                  onChange={(e) =>
                    onChangeParams({
                      ...params,
                      appliedForceMag: Math.max(0, parseFloat(e.target.value) || 0),
                    })
                  }
                  className="w-16 px-1.5 py-0.5 text-right font-mono text-xs bg-slate-900 border border-slate-700 rounded text-blue-300 focus:outline-none focus:border-blue-500"
                />
                <span className="text-slate-400 text-[11px] font-mono">N</span>
              </div>
            </div>

            <input
              type="range"
              min={0}
              max={150}
              step={1}
              value={params.appliedForceMag}
              onChange={(e) =>
                onChangeParams({
                  ...params,
                  appliedForceMag: parseFloat(e.target.value),
                })
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
            />

            {/* Direction toggle */}
            <div className="flex items-center gap-2 pt-1 text-xs">
              <span className="text-slate-400 text-[11px]">Direction:</span>
              <div className="flex-1 flex gap-1">
                <button
                  onClick={() =>
                    onChangeParams({
                      ...params,
                      appliedForceDirection: 'up',
                    })
                  }
                  className={`flex-1 flex items-center justify-center gap-1 py-1 rounded text-[11px] font-mono transition-colors ${
                    params.appliedForceDirection === 'up'
                      ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  <ArrowUp className="w-3 h-3 text-blue-400" />
                  <span>Up Slope (+s)</span>
                </button>
                <button
                  onClick={() =>
                    onChangeParams({
                      ...params,
                      appliedForceDirection: 'down',
                    })
                  }
                  className={`flex-1 flex items-center justify-center gap-1 py-1 rounded text-[11px] font-mono transition-colors ${
                    params.appliedForceDirection === 'down'
                      ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  <ArrowDown className="w-3 h-3 text-blue-400" />
                  <span>Down Slope (-s)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Friction Controls (Active in friction-lab or optional in force-lab) */}
        {mode === 'friction-lab' && (
          <div className="space-y-2.5 p-2.5 bg-rose-950/10 border border-rose-900/30 rounded-md">
            <div className="flex items-center justify-between text-xs">
              <span className="text-rose-300 font-semibold uppercase text-[11px] tracking-wider">
                Surface Friction
              </span>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={params.frictionEnabled}
                  onChange={(e) =>
                    onChangeParams({
                      ...params,
                      frictionEnabled: e.target.checked,
                    })
                  }
                  className="rounded bg-slate-900 border-slate-700 text-rose-500 focus:ring-0"
                />
                <span className="text-[11px] text-slate-300">Enabled</span>
              </label>
            </div>

            {params.frictionEnabled && (
              <>
                {/* Static Friction μs */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">
                      Static Coeff <span className="text-rose-400 font-mono">(μs)</span>
                    </span>
                    <input
                      type="number"
                      min={0.05}
                      max={1.2}
                      step={0.05}
                      value={params.staticFrictionCoeff}
                      onChange={(e) => {
                        const val = Math.max(0.01, parseFloat(e.target.value) || 0.01);
                        onChangeParams({
                          ...params,
                          staticFrictionCoeff: val,
                          kineticFrictionCoeff: Math.min(val, params.kineticFrictionCoeff),
                        });
                      }}
                      className="w-16 px-1.5 py-0.5 text-right font-mono text-xs bg-slate-900 border border-slate-700 rounded text-rose-300 focus:outline-none"
                    />
                  </div>
                  <input
                    type="range"
                    min={0.05}
                    max={1.2}
                    step={0.05}
                    value={params.staticFrictionCoeff}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      onChangeParams({
                        ...params,
                        staticFrictionCoeff: val,
                        kineticFrictionCoeff: Math.min(val, params.kineticFrictionCoeff),
                      });
                    }}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
                  />
                </div>

                {/* Kinetic Friction μk */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">
                      Kinetic Coeff <span className="text-rose-400 font-mono">(μk)</span>
                    </span>
                    <input
                      type="number"
                      min={0.02}
                      max={params.staticFrictionCoeff}
                      step={0.05}
                      value={params.kineticFrictionCoeff}
                      onChange={(e) =>
                        onChangeParams({
                          ...params,
                          kineticFrictionCoeff: Math.min(
                            params.staticFrictionCoeff,
                            Math.max(0.01, parseFloat(e.target.value) || 0.01)
                          ),
                        })
                      }
                      className="w-16 px-1.5 py-0.5 text-right font-mono text-xs bg-slate-900 border border-slate-700 rounded text-rose-300 focus:outline-none"
                    />
                  </div>
                  <input
                    type="range"
                    min={0.02}
                    max={params.staticFrictionCoeff}
                    step={0.05}
                    value={params.kineticFrictionCoeff}
                    onChange={(e) =>
                      onChangeParams({
                        ...params,
                        kineticFrictionCoeff: parseFloat(e.target.value),
                      })
                    }
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
                  />
                </div>

                {/* Angle of Repose badge */}
                {angleOfReposeDeg && (
                  <div className="p-1.5 bg-rose-950/30 border border-rose-900/40 rounded text-[10px] font-mono text-rose-200">
                    <span className="text-rose-400 font-bold">Angle of Repose: </span>
                    <span>θc = arctan(μs) = {angleOfReposeDeg}°</span>
                    <div className="text-slate-400 mt-0.5 text-[9.5px]">
                      {params.angleDeg < parseFloat(angleOfReposeDeg)
                        ? 'θ < θc: Static hold prevents sliding'
                        : 'θ > θc: Exceeds threshold! Block will slip'}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Initial Position s0 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="param-s0" className="text-slate-300 font-medium">
              Initial Position <span className="text-slate-400 font-mono">(s₀)</span>
            </label>
            <div className="flex items-center gap-1">
              <input
                id="param-s0"
                type="number"
                min={0}
                max={params.rampLength}
                step={1}
                value={params.initialPosition}
                onChange={(e) =>
                  onChangeParams({
                    ...params,
                    initialPosition: Math.max(
                      0,
                      Math.min(params.rampLength, parseFloat(e.target.value) || 0)
                    ),
                  })
                }
                className="w-16 px-1.5 py-0.5 text-right font-mono text-xs bg-slate-900 border border-slate-700 rounded text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
              <span className="text-slate-400 text-[11px] font-mono">m</span>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={params.rampLength}
            step={0.5}
            value={params.initialPosition}
            onChange={(e) =>
              onChangeParams({
                ...params,
                initialPosition: parseFloat(e.target.value),
              })
            }
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onChangeParams({ ...params, initialPosition: 0 })}
              className="flex-1 py-0.5 text-[10px] font-mono bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-800"
            >
              Bottom (0m)
            </button>
            <button
              onClick={() =>
                onChangeParams({
                  ...params,
                  initialPosition: params.rampLength / 2,
                })
              }
              className="flex-1 py-0.5 text-[10px] font-mono bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-800"
            >
              Middle ({params.rampLength / 2}m)
            </button>
            <button
              onClick={() =>
                onChangeParams({
                  ...params,
                  initialPosition: params.rampLength,
                })
              }
              className="flex-1 py-0.5 text-[10px] font-mono bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-800"
            >
              Top ({params.rampLength}m)
            </button>
          </div>
        </div>

        {/* Initial Velocity v0 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="param-v0" className="text-slate-300 font-medium">
              Initial Velocity <span className="text-slate-400 font-mono">(v₀)</span>
            </label>
            <div className="flex items-center gap-1">
              <input
                id="param-v0"
                type="number"
                min={-15}
                max={15}
                step={0.5}
                value={params.initialVelocity}
                onChange={(e) =>
                  onChangeParams({
                    ...params,
                    initialVelocity: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-16 px-1.5 py-0.5 text-right font-mono text-xs bg-slate-900 border border-slate-700 rounded text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
              <span className="text-slate-400 text-[11px] font-mono">m/s</span>
            </div>
          </div>
          <input
            type="range"
            min={-15}
            max={15}
            step={0.5}
            value={params.initialVelocity}
            onChange={(e) =>
              onChangeParams({
                ...params,
                initialVelocity: parseFloat(e.target.value),
              })
            }
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="text-[10px] text-slate-500 flex justify-between font-mono">
            <span>Down slope (-15 m/s)</span>
            <span>0</span>
            <span>Up slope (+15 m/s)</span>
          </div>
        </div>

        {/* Gravity Selector */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">
              Gravity <span className="text-slate-400 font-mono">(g)</span>
            </span>
            <span className="font-mono text-xs text-cyan-300">
              {params.gravity.toFixed(2)} m/s²
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {GRAVITY_PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => onChangeParams({ ...params, gravity: p.value })}
                className={`py-1 text-[10px] font-mono rounded transition-colors ${
                  Math.abs(params.gravity - p.value) < 0.05
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
                title={p.label}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Vector Display Toggles */}
        <div className="pt-2 border-t border-slate-800/60 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold uppercase text-[10px] tracking-wider">
              Free-Body Diagram Vectors
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={vectorOptions.showWeightVector}
                onChange={() => toggleVectorOpt('showWeightVector')}
                className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span className="text-cyan-400">Weight (W)</span>
            </label>

            <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={vectorOptions.showNormalForce}
                onChange={() => toggleVectorOpt('showNormalForce')}
                className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0"
              />
              <span className="text-amber-400">Normal (N)</span>
            </label>

            <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={vectorOptions.showGravityComponents}
                onChange={() => toggleVectorOpt('showGravityComponents')}
                className="rounded bg-slate-900 border-slate-700 text-sky-500 focus:ring-0"
              />
              <span className="text-sky-300">W∥ & W⊥</span>
            </label>

            <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={vectorOptions.showAppliedForce}
                onChange={() => toggleVectorOpt('showAppliedForce')}
                className="rounded bg-slate-900 border-slate-700 text-blue-500 focus:ring-0"
              />
              <span className="text-blue-400">Applied (F_app)</span>
            </label>

            <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={vectorOptions.showFrictionForce}
                onChange={() => toggleVectorOpt('showFrictionForce')}
                className="rounded bg-slate-900 border-slate-700 text-rose-500 focus:ring-0"
              />
              <span className="text-rose-400">Friction (f)</span>
            </label>

            <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={vectorOptions.showNetForce}
                onChange={() => toggleVectorOpt('showNetForce')}
                className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-0"
              />
              <span className="text-emerald-400">Net Force (ΣF)</span>
            </label>

            <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={vectorOptions.showVelocityVector}
                onChange={() => toggleVectorOpt('showVelocityVector')}
                className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-0"
              />
              <span className="text-emerald-300">Velocity (v)</span>
            </label>

            <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={vectorOptions.showAccelerationVector}
                onChange={() => toggleVectorOpt('showAccelerationVector')}
                className="rounded bg-slate-900 border-slate-700 text-purple-500 focus:ring-0"
              />
              <span className="text-purple-400">Acceleration (a)</span>
            </label>

            <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={vectorOptions.showForceValues}
                onChange={() => toggleVectorOpt('showForceValues')}
                className="rounded bg-slate-900 border-slate-700 text-slate-400 focus:ring-0"
              />
              <span className="text-slate-300">Force Values</span>
            </label>

            <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={vectorOptions.showMotionTrail}
                onChange={() => toggleVectorOpt('showMotionTrail')}
                className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span className="text-cyan-300">Motion Trail</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
