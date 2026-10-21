/**
 * EQUATION 1 — Simple Harmonic Motion Scientific Graph Laboratory
 * Interactive SVG Graphs with synchronized current-time marker, analytical curves,
 * Hooke's Law force-displacement line, and phase space orbit.
 */

import React, { useState, useMemo } from 'react';
import { SHMParameters, SHMDerivedValues, SHMSample, SHMState } from '../../physics/shm/types';
import { LineChart, Orbit, Activity, Zap, TrendingDown } from 'lucide-react';

export type SHMGraphTab =
  | 'displacement'
  | 'velocity'
  | 'acceleration'
  | 'kinematics-combined'
  | 'energies'
  | 'force-displacement'
  | 'phase-space';

interface SHMGraphsProps {
  params: SHMParameters;
  derived: SHMDerivedValues;
  state: SHMState;
  samples: SHMSample[];
  currentTime: number;
}

export const SHMGraphs: React.FC<SHMGraphsProps> = ({
  params,
  derived,
  state,
  samples,
  currentTime,
}) => {
  const [activeTab, setActiveTab] = useState<SHMGraphTab>('kinematics-combined');

  const duration = samples.length > 0 ? samples[samples.length - 1].time : 10;

  // SVG coordinate system
  const svgWidth = 840;
  const svgHeight = 280;
  const padding = { top: 25, right: 30, bottom: 40, left: 65 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  // Current time normalized X
  const currentX =
    duration > 0
      ? padding.left + (currentTime / duration) * plotWidth
      : padding.left;

  return (
    <div className="bg-[#090d16] border border-slate-800/90 rounded-xl p-4 sm:p-5 select-none space-y-4">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <LineChart className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold text-white tracking-wider uppercase font-mono">
            Graph Laboratory
          </h2>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center bg-[#07090e] p-1 rounded-lg border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('kinematics-combined')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'kinematics-combined'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            x, v, a Combined
          </button>
          <button
            onClick={() => setActiveTab('displacement')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'displacement'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            x(t)
          </button>
          <button
            onClick={() => setActiveTab('velocity')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'velocity'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            v(t)
          </button>
          <button
            onClick={() => setActiveTab('acceleration')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'acceleration'
                ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            a(t)
          </button>
          <button
            onClick={() => setActiveTab('energies')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'energies'
                ? 'bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Energies (K, U, E)
          </button>
          <button
            onClick={() => setActiveTab('force-displacement')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'force-displacement'
                ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            F vs x (Hooke)
          </button>
          <button
            onClick={() => setActiveTab('phase-space')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'phase-space'
                ? 'bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Phase Space (v vs x)
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="w-full bg-[#07090e] border border-slate-800/80 rounded-lg p-2 overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[580px] font-mono text-[10px]"
        >
          {/* Render based on selected Tab */}
          {activeTab === 'kinematics-combined' && (
            <KinematicsCombinedGraph
              samples={samples}
              derived={derived}
              state={state}
              currentTime={currentTime}
              duration={duration}
              padding={padding}
              plotWidth={plotWidth}
              plotHeight={plotHeight}
              currentX={currentX}
            />
          )}

          {activeTab === 'displacement' && (
            <SingleSeriesGraph
              samples={samples}
              getValue={(s) => s.displacement}
              currentVal={state.displacement}
              maxBound={Math.max(0.05, derived.effectiveAmplitude * 1.15)}
              yAxisLabel="Displacement x (m)"
              curveColor="#38bdf8"
              currentTime={currentTime}
              duration={duration}
              padding={padding}
              plotWidth={plotWidth}
              plotHeight={plotHeight}
              currentX={currentX}
              formula="x(t) = A cos(ωt + φ)"
            />
          )}

          {activeTab === 'velocity' && (
            <SingleSeriesGraph
              samples={samples}
              getValue={(s) => s.velocity}
              currentVal={state.velocity}
              maxBound={Math.max(0.1, derived.vMax * 1.15)}
              yAxisLabel="Velocity v (m/s)"
              curveColor="#10b981"
              currentTime={currentTime}
              duration={duration}
              padding={padding}
              plotWidth={plotWidth}
              plotHeight={plotHeight}
              currentX={currentX}
              formula="v(t) = -Aω sin(ωt + φ)"
            />
          )}

          {activeTab === 'acceleration' && (
            <SingleSeriesGraph
              samples={samples}
              getValue={(s) => s.acceleration}
              currentVal={state.acceleration}
              maxBound={Math.max(0.2, derived.aMax * 1.15)}
              yAxisLabel="Acceleration a (m/s²)"
              curveColor="#f59e0b"
              currentTime={currentTime}
              duration={duration}
              padding={padding}
              plotWidth={plotWidth}
              plotHeight={plotHeight}
              currentX={currentX}
              formula="a(t) = -Aω² cos(ωt + φ)"
            />
          )}

          {activeTab === 'energies' && (
            <EnergiesGraph
              samples={samples}
              derived={derived}
              state={state}
              currentTime={currentTime}
              duration={duration}
              padding={padding}
              plotWidth={plotWidth}
              plotHeight={plotHeight}
              currentX={currentX}
            />
          )}

          {activeTab === 'force-displacement' && (
            <ForceDisplacementGraph
              params={params}
              derived={derived}
              state={state}
              padding={padding}
              plotWidth={plotWidth}
              plotHeight={plotHeight}
            />
          )}

          {activeTab === 'phase-space' && (
            <PhaseSpaceGraph
              samples={samples}
              derived={derived}
              state={state}
              padding={padding}
              plotWidth={plotWidth}
              plotHeight={plotHeight}
            />
          )}
        </svg>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Sub-Graph 1: Normalized Combined x, v, a Graph (shows phase shifts!)
// -------------------------------------------------------------
interface KinematicsCombinedProps {
  samples: SHMSample[];
  derived: SHMDerivedValues;
  state: SHMState;
  currentTime: number;
  duration: number;
  padding: { top: number; right: number; bottom: number; left: number };
  plotWidth: number;
  plotHeight: number;
  currentX: number;
}

const KinematicsCombinedGraph: React.FC<KinematicsCombinedProps> = ({
  samples,
  derived,
  state,
  currentTime,
  duration,
  padding,
  plotWidth,
  plotHeight,
  currentX,
}) => {
  const midY = padding.top + plotHeight / 2;

  // Normalized scaling: each quantity normalized to [-1, 1] relative to peak
  const normX = (s: SHMSample) => (derived.effectiveAmplitude > 0 ? s.displacement / derived.effectiveAmplitude : 0);
  const normV = (s: SHMSample) => (derived.vMax > 0 ? s.velocity / derived.vMax : 0);
  const normA = (s: SHMSample) => (derived.aMax > 0 ? s.acceleration / derived.aMax : 0);

  const toY = (normVal: number) => midY - normVal * (plotHeight * 0.42);
  const toX = (t: number) => padding.left + (t / duration) * plotWidth;

  const pathX = samples.reduce((acc, s, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${toX(s.time).toFixed(1)},${toY(normX(s)).toFixed(1)}`, '');
  const pathV = samples.reduce((acc, s, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${toX(s.time).toFixed(1)},${toY(normV(s)).toFixed(1)}`, '');
  const pathA = samples.reduce((acc, s, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${toX(s.time).toFixed(1)},${toY(normA(s)).toFixed(1)}`, '');

  const curNormX = derived.effectiveAmplitude > 0 ? state.displacement / derived.effectiveAmplitude : 0;
  const curNormV = derived.vMax > 0 ? state.velocity / derived.vMax : 0;
  const curNormA = derived.aMax > 0 ? state.acceleration / derived.aMax : 0;

  return (
    <g>
      {/* Background Grid */}
      <line x1={padding.left} y1={midY} x2={padding.left + plotWidth} y2={midY} stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />
      <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + plotHeight} stroke="#334155" strokeWidth="1.5" />
      <line x1={padding.left} y1={padding.top + plotHeight} x2={padding.left + plotWidth} y2={padding.top + plotHeight} stroke="#334155" strokeWidth="1.5" />

      {/* Grid Lines */}
      {Array.from({ length: 6 }).map((_, i) => {
        const t = (i * duration) / 5;
        const gx = toX(t);
        return (
          <g key={i}>
            <line x1={gx} y1={padding.top} x2={gx} y2={padding.top + plotHeight} stroke="#1e293b" strokeWidth="1" />
            <text x={gx} y={padding.top + plotHeight + 15} fill="#64748b" textAnchor="middle">
              {t.toFixed(1)}s
            </text>
          </g>
        );
      })}

      {/* Y Axis Labels */}
      <text x={padding.left - 10} y={toY(1) + 4} fill="#94a3b8" textAnchor="end">+Peak</text>
      <text x={padding.left - 10} y={midY + 4} fill="#94a3b8" textAnchor="end">0</text>
      <text x={padding.left - 10} y={toY(-1) + 4} fill="#94a3b8" textAnchor="end">-Peak</text>
      <text x={padding.left - 10} y={padding.top - 8} fill="#cbd5e1" textAnchor="start" fontWeight="bold">
        Normalized Kinematics (x, v, a)
      </text>

      {/* Waveform Curves */}
      {/* 1. x(t) - Cyan */}
      <path d={pathX} fill="none" stroke="#38bdf8" strokeWidth="2.5" />
      {/* 2. v(t) - Emerald */}
      <path d={pathV} fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4,2" />
      {/* 3. a(t) - Amber */}
      <path d={pathA} fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="2,2" />

      {/* Current Time Line */}
      <line x1={currentX} y1={padding.top} x2={currentX} y2={padding.top + plotHeight} stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3,3" />

      {/* Current Value Marker Dots */}
      <circle cx={currentX} cy={toY(curNormX)} r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
      <circle cx={currentX} cy={toY(curNormV)} r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
      <circle cx={currentX} cy={toY(curNormA)} r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />

      {/* Legend */}
      <g transform={`translate(${padding.left + plotWidth - 280}, ${padding.top + 10})`}>
        <rect x="0" y="0" width="270" height="26" fill="#0b101b" rx="4" stroke="#1e293b" />
        <line x1="10" y1="13" x2="25" y2="13" stroke="#38bdf8" strokeWidth="2.5" />
        <text x="30" y="16" fill="#38bdf8">x(t) [cyan]</text>
        <line x1="90" y1="13" x2="105" y2="13" stroke="#10b981" strokeWidth="2" strokeDasharray="4,2" />
        <text x="110" y="16" fill="#10b981">v(t) [green]</text>
        <line x1="175" y1="13" x2="190" y2="13" stroke="#f59e0b" strokeWidth="2" strokeDasharray="2,2" />
        <text x="195" y="16" fill="#f59e0b">a(t) [amber]</text>
      </g>
    </g>
  );
};

// -------------------------------------------------------------
// Sub-Graph 2: Single Dedicated Series Graph (x, v, or a)
// -------------------------------------------------------------
interface SingleSeriesProps {
  samples: SHMSample[];
  getValue: (s: SHMSample) => number;
  currentVal: number;
  maxBound: number;
  yAxisLabel: string;
  curveColor: string;
  currentTime: number;
  duration: number;
  padding: { top: number; right: number; bottom: number; left: number };
  plotWidth: number;
  plotHeight: number;
  currentX: number;
  formula: string;
}

const SingleSeriesGraph: React.FC<SingleSeriesProps> = ({
  samples,
  getValue,
  currentVal,
  maxBound,
  yAxisLabel,
  curveColor,
  duration,
  padding,
  plotWidth,
  plotHeight,
  currentX,
  formula,
}) => {
  const midY = padding.top + plotHeight / 2;
  const toY = (val: number) => midY - (val / maxBound) * (plotHeight * 0.45);
  const toX = (t: number) => padding.left + (t / duration) * plotWidth;

  const path = samples.reduce((acc, s, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${toX(s.time).toFixed(1)},${toY(getValue(s)).toFixed(1)}`, '');

  return (
    <g>
      {/* Zero line */}
      <line x1={padding.left} y1={midY} x2={padding.left + plotWidth} y2={midY} stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />
      <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + plotHeight} stroke="#334155" strokeWidth="1.5" />
      <line x1={padding.left} y1={padding.top + plotHeight} x2={padding.left + plotWidth} y2={padding.top + plotHeight} stroke="#334155" strokeWidth="1.5" />

      {/* Ticks & grid */}
      {Array.from({ length: 6 }).map((_, i) => {
        const t = (i * duration) / 5;
        const gx = toX(t);
        return (
          <g key={i}>
            <line x1={gx} y1={padding.top} x2={gx} y2={padding.top + plotHeight} stroke="#1e293b" strokeWidth="1" />
            <text x={gx} y={padding.top + plotHeight + 15} fill="#64748b" textAnchor="middle">
              {t.toFixed(1)}s
            </text>
          </g>
        );
      })}

      {/* Y Axis numeric labels */}
      <text x={padding.left - 10} y={toY(maxBound) + 4} fill="#94a3b8" textAnchor="end">+{maxBound.toFixed(2)}</text>
      <text x={padding.left - 10} y={midY + 4} fill="#94a3b8" textAnchor="end">0.00</text>
      <text x={padding.left - 10} y={toY(-maxBound) + 4} fill="#94a3b8" textAnchor="end">-{maxBound.toFixed(2)}</text>
      <text x={padding.left} y={padding.top - 8} fill="#cbd5e1" textAnchor="start" fontWeight="bold">
        {yAxisLabel}
      </text>

      {/* Formula in top right */}
      <text x={padding.left + plotWidth} y={padding.top - 8} fill="#94a3b8" textAnchor="end">
        {formula}
      </text>

      {/* Curve */}
      <path d={path} fill="none" stroke={curveColor} strokeWidth="2.5" />

      {/* Current Time marker line & dot */}
      <line x1={currentX} y1={padding.top} x2={currentX} y2={padding.top + plotHeight} stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3,3" />
      <circle cx={currentX} cy={toY(currentVal)} r="4.5" fill={curveColor} stroke="#ffffff" strokeWidth="1.5" />

      {/* Current readout tooltip */}
      <g transform={`translate(${Math.min(padding.left + plotWidth - 110, currentX + 8)}, ${Math.max(padding.top + 20, toY(currentVal) - 15)})`}>
        <rect x="0" y="0" width="105" height="22" fill="#0b101b" rx="4" stroke="#334155" />
        <text x="8" y="15" fill="#f8fafc" fontWeight="bold">
          {currentVal >= 0 ? '+' : ''}{currentVal.toFixed(3)}
        </text>
      </g>
    </g>
  );
};

// -------------------------------------------------------------
// Sub-Graph 3: Dedicated Energies Graph (K, U, E)
// -------------------------------------------------------------
interface EnergiesGraphProps {
  samples: SHMSample[];
  derived: SHMDerivedValues;
  state: SHMState;
  currentTime: number;
  duration: number;
  padding: { top: number; right: number; bottom: number; left: number };
  plotWidth: number;
  plotHeight: number;
  currentX: number;
}

const EnergiesGraph: React.FC<EnergiesGraphProps> = ({
  samples,
  derived,
  state,
  duration,
  padding,
  plotWidth,
  plotHeight,
  currentX,
}) => {
  const maxEnergy = Math.max(0.01, derived.totalEnergy * 1.25);
  const toY = (e: number) => padding.top + plotHeight - (e / maxEnergy) * plotHeight;
  const toX = (t: number) => padding.left + (t / duration) * plotWidth;

  const pathK = samples.reduce((acc, s, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${toX(s.time).toFixed(1)},${toY(s.kineticEnergy).toFixed(1)}`, '');
  const pathU = samples.reduce((acc, s, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${toX(s.time).toFixed(1)},${toY(s.potentialEnergy).toFixed(1)}`, '');
  const totalEY = toY(derived.totalEnergy);

  return (
    <g>
      {/* Axes */}
      <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + plotHeight} stroke="#334155" strokeWidth="1.5" />
      <line x1={padding.left} y1={padding.top + plotHeight} x2={padding.left + plotWidth} y2={padding.top + plotHeight} stroke="#334155" strokeWidth="1.5" />

      {/* Grid */}
      {Array.from({ length: 6 }).map((_, i) => {
        const t = (i * duration) / 5;
        const gx = toX(t);
        return (
          <g key={i}>
            <line x1={gx} y1={padding.top} x2={gx} y2={padding.top + plotHeight} stroke="#1e293b" strokeWidth="1" />
            <text x={gx} y={padding.top + plotHeight + 15} fill="#64748b" textAnchor="middle">
              {t.toFixed(1)}s
            </text>
          </g>
        );
      })}

      {/* Y Axis Labels */}
      <text x={padding.left - 10} y={toY(derived.totalEnergy) + 4} fill="#f8fafc" textAnchor="end">
        E = {derived.totalEnergy.toFixed(3)} J
      </text>
      <text x={padding.left - 10} y={padding.top + plotHeight + 4} fill="#94a3b8" textAnchor="end">
        0.00 J
      </text>
      <text x={padding.left} y={padding.top - 8} fill="#cbd5e1" textAnchor="start" fontWeight="bold">
        Mechanical Energy Conservation (Joules)
      </text>

      {/* Total Energy Line (E = K + U = Constant) */}
      <line
        x1={padding.left}
        y1={totalEY}
        x2={padding.left + plotWidth}
        y2={totalEY}
        stroke="#ffffff"
        strokeWidth="2"
      />

      {/* Kinetic Energy Curve (Cyan) */}
      <path d={pathK} fill="none" stroke="#38bdf8" strokeWidth="2.5" />

      {/* Potential Energy Curve (Purple) */}
      <path d={pathU} fill="none" stroke="#c084fc" strokeWidth="2.5" />

      {/* Current Time marker line */}
      <line x1={currentX} y1={padding.top} x2={currentX} y2={padding.top + plotHeight} stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3,3" />

      {/* Current Values Dots */}
      <circle cx={currentX} cy={toY(state.kineticEnergy)} r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
      <circle cx={currentX} cy={toY(state.potentialEnergy)} r="4" fill="#c084fc" stroke="#ffffff" strokeWidth="1.5" />
      <circle cx={currentX} cy={totalEY} r="3.5" fill="#ffffff" />

      {/* Legend */}
      <g transform={`translate(${padding.left + plotWidth - 310}, ${padding.top + 10})`}>
        <rect x="0" y="0" width="300" height="26" fill="#0b101b" rx="4" stroke="#1e293b" />
        <line x1="10" y1="13" x2="25" y2="13" stroke="#ffffff" strokeWidth="2" />
        <text x="30" y="16" fill="#ffffff">Total E (const)</text>
        <line x1="110" y1="13" x2="125" y2="13" stroke="#38bdf8" strokeWidth="2.5" />
        <text x="130" y="16" fill="#38bdf8">K(t) [cyan]</text>
        <line x1="195" y1="13" x2="210" y2="13" stroke="#c084fc" strokeWidth="2.5" />
        <text x="215" y="16" fill="#c084fc">U(t) [purple]</text>
      </g>
    </g>
  );
};

// -------------------------------------------------------------
// Sub-Graph 4: Hooke's Law F vs x Graph (Straight line with slope -k)
// -------------------------------------------------------------
interface ForceDisplacementProps {
  params: SHMParameters;
  derived: SHMDerivedValues;
  state: SHMState;
  padding: { top: number; right: number; bottom: number; left: number };
  plotWidth: number;
  plotHeight: number;
}

const ForceDisplacementGraph: React.FC<ForceDisplacementProps> = ({
  params,
  derived,
  state,
  padding,
  plotWidth,
  plotHeight,
}) => {
  const midX = padding.left + plotWidth / 2;
  const midY = padding.top + plotHeight / 2;

  const maxDisp = Math.max(0.1, derived.effectiveAmplitude * 1.2);
  const maxForce = Math.max(1.0, derived.fMax * 1.2);

  const toX = (x: number) => midX + (x / maxDisp) * (plotWidth * 0.42);
  const toY = (f: number) => midY - (f / maxForce) * (plotHeight * 0.42);

  // Hooke's law line endpoints: from (-A, +kA) to (+A, -kA)
  const xLeft = -derived.effectiveAmplitude;
  const fLeft = params.springConstant * derived.effectiveAmplitude; // F = -k(-A) = +kA
  const xRight = derived.effectiveAmplitude;
  const fRight = -params.springConstant * derived.effectiveAmplitude; // F = -k(+A) = -kA

  const currentPtX = toX(state.displacement);
  const currentPtY = toY(state.restoringForce);

  return (
    <g>
      {/* Axes */}
      <line x1={padding.left} y1={midY} x2={padding.left + plotWidth} y2={midY} stroke="#334155" strokeWidth="1.5" />
      <line x1={midX} y1={padding.top} x2={midX} y2={padding.top + plotHeight} stroke="#334155" strokeWidth="1.5" />

      {/* Axis Labels */}
      <text x={padding.left + plotWidth} y={midY - 8} fill="#94a3b8" textAnchor="end">
        Displacement x (m) →
      </text>
      <text x={midX + 8} y={padding.top} fill="#94a3b8" textAnchor="start">
        ↑ Restoring Force F (N)
      </text>

      {/* Hooke's Law Straight Line F = -kx */}
      <line
        x1={toX(xLeft)}
        y1={toY(fLeft)}
        x2={toX(xRight)}
        y2={toY(fRight)}
        stroke="#f43f5e"
        strokeWidth="3"
      />

      {/* Origin Center point */}
      <circle cx={midX} cy={midY} r="3" fill="#64748b" />

      {/* Moving Operating Point */}
      <circle cx={currentPtX} cy={currentPtY} r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />

      {/* Dashed projection lines to axes */}
      <line x1={currentPtX} y1={currentPtY} x2={currentPtX} y2={midY} stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" />
      <line x1={currentPtX} y1={currentPtY} x2={midX} y2={currentPtY} stroke="#f43f5e" strokeWidth="1" strokeDasharray="3,3" />

      {/* Hooke's slope annotation */}
      <g transform={`translate(${padding.left + 20}, ${padding.top + 20})`}>
        <rect x="0" y="0" width="220" height="42" fill="#0b101b" rx="4" stroke="#1e293b" />
        <text x="10" y="18" fill="#f8fafc" fontWeight="bold">
          F = -kx (Hooke's Law)
        </text>
        <text x="10" y="34" fill="#f43f5e">
          Slope = -k = -{params.springConstant.toFixed(1)} N/m
        </text>
      </g>
    </g>
  );
};

// -------------------------------------------------------------
// Sub-Graph 5: Phase Space Plot (v vs x Orbit)
// -------------------------------------------------------------
interface PhaseSpaceProps {
  samples: SHMSample[];
  derived: SHMDerivedValues;
  state: SHMState;
  padding: { top: number; right: number; bottom: number; left: number };
  plotWidth: number;
  plotHeight: number;
}

const PhaseSpaceGraph: React.FC<PhaseSpaceProps> = ({
  samples,
  derived,
  state,
  padding,
  plotWidth,
  plotHeight,
}) => {
  const midX = padding.left + plotWidth / 2;
  const midY = padding.top + plotHeight / 2;

  const maxDisp = Math.max(0.1, derived.effectiveAmplitude * 1.2);
  const maxVel = Math.max(0.1, derived.vMax * 1.2);

  const toX = (x: number) => midX + (x / maxDisp) * (plotWidth * 0.42);
  const toY = (v: number) => midY - (v / maxVel) * (plotHeight * 0.42);

  // Closed elliptical orbital path
  const orbitPath = samples.reduce((acc, s, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${toX(s.displacement).toFixed(1)},${toY(s.velocity).toFixed(1)}`, '') + ' Z';

  const currentPtX = toX(state.displacement);
  const currentPtY = toY(state.velocity);

  return (
    <g>
      {/* Axes */}
      <line x1={padding.left} y1={midY} x2={padding.left + plotWidth} y2={midY} stroke="#334155" strokeWidth="1.5" />
      <line x1={midX} y1={padding.top} x2={midX} y2={padding.top + plotHeight} stroke="#334155" strokeWidth="1.5" />

      {/* Axis Labels */}
      <text x={padding.left + plotWidth} y={midY - 8} fill="#94a3b8" textAnchor="end">
        Displacement x (m) →
      </text>
      <text x={midX + 8} y={padding.top} fill="#94a3b8" textAnchor="start">
        ↑ Velocity v (m/s)
      </text>

      {/* Phase Space Elliptical Trajectory */}
      <path d={orbitPath} fill="rgba(56, 189, 248, 0.05)" stroke="#38bdf8" strokeWidth="2.5" />

      {/* Moving Phase Point */}
      <circle cx={currentPtX} cy={currentPtY} r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />

      {/* Direction of flow (Clockwise orbit indicator) */}
      <g transform={`translate(${padding.left + 20}, ${padding.top + 20})`}>
        <rect x="0" y="0" width="220" height="42" fill="#0b101b" rx="4" stroke="#1e293b" />
        <text x="10" y="18" fill="#f8fafc" fontWeight="bold">
          Phase Space Trajectory
        </text>
        <text x="10" y="34" fill="#38bdf8">
          Clockwise Orbit: (x(t), v(t))
        </text>
      </g>
    </g>
  );
};
