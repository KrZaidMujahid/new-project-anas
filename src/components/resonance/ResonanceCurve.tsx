/**
 * EQUATION 1 — Resonance Frequency Response Curve Component (Section 6)
 * Interactive SVG plot of steady-state amplitude A(f) vs driving frequency f_d.
 * Features:
 * - Dynamic operating point tracker synced with driving frequency
 * - Milestone markers for f_0 (natural), f_damped (free decay), and f_peak (amplitude max)
 * - Click-to-tune driving frequency directly on the graph
 * - Hover tooltip with exact coordinates
 * - Zero-damping singularity safeguards with visual cap
 */

import React, { useMemo, useState, useRef } from 'react';
import { ResonanceParameters, OscillatorDerivedValues, ResonanceCurvePoint } from '../../physics/resonance/types';
import { generateResonanceCurve, calculateSteadyStateAmplitude } from '../../physics/resonance/model';
import { LineChart, Sparkles, Crosshair, HelpCircle } from 'lucide-react';

interface ResonanceCurveProps {
  params: ResonanceParameters;
  derived: OscillatorDerivedValues;
  onSelectFrequency: (freqHz: number) => void;
}

export const ResonanceCurve: React.FC<ResonanceCurveProps> = ({
  params,
  derived,
  onSelectFrequency,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; f: number; a: number } | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const minFreq = 0.1;
  const maxFreq = Math.max(4.5, Math.min(8.0, derived.naturalFrequencyHz * 2.2));

  // Generate curve points
  const curvePoints = useMemo(() => {
    return generateResonanceCurve(params, minFreq, maxFreq, 220);
  }, [params, minFreq, maxFreq]);

  // Dimensions
  const width = 800;
  const height = 300;
  const padding = { top: 35, right: 35, bottom: 45, left: 60 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  // Max Amplitude scale for Y axis (with cap for zero damping)
  const peakAmp = derived.maxTheoreticalAmplitude || 1.0;
  const maxAmpY = Math.max(0.3, Math.min(10.0, peakAmp * 1.25));

  const scaleX = (f: number) => padding.left + ((f - minFreq) / (maxFreq - minFreq)) * plotW;
  const scaleY = (a: number) => padding.top + plotH - (Math.min(maxAmpY, a) / maxAmpY) * plotH;

  // Build SVG path
  const pathD = useMemo(() => {
    if (curvePoints.length === 0) return '';
    return curvePoints
      .map((p, idx) => {
        const sx = scaleX(p.frequencyHz);
        const sy = scaleY(p.amplitude);
        return `${idx === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`;
      })
      .join(' ');
  }, [curvePoints, maxAmpY]);

  // Current Operating Point
  const currentOpX = scaleX(params.drivingFrequencyHz);
  const currentOpY = scaleY(derived.steadyStateAmplitude);

  // Peak marker coordinates
  const peakX = derived.amplitudePeakFrequencyHz !== null ? scaleX(derived.amplitudePeakFrequencyHz) : null;
  const peakY = derived.maxTheoreticalAmplitude !== null ? scaleY(derived.maxTheoreticalAmplitude) : null;

  // Natural frequency f0 coordinates
  const f0X = scaleX(derived.naturalFrequencyHz);

  // Handle click on graph to tune driving frequency
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const normX = (clickX - (padding.left / width) * rect.width) / ((plotW / width) * rect.width);
    const clickedFreq = minFreq + Math.max(0, Math.min(1, normX)) * (maxFreq - minFreq);
    onSelectFrequency(Math.round(clickedFreq * 100) / 100);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const normX = (mouseX - (padding.left / width) * rect.width) / ((plotW / width) * rect.width);

    if (normX >= 0 && normX <= 1) {
      const f = minFreq + normX * (maxFreq - minFreq);
      const a = calculateSteadyStateAmplitude(params, 2 * Math.PI * f);
      setHoveredPoint({
        x: scaleX(f),
        y: scaleY(a),
        f,
        a,
      });
    } else {
      setHoveredPoint(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  return (
    <div className="bg-[#101D30] border border-slate-800 rounded-xl p-4 shadow-xl space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <LineChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              Resonance Curve: Amplitude vs Driving Frequency
            </h3>
            <p className="text-[11px] text-slate-400">
              Theoretical steady-state response <span className="font-mono text-cyan-300">A(ω) = F₀ / √[(k - mω²)² + (cω)²]</span>
            </p>
          </div>
        </div>

        {/* Operating Point Badge */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-[#07111F] border border-amber-500/40 text-xs font-mono text-amber-300 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>
              Operating: f_d = {params.drivingFrequencyHz.toFixed(2)} Hz → A ={' '}
              {derived.steadyStateAmplitude.toFixed(3)} m
            </span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full overflow-hidden rounded-lg bg-[#07111F] border border-slate-800/80 p-2">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          onClick={handleSvgClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-auto select-none cursor-crosshair overflow-visible"
        >
          {/* Horizontal Grid lines */}
          {[0.25, 0.5, 0.75, 1.0].map((frac) => {
            const yVal = frac * maxAmpY;
            const sy = scaleY(yVal);
            return (
              <g key={frac}>
                <line
                  x1={padding.left}
                  y1={sy}
                  x2={width - padding.right}
                  y2={sy}
                  stroke="#1e293b"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 8}
                  y={sy + 3}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  {yVal.toFixed(2)}m
                </text>
              </g>
            );
          })}

          {/* Vertical Frequency Grid Lines */}
          {Array.from({ length: 7 }).map((_, idx) => {
            const f = minFreq + (idx / 6) * (maxFreq - minFreq);
            const sx = scaleX(f);
            return (
              <g key={idx}>
                <line
                  x1={sx}
                  y1={padding.top}
                  x2={sx}
                  y2={height - padding.bottom}
                  stroke="#1e293b"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={sx}
                  y={height - padding.bottom + 16}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {f.toFixed(1)} Hz
                </text>
              </g>
            );
          })}

          {/* Natural Frequency f₀ vertical guideline (Cyan dashed) */}
          <line
            x1={f0X}
            y1={padding.top}
            x2={f0X}
            y2={height - padding.bottom}
            stroke="rgba(56, 189, 248, 0.6)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <text
            x={f0X}
            y={padding.top - 10}
            fill="#38bdf8"
            fontSize="10"
            fontFamily="monospace"
            fontWeight="bold"
            textAnchor="middle"
          >
            f₀ = {derived.naturalFrequencyHz.toFixed(2)} Hz
          </text>

          {/* Resonance Peak Frequency f_peak guideline (Yellow dashed) */}
          {peakX !== null && Math.abs(peakX - f0X) > 8 && (
            <line
              x1={peakX}
              y1={padding.top}
              x2={peakX}
              y2={height - padding.bottom}
              stroke="rgba(251, 191, 36, 0.5)"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />
          )}

          {/* Response Curve Path */}
          <path
            d={pathD}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Resonance Peak Marker */}
          {peakX !== null && peakY !== null && (
            <g>
              <circle cx={peakX} cy={peakY} r="5" fill="#fbbf24" />
              <text
                x={peakX + 8}
                y={peakY - 6}
                fill="#fbbf24"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                A_peak = {derived.maxTheoreticalAmplitude?.toFixed(2)}m
              </text>
            </g>
          )}

          {/* Current Operating Point Marker (Glowing Amber) */}
          <g>
            <circle
              cx={currentOpX}
              cy={currentOpY}
              r="10"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              opacity="0.6"
            />
            <circle cx={currentOpX} cy={currentOpY} r="6" fill="#f59e0b" />
            <circle cx={currentOpX} cy={currentOpY} r="2.5" fill="#ffffff" />
          </g>

          {/* Hover Inspector Point */}
          {hoveredPoint && (
            <g>
              <line
                x1={hoveredPoint.x}
                y1={padding.top}
                x2={hoveredPoint.x}
                y2={height - padding.bottom}
                stroke="#94a3b8"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <circle cx={hoveredPoint.x} cy={hoveredPoint.y} r="4" fill="#38bdf8" />
              <rect
                x={hoveredPoint.x + 8}
                y={hoveredPoint.y - 25}
                width="120"
                height="24"
                fill="#0f172acc"
                stroke="#334155"
                rx="4"
              />
              <text
                x={hoveredPoint.x + 14}
                y={hoveredPoint.y - 9}
                fill="#f1f5f9"
                fontSize="10"
                fontFamily="monospace"
              >
                {hoveredPoint.f.toFixed(2)}Hz → {hoveredPoint.a.toFixed(3)}m
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
            Driving Frequency f_d (Hz) — Click anywhere on curve to tune frequency
          </text>

          {/* Y Axis Label */}
          <text
            x={-height / 2}
            y="18"
            fill="#94a3b8"
            fontSize="10"
            fontFamily="sans-serif"
            transform="rotate(-90)"
            textAnchor="middle"
          >
            Steady-State Amplitude A (meters)
          </text>
        </svg>
      </div>

      {/* Pedagogical Commentary & Safeguards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 pt-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>
            Natural Frequency: <strong className="text-cyan-300 font-mono">f₀ = {derived.naturalFrequencyHz.toFixed(3)} Hz</strong>
          </span>
          <span className="text-slate-600">|</span>
          <span className="w-2 h-2 rounded-full bg-yellow-400" />
          <span>
            Displacement Peak: <strong className="text-yellow-300 font-mono">f_peak = {derived.amplitudePeakFrequencyHz !== null ? `${derived.amplitudePeakFrequencyHz.toFixed(3)} Hz` : 'No Peak'}</strong>
          </span>
        </div>

        {params.dampingCoefficient === 0 && (
          <span className="text-amber-400 text-[11px] font-mono">
            ⚠ Undamped (c = 0): Amplitude singularity at f₀ is capped for visualization.
          </span>
        )}
      </div>
    </div>
  );
};
