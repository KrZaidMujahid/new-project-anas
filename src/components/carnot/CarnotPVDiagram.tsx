/**
 * EQUATION 1 — Carnot P-V Diagram
 * Interactive SVG Pressure-Volume Diagram with:
 * - Clockwise cycle loop with stage curves (Isothermal & Adiabatic)
 * - Shaded enclosed area representing net work W_net = ∮ P dV
 * - States A, B, C, D markers with tooltips and labels
 * - Real-time animated cursor (V(t), P(t)) tracing the active stage
 * - Isotherm background curves for T_H and T_C
 * - Direction arrows along the curves
 * - Precise physical scales with units (kPa vs Liters)
 */

import React, { useState } from 'react';
import {
  CarnotCycleResults,
  InstantaneousEngineState,
  CarnotParameters,
} from '../../physics/carnot/types';
import { generatePVPath } from '../../physics/carnot/model';
import { Activity, Info, Eye, Layers } from 'lucide-react';

interface CarnotPVDiagramProps {
  cycle: CarnotCycleResults;
  instantState: InstantaneousEngineState;
  params: CarnotParameters;
}

export const CarnotPVDiagram: React.FC<CarnotPVDiagramProps> = ({
  cycle,
  instantState,
  params,
}) => {
  const [showIsotherms, setShowIsotherms] = useState(true);
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  // SVG canvas dimensions
  const svgWidth = 520;
  const svgHeight = 360;
  const padding = { top: 30, right: 30, bottom: 45, left: 65 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  // Domain and Range
  // Volume: from 0.8 * V_A to 1.15 * V_C
  const vMin = Math.max(0, cycle.states.A.volumeL * 0.7);
  const vMax = cycle.states.C.volumeL * 1.12;

  // Pressure: from 0.7 * P_C to 1.15 * P_A
  const pMin = Math.max(0, cycle.states.C.pressureKPa * 0.6);
  const pMax = cycle.states.A.pressureKPa * 1.15;

  // Coordinate transforms
  const scaleX = (v: number) =>
    padding.left + ((v - vMin) / (vMax - vMin)) * graphWidth;
  const scaleY = (p: number) =>
    padding.top + graphHeight - ((p - pMin) / (pMax - pMin)) * graphHeight;

  // Generate curve sampled points
  const paths = generatePVPath(cycle, 50);

  // Convert points to SVG path string
  const toSvgPath = (pts: { volumeL: number; pressureKPa: number }[]) => {
    return pts
      .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(pt.volumeL).toFixed(1)} ${scaleY(pt.pressureKPa).toFixed(1)}`)
      .join(' ');
  };

  const path1 = toSvgPath(paths.stage1);
  const path2 = toSvgPath(paths.stage2);
  const path3 = toSvgPath(paths.stage3);
  const path4 = toSvgPath(paths.stage4);

  // Enclosed cycle polygon path
  const closedCyclePath = `${path1} L ${path2.replace('M', '')} L ${path3.replace('M', '')} L ${path4.replace('M', '')} Z`;

  // Extended Isotherm Curves for visualization across full volume range
  const isothermHPoints: string[] = [];
  const isothermCPoints: string[] = [];
  const numIsoSamples = 60;
  for (let i = 0; i <= numIsoSamples; i++) {
    const v = vMin + (i / numIsoSamples) * (vMax - vMin);
    if (v > 0) {
      // P = n R T / V
      const pH = ((params.moles * cycle.rUniversal * params.tHotK) / (v * 1e-3)) / 1000;
      const pC = ((params.moles * cycle.rUniversal * params.tColdK) / (v * 1e-3)) / 1000;
      if (pH <= pMax * 1.3 && pH >= pMin) {
        isothermHPoints.push(`${isothermHPoints.length === 0 ? 'M' : 'L'} ${scaleX(v).toFixed(1)} ${scaleY(pH).toFixed(1)}`);
      }
      if (pC <= pMax * 1.3 && pC >= pMin) {
        isothermCPoints.push(`${isothermCPoints.length === 0 ? 'M' : 'L'} ${scaleX(v).toFixed(1)} ${scaleY(pC).toFixed(1)}`);
      }
    }
  }

  // Ticks calculation
  const vTickCount = 5;
  const pTickCount = 5;
  const vTicks = Array.from({ length: vTickCount + 1 }, (_, i) => vMin + (i / vTickCount) * (vMax - vMin));
  const pTicks = Array.from({ length: pTickCount + 1 }, (_, i) => pMin + (i / pTickCount) * (pMax - pMin));

  // Current operating point coordinates
  const curX = scaleX(instantState.volumeL);
  const curY = scaleY(instantState.pressureKPa);

  return (
    <div className="bg-[#102740] border border-[#29445F] rounded-xl p-5 shadow-xl flex flex-col justify-between">
      {/* Header & Controls */}
      <div className="flex items-center justify-between pb-3 border-b border-[#29445F]/70">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#38BDF8]" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Indicator Diagram: Pressure–Volume (P–V)
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowIsotherms((v) => !v)}
            className={`text-xs px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
              showIsotherms
                ? 'bg-[#16334F] text-[#38BDF8] border border-[#38BDF8]/40'
                : 'bg-[#0B1F36] text-[#AFC2D8] border border-[#29445F]'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Isotherms</span>
          </button>
        </div>
      </div>

      {/* SVG Diagram */}
      <div className="relative w-full aspect-[4/3] max-h-[360px] my-2 flex items-center justify-center">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full select-none"
        >
          <defs>
            {/* Cycle Area Shading Pattern */}
            <linearGradient id="pvCycleGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4ADE80" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.12" />
            </linearGradient>

            {/* Marker Glow Filter */}
            <filter id="activePointGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {vTicks.map((v, i) => (
            <line
              key={`vtick-grid-${i}`}
              x1={scaleX(v)}
              y1={padding.top}
              x2={scaleX(v)}
              y2={padding.top + graphHeight}
              stroke="#16334F"
              strokeDasharray="2 3"
              strokeWidth="1"
            />
          ))}

          {pTicks.map((p, i) => (
            <line
              key={`ptick-grid-${i}`}
              x1={padding.left}
              y1={scaleY(p)}
              x2={padding.left + graphWidth}
              y2={scaleY(p)}
              stroke="#16334F"
              strokeDasharray="2 3"
              strokeWidth="1"
            />
          ))}

          {/* Background Isotherm Curves */}
          {showIsotherms && (
            <g opacity="0.6">
              {isothermHPoints.length > 0 && (
                <path
                  d={isothermHPoints.join(' ')}
                  fill="none"
                  stroke="#F97316"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                />
              )}
              {isothermCPoints.length > 0 && (
                <path
                  d={isothermCPoints.join(' ')}
                  fill="none"
                  stroke="#60A5FA"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                />
              )}
              {/* Curve Labels */}
              <text
                x={padding.left + graphWidth - 8}
                y={scaleY(isothermHPoints.length ? ((params.moles * cycle.rUniversal * params.tHotK) / ((vMax * 0.95) * 1e-3)) / 1000 : 0) - 6}
                textAnchor="end"
                fill="#FB923C"
                fontSize="9"
                fontFamily="monospace"
              >
                Isotherm T_H ({params.tHotK} K)
              </text>
              <text
                x={padding.left + graphWidth - 8}
                y={scaleY(isothermCPoints.length ? ((params.moles * cycle.rUniversal * params.tColdK) / ((vMax * 0.95) * 1e-3)) / 1000 : 0) - 6}
                textAnchor="end"
                fill="#60A5FA"
                fontSize="9"
                fontFamily="monospace"
              >
                Isotherm T_C ({params.tColdK} K)
              </text>
            </g>
          )}

          {/* Enclosed Work Area ∮ P dV */}
          <path
            d={closedCyclePath}
            fill="url(#pvCycleGradient)"
            stroke="none"
          />

          {/* Stage 1: Isothermal Expansion A -> B (Orange) */}
          <path
            d={path1}
            fill="none"
            stroke="#F97316"
            strokeWidth={instantState.currentStage === 1 ? 4 : 2.5}
            strokeLinecap="round"
          />

          {/* Stage 2: Adiabatic Expansion B -> C (Cyan/Green) */}
          <path
            d={path2}
            fill="none"
            stroke="#22D3EE"
            strokeWidth={instantState.currentStage === 2 ? 4 : 2.5}
            strokeLinecap="round"
          />

          {/* Stage 3: Isothermal Compression C -> D (Blue) */}
          <path
            d={path3}
            fill="none"
            stroke="#60A5FA"
            strokeWidth={instantState.currentStage === 3 ? 4 : 2.5}
            strokeLinecap="round"
          />

          {/* Stage 4: Adiabatic Compression D -> A (Purple/Pink) */}
          <path
            d={path4}
            fill="none"
            stroke="#C084FC"
            strokeWidth={instantState.currentStage === 4 ? 4 : 2.5}
            strokeLinecap="round"
          />

          {/* Clockwise Direction Arrows on Curves */}
          {/* Arrow on Stage 1 (midpoint) */}
          {paths.stage1.length > 25 && (
            <g transform={`translate(${scaleX(paths.stage1[25].volumeL)}, ${scaleY(paths.stage1[25].pressureKPa)})`}>
              <polygon points="-4,-4 5,0 -4,4" fill="#F97316" transform="rotate(25)" />
            </g>
          )}

          {/* Arrow on Stage 2 (midpoint) */}
          {paths.stage2.length > 25 && (
            <g transform={`translate(${scaleX(paths.stage2[25].volumeL)}, ${scaleY(paths.stage2[25].pressureKPa)})`}>
              <polygon points="-4,-4 5,0 -4,4" fill="#22D3EE" transform="rotate(45)" />
            </g>
          )}

          {/* Arrow on Stage 3 (midpoint) */}
          {paths.stage3.length > 25 && (
            <g transform={`translate(${scaleX(paths.stage3[25].volumeL)}, ${scaleY(paths.stage3[25].pressureKPa)})`}>
              <polygon points="4,-4 -5,0 4,4" fill="#60A5FA" transform="rotate(25)" />
            </g>
          )}

          {/* Arrow on Stage 4 (midpoint) */}
          {paths.stage4.length > 25 && (
            <g transform={`translate(${scaleX(paths.stage4[25].volumeL)}, ${scaleY(paths.stage4[25].pressureKPa)})`}>
              <polygon points="4,-4 -5,0 4,4" fill="#C084FC" transform="rotate(45)" />
            </g>
          )}

          {/* Coordinate Axes */}
          {/* Y Axis (Pressure) */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={padding.top + graphHeight}
            stroke="#94A3B8"
            strokeWidth="1.5"
          />
          {/* X Axis (Volume) */}
          <line
            x1={padding.left}
            y1={padding.top + graphHeight}
            x2={padding.left + graphWidth}
            y2={padding.top + graphHeight}
            stroke="#94A3B8"
            strokeWidth="1.5"
          />

          {/* Axis Labels */}
          <text
            x={padding.left - 10}
            y={padding.top - 12}
            textAnchor="end"
            fill="#F1F5F9"
            fontSize="11"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            P (kPa)
          </text>
          <text
            x={padding.left + graphWidth + 5}
            y={padding.top + graphHeight + 16}
            textAnchor="start"
            fill="#F1F5F9"
            fontSize="11"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            V (L)
          </text>

          {/* Ticks and values */}
          {vTicks.map((v, i) => (
            <g key={`vtick-val-${i}`} transform={`translate(${scaleX(v)}, ${padding.top + graphHeight})`}>
              <line x1="0" y1="0" x2="0" y2="4" stroke="#94A3B8" strokeWidth="1" />
              <text x="0" y="16" fill="#94A3B8" fontSize="9" textAnchor="middle" fontFamily="monospace">
                {v.toFixed(1)}
              </text>
            </g>
          ))}

          {pTicks.map((p, i) => (
            <g key={`ptick-val-${i}`} transform={`translate(${padding.left}, ${scaleY(p)})`}>
              <line x1="-4" y1="0" x2="0" y2="0" stroke="#94A3B8" strokeWidth="1" />
              <text x="-8" y="3" fill="#94A3B8" fontSize="9" textAnchor="end" fontFamily="monospace">
                {p >= 1000 ? (p / 1000).toFixed(1) + 'k' : p.toFixed(0)}
              </text>
            </g>
          ))}

          {/* State Markers: A, B, C, D */}
          {(['A', 'B', 'C', 'D'] as const).map((st) => {
            const state = cycle.states[st];
            const sx = scaleX(state.volumeL);
            const sy = scaleY(state.pressureKPa);
            const isHovered = hoveredState === st;
            const isCurrent = instantState.currentStateId === st;

            return (
              <g
                key={`state-node-${st}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredState(st)}
                onMouseLeave={() => setHoveredState(null)}
              >
                <circle
                  cx={sx}
                  cy={sy}
                  r={isCurrent ? 7 : isHovered ? 6 : 5}
                  fill={st === 'A' || st === 'B' ? '#F97316' : '#60A5FA'}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="transition-all"
                />
                {/* State Label */}
                <text
                  x={st === 'A' || st === 'D' ? sx - 10 : sx + 10}
                  y={st === 'A' || st === 'B' ? sy - 8 : sy + 14}
                  textAnchor={st === 'A' || st === 'D' ? 'end' : 'start'}
                  fill="#FFFFFF"
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {st}
                </text>
              </g>
            );
          })}

          {/* Moving Operating Point Cursor (V(t), P(t)) */}
          <g transform={`translate(${curX}, ${curY})`} filter="url(#activePointGlow)">
            <circle cx="0" cy="0" r="8" fill="#4ADE80" opacity="0.3" className="animate-ping" />
            <circle cx="0" cy="0" r="5" fill="#4ADE80" stroke="#FFFFFF" strokeWidth="2" />
          </g>
        </svg>
      </div>

      {/* Diagram Legend & Enclosed Area Stat */}
      <div className="pt-2 border-t border-[#29445F]/70 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[#AFC2D8]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]"></span>
            <span>1: Isothermal (T_H)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22D3EE]"></span>
            <span>2: Adiabatic</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#60A5FA]"></span>
            <span>3: Isothermal (T_C)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C084FC]"></span>
            <span>4: Adiabatic</span>
          </span>
        </div>

        <div className="text-emerald-400 font-bold">
          Enclosed Area = W_net = {cycle.netWorkJ.toFixed(0)} J
        </div>
      </div>
    </div>
  );
};
