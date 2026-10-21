/**
 * EQUATION 1 — Double-Slit Telemetry & Scientific Readouts Panel
 * Real-time electrodynamic calculations:
 * - Fringe width beta = lambda * D / d
 * - Angular fringe separation Delta theta = lambda / d
 * - Central diffraction peak width 2*lambda*D/a
 * - Slit ratio d/a and missing orders identification
 * - Point P(y) deep inspection: path diff Delta x, phase diff Delta phi, condition
 * - Phasor diagram of electric field vectors E1, E2, and resultant E_R
 */

import React from 'react';
import {
  DoubleSlitParameters,
  DoubleSlitPhysicsResults,
} from '../../physics/doubleslit/types';
import {
  Activity,
  Calculator,
  Compass,
  Zap,
  Layers,
  AlertCircle,
  CheckCircle2,
  MinusCircle,
  HelpCircle,
} from 'lucide-react';

interface DoubleSlitTelemetryProps {
  params: DoubleSlitParameters;
  results: DoubleSlitPhysicsResults;
}

export const DoubleSlitTelemetry: React.FC<DoubleSlitTelemetryProps> = ({
  params,
  results,
}) => {
  const { detector } = results;

  // Phasor canvas dimensions
  const phasorSize = 130;
  const phasorCenter = phasorSize / 2;
  const phasorScale = 30; // 1 unit = 30px

  const e1End = {
    x: phasorCenter + detector.phasorE1.x * phasorScale,
    y: phasorCenter - detector.phasorE1.y * phasorScale,
  };

  const e2End = {
    x: e1End.x + detector.phasorE2.x * phasorScale,
    y: e1End.y - detector.phasorE2.y * phasorScale,
  };

  const resultantEnd = {
    x: phasorCenter + detector.phasorResultant.x * phasorScale,
    y: phasorCenter - detector.phasorResultant.y * phasorScale,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-[#F1F5F9]">
      {/* 1. YOUNG'S FRINGE METRICS CARD */}
      <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-[#26364D] pb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#38BDF8]">
            <Calculator className="w-4 h-4 text-[#38BDF8]" />
            <span>Fringe Geometry & Optics Math</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Young's Formulae</span>
        </div>

        <div className="space-y-2.5">
          {/* Fringe Width Beta */}
          <div className="bg-[#0B1728] p-3 rounded-lg border border-[#26364D] space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#94A3B8]">Fringe Width (β):</span>
              <span className="font-mono font-black text-base text-[#38BDF8]">
                {results.fringeWidthMm.toFixed(3)} mm
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              β = λD / d = ({results.effectiveWavelengthNm.toFixed(0)}nm × {params.screenDistanceM.toFixed(2)}m) / {(params.slitSeparationMm).toFixed(2)}mm
            </div>
          </div>

          {/* Angular Fringe Separation */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#0B1728] p-2.5 rounded-lg border border-[#26364D]">
              <div className="text-[#94A3B8] text-[10px]">Angular Separation (Δθ)</div>
              <div className="font-mono font-bold text-sm text-[#FBBF24] mt-0.5">
                {results.angularFringeSeparationMrad.toFixed(3)} mrad
              </div>
              <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                ({results.angularFringeSeparationDeg.toFixed(4)}°)
              </div>
            </div>

            <div className="bg-[#0B1728] p-2.5 rounded-lg border border-[#26364D]">
              <div className="text-[#94A3B8] text-[10px]">Fringes in Central Env.</div>
              <div className="font-mono font-bold text-sm text-[#34D399] mt-0.5">
                N = {results.fringesInCentralMax}
              </div>
              <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                N = 2(d / a) = 2 × {results.daRatio.toFixed(1)}
              </div>
            </div>
          </div>

          {/* Central Diffraction Peak Width */}
          <div className="bg-[#0B1728] p-2.5 rounded-lg border border-[#26364D] text-xs flex items-center justify-between">
            <span className="text-[#94A3B8]">Central Diffraction Width (2y₁):</span>
            <span className="font-mono font-bold text-slate-200">
              {results.centralDiffractionWidthMm.toFixed(2)} mm
            </span>
          </div>

          {/* Missing Orders Badge */}
          <div className="bg-[#17263B] p-2.5 rounded-lg border border-[#26364D] text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold">Missing Orders (d/a = {results.daRatio.toFixed(2)}):</span>
              <span className="font-mono text-[11px] font-bold text-[#FB7185]">
                {results.missingOrders.length > 0
                  ? `m = ±${results.missingOrders.map((o) => o.m).join(', ±')}`
                  : 'None (non-integer)'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Where an interference maximum coincides exactly with a diffraction zero!
            </p>
          </div>
        </div>
      </div>

      {/* 2. LIVE OBSERVATION POINT P(y) DEEP INSPECTION */}
      <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-[#26364D] pb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#FBBF24]">
            <Activity className="w-4 h-4 text-[#FBBF24]" />
            <span>Detector Point P(y) Inspection</span>
          </div>
          <div
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              detector.condition === 'central_max'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : detector.condition === 'bright_max'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : detector.condition === 'dark_min'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : detector.condition === 'diffraction_zero'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'bg-slate-700/50 text-slate-300 border border-slate-600'
            }`}
          >
            {detector.condition === 'central_max'
              ? 'Central Max (m = 0)'
              : detector.condition === 'bright_max'
              ? `Bright Fringe (m = ${detector.nearestBrightOrder})`
              : detector.condition === 'dark_min'
              ? `Dark Fringe (m' = ${detector.nearestDarkOrder + 0.5})`
              : detector.condition === 'diffraction_zero'
              ? 'Diffraction Envelope Zero'
              : 'Intermediate Zone'}
          </div>
        </div>

        <div className="space-y-2 text-xs">
          {/* Coordinates and Angle */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#0B1728] p-2.5 rounded-lg border border-[#26364D]">
              <div className="text-[#94A3B8] text-[10px]">Position on Screen (y)</div>
              <div className="font-mono font-black text-sm text-[#F1F5F9] mt-0.5">
                {params.detectorYMm > 0 ? `+${params.detectorYMm.toFixed(2)}` : params.detectorYMm.toFixed(2)} mm
              </div>
            </div>

            <div className="bg-[#0B1728] p-2.5 rounded-lg border border-[#26364D]">
              <div className="text-[#94A3B8] text-[10px]">Diffraction Angle (θ)</div>
              <div className="font-mono font-black text-sm text-[#38BDF8] mt-0.5">
                {detector.thetaDeg.toFixed(3)}°
              </div>
              <div className="text-[9px] text-slate-500 font-mono">
                {(detector.thetaRad * 1000).toFixed(2)} mrad
              </div>
            </div>
          </div>

          {/* Path Difference Delta x */}
          <div className="bg-[#0B1728] p-2.5 rounded-lg border border-[#26364D] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[#94A3B8]">Path Difference (Δx = d sin θ):</span>
              <span className="font-mono font-bold text-[#FB7185]">
                {detector.pathDifferenceNm.toFixed(1)} nm
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
              <span>In units of wavelength (Δx / λ):</span>
              <strong className="text-white">{detector.pathDifferenceWavelengths.toFixed(3)} λ</strong>
            </div>
          </div>

          {/* Phase Difference Delta phi */}
          <div className="bg-[#0B1728] p-2.5 rounded-lg border border-[#26364D] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[#94A3B8]">Phase Difference (Δφ):</span>
              <span className="font-mono font-bold text-[#A78BFA]">
                {detector.phaseDifferenceDeg.toFixed(1)}° ({detector.phaseDifferenceRad.toFixed(2)} rad)
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Δφ = (2π / λ) × Δx = 2π × {detector.pathDifferenceWavelengths.toFixed(2)}
            </div>
          </div>

          {/* Normalized Intensity Readout */}
          <div className="bg-[#17263B] p-2.5 rounded-lg border border-[#26364D] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold">Total Normalized Intensity I/I₀:</span>
              <span className="font-mono font-black text-sm text-[#34D399]">
                {(detector.normalizedIntensity * 100).toFixed(1)}%
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-[#0B1728] h-2 rounded-full overflow-hidden border border-[#26364D]">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-[#38BDF8] rounded-full transition-all duration-150"
                style={{ width: `${Math.min(100, detector.normalizedIntensity * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 font-mono">
              <span>Diffraction factor: {(detector.diffractionFactor * 100).toFixed(0)}%</span>
              <span>Interference factor: {(detector.interferenceFactor * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PHASOR DIAGRAM & WAVE ELECTRODYNAMICS */}
      <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-[#26364D] pb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#A78BFA]">
            <Zap className="w-4 h-4 text-[#A78BFA]" />
            <span>Phasor Diagram & Wave Electrodynamics</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">E₁ + E₂ = E_R</span>
        </div>

        {/* Phasor Visualizer SVG */}
        <div className="flex items-center justify-center bg-[#0A1526] rounded-lg border border-[#26364D] p-2">
          <svg width={phasorSize} height={phasorSize} className="overflow-visible select-none">
            {/* Coordinate axes */}
            <line
              x1={phasorCenter - 55}
              y1={phasorCenter}
              x2={phasorCenter + 55}
              y2={phasorCenter}
              stroke="#1E293B"
              strokeWidth="1"
            />
            <line
              x1={phasorCenter}
              y1={phasorCenter - 55}
              x2={phasorCenter}
              y2={phasorCenter + 55}
              stroke="#1E293B"
              strokeWidth="1"
            />

            {/* Reference unit circle */}
            <circle
              cx={phasorCenter}
              cy={phasorCenter}
              r={phasorScale}
              fill="none"
              stroke="#1E293B"
              strokeWidth="1"
              strokeDasharray="2 2"
            />

            {/* Vector E1 (horizontal reference along x-axis) */}
            <line
              x1={phasorCenter}
              y1={phasorCenter}
              x2={e1End.x}
              y2={e1End.y}
              stroke="#FBBF24"
              strokeWidth="2.5"
            />
            <circle cx={e1End.x} cy={e1End.y} r="3" fill="#FBBF24" />

            {/* Vector E2 (starting at end of E1, rotated by delta phi) */}
            <line
              x1={e1End.x}
              y1={e1End.y}
              x2={e2End.x}
              y2={e2End.y}
              stroke="#38BDF8"
              strokeWidth="2.5"
            />
            <circle cx={e2End.x} cy={e2End.y} r="3" fill="#38BDF8" />

            {/* Resultant Vector E_R (from origin to end of E2) */}
            <line
              x1={phasorCenter}
              y1={phasorCenter}
              x2={resultantEnd.x}
              y2={resultantEnd.y}
              stroke="#FB7185"
              strokeWidth="2.5"
              strokeDasharray={detector.phasorResultant.magnitude < 0.1 ? '2 2' : undefined}
            />
            <circle cx={resultantEnd.x} cy={resultantEnd.y} r="3.5" fill="#FB7185" />

            {/* Labels */}
            <text x={phasorCenter + 12} y={phasorCenter + 12} className="fill-[#FBBF24] font-mono text-[9px] font-bold">
              E₁
            </text>
            <text x={e1End.x + 4} y={e1End.y - 4} className="fill-[#38BDF8] font-mono text-[9px] font-bold">
              E₂
            </text>
            <text x={resultantEnd.x + 4} y={resultantEnd.y + 4} className="fill-[#FB7185] font-mono text-[9px] font-bold">
              E_R
            </text>
          </svg>
        </div>

        {/* Phasor Quantitative Values */}
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between bg-[#0B1728] p-2 rounded border border-[#26364D]">
            <span className="text-[#94A3B8]">Resultant Field Amplitude |E_R|:</span>
            <span className="font-mono font-bold text-[#FB7185]">
              {detector.phasorResultant.magnitude.toFixed(2)} E₀
            </span>
          </div>
          <div className="flex items-center justify-between bg-[#0B1728] p-2 rounded border border-[#26364D]">
            <span className="text-[#94A3B8]">Optical Frequency (f):</span>
            <span className="font-mono font-bold text-slate-200">
              {results.frequencyThz.toFixed(1)} THz
            </span>
          </div>
          <div className="flex items-center justify-between bg-[#0B1728] p-2 rounded border border-[#26364D]">
            <span className="text-[#94A3B8]">Photon Energy (hν):</span>
            <span className="font-mono font-bold text-[#A78BFA]">
              {results.photonEnergyEv.toFixed(3)} eV
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
