/**
 * EQUATION 1 — Graph 1: Maximum Kinetic Energy vs. Frequency (SVG)
 * Plots K_max = hf - φ in eV vs frequency f in Hz.
 * Features:
 * - Clear threshold frequency f_0 vertical marker
 * - Shaded "No Emission" zone for f < f_0
 * - Linear Einstein trajectory with universal slope h/e
 * - Current operating point dot with tooltip/readout
 * - Interactive click-to-set-frequency
 */

import React, { useMemo, useCallback } from 'react';
import { TrendingUp } from 'lucide-react';
import { PhotoelectricParameters, PhotoelectricCalculations } from '../../physics/photoelectric/types';

interface KineticEnergyGraphSvgProps {
  params: PhotoelectricParameters;
  calc: PhotoelectricCalculations;
  onSetFrequency: (frequencyHz: number) => void;
}

export const KineticEnergyGraphSvg: React.FC<KineticEnergyGraphSvgProps> = ({
  params,
  calc,
  onSetFrequency,
}) => {
  const width = 640;
  const height = 270;
  const padL = 60;
  const padR = 40;
  const padT = 30;
  const padB = 45;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  // Domain: Frequency 2.0×10¹⁴ Hz to 16.0×10¹⁴ Hz
  const minF = 2.0e14;
  const maxF = 16.0e14;
  const fRange = maxF - minF;

  // Range: K_max 0 to 5.0 eV
  const maxKE = 5.0; // eV

  // Threshold x-position
  const f0 = calc.thresholdFrequencyHz;
  const f0X = padL + Math.max(0, Math.min(1, (f0 - minF) / fRange)) * plotW;

  // Current operating point
  const curF = params.frequencyHz;
  const curX = padL + Math.max(0, Math.min(1, (curF - minF) / fRange)) * plotW;
  const curY = height - padB - Math.max(0, Math.min(1, calc.maxKineticEnergyEV / maxKE)) * plotH;

  // Path for Einstein Line: from (f_0, 0) up to (maxF, K_max(maxF))
  const linePath = useMemo(() => {
    const kAtMaxF = Math.max(0, (maxF * 6.62607015e-34) / 1.602176634e-19 - calc.metal.workFunctionEV);
    const startX = f0X;
    const startY = height - padB;
    const endX = padL + plotW;
    const endY = height - padB - (Math.min(maxKE, kAtMaxF) / maxKE) * plotH;

    return `M ${startX.toFixed(1)} ${startY.toFixed(1)} L ${endX.toFixed(1)} ${endY.toFixed(1)}`;
  }, [f0X, maxF, calc.metal.workFunctionEV, padL, plotW, plotH, padB, height, maxKE]);

  // Click on graph to set frequency
  const handleGraphClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const scaleX = width / rect.width;
      const svgX = clickX * scaleX;

      if (svgX >= padL && svgX <= width - padR) {
        const frac = (svgX - padL) / plotW;
        const targetF = minF + frac * fRange;
        onSetFrequency(parseFloat(targetF.toPrecision(4)));
      }
    },
    [width, padL, padR, plotW, minF, fRange, onSetFrequency]
  );

  return (
    <div className="bg-[#10243D] rounded-xl border border-[#29415F] p-4 sm:p-5 shadow-2xl space-y-4">
      {/* Title & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#29415F] pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#38BDF8]" />
          <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#EAF2FF]">
              Graph 1: Maximum Kinetic Energy vs. Frequency
            </h3>
            <div className="text-[11px] text-[#9FB3CC]">
              Einstein Equation: <span className="font-mono text-[#38BDF8]">K_max = hf - φ</span> &middot; Slope: <span className="font-mono text-[#FBBF24]">h/e = 4.14 &times; 10⁻¹⁵ eV&middot;s</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-[#9FB3CC]">Operating Point:</span>
          <span className="px-2 py-0.5 rounded bg-[#142B47] border border-[#29415F] text-[#38BDF8] font-bold">
            f = {(curF / 1e14).toFixed(2)} &times; 10¹⁴ Hz &middot; K_max = {calc.maxKineticEnergyEV.toFixed(2)} eV
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full relative rounded-xl overflow-hidden border border-[#29415F] bg-[#071426] shadow-inner">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto block select-none cursor-crosshair"
          onClick={handleGraphClick}
          style={{ minHeight: '230px' }}
        >
          {/* Grid lines */}
          <g opacity="0.35">
            {/* Horizontal energy grid */}
            {[1, 2, 3, 4, 5].map((ke) => {
              const y = height - padB - (ke / maxKE) * plotH;
              return (
                <g key={ke}>
                  <line x1={padL} y1={y} x2={width - padR} y2={y} stroke="#29415F" strokeWidth="1" strokeDasharray="3 3" />
                  <text x={padL - 10} y={y + 3} fill="#9FB3CC" fontSize="9" fontFamily="ui-monospace, monospace" textAnchor="end">
                    {ke} eV
                  </text>
                </g>
              );
            })}

            {/* Zero energy axis */}
            <line x1={padL} y1={height - padB} x2={width - padR} y2={height - padB} stroke="#9FB3CC" strokeWidth="1.2" />
            <text x={padL - 10} y={height - padB + 3} fill="#9FB3CC" fontSize="9" fontFamily="ui-monospace, monospace" textAnchor="end">
              0 eV
            </text>

            {/* Vertical frequency grid ticks */}
            {[4, 6, 8, 10, 12, 14, 16].map((fVal) => {
              const x = padL + ((fVal * 1e14 - minF) / fRange) * plotW;
              return (
                <g key={fVal}>
                  <line x1={x} y1={padT} x2={x} y2={height - padB} stroke="#29415F" strokeWidth="1" strokeDasharray="2 2" />
                  <text x={x} y={height - padB + 14} fill="#9FB3CC" fontSize="9" fontFamily="ui-monospace, monospace" textAnchor="middle">
                    {fVal}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Shaded No-Emission Zone for f < f_0 */}
          {f0X > padL && (
            <g>
              <rect
                x={padL}
                y={padT}
                width={Math.min(plotW, f0X - padL)}
                height={plotH}
                fill="#FB7185"
                fillOpacity="0.08"
              />
              <text
                x={(padL + f0X) / 2}
                y={padT + plotH / 2}
                fill="#FB7185"
                fontSize="10"
                fontFamily="ui-monospace, monospace"
                fontWeight="bold"
                textAnchor="middle"
                opacity="0.85"
              >
                NO EMISSION (hf &lt; φ)
              </text>
            </g>
          )}

          {/* Threshold Frequency Vertical Marker */}
          {f0X >= padL && f0X <= width - padR && (
            <g>
              <line
                x1={f0X}
                y1={padT}
                x2={f0X}
                y2={height - padB}
                stroke="#FBBF24"
                strokeWidth="1.8"
                strokeDasharray="4 2"
              />
              <circle cx={f0X} cy={height - padB} r="4" fill="#FBBF24" />
              <text
                x={f0X}
                y={padT - 8}
                fill="#FBBF24"
                fontSize="10"
                fontWeight="bold"
                fontFamily="ui-monospace, monospace"
                textAnchor="middle"
              >
                f₀ = {(f0 / 1e14).toFixed(2)} &times; 10¹⁴ Hz
              </text>
            </g>
          )}

          {/* Einstein Linear Trajectory (K_max = hf - φ) */}
          <path
            d={linePath}
            fill="none"
            stroke="#38BDF8"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Current Operating Point */}
          <circle
            cx={curX}
            cy={curY}
            r="6"
            fill={calc.isEmissionPossible ? '#38BDF8' : '#FB7185'}
            stroke="#071426"
            strokeWidth="2"
          />

          {/* X and Y Axis Titles */}
          <text
            x={width / 2}
            y={height - 8}
            fill="#9FB3CC"
            fontSize="10"
            fontFamily="ui-monospace, monospace"
            textAnchor="middle"
          >
            Incident Photon Frequency f ( &times; 10¹⁴ Hz ) &middot; Click to select frequency
          </text>
          <text
            x={16}
            y={padT - 10}
            fill="#38BDF8"
            fontSize="10"
            fontWeight="bold"
            fontFamily="ui-monospace, monospace"
          >
            K_max (eV)
          </text>
        </svg>
      </div>

      {/* Physics Explanation Note */}
      <div className="bg-[#142B47] p-3 rounded-lg border border-[#29415F] text-xs text-[#9FB3CC] leading-relaxed">
        <strong className="text-[#EAF2FF]">Scientific Significance:</strong> The line intersects the frequency axis at the threshold frequency <span className="font-mono text-[#FBBF24]">f₀ = φ / h</span>. Below f₀, photon energy is insufficient to liberate electrons (no negative kinetic energy exists physically). For f &ge; f₀, K_max increases strictly linearly with frequency, and the slope <span className="font-mono text-[#38BDF8]">h/e</span> is universal across all metals.
      </div>
    </div>
  );
};
