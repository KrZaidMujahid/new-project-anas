/**
 * EQUATION 1 — Newton's Laws Kinematic & Dynamic Graphs
 * Responsive SVG plots for Force vs Time, Acceleration vs Time,
 * Velocity vs Time, and Position vs Time with synchronized cursor.
 */

import React, { useState, useMemo } from 'react';
import { NewtonSample } from '../../physics/newton/types';
import { LineChart, Layers } from 'lucide-react';

interface NewtonGraphsProps {
  samples: NewtonSample[];
  currentTime: number;
}

type GraphTab = 'force' | 'accel' | 'velocity' | 'position' | 'all';

export const NewtonGraphs: React.FC<NewtonGraphsProps> = ({
  samples,
  currentTime,
}) => {
  const [activeTab, setActiveTab] = useState<GraphTab>('force');

  const svgWidth = 460;
  const svgHeight = 175;
  const padding = { top: 16, right: 20, bottom: 28, left: 52 };
  const plotW = svgWidth - padding.left - padding.right;
  const plotH = svgHeight - padding.top - padding.bottom;

  const maxTime = useMemo(() => {
    return samples.length > 0 ? samples[samples.length - 1].time : 8;
  }, [samples]);

  // Interpolated cursor values at currentTime
  const currentSample = useMemo(() => {
    if (samples.length === 0) {
      return { position: 0, velocity: 0, acceleration: 0, netForce: 0, time: 0 };
    }
    for (let i = 0; i < samples.length - 1; i++) {
      if (samples[i + 1].time >= currentTime) {
        return samples[i];
      }
    }
    return samples[samples.length - 1];
  }, [samples, currentTime]);

  // Helper to generate a single plot path and domain
  const generatePlot = (
    accessor: (s: NewtonSample) => number,
    minBound: number,
    maxBound: number
  ) => {
    if (samples.length < 2) return null;

    let yMin = Infinity;
    let yMax = -Infinity;

    samples.forEach((s) => {
      const v = accessor(s);
      if (v < yMin) yMin = v;
      if (v > yMax) yMax = v;
    });

    // Add breathing room
    yMin = Math.min(yMin, minBound);
    yMax = Math.max(yMax, maxBound);
    if (yMin === yMax) {
      yMin -= 1;
      yMax += 1;
    }
    const span = yMax - yMin;
    yMin -= span * 0.08;
    yMax += span * 0.08;

    const scaleX = (t: number) => padding.left + (t / maxTime) * plotW;
    const scaleY = (val: number) => padding.top + plotH - ((val - yMin) / (yMax - yMin)) * plotH;

    let pathD = '';
    samples.forEach((pt, i) => {
      const px = scaleX(pt.time);
      const py = scaleY(accessor(pt));
      pathD += i === 0 ? `M ${px.toFixed(1)} ${py.toFixed(1)}` : ` L ${px.toFixed(1)} ${py.toFixed(1)}`;
    });

    const zeroY = yMin <= 0 && yMax >= 0 ? scaleY(0) : null;
    const cursorVal = accessor(currentSample as NewtonSample);
    const cursor = {
      px: scaleX(currentTime),
      py: scaleY(cursorVal),
      val: cursorVal,
    };

    return { pathD, scaleX, scaleY, yMin, yMax, zeroY, cursor };
  };

  const forcePlot = useMemo(() => generatePlot((s) => s.netForce, -5, 5), [samples, maxTime, currentSample]);
  const accelPlot = useMemo(() => generatePlot((s) => s.acceleration, -2, 2), [samples, maxTime, currentSample]);
  const velPlot = useMemo(() => generatePlot((s) => s.velocity, -2, 2), [samples, maxTime, currentSample]);
  const posPlot = useMemo(() => generatePlot((s) => s.position, 0, 5), [samples, maxTime, currentSample]);

  const renderSingleGraph = (
    title: string,
    unit: string,
    plot: ReturnType<typeof generatePlot>,
    color: string
  ) => {
    if (!plot) return null;
    return (
      <div className="relative w-full bg-[#07090e] border border-slate-800/80 rounded-md overflow-hidden">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto block select-none">
          {/* Grid lines */}
          <line x1={padding.left} y1={padding.top} x2={svgWidth - padding.right} y2={padding.top} stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
          <line x1={padding.left} y1={padding.top + plotH / 2} x2={svgWidth - padding.right} y2={padding.top + plotH / 2} stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
          <line x1={padding.left} y1={padding.top + plotH} x2={svgWidth - padding.right} y2={padding.top + plotH} stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />

          {/* Zero reference line */}
          {plot.zeroY !== null && (
            <line
              x1={padding.left}
              y1={plot.zeroY}
              x2={svgWidth - padding.right}
              y2={plot.zeroY}
              stroke="rgba(56, 189, 248, 0.35)"
              strokeDasharray="2 2"
              strokeWidth="1"
            />
          )}

          {/* Axes */}
          <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + plotH} stroke="rgba(148, 163, 184, 0.4)" strokeWidth="1" />
          <line x1={padding.left} y1={padding.top + plotH} x2={svgWidth - padding.right} y2={padding.top + plotH} stroke="rgba(148, 163, 184, 0.4)" strokeWidth="1" />

          {/* Y Axis tick labels */}
          <text x={padding.left - 6} y={padding.top + 4} fill="#94a3b8" fontSize="9" fontFamily="JetBrains Mono" textAnchor="end">
            {plot.yMax.toFixed(1)}
          </text>
          <text x={padding.left - 6} y={padding.top + plotH / 2 + 3} fill="#94a3b8" fontSize="9" fontFamily="JetBrains Mono" textAnchor="end">
            {((plot.yMax + plot.yMin) / 2).toFixed(1)}
          </text>
          <text x={padding.left - 6} y={padding.top + plotH} fill="#94a3b8" fontSize="9" fontFamily="JetBrains Mono" textAnchor="end">
            {plot.yMin.toFixed(1)}
          </text>

          {/* X Axis tick labels */}
          <text x={padding.left} y={padding.top + plotH + 16} fill="#94a3b8" fontSize="9" fontFamily="JetBrains Mono" textAnchor="start">
            0.0 s
          </text>
          <text x={(padding.left + svgWidth - padding.right) / 2} y={padding.top + plotH + 16} fill="#94a3b8" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">
            {(maxTime / 2).toFixed(1)} s
          </text>
          <text x={svgWidth - padding.right} y={padding.top + plotH + 16} fill="#94a3b8" fontSize="9" fontFamily="JetBrains Mono" textAnchor="end">
            {maxTime.toFixed(1)} s
          </text>

          {/* Path curve */}
          <path d={plot.pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />

          {/* Synchronized simulation time cursor */}
          <line x1={plot.cursor.px} y1={padding.top} x2={plot.cursor.px} y2={padding.top + plotH} stroke="rgba(0, 229, 255, 0.45)" strokeDasharray="2 2" strokeWidth="1" />
          <circle cx={plot.cursor.px} cy={plot.cursor.py} r="4.5" fill="#ffffff" stroke="#00e5ff" strokeWidth="2" />
        </svg>

        <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#0b101b]/90 border border-slate-700/80 rounded text-[10px] font-mono" style={{ color }}>
          {title}: {plot.cursor.val.toFixed(2)} {unit}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#0b101b] border border-slate-800/90 rounded-lg p-4 select-none space-y-3">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <LineChart className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Kinematic & Dynamic Graphs
          </h2>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-[#07090e] border border-slate-800 rounded p-0.5 text-[11px] font-mono">
          <button
            onClick={() => setActiveTab('force')}
            className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
              activeTab === 'force'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            F_net(t)
          </button>

          <button
            onClick={() => setActiveTab('accel')}
            className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
              activeTab === 'accel'
                ? 'bg-yellow-500/20 text-yellow-300 font-semibold border border-yellow-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            a(t)
          </button>

          <button
            onClick={() => setActiveTab('velocity')}
            className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
              activeTab === 'velocity'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            v(t)
          </button>

          <button
            onClick={() => setActiveTab('position')}
            className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
              activeTab === 'position'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            x(t)
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Stack all 4 graphs"
          >
            <Layers className="w-3 h-3" />
            <span>Stack</span>
          </button>
        </div>
      </div>

      {activeTab === 'force' && renderSingleGraph('Net Force F_net', 'N', forcePlot, '#10b981')}
      {activeTab === 'accel' && renderSingleGraph('Acceleration a', 'm/s²', accelPlot, '#eab308')}
      {activeTab === 'velocity' && renderSingleGraph('Velocity v', 'm/s', velPlot, '#00e5ff')}
      {activeTab === 'position' && renderSingleGraph('Position x', 'm', posPlot, '#38bdf8')}

      {activeTab === 'all' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[480px] overflow-y-auto pr-1">
          {renderSingleGraph('Net Force F_net', 'N', forcePlot, '#10b981')}
          {renderSingleGraph('Acceleration a', 'm/s²', accelPlot, '#eab308')}
          {renderSingleGraph('Velocity v', 'm/s', velPlot, '#00e5ff')}
          {renderSingleGraph('Position x', 'm', posPlot, '#38bdf8')}
        </div>
      )}
    </div>
  );
};
