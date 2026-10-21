/**
 * EQUATION 1 — Wave Interference Live Telemetry & Measurements Panel
 * Real-time physical quantities, exact analytical invariants, path differences,
 * phase shifts, and interference condition classifications with SI units.
 */

import React from 'react';
import {
  WaveExperimentMode,
  WaveSuperpositionParameters,
  TwoSourceParameters,
  PointInterferenceAnalysis,
} from '../../physics/waves/types';
import {
  calculateWaveNumber,
  calculateAngularFrequency,
  calculatePeriod,
  calculateWaveSpeed,
  calculateSinusoidalDisplacement,
  calculateSuperposition,
  calculateResultantAmplitude,
} from '../../physics/waves/model';
import { Activity, Radio, Waves, ShieldCheck } from 'lucide-react';

interface WaveMeasurementsProps {
  mode: WaveExperimentMode;
  superpositionParams: WaveSuperpositionParameters;
  twoSourceParams: TwoSourceParameters;
  analysis: PointInterferenceAnalysis;
  time: number;
}

export const WaveMeasurements: React.FC<WaveMeasurementsProps> = ({
  mode,
  superpositionParams,
  twoSourceParams,
  analysis,
  time,
}) => {
  // Superposition derived values
  const k1 = calculateWaveNumber(superpositionParams.wave1.wavelength);
  const k2 = calculateWaveNumber(superpositionParams.wave2.wavelength);
  const omega1 = calculateAngularFrequency(superpositionParams.wave1.frequency);
  const omega2 = calculateAngularFrequency(superpositionParams.wave2.frequency);
  const t1 = calculatePeriod(superpositionParams.wave1.frequency);
  const t2 = calculatePeriod(superpositionParams.wave2.frequency);
  const v1 = calculateWaveSpeed(superpositionParams.wave1.frequency, superpositionParams.wave1.wavelength);
  const v2 = calculateWaveSpeed(superpositionParams.wave2.frequency, superpositionParams.wave2.wavelength);

  const deltaPhiDeg = superpositionParams.wave2.initialPhaseDeg - superpositionParams.wave1.initialPhaseDeg;
  const deltaPhiRad = (deltaPhiDeg * Math.PI) / 180;
  const theoreticalAR = calculateResultantAmplitude(
    superpositionParams.wave1.amplitude,
    superpositionParams.wave2.amplitude,
    deltaPhiRad
  );

  const probeY1 = calculateSinusoidalDisplacement(
    superpositionParams.wave1.amplitude,
    k1,
    omega1,
    (superpositionParams.wave1.initialPhaseDeg * Math.PI) / 180,
    superpositionParams.probeX,
    time,
    superpositionParams.wave1.direction
  );
  const probeY2 = calculateSinusoidalDisplacement(
    superpositionParams.wave2.amplitude,
    k2,
    omega2,
    (superpositionParams.wave2.initialPhaseDeg * Math.PI) / 180,
    superpositionParams.probeX,
    time,
    superpositionParams.wave2.direction
  );
  const probeYR = calculateSuperposition(probeY1, probeY2);

  return (
    <div className="bg-[#090d16] border border-slate-800/90 rounded-xl p-4 sm:p-5 select-none space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold text-white tracking-wider uppercase font-mono">
            {mode === 'superposition' ? 'Superposition Live Measurements' : 'Interference Telemetry & Point Analysis'}
          </h2>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>t = {time.toFixed(2)} s</span>
        </div>
      </div>

      {/* ---------------- SUPERPOSITION TELEMETRY ---------------- */}
      {mode === 'superposition' && (
        <div className="space-y-3">
          {/* Main 4-Box KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* 1. Resultant Amplitude */}
            <div className="bg-[#07090e] border border-slate-800/90 rounded-lg p-2.5 space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider block">
                Resultant Amp (A_R)
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-base sm:text-lg font-bold font-mono text-amber-400 tabular-nums">
                  {theoreticalAR.toFixed(3)}
                </span>
                <span className="text-xs font-mono text-slate-400">m</span>
              </div>
              <span className="text-[10px] text-slate-500 block truncate">
                Peak: A₁ + A₂ = {(superpositionParams.wave1.amplitude + superpositionParams.wave2.amplitude).toFixed(2)}m
              </span>
            </div>

            {/* 2. Probe y_R */}
            <div className="bg-[#07090e] border border-slate-800/90 rounded-lg p-2.5 space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider block">
                Disp. at Probe (y_R)
              </span>
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-base sm:text-lg font-bold font-mono tabular-nums ${
                    probeYR >= 0 ? 'text-amber-300' : 'text-amber-500'
                  }`}
                >
                  {probeYR >= 0 ? '+' : ''}
                  {probeYR.toFixed(3)}
                </span>
                <span className="text-xs font-mono text-slate-400">m</span>
              </div>
              <span className="text-[10px] text-slate-500 block truncate">
                at x = {superpositionParams.probeX.toFixed(2)}m
              </span>
            </div>

            {/* 3. Phase Shift */}
            <div className="bg-[#07090e] border border-slate-800/90 rounded-lg p-2.5 space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider block">
                Phase Shift (Δφ)
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-base sm:text-lg font-bold font-mono text-white tabular-nums">
                  {deltaPhiDeg.toFixed(0)}°
                </span>
                <span className="text-xs font-mono text-slate-400">
                  ({deltaPhiRad.toFixed(2)} rad)
                </span>
              </div>
              <span className="text-[10px] text-cyan-400 block truncate">
                {Math.abs(deltaPhiDeg) < 5
                  ? 'Constructive (in phase)'
                  : Math.abs(Math.abs(deltaPhiDeg) - 180) < 5
                  ? 'Destructive (out of phase)'
                  : 'Partial interference'}
              </span>
            </div>

            {/* 4. Speed */}
            <div className="bg-[#07090e] border border-slate-800/90 rounded-lg p-2.5 space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider block">
                Wave Speed (v)
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-base sm:text-lg font-bold font-mono text-cyan-400 tabular-nums">
                  {v1.toFixed(2)}
                </span>
                <span className="text-xs font-mono text-slate-400">m/s</span>
              </div>
              <span className="text-[10px] text-slate-500 block truncate">
                v = fλ
              </span>
            </div>
          </div>

          {/* Detailed Dual-Wave Metrics Table */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 bg-cyan-950/20 border border-cyan-500/20 rounded-lg space-y-1">
              <span className="text-cyan-400 font-bold block text-[11px]">Wave 1 (Cyan):</span>
              <div className="text-slate-300 flex justify-between">
                <span>Amplitude A₁:</span>
                <span className="text-white">{superpositionParams.wave1.amplitude.toFixed(2)} m</span>
              </div>
              <div className="text-slate-300 flex justify-between">
                <span>Wavelength λ₁:</span>
                <span className="text-white">{superpositionParams.wave1.wavelength.toFixed(2)} m</span>
              </div>
              <div className="text-slate-300 flex justify-between">
                <span>Frequency f₁:</span>
                <span className="text-white">{superpositionParams.wave1.frequency.toFixed(2)} Hz</span>
              </div>
              <div className="text-slate-300 flex justify-between">
                <span>Wave number k₁:</span>
                <span className="text-white">{k1.toFixed(2)} rad/m</span>
              </div>
            </div>

            <div className="p-2.5 bg-purple-950/20 border border-purple-500/20 rounded-lg space-y-1">
              <span className="text-purple-400 font-bold block text-[11px]">Wave 2 (Violet):</span>
              <div className="text-slate-300 flex justify-between">
                <span>Amplitude A₂:</span>
                <span className="text-white">{superpositionParams.wave2.amplitude.toFixed(2)} m</span>
              </div>
              <div className="text-slate-300 flex justify-between">
                <span>Wavelength λ₂:</span>
                <span className="text-white">{superpositionParams.wave2.wavelength.toFixed(2)} m</span>
              </div>
              <div className="text-slate-300 flex justify-between">
                <span>Frequency f₂:</span>
                <span className="text-white">{superpositionParams.wave2.frequency.toFixed(2)} Hz</span>
              </div>
              <div className="text-slate-300 flex justify-between">
                <span>Wave number k₂:</span>
                <span className="text-white">{k2.toFixed(2)} rad/m</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- TWO-SOURCE & ANALYSIS TELEMETRY ---------------- */}
      {mode !== 'superposition' && (
        <div className="space-y-3">
          {/* Main 4-Box KPI Grid for Probe Point P */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* 1. Path Difference */}
            <div className="bg-[#07090e] border border-slate-800/90 rounded-lg p-2.5 space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider block">
                Path Diff (Δr = r₂ - r₁)
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-base sm:text-lg font-bold font-mono text-white tabular-nums">
                  {analysis.pathDifference >= 0 ? '+' : ''}
                  {analysis.pathDifference.toFixed(3)}
                </span>
                <span className="text-xs font-mono text-slate-400">m</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-mono block truncate">
                = {analysis.pathDifferenceInWavelengths.toFixed(2)} λ
              </span>
            </div>

            {/* 2. Effective Phase Difference */}
            <div className="bg-[#07090e] border border-slate-800/90 rounded-lg p-2.5 space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider block">
                Effective Phase (ΔΦ)
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-base sm:text-lg font-bold font-mono text-purple-300 tabular-nums">
                  {analysis.effectivePhaseDiffDeg.toFixed(1)}°
                </span>
                <span className="text-xs font-mono text-slate-400">
                  ({(analysis.effectivePhaseDiffRad / Math.PI).toFixed(2)}π)
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono block truncate">
                ΔΦ = kΔr + Δφ₀
              </span>
            </div>

            {/* 3. Interference Condition Badge */}
            <div className="bg-[#07090e] border border-slate-800/90 rounded-lg p-2.5 space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider block">
                Interference State
              </span>
              <div className="flex items-center gap-1.5 pt-0.5">
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                    analysis.classification === 'constructive'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                      : analysis.classification === 'destructive'
                      ? 'bg-rose-950 text-rose-300 border border-rose-500/50'
                      : 'bg-amber-950 text-amber-300 border border-amber-500/50'
                  }`}
                >
                  {analysis.classification.toUpperCase()}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono block truncate">
                Fringe Order n ≈ {analysis.orderN}
              </span>
            </div>

            {/* 4. Local Relative Intensity */}
            <div className="bg-[#07090e] border border-slate-800/90 rounded-lg p-2.5 space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider block">
                Intensity at P (I/I₀)
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-base sm:text-lg font-bold font-mono text-amber-400 tabular-nums">
                  {analysis.relativeIntensity.toFixed(2)}
                </span>
                <span className="text-xs font-mono text-slate-400">/ 4.0</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono block truncate">
                Local A_R = {analysis.resultantAmplitude.toFixed(3)} m
              </span>
            </div>
          </div>

          {/* Point P Displacements & Ray Distances Strip */}
          <div className="p-3 bg-[#07090e] border border-slate-800 rounded-lg text-xs font-mono space-y-1.5">
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Distance to S₁ (r₁): <strong className="text-cyan-300">{analysis.r1.toFixed(3)} m</strong></span>
              <span>Distance to S₂ (r₂): <strong className="text-purple-300">{analysis.r2.toFixed(3)} m</strong></span>
              <span>Probe Coordinates: <strong className="text-white">({twoSourceParams.probePoint.x.toFixed(2)}m, {twoSourceParams.probePoint.y.toFixed(2)}m)</strong></span>
            </div>
            <div className="flex justify-between text-slate-300 border-t border-slate-800/80 pt-1.5">
              <span>Instantaneous y₁(P): <strong className="text-cyan-400">{analysis.y1Instantaneous >= 0 ? '+' : ''}{analysis.y1Instantaneous.toFixed(3)} m</strong></span>
              <span>Instantaneous y₂(P): <strong className="text-purple-400">{analysis.y2Instantaneous >= 0 ? '+' : ''}{analysis.y2Instantaneous.toFixed(3)} m</strong></span>
              <span>Instantaneous Resultant y_R(P): <strong className="text-amber-400">{analysis.yResultantInstantaneous >= 0 ? '+' : ''}{analysis.yResultantInstantaneous.toFixed(3)} m</strong></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
