/**
 * EQUATION 1 — Optical Dispersion & Spectrum Analysis Studio
 * Interactive Minimum Deviation Curve δ(i), Cauchy Equation,
 * and Rainbow Physics.
 */

import React, { useMemo } from 'react';
import {
  Sparkles,
  TrendingDown,
  Layers,
  Activity,
  CheckCircle2,
  Eye,
} from 'lucide-react';
import { SnellParameters, PrismOpticsResult } from '../../physics/optics/types';
import { OPTICAL_MEDIA_DATABASE, getEffectiveRefractiveIndex } from '../../physics/optics/opticsModel';

interface DispersionPanelProps {
  params: SnellParameters;
  prismResult: PrismOpticsResult;
  onSetAngle: (angle: number) => void;
}

export const DispersionPanel: React.FC<DispersionPanelProps> = ({
  params,
  prismResult,
  onSetAngle,
}) => {
  const apexDeg = params.prismApexAngleDeg;
  const apexRad = (apexDeg * Math.PI) / 180;
  const n = prismResult.nPrismBase;

  // Generate Minimum Deviation Curve: delta vs i from 20° to 85°
  const curvePoints = useMemo(() => {
    const pts: { i: number; delta: number | null }[] = [];
    for (let iDeg = 20; iDeg <= 85; iDeg += 1) {
      const iRad = (iDeg * Math.PI) / 180;
      const sinR1 = Math.sin(iRad) / n;
      if (sinR1 > 1.0) continue;
      const r1 = Math.asin(sinR1);
      const r2 = apexRad - r1;
      const sinE = n * Math.sin(r2);
      if (sinE > 1.0 || r2 < 0) {
        pts.push({ i: iDeg, delta: null }); // TIR
      } else {
        const eRad = Math.asin(sinE);
        const deltaDeg = iDeg + (eRad * 180) / Math.PI - apexDeg;
        pts.push({ i: iDeg, delta: deltaDeg });
      }
    }
    return pts;
  }, [apexRad, apexDeg, n]);

  // Curve SVG bounds
  const validPts = curvePoints.filter((p) => p.delta !== null) as { i: number; delta: number }[];
  const minI = 20;
  const maxI = 85;
  const minDelta = validPts.length > 0 ? Math.floor(Math.min(...validPts.map((p) => p.delta))) - 2 : 25;
  const maxDelta = validPts.length > 0 ? Math.ceil(Math.max(...validPts.map((p) => p.delta))) + 4 : 65;

  const svgW = 600;
  const svgH = 240;
  const padL = 50;
  const padR = 20;
  const padT = 20;
  const padB = 40;

  const toSvgX = (i: number) => padL + ((i - minI) / (maxI - minI)) * (svgW - padL - padR);
  const toSvgY = (delta: number) => padT + (1 - (delta - minDelta) / (maxDelta - minDelta)) * (svgH - padT - padB);

  const pathD = validPts
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${toSvgX(p.i).toFixed(1)} ${toSvgY(p.delta).toFixed(1)}`)
    .join(' ');

  // Current angle marker
  const curI = params.angleDeg;
  const curDelta = prismResult.deviationAngleDeg;

  return (
    <div className="space-y-6 text-[#F1F5F9]">
      {/* 1. Header Banner */}
      <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#FBBF24]/10 border border-[#FBBF24]/30 flex items-center justify-center text-[#FBBF24] shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#F1F5F9] tracking-tight">
              CHROMATIC DISPERSION &amp; MINIMUM DEVIATION STUDIO
            </h2>
            <p className="text-xs text-[#94A3B8] font-medium mt-0.5">
              Newton's spectrum experiment, Cauchy's empirical equation, and the apex angle prism formula.
            </p>
          </div>
        </div>

        <button
          onClick={() => onSetAngle(Math.round(prismResult.angleForMinDeviationDeg * 10) / 10)}
          className="px-3.5 py-2 rounded-lg bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-[#07111F] text-xs font-black transition-colors cursor-pointer shadow-md flex items-center gap-1.5 self-start md:self-auto"
        >
          <TrendingDown className="w-4 h-4" />
          <span>Snap to Min Deviation (i = {prismResult.angleForMinDeviationDeg.toFixed(1)}°)</span>
        </button>
      </div>

      {/* 2. Interactive Minimum Deviation Graph δ(i) */}
      <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between pb-2 border-b border-[#26364D] gap-2">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-[#38BDF8] flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>Prism Deviation Curve: δ versus Angle of Incidence i</span>
            </h3>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">
              Minimum occurs uniquely at symmetric ray path where i = e and r₁ = r₂ = A/2
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-[#34D399] font-bold">
              δ_min = {prismResult.minimumDeviationAngleDeg.toFixed(1)}°
            </span>
            <span className="text-[#94A3B8]">|</span>
            <span className="text-[#FBBF24]">
              Current δ = {curDelta !== null ? `${curDelta.toFixed(1)}°` : 'TIR'}
            </span>
          </div>
        </div>

        {/* SVG Graph */}
        <div className="relative w-full aspect-[2.5/1] bg-[#0A1526] rounded-xl border border-[#26364D] p-2 overflow-hidden">
          <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-full">
            {/* Grid horizontal lines */}
            {[minDelta, (minDelta + maxDelta) / 2, maxDelta].map((val, idx) => {
              const y = toSvgY(val);
              return (
                <React.Fragment key={`grid-h-${idx}`}>
                  <line x1={padL} y1={y} x2={svgW - padR} y2={y} stroke="#26364D" strokeWidth="0.8" strokeDasharray="3,3" />
                  <text x={padL - 8} y={y + 3} fill="#94A3B8" fontSize="9" textAnchor="end" fontFamily="monospace">
                    {val.toFixed(0)}°
                  </text>
                </React.Fragment>
              );
            })}

            {/* Grid vertical lines */}
            {[30, 45, 60, 75].map((val) => {
              const x = toSvgX(val);
              return (
                <React.Fragment key={`grid-v-${val}`}>
                  <line x1={x} y1={padT} x2={x} y2={svgH - padB} stroke="#26364D" strokeWidth="0.8" strokeDasharray="3,3" />
                  <text x={x} y={svgH - padB + 14} fill="#94A3B8" fontSize="9" textAnchor="middle" fontFamily="monospace">
                    {val}°
                  </text>
                </React.Fragment>
              );
            })}

            {/* Axis titles */}
            <text x={svgW / 2} y={svgH - 8} fill="#94A3B8" fontSize="10" textAnchor="middle" fontFamily="sans-serif">
              Angle of Incidence i (degrees)
            </text>
            <text
              x={-svgH / 2}
              y="16"
              fill="#94A3B8"
              fontSize="10"
              textAnchor="middle"
              fontFamily="sans-serif"
              transform="rotate(-90)"
            >
              Deviation δ (°)
            </text>

            {/* Minimum deviation horizontal line */}
            <line
              x1={padL}
              y1={toSvgY(prismResult.minimumDeviationAngleDeg)}
              x2={svgW - padR}
              y2={toSvgY(prismResult.minimumDeviationAngleDeg)}
              stroke="#34D399"
              strokeWidth="1.2"
              strokeDasharray="4,4"
              opacity="0.7"
            />

            {/* Deviation Curve Path */}
            <path d={pathD} fill="none" stroke="#38BDF8" strokeWidth="2.5" />

            {/* Minimum deviation vertex dot */}
            <circle
              cx={toSvgX(prismResult.angleForMinDeviationDeg)}
              cy={toSvgY(prismResult.minimumDeviationAngleDeg)}
              r="4.5"
              fill="#34D399"
              stroke="#F1F5F9"
              strokeWidth="1.5"
            />
            <text
              x={toSvgX(prismResult.angleForMinDeviationDeg)}
              y={toSvgY(prismResult.minimumDeviationAngleDeg) - 8}
              fill="#34D399"
              fontSize="9"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="monospace"
            >
              δ_min ({prismResult.minimumDeviationAngleDeg.toFixed(1)}°)
            </text>

            {/* Current operating point */}
            {curDelta !== null && curI >= minI && curI <= maxI && (
              <g>
                <circle
                  cx={toSvgX(curI)}
                  cy={toSvgY(curDelta)}
                  r="5"
                  fill="#FBBF24"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* 3. Cauchy's Equation & Prism Refractive Index Formula */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prism Formula */}
        <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#38BDF8] flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span>Prism Refractive Index Formula (Class 12)</span>
          </h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            By determining the angle of minimum deviation <span className="font-mono text-[#34D399]">δ_m</span> for a prism of known apex angle <span className="font-mono text-[#F1F5F9]">A</span> using a spectrometer, the refractive index of the prism material is given precisely by:
          </p>

          <div className="bg-[#17263B] p-4 rounded-lg border border-[#26364D] text-center font-mono space-y-2">
            <div className="text-lg font-black text-[#FBBF24]">
              n = sin[ (A + δ_m) / 2 ] / sin( A / 2 )
            </div>
            <div className="text-xs text-[#94A3B8]">
              = sin[ ({apexDeg}° + {prismResult.minimumDeviationAngleDeg.toFixed(1)}°) / 2 ] / sin( {apexDeg / 2}° )
            </div>
            <div className="text-sm font-bold text-[#34D399] pt-1">
              n = {prismResult.nPrismBase.toFixed(4)}
            </div>
          </div>
        </div>

        {/* Cauchy's Dispersion Equation */}
        <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#A78BFA] flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Cauchy's Empirical Dispersion Model</span>
          </h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Augustin-Louis Cauchy formulated the inverse-square wavelength relationship for transparent optical media:
          </p>

          <div className="bg-[#17263B] p-4 rounded-lg border border-[#26364D] text-center font-mono space-y-2">
            <div className="text-lg font-black text-[#A78BFA]">
              n(λ) = A + B / λ² + C / λ⁴
            </div>
            <div className="text-xs text-[#94A3B8] leading-relaxed">
              Since <span className="text-[#EF4444]">λ_red (700 nm)</span> &gt; <span className="text-[#8B5CF6]">λ_violet (400 nm)</span>:
            </div>
            <div className="text-xs font-bold text-[#F1F5F9]">
              n_violet &gt; n_red  ⟹  δ_violet &gt; δ_red
            </div>
            <p className="text-[11px] text-[#94A3B8] pt-1 font-sans">
              Violet light bends most and has the smallest speed in glass, producing the characteristic rainbow fan!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
