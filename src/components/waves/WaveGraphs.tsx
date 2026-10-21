/**
 * EQUATION 1 — Wave Interference Scientific Graph Laboratory
 * Interactive SVG Graphs: Spatial Snapshot y(x), Time History y(t),
 * Resultant Amplitude vs. Phase Difference A_R(Δφ), and 2D Cross-Sectional Intensity Profile I(y).
 */

import React, { useState } from 'react';
import {
  WaveExperimentMode,
  WaveSuperpositionParameters,
  TwoSourceParameters,
} from '../../physics/waves/types';
import {
  calculateWaveNumber,
  calculateAngularFrequency,
  calculateSinusoidalDisplacement,
  calculateSuperposition,
  calculateResultantAmplitude,
} from '../../physics/waves/model';
import { LineChart, Clock, Waves, TrendingUp, BarChart2 } from 'lucide-react';

export type WaveGraphTab = 'spatial' | 'time' | 'phase-curve' | 'intensity-profile';

interface WaveGraphsProps {
  mode: WaveExperimentMode;
  superpositionParams: WaveSuperpositionParameters;
  twoSourceParams: TwoSourceParameters;
  time: number;
}

export const WaveGraphs: React.FC<WaveGraphsProps> = ({
  mode,
  superpositionParams,
  twoSourceParams,
  time,
}) => {
  const [activeTab, setActiveTab] = useState<WaveGraphTab>('spatial');

  // SVG dimensions
  const svgWidth = 840;
  const svgHeight = 260;
  const padding = { top: 30, right: 35, bottom: 40, left: 65 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;
  const midY = padding.top + plotHeight / 2;

  // Precompute constants for Mode A
  const k1 = calculateWaveNumber(superpositionParams.wave1.wavelength);
  const k2 = calculateWaveNumber(superpositionParams.wave2.wavelength);
  const omega1 = calculateAngularFrequency(superpositionParams.wave1.frequency);
  const omega2 = calculateAngularFrequency(superpositionParams.wave2.frequency);
  const phi1 = (superpositionParams.wave1.initialPhaseDeg * Math.PI) / 180;
  const phi2 = (superpositionParams.wave2.initialPhaseDeg * Math.PI) / 180;

  // Max visual bound for displacement axes
  const maxCombinedA = superpositionParams.wave1.amplitude + superpositionParams.wave2.amplitude;
  const yBound = Math.max(1.2, maxCombinedA * 1.25);

  const toScreenX = (xNorm: number) => padding.left + xNorm * plotWidth;
  const toScreenY = (yVal: number) => midY - (yVal / yBound) * (plotHeight * 0.45);

  return (
    <div className="bg-[#090d16] border border-slate-800/90 rounded-xl p-4 sm:p-5 select-none space-y-4">
      {/* Header and Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <LineChart className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold text-white tracking-wider uppercase font-mono">
            Scientific Wave Graphs
          </h2>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center bg-[#07090e] p-1 rounded-lg border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('spatial')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'spatial'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Graph A: Spatial Snapshot y(x)
          </button>
          <button
            onClick={() => setActiveTab('time')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'time'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Graph B: Time History y(t)
          </button>
          <button
            onClick={() => setActiveTab('phase-curve')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'phase-curve'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Graph C: Resultant A_R vs Δφ
          </button>
          <button
            onClick={() => setActiveTab('intensity-profile')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'intensity-profile'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Graph D: Intensity Profile I(y)
          </button>
        </div>
      </div>

      {/* SVG Plotting Viewport */}
      <div className="w-full bg-[#07090e] border border-slate-800/80 rounded-lg p-2 overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[580px] font-mono text-[10px]"
        >
          {/* TAB 1: Spatial Snapshot y(x) at current time t */}
          {activeTab === 'spatial' && (
            <g>
              {/* Grid & Axes */}
              <line x1={padding.left} y1={midY} x2={padding.left + plotWidth} y2={midY} stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />
              <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + plotHeight} stroke="#334155" strokeWidth="1.5" />
              <line x1={padding.left} y1={padding.top + plotHeight} x2={padding.left + plotWidth} y2={padding.top + plotHeight} stroke="#334155" strokeWidth="1.5" />

              {/* Ticks along x */}
              {Array.from({ length: 6 }).map((_, idx) => {
                const xVal = (idx * superpositionParams.spatialSpanMeters) / 5;
                const sx = toScreenX(idx / 5);
                return (
                  <g key={idx}>
                    <line x1={sx} y1={padding.top} x2={sx} y2={padding.top + plotHeight} stroke="#1e293b" strokeWidth="1" />
                    <text x={sx} y={padding.top + plotHeight + 15} fill="#64748b" textAnchor="middle">
                      {xVal.toFixed(1)}m
                    </text>
                  </g>
                );
              })}

              {/* Y Axis Numeric Labels */}
              <text x={padding.left - 10} y={toScreenY(yBound * 0.9) + 4} fill="#94a3b8" textAnchor="end">+{yBound.toFixed(1)}m</text>
              <text x={padding.left - 10} y={midY + 4} fill="#94a3b8" textAnchor="end">0.0m</text>
              <text x={padding.left - 10} y={toScreenY(-yBound * 0.9) + 4} fill="#94a3b8" textAnchor="end">-{yBound.toFixed(1)}m</text>
              <text x={padding.left} y={padding.top - 10} fill="#cbd5e1" fontWeight="bold">
                Spatial Profile y(x) at t = {time.toFixed(2)}s
              </text>

              {/* Sample and draw curves */}
              {(() => {
                const sampleSteps = 200;
                let path1 = '';
                let path2 = '';
                let pathR = '';

                for (let i = 0; i <= sampleSteps; i++) {
                  const normX = i / sampleSteps;
                  const x = normX * superpositionParams.spatialSpanMeters;
                  const sx = toScreenX(normX);

                  const y1 = calculateSinusoidalDisplacement(superpositionParams.wave1.amplitude, k1, omega1, phi1, x, time, superpositionParams.wave1.direction);
                  const y2 = calculateSinusoidalDisplacement(superpositionParams.wave2.amplitude, k2, omega2, phi2, x, time, superpositionParams.wave2.direction);
                  const yR = calculateSuperposition(y1, y2);

                  path1 += `${i === 0 ? 'M' : 'L'} ${sx.toFixed(1)},${toScreenY(y1).toFixed(1)} `;
                  path2 += `${i === 0 ? 'M' : 'L'} ${sx.toFixed(1)},${toScreenY(y2).toFixed(1)} `;
                  pathR += `${i === 0 ? 'M' : 'L'} ${sx.toFixed(1)},${toScreenY(yR).toFixed(1)} `;
                }

                return (
                  <>
                    <path d={path1} fill="none" stroke="#06b6d4" strokeWidth="2" opacity={superpositionParams.wave1.visible ? 1 : 0.2} />
                    <path d={path2} fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="5,3" opacity={superpositionParams.wave2.visible ? 1 : 0.2} />
                    {superpositionParams.showResultant && (
                      <path d={pathR} fill="none" stroke="#facc15" strokeWidth="3" />
                    )}
                  </>
                );
              })()}

              {/* Probe marker line */}
              {(() => {
                const probeSx = toScreenX(superpositionParams.probeX / superpositionParams.spatialSpanMeters);
                return (
                  <line x1={probeSx} y1={padding.top} x2={probeSx} y2={padding.top + plotHeight} stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3,3" />
                );
              })()}

              {/* Legend */}
              <g transform={`translate(${padding.left + plotWidth - 280}, ${padding.top + 8})`}>
                <rect x="0" y="0" width="270" height="24" fill="#0b101b" rx="4" stroke="#1e293b" />
                <line x1="8" y1="12" x2="22" y2="12" stroke="#06b6d4" strokeWidth="2" />
                <text x="26" y="15" fill="#06b6d4">Wave 1</text>
                <line x1="85" y1="12" x2="100" y2="12" stroke="#a855f7" strokeWidth="2" strokeDasharray="4,2" />
                <text x="105" y="15" fill="#a855f7">Wave 2</text>
                <line x1="165" y1="12" x2="180" y2="12" stroke="#facc15" strokeWidth="3" />
                <text x="185" y="15" fill="#facc15">Resultant</text>
              </g>
            </g>
          )}

          {/* TAB 2: Time History y(t) at Probe Position x = probeX */}
          {activeTab === 'time' && (
            <g>
              <line x1={padding.left} y1={midY} x2={padding.left + plotWidth} y2={midY} stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />
              <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + plotHeight} stroke="#334155" strokeWidth="1.5" />
              <line x1={padding.left} y1={padding.top + plotHeight} x2={padding.left + plotWidth} y2={padding.top + plotHeight} stroke="#334155" strokeWidth="1.5" />

              {/* Time window: previous 4 seconds to future 1 second or 0 to 5s */}
              {(() => {
                const tWindow = 5.0; // seconds
                const steps = 200;
                let path1 = '';
                let path2 = '';
                let pathR = '';

                for (let i = 0; i <= steps; i++) {
                  const tSample = (i / steps) * tWindow;
                  const sx = toScreenX(i / steps);

                  const y1 = calculateSinusoidalDisplacement(superpositionParams.wave1.amplitude, k1, omega1, phi1, superpositionParams.probeX, tSample, superpositionParams.wave1.direction);
                  const y2 = calculateSinusoidalDisplacement(superpositionParams.wave2.amplitude, k2, omega2, phi2, superpositionParams.probeX, tSample, superpositionParams.wave2.direction);
                  const yR = calculateSuperposition(y1, y2);

                  path1 += `${i === 0 ? 'M' : 'L'} ${sx.toFixed(1)},${toScreenY(y1).toFixed(1)} `;
                  path2 += `${i === 0 ? 'M' : 'L'} ${sx.toFixed(1)},${toScreenY(y2).toFixed(1)} `;
                  pathR += `${i === 0 ? 'M' : 'L'} ${sx.toFixed(1)},${toScreenY(yR).toFixed(1)} `;
                }

                const currentTNorm = (time % tWindow) / tWindow;
                const currentSx = toScreenX(currentTNorm);

                return (
                  <>
                    {/* Ticks */}
                    {Array.from({ length: 6 }).map((_, idx) => {
                      const tVal = (idx * tWindow) / 5;
                      const sx = toScreenX(idx / 5);
                      return (
                        <g key={idx}>
                          <line x1={sx} y1={padding.top} x2={sx} y2={padding.top + plotHeight} stroke="#1e293b" strokeWidth="1" />
                          <text x={sx} y={padding.top + plotHeight + 15} fill="#64748b" textAnchor="middle">
                            {tVal.toFixed(1)}s
                          </text>
                        </g>
                      );
                    })}

                    <text x={padding.left} y={padding.top - 10} fill="#cbd5e1" fontWeight="bold">
                      Time Evolution y(t) at x = {superpositionParams.probeX.toFixed(2)}m
                    </text>

                    <path d={path1} fill="none" stroke="#06b6d4" strokeWidth="2" opacity={superpositionParams.wave1.visible ? 1 : 0.2} />
                    <path d={path2} fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="5,3" opacity={superpositionParams.wave2.visible ? 1 : 0.2} />
                    {superpositionParams.showResultant && (
                      <path d={pathR} fill="none" stroke="#facc15" strokeWidth="3" />
                    )}

                    {/* Current simulation time marker */}
                    <line x1={currentSx} y1={padding.top} x2={currentSx} y2={padding.top + plotHeight} stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3,3" />
                  </>
                );
              })()}
            </g>
          )}

          {/* TAB 3: Resultant Amplitude A_R vs Relative Phase Difference Δφ */}
          {activeTab === 'phase-curve' && (
            <g>
              {/* Axes */}
              <line x1={padding.left} y1={padding.top + plotHeight} x2={padding.left + plotWidth} y2={padding.top + plotHeight} stroke="#334155" strokeWidth="1.5" />
              <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + plotHeight} stroke="#334155" strokeWidth="1.5" />

              <text x={padding.left} y={padding.top - 10} fill="#cbd5e1" fontWeight="bold">
                Analytical Resultant Amplitude: A_R = √(A₁² + A₂² + 2A₁A₂ cos Δφ)
              </text>

              {/* Theoretical Curve across -180° to +180° */}
              {(() => {
                const maxAR = superpositionParams.wave1.amplitude + superpositionParams.wave2.amplitude;
                const minAR = Math.abs(superpositionParams.wave1.amplitude - superpositionParams.wave2.amplitude);
                const steps = 180;
                let pathAR = '';

                for (let i = 0; i <= steps; i++) {
                  const deg = -180 + (i / steps) * 360; // -180 to +180
                  const rad = (deg * Math.PI) / 180;
                  const ar = calculateResultantAmplitude(superpositionParams.wave1.amplitude, superpositionParams.wave2.amplitude, rad);

                  const sx = toScreenX(i / steps);
                  const sy = padding.top + plotHeight - (ar / (maxAR * 1.2 || 1)) * plotHeight;
                  pathAR += `${i === 0 ? 'M' : 'L'} ${sx.toFixed(1)},${sy.toFixed(1)} `;
                }

                // Current operating phase point
                const curPhaseDeg = superpositionParams.wave2.initialPhaseDeg;
                const curNormX = (curPhaseDeg - -180) / 360;
                const curAR = calculateResultantAmplitude(
                  superpositionParams.wave1.amplitude,
                  superpositionParams.wave2.amplitude,
                  (curPhaseDeg * Math.PI) / 180
                );
                const curSx = toScreenX(Math.max(0, Math.min(1, curNormX)));
                const curSy = padding.top + plotHeight - (curAR / (maxAR * 1.2 || 1)) * plotHeight;

                return (
                  <>
                    {/* Ticks */}
                    {[-180, -90, 0, 90, 180].map((deg, idx) => {
                      const sx = toScreenX(idx / 4);
                      return (
                        <g key={idx}>
                          <line x1={sx} y1={padding.top} x2={sx} y2={padding.top + plotHeight} stroke="#1e293b" strokeWidth="1" />
                          <text x={sx} y={padding.top + plotHeight + 15} fill="#64748b" textAnchor="middle">
                            {deg}°
                          </text>
                        </g>
                      );
                    })}

                    {/* Y Labels */}
                    <text x={padding.left - 8} y={padding.top + plotHeight - (maxAR / (maxAR * 1.2 || 1)) * plotHeight + 4} fill="#facc15" textAnchor="end">
                      Max: {maxAR.toFixed(2)}m
                    </text>
                    <text x={padding.left - 8} y={padding.top + plotHeight - (minAR / (maxAR * 1.2 || 1)) * plotHeight + 4} fill="#f43f5e" textAnchor="end">
                      Min: {minAR.toFixed(2)}m
                    </text>

                    {/* Curve */}
                    <path d={pathAR} fill="none" stroke="#facc15" strokeWidth="3" />

                    {/* Current operating point marker */}
                    <circle cx={curSx} cy={curSy} r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                    <line x1={curSx} y1={padding.top} x2={curSx} y2={padding.top + plotHeight} stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,3" />

                    <g transform={`translate(${Math.min(padding.left + plotWidth - 140, curSx + 10)}, ${Math.max(padding.top + 20, curSy - 20)})`}>
                      <rect x="0" y="0" width="130" height="26" fill="#0b101b" rx="4" stroke="#38bdf8" />
                      <text x="8" y="16" fill="#f8fafc" fontWeight="bold">
                        Δφ = {curPhaseDeg.toFixed(0)}° → A_R = {curAR.toFixed(2)}m
                      </text>
                    </g>
                  </>
                );
              })()}
            </g>
          )}

          {/* TAB 4: Intensity Cross-Section Profile I(y) for Two-Source Mode */}
          {activeTab === 'intensity-profile' && (
            <g>
              <line x1={padding.left} y1={padding.top + plotHeight} x2={padding.left + plotWidth} y2={padding.top + plotHeight} stroke="#334155" strokeWidth="1.5" />
              <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + plotHeight} stroke="#334155" strokeWidth="1.5" />

              <text x={padding.left} y={padding.top - 10} fill="#cbd5e1" fontWeight="bold">
                Interference Fringe Intensity Profile I(y) at Screen Distance x = 5.0m
              </text>

              {(() => {
                const screenDistX = 5.0; // 5 meters away from sources
                const halfD = twoSourceParams.separation / 2;
                const kTwo = calculateWaveNumber(twoSourceParams.wavelength);
                const steps = 160;
                let pathI = '';

                for (let i = 0; i <= steps; i++) {
                  const norm = i / steps;
                  // y from -4.0m to +4.0m
                  const y = -4.0 + norm * 8.0;
                  const r1 = Math.sqrt(screenDistX * screenDistX + (y - halfD) * (y - halfD));
                  const r2 = Math.sqrt(screenDistX * screenDistX + (y + halfD) * (y + halfD));
                  const deltaR = r2 - r1;
                  const deltaPhi = kTwo * deltaR + (twoSourceParams.sourcePhase2Deg * Math.PI) / 180;
                  const intensity = Math.cos(deltaPhi / 2) ** 2; // 0 to 1

                  const sx = toScreenX(norm);
                  const sy = padding.top + plotHeight - intensity * (plotHeight * 0.85);
                  pathI += `${i === 0 ? 'M' : 'L'} ${sx.toFixed(1)},${sy.toFixed(1)} `;
                }

                return (
                  <>
                    {/* Ticks */}
                    {[-4, -2, 0, 2, 4].map((yVal, idx) => {
                      const sx = toScreenX(idx / 4);
                      return (
                        <g key={idx}>
                          <line x1={sx} y1={padding.top} x2={sx} y2={padding.top + plotHeight} stroke="#1e293b" strokeWidth="1" />
                          <text x={sx} y={padding.top + plotHeight + 15} fill="#64748b" textAnchor="middle">
                            {yVal.toFixed(1)}m
                          </text>
                        </g>
                      );
                    })}

                    <text x={padding.left - 8} y={padding.top + 20} fill="#facc15" textAnchor="end">I_max (Antinode)</text>
                    <text x={padding.left - 8} y={padding.top + plotHeight - 4} fill="#64748b" textAnchor="end">0 (Node)</text>

                    {/* Area under curve */}
                    <path d={`${pathI} L ${toScreenX(1)},${padding.top + plotHeight} L ${toScreenX(0)},${padding.top + plotHeight} Z`} fill="rgba(250, 204, 21, 0.1)" />
                    {/* Curve */}
                    <path d={pathI} fill="none" stroke="#facc15" strokeWidth="2.5" />
                  </>
                );
              })()}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
