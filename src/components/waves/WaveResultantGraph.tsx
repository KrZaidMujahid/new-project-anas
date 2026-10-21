/**
 * EQUATION 1 — Resultant Wave & Superposition Analysis Graph (Mode 4)
 * Real-time animated SVG graph displaying:
 * - Wave 1 (Cyan #38BDF8)
 * - Wave 2 (Purple #A78BFA)
 * - Resultant Wave (Emerald Green #34D399 / Yellow #FBBF24)
 * Supports spatial waveform y(x) and temporal oscillation y(t) at Point P.
 */

import React, { useState, useMemo } from 'react';
import { TwoSourceParameters, PointInterferenceAnalysis } from '../../physics/waves/types';
import { generate1DSpatialSamples, generate1DTimeSamples } from '../../physics/waves/model';
import { Activity, Layers, Clock, Ruler } from 'lucide-react';

interface WaveResultantGraphProps {
  params: TwoSourceParameters;
  time: number;
  analysis: PointInterferenceAnalysis;
}

export const WaveResultantGraph: React.FC<WaveResultantGraphProps> = ({
  params,
  time,
  analysis,
}) => {
  const [viewType, setViewType] = useState<'spatial' | 'temporal'>('spatial');

  // Compute spatial samples across field width
  const spatialSamples = useMemo(() => {
    return generate1DSpatialSamples(params, time, 140);
  }, [params, time]);

  // Compute temporal samples across 2 oscillation periods
  const timeSamples = useMemo(() => {
    return generate1DTimeSamples(params, time, 120);
  }, [params, time]);

  // SVG viewport geometry
  const width = 800;
  const height = 240;
  const padding = { top: 20, right: 30, bottom: 35, left: 50 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;
  const centerY = padding.top + plotH / 2;

  // Max amplitude scale for Y axis
  const maxAmp = Math.max(1.0, params.amplitude * 2.2);

  const scaleY = (yVal: number) => centerY - (yVal / maxAmp) * (plotH / 2);

  // Generate SVG path for 1D samples
  const createSpatialPath = (key: 'y1' | 'y2' | 'yResultant') => {
    if (spatialSamples.length === 0) return '';
    const maxX = params.fieldWidthMeters || 10;
    return spatialSamples
      .map((s, idx) => {
        const sx = padding.left + (s.x / maxX) * plotW;
        const sy = scaleY(s[key]);
        return `${idx === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`;
      })
      .join(' ');
  };

  const createTemporalPath = (key: 'y1' | 'y2' | 'yResultant') => {
    if (timeSamples.length === 0) return '';
    const minT = timeSamples[0].time;
    const maxT = timeSamples[timeSamples.length - 1].time;
    const rangeT = maxT - minT || 1;

    return timeSamples
      .map((s, idx) => {
        const sx = padding.left + ((s.time - minT) / rangeT) * plotW;
        const sy = scaleY(s[key]);
        return `${idx === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`;
      })
      .join(' ');
  };

  return (
    <div className="bg-[#101D30] border border-slate-800 rounded-xl p-4 shadow-xl space-y-3">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              Resultant Waveform & Superposition
              <span className="text-[10px] font-mono text-emerald-400 font-normal px-2 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-500/30">
                Mode 4
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Superposition principle: algebraic sum <span className="text-white font-mono font-bold">y_R(x,t) = y₁(x,t) + y₂(x,t)</span>
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5 bg-[#07111F] p-1 rounded-lg border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setViewType('spatial')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors cursor-pointer ${
              viewType === 'spatial'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Ruler className="w-3 h-3" />
            <span>Spatial y(x)</span>
          </button>
          <button
            onClick={() => setViewType('temporal')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors cursor-pointer ${
              viewType === 'temporal'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Temporal y(t) at P</span>
          </button>
        </div>
      </div>

      {/* SVG Graph Viewport */}
      <div className="relative w-full overflow-hidden rounded-lg bg-[#07111F] border border-slate-800/80 p-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none overflow-visible"
        >
          {/* Grid lines */}
          <line
            x1={padding.left}
            y1={centerY}
            x2={width - padding.right}
            y2={centerY}
            stroke="#334155"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />

          {/* +A and -A guide lines */}
          <line
            x1={padding.left}
            y1={scaleY(params.amplitude)}
            x2={width - padding.right}
            y2={scaleY(params.amplitude)}
            stroke="#1e293b"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          <line
            x1={padding.left}
            y1={scaleY(-params.amplitude)}
            x2={width - padding.right}
            y2={scaleY(-params.amplitude)}
            stroke="#1e293b"
            strokeWidth="1"
            strokeDasharray="2 2"
          />

          {/* +2A and -2A guide lines */}
          <line
            x1={padding.left}
            y1={scaleY(params.amplitude * 2)}
            x2={width - padding.right}
            y2={scaleY(params.amplitude * 2)}
            stroke="#334155"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <line
            x1={padding.left}
            y1={scaleY(-params.amplitude * 2)}
            x2={width - padding.right}
            y2={scaleY(-params.amplitude * 2)}
            stroke="#334155"
            strokeWidth="1"
            strokeDasharray="3 3"
          />

          {/* Y Axis Labels */}
          <text
            x={padding.left - 8}
            y={scaleY(params.amplitude * 2) + 3}
            fill="#94a3b8"
            fontSize="9"
            fontFamily="monospace"
            textAnchor="end"
          >
            +2A
          </text>
          <text
            x={padding.left - 8}
            y={scaleY(params.amplitude) + 3}
            fill="#94a3b8"
            fontSize="9"
            fontFamily="monospace"
            textAnchor="end"
          >
            +A
          </text>
          <text
            x={padding.left - 8}
            y={centerY + 3}
            fill="#64748b"
            fontSize="9"
            fontFamily="monospace"
            textAnchor="end"
          >
            0
          </text>
          <text
            x={padding.left - 8}
            y={scaleY(-params.amplitude) + 3}
            fill="#94a3b8"
            fontSize="9"
            fontFamily="monospace"
            textAnchor="end"
          >
            -A
          </text>
          <text
            x={padding.left - 8}
            y={scaleY(-params.amplitude * 2) + 3}
            fill="#94a3b8"
            fontSize="9"
            fontFamily="monospace"
            textAnchor="end"
          >
            -2A
          </text>

          {/* Wave 1 Curve (Cyan #38BDF8) */}
          <path
            d={viewType === 'spatial' ? createSpatialPath('y1') : createTemporalPath('y1')}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.8"
            opacity="0.85"
          />

          {/* Wave 2 Curve (Purple #A78BFA) */}
          <path
            d={viewType === 'spatial' ? createSpatialPath('y2') : createTemporalPath('y2')}
            fill="none"
            stroke="#a78bfa"
            strokeWidth="1.8"
            opacity="0.85"
          />

          {/* Resultant Wave Curve (Emerald #34D399 / Yellow #FBBF24) */}
          <path
            d={
              viewType === 'spatial'
                ? createSpatialPath('yResultant')
                : createTemporalPath('yResultant')
            }
            fill="none"
            stroke="#34d399"
            strokeWidth="3.0"
          />

          {/* Current Probe Marker in Spatial View */}
          {viewType === 'spatial' && (
            <g>
              <line
                x1={padding.left + (params.probePoint.x / (params.fieldWidthMeters || 10)) * plotW}
                y1={padding.top}
                x2={padding.left + (params.probePoint.x / (params.fieldWidthMeters || 10)) * plotW}
                y2={height - padding.bottom}
                stroke="#fbbf24"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <circle
                cx={padding.left + (params.probePoint.x / (params.fieldWidthMeters || 10)) * plotW}
                cy={scaleY(analysis.yResultantInstantaneous)}
                r="5"
                fill="#fbbf24"
              />
              <text
                x={padding.left + (params.probePoint.x / (params.fieldWidthMeters || 10)) * plotW + 6}
                y={padding.top + 12}
                fill="#fbbf24"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                Point P (x = {params.probePoint.x.toFixed(2)}m)
              </text>
            </g>
          )}

          {/* Current Time Cursor in Temporal View */}
          {viewType === 'temporal' && (
            <g>
              <line
                x1={padding.left + 0.5 * plotW}
                y1={padding.top}
                x2={padding.left + 0.5 * plotW}
                y2={height - padding.bottom}
                stroke="#fbbf24"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <circle
                cx={padding.left + 0.5 * plotW}
                cy={scaleY(analysis.yResultantInstantaneous)}
                r="5"
                fill="#fbbf24"
              />
              <text
                x={padding.left + 0.5 * plotW + 6}
                y={padding.top + 12}
                fill="#fbbf24"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                Now (t = {time.toFixed(2)}s)
              </text>
            </g>
          )}

          {/* X Axis Label */}
          <text
            x={width / 2}
            y={height - 8}
            fill="#94a3b8"
            fontSize="10"
            fontFamily="sans-serif"
            textAnchor="middle"
          >
            {viewType === 'spatial'
              ? 'Distance x along wave propagation field (m)'
              : 'Time progression t around current timestamp (s)'}
          </text>
        </svg>
      </div>

      {/* Legend & Instantaneous Values at Point P */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
        <div className="p-2.5 rounded-lg bg-[#07111F] border border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-1.5 rounded-full bg-[#38bdf8]" />
            <span className="text-slate-300 font-medium">Wave 1 Displacement:</span>
          </div>
          <span className="font-mono font-bold text-cyan-300">
            {analysis.y1Instantaneous >= 0 ? '+' : ''}
            {analysis.y1Instantaneous.toFixed(3)}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-[#07111F] border border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-1.5 rounded-full bg-[#a78bfa]" />
            <span className="text-slate-300 font-medium">Wave 2 Displacement:</span>
          </div>
          <span className="font-mono font-bold text-purple-300">
            {analysis.y2Instantaneous >= 0 ? '+' : ''}
            {analysis.y2Instantaneous.toFixed(3)}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-[#07111F] border border-emerald-500/30 flex items-center justify-between ring-1 ring-emerald-500/20">
          <div className="flex items-center gap-2">
            <span className="w-3 h-2 rounded-full bg-[#34d399]" />
            <span className="text-white font-bold">Resultant y_R = y₁ + y₂:</span>
          </div>
          <span className="font-mono font-bold text-emerald-300">
            {analysis.yResultantInstantaneous >= 0 ? '+' : ''}
            {analysis.yResultantInstantaneous.toFixed(3)}
          </span>
        </div>
      </div>
    </div>
  );
};
