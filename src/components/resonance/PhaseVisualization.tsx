/**
 * EQUATION 1 — Resonance Phase Relationship Visualizer (Section 9)
 * Calculates and plots phase lag φ = atan2(c ω, k - m ω²)
 * Displays two animated sinusoidal curves: Driving Force F(t) and Steady-State Displacement x(t),
 * explaining the transition from 0° (low frequency) to 90° (resonance) to 180° (high frequency).
 */

import React, { useMemo } from 'react';
import { ResonanceParameters, OscillatorDerivedValues } from '../../physics/resonance/types';
import { Compass, Sparkles, Layers, ArrowRight } from 'lucide-react';
import { MathView } from '../MathView';

interface PhaseVisualizationProps {
  params: ResonanceParameters;
  derived: OscillatorDerivedValues;
  currentTime: number;
}

export const PhaseVisualization: React.FC<PhaseVisualizationProps> = ({
  params,
  derived,
  currentTime,
}) => {
  const phiRad = derived.steadyStatePhaseLagRad;
  const phiDeg = derived.steadyStatePhaseLagDeg;

  // Generate 2 periods of animated sinusoidal curves for comparison
  const sampleCount = 140;
  const Td = derived.drivingPeriod || 1.0;
  const timeSpan = 2 * Td;

  const points = useMemo(() => {
    const list: { t: number; normForce: number; normDisp: number }[] = [];
    const omegaD = derived.drivingAngularFreq;

    for (let i = 0; i < sampleCount; i++) {
      const t = (i / (sampleCount - 1)) * timeSpan;
      // Driving force sinusoidal phase: sin(ω_d t + ω_d currentTime)
      const forceVal = Math.sin(omegaD * (t + currentTime));
      // Steady state displacement phase: sin(ω_d t + ω_d currentTime - φ)
      const dispVal = Math.sin(omegaD * (t + currentTime) - phiRad);

      list.push({ t, normForce: forceVal, normDisp: dispVal });
    }
    return list;
  }, [derived.drivingAngularFreq, derived.drivingPeriod, currentTime, phiRad]);

  const width = 800;
  const height = 200;
  const padding = { top: 25, right: 30, bottom: 35, left: 55 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;
  const centerY = padding.top + plotH / 2;

  const scaleX = (t: number) => padding.left + (t / timeSpan) * plotW;
  const scaleY = (v: number) => centerY - v * (plotH / 2) * 0.85;

  const forcePath = points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${scaleX(p.t).toFixed(1)} ${scaleY(p.normForce).toFixed(1)}`)
    .join(' ');

  const dispPath = points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${scaleX(p.t).toFixed(1)} ${scaleY(p.normDisp).toFixed(1)}`)
    .join(' ');

  // Milestone phase assessment
  let phaseDescription = '';
  if (phiDeg < 30) {
    phaseDescription = 'Low Frequency (f_d ≪ f₀): Displacement oscillates nearly in-phase with driving force (φ ≈ 0°).';
  } else if (phiDeg >= 75 && phiDeg <= 105) {
    phaseDescription = 'Resonance (f_d ≈ f₀): Displacement lags the driving force by exactly 90° (π/2 rad). Velocity is in-phase with force, maximizing power injection!';
  } else if (phiDeg > 150) {
    phaseDescription = 'High Frequency (f_d ≫ f₀): System inertia dominates. Displacement is completely out-of-phase, lagging by ~180° (π rad).';
  } else {
    phaseDescription = `Intermediate Detuning: Continuous phase transition with lag φ = ${phiDeg.toFixed(1)}°.`;
  }

  return (
    <div className="bg-[#101D30] border border-slate-800 rounded-xl p-4 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Phase Difference Between Driving Force and Displacement
            </h3>
            <p className="text-[11px] text-slate-400">
              Analytical phase lag <MathView math="\phi = \text{atan2}(c\omega, k - m\omega^2)" />
            </p>
          </div>
        </div>

        {/* Phase Pill */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-[#07111F] border border-purple-500/40 text-xs font-mono text-purple-300 font-bold">
            Phase Lag φ = {phiDeg.toFixed(1)}° ({(phiRad / Math.PI).toFixed(2)}π rad)
          </div>
        </div>
      </div>

      {/* SVG Sinusoidal Curves */}
      <div className="relative w-full overflow-hidden rounded-lg bg-[#07111F] border border-slate-800/80 p-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none overflow-visible">
          {/* Baseline */}
          <line
            x1={padding.left}
            y1={centerY}
            x2={width - padding.right}
            y2={centerY}
            stroke="#334155"
            strokeWidth="1.2"
            strokeDasharray="4 3"
          />

          {/* Driving Force Curve (Amber dashed) */}
          <path d={forcePath} fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeDasharray="4 3" />

          {/* Steady-state Displacement Curve (Cyan solid) */}
          <path d={dispPath} fill="none" stroke="#38bdf8" strokeWidth="2.6" />

          {/* Axis Labels */}
          <text x={width / 2} y={height - 8} fill="#94a3b8" fontSize="10" textAnchor="middle">
            Time span showing 2 oscillation cycles (2 T_d)
          </text>
        </svg>
      </div>

      {/* Legend & Phase Milestones */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 pt-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-b border-amber-400 border-dashed" />
            <span className="text-amber-300 font-medium">Driving Force F(t)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#38bdf8] rounded" />
            <span className="text-cyan-300 font-medium">Displacement x(t)</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-300 italic font-mono">
          {phaseDescription}
        </p>
      </div>
    </div>
  );
};
