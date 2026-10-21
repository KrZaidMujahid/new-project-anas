/**
 * EQUATION 1 — Simple Harmonic Motion Phase Relationships Visualizer
 * Rotating Phasor Circle, projection of circular motion into SHM,
 * and visual proof of 90° and 180° phase shifts between x(t), v(t), and a(t).
 */

import React from 'react';
import { SHMParameters, SHMDerivedValues, SHMState } from '../../physics/shm/types';
import { Compass, RotateCw, CheckCircle2, ArrowRight } from 'lucide-react';

interface SHMPhaseVisualizerProps {
  params: SHMParameters;
  derived: SHMDerivedValues;
  state: SHMState;
}

export const SHMPhaseVisualizer: React.FC<SHMPhaseVisualizerProps> = ({
  params,
  derived,
  state,
}) => {
  // Current phase in radians
  const currentPhase = state.phaseRad;
  const phaseDeg = ((currentPhase * 180) / Math.PI) % 360;

  // Phasor circle parameters
  const svgSize = 260;
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const radius = 90;

  // Phasor positions on unit circle
  // Standard SHM: x = A cos(θ), so angle is measured from +X axis counterclockwise
  const cosTheta = Math.cos(currentPhase);
  const sinTheta = Math.sin(currentPhase);

  // Position phasor tip: (cos, -sin in SVG coordinates)
  const tipX = cx + radius * cosTheta;
  const tipY = cy - radius * sinTheta;

  // Velocity phasor leads displacement by 90° (π/2):
  // v_phase = currentPhase + π/2
  const vAngle = currentPhase + Math.PI / 2;
  const vTipX = cx + (radius * 0.75) * Math.cos(vAngle);
  const vTipY = cy - (radius * 0.75) * Math.sin(vAngle);

  // Acceleration phasor leads displacement by 180° (π): opposite direction
  const aAngle = currentPhase + Math.PI;
  const aTipX = cx + (radius * 0.75) * Math.cos(aAngle);
  const aTipY = cy - (radius * 0.75) * Math.sin(aAngle);

  // Determine current quadrant / milestone
  const isNearMaxPos = Math.abs(state.displacement - derived.effectiveAmplitude) < 0.02 * (derived.effectiveAmplitude || 1);
  const isNearMaxNeg = Math.abs(state.displacement + derived.effectiveAmplitude) < 0.02 * (derived.effectiveAmplitude || 1);
  const isNearEquilibrium = Math.abs(state.displacement) < 0.04 * (derived.effectiveAmplitude || 1);

  return (
    <div className="bg-[#090d16] border border-slate-800/90 rounded-xl p-4 sm:p-5 select-none space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <RotateCw className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold text-white tracking-wider uppercase font-mono">
            Phase Relationships & Phasor Diagram
          </h2>
        </div>
        <span className="text-[11px] font-mono text-cyan-300">
          Total Phase: {phaseDeg.toFixed(1)}°
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left: Rotating Phasor Circle SVG */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-2 bg-[#07090e] rounded-lg border border-slate-800">
          <svg viewBox={`0 0 ${svgSize} ${svgSize}`} className="w-56 h-56 font-mono text-[9px]">
            {/* Outer Reference Circle */}
            <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#1e293b" strokeWidth="1.5" />
            <circle cx={cx} cy={cy} r={radius * 0.75} fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />

            {/* Axes */}
            <line x1={cx - radius - 20} y1={cy} x2={cx + radius + 20} y2={cy} stroke="#334155" strokeWidth="1" strokeDasharray="2,2" />
            <line x1={cx} y1={cy - radius - 20} x2={cx} y2={cy + radius + 20} stroke="#334155" strokeWidth="1" strokeDasharray="2,2" />

            {/* Phase Angle Arc */}
            <path
              d={`M ${cx + 25} ${cy} A 25 25 0 ${phaseDeg > 180 ? 1 : 0} 0 ${cx + 25 * Math.cos(currentPhase)} ${cy - 25 * Math.sin(currentPhase)}`}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.5"
            />
            <text x={cx + 10} y={cy - 10} fill="#38bdf8">
              {phaseDeg.toFixed(0)}°
            </text>

            {/* Center Origin Dot */}
            <circle cx={cx} cy={cy} r="3" fill="#64748b" />

            {/* Projection Line to X Axis (SHM Displacement) */}
            <line x1={tipX} y1={tipY} x2={tipX} y2={cy} stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,3" />
            <circle cx={tipX} cy={cy} r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />

            {/* Acceleration Phasor (Opposite to displacement, leads by 180°) */}
            <line x1={cx} y1={cy} x2={aTipX} y2={aTipY} stroke="#f59e0b" strokeWidth="2" strokeDasharray="2,2" />
            <circle cx={aTipX} cy={aTipY} r="3.5" fill="#f59e0b" />
            <text x={aTipX + (aAngle > Math.PI ? -12 : 6)} y={aTipY} fill="#f59e0b" fontWeight="bold">
              a⃗
            </text>

            {/* Velocity Phasor (Leads by 90°) */}
            <line x1={cx} y1={cy} x2={vTipX} y2={vTipY} stroke="#10b981" strokeWidth="2" strokeDasharray="3,2" />
            <circle cx={vTipX} cy={vTipY} r="3.5" fill="#10b981" />
            <text x={vTipX + (vAngle > Math.PI ? -12 : 6)} y={vTipY} fill="#10b981" fontWeight="bold">
              v⃗
            </text>

            {/* Displacement Phasor Vector (A) */}
            <line x1={cx} y1={cy} x2={tipX} y2={tipY} stroke="#38bdf8" strokeWidth="2.5" />
            <circle cx={tipX} cy={tipY} r="4.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
            <text x={tipX + (tipX >= cx ? 6 : -14)} y={tipY - 4} fill="#38bdf8" fontWeight="bold">
              x⃗ (A)
            </text>

            {/* Labels */}
            <text x={cx + radius + 15} y={cy + 12} fill="#64748b" textAnchor="end">+A</text>
            <text x={cx - radius - 15} y={cy + 12} fill="#64748b" textAnchor="start">-A</text>
            <text x={cx} y={cy + radius + 22} fill="#94a3b8" textAnchor="middle">
              Projection on X axis = x(t)
            </text>
          </svg>
          <span className="text-[10px] text-slate-500 mt-1 font-mono">
            SHM is the 1D projection of Uniform Circular Motion
          </span>
        </div>

        {/* Right: Key Educational Phase Principles */}
        <div className="md:col-span-7 space-y-3 text-xs">
          {/* Phase Shift Rules */}
          <div className="space-y-2">
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-[#07090e] border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <div>
                <span className="font-semibold text-slate-200">Velocity leads Displacement by 90° (π/2 rad)</span>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  When displacement is at its peak (<strong className="text-white">x = ±A</strong>), velocity passes through <strong className="text-white">v = 0</strong>. When passing equilibrium (<strong className="text-white">x = 0</strong>), speed reaches its maximum (<strong className="text-emerald-400">|v| = v_max = Aω</strong>).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-[#07090e] border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <div>
                <span className="font-semibold text-slate-200">Acceleration leads Displacement by 180° (π rad)</span>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Acceleration is in direct anti-phase with displacement: <strong className="text-amber-400">a = -ω²x</strong>. When <strong className="text-white">x &gt; 0</strong>, <strong className="text-amber-400">a &lt; 0</strong>. At equilibrium (<strong className="text-white">x = 0</strong>), acceleration is exactly zero.
                </p>
              </div>
            </div>
          </div>

          {/* Current Operating Milestone Badge */}
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono space-y-1">
            <span className="text-slate-500 text-[10px] uppercase tracking-wider block">
              Current Instantaneous State Milestone:
            </span>
            <div className="flex items-center gap-2">
              {isNearMaxPos && (
                <span className="text-cyan-300 font-bold">
                  At Maximum Positive Amplitude (+A) · v = 0 · |a| = a_max · Potential Energy = Max
                </span>
              )}
              {isNearMaxNeg && (
                <span className="text-cyan-300 font-bold">
                  At Maximum Negative Amplitude (-A) · v = 0 · |a| = a_max · Potential Energy = Max
                </span>
              )}
              {isNearEquilibrium && (
                <span className="text-emerald-300 font-bold">
                  Passing Equilibrium (x = 0) · Speed |v| = v_max · a = 0 · Kinetic Energy = Max
                </span>
              )}
              {!isNearMaxPos && !isNearMaxNeg && !isNearEquilibrium && (
                <span className="text-slate-300">
                  Continuous Energy Exchange: K = {state.kineticEnergy.toFixed(3)}J ⇄ U = {state.potentialEnergy.toFixed(3)}J
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
