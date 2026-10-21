/**
 * EQUATION 1 — Collision & Momentum Kinematic & Dynamic Graphs
 * Responsive SVG plots for Position x(t), Velocity v(t), Momentum p(t),
 * Kinetic Energy K(t), Contact Force F(t), and Cumulative Impulse J(t).
 * Driven strictly by actual physics simulation samples with timeline cursor.
 */

import React, { useState, useMemo } from 'react';
import { CollisionSample } from '../../physics/collision/types';
import { LineChart, Layers } from 'lucide-react';

interface CollisionGraphsProps {
  samples: CollisionSample[];
  currentTime: number;
}

type CollisionGraphTab = 'position' | 'velocity' | 'momentum' | 'energy' | 'force' | 'impulse';

export const CollisionGraphs: React.FC<CollisionGraphsProps> = ({
  samples,
  currentTime,
}) => {
  const [activeTab, setActiveTab] = useState<CollisionGraphTab>('momentum');

  const svgWidth = 560;
  const svgHeight = 210;
  const padding = { top: 20, right: 24, bottom: 32, left: 56 };
  const plotW = svgWidth - padding.left - padding.right;
  const plotH = svgHeight - padding.top - padding.bottom;

  const maxTime = useMemo(() => {
    return samples.length > 0 ? samples[samples.length - 1].time : 6;
  }, [samples]);

  // Current interpolated sample at currentTime
  const currentSample = useMemo(() => {
    if (samples.length === 0) {
      return {
        x1: 0,
        x2: 0,
        v1: 0,
        v2: 0,
        p1: 0,
        p2: 0,
        P_total: 0,
        K1: 0,
        K2: 0,
        K_total: 0,
        contactForce: 0,
        cumulativeImpulse: 0,
        time: 0,
      };
    }
    for (let i = 0; i < samples.length - 1; i++) {
      if (samples[i + 1].time >= currentTime) {
        return samples[i];
      }
    }
    return samples[samples.length - 1];
  }, [samples, currentTime]);

  // General multi-curve plot generator
  const createMultiPlot = (
    seriesList: {
      id: string;
      label: string;
      accessor: (s: CollisionSample) => number;
      color: string;
      dashed?: boolean;
    }[],
    minBound: number,
    maxBound: number
  ) => {
    if (samples.length < 2) return null;

    let yMin = Infinity;
    let yMax = -Infinity;

    seriesList.forEach((s) => {
      samples.forEach((pt) => {
        const v = s.accessor(pt);
        if (v < yMin) yMin = v;
        if (v > yMax) yMax = v;
      });
    });

    yMin = Math.min(yMin, minBound);
    yMax = Math.max(yMax, maxBound);
    if (yMin === yMax) {
      yMin -= 1;
      yMax += 1;
    }
    const span = yMax - yMin;
    yMin -= span * 0.1;
    yMax += span * 0.1;

    const scaleX = (t: number) => padding.left + (t / maxTime) * plotW;
    const scaleY = (val: number) =>
      padding.top + plotH - ((val - yMin) / (yMax - yMin)) * plotH;

    const paths = seriesList.map((s) => {
      let pathD = '';
      samples.forEach((pt, i) => {
        const px = scaleX(pt.time);
        const py = scaleY(s.accessor(pt));
        pathD += i === 0 ? `M ${px.toFixed(1)} ${py.toFixed(1)}` : ` L ${px.toFixed(1)} ${py.toFixed(1)}`;
      });
      return {
        ...s,
        pathD,
        currentVal: s.accessor(currentSample as CollisionSample),
      };
    });

    const zeroY = yMin <= 0 && yMax >= 0 ? scaleY(0) : null;
    const cursorX = scaleX(currentTime);

    return {
      paths,
      scaleX,
      scaleY,
      yMin,
      yMax,
      zeroY,
      cursorX,
    };
  };

  // 1. Position Plots: x1(t), x2(t)
  const posPlot = useMemo(
    () =>
      createMultiPlot(
        [
          { id: 'x1', label: 'Object 1 x₁(t)', accessor: (s) => s.x1, color: '#38BDF8' },
          { id: 'x2', label: 'Object 2 x₂(t)', accessor: (s) => s.x2, color: '#A78BFA' },
        ],
        -2,
        15
      ),
    [samples, maxTime, currentSample]
  );

  // 2. Velocity Plots: v1(t), v2(t)
  const velPlot = useMemo(
    () =>
      createMultiPlot(
        [
          { id: 'v1', label: 'v₁(t)', accessor: (s) => s.v1, color: '#38BDF8' },
          { id: 'v2', label: 'v₂(t)', accessor: (s) => s.v2, color: '#A78BFA' },
        ],
        -5,
        5
      ),
    [samples, maxTime, currentSample]
  );

  // 3. Momentum Plots: p1(t), p2(t), P_total(t)
  const momPlot = useMemo(
    () =>
      createMultiPlot(
        [
          { id: 'p1', label: 'p₁(t)', accessor: (s) => s.p1, color: '#38BDF8' },
          { id: 'p2', label: 'p₂(t)', accessor: (s) => s.p2, color: '#A78BFA' },
          {
            id: 'ptot',
            label: 'P_total(t) [Constant]',
            accessor: (s) => s.P_total,
            color: '#34D399',
            dashed: true,
          },
        ],
        -10,
        10
      ),
    [samples, maxTime, currentSample]
  );

  // 4. Kinetic Energy Plots: K1(t), K2(t), K_total(t)
  const energyPlot = useMemo(
    () =>
      createMultiPlot(
        [
          { id: 'k1', label: 'K₁(t)', accessor: (s) => s.K1, color: '#38BDF8' },
          { id: 'k2', label: 'K₂(t)', accessor: (s) => s.K2, color: '#A78BFA' },
          { id: 'ktot', label: 'K_total(t)', accessor: (s) => s.K_total, color: '#FBBF24', dashed: true },
        ],
        0,
        10
      ),
    [samples, maxTime, currentSample]
  );

  // 5. Contact Force Plot: F_contact(t)
  const forcePlot = useMemo(
    () =>
      createMultiPlot(
        [{ id: 'f', label: 'F_contact(t)', accessor: (s) => s.contactForce, color: '#FB7185' }],
        0,
        50
      ),
    [samples, maxTime, currentSample]
  );

  // 6. Cumulative Impulse Plot: J1(t)
  const impulsePlot = useMemo(
    () =>
      createMultiPlot(
        [{ id: 'j', label: 'Cumulative Impulse J(t)', accessor: (s) => s.cumulativeImpulse, color: '#F59E0B' }],
        -10,
        10
      ),
    [samples, maxTime, currentSample]
  );

  const renderPlotSvg = (
    plot: ReturnType<typeof createMultiPlot>,
    title: string,
    yUnit: string
  ) => {
    if (!plot) return null;

    const yTicks = [
      plot.yMax,
      plot.yMin + (plot.yMax - plot.yMin) * 0.5,
      plot.yMin,
    ];

    return (
      <div className="space-y-2">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto bg-[#07090e] border border-slate-800/80 rounded-lg select-none"
        >
          {/* Grid lines */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={padding.top + plotH}
            stroke="#334155"
            strokeWidth="1"
          />
          <line
            x1={padding.left}
            y1={padding.top + plotH}
            x2={padding.left + plotW}
            y2={padding.top + plotH}
            stroke="#334155"
            strokeWidth="1"
          />

          {/* Zero baseline */}
          {plot.zeroY !== null && (
            <line
              x1={padding.left}
              y1={plot.zeroY}
              x2={padding.left + plotW}
              y2={plot.zeroY}
              stroke="#475569"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          )}

          {/* Y ticks & labels */}
          {yTicks.map((val, idx) => {
            const y = plot.scaleY(val);
            return (
              <g key={idx}>
                <line
                  x1={padding.left - 4}
                  y1={y}
                  x2={padding.left + plotW}
                  y2={y}
                  stroke="rgba(51, 65, 85, 0.25)"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 6}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize="9"
                  fill="#64748b"
                  fontFamily="monospace"
                >
                  {val.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* X ticks */}
          {[0, maxTime / 4, maxTime / 2, (3 * maxTime) / 4, maxTime].map((tVal, idx) => {
            const x = plot.scaleX(tVal);
            return (
              <g key={idx}>
                <text
                  x={x}
                  y={padding.top + plotH + 16}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#64748b"
                  fontFamily="monospace"
                >
                  {tVal.toFixed(1)}s
                </text>
              </g>
            );
          })}

          {/* Render Curve Paths */}
          {plot.paths.map((p) => (
            <path
              key={p.id}
              d={p.pathD}
              fill="none"
              stroke={p.color}
              strokeWidth={p.dashed ? '2.5' : '2'}
              strokeDasharray={p.dashed ? '5 3' : undefined}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Cursor Line */}
          <line
            x1={plot.cursorX}
            y1={padding.top}
            x2={plot.cursorX}
            y2={padding.top + plotH}
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeDasharray="2 2"
            opacity="0.8"
          />

          {/* Active Points on Cursor */}
          {plot.paths.map((p) => {
            const dotY = plot.scaleY(p.currentVal);
            return (
              <circle
                key={`dot-${p.id}`}
                cx={plot.cursorX}
                cy={dotY}
                r="3.5"
                fill={p.color}
                stroke="#07111F"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Title and Units in top right */}
          <text
            x={svgWidth - padding.right}
            y={padding.top + 8}
            textAnchor="end"
            fontSize="10"
            fontWeight="bold"
            fill="#94A3B8"
            fontFamily="monospace"
          >
            {title} [{yUnit}]
          </text>
        </svg>

        {/* Legend with live values */}
        <div className="flex flex-wrap items-center justify-between text-[11px] font-mono px-2 text-slate-300">
          <div className="flex flex-wrap items-center gap-4">
            {plot.paths.map((p) => (
              <span key={p.id} className="flex items-center gap-1.5" style={{ color: p.color }}>
                <span
                  className="w-3 h-0.5 inline-block"
                  style={{
                    backgroundColor: p.color,
                    borderBottom: p.dashed ? '1px dashed' : 'none',
                  }}
                />
                <span>
                  {p.label}: {p.currentVal.toFixed(2)} {yUnit}
                </span>
              </span>
            ))}
          </div>
          <span className="text-[10px] text-slate-500">t = {currentTime.toFixed(2)}s</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#0B1728] border border-[#26364D] rounded-xl p-4 select-none space-y-3 shadow-lg">
      {/* Header & Graph Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-[#26364D]">
        <div className="flex items-center gap-2">
          <LineChart className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#F1F5F9]">
            Kinematic & Dynamic Graphs
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-1 bg-[#07111F] p-1 rounded-lg border border-[#26364D]">
          <button
            onClick={() => setActiveTab('momentum')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer ${
              activeTab === 'momentum'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            p(t) Momentum
          </button>
          <button
            onClick={() => setActiveTab('velocity')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer ${
              activeTab === 'velocity'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            v(t) Velocity
          </button>
          <button
            onClick={() => setActiveTab('energy')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer ${
              activeTab === 'energy'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            K(t) Energy
          </button>
          <button
            onClick={() => setActiveTab('position')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer ${
              activeTab === 'position'
                ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            x(t) Position
          </button>
          <button
            onClick={() => setActiveTab('force')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer ${
              activeTab === 'force'
                ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            F(t) Force
          </button>
          <button
            onClick={() => setActiveTab('impulse')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer ${
              activeTab === 'impulse'
                ? 'bg-yellow-500/20 text-yellow-300 font-bold border border-yellow-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            J(t) Impulse
          </button>
        </div>
      </div>

      {/* Active Graph Plot Display */}
      {activeTab === 'momentum' && renderPlotSvg(momPlot, 'Momentum vs Time', 'kg·m/s')}
      {activeTab === 'velocity' && renderPlotSvg(velPlot, 'Velocity vs Time', 'm/s')}
      {activeTab === 'energy' && renderPlotSvg(energyPlot, 'Kinetic Energy vs Time', 'J')}
      {activeTab === 'position' && renderPlotSvg(posPlot, 'Position vs Time', 'm')}
      {activeTab === 'force' && renderPlotSvg(forcePlot, 'Collision Contact Force vs Time', 'N')}
      {activeTab === 'impulse' && renderPlotSvg(impulsePlot, 'Cumulative Impulse vs Time', 'N·s')}
    </div>
  );
};
