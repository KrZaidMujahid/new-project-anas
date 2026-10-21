/**
 * EQUATION 1 — Circular Motion Kinematic Graphs
 * Responsive SVG plots for Cartesian position x(t)/y(t), velocity components vx(t)/vy(t),
 * acceleration components ax(t)/ay(t), constant speed v(t), centripetal acceleration ac(t),
 * and angular position θ(t). Driven strictly by simulation state with synchronized cursor.
 */

import React, { useState, useMemo } from 'react';
import { CircularSample } from '../../physics/circular/types';
import { LineChart } from 'lucide-react';

interface CircularGraphsProps {
  samples: CircularSample[];
  currentTime: number;
}

type CircularGraphTab =
  | 'position'
  | 'velocity'
  | 'accel'
  | 'speed'
  | 'centripetal'
  | 'angle';

export const CircularGraphs: React.FC<CircularGraphsProps> = ({
  samples,
  currentTime,
}) => {
  const [activeTab, setActiveTab] = useState<CircularGraphTab>('position');

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
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        ax: 0,
        ay: 0,
        speed: 0,
        centripetalAccel: 0,
        thetaRad: 0,
        thetaDeg: 0,
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

  // Multi-curve plot generator
  const createMultiPlot = (
    seriesList: {
      id: string;
      label: string;
      accessor: (s: CircularSample) => number;
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
        currentVal: s.accessor(currentSample as CircularSample),
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

  // 1. Position Plots: x(t) and y(t)
  const posPlot = useMemo(
    () =>
      createMultiPlot(
        [
          { id: 'x', label: 'x(t) = r cos(θ)', accessor: (s) => s.x, color: '#38BDF8' },
          { id: 'y', label: 'y(t) = r sin(θ)', accessor: (s) => s.y, color: '#A78BFA' },
        ],
        -3,
        3
      ),
    [samples, maxTime, currentSample]
  );

  // 2. Velocity Plots: vx(t) and vy(t)
  const velPlot = useMemo(
    () =>
      createMultiPlot(
        [
          { id: 'vx', label: 'vx(t) = -rω sin(θ)', accessor: (s) => s.vx, color: '#34D399' },
          { id: 'vy', label: 'vy(t) = rω cos(θ)', accessor: (s) => s.vy, color: '#06B6D4' },
        ],
        -5,
        5
      ),
    [samples, maxTime, currentSample]
  );

  // 3. Acceleration Plots: ax(t) and ay(t)
  const accelPlot = useMemo(
    () =>
      createMultiPlot(
        [
          { id: 'ax', label: 'ax(t) = -rω² cos(θ)', accessor: (s) => s.ax, color: '#F59E0B' },
          { id: 'ay', label: 'ay(t) = -rω² sin(θ)', accessor: (s) => s.ay, color: '#FB923C' },
        ],
        -10,
        10
      ),
    [samples, maxTime, currentSample]
  );

  // 4. Speed Plot: v(t) = constant
  const speedPlot = useMemo(
    () =>
      createMultiPlot(
        [{ id: 'v', label: 'Linear Speed v = r|ω| [Constant]', accessor: (s) => s.speed, color: '#34D399' }],
        0,
        10
      ),
    [samples, maxTime, currentSample]
  );

  // 5. Centripetal Accel Plot: a_c(t) = constant
  const centripetalPlot = useMemo(
    () =>
      createMultiPlot(
        [{ id: 'ac', label: 'Centripetal a_c = rω² [Constant]', accessor: (s) => s.centripetalAccel, color: '#F59E0B' }],
        0,
        20
      ),
    [samples, maxTime, currentSample]
  );

  // 6. Angular Position Plot: θ(t)
  const anglePlot = useMemo(
    () =>
      createMultiPlot(
        [{ id: 'theta', label: 'Angular Position θ(t)', accessor: (s) => s.thetaRad, color: '#38BDF8' }],
        0,
        15
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

          {/* Curves */}
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
            Kinematic & Dynamic Waveform Graphs
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-1 bg-[#07111F] p-1 rounded-lg border border-[#26364D]">
          <button
            onClick={() => setActiveTab('position')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer ${
              activeTab === 'position'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            x(t), y(t)
          </button>
          <button
            onClick={() => setActiveTab('velocity')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer ${
              activeTab === 'velocity'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            vx(t), vy(t)
          </button>
          <button
            onClick={() => setActiveTab('accel')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer ${
              activeTab === 'accel'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ax(t), ay(t)
          </button>
          <button
            onClick={() => setActiveTab('speed')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer ${
              activeTab === 'speed'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Speed v (const)
          </button>
          <button
            onClick={() => setActiveTab('centripetal')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer ${
              activeTab === 'centripetal'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            a_c (const)
          </button>
          <button
            onClick={() => setActiveTab('angle')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer ${
              activeTab === 'angle'
                ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            θ(t) Angle
          </button>
        </div>
      </div>

      {/* Active Graph Plot Display */}
      {activeTab === 'position' && renderPlotSvg(posPlot, 'Cartesian Position vs Time', 'm')}
      {activeTab === 'velocity' && renderPlotSvg(velPlot, 'Velocity Components vs Time', 'm/s')}
      {activeTab === 'accel' && renderPlotSvg(accelPlot, 'Acceleration Components vs Time', 'm/s²')}
      {activeTab === 'speed' && renderPlotSvg(speedPlot, 'Linear Speed vs Time', 'm/s')}
      {activeTab === 'centripetal' && renderPlotSvg(centripetalPlot, 'Centripetal Acceleration vs Time', 'm/s²')}
      {activeTab === 'angle' && renderPlotSvg(anglePlot, 'Angular Position vs Time', 'rad')}
    </div>
  );
};
