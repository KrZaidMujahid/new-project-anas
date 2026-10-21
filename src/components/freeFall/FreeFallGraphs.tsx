/**
 * EQUATION 1 — Free Fall Kinematic Graphs
 * Dynamic SVG plots for y(t), v(t), and a(t) with synchronized real-time cursor.
 */

import React, { useState, useMemo } from 'react';
import {
  FreeFallAnalytical,
  FreeFallParameters,
  FreeFallSample,
  FreeFallState,
} from '../../physics/freeFall/types';
import { LineChart, Layers } from 'lucide-react';

interface FreeFallGraphsProps {
  parameters: FreeFallParameters;
  analytical: FreeFallAnalytical;
  currentState: FreeFallState;
  trajectorySamples: FreeFallSample[];
}

type GraphTab = 'height' | 'velocity' | 'acceleration' | 'all';

export const FreeFallGraphs: React.FC<FreeFallGraphsProps> = ({
  parameters,
  analytical,
  currentState,
  trajectorySamples,
}) => {
  const [activeTab, setActiveTab] = useState<GraphTab>('height');
  const [hoverData, setHoverData] = useState<{ t: number; val: number; label: string } | null>(null);

  // Single graph dimensions
  const svgWidth = 460;
  const svgHeight = 175;
  const padding = { top: 16, right: 20, bottom: 28, left: 52 };
  const plotW = svgWidth - padding.left - padding.right;
  const plotH = svgHeight - padding.top - padding.bottom;

  // Max time for domain
  const maxTime = useMemo(() => {
    return isFinite(analytical.timeToGround) && analytical.timeToGround > 0
      ? analytical.timeToGround
      : 5;
  }, [analytical]);

  // Graph 1: Height y(t)
  const heightPlot = useMemo(() => {
    if (trajectorySamples.length < 2) return null;
    const yMin = 0;
    const yMax = Math.max(5, analytical.maxHeight * 1.08);

    const scaleX = (t: number) => padding.left + (t / maxTime) * plotW;
    const scaleY = (y: number) => padding.top + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

    let pathD = '';
    trajectorySamples.forEach((pt, i) => {
      const px = scaleX(pt.time);
      const py = scaleY(pt.height);
      pathD += (i === 0 ? `M ${px.toFixed(1)} ${py.toFixed(1)}` : ` L ${px.toFixed(1)} ${py.toFixed(1)}`);
    });

    const cursor = {
      px: scaleX(currentState.time),
      py: scaleY(currentState.height),
      val: currentState.height,
    };

    return { pathD, scaleX, scaleY, yMin, yMax, cursor };
  }, [trajectorySamples, analytical, maxTime, currentState, plotW, plotH]);

  // Graph 2: Velocity v(t)
  const velocityPlot = useMemo(() => {
    if (trajectorySamples.length < 2) return null;
    // v(t) can range from positive (if thrown up) to negative (at impact)
    const minV = Math.min(analytical.finalVelocity, parameters.initialVelocity, -1);
    const maxV = Math.max(parameters.initialVelocity, 0, 1);
    const vMin = minV * 1.1;
    const vMax = maxV * 1.1 + 0.1;

    const scaleX = (t: number) => padding.left + (t / maxTime) * plotW;
    const scaleY = (v: number) => padding.top + plotH - ((v - vMin) / (vMax - vMin)) * plotH;

    let pathD = '';
    trajectorySamples.forEach((pt, i) => {
      const px = scaleX(pt.time);
      const py = scaleY(pt.velocity);
      pathD += (i === 0 ? `M ${px.toFixed(1)} ${py.toFixed(1)}` : ` L ${px.toFixed(1)} ${py.toFixed(1)}`);
    });

    const zeroY = scaleY(0);
    const cursor = {
      px: scaleX(currentState.time),
      py: scaleY(currentState.velocity),
      val: currentState.velocity,
    };

    return { pathD, scaleX, scaleY, vMin, vMax, zeroY, cursor };
  }, [trajectorySamples, analytical, parameters, maxTime, currentState, plotW, plotH]);

  // Graph 3: Acceleration a(t) = -g
  const accelPlot = useMemo(() => {
    if (trajectorySamples.length < 2) return null;
    const gVal = parameters.gravity;
    const aMin = -Math.max(15, gVal * 1.25);
    const aMax = 2;

    const scaleX = (t: number) => padding.left + (t / maxTime) * plotW;
    const scaleY = (a: number) => padding.top + plotH - ((a - aMin) / (aMax - aMin)) * plotH;

    let pathD = '';
    trajectorySamples.forEach((pt, i) => {
      const px = scaleX(pt.time);
      const py = scaleY(pt.acceleration);
      pathD += (i === 0 ? `M ${px.toFixed(1)} ${py.toFixed(1)}` : ` L ${px.toFixed(1)} ${py.toFixed(1)}`);
    });

    const zeroY = scaleY(0);
    const cursor = {
      px: scaleX(currentState.time),
      py: scaleY(currentState.acceleration),
      val: currentState.acceleration,
    };

    return { pathD, scaleX, scaleY, aMin, aMax, zeroY, cursor };
  }, [trajectorySamples, parameters, maxTime, currentState, plotW, plotH]);

  const renderSingleGraph = (
    title: string,
    yLabel: string,
    unit: string,
    pathD: string,
    yMin: number,
    yMax: number,
    zeroY: number | null,
    cursor: { px: number; py: number; val: number },
    color: string
  ) => {
    return (
      <div className="relative w-full bg-[#07090e] border border-slate-800/80 rounded-md overflow-hidden">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto block select-none">
          {/* Grid lines */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={svgWidth - padding.right}
            y2={padding.top}
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
          />
          <line
            x1={padding.left}
            y1={padding.top + plotH / 2}
            x2={svgWidth - padding.right}
            y2={padding.top + plotH / 2}
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
          />
          <line
            x1={padding.left}
            y1={padding.top + plotH}
            x2={svgWidth - padding.right}
            y2={padding.top + plotH}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1"
          />

          {/* Zero reference dashed line if inside range */}
          {zeroY !== null && zeroY >= padding.top && zeroY <= padding.top + plotH && (
            <line
              x1={padding.left}
              y1={zeroY}
              x2={svgWidth - padding.right}
              y2={zeroY}
              stroke="rgba(56, 189, 248, 0.35)"
              strokeDasharray="2 2"
              strokeWidth="1"
            />
          )}

          {/* Axes */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={padding.top + plotH}
            stroke="rgba(148, 163, 184, 0.4)"
            strokeWidth="1"
          />
          <line
            x1={padding.left}
            y1={padding.top + plotH}
            x2={svgWidth - padding.right}
            y2={padding.top + plotH}
            stroke="rgba(148, 163, 184, 0.4)"
            strokeWidth="1"
          />

          {/* Y Axis tick labels */}
          <text
            x={padding.left - 6}
            y={padding.top + 4}
            fill="#94a3b8"
            fontSize="9"
            fontFamily="JetBrains Mono"
            textAnchor="end"
          >
            {yMax.toFixed(1)}
          </text>
          <text
            x={padding.left - 6}
            y={padding.top + plotH / 2 + 3}
            fill="#94a3b8"
            fontSize="9"
            fontFamily="JetBrains Mono"
            textAnchor="end"
          >
            {((yMax + yMin) / 2).toFixed(1)}
          </text>
          <text
            x={padding.left - 6}
            y={padding.top + plotH}
            fill="#94a3b8"
            fontSize="9"
            fontFamily="JetBrains Mono"
            textAnchor="end"
          >
            {yMin.toFixed(1)}
          </text>

          {/* X Axis tick labels */}
          <text
            x={padding.left}
            y={padding.top + plotH + 16}
            fill="#94a3b8"
            fontSize="9"
            fontFamily="JetBrains Mono"
            textAnchor="start"
          >
            0.0 s
          </text>
          <text
            x={(padding.left + svgWidth - padding.right) / 2}
            y={padding.top + plotH + 16}
            fill="#94a3b8"
            fontSize="9"
            fontFamily="JetBrains Mono"
            textAnchor="middle"
          >
            {(maxTime / 2).toFixed(2)} s
          </text>
          <text
            x={svgWidth - padding.right}
            y={padding.top + plotH + 16}
            fill="#94a3b8"
            fontSize="9"
            fontFamily="JetBrains Mono"
            textAnchor="end"
          >
            {maxTime.toFixed(2)} s
          </text>

          {/* Main analytical line curve */}
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Synchronized simulation time cursor */}
          <line
            x1={cursor.px}
            y1={padding.top}
            x2={cursor.px}
            y2={padding.top + plotH}
            stroke="rgba(0, 229, 255, 0.45)"
            strokeDasharray="2 2"
            strokeWidth="1"
          />
          <circle
            cx={cursor.px}
            cy={cursor.py}
            r="4.5"
            fill="#ffffff"
            stroke="#00e5ff"
            strokeWidth="2"
          />
        </svg>

        {/* Floating corner indicator */}
        <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#0b101b]/90 border border-slate-700/80 rounded text-[10px] font-mono" style={{ color }}>
          {title}: {cursor.val.toFixed(2)} {unit}
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
            Kinematics Graphs
          </h2>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-[#07090e] border border-slate-800 rounded p-0.5 text-[11px] font-mono">
          <button
            onClick={() => setActiveTab('height')}
            className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
              activeTab === 'height'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            y(t)
          </button>

          <button
            onClick={() => setActiveTab('velocity')}
            className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
              activeTab === 'velocity'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            v(t)
          </button>

          <button
            onClick={() => setActiveTab('acceleration')}
            className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
              activeTab === 'acceleration'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            a(t)
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Show all 3 kinematic graphs stacked"
          >
            <Layers className="w-3 h-3" />
            <span>Stack</span>
          </button>
        </div>
      </div>

      {/* Render graph based on active tab */}
      {activeTab === 'height' && heightPlot && (
        <div>
          {renderSingleGraph(
            'Height y(t)',
            'Height y',
            'm',
            heightPlot.pathD,
            heightPlot.yMin,
            heightPlot.yMax,
            null,
            heightPlot.cursor,
            '#10b981'
          )}
          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
            <span>Parabolic Trajectory: y(t) = y₀ + v₀t - ½gt²</span>
            <span className="text-emerald-400">t = {currentState.time.toFixed(2)}s</span>
          </div>
        </div>
      )}

      {activeTab === 'velocity' && velocityPlot && (
        <div>
          {renderSingleGraph(
            'Velocity v(t)',
            'Velocity v',
            'm/s',
            velocityPlot.pathD,
            velocityPlot.vMin,
            velocityPlot.vMax,
            velocityPlot.zeroY,
            velocityPlot.cursor,
            '#00e5ff'
          )}
          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
            <span>Linear Slope -g: v(t) = v₀ - gt</span>
            <span className="text-cyan-400">t = {currentState.time.toFixed(2)}s</span>
          </div>
        </div>
      )}

      {activeTab === 'acceleration' && accelPlot && (
        <div>
          {renderSingleGraph(
            'Acceleration a(t)',
            'Acceleration a',
            'm/s²',
            accelPlot.pathD,
            accelPlot.aMin,
            accelPlot.aMax,
            accelPlot.zeroY,
            accelPlot.cursor,
            '#f59e0b'
          )}
          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
            <span>Constant Gravitational Acceleration: a(t) = -g</span>
            <span className="text-amber-400">t = {currentState.time.toFixed(2)}s</span>
          </div>
        </div>
      )}

      {activeTab === 'all' && (
        <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
          {heightPlot && renderSingleGraph(
            'Height y(t)',
            'Height y',
            'm',
            heightPlot.pathD,
            heightPlot.yMin,
            heightPlot.yMax,
            null,
            heightPlot.cursor,
            '#10b981'
          )}
          {velocityPlot && renderSingleGraph(
            'Velocity v(t)',
            'Velocity v',
            'm/s',
            velocityPlot.pathD,
            velocityPlot.vMin,
            velocityPlot.vMax,
            velocityPlot.zeroY,
            velocityPlot.cursor,
            '#00e5ff'
          )}
          {accelPlot && renderSingleGraph(
            'Acceleration a(t)',
            'Acceleration a',
            'm/s²',
            accelPlot.pathD,
            accelPlot.aMin,
            accelPlot.aMax,
            accelPlot.zeroY,
            accelPlot.cursor,
            '#f59e0b'
          )}
        </div>
      )}
    </div>
  );
};
