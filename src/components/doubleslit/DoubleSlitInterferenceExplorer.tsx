/**
 * EQUATION 1 — Wave Interference Explorer
 * Part 11: Deep Inspection of Constructive and Destructive Interference
 *
 * Implements:
 * - Position y inspector slider and quick buttons to maxima/minima
 * - Path difference: δ ≈ dy / L (displayed in nm and μm)
 * - Phase difference: Δφ = 2πδ / λ (in radians and degrees)
 * - Strict 3-state classification: Constructive, Destructive, or Intermediate
 * - Live animated SVG wave arrival diagram:
 *   - Wave 1 from Slit 1
 *   - Wave 2 from Slit 2 with relative phase shift Δφ
 *   - Superposition Resultant Wave showing constructive reinforcement or destructive cancellation
 */

import React, { useMemo, useState, useEffect } from 'react';
import {
  DoubleSlitParameters,
  DoubleSlitPhysicsResults,
} from '../../physics/doubleslit/types';
import {
  Compass,
  Zap,
  Activity,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Layers,
} from 'lucide-react';

interface InterferenceExplorerProps {
  params: DoubleSlitParameters;
  results: DoubleSlitPhysicsResults;
  onSetDetectorY: (yMm: number) => void;
}

export const DoubleSlitInterferenceExplorer: React.FC<InterferenceExplorerProps> = ({
  params,
  results,
  onSetDetectorY,
}) => {
  const [wavePhaseAnim, setWavePhaseAnim] = useState<number>(0);

  useEffect(() => {
    let animId: number;
    const animate = () => {
      setWavePhaseAnim((prev) => (prev + 0.08) % (2 * Math.PI));
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  const { detector } = results;
  const yMm = params.detectorYMm;
  const n = Math.max(1.0, params.mediumRefractiveIndex);
  const lambdaEffNm = params.wavelengthNm / n;
  const dM = params.slitSeparationMm * 1e-3;
  const LM = params.screenDistanceM;

  // Far field calculations
  const pathDiffNm = detector.pathDifferenceNm;
  const pathDiffUm = pathDiffNm / 1000;
  const phaseDiffRad = detector.phaseDifferenceRad;
  const phaseDiffDeg = (phaseDiffRad * 180) / Math.PI;

  // Path difference in units of wavelength: delta / lambda
  const pathDiffWavelengths = pathDiffNm / lambdaEffNm;
  const nearestInteger = Math.round(pathDiffWavelengths);
  const distToInt = Math.abs(pathDiffWavelengths - nearestInteger);
  const distToHalf = Math.abs(pathDiffWavelengths - (Math.floor(pathDiffWavelengths) + 0.5));

  // Classification with sensible numerical tolerance
  let classification: 'constructive' | 'destructive' | 'intermediate';
  let badgeText = '';
  let badgeColor = '';

  if (distToInt < 0.08) {
    classification = 'constructive';
    badgeText = `Constructive Interference (m = ${nearestInteger})`;
    badgeColor = 'bg-[#34D399]/20 text-[#34D399] border-[#34D399]';
  } else if (distToHalf < 0.08) {
    classification = 'destructive';
    badgeText = `Destructive Interference (Min = ${Math.floor(pathDiffWavelengths) + 0.5})`;
    badgeColor = 'bg-[#FB7185]/20 text-[#FB7185] border-[#FB7185]';
  } else {
    classification = 'intermediate';
    badgeText = 'Intermediate Superposition';
    badgeColor = 'bg-[#FBBF24]/20 text-[#FBBF24] border-[#FBBF24]';
  }

  // Generate SVG wave curves for the 3 traces: Wave 1, Wave 2, and Resultant
  const wavePoints = useMemo(() => {
    const steps = 120;
    const width = 360;
    const wave1D: string[] = [];
    const wave2D: string[] = [];
    const resultantD: string[] = [];

    const amp = 18; // amplitude in px

    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * width;
      const kx = (i / steps) * 4 * Math.PI; // 2 complete wave cycles
      const phi1 = kx - wavePhaseAnim;
      const phi2 = kx - wavePhaseAnim - phaseDiffRad;

      const y1 = Math.sin(phi1) * amp;
      const y2 = Math.sin(phi2) * amp;
      const yRes = (y1 + y2) * 0.75; // normalized resultant

      wave1D.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y1.toFixed(1)}`);
      wave2D.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y2.toFixed(1)}`);
      resultantD.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yRes.toFixed(1)}`);
    }

    return {
      w1: wave1D.join(' '),
      w2: wave2D.join(' '),
      res: resultantD.join(' '),
    };
  }, [phaseDiffRad, wavePhaseAnim]);

  // Jump helpers for quick exploration
  const jumpToOrder = (order: number) => {
    const yTarget = ((order * (lambdaEffNm * 1e-9) * LM) / dM) * 1000;
    onSetDetectorY(yTarget);
  };

  const jumpToDark = (order: number) => {
    const yTarget = (((order + 0.5) * (lambdaEffNm * 1e-9) * LM) / dM) * 1000;
    onSetDetectorY(yTarget);
  };

  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-5 text-[#F1F5F9]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#26364D] gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F1F5F9]">Constructive and Destructive Interference</h3>
            <p className="text-xs text-[#94A3B8]">
              Inspect phase relationship Δφ, path difference δ, and electric field vector superposition at point P(y).
            </p>
          </div>
        </div>

        {/* Classification Badge */}
        <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold font-mono tracking-wide ${badgeColor} self-start sm:self-center`}>
          {badgeText}
        </div>
      </div>

      {/* Point P(y) Position Slider & Jump Shortcuts */}
      <div className="bg-[#0B1728] p-4 rounded-lg border border-[#26364D] space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300">Observation Point Position on Screen (y):</span>
          <span className="font-mono font-bold text-base text-[#38BDF8]">
            {yMm > 0 ? `+${yMm.toFixed(2)}` : yMm.toFixed(2)} mm
          </span>
        </div>

        <input
          type="range"
          min="-25"
          max="25"
          step="0.05"
          value={yMm}
          onChange={(e) => onSetDetectorY(parseFloat(e.target.value))}
          className="w-full accent-[#38BDF8] cursor-pointer"
        />

        {/* Quick Jump Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[#94A3B8] text-[11px]">Quick Jump:</span>
          <button
            onClick={() => onSetDetectorY(0)}
            className="px-2 py-0.5 rounded bg-[#17263B] hover:bg-[#26364D] border border-[#26364D] text-[#38BDF8] font-mono cursor-pointer"
          >
            Central Max (y=0)
          </button>
          <button
            onClick={() => jumpToOrder(1)}
            className="px-2 py-0.5 rounded bg-[#17263B] hover:bg-[#26364D] border border-[#26364D] text-[#34D399] font-mono cursor-pointer"
          >
            +1st Bright (m=+1)
          </button>
          <button
            onClick={() => jumpToDark(0)}
            className="px-2 py-0.5 rounded bg-[#17263B] hover:bg-[#26364D] border border-[#26364D] text-[#FB7185] font-mono cursor-pointer"
          >
            1st Dark (0.5λ)
          </button>
          <button
            onClick={() => jumpToOrder(2)}
            className="px-2 py-0.5 rounded bg-[#17263B] hover:bg-[#26364D] border border-[#26364D] text-[#34D399] font-mono cursor-pointer"
          >
            +2nd Bright (m=+2)
          </button>
          <button
            onClick={() => jumpToDark(1)}
            className="px-2 py-0.5 rounded bg-[#17263B] hover:bg-[#26364D] border border-[#26364D] text-[#FB7185] font-mono cursor-pointer"
          >
            2nd Dark (1.5λ)
          </button>
        </div>
      </div>

      {/* Quantitative Path & Phase Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Path Difference */}
        <div className="bg-[#17263B] p-3.5 rounded-lg border border-[#26364D] space-y-1">
          <div className="text-[10px] text-[#94A3B8] uppercase font-semibold">Path Difference (δ ≈ dy/L)</div>
          <div className="font-mono font-bold text-lg text-[#FBBF24]">
            {Math.abs(pathDiffNm).toFixed(1)} nm
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            {Math.abs(pathDiffUm).toFixed(4)} μm ({Math.abs(pathDiffWavelengths).toFixed(3)} λ)
          </div>
        </div>

        {/* Phase Difference */}
        <div className="bg-[#17263B] p-3.5 rounded-lg border border-[#26364D] space-y-1">
          <div className="text-[10px] text-[#94A3B8] uppercase font-semibold">Phase Difference (Δφ = 2πδ/λ)</div>
          <div className="font-mono font-bold text-lg text-[#A78BFA]">
            {phaseDiffDeg.toFixed(1)}°
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            {phaseDiffRad.toFixed(3)} rad ({((phaseDiffDeg % 360 + 360) % 360).toFixed(0)}° mod 360°)
          </div>
        </div>

        {/* Normalized Intensity */}
        <div className="bg-[#17263B] p-3.5 rounded-lg border border-[#26364D] space-y-1">
          <div className="text-[10px] text-[#94A3B8] uppercase font-semibold">Normalized Intensity I(y)</div>
          <div className="font-mono font-bold text-lg text-[#38BDF8]">
            {(detector.normalizedIntensity * 100).toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Diffraction env: {(detector.diffractionFactor * 100).toFixed(0)}%
          </div>
        </div>

        {/* Wave Arrival Condition */}
        <div className="bg-[#17263B] p-3.5 rounded-lg border border-[#26364D] space-y-1">
          <div className="text-[10px] text-[#94A3B8] uppercase font-semibold">Superposition State</div>
          <div className="font-mono font-bold text-sm text-white mt-1 capitalize">
            {classification === 'constructive' && 'In Phase (0° / 360°)'}
            {classification === 'destructive' && 'Out of Phase (180°)'}
            {classification === 'intermediate' && 'Partial Phase Shift'}
          </div>
          <div className="text-[10px] text-slate-400">
            {classification === 'constructive' && 'Crests align with crests'}
            {classification === 'destructive' && 'Crest meets trough'}
            {classification === 'intermediate' && 'Partial cancellation'}
          </div>
        </div>
      </div>

      {/* Live Animated Wave Arrival & Superposition Visualizer */}
      <div className="bg-[#0B1728] p-4 rounded-lg border border-[#26364D] space-y-3">
        <div className="flex items-center justify-between text-xs pb-1 border-b border-[#26364D]">
          <span className="font-bold text-[#F1F5F9] flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#38BDF8]" />
            Waveform Arrival at Point P(y): Slit 1 (E₁), Slit 2 (E₂), and Resultant (E_R)
          </span>
          <span className="font-mono text-[10px] text-slate-400">
            Δφ = {phaseDiffDeg.toFixed(1)}°
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Wave from Slit 1 */}
          <div className="bg-[#101D30] p-3 rounded-lg border border-[#26364D] space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#FBBF24] font-bold">Wave 1 (from Slit 1)</span>
              <span className="font-mono text-slate-400 text-[10px]">φ₁ = 0</span>
            </div>
            <div className="h-14 flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 360 50" className="w-full h-full">
                <line x1="0" y1="25" x2="360" y2="25" stroke="#26364D" strokeWidth="1" strokeDasharray="2 2" />
                <g transform="translate(0, 25)">
                  <path d={wavePoints.w1} fill="none" stroke="#FBBF24" strokeWidth="2" />
                </g>
              </svg>
            </div>
          </div>

          {/* Wave from Slit 2 */}
          <div className="bg-[#101D30] p-3 rounded-lg border border-[#26364D] space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#38BDF8] font-bold">Wave 2 (from Slit 2)</span>
              <span className="font-mono text-[#A78BFA] text-[10px]">
                φ₂ = {phaseDiffDeg.toFixed(0)}°
              </span>
            </div>
            <div className="h-14 flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 360 50" className="w-full h-full">
                <line x1="0" y1="25" x2="360" y2="25" stroke="#26364D" strokeWidth="1" strokeDasharray="2 2" />
                <g transform="translate(0, 25)">
                  <path d={wavePoints.w2} fill="none" stroke="#38BDF8" strokeWidth="2" />
                </g>
              </svg>
            </div>
          </div>

          {/* Resultant Superposition Wave */}
          <div className="bg-[#101D30] p-3 rounded-lg border border-[#26364D] space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#34D399] font-bold">Resultant (E₁ + E₂)</span>
              <span className="font-mono text-[10px]" style={{ color: results.rgbColor }}>
                I ∝ |E_R|² = {(detector.normalizedIntensity * 100).toFixed(0)}%
              </span>
            </div>
            <div className="h-14 flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 360 50" className="w-full h-full">
                <line x1="0" y1="25" x2="360" y2="25" stroke="#26364D" strokeWidth="1" strokeDasharray="2 2" />
                <g transform="translate(0, 25)">
                  <path d={wavePoints.res} fill="none" stroke={results.rgbColor} strokeWidth="2.5" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
