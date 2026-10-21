/**
 * EQUATION 1 — Free Fall Parameters Panel
 * Sliders and numeric inputs for initial height, initial velocity, gravity, and vector layers.
 */

import React from 'react';
import {
  FREE_FALL_GRAVITY_PRESETS,
} from '../../physics/freeFall/model';
import {
  FreeFallParameters as FreeFallParamsType,
  FreeFallVectorOptions,
} from '../../physics/freeFall/types';
import { Sliders, Eye, Sparkles, RotateCcw } from 'lucide-react';

interface FreeFallParametersProps {
  parameters: FreeFallParamsType;
  onChangeParameters: (newParams: FreeFallParamsType) => void;
  vectorOptions: FreeFallVectorOptions;
  onChangeVectorOptions: (newOpts: FreeFallVectorOptions) => void;
  onOpenPresets: () => void;
  onResetParameters: () => void;
}

export const FreeFallParameters: React.FC<FreeFallParametersProps> = ({
  parameters,
  onChangeParameters,
  vectorOptions,
  onChangeVectorOptions,
  onOpenPresets,
  onResetParameters,
}) => {
  const updateParam = (key: keyof FreeFallParamsType, rawValue: number) => {
    let val = isNaN(rawValue) ? 0 : rawValue;
    if (key === 'initialHeight') val = Math.max(0, Math.min(500, val));
    if (key === 'initialVelocity') val = Math.max(-100, Math.min(100, val));
    if (key === 'gravity') val = Math.max(0, Math.min(100, val));

    onChangeParameters({
      ...parameters,
      [key]: val,
    });
  };

  const toggleVectorOpt = (key: keyof FreeFallVectorOptions) => {
    onChangeVectorOptions({
      ...vectorOptions,
      [key]: !vectorOptions[key],
    });
  };

  // Determine velocity state label
  const getVelocityStateLabel = () => {
    if (parameters.initialVelocity === 0) {
      return { text: 'Released from rest (v₀ = 0)', color: 'text-slate-400' };
    } else if (parameters.initialVelocity > 0) {
      return { text: 'Upward toss (+v₀)', color: 'text-cyan-400 font-semibold' };
    } else {
      return { text: 'Downward throw (-v₀)', color: 'text-amber-400 font-semibold' };
    }
  };

  const velocityState = getVelocityStateLabel();

  return (
    <div className="bg-[#0b101b] border border-slate-800/90 rounded-lg p-4 select-none space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Parameters
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
            onClick={onResetParameters}
            className="text-[11px] font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Reset to default benchmark (20m, 0m/s, 9.8m/s²)"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Control 1: Initial Height */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <label htmlFor="ff-param-height" className="text-slate-300 font-medium">
            Initial Height <span className="text-slate-400 font-mono">(y₀)</span>
          </label>
          <div className="flex items-center gap-1">
            <input
              id="ff-param-height"
              type="number"
              min={0}
              max={250}
              step={1}
              value={parameters.initialHeight}
              onChange={(e) => updateParam('initialHeight', parseFloat(e.target.value))}
              className="w-16 px-2 py-0.5 bg-[#07090e] border border-slate-700 rounded text-right font-mono text-xs text-white focus:outline-none focus:border-cyan-400 tabular-nums"
            />
            <span className="text-[11px] font-mono text-slate-400 w-6">m</span>
          </div>
        </div>
        <input
          type="range"
          min={1}
          max={100}
          step={1}
          value={parameters.initialHeight}
          onChange={(e) => updateParam('initialHeight', parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-400">
          <span>1 m</span>
          <span>20 m (Default)</span>
          <span>100 m</span>
        </div>
      </div>

      {/* Control 2: Initial Velocity */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <div>
            <label htmlFor="ff-param-velocity" className="text-slate-300 font-medium">
              Initial Velocity <span className="text-slate-400 font-mono">(v₀)</span>
            </label>
            <div className={`text-[10px] font-mono ${velocityState.color}`}>
              {velocityState.text}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <input
              id="ff-param-velocity"
              type="number"
              min={-50}
              max={50}
              step={1}
              value={parameters.initialVelocity}
              onChange={(e) => updateParam('initialVelocity', parseFloat(e.target.value))}
              className="w-16 px-2 py-0.5 bg-[#07090e] border border-slate-700 rounded text-right font-mono text-xs text-white focus:outline-none focus:border-cyan-400 tabular-nums"
            />
            <span className="text-[11px] font-mono text-slate-400 w-6">m/s</span>
          </div>
        </div>
        <input
          type="range"
          min={-40}
          max={40}
          step={1}
          value={parameters.initialVelocity}
          onChange={(e) => updateParam('initialVelocity', parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-400">
          <span>-40 m/s (Down)</span>
          <span>0 (Rest)</span>
          <span>+40 m/s (Up)</span>
        </div>
      </div>

      {/* Control 3: Gravity */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <label htmlFor="ff-param-gravity" className="text-slate-300 font-medium">
            Gravitational Accel. <span className="text-slate-400 font-mono">(g)</span>
          </label>
          <div className="flex items-center gap-1">
            <input
              id="ff-param-gravity"
              type="number"
              min={0}
              max={30}
              step={0.01}
              value={parameters.gravity}
              onChange={(e) => updateParam('gravity', parseFloat(e.target.value))}
              className="w-16 px-2 py-0.5 bg-[#07090e] border border-slate-700 rounded text-right font-mono text-xs text-white focus:outline-none focus:border-cyan-400 tabular-nums"
            />
            <span className="text-[11px] font-mono text-slate-400 w-8">m/s²</span>
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={25}
          step={0.1}
          value={parameters.gravity}
          onChange={(e) => updateParam('gravity', parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
        />

        {/* Planet Presets */}
        <div className="grid grid-cols-3 gap-1 pt-1">
          {FREE_FALL_GRAVITY_PRESETS.map((planet) => {
            const isSelected = Math.abs(parameters.gravity - planet.value) < 0.05;
            return (
              <button
                key={planet.name}
                onClick={() => updateParam('gravity', planet.value)}
                className={`py-1 px-1.5 text-[10px] font-mono rounded border transition-colors cursor-pointer text-center truncate ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold'
                    : 'bg-[#07090e] text-slate-400 hover:text-white border-slate-800'
                }`}
                title={`Set gravity to ${planet.name} (${planet.value} m/s²)`}
              >
                {planet.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Vector & Visual Overlays */}
      <div className="pt-2 border-t border-slate-800/60 space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>Visual & Vector Layers</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer">
            <input
              type="checkbox"
              checked={vectorOptions.showVelocityVector}
              onChange={() => toggleVectorOpt('showVelocityVector')}
              className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 accent-cyan-400"
            />
            <span>Velocity Vector <span className="text-cyan-400 font-mono">(v)</span></span>
          </label>

          <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer">
            <input
              type="checkbox"
              checked={vectorOptions.showAccelerationVector}
              onChange={() => toggleVectorOpt('showAccelerationVector')}
              className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0 accent-amber-400"
            />
            <span>Gravity Vector <span className="text-amber-400 font-mono">(-g)</span></span>
          </label>

          <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer">
            <input
              type="checkbox"
              checked={vectorOptions.showMotionTrail}
              onChange={() => toggleVectorOpt('showMotionTrail')}
              className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 accent-cyan-400"
            />
            <span>Motion Trail / Dots</span>
          </label>

          <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer">
            <input
              type="checkbox"
              checked={vectorOptions.showHeightRuler}
              onChange={() => toggleVectorOpt('showHeightRuler')}
              className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 accent-cyan-400"
            />
            <span>Laser Caliper</span>
          </label>

          <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer">
            <input
              type="checkbox"
              checked={vectorOptions.showApexMarker}
              onChange={() => toggleVectorOpt('showApexMarker')}
              className="rounded bg-slate-900 border-slate-700 text-purple-500 focus:ring-0 accent-purple-400"
            />
            <span>Apex Caliper</span>
          </label>

          <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer">
            <input
              type="checkbox"
              checked={vectorOptions.showCoordinateGrid}
              onChange={() => toggleVectorOpt('showCoordinateGrid')}
              className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 accent-cyan-400"
            />
            <span>Metric Ruler</span>
          </label>
        </div>
      </div>
    </div>
  );
};
