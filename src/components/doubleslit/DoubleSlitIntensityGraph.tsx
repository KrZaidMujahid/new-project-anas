/**
 * EQUATION 1 — Double-Slit Screen Intensity Graph
 * Part 10: High-Precision "Intensity Distribution on the Screen" Plot
 *
 * Implements:
 * - Horizontal axis: Position y on the screen (mm) from -yMax to +yMax
 * - Vertical axis: Normalized intensity I / I_max (0 to 1)
 * - Exact finite-width double slit curve: I(y) = I_0 [sinc(pi*a*y/(lambda*L))]^2 * cos^2(pi*d*y/(lambda*L))
 * - Grid lines, numerical tick labels, axes arrows
 * - Bright-fringe peaks and dark-fringe minima indicators
 * - Central maximum (m = 0) highlighted
 * - Optional single-slit diffraction envelope curve (dashed)
 * - Synchronized live detector probe crosshair at position params.detectorYMm
 */

import React, { useMemo } from 'react';
import {
  DoubleSlitParameters,
  DoubleSlitPhysicsResults,
} from '../../physics/doubleslit/types';
import { calculateIntensityAtY } from '../../physics/doubleslit/model';
import { Activity, Layers, Crosshair, Sparkles } from 'lucide-react';

interface IntensityGraphProps {
  params: DoubleSlitParameters;
  results: DoubleSlitPhysicsResults;
  onSetDetectorY: (yMm: number) => void;
}

export const DoubleSlitIntensityGraph: React.FC<IntensityGraphProps> = ({
  params,
  results,
  onSetDetectorY,
}) => {
  // Graph viewport dimensions
  const SVG_WIDTH = 840;
  const SVG_HEIGHT = 280;

  // Margin layout
  const margin = { top: 35, right: 35, bottom: 45, left: 55 };
  const plotWidth = SVG_WIDTH - margin.left - margin.right;
  const plotHeight = SVG_HEIGHT - margin.top - margin.bottom;

  // Horizontal span: +/- 20 mm or responsive to fringe width
  const ySpanMm = Math.max(12, Math.min(25, results.fringeWidthMm * 5));

  // Coordinate transforms
  const yMmToSvgX = (yMm: number) => {
    return margin.left + ((yMm + ySpanMm) / (2 * ySpanMm)) * plotWidth;
  };

  const svgXToYMm = (svgX: number) => {
    return ((svgX - margin.left) / plotWidth) * (2 * ySpanMm) - ySpanMm;
  };

  const intensityToSvgY = (intensity: number) => {
    return margin.top + (1 - Math.max(0, Math.min(1, intensity))) * plotHeight;
  };

  // Compute curve points
  const { intensityCurvePath, envelopeCurvePath, brightPeaks, darkMinima } = useMemo(() => {
    const steps = 360;
    const pts: string[] = [];
    const envPts: string[] = [];

    for (let i = 0; i <= steps; i++) {
      const u = i / steps; // 0 to 1
      const yMm = -ySpanMm + u * (2 * ySpanMm);
      const calc = calculateIntensityAtY(yMm * 1e-3, params);

      const x = yMmToSvgX(yMm);
      const yInt = intensityToSvgY(calc.intensity);
      const yEnv = intensityToSvgY(calc.diffractionFactor);

      pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yInt.toFixed(1)}`);
      envPts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yEnv.toFixed(1)}`);
    }

    // Identify bright and dark fringe orders within ySpanMm
    const n = Math.max(1.0, params.mediumRefractiveIndex);
    const lambdaM = (params.wavelengthNm * 1e-9) / n;
    const dM = params.slitSeparationMm * 1e-3;
    const LM = params.screenDistanceM;

    const peaks: { order: number; yMm: number; x: number; y: number }[] = [];
    const minima: { order: number; yMm: number; x: number; y: number }[] = [];

    // Max order within view
    const maxOrder = Math.floor((ySpanMm * 1e-3 * dM) / (lambdaM * LM));

    for (let m = -maxOrder; m <= maxOrder; m++) {
      const yMm = ((m * lambdaM * LM) / dM) * 1000;
      if (Math.abs(yMm) <= ySpanMm) {
        const calc = calculateIntensityAtY(yMm * 1e-3, params);
        peaks.push({
          order: m,
          yMm,
          x: yMmToSvgX(yMm),
          y: intensityToSvgY(calc.intensity),
        });
      }

      // Dark minimum
      if (m < maxOrder) {
        const darkOrder = m + 0.5;
        const yDarkMm = ((darkOrder * lambdaM * LM) / dM) * 1000;
        if (Math.abs(yDarkMm) <= ySpanMm) {
          const darkCalc = calculateIntensityAtY(yDarkMm * 1e-3, params);
          minima.push({
            order: darkOrder,
            yMm: yDarkMm,
            x: yMmToSvgX(yDarkMm),
            y: intensityToSvgY(darkCalc.intensity),
          });
        }
      }
    }

    return {
      intensityCurvePath: pts.join(' '),
      envelopeCurvePath: envPts.join(' '),
      brightPeaks: peaks,
      darkMinima: minima,
    };
  }, [params, ySpanMm]);

  // Click on graph to position detector
  const handleGraphClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * SVG_WIDTH;
    if (clickX >= margin.left && clickX <= SVG_WIDTH - margin.right) {
      const targetYMm = svgXToYMm(clickX);
      onSetDetectorY(Math.max(-ySpanMm, Math.min(ySpanMm, targetYMm)));
    }
  };

  const detectorSvgX = yMmToSvgX(params.detectorYMm);

  // Tick divisions
  const xTicks = useMemo(() => {
    const step = ySpanMm > 15 ? 5 : 2;
    const ticks: number[] = [];
    for (let t = -Math.floor(ySpanMm / step) * step; t <= ySpanMm; t += step) {
      ticks.push(t);
    }
    return ticks;
  }, [ySpanMm]);

  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-4 text-[#F1F5F9]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#26364D] gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F1F5F9]">Intensity Distribution on the Screen I(y)</h3>
            <p className="text-xs text-[#94A3B8]">
              Normalized optical intensity curve across screen coordinate y with single-slit diffraction envelope modulation.
            </p>
          </div>
        </div>

        {/* Live Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 inline-block" style={{ backgroundColor: results.rgbColor }} />
            <span className="text-slate-300 font-mono text-[11px]">Double-Slit I(y)</span>
          </div>
          {params.showEnvelope && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 inline-block bg-[#A78BFA] border-b border-dashed" />
              <span className="text-[#A78BFA] font-mono text-[11px]">Diffraction Envelope [sinc²(β)]</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#FBBF24]">
            <span>β = {results.fringeWidthMm.toFixed(3)} mm</span>
          </div>
        </div>
      </div>

      {/* Main SVG Plot Canvas */}
      <div className="relative w-full aspect-[840/280] bg-[#0A1526] rounded-lg border border-[#26364D] overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full h-full cursor-crosshair"
          onClick={handleGraphClick}
        >
          <defs>
            {/* Grid pattern */}
            <pattern id="graphGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#17263B" strokeWidth="0.8" />
            </pattern>

            {/* Intensity Area Gradient */}
            <linearGradient id="intensityFillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={results.rgbColor} stopOpacity="0.35" />
              <stop offset="100%" stopColor={results.rgbColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid background */}
          <rect
            x={margin.left}
            y={margin.top}
            width={plotWidth}
            height={plotHeight}
            fill="url(#graphGrid)"
          />

          {/* Horizontal Grid lines and Y-axis ticks */}
          {[0, 0.25, 0.5, 0.75, 1.0].map((frac) => {
            const y = intensityToSvgY(frac);
            return (
              <g key={`y-grid-${frac}`}>
                <line
                  x1={margin.left}
                  y1={y}
                  x2={margin.left + plotWidth}
                  y2={y}
                  stroke="#1E293B"
                  strokeWidth="1"
                  strokeDasharray={frac === 0 ? 'none' : '2 2'}
                />
                <text
                  x={margin.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-slate-400 font-mono text-[9px]"
                >
                  {(frac * 100).toFixed(0)}%
                </text>
              </g>
            );
          })}

          {/* Vertical Grid lines and X-axis ticks (y in mm) */}
          {xTicks.map((tickMm) => {
            const x = yMmToSvgX(tickMm);
            const isZero = tickMm === 0;
            return (
              <g key={`x-tick-${tickMm}`}>
                <line
                  x1={x}
                  y1={margin.top}
                  x2={x}
                  y2={margin.top + plotHeight}
                  stroke={isZero ? '#475569' : '#17263B'}
                  strokeWidth={isZero ? '1.5' : '1'}
                  strokeDasharray={isZero ? '4 2' : 'none'}
                />
                <line
                  x1={x}
                  y1={margin.top + plotHeight}
                  x2={x}
                  y2={margin.top + plotHeight + 5}
                  stroke="#64748B"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={margin.top + plotHeight + 18}
                  textAnchor="middle"
                  className={`font-mono text-[9px] ${isZero ? 'fill-[#38BDF8] font-bold' : 'fill-slate-400'}`}
                >
                  {tickMm > 0 ? `+${tickMm}` : tickMm}
                </text>
              </g>
            );
          })}

          {/* Axes Borders */}
          <line
            x1={margin.left}
            y1={margin.top}
            x2={margin.left}
            y2={margin.top + plotHeight}
            stroke="#64748B"
            strokeWidth="1.5"
          />
          <line
            x1={margin.left}
            y1={margin.top + plotHeight}
            x2={margin.left + plotWidth}
            y2={margin.top + plotHeight}
            stroke="#64748B"
            strokeWidth="1.5"
          />

          {/* Axis Labels */}
          <text
            x={margin.left + plotWidth / 2}
            y={SVG_HEIGHT - 8}
            textAnchor="middle"
            className="fill-slate-300 font-mono text-[10px] font-bold"
          >
            Screen Position y (mm)
          </text>
          <text
            x={15}
            y={margin.top + plotHeight / 2}
            textAnchor="middle"
            transform={`rotate(-90 15 ${margin.top + plotHeight / 2})`}
            className="fill-slate-300 font-mono text-[10px] font-bold"
          >
            Normalized Intensity I / I_max
          </text>

          {/* Area Fill under Intensity Curve */}
          <path
            d={`${intensityCurvePath} L ${yMmToSvgX(ySpanMm)} ${intensityToSvgY(0)} L ${yMmToSvgX(-ySpanMm)} ${intensityToSvgY(0)} Z`}
            fill="url(#intensityFillGrad)"
          />

          {/* Single-Slit Diffraction Envelope (dashed purple) */}
          {params.showEnvelope && (
            <path
              d={envelopeCurvePath}
              fill="none"
              stroke="#A78BFA"
              strokeWidth="1.8"
              strokeDasharray="5 3"
              opacity="0.75"
            />
          )}

          {/* Double-Slit Combined Intensity Curve */}
          <path
            d={intensityCurvePath}
            fill="none"
            stroke={results.rgbColor}
            strokeWidth="2.2"
          />

          {/* Bright Fringe Peaks and Labels */}
          {params.showFringeLabels &&
            brightPeaks.map((peak) => (
              <g key={`peak-${peak.order}`}>
                <circle cx={peak.x} cy={peak.y} r="3" fill="#0A1526" stroke="#34D399" strokeWidth="1.5" />
                <text
                  x={peak.x}
                  y={Math.max(margin.top - 8, peak.y - 8)}
                  textAnchor="middle"
                  className={`font-mono text-[8px] font-bold ${
                    peak.order === 0 ? 'fill-[#38BDF8]' : 'fill-[#34D399]'
                  }`}
                >
                  {peak.order === 0 ? 'm=0 (Central)' : `m=${peak.order > 0 ? `+${peak.order}` : peak.order}`}
                </text>
              </g>
            ))}

          {/* Dark Fringe Minima markers */}
          {brightPeaks.length <= 15 &&
            darkMinima.map((dm) => (
              <circle
                key={`dm-${dm.order}`}
                cx={dm.x}
                cy={intensityToSvgY(0)}
                r="2"
                fill="#FB7185"
                opacity="0.7"
              />
            ))}

          {/* Current Probe / Detector Indicator on the Graph */}
          {Math.abs(params.detectorYMm) <= ySpanMm && (
            <g transform={`translate(${detectorSvgX}, 0)`}>
              <line
                x1="0"
                y1={margin.top}
                x2="0"
                y2={margin.top + plotHeight}
                stroke="#FBBF24"
                strokeWidth="1.5"
                strokeDasharray="3 2"
              />
              <circle
                cx="0"
                cy={intensityToSvgY(results.detector.normalizedIntensity)}
                r="4.5"
                fill="#FBBF24"
                stroke="#0A1526"
                strokeWidth="1.5"
              />
              <rect
                x="-35"
                y={margin.top - 20}
                width="70"
                height="16"
                rx="3"
                fill="#17263B"
                stroke="#26364D"
              />
              <text
                x="0"
                y={margin.top - 8}
                textAnchor="middle"
                className="fill-[#FBBF24] font-mono text-[8px] font-bold"
              >
                y={params.detectorYMm.toFixed(1)}mm
              </text>
            </g>
          )}
        </svg>

        {/* Bottom Hint */}
        <div className="absolute bottom-1 right-2 text-[10px] text-slate-500 font-mono bg-[#0B1728]/80 px-2 py-0.5 rounded border border-[#26364D] pointer-events-none">
          💡 Click anywhere on the curve to inspect position
        </div>
      </div>
    </div>
  );
};
