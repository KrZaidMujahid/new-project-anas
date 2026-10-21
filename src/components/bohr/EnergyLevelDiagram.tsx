/**
 * EQUATION 1 — Bohr Hydrogen Energy-Level Diagram
 * Rigorous vertical energy coordinate diagram showing:
 * - Quantized bound-state energy levels E_n = -13.6 / n^2 eV
 * - Ground state n = 1 (-13.60 eV) distinguished at bottom
 * - Crowding of energy levels as n -> infinity
 * - Ionization limit line at 0 eV (Continuum)
 * - Interactive click-to-select energy state
 * - Active transition vector arrow with photon energy label
 */

import React, { useState } from 'react';
import {
  PrincipalQuantumNumber,
  ElectronTransition,
} from '../../physics/bohr/types';
import { ALL_ENERGY_LEVELS } from '../../physics/bohr/model';
import { Layers, ArrowDown, ArrowUp, Zap } from 'lucide-react';

interface EnergyLevelDiagramProps {
  currentLevel: PrincipalQuantumNumber;
  onSelectLevel: (n: PrincipalQuantumNumber) => void;
  activeTransition: ElectronTransition | null;
}

export const EnergyLevelDiagram: React.FC<EnergyLevelDiagramProps> = ({
  currentLevel,
  onSelectLevel,
  activeTransition,
}) => {
  const [hoveredLevel, setHoveredLevel] = useState<PrincipalQuantumNumber | null>(null);

  // SVG dimensions
  const svgWidth = 360;
  const svgHeight = 440;
  const padding = { top: 40, bottom: 40, left: 70, right: 90 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  // Energy range: -14.0 eV (bottom) to +0.5 eV (top)
  const eMin = -14.0;
  const eMax = 0.5;

  const scaleY = (energyEV: number): number => {
    // Top is 0 eV, Bottom is -14.0 eV
    const fraction = (energyEV - eMin) / (eMax - eMin);
    return padding.top + plotHeight - fraction * plotHeight;
  };

  const ionizationY = scaleY(0);

  return (
    <div className="bg-[#10243D] border border-[#29415F] rounded-xl p-5 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#29415F]/70">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#818CF8]" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Quantized Energy-Level Diagram
          </h3>
        </div>
        <span className="text-xs font-mono text-[#818CF8]">
          E_n = −13.6 / n² eV
        </span>
      </div>

      {/* SVG Diagram */}
      <div className="relative w-full aspect-[4/5] max-h-[460px] mx-auto my-2 flex items-center justify-center select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full"
        >
          {/* Ionization Limit Line (0 eV) */}
          <g>
            <line
              x1={padding.left}
              y1={ionizationY}
              x2={padding.left + plotWidth}
              y2={ionizationY}
              stroke="#F43F5E"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            {/* Label */}
            <text
              x={padding.left - 8}
              y={ionizationY + 3.5}
              textAnchor="end"
              fill="#F43F5E"
              fontSize="10"
              fontWeight="bold"
              fontFamily="monospace"
            >
              0.00 eV
            </text>
            <text
              x={padding.left + plotWidth + 8}
              y={ionizationY + 3.5}
              textAnchor="start"
              fill="#F43F5E"
              fontSize="10"
              fontWeight="bold"
              fontFamily="monospace"
            >
              n = ∞ (Ionized)
            </text>
          </g>

          {/* Continuum Shaded Region Above 0 eV */}
          <rect
            x={padding.left}
            y={padding.top}
            width={plotWidth}
            height={ionizationY - padding.top}
            fill="#F43F5E"
            opacity="0.05"
          />
          <text
            x={padding.left + plotWidth / 2}
            y={padding.top + (ionizationY - padding.top) / 2 + 3}
            textAnchor="middle"
            fill="#F43F5E"
            fontSize="9"
            fontWeight="bold"
            fontFamily="monospace"
            opacity="0.6"
          >
            CONTINUUM (FREE ELECTRON)
          </text>

          {/* Energy Levels (n = 6 down to 1) */}
          {ALL_ENERGY_LEVELS.map((level) => {
            const y = scaleY(level.energyEV);
            const isSelected = currentLevel === level.n;
            const isHovered = hoveredLevel === level.n;
            const isGround = level.n === 1;

            let strokeColor = '#38BDF8';
            let strokeWidth = 2;

            if (isSelected) {
              strokeColor = '#60A5FA';
              strokeWidth = 3.5;
            } else if (isHovered) {
              strokeColor = '#FFFFFF';
              strokeWidth = 2.5;
            } else if (isGround) {
              strokeColor = '#818CF8';
              strokeWidth = 2.5;
            }

            return (
              <g
                key={`energy-line-${level.n}`}
                className="cursor-pointer group"
                onClick={() => onSelectLevel(level.n)}
                onMouseEnter={() => setHoveredLevel(level.n)}
                onMouseLeave={() => setHoveredLevel(null)}
              >
                {/* Wide invisible hit area */}
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + plotWidth}
                  y2={y}
                  stroke="transparent"
                  strokeWidth="14"
                />

                {/* Energy Line */}
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + plotWidth}
                  y2={y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  className="transition-colors duration-150"
                />

                {/* Left Label: Energy in eV */}
                <text
                  x={padding.left - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fill={isSelected ? '#FFFFFF' : '#9FB3CC'}
                  fontSize="10"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  fontFamily="monospace"
                >
                  {level.energyEV.toFixed(level.n <= 2 ? 2 : 4)} eV
                </text>

                {/* Right Label: Quantum Number n */}
                <text
                  x={padding.left + plotWidth + 8}
                  y={y + 3.5}
                  textAnchor="start"
                  fill={isSelected ? '#60A5FA' : '#EAF2FF'}
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  n = {level.n} {isGround ? '(Ground)' : ''}
                </text>

                {/* Electron marker on active energy level */}
                {isSelected && (
                  <circle
                    cx={padding.left + 25}
                    cy={y}
                    r="5"
                    fill="#38BDF8"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    className="animate-pulse"
                  />
                )}
              </g>
            );
          })}

          {/* Active Transition Vector Arrow */}
          {activeTransition && (
            <g>
              {(() => {
                const yI = scaleY(ALL_ENERGY_LEVELS[activeTransition.initialLevel - 1].energyEV);
                const yF = scaleY(ALL_ENERGY_LEVELS[activeTransition.finalLevel - 1].energyEV);
                const arrowX = padding.left + plotWidth / 2;
                const arrowColor =
                  activeTransition.visibleColorHex ||
                  (activeTransition.type === 'emission' ? '#FBBF24' : '#38BDF8');

                return (
                  <g>
                    {/* Vertical Transition Line */}
                    <line
                      x1={arrowX}
                      y1={yI}
                      x2={arrowX}
                      y2={yF}
                      stroke={arrowColor}
                      strokeWidth="3"
                      strokeDasharray={activeTransition.visibleColorHex ? 'none' : '4 3'}
                    />

                    {/* Arrowhead */}
                    {activeTransition.type === 'emission' ? (
                      // Downward Arrowhead at yF
                      <polygon
                        points={`${arrowX - 5},${yF - 7} ${arrowX + 5},${yF - 7} ${arrowX},${yF}`}
                        fill={arrowColor}
                      />
                    ) : (
                      // Upward Arrowhead at yF
                      <polygon
                        points={`${arrowX - 5},${yF + 7} ${arrowX + 5},${yF + 7} ${arrowX},${yF}`}
                        fill={arrowColor}
                      />
                    )}

                    {/* Transition Label Box */}
                    <g transform={`translate(${arrowX + 10}, ${(yI + yF) / 2})`}>
                      <rect
                        x="0"
                        y="-10"
                        width="92"
                        height="20"
                        rx="4"
                        fill="#0B1B31"
                        stroke={arrowColor}
                        strokeWidth="1"
                      />
                      <text
                        x="46"
                        y="3.5"
                        textAnchor="middle"
                        fill="#EAF2FF"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        ΔE = {activeTransition.deltaEnergyEV.toFixed(2)} eV
                      </text>
                    </g>
                  </g>
                );
              })()}
            </g>
          )}

          {/* Left Axis Label */}
          <text
            x={padding.left - 48}
            y={padding.top - 18}
            textAnchor="start"
            fill="#EAF2FF"
            fontSize="11"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            Energy (eV)
          </text>
        </svg>
      </div>

      {/* Spacing Observation Note */}
      <div className="pt-2 border-t border-[#29415F]/70 text-[11px] text-[#9FB3CC] font-mono flex items-center justify-between">
        <span>Spacing: ΔE decreases rapidly as n increases</span>
        <span className="text-[#38BDF8]">E ∝ −1/n²</span>
      </div>
    </div>
  );
};
