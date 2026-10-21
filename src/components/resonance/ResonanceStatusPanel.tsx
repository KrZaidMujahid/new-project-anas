import React from 'react';
import { Gauge, Info, Calculator, AlertCircle } from 'lucide-react';
import { ResonanceParameters, OscillatorDerivedValues } from '../../physics/resonance/types';

interface ResonanceStatusPanelProps {
  params: ResonanceParameters;
  derived: OscillatorDerivedValues;
}

export const ResonanceStatusPanel: React.FC<ResonanceStatusPanelProps> = ({
  params,
  derived,
}) => {
  const { mass: m, springConstant: k, dampingCoefficient: c, drivingFrequencyHz: fd } = params;
  const { naturalFrequencyHz: f0, steadyStateAmplitude: amp, frequencyDetuningHz: detuning } = derived;

  const absDetuning = Math.abs(detuning);
  const resonanceBandwidth = Math.max(0.2, f0 * 0.15);

  let statusType: 'below' | 'near' | 'above' = 'near';
  let statusMessage = '';
  let statusBadgeColor = '';

  if (fd < f0 - resonanceBandwidth) {
    statusType = 'below';
    statusMessage = 'The system is driven below its resonance region.';
    statusBadgeColor = 'bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30';
  } else if (fd > f0 + resonanceBandwidth) {
    statusType = 'above';
    statusMessage = 'The system is driven above its resonance region.';
    statusBadgeColor = 'bg-[#A78BFA]/15 text-[#A78BFA] border-[#A78BFA]/30';
  } else {
    statusType = 'near';
    statusMessage = 'The system is operating near resonance. The steady-state response is large.';
    statusBadgeColor = 'bg-[#FB7185]/15 text-[#FB7185] border-[#FB7185]/30';
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Resonance Status Card */}
      <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#26364D]">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-[#38BDF8]" />
            <h3 className="text-sm font-bold text-[#F1F5F9] uppercase tracking-wide">
              Resonance Status
            </h3>
          </div>

          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBadgeColor}`}>
            {statusType === 'below' && 'Below Peak'}
            {statusType === 'near' && '★ NEAR RESONANCE'}
            {statusType === 'above' && 'Above Peak'}
          </span>
        </div>

        {/* Telemetry Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-[#17263B] border border-[#26364D] rounded-xl p-3">
            <span className="text-[11px] font-semibold text-[#94A3B8] block">Natural Frequency (f₀)</span>
            <span className="text-base font-mono font-bold text-[#34D399] block mt-0.5">
              {f0.toFixed(3)} Hz
            </span>
            <span className="text-[10px] text-[#94A3B8]">ω₀ = {derived.naturalAngularFreq.toFixed(2)} rad/s</span>
          </div>

          <div className="bg-[#17263B] border border-[#26364D] rounded-xl p-3">
            <span className="text-[11px] font-semibold text-[#94A3B8] block">Driving Frequency (f)</span>
            <span className="text-base font-mono font-bold text-[#38BDF8] block mt-0.5">
              {fd.toFixed(3)} Hz
            </span>
            <span className="text-[10px] text-[#94A3B8]">ω = {derived.drivingAngularFreq.toFixed(2)} rad/s</span>
          </div>

          <div className="bg-[#17263B] border border-[#26364D] rounded-xl p-3">
            <span className="text-[11px] font-semibold text-[#94A3B8] block">Damping (c)</span>
            <span className="text-base font-mono font-bold text-[#A78BFA] block mt-0.5">
              {c.toFixed(2)} N·s/m
            </span>
            <span className="text-[10px] text-[#94A3B8]">
              {c === 0 ? 'Undamped' : `Q ≈ ${derived.qualityFactor ? derived.qualityFactor.toFixed(1) : '∞'}`}
            </span>
          </div>

          <div className="bg-[#17263B] border border-[#26364D] rounded-xl p-3">
            <span className="text-[11px] font-semibold text-[#94A3B8] block">Steady-State Amp A(ω)</span>
            <span className="text-base font-mono font-bold text-[#FB7185] block mt-0.5">
              {amp.toFixed(4)} m
            </span>
            <span className="text-[10px] text-[#94A3B8]">({(amp * 100).toFixed(1)} cm)</span>
          </div>

          <div className="bg-[#17263B] border border-[#26364D] rounded-xl p-3">
            <span className="text-[11px] font-semibold text-[#94A3B8] block">Frequency Difference</span>
            <span className="text-base font-mono font-bold text-[#F1F5F9] block mt-0.5">
              {absDetuning.toFixed(3)} Hz
            </span>
            <span className="text-[10px] text-[#94A3B8]">|f - f₀|</span>
          </div>

          <div className="bg-[#17263B] border border-[#26364D] rounded-xl p-3">
            <span className="text-[11px] font-semibold text-[#94A3B8] block">Phase Lag φ</span>
            <span className="text-base font-mono font-bold text-[#F1F5F9] block mt-0.5">
              {derived.steadyStatePhaseLagDeg.toFixed(1)}°
            </span>
            <span className="text-[10px] text-[#94A3B8]">
              {(derived.steadyStatePhaseLagRad / Math.PI).toFixed(2)}π rad
            </span>
          </div>
        </div>

        {/* Dynamic Explanatory Message Box */}
        <div
          className={`p-3.5 rounded-lg border text-xs flex items-start gap-2.5 ${
            statusType === 'near'
              ? 'bg-[#FB7185]/10 border-[#FB7185]/30 text-[#FB7185]'
              : 'bg-[#38BDF8]/10 border-[#38BDF8]/30 text-[#38BDF8]'
          }`}
        >
          {statusType === 'near' ? (
            <AlertCircle className="w-4 h-4 text-[#FB7185] shrink-0 mt-0.5" />
          ) : (
            <Info className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <p className="font-bold">{statusMessage}</p>
            <p className="text-[11px] opacity-90 leading-relaxed text-[#F1F5F9]">
              {statusType === 'near' &&
                'Energy transfer from the periodic driving force into the oscillator is maximized because the driving cycle matches the natural tempo of the mass-spring system.'}
              {statusType === 'below' &&
                'At frequencies well below resonance, stiffness (spring constant k) dominates the response, and the mass oscillates in-phase with the driving force.'}
              {statusType === 'above' &&
                'At frequencies well above resonance, inertia (mass m) dominates, causing the mass to lag approximately 180° out of phase with reduced amplitude.'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Natural Frequency Calculator */}
      <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#26364D]">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[#38BDF8]" />
            <h3 className="text-sm font-bold text-[#F1F5F9] uppercase tracking-wide">
              Natural Frequency Calculator &amp; Theory
            </h3>
          </div>
          <span className="text-xs text-[#94A3B8] font-mono">Damped Driven SHM</span>
        </div>

        <div className="space-y-3 text-xs text-[#F1F5F9]">
          <div className="bg-[#17263B] border border-[#26364D] rounded-xl p-3.5 space-y-2">
            <span className="font-bold text-[#F1F5F9] block text-xs">
              Natural Frequency Calculation:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-[#101D30] p-2.5 rounded-lg border border-[#26364D]">
                <span className="text-[#94A3B8] block text-[10px]">1. Natural Angular Frequency</span>
                <span className="text-[#F1F5F9] font-bold">ω₀ = √(k / m)</span>
                <div className="text-[11px] text-[#38BDF8] mt-0.5">
                  = √({k} / {m.toFixed(2)}) = {derived.naturalAngularFreq.toFixed(3)} rad/s
                </div>
              </div>

              <div className="bg-[#101D30] p-2.5 rounded-lg border border-[#26364D]">
                <span className="text-[#94A3B8] block text-[10px]">2. Natural Frequency (Cycles/Sec)</span>
                <span className="text-[#F1F5F9] font-bold">f₀ = ω₀ / 2π</span>
                <div className="text-[11px] text-[#34D399] mt-0.5">
                  = {derived.naturalAngularFreq.toFixed(3)} / (2π) = {f0.toFixed(3)} Hz
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#17263B] border border-[#26364D] rounded-xl p-3.5 space-y-2">
            <span className="font-bold text-[#F1F5F9] block text-xs">
              Governing Differential Equation:
            </span>
            <div className="font-mono bg-[#101D30] p-2.5 rounded-lg border border-[#26364D] text-xs text-[#38BDF8]">
              m x&apos;&apos;(t) + c x&apos;(t) + k x(t) = F₀ sin(ω t)
            </div>

            <span className="font-bold text-[#F1F5F9] block text-xs pt-1">
              Steady-State Amplitude Formula:
            </span>
            <div className="font-mono bg-[#101D30] p-2.5 rounded-lg border border-[#26364D] text-xs text-[#FB7185]">
              A(ω) = F₀ / √[ (k - m ω²)² + (c ω)² ]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
