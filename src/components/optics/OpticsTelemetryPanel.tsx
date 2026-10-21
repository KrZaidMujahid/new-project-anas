/**
 * EQUATION 1 — Optics Telemetry & Scientific Measurements Panel
 * Real-time quantitative electrodynamic readouts, Snell's law verification,
 * and wave property invariants.
 */

import React from 'react';
import {
  Activity,
  Calculator,
  Compass,
  Zap,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertOctagon,
  Sparkles,
} from 'lucide-react';
import {
  SnellParameters,
  PlanarOpticsResult,
  SlabOpticsResult,
  PrismOpticsResult,
  FiberOpticsResult,
} from '../../physics/optics/types';

interface OpticsTelemetryPanelProps {
  params: SnellParameters;
  planarResult: PlanarOpticsResult;
  slabResult: SlabOpticsResult;
  prismResult: PrismOpticsResult;
  fiberResult: FiberOpticsResult;
}

export const OpticsTelemetryPanel: React.FC<OpticsTelemetryPanelProps> = ({
  params,
  planarResult,
  slabResult,
  prismResult,
  fiberResult,
}) => {
  const sin1 = Math.sin(planarResult.theta1Rad);
  const n1Sin1 = planarResult.n1 * sin1;

  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-6 text-[#F1F5F9]">
      {/* 1. Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#26364D]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#34D399]/10 border border-[#34D399]/30 flex items-center justify-center text-[#34D399]">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-wide uppercase text-[#F1F5F9]">
              Optical Telemetry &amp; Invariants
            </h2>
            <p className="text-[11px] text-[#94A3B8]">
              Live quantitative verification of Snell's Law and wave properties
            </p>
          </div>
        </div>

        {/* State Badge */}
        {planarResult.isTIR ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FB7185]/20 border border-[#FB7185] text-[#FB7185] text-xs font-black animate-pulse">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>TIR ACTIVE (100% REFLECTION)</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#34D399]/20 border border-[#34D399] text-[#34D399] text-xs font-black">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>REFRACTION REGIME</span>
          </div>
        )}
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Metric 1: Incidence Angle */}
        <div className="bg-[#17263B] p-3.5 rounded-lg border border-[#26364D] space-y-1">
          <div className="text-[10px] uppercase font-mono font-bold text-[#FBBF24]">
            Angle of Incidence (θ₁)
          </div>
          <div className="text-xl font-mono font-black text-[#F1F5F9]">
            {planarResult.theta1Deg.toFixed(1)}°
          </div>
          <div className="text-[10px] text-[#94A3B8] font-mono">
            sin(θ₁) = {sin1.toFixed(4)}
          </div>
        </div>

        {/* Metric 2: Refraction Angle */}
        <div className="bg-[#17263B] p-3.5 rounded-lg border border-[#26364D] space-y-1">
          <div className="text-[10px] uppercase font-mono font-bold text-[#38BDF8]">
            Angle of Refraction (θ₂)
          </div>
          <div className="text-xl font-mono font-black text-[#F1F5F9]">
            {planarResult.isTIR ? (
              <span className="text-[#FB7185]">None (TIR)</span>
            ) : (
              `${planarResult.theta2Deg?.toFixed(1)}°`
            )}
          </div>
          <div className="text-[10px] text-[#94A3B8] font-mono">
            {planarResult.theta2Rad !== null
              ? `sin(θ₂) = ${Math.sin(planarResult.theta2Rad).toFixed(4)}`
              : 'Ray completely reflected'}
          </div>
        </div>

        {/* Metric 3: Critical Angle */}
        <div className="bg-[#17263B] p-3.5 rounded-lg border border-[#26364D] space-y-1">
          <div className="text-[10px] uppercase font-mono font-bold text-[#A78BFA]">
            Critical Angle (θ_c)
          </div>
          <div className="text-xl font-mono font-black text-[#F1F5F9]">
            {planarResult.criticalAngleDeg !== null ? (
              `${planarResult.criticalAngleDeg.toFixed(1)}°`
            ) : (
              <span className="text-xs text-[#94A3B8]">N/A (n₁ ≤ n₂)</span>
            )}
          </div>
          <div className="text-[10px] text-[#94A3B8] font-mono">
            {planarResult.criticalAngleDeg !== null
              ? `arcsin(n₂/n₁) = ${(planarResult.n2 / planarResult.n1).toFixed(4)}`
              : 'Only occurs from dense to rare'}
          </div>
        </div>

        {/* Metric 4: Brewster Angle */}
        <div className="bg-[#17263B] p-3.5 rounded-lg border border-[#26364D] space-y-1">
          <div className="text-[10px] uppercase font-mono font-bold text-[#34D399]">
            Brewster's Angle (θ_B)
          </div>
          <div className="text-xl font-mono font-black text-[#F1F5F9]">
            {planarResult.brewsterAngleDeg.toFixed(1)}°
          </div>
          <div className="text-[10px] text-[#94A3B8] font-mono">
            tan(θ_B) = (n₂/n₁) | 100% Polarized
          </div>
        </div>
      </div>

      {/* 3. Snell's Law Equation Substitution Card */}
      <div className="bg-[#0B1728] rounded-xl p-4 border border-[#26364D] space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-[#38BDF8]">
          <div className="flex items-center gap-1.5">
            <Calculator className="w-4 h-4" />
            <span>Snell's Law Balance Verification</span>
          </div>
          <span className="font-mono text-[11px] text-[#94A3B8]">
            n₁ · sin(θ₁) = n₂ · sin(θ₂)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center text-center">
          {/* LHS */}
          <div className="bg-[#17263B] p-3 rounded-lg border border-[#26364D]">
            <div className="text-[11px] text-[#FBBF24] font-bold">Medium 1 (LHS)</div>
            <div className="text-sm font-mono font-black text-[#F1F5F9] mt-0.5">
              {planarResult.n1.toFixed(3)} × {sin1.toFixed(4)}
            </div>
            <div className="text-xs font-mono font-extrabold text-[#FBBF24] mt-1">
              = {n1Sin1.toFixed(4)}
            </div>
          </div>

          {/* Equal Sign / Status */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-[#101D30] border border-[#26364D] flex items-center justify-center text-sm font-black font-mono text-[#38BDF8]">
              {planarResult.isTIR ? '≠' : '='}
            </div>
            <span className="text-[10px] font-mono text-[#94A3B8] mt-1">
              {planarResult.isTIR ? 'TIR: LHS > n₂' : 'Constant Optical Invariant'}
            </span>
          </div>

          {/* RHS */}
          <div className="bg-[#17263B] p-3 rounded-lg border border-[#26364D]">
            <div className="text-[11px] text-[#34D399] font-bold">Medium 2 (RHS)</div>
            <div className="text-sm font-mono font-black text-[#F1F5F9] mt-0.5">
              {planarResult.isTIR ? (
                <span className="text-[#FB7185]">Exceeds max (n₂ = {planarResult.n2.toFixed(3)})</span>
              ) : (
                `${planarResult.n2.toFixed(3)} × ${planarResult.theta2Rad !== null ? Math.sin(planarResult.theta2Rad).toFixed(4) : '0'}`
              )}
            </div>
            <div className="text-xs font-mono font-extrabold text-[#34D399] mt-1">
              = {planarResult.isTIR ? 'Undefined in Real Realm' : (planarResult.n2 * (planarResult.theta2Rad !== null ? Math.sin(planarResult.theta2Rad) : 0)).toFixed(4)}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Speed, Wavelength & Frequency Comparison */}
      <div className="bg-[#17263B] rounded-xl p-4 border border-[#26364D] space-y-3">
        <span className="text-xs font-black uppercase tracking-wider text-[#F1F5F9] flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-[#FBBF24]" />
          <span>Wave Kinematics across the Interface</span>
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          {/* Speeds */}
          <div className="bg-[#0A1526] p-3 rounded-lg border border-[#26364D] space-y-1">
            <div className="text-[#94A3B8] font-sans text-[11px]">Phase Velocity:</div>
            <div className="text-[#FBBF24]">v₁: {(planarResult.v1 / 1e8).toFixed(3)} × 10⁸ m/s</div>
            <div className="text-[#38BDF8]">v₂: {(planarResult.v2 / 1e8).toFixed(3)} × 10⁸ m/s</div>
            <div className="text-[10px] text-[#34D399] pt-1">
              v₂/v₁ = {(planarResult.v2 / planarResult.v1).toFixed(3)}
            </div>
          </div>

          {/* Wavelengths */}
          <div className="bg-[#0A1526] p-3 rounded-lg border border-[#26364D] space-y-1">
            <div className="text-[#94A3B8] font-sans text-[11px]">Wavelength in Media:</div>
            <div className="text-[#FBBF24]">λ₁: {planarResult.lambda1Nm.toFixed(1)} nm</div>
            <div className="text-[#38BDF8]">λ₂: {planarResult.lambda2Nm.toFixed(1)} nm</div>
            <div className="text-[10px] text-[#34D399] pt-1">
              λ₂/λ₁ = {(planarResult.lambda2Nm / planarResult.lambda1Nm).toFixed(3)}
            </div>
          </div>

          {/* Invariant Frequency */}
          <div className="bg-[#0A1526] p-3 rounded-lg border border-[#26364D] space-y-1">
            <div className="text-[#94A3B8] font-sans text-[11px]">Temporal Frequency:</div>
            <div className="text-[#F1F5F9] font-bold">f: {planarResult.frequencyTHz.toFixed(2)} THz</div>
            <div className="text-[#34D399] text-[10px] leading-tight pt-1">
              Strictly invariant! Oscillating atoms at boundary drive same frequency in both media.
            </div>
          </div>
        </div>
      </div>

      {/* 5. Fresnel Power Distribution (Reflectance vs Transmittance) */}
      <div className="bg-[#17263B] rounded-xl p-4 border border-[#26364D] space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#F1F5F9]">Optical Energy Conservation</span>
          <span className="font-mono text-[#94A3B8]">
            R = {(planarResult.fresnel.rUnpolarized * 100).toFixed(1)}% | T = {(planarResult.fresnel.tUnpolarized * 100).toFixed(1)}%
          </span>
        </div>

        {/* Dual Color Progress Bar */}
        <div className="w-full h-3 rounded-full bg-[#0A1526] overflow-hidden flex border border-[#26364D]">
          <div
            className="h-full bg-[#F97316] transition-all duration-200"
            style={{ width: `${planarResult.fresnel.rUnpolarized * 100}%` }}
            title={`Reflected Energy: ${(planarResult.fresnel.rUnpolarized * 100).toFixed(1)}%`}
          />
          <div
            className="h-full bg-[#38BDF8] transition-all duration-200"
            style={{ width: `${planarResult.fresnel.tUnpolarized * 100}%` }}
            title={`Transmitted Energy: ${(planarResult.fresnel.tUnpolarized * 100).toFixed(1)}%`}
          />
        </div>

        <div className="flex justify-between text-[10px] font-mono">
          <span className="text-[#F97316]">Reflected Power R (Orange)</span>
          <span className="text-[#38BDF8]">Transmitted Power T (Cyan)</span>
        </div>
      </div>

      {/* 6. Geometry-Specific Telemetry */}
      {params.geometry === 'slab' && (
        <div className="bg-[#0B1728] p-4 rounded-xl border border-[#26364D] space-y-2">
          <div className="text-xs font-bold text-[#38BDF8]">Parallel Slab Lateral Shift Results</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="bg-[#17263B] p-2 rounded">
              <span className="text-[#94A3B8] block text-[10px]">Lateral Shift (d):</span>
              <strong className="text-[#FB7185]">{slabResult.lateralShiftMm.toFixed(2)} mm</strong>
            </div>
            <div className="bg-[#17263B] p-2 rounded">
              <span className="text-[#94A3B8] block text-[10px]">Geometric Path (L):</span>
              <strong className="text-[#F1F5F9]">{slabResult.pathLengthInsideMm.toFixed(2)} mm</strong>
            </div>
            <div className="bg-[#17263B] p-2 rounded">
              <span className="text-[#94A3B8] block text-[10px]">Optical Path (OPL):</span>
              <strong className="text-[#38BDF8]">{slabResult.opticalPathLengthMm.toFixed(2)} mm</strong>
            </div>
            <div className="bg-[#17263B] p-2 rounded">
              <span className="text-[#94A3B8] block text-[10px]">Transit Time (Δt):</span>
              <strong className="text-[#FBBF24]">{slabResult.timeInsidePicoseconds.toFixed(2)} ps</strong>
            </div>
          </div>
        </div>
      )}

      {params.geometry === 'prism' && (
        <div className="bg-[#0B1728] p-4 rounded-xl border border-[#26364D] space-y-2">
          <div className="text-xs font-bold text-[#FBBF24]">Triangular Prism Optics Results</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="bg-[#17263B] p-2 rounded">
              <span className="text-[#94A3B8] block text-[10px]">Deviation Angle (δ):</span>
              <strong className="text-[#FBBF24]">
                {prismResult.deviationAngleDeg !== null ? `${prismResult.deviationAngleDeg.toFixed(1)}°` : 'TIR'}
              </strong>
            </div>
            <div className="bg-[#17263B] p-2 rounded">
              <span className="text-[#94A3B8] block text-[10px]">Minimum Deviation (δ_m):</span>
              <strong className="text-[#34D399]">{prismResult.minimumDeviationAngleDeg.toFixed(1)}°</strong>
            </div>
            <div className="bg-[#17263B] p-2 rounded">
              <span className="text-[#94A3B8] block text-[10px]">Angle at δ_m (i):</span>
              <strong className="text-[#38BDF8]">{prismResult.angleForMinDeviationDeg.toFixed(1)}°</strong>
            </div>
            <div className="bg-[#17263B] p-2 rounded">
              <span className="text-[#94A3B8] block text-[10px]">Prism Base Index (n):</span>
              <strong className="text-[#A78BFA]">{prismResult.nPrismBase.toFixed(3)}</strong>
            </div>
          </div>
        </div>
      )}

      {params.geometry === 'fiber' && (
        <div className="bg-[#0B1728] p-4 rounded-xl border border-[#26364D] space-y-2">
          <div className="text-xs font-bold text-[#A78BFA]">Optical Fiber Waveguide Telemetry</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="bg-[#17263B] p-2 rounded">
              <span className="text-[#94A3B8] block text-[10px]">Numerical Aperture (NA):</span>
              <strong className="text-[#38BDF8]">{fiberResult.numericalAperture.toFixed(3)}</strong>
            </div>
            <div className="bg-[#17263B] p-2 rounded">
              <span className="text-[#94A3B8] block text-[10px]">Acceptance Angle (θ_a):</span>
              <strong className="text-[#FBBF24]">{fiberResult.acceptanceAngleDeg.toFixed(1)}°</strong>
            </div>
            <div className="bg-[#17263B] p-2 rounded">
              <span className="text-[#94A3B8] block text-[10px]">Core-Clad Critical θ_c:</span>
              <strong className="text-[#A78BFA]">{fiberResult.criticalAngleCoreCladDeg.toFixed(1)}°</strong>
            </div>
            <div className="bg-[#17263B] p-2 rounded">
              <span className="text-[#94A3B8] block text-[10px]">Waveguide Status:</span>
              <strong className={fiberResult.willPropagate ? 'text-[#34D399]' : 'text-[#FB7185]'}>
                {fiberResult.willPropagate ? 'Lossless Guided' : 'Leaking Ray'}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
