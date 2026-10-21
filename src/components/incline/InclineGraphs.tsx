/**
 * EQUATION 1 — Inclined Plane Kinematic & Dynamic Graphs
 * Responsive SVG plots for Position s(t), Velocity v(t), Acceleration a(t),
 * Net Force ΣF(t), and Energy vs Time with synchronized timeline cursor.
 */

import React, { useState, useMemo } from 'react';
import { InclineSample } from '../../physics/incline/types';
import { LineChart, Layers, Zap } from 'lucide-react';

interface InclineGraphsProps {
  samples: InclineSample[];
  currentTime: number;
}

type InclineGraphTab = 'position' | 'velocity' | 'accel' | 'force' | 'energy';

export const InclineGraphs: React.FC<InclineGraphsProps> = ({
  samples,
  currentTime,
}) => {
  const [activeTab, setActiveTab] = useState<InclineGraphTab>('position');

  const svgWidth = 460;
  const svgHeight = 175;
  const padding = { top: 16, right: 20, bottom: 28, left: 52 };
  const plotW = svgWidth - padding.left - padding.right;
  const plotH = svgHeight - padding.top - padding.bottom;

  const maxTime = useMemo(() => {
    return samples.length > 0 ? samples[samples.length - 1].time : 8;
  }, [samples]);

  // Current interpolated sample
  const currentSample = useMemo(() => {
    if (samples.length === 0) {
      return {
        position: 0,
        velocity: 0,
        acceleration: 0,
        netForce: 0,
        kineticEnergy: 0,
        potentialEnergy: 0,
        mechanicalEnergy: 0,
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

  const generatePlot = (
    accessor: (s: InclineSample) => number,
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
    const scaleY = (val: number) =>
      padding.top + plotH - ((val - yMin) / (yMax - yMin)) * plotH;

    let pathD = '';
    samples.forEach((pt, i) => {
      const px = scaleX(pt.time);
      const py = scaleY(accessor(pt));
      pathD +=
        i === 0
          ? `M ${px.toFixed(1)} ${py.toFixed(1)}`
          : ` L ${px.toFixed(1)} ${py.toFixed(1)}`;
    });

    const zeroY = yMin <= 0 && yMax >= 0 ? scaleY(0) : null;
    const cursorVal = accessor(currentSample as InclineSample);
    const cursor = {
      px: scaleX(currentTime),
      py: scaleY(cursorVal),
      val: cursorVal,
    };

    return { pathD, scaleX, scaleY, yMin, yMax, zeroY, cursor };
  };

  const posPlot = useMemo(
    () => generatePlot((s) => s.position, 0, 10),
    [samples, maxTime, currentSample]
  );
  const velPlot = useMemo(
    () => generatePlot((s) => s.velocity, -2, 2),
    [samples, maxTime, currentSample]
  );
  const accelPlot = useMemo(
    () => generatePlot((s) => s.acceleration, -2, 2),
    [samples, maxTime, currentSample]
  );
  const forcePlot = useMemo(
    () => generatePlot((s) => s.netForce, -5, 5),
    [samples, maxTime, currentSample]
  );

  // Multi-energy plot
  const energyPlots = useMemo(() => {
    if (samples.length < 2) return null;
    let yMax = 0;
    samples.forEach((s) => {
      if (s.mechanicalEnergy > yMax) yMax = s.mechanicalEnergy;
      if (s.potentialEnergy > yMax) yMax = s.potentialEnergy;
      if (s.kineticEnergy > yMax) yMax = s.kineticEnergy;
    });
    yMax = Math.max(10, yMax * 1.15);
    const yMin = 0;

    const scaleX = (t: number) => padding.left + (t / maxTime) * plotW;
    const scaleY = (val: number) =>
      padding.top + plotH - ((val - yMin) / (yMax - yMin)) * plotH;

    let pathEk = '';
    let pathEp = '';
    let pathEtotal = '';

    samples.forEach((pt, i) => {
      const px = scaleX(pt.time);
      const pyEk = scaleY(pt.kineticEnergy);
      const pyEp = scaleY(pt.potentialEnergy);
      const pyTot = scaleY(pt.mechanicalEnergy);

      pathEk += i === 0 ? `M ${px.toFixed(1)} ${pyEk.toFixed(1)}` : ` L ${px.toFixed(1)} ${pyEk.toFixed(1)}`;
      pathEp += i === 0 ? `M ${px.toFixed(1)} ${pyEp.toFixed(1)}` : ` L ${px.toFixed(1)} ${pyEp.toFixed(1)}`;
      pathEtotal += i === 0 ? `M ${px.toFixed(1)} ${pyTot.toFixed(1)}` : ` L ${px.toFixed(1)} ${pyTot.toFixed(1)}`;
    });

    return {
      pathEk,
      pathEp,
      pathEtotal,
      scaleX,
      scaleY,
      yMin,
      yMax,
      cursorX: scaleX(currentTime),
    };
  }, [samples, maxTime, currentTime]);

  const renderSingleGraph = (
    plot: ReturnType<typeof generatePlot>,
    title: string,
    yUnit: string,
    strokeColor: string
  ) => {
    if (!plot) return null;

    const yTicks = [
      plot.yMax,
      plot.yMin + (plot.yMax - plot.yMin) * 0.5,
      plot.yMin,
    ];

    return (
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto bg-[#07090e] border border-slate-800/80 rounded-lg select-none"
      >
        {/* Background grid */}
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
                stroke="rgba(51, 65, 85, 0.3)"
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

        {/* Time X ticks */}
        {[0, maxTime / 2, maxTime].map((tVal, idx) => {
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

        {/* The Curve */}
        <path
          d={plot.pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Cursor line */}
        <line
          x1={plot.cursor.px}
          y1={padding.top}
          x2={plot.cursor.px}
          y2={padding.top + plotH}
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeDasharray="2 2"
          opacity="0.8"
        />

        {/* Cursor dot */}
        <circle
          cx={plot.cursor.px}
          cy={plot.cursor.py}
          r="4"
          fill={strokeColor}
          stroke="#ffffff"
          strokeWidth="1.5"
        />

        {/* Current Value Pill */}
        <text
          x={svgWidth - padding.right}
          y={padding.top + 10}
          textAnchor="end"
          fontSize="11"
          fontWeight="bold"
          fill={strokeColor}
          fontFamily="monospace"
        >
          {title}: {plot.cursor.val.toFixed(2)} {yUnit}
        </text>
      </svg>
    );
  };

  return (
    <div className="bg-[#0b101b] border border-slate-800/90 rounded-lg p-4 select-none space-y-3">
      {/* Header and Tab switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <LineChart className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Kinematic & Dynamic Graphs
          </h2>
        </div>

        <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-md border border-slate-800">
          <button
            onClick={() => setActiveTab('position')}
            className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
              activeTab === 'position'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            s(t)
          </button>
          <button
            onClick={() => setActiveTab('velocity')}
            className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
              activeTab === 'velocity'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            v(t)
          </button>
          <button
            onClick={() => setActiveTab('accel')}
            className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
              activeTab === 'accel'
                ? 'bg-purple-500/20 text-purple-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            a(t)
          </button>
          <button
            onClick={() => setActiveTab('force')}
            className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
              activeTab === 'force'
                ? 'bg-sky-500/20 text-sky-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ΣF(t)
          </button>
          <button
            onClick={() => setActiveTab('energy')}
            className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
              activeTab === 'energy'
                ? 'bg-amber-500/20 text-amber-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            E(t)
          </button>
        </div>
      </div>

      {/* Graph Display */}
      {activeTab === 'position' &&
        renderSingleGraph(posPlot, 'Position s(t)', 'm', '#00e5ff')}
      {activeTab === 'velocity' &&
        renderSingleGraph(velPlot, 'Velocity v(t)', 'm/s', '#22c55e')}
      {activeTab === 'accel' &&
        renderSingleGraph(accelPlot, 'Acceleration a(t)', 'm/s²', '#c084fc')}
      {activeTab === 'force' &&
        renderSingleGraph(forcePlot, 'Net Force ΣF(t)', 'N', '#38bdf8')}

      {activeTab === 'energy' && energyPlots && (
        <div className="space-y-1.5">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto bg-[#07090e] border border-slate-800/80 rounded-lg select-none"
          >
            {/* Grid */}
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

            {/* Y ticks */}
            {[energyPlots.yMax, energyPlots.yMax / 2, 0].map((val, idx) => {
              const y = energyPlots.scaleY(val);
              return (
                <g key={idx}>
                  <line
                    x1={padding.left - 4}
                    y1={y}
                    x2={padding.left + plotW}
                    y2={y}
                    stroke="rgba(51, 65, 85, 0.3)"
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
                    {val.toFixed(0)}J
                  </text>
                </g>
              );
            })}

            {/* Curves */}
            <path
              d={energyPlots.pathEk}
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
            />
            <path
              d={energyPlots.pathEp}
              fill="none"
              stroke="#00e5ff"
              strokeWidth="2"
            />
            <path
              d={energyPlots.pathEtotal}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="4 3"
            />

            {/* Cursor */}
            <line
              x1={energyPlots.cursorX}
              y1={padding.top}
              x2={energyPlots.cursorX}
              y2={padding.top + plotH}
              stroke="#ffffff"
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
          </svg>

          {/* Legend */}
          <div className="flex items-center justify-between text-[10px] font-mono px-1 text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2.5 h-0.5 bg-emerald-400 inline-block"></span>
              Ek: {currentSample.kineticEnergy.toFixed(1)}J
            </span>
            <span className="flex items-center gap-1 text-cyan-400">
              <span className="w-2.5 h-0.5 bg-cyan-400 inline-block"></span>
              Ep: {currentSample.potentialEnergy.toFixed(1)}J
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <span className="w-2.5 h-0.5 bg-amber-400 inline-block border-b border-dashed"></span>
              Total: {currentSample.mechanicalEnergy.toFixed(1)}J
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
