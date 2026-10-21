/**
 * EQUATION 1 — Carnot Heat Engine Apparatus
 * Highly visual animated SVG apparatus showing:
 * - Hot Reservoir (T_H, #F97316)
 * - Gas Cylinder & movable piston driven by thermodynamics
 * - Cold Reservoir (T_C, #60A5FA)
 * - Thermal contacts / Adiabatic insulation jackets
 * - Dynamic color shading of working gas based on instantaneous T(t)
 * - Animated heat flow arrows (orange for Q_H, blue for Q_C, green for W_net)
 * - Mechanical flywheel & piston shaft
 * - Live digital telemetry gauges (P, V, T)
 */

import React from 'react';
import {
  CarnotCycleResults,
  InstantaneousEngineState,
  CarnotParameters,
} from '../../physics/carnot/types';
import { Flame, Snowflake, ArrowDown, ArrowUp, ArrowRight, Gauge, Thermometer, Box } from 'lucide-react';

interface CarnotEngineApparatusProps {
  cycle: CarnotCycleResults;
  instantState: InstantaneousEngineState;
  params: CarnotParameters;
  isPlaying: boolean;
}

export const CarnotEngineApparatus: React.FC<CarnotEngineApparatusProps> = ({
  cycle,
  instantState,
  params,
  isPlaying,
}) => {
  // Gas temperature color interpolation: T_C (blue) to T_H (orange-red)
  const tempRatio = Math.max(
    0,
    Math.min(
      1,
      (instantState.temperatureK - params.tColdK) /
        Math.max(1, params.tHotK - params.tColdK)
    )
  );

  // RGB interpolation from blue (56, 189, 248) to orange/red (249, 115, 22)
  const rGas = Math.round(56 + (249 - 56) * tempRatio);
  const gGas = Math.round(189 + (115 - 189) * tempRatio);
  const bGas = Math.round(248 + (22 - 248) * tempRatio);
  const gasColor = `rgb(${rGas}, ${gGas}, ${bGas})`;
  const gasGlow = `rgba(${rGas}, ${gGas}, ${bGas}, ${0.15 + tempRatio * 0.25})`;

  // Cylinder geometry in SVG coordinates
  // Cylinder base at x=140, y=100, width=320, height=130
  // Piston travels horizontally between x=190 (min volume State A) and x=380 (max volume State C)
  const cylinderX = 130;
  const cylinderY = 90;
  const cylinderWidth = 270;
  const cylinderHeight = 120;

  const minPistonX = 180;
  const maxPistonX = 350;
  const currentPistonX =
    minPistonX + (maxPistonX - minPistonX) * instantState.pistonPositionNormalized;

  // Crankshaft / Flywheel geometry
  const flywheelCenterX = 450;
  const flywheelCenterY = cylinderY + cylinderHeight / 2;
  const flywheelRadius = 45;
  // Calculate crank angle from cycle stage and progress
  const cycleFraction = (instantState.currentStage - 1 + instantState.progressInStage) / 4;
  const crankAngleRad = cycleFraction * 2 * Math.PI;
  const crankPinX = flywheelCenterX + Math.cos(crankAngleRad) * 28;
  const crankPinY = flywheelCenterY + Math.sin(crankAngleRad) * 28;

  // Thermal contact state:
  const isHotContact = instantState.currentStage === 1;
  const isColdContact = instantState.currentStage === 3;
  const isInsulated = instantState.currentStage === 2 || instantState.currentStage === 4;

  return (
    <div className="bg-[#102740] border border-[#29445F] rounded-xl p-5 shadow-xl flex flex-col relative overflow-hidden">
      {/* Top Status Bar: Current Process & State */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#29445F]/70">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full animate-pulse bg-emerald-400"></span>
          <span className="text-sm font-bold text-white tracking-wide">
            {cycle.stages[instantState.currentStage].name}
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#16334F] text-[#38BDF8] border border-[#29445F]">
            State {instantState.currentStateId}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-[#AFC2D8]">
            <Thermometer className="w-3.5 h-3.5 text-[#FB923C]" />
            <span>T = </span>
            <span className="font-bold text-white">
              {instantState.temperatureK.toFixed(1)} K
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[#AFC2D8]">
            <Gauge className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>P = </span>
            <span className="font-bold text-white">
              {instantState.pressureKPa.toFixed(1)} kPa
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[#AFC2D8]">
            <Box className="w-3.5 h-3.5 text-[#4ADE80]" />
            <span>V = </span>
            <span className="font-bold text-white">
              {instantState.volumeL.toFixed(2)} L
            </span>
          </div>
        </div>
      </div>

      {/* SVG Engine Apparatus */}
      <div className="relative w-full aspect-[16/9] min-h-[300px] max-h-[460px] flex items-center justify-center py-2">
        <svg
          viewBox="0 0 560 320"
          className="w-full h-full select-none"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
        >
          <defs>
            {/* Hot Reservoir Gradient */}
            <linearGradient id="hotResGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EA580C" />
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#C2410C" />
            </linearGradient>

            {/* Cold Reservoir Gradient */}
            <linearGradient id="coldResGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>

            {/* Gas Chamber Dynamic Glow */}
            <radialGradient id="gasChamberGlow" cx="40%" cy="50%" r="60%">
              <stop offset="0%" stopColor={gasColor} stopOpacity="0.55" />
              <stop offset="100%" stopColor={gasColor} stopOpacity="0.15" />
            </radialGradient>

            {/* Cylinder Metallic Wall Gradient */}
            <linearGradient id="cylinderWall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="30%" stopColor="#1E293B" />
              <stop offset="70%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            {/* Piston Metallic Face Gradient */}
            <linearGradient id="pistonFace" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#94A3B8" />
              <stop offset="40%" stopColor="#E2E8F0" />
              <stop offset="80%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            {/* Piston Rod */}
            <linearGradient id="pistonRod" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="50%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            {/* Insulation pattern */}
            <pattern id="insulationHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#F59E0B" strokeWidth="2" opacity="0.6" />
            </pattern>
          </defs>

          {/* Background Structural Grid Lines */}
          <line x1="20" y1="cylinderY + cylinderHeight / 2" x2="540" y2="cylinderY + cylinderHeight / 2" stroke="#16334F" strokeDasharray="3 3" strokeWidth="1" />

          {/* ========================================================================= */}
          {/* HOT RESERVOIR (Top Left, T_H) */}
          {/* ========================================================================= */}
          <g className="transition-all duration-300">
            {/* Reservoir Box */}
            <rect
              x="30"
              y="20"
              width="150"
              height="55"
              rx="8"
              fill="url(#hotResGradient)"
              stroke={isHotContact ? '#FDBA74' : '#C2410C'}
              strokeWidth={isHotContact ? 3 : 1.5}
              className={isHotContact ? 'filter drop-shadow-[0_0_12px_rgba(249,115,22,0.8)]' : ''}
            />
            {/* Reservoir Text */}
            <text x="105" y="42" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
              HOT RESERVOIR
            </text>
            <text x="105" y="60" textAnchor="middle" fill="#FFEDD5" fontSize="13" fontWeight="900" fontFamily="monospace">
              T_H = {params.tHotK} K
            </text>

            {/* Thermal Conductor / Shutter to Cylinder */}
            {isHotContact ? (
              <g>
                <path d={`M 105 75 L 105 ${cylinderY}`} stroke="#F97316" strokeWidth="6" strokeLinecap="round" />
                {/* Heat Inflow Animated Waves */}
                <path
                  d="M 105 77 Q 112 82 105 87 T 105 97"
                  fill="none"
                  stroke="#FFEDD5"
                  strokeWidth="2.5"
                  className={isPlaying ? 'animate-[pulse_1s_ease-in-out_infinite]' : ''}
                />
                {/* Heat Arrow Label */}
                <g transform="translate(118, 86)">
                  <rect x="0" y="-8" width="55" height="16" rx="4" fill="#102740" stroke="#F97316" strokeWidth="1" />
                  <text x="27" y="3.5" textAnchor="middle" fill="#FB923C" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    Q_H IN
                  </text>
                </g>
              </g>
            ) : (
              /* Closed Insulating Barrier */
              <rect x="92" y="75" width="26" height="15" rx="3" fill="#1E293B" stroke="#475569" strokeWidth="1" />
            )}
          </g>

          {/* ========================================================================= */}
          {/* COLD RESERVOIR (Bottom Left, T_C) */}
          {/* ========================================================================= */}
          <g className="transition-all duration-300">
            {/* Reservoir Box */}
            <rect
              x="30"
              y="235"
              width="150"
              height="55"
              rx="8"
              fill="url(#coldResGradient)"
              stroke={isColdContact ? '#93C5FD' : '#1D4ED8'}
              strokeWidth={isColdContact ? 3 : 1.5}
              className={isColdContact ? 'filter drop-shadow-[0_0_12px_rgba(96,165,250,0.8)]' : ''}
            />
            {/* Reservoir Text */}
            <text x="105" y="257" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
              COLD RESERVOIR
            </text>
            <text x="105" y="275" textAnchor="middle" fill="#DBEAFE" fontSize="13" fontWeight="900" fontFamily="monospace">
              T_C = {params.tColdK} K
            </text>

            {/* Thermal Conductor / Shutter to Cylinder */}
            {isColdContact ? (
              <g>
                <path d={`M 105 ${cylinderY + cylinderHeight} L 105 235`} stroke="#60A5FA" strokeWidth="6" strokeLinecap="round" />
                {/* Heat Outflow Animated Waves */}
                <path
                  d="M 105 212 Q 98 218 105 224 T 105 234"
                  fill="none"
                  stroke="#DBEAFE"
                  strokeWidth="2.5"
                  className={isPlaying ? 'animate-[pulse_1s_ease-in-out_infinite]' : ''}
                />
                {/* Heat Arrow Label */}
                <g transform="translate(118, 222)">
                  <rect x="0" y="-8" width="60" height="16" rx="4" fill="#102740" stroke="#60A5FA" strokeWidth="1" />
                  <text x="30" y="3.5" textAnchor="middle" fill="#60A5FA" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    Q_C OUT
                  </text>
                </g>
              </g>
            ) : (
              /* Closed Insulating Barrier */
              <rect x="92" y="210" width="26" height="15" rx="3" fill="#1E293B" stroke="#475569" strokeWidth="1" />
            )}
          </g>

          {/* ========================================================================= */}
          {/* CYLINDER APPARATUS & WORKING GAS */}
          {/* ========================================================================= */}
          {/* Adiabatic Thermal Insulation Jacket (Shown during Stages 2 & 4) */}
          {isInsulated && (
            <g>
              {/* Top Insulation Coat */}
              <rect x={cylinderX - 8} y={cylinderY - 14} width={cylinderWidth + 16} height="12" rx="4" fill="url(#insulationHatch)" stroke="#F59E0B" strokeWidth="1" />
              {/* Bottom Insulation Coat */}
              <rect x={cylinderX - 8} y={cylinderY + cylinderHeight + 2} width={cylinderWidth + 16} height="12" rx="4" fill="url(#insulationHatch)" stroke="#F59E0B" strokeWidth="1" />
              {/* Label */}
              <text x={cylinderX + 110} y={cylinderY - 18} textAnchor="middle" fill="#FBBF24" fontSize="9" fontWeight="bold" fontFamily="monospace">
                ADIABATIC INSULATION (Q = 0)
              </text>
            </g>
          )}

          {/* Working Gas Chamber Background */}
          <rect
            x={cylinderX}
            y={cylinderY}
            width={currentPistonX - cylinderX}
            height={cylinderHeight}
            fill="url(#gasChamberGlow)"
            className="transition-all duration-75"
          />

          {/* Simulated Gas Particle Motion (Visual Points that move inside current volume) */}
          {Array.from({ length: 18 }).map((_, idx) => {
            const seedX = ((idx * 37) % 100) / 100;
            const seedY = ((idx * 61) % 100) / 100;
            const px = cylinderX + 10 + seedX * Math.max(10, currentPistonX - cylinderX - 20);
            const py = cylinderY + 10 + seedY * (cylinderHeight - 20);
            const pRadius = 2 + (idx % 2);
            return (
              <circle
                key={`gas-part-${idx}`}
                cx={px}
                cy={py}
                r={pRadius}
                fill={gasColor}
                opacity={0.7}
              />
            );
          })}

          {/* Gas State Overlay in Cylinder */}
          <g transform={`translate(${(cylinderX + currentPistonX) / 2}, ${cylinderY + cylinderHeight / 2 - 8})`}>
            <text x="0" y="0" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
              {params.gasType === 'monatomic' ? 'Monatomic Gas (γ=5/3)' : 'Diatomic Gas (γ=7/5)'}
            </text>
            <text x="0" y="16" textAnchor="middle" fill={gasColor} fontSize="11" fontWeight="bold" fontFamily="monospace">
              T = {instantState.temperatureK.toFixed(0)} K · P = {instantState.pressureKPa.toFixed(0)} kPa
            </text>
          </g>

          {/* Cylinder Frame (Heavy metallic walls) */}
          {/* Top Wall */}
          <rect x={cylinderX} y={cylinderY - 8} width={cylinderWidth} height="8" fill="url(#cylinderWall)" stroke="#1E293B" strokeWidth="1" />
          {/* Bottom Wall */}
          <rect x={cylinderX} y={cylinderY + cylinderHeight} width={cylinderWidth} height="8" fill="url(#cylinderWall)" stroke="#1E293B" strokeWidth="1" />
          {/* Left Base Wall */}
          <rect x={cylinderX - 10} y={cylinderY - 8} width="10" height={cylinderHeight + 16} fill="url(#cylinderWall)" stroke="#1E293B" strokeWidth="1" />

          {/* ========================================================================= */}
          {/* MOVABLE PISTON HEAD */}
          {/* ========================================================================= */}
          <g>
            {/* Piston Face (Thickness 16px) */}
            <rect
              x={currentPistonX}
              y={cylinderY + 2}
              width="16"
              height={cylinderHeight - 4}
              rx="2"
              fill="url(#pistonFace)"
              stroke="#334155"
              strokeWidth="1.5"
            />
            {/* Piston Rings */}
            <line x1={currentPistonX + 4} y1={cylinderY + 2} x2={currentPistonX + 4} y2={cylinderY + cylinderHeight - 2} stroke="#1E293B" strokeWidth="2" />
            <line x1={currentPistonX + 11} y1={cylinderY + 2} x2={currentPistonX + 11} y2={cylinderY + cylinderHeight - 2} stroke="#1E293B" strokeWidth="2" />

            {/* Piston Connecting Shaft */}
            <line
              x1={currentPistonX + 16}
              y1={cylinderY + cylinderHeight / 2}
              x2={crankPinX}
              y2={crankPinY}
              stroke="url(#pistonRod)"
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* Wrist Pin */}
            <circle cx={currentPistonX + 16} cy={cylinderY + cylinderHeight / 2} r="5" fill="#E2E8F0" stroke="#334155" strokeWidth="1" />
          </g>

          {/* ========================================================================= */}
          {/* FLYWHEEL & EXTERNAL LOAD / WORK */}
          {/* ========================================================================= */}
          <g>
            {/* Flywheel Rim */}
            <circle
              cx={flywheelCenterX}
              cy={flywheelCenterY}
              r={flywheelRadius}
              fill="#0F172A"
              stroke="#475569"
              strokeWidth="8"
            />
            {/* Flywheel Spokes */}
            <line
              x1={flywheelCenterX - flywheelRadius + 6}
              y1={flywheelCenterY}
              x2={flywheelCenterX + flywheelRadius - 6}
              y2={flywheelCenterY}
              stroke="#334155"
              strokeWidth="3"
            />
            <line
              x1={flywheelCenterX}
              y1={flywheelCenterY - flywheelRadius + 6}
              x2={flywheelCenterX}
              y2={flywheelCenterY + flywheelRadius - 6}
              stroke="#334155"
              strokeWidth="3"
            />
            {/* Flywheel Hub */}
            <circle cx={flywheelCenterX} cy={flywheelCenterY} r="12" fill="#64748B" stroke="#1E293B" strokeWidth="2" />

            {/* Crank Pin on Flywheel */}
            <circle cx={crankPinX} cy={crankPinY} r="6" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2" />

            {/* Useful Work Output Indicator */}
            <g transform={`translate(${flywheelCenterX - 35}, 20)`}>
              <rect x="0" y="0" width="115" height="42" rx="6" fill="#102740" stroke="#4ADE80" strokeWidth="1.5" />
              <text x="57" y="17" textAnchor="middle" fill="#4ADE80" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                MECHANICAL WORK
              </text>
              <text x="57" y="33" textAnchor="middle" fill="#F1F5F9" fontSize="12" fontWeight="900" fontFamily="monospace">
                W_net = {cycle.netWorkJ >= 1000 ? (cycle.netWorkJ / 1000).toFixed(2) + ' kJ' : cycle.netWorkJ.toFixed(0) + ' J'}
              </text>
            </g>

            {/* Green Work Flow Arrow from Flywheel to Load */}
            <path
              d={`M ${flywheelCenterX + 25} ${flywheelCenterY - 30} L ${flywheelCenterX + 25} 65`}
              stroke="#4ADE80"
              strokeWidth="4"
              strokeDasharray="4 2"
              markerEnd="url(#arrowGreen)"
            />
          </g>

          {/* ========================================================================= */}
          {/* PISTON MOTION ARROWS (Expansion / Compression) */}
          {/* ========================================================================= */}
          {instantState.pistonVelocityDirection === 'expanding' && (
            <g transform={`translate(${currentPistonX + 30}, ${cylinderY + 20})`}>
              <path d="M 0 0 L 25 0 M 20 -4 L 25 0 L 20 4" stroke="#4ADE80" strokeWidth="3" fill="none" strokeLinecap="round" />
              <text x="12" y="-7" textAnchor="middle" fill="#4ADE80" fontSize="8" fontWeight="bold" fontFamily="monospace">
                EXPANSION (W &gt; 0)
              </text>
            </g>
          )}

          {instantState.pistonVelocityDirection === 'compressing' && (
            <g transform={`translate(${currentPistonX - 45}, ${cylinderY + 20})`}>
              <path d="M 25 0 L 0 0 M 5 -4 L 0 0 L 5 4" stroke="#FBBF24" strokeWidth="3" fill="none" strokeLinecap="round" />
              <text x="12" y="-7" textAnchor="middle" fill="#FBBF24" fontSize="8" fontWeight="bold" fontFamily="monospace">
                COMPRESSION (W &lt; 0)
              </text>
            </g>
          )}

          {/* Volume Scale at Cylinder Bottom */}
          <g transform={`translate(${cylinderX}, ${cylinderY + cylinderHeight + 20})`}>
            <line x1="0" y1="0" x2={cylinderWidth} y2="0" stroke="#334155" strokeWidth="2" />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="#64748B" strokeWidth="2" />
            <text x="0" y="14" fill="#94A3B8" fontSize="8" textAnchor="middle" fontFamily="monospace">
              V_A ({cycle.states.A.volumeL.toFixed(1)}L)
            </text>

            <line x1={minPistonX - cylinderX} y1="-3" x2={minPistonX - cylinderX} y2="3" stroke="#64748B" strokeWidth="1" />
            <line x1={maxPistonX - cylinderX} y1="-4" x2={maxPistonX - cylinderX} y2="4" stroke="#64748B" strokeWidth="2" />
            <text x={maxPistonX - cylinderX} y="14" fill="#94A3B8" fontSize="8" textAnchor="middle" fontFamily="monospace">
              V_C ({cycle.states.C.volumeL.toFixed(1)}L)
            </text>
          </g>
        </svg>
      </div>

      {/* Bottom Educational Stage Description Banner */}
      <div className="mt-3 p-3 rounded-lg bg-[#0B1F36] border border-[#29445F] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="text-[#AFC2D8]">
          <span className="font-bold text-white mr-1.5">Thermodynamic Action:</span>
          {cycle.stages[instantState.currentStage].description}
        </div>
        <div className="font-mono text-[11px] px-2 py-1 rounded bg-[#102740] text-[#38BDF8] border border-[#29445F] whitespace-nowrap self-start sm:self-auto">
          Q = {cycle.stages[instantState.currentStage].heatJ.toFixed(0)} J · W = {cycle.stages[instantState.currentStage].workJ.toFixed(0)} J
        </div>
      </div>
    </div>
  );
};
