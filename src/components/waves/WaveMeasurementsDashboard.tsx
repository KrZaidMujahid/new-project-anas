/**
 * EQUATION 1 — Real-Time Measurements Dashboard
 * High-precision telemetry panel displaying instantaneous experimental parameters,
 * wave kinematics, wavefront counts, and observation point P(x, y) interference diagnostics.
 */

import React from 'react';
import { TwoSourceParameters, PointInterferenceAnalysis } from '../../physics/waves/types';
import {
  Gauge,
  Crosshair,
  Sparkles,
  Waves,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  Compass,
} from 'lucide-react';

interface WaveMeasurementsDashboardProps {
  params: TwoSourceParameters;
  analysis: PointInterferenceAnalysis;
  time: number;
  isPlaying: boolean;
}

export const WaveMeasurementsDashboard: React.FC<WaveMeasurementsDashboardProps> = ({
  params,
  analysis,
  time,
  isPlaying,
}) => {
  const calculatedSpeed = params.frequency * params.wavelength;
  const maxRadiusM = Math.sqrt(
    params.fieldWidthMeters * params.fieldWidthMeters +
      (params.fieldHeightMeters / 2) * (params.fieldHeightMeters / 2)
  );
  const visibleWavefronts = Math.max(1, Math.round(maxRadiusM / params.wavelength));

  const isConstructive = analysis.classification === 'constructive';
  const isDestructive = analysis.classification === 'destructive';

  return (
    <div className="bg-[#101D30] border border-slate-800 rounded-xl p-4 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Real-Time Measurements Dashboard
            </h2>
            <p className="text-[11px] text-slate-400">
              Live telemetry & point observation interferometry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium ${
              isPlaying
                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            {isPlaying ? 'Running' : 'Paused'} • {time.toFixed(2)}s
          </span>
        </div>
      </div>

      {/* Grid of Global Experimental Measurements */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-2.5 rounded-lg bg-[#07111F] border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Frequency</span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-mono font-bold text-white">
              {params.frequency.toFixed(2)}
            </span>
            <span className="text-[10px] font-mono text-slate-500">Hz</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#07111F] border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Wavelength</span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-mono font-bold text-white">
              {params.wavelength.toFixed(2)}
            </span>
            <span className="text-[10px] font-mono text-slate-500">m</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#07111F] border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Wave Speed</span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-mono font-bold text-emerald-300">
              {calculatedSpeed.toFixed(2)}
            </span>
            <span className="text-[10px] font-mono text-slate-500">m/s</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#07111F] border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Visible Wavefronts</span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-mono font-bold text-cyan-300">
              ≈ {visibleWavefronts * 2}
            </span>
            <span className="text-[10px] font-mono text-slate-500">rings</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#07111F] border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Source Separation (d)</span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-mono font-bold text-white">
              {params.separation.toFixed(2)}
            </span>
            <span className="text-[10px] font-mono text-slate-500">m</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#07111F] border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Source Phase Diff</span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-mono font-bold text-white">
              {params.phaseDifferenceDeg.toFixed(0)}°
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              ({(params.phaseDifferenceDeg / 180).toFixed(2)}π)
            </span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#07111F] border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Single Amplitude</span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-mono font-bold text-white">
              {params.amplitude.toFixed(2)}
            </span>
            <span className="text-[10px] font-mono text-slate-500">a.u.</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#07111F] border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Active Mode</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-mono font-bold text-cyan-300 truncate">
              {params.activeVizMode}
            </span>
          </div>
        </div>
      </div>

      {/* Observation Point P Diagnostic Card */}
      <div className="p-3.5 rounded-xl bg-[#07111F] border border-cyan-500/30 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white">
              Observation Point P ({params.probePoint.x.toFixed(2)}m, {params.probePoint.y.toFixed(2)}m)
            </span>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border ${
              isConstructive
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/50'
                : isDestructive
                ? 'bg-rose-950/40 text-rose-300 border-rose-500/50'
                : 'bg-amber-950/40 text-amber-300 border-amber-500/50'
            }`}
          >
            {isConstructive ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : isDestructive ? (
              <XCircle className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>
              {isConstructive && `Constructive Interference (Order n = ${analysis.orderN})`}
              {isDestructive && `Destructive Interference (Order n = ${analysis.orderN}½)`}
              {!isConstructive && !isDestructive && 'Intermediate Interference'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-mono">Distance r₁ (from S₁):</span>
            <p className="font-mono font-semibold text-cyan-300">{analysis.r1.toFixed(3)} m</p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-mono">Distance r₂ (from S₂):</span>
            <p className="font-mono font-semibold text-purple-300">{analysis.r2.toFixed(3)} m</p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-mono">Path Difference (Δr):</span>
            <p className="font-mono font-bold text-yellow-300">
              {analysis.pathDifference >= 0 ? '+' : ''}
              {analysis.pathDifference.toFixed(3)} m
              <span className="text-slate-400 font-normal ml-1 text-[11px]">
                ({analysis.pathDifferenceInWavelengths.toFixed(2)}λ)
              </span>
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-mono">Total Phase Diff (Δφ):</span>
            <p className="font-mono font-bold text-white">
              {analysis.effectivePhaseDiffDeg.toFixed(1)}°
              <span className="text-slate-400 font-normal ml-1 text-[11px]">
                ({(analysis.effectivePhaseDiffRad / Math.PI).toFixed(2)}π)
              </span>
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-mono">Local Resultant Amplitude (A_r):</span>
            <p className="font-mono font-bold text-emerald-300">
              {analysis.resultantAmplitude.toFixed(3)} a.u.
              <span className="text-slate-400 font-normal ml-1 text-[11px]">
                (max 2A = {(params.amplitude * 2).toFixed(2)})
              </span>
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-mono">Relative Intensity (I/I_max):</span>
            <p className="font-mono font-bold text-cyan-300">
              {(analysis.relativeIntensity * 25).toFixed(1)}%
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-mono">Instantaneous y_R:</span>
            <p className="font-mono font-bold text-white">
              {analysis.yResultantInstantaneous >= 0 ? '+' : ''}
              {analysis.yResultantInstantaneous.toFixed(3)}
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-mono">Condition Check:</span>
            <p className="font-mono text-[11px] text-slate-300">
              {isConstructive && 'Δr ≈ nλ (In-phase)'}
              {isDestructive && 'Δr ≈ (n+½)λ (Antiphase)'}
              {!isConstructive && !isDestructive && 'General phase angle'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
