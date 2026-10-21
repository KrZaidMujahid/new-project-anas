/**
 * EQUATION 1 — Live Oscillation Displacement-Time Graph (Section 7)
 * Real-time oscilloscope plotting numerical displacement x(t) and driving force reference F(t).
 * Directly visualizes transient buildup, phase evolution, and steady-state resonance.
 */

import React, { useMemo } from 'react';
import { OscillatorHistoryPoint } from '../../physics/resonance/types';
import { Activity, Clock, Compass } from 'lucide-react';

interface DisplacementTimeGraphProps {
  history: OscillatorHistoryPoint[];
  currentTime: number;
  steadyStateAmp: number;
}

export const DisplacementTimeGraph: React.FC<DisplacementTimeGraphProps> = ({
  history,
  currentTime,
  steadyStateAmp,
}) => {
  const width = 800;
  const height = 240;
  const padding = { top: 25, right: 30, bottom: 35, left: 55 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;
  const centerY = padding.top + plotH / 2;

  // Compute amplitude scale
  const maxHistoryDisp = useMemo(() => {
    if (history.length === 0) return 0.5;
    let maxVal = 0.2;
    for (let i = 0; i < history.length; i++) {
      const absD = Math.abs(history[i].displacement);
      if (absD > maxVal) maxVal = absD;
    }
    return Math.max(0.3, Math.min(6.0, maxVal * 1.25));
  }, [history]);

  const scaleY = (disp: number) => centerY - (disp / maxHistoryDisp) * (plotH / 2);

  // Time window: show the most recent 6 seconds of history
  const timeWindow = 6.0;
  const minTime = Math.max(0, currentTime - timeWindow);
  const maxTime = minTime + timeWindow;

  const scaleX = (t: number) => padding.left + ((t - minTime) / timeWindow) * plotW;

  // Build displacement path
  const displacementPath = useMemo(() => {
    if (history.length === 0) return '';
    const visiblePoints = history.filter((p) => p.time >= minTime && p.time <= maxTime);
    if (visiblePoints.length === 0) return '';

    return visiblePoints
      .map((p, idx) => {
        const sx = scaleX(p.time);
        const sy = scaleY(p.displacement);
        return `${idx === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`;
      })
      .join(' ');
  }, [history, minTime, maxTime, maxHistoryDisp]);

  // Build driving force reference path (normalized to 50% amplitude)
  const drivingForcePath = useMemo(() => {
    if (history.length === 0) return '';
    const visiblePoints = history.filter((p) => p.time >= minTime && p.time <= maxTime);
    if (visiblePoints.length === 0) return '';

    return visiblePoints
      .map((p, idx) => {
        const sx = scaleX(p.time);
        const sy = centerY - (p.drivingForceNormalized * (plotH / 2) * 0.45);
        return `${idx === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`;
      })
      .join(' ');
  }, [history, minTime, maxTime]);

  const latestPoint = history[history.length - 1];

  return (
    <div className="bg-[#101D30] border border-slate-800 rounded-xl p-4 shadow-xl space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Live Oscillation Graph: Displacement vs Time x(t)
            </h3>
            <p className="text-[11px] text-slate-400">
              Transient response evolution and steady-state limit cycle
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-cyan-300">
            Current x(t):{' '}
            <strong className="text-white">
              {latestPoint ? `${latestPoint.displacement >= 0 ? '+' : ''}${latestPoint.displacement.toFixed(3)} m` : '0.000 m'}
            </strong>
          </span>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full overflow-hidden rounded-lg bg-[#07111F] border border-slate-800/80 p-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none overflow-visible"
        >
          {/* Equilibrium line (x = 0) */}
          <line
            x1={padding.left}
            y1={centerY}
            x2={width - padding.right}
            y2={centerY}
            stroke="#334155"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <text
            x={padding.left - 8}
            y={centerY + 3}
            fill="#64748b"
            fontSize="10"
            fontFamily="monospace"
            textAnchor="end"
          >
            0
          </text>

          {/* +A and -A guide lines */}
          <line
            x1={padding.left}
            y1={scaleY(maxHistoryDisp * 0.75)}
            x2={width - padding.right}
            y2={scaleY(maxHistoryDisp * 0.75)}
            stroke="#1e293b"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          <text
            x={padding.left - 8}
            y={scaleY(maxHistoryDisp * 0.75) + 3}
            fill="#64748b"
            fontSize="10"
            fontFamily="monospace"
            textAnchor="end"
          >
            +{(maxHistoryDisp * 0.75).toFixed(2)}m
          </text>

          <line
            x1={padding.left}
            y1={scaleY(-maxHistoryDisp * 0.75)}
            x2={width - padding.right}
            y2={scaleY(-maxHistoryDisp * 0.75)}
            stroke="#1e293b"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          <text
            x={padding.left - 8}
            y={scaleY(-maxHistoryDisp * 0.75) + 3}
            fill="#64748b"
            fontSize="10"
            fontFamily="monospace"
            textAnchor="end"
          >
            -{(maxHistoryDisp * 0.75).toFixed(2)}m
          </text>

          {/* Driving Force normalized wave (Amber dashed) */}
          <path
            d={drivingForcePath}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            opacity="0.65"
          />

          {/* Mass Displacement Curve x(t) (Emerald / Cyan) */}
          <path
            d={displacementPath}
            fill="none"
            stroke="#34d399"
            strokeWidth="2.6"
            strokeLinecap="round"
          />

          {/* Current position bead */}
          {latestPoint && (
            <g>
              <circle
                cx={scaleX(latestPoint.time)}
                cy={scaleY(latestPoint.displacement)}
                r="5"
                fill="#34d399"
              />
              <circle
                cx={scaleX(latestPoint.time)}
                cy={scaleY(latestPoint.displacement)}
                r="8"
                fill="none"
                stroke="#34d399"
                strokeWidth="1.5"
                opacity="0.7"
              />
            </g>
          )}

          {/* X Axis Time Labels */}
          <text
            x={scaleX(minTime)}
            y={height - 12}
            fill="#64748b"
            fontSize="10"
            fontFamily="monospace"
            textAnchor="start"
          >
            {minTime.toFixed(1)}s
          </text>
          <text
            x={scaleX(minTime + timeWindow / 2)}
            y={height - 12}
            fill="#64748b"
            fontSize="10"
            fontFamily="monospace"
            textAnchor="middle"
          >
            {(minTime + timeWindow / 2).toFixed(1)}s
          </text>
          <text
            x={scaleX(maxTime)}
            y={height - 12}
            fill="#64748b"
            fontSize="10"
            fontFamily="monospace"
            textAnchor="end"
          >
            {maxTime.toFixed(1)}s (Now)
          </text>
        </svg>
      </div>

      {/* Legend & Telemetry */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#34d399] rounded" />
            <span className="text-slate-300">Mass Displacement x(t)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-b border-amber-400 border-dashed" />
            <span className="text-slate-300">Driving Force F(t)/F₀ Reference</span>
          </div>
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          Showing 6.0s continuous numerical history
        </span>
      </div>
    </div>
  );
};
