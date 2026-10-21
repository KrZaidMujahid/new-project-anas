/**
 * EQUATION 1 — Compare Two Oscillating Systems Component (Mode 6)
 * Dual mass-spring simulator allowing side-by-side comparison of System 1 vs System 2
 * with overlaid resonance frequency response curves and live metrics.
 */

import React, { useState, useMemo } from 'react';
import { ResonanceParameters } from '../../physics/resonance/types';
import { computeOscillatorDerivedValues, generateResonanceCurve } from '../../physics/resonance/model';
import { Layers, Sliders, Activity, Sparkles } from 'lucide-react';

interface CompareTwoSystemsProps {
  baseParams: ResonanceParameters;
  drivingFrequencyHz: number;
}

export const CompareTwoSystems: React.FC<CompareTwoSystemsProps> = ({
  baseParams,
  drivingFrequencyHz,
}) => {
  const [sys1, setSys1] = useState<ResonanceParameters>({
    ...baseParams,
    mass: 1.0,
    springConstant: 50,
    dampingCoefficient: 0.3,
    drivingFrequencyHz,
  });

  const [sys2, setSys2] = useState<ResonanceParameters>({
    ...baseParams,
    mass: 1.5,
    springConstant: 30,
    dampingCoefficient: 0.8,
    drivingFrequencyHz,
  });

  // Keep driving frequency in sync
  const derived1 = useMemo(() => {
    return computeOscillatorDerivedValues({ ...sys1, drivingFrequencyHz });
  }, [sys1, drivingFrequencyHz]);

  const derived2 = useMemo(() => {
    return computeOscillatorDerivedValues({ ...sys2, drivingFrequencyHz });
  }, [sys2, drivingFrequencyHz]);

  // Generate curves for both
  const minFreq = 0.1;
  const maxFreq = 5.0;
  const curve1 = useMemo(() => generateResonanceCurve({ ...sys1, drivingFrequencyHz }, minFreq, maxFreq, 120), [sys1, drivingFrequencyHz]);
  const curve2 = useMemo(() => generateResonanceCurve({ ...sys2, drivingFrequencyHz }, minFreq, maxFreq, 120), [sys2, drivingFrequencyHz]);

  // SVG dimensions
  const width = 800;
  const height = 240;
  const padding = { top: 25, right: 30, bottom: 35, left: 55 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  const maxAmp = Math.max(0.5, derived1.maxTheoreticalAmplitude || 1, derived2.maxTheoreticalAmplitude || 1) * 1.25;

  const scaleX = (f: number) => padding.left + ((f - minFreq) / (maxFreq - minFreq)) * plotW;
  const scaleY = (a: number) => padding.top + plotH - (Math.min(maxAmp, a) / maxAmp) * plotH;

  const createPath = (curve: typeof curve1) => {
    return curve
      .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${scaleX(p.frequencyHz).toFixed(1)} ${scaleY(p.amplitude).toFixed(1)}`)
      .join(' ');
  };

  return (
    <div className="bg-[#101D30] border border-cyan-500/30 rounded-xl p-4 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              Dual System Comparison Mode
              <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30">
                Mode 6
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Compare frequency response curves and quality factors of two distinct oscillators
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-amber-300 font-bold">
          Shared Driver: f_d = {drivingFrequencyHz.toFixed(2)} Hz
        </span>
      </div>

      {/* Comparative Parameters Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* System 1 (Cyan) */}
        <div className="p-3 rounded-lg bg-[#07111F] border border-cyan-500/40 space-y-2.5">
          <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-800">
            <span className="font-bold text-cyan-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" /> System 1 (Low Inertia)
            </span>
            <span className="font-mono text-cyan-400 font-bold">
              f₀ = {derived1.naturalFrequencyHz.toFixed(2)} Hz
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <label className="text-[10px] text-slate-400 block">Mass (m₁)</label>
              <input
                type="number"
                min="0.2"
                max="4.0"
                step="0.1"
                value={sys1.mass}
                onChange={(e) => setSys1({ ...sys1, mass: parseFloat(e.target.value) || 0.2 })}
                className="w-full px-1.5 py-0.5 font-mono text-xs bg-[#101D30] border border-slate-700 rounded text-cyan-300"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block">Spring (k₁)</label>
              <input
                type="number"
                min="10"
                max="150"
                step="5"
                value={sys1.springConstant}
                onChange={(e) => setSys1({ ...sys1, springConstant: parseFloat(e.target.value) || 10 })}
                className="w-full px-1.5 py-0.5 font-mono text-xs bg-[#101D30] border border-slate-700 rounded text-cyan-300"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block">Damping (c₁)</label>
              <input
                type="number"
                min="0.05"
                max="3.0"
                step="0.05"
                value={sys1.dampingCoefficient}
                onChange={(e) => setSys1({ ...sys1, dampingCoefficient: parseFloat(e.target.value) || 0.05 })}
                className="w-full px-1.5 py-0.5 font-mono text-xs bg-[#101D30] border border-slate-700 rounded text-cyan-300"
              />
            </div>
          </div>

          <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-1">
            <span>Q₁ = {derived1.qualityFactor ? derived1.qualityFactor.toFixed(1) : '∞'}</span>
            <span className="text-cyan-300 font-bold">A₁ = {derived1.steadyStateAmplitude.toFixed(3)} m</span>
          </div>
        </div>

        {/* System 2 (Purple) */}
        <div className="p-3 rounded-lg bg-[#07111F] border border-purple-500/40 space-y-2.5">
          <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-800">
            <span className="font-bold text-purple-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400" /> System 2 (High Inertia / Damped)
            </span>
            <span className="font-mono text-purple-400 font-bold">
              f₀ = {derived2.naturalFrequencyHz.toFixed(2)} Hz
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <label className="text-[10px] text-slate-400 block">Mass (m₂)</label>
              <input
                type="number"
                min="0.2"
                max="4.0"
                step="0.1"
                value={sys2.mass}
                onChange={(e) => setSys2({ ...sys2, mass: parseFloat(e.target.value) || 0.2 })}
                className="w-full px-1.5 py-0.5 font-mono text-xs bg-[#101D30] border border-slate-700 rounded text-purple-300"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block">Spring (k₂)</label>
              <input
                type="number"
                min="10"
                max="150"
                step="5"
                value={sys2.springConstant}
                onChange={(e) => setSys2({ ...sys2, springConstant: parseFloat(e.target.value) || 10 })}
                className="w-full px-1.5 py-0.5 font-mono text-xs bg-[#101D30] border border-slate-700 rounded text-purple-300"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block">Damping (c₂)</label>
              <input
                type="number"
                min="0.05"
                max="3.0"
                step="0.05"
                value={sys2.dampingCoefficient}
                onChange={(e) => setSys2({ ...sys2, dampingCoefficient: parseFloat(e.target.value) || 0.05 })}
                className="w-full px-1.5 py-0.5 font-mono text-xs bg-[#101D30] border border-slate-700 rounded text-purple-300"
              />
            </div>
          </div>

          <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-1">
            <span>Q₂ = {derived2.qualityFactor ? derived2.qualityFactor.toFixed(1) : '∞'}</span>
            <span className="text-purple-300 font-bold">A₂ = {derived2.steadyStateAmplitude.toFixed(3)} m</span>
          </div>
        </div>
      </div>

      {/* Overlaid Resonance Frequency Response Curve */}
      <div className="relative w-full overflow-hidden rounded-lg bg-[#07111F] border border-slate-800 p-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none overflow-visible">
          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1.0].map((frac) => {
            const sy = scaleY(frac * maxAmp);
            return (
              <line
                key={frac}
                x1={padding.left}
                y1={sy}
                x2={width - padding.right}
                y2={sy}
                stroke="#1e293b"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            );
          })}

          {/* Current Driver Vertical Cursor */}
          <line
            x1={scaleX(drivingFrequencyHz)}
            y1={padding.top}
            x2={scaleX(drivingFrequencyHz)}
            y2={height - padding.bottom}
            stroke="#f59e0b"
            strokeWidth="1.8"
            strokeDasharray="4 3"
          />

          {/* System 1 Curve (Cyan) */}
          <path d={createPath(curve1)} fill="none" stroke="#38bdf8" strokeWidth="2.5" />
          <circle cx={scaleX(drivingFrequencyHz)} cy={scaleY(derived1.steadyStateAmplitude)} r="5" fill="#38bdf8" />

          {/* System 2 Curve (Purple) */}
          <path d={createPath(curve2)} fill="none" stroke="#a78bfa" strokeWidth="2.5" />
          <circle cx={scaleX(drivingFrequencyHz)} cy={scaleY(derived2.steadyStateAmplitude)} r="5" fill="#a78bfa" />

          {/* Axis Labels */}
          <text x={width / 2} y={height - 10} fill="#94a3b8" fontSize="10" textAnchor="middle">
            Driving Frequency (Hz) — Overlaid Response Curves
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-[#38bdf8] rounded" />
          <span className="text-cyan-300">System 1 Curve (Peak = {derived1.naturalFrequencyHz.toFixed(2)} Hz)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-[#a78bfa] rounded" />
          <span className="text-purple-300">System 2 Curve (Peak = {derived2.naturalFrequencyHz.toFixed(2)} Hz)</span>
        </div>
      </div>
    </div>
  );
};
