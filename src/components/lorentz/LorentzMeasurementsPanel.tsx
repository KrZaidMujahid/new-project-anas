/**
 * EQUATION 1 — Lorentz Force Telemetry & Kinematics Measurements
 * High-precision live metrics, cyclotron invariants, work-energy theorem display,
 * and physical status explanations.
 */

import React from 'react';
import {
  Activity,
  Gauge,
  Compass,
  Info,
  CheckCircle2,
  AlertCircle,
  Zap,
  ShieldAlert,
} from 'lucide-react';
import {
  LorentzParameters,
  LorentzDerivedValues,
} from '../../physics/lorentz/types';

interface LorentzMeasurementsPanelProps {
  params: LorentzParameters;
  derived: LorentzDerivedValues;
}

export const LorentzMeasurementsPanel: React.FC<LorentzMeasurementsPanelProps> = ({
  params,
  derived,
}) => {
  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-5 text-[#F1F5F9]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#26364D] pb-3">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-[#38BDF8]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9]">
            Live Measurements &amp; Invariants
          </h2>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#17263B] border border-[#26364D] text-xs font-mono text-[#38BDF8]">
          <Activity className="w-3 h-3 animate-pulse" />
          <span>Real-Time Telemetry</span>
        </div>
      </div>

      {/* Dynamic Status / Pedagogical Insight Banner */}
      <div className="p-3.5 rounded-lg bg-[#17263B] border border-[#26364D] flex items-start gap-3">
        <Info className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="text-xs font-bold text-[#F1F5F9] uppercase tracking-wide">
            Kinematic Regime Analysis
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            {derived.explanationText}
          </p>
        </div>
      </div>

      {/* Grid of Key Force Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Magnetic Force F_B */}
        <div className="p-3 rounded-lg bg-[#17263B] border border-[#26364D] space-y-1">
          <div className="text-[10px] uppercase font-bold text-[#FB7185] flex items-center justify-between">
            <span>Magnetic Force |F_B|</span>
            <span className="font-mono text-[#94A3B8]">q(v × B)</span>
          </div>
          <div className="text-base sm:text-lg font-mono font-black text-[#FB7185]">
            {derived.magneticForceMagnitude.toExponential(2)} N
          </div>
          <div className="text-[10px] text-[#94A3B8] font-mono">
            |q|vB sin({params.angleThetaDeg}°)
          </div>
        </div>

        {/* Electric Force F_E */}
        <div className="p-3 rounded-lg bg-[#17263B] border border-[#26364D] space-y-1">
          <div className="text-[10px] uppercase font-bold text-[#A78BFA] flex items-center justify-between">
            <span>Electric Force |F_E|</span>
            <span className="font-mono text-[#94A3B8]">qE</span>
          </div>
          <div className="text-base sm:text-lg font-mono font-black text-[#A78BFA]">
            {params.electricFieldEnabled
              ? `${derived.electricForceMagnitude.toExponential(2)} N`
              : '0.00 N (Off)'}
          </div>
          <div className="text-[10px] text-[#94A3B8] font-mono">
            {params.electricFieldEnabled ? `${params.eFieldDirection.toUpperCase()}ward` : 'No E-field applied'}
          </div>
        </div>

        {/* Net Lorentz Force F_net */}
        <div className="p-3 rounded-lg bg-[#17263B] border border-[#26364D] space-y-1">
          <div className="text-[10px] uppercase font-bold text-[#FBBF24] flex items-center justify-between">
            <span>Net Force |F_net|</span>
            <span className="font-mono text-[#94A3B8]">Vector Sum</span>
          </div>
          <div className="text-base sm:text-lg font-mono font-black text-[#FBBF24]">
            {derived.totalForceMagnitude.toExponential(2)} N
          </div>
          <div className="text-[10px] text-[#94A3B8] font-mono">
            a = {derived.accelerationMagnitude.toExponential(2)} m/s²
          </div>
        </div>

        {/* Cyclotron Orbit Radius */}
        <div className="p-3 rounded-lg bg-[#17263B] border border-[#26364D] space-y-1">
          <div className="text-[10px] uppercase font-bold text-[#38BDF8] flex items-center justify-between">
            <span>Orbit Radius (r)</span>
            <span className="font-mono text-[#94A3B8]">mv_⊥ / qB</span>
          </div>
          <div className="text-base sm:text-lg font-mono font-black text-[#38BDF8]">
            {derived.cyclotronRadius !== null
              ? `${(derived.cyclotronRadius * 100).toFixed(2)} cm`
              : '∞ (No Curvature)'}
          </div>
          <div className="text-[10px] text-[#94A3B8] font-mono">
            {derived.cyclotronRadius !== null
              ? `${(derived.cyclotronRadius * 1000).toFixed(1)} mm`
              : 'B = 0 or v_⊥ = 0'}
          </div>
        </div>

        {/* Cyclotron Frequency f_c */}
        <div className="p-3 rounded-lg bg-[#17263B] border border-[#26364D] space-y-1">
          <div className="text-[10px] uppercase font-bold text-[#34D399] flex items-center justify-between">
            <span>Cyclotron Freq (f_c)</span>
            <span className="font-mono text-[#94A3B8]">qB / 2πm</span>
          </div>
          <div className="text-base sm:text-lg font-mono font-black text-[#34D399]">
            {derived.cyclotronFrequency !== null
              ? `${(derived.cyclotronFrequency / 1e6).toFixed(2)} MHz`
              : 'N/A'}
          </div>
          <div className="text-[10px] text-[#94A3B8] font-mono">
            {derived.cyclotronPeriod !== null
              ? `T = ${(derived.cyclotronPeriod * 1e9).toFixed(2)} ns`
              : 'Period undefined'}
          </div>
        </div>

        {/* Helical Pitch p */}
        <div className="p-3 rounded-lg bg-[#17263B] border border-[#26364D] space-y-1">
          <div className="text-[10px] uppercase font-bold text-[#F1F5F9] flex items-center justify-between">
            <span>Helical Pitch (p)</span>
            <span className="font-mono text-[#94A3B8]">v_∥ × T</span>
          </div>
          <div className="text-base sm:text-lg font-mono font-black text-[#F1F5F9]">
            {derived.helicalPitch !== null
              ? `${(derived.helicalPitch * 100).toFixed(2)} cm`
              : '0.00 cm (Flat)'}
          </div>
          <div className="text-[10px] text-[#94A3B8] font-mono">
            v_∥ = {(derived.vParallel / 1e6).toFixed(2)} × 10⁶ m/s
          </div>
        </div>
      </div>

      {/* Energetics & Work-Energy Invariant Section */}
      <div className="p-4 rounded-lg bg-[#0B1728] border border-[#26364D] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#FBBF24]" />
            <span className="text-xs font-bold uppercase text-[#F1F5F9] tracking-wider">
              Work-Energy Theorem &amp; Kinetic Invariants
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#17263B] text-[#34D399] border border-[#26364D]">
            W_magnetic ≡ 0 Joules
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-[#101D30] p-2.5 rounded border border-[#26364D]">
            <div className="text-[#94A3B8] text-[10px]">Kinetic Energy (K)</div>
            <div className="text-sm font-mono font-bold text-[#34D399] mt-0.5">
              {(derived.kineticEnergyEV / 1000).toFixed(2)} keV
            </div>
            <div className="text-[10px] font-mono text-[#94A3B8]">
              {derived.kineticEnergyJoules.toExponential(2)} J
            </div>
          </div>

          <div className="bg-[#101D30] p-2.5 rounded border border-[#26364D]">
            <div className="text-[#94A3B8] text-[10px]">Velocity Partitioning</div>
            <div className="text-xs font-mono font-semibold text-[#F1F5F9] mt-0.5">
              v_⊥ = {(derived.vPerpendicular / 1e6).toFixed(2)} × 10⁶ m/s
            </div>
            <div className="text-[10px] font-mono text-[#94A3B8]">
              v_∥ = {(derived.vParallel / 1e6).toFixed(2)} × 10⁶ m/s
            </div>
          </div>

          <div className="bg-[#101D30] p-2.5 rounded border border-[#26364D]">
            <div className="text-[#94A3B8] text-[10px]">Velocity Filter Balance</div>
            <div className="text-xs font-mono font-bold text-[#38BDF8] mt-0.5">
              {derived.crossedFieldsBalanceSpeed !== null
                ? `${(derived.crossedFieldsBalanceSpeed / 1e6).toFixed(2)} × 10⁶ m/s`
                : 'N/A (B=0 or E=0)'}
            </div>
            <div className="text-[10px] font-mono text-[#94A3B8]">
              Target: v = E / B
            </div>
          </div>
        </div>

        {/* Theoretical Proof Box */}
        <div className="text-[11px] text-[#94A3B8] bg-[#101D30] p-2.5 rounded border border-[#26364D] leading-relaxed">
          <strong className="text-[#F1F5F9]">Physics Fact:</strong> Since{' '}
          <span className="font-mono text-[#FB7185]">F_B = q(v × B)</span> is always perpendicular to velocity vector <span className="font-mono text-[#34D399]">v</span>, the instantaneous power is{' '}
          <span className="font-mono text-[#38BDF8]">P = F_B · v = q(v × B) · v = 0</span>. Thus, a pure magnetic field does <em>zero mechanical work</em> on a moving charged particle; it changes only its direction of travel, never its speed or kinetic energy!
        </div>
      </div>
    </div>
  );
};
