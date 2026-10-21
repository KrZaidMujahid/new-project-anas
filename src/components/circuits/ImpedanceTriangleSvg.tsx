/**
 * EQUATION 1 — Interactive Impedance Triangle (SVG)
 * Visualizes the phasor triangle: R (horizontal), X_L - X_C (vertical),
 * Z (hypotenuse), and phase angle φ in degrees.
 */

import React from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { SeriesCalculations } from '../../physics/circuits/types';

interface ImpedanceTriangleSvgProps {
  seriesCalc: SeriesCalculations;
}

export const ImpedanceTriangleSvg: React.FC<ImpedanceTriangleSvgProps> = ({
  seriesCalc,
}) => {
  const {
    impedance: Z,
    netReactance: netX,
    inductiveReactance: XL,
    capacitiveReactance: XC,
    phaseAngleDeg: phiDeg,
    phaseAngleRad: phiRad,
    phaseRegime,
  } = seriesCalc;

  const R = seriesCalc.voltageResistorRMS > 0
    ? seriesCalc.voltageResistorRMS / seriesCalc.currentRMS
    : 100;

  // SVG geometry
  const width = 380;
  const height = 240;
  const originX = 60;
  const originY = 120; // center vertically to allow positive or negative reactance

  // Normalization scale to keep triangle within plot area
  const maxDimension = Math.max(R, Math.abs(netX), 1);
  const scale = 180 / maxDimension;

  const rLengthPx = Math.min(220, Math.max(40, R * scale));
  const xLengthPx = Math.min(95, Math.max(-95, netX * scale));

  const cornerX = originX + rLengthPx;
  const cornerY = originY;
  const tipX = cornerX;
  const tipY = originY - xLengthPx; // in SVG, -y is upward

  // Arc path for phase angle φ
  const arcRadius = 35;
  const isPositiveAngle = netX >= 0;
  const arcSweep = isPositiveAngle ? 0 : 1;
  const arcEndX = originX + arcRadius * Math.cos(-phiRad);
  const arcEndY = originY + arcRadius * Math.sin(-phiRad);

  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl flex flex-col justify-between gap-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#26364D] pb-2.5">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#38BDF8]" />
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F1F5F9]">
            Phasor Impedance Triangle
          </h3>
        </div>
        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
            phaseRegime === 'resonant'
              ? 'bg-[#FB7185]/20 border-[#FB7185] text-[#FB7185]'
              : phaseRegime === 'inductive'
              ? 'bg-[#38BDF8]/20 border-[#38BDF8] text-[#38BDF8]'
              : 'bg-[#A78BFA]/20 border-[#A78BFA] text-[#A78BFA]'
          }`}
        >
          {phaseRegime.toUpperCase()}
        </span>
      </div>

      {/* SVG Triangle Display */}
      <div className="w-full relative rounded-lg overflow-hidden border border-[#26364D] bg-[#0A1526] p-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto block select-none">
          {/* Axis reference lines */}
          <line x1="30" y1={originY} x2={width - 20} y2={originY} stroke="#17263B" strokeWidth="1" strokeDasharray="3 3" />
          <line x1={originX} y1="20" x2={originX} y2={height - 20} stroke="#17263B" strokeWidth="1" strokeDasharray="3 3" />

          {/* Right-angle indicator */}
          {Math.abs(netX) > 2 && (
            <rect
              x={cornerX - (isPositiveAngle ? 10 : 10)}
              y={originY - (isPositiveAngle ? 10 : 0)}
              width="10"
              height="10"
              fill="none"
              stroke="#26364D"
              strokeWidth="1"
            />
          )}

          {/* 1. Base side: Resistance R (Orange) */}
          <line
            x1={originX}
            y1={originY}
            x2={cornerX}
            y2={cornerY}
            stroke="#F97316"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <text
            x={originX + rLengthPx / 2}
            y={originY + (isPositiveAngle ? 20 : -10)}
            fill="#F97316"
            fontSize="11"
            fontWeight="bold"
            fontFamily="ui-monospace, monospace"
            textAnchor="middle"
          >
            R = {R.toFixed(1)} Ω
          </text>

          {/* 2. Vertical side: Net Reactance X = X_L - X_C */}
          {Math.abs(xLengthPx) > 2 && (
            <line
              x1={cornerX}
              y1={cornerY}
              x2={tipX}
              y2={tipY}
              stroke={netX >= 0 ? '#38BDF8' : '#A78BFA'}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}
          {Math.abs(netX) > 2 && (
            <text
              x={cornerX + 10}
              y={originY - xLengthPx / 2 + 4}
              fill={netX >= 0 ? '#38BDF8' : '#A78BFA'}
              fontSize="10"
              fontWeight="bold"
              fontFamily="ui-monospace, monospace"
            >
              {netX >= 0 ? `+X_L - X_C` : `-|X_C - X_L|`} ({Math.abs(netX).toFixed(1)} Ω)
            </text>
          )}

          {/* 3. Hypotenuse: Total Impedance Z (Blue) */}
          <line
            x1={originX}
            y1={originY}
            x2={tipX}
            y2={tipY}
            stroke="#38BDF8"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <text
            x={(originX + tipX) / 2 - 12}
            y={(originY + tipY) / 2 + (isPositiveAngle ? -10 : 18)}
            fill="#38BDF8"
            fontSize="12"
            fontWeight="bold"
            fontFamily="ui-monospace, monospace"
            textAnchor="middle"
          >
            Z = {Z.toFixed(1)} Ω
          </text>

          {/* Phase Angle Arc φ */}
          {Math.abs(phiDeg) > 2 && (
            <g>
              <path
                d={`M ${originX + arcRadius} ${originY} A ${arcRadius} ${arcRadius} 0 0 ${arcSweep} ${arcEndX} ${arcEndY}`}
                fill="none"
                stroke="#FBBF24"
                strokeWidth="1.8"
              />
              <text
                x={originX + arcRadius + 14}
                y={originY + (isPositiveAngle ? -8 : 14)}
                fill="#FBBF24"
                fontSize="11"
                fontWeight="bold"
                fontFamily="ui-monospace, monospace"
              >
                φ = {phiDeg.toFixed(1)}°
              </text>
            </g>
          )}

          {/* Resonance flat line notice */}
          {Math.abs(netX) <= 2 && (
            <text
              x={width / 2}
              y={originY - 30}
              fill="#FB7185"
              fontSize="11"
              fontWeight="bold"
              fontFamily="ui-monospace, monospace"
              textAnchor="middle"
            >
              Resonance: X_L = X_C &rArr; Z = R (Triangle collapses to line)
            </text>
          )}
        </svg>
      </div>

      {/* Mathematical Breakdown Box */}
      <div className="bg-[#17263B] p-2.5 rounded-lg border border-[#26364D] text-xs text-[#94A3B8] font-mono space-y-1">
        <div className="flex justify-between text-[#F1F5F9]">
          <span>Z = &radic;(R&sup2; + (X_L - X_C)&sup2;)</span>
          <span className="text-[#38BDF8] font-bold">{Z.toFixed(1)} &Omega;</span>
        </div>
        <div className="flex justify-between">
          <span>&phi; = arctan((X_L - X_C) / R)</span>
          <span className="text-[#FBBF24] font-bold">{phiDeg.toFixed(1)}&deg;</span>
        </div>
      </div>
    </div>
  );
};
