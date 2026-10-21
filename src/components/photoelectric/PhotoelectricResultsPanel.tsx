/**
 * EQUATION 1 — Photoelectric Results Panel (Section 12)
 * Comprehensive live telemetry displaying:
 * - Light Parameters (f, λ, E in J & eV, intensity)
 * - Metal Parameters (φ in eV & J, f_0, λ_0)
 * - Photoelectron Energetics (emission status, K_max in eV & J, V_stop, v_max)
 * - Circuit Telemetry & Rates (photon flux, emission rate, collected rate, I_photo, I_sat)
 */

import React from 'react';
import { Sparkles, Sun, Atom, Zap, Gauge, CheckCircle2, XCircle } from 'lucide-react';
import { PhotoelectricParameters, PhotoelectricCalculations } from '../../physics/photoelectric/types';

interface PhotoelectricResultsPanelProps {
  params: PhotoelectricParameters;
  calc: PhotoelectricCalculations;
}

export const PhotoelectricResultsPanel: React.FC<PhotoelectricResultsPanelProps> = ({
  params,
  calc,
}) => {
  return (
    <div className="bg-[#10243D] rounded-xl border border-[#29415F] p-4 sm:p-5 shadow-2xl space-y-4 text-[#EAF2FF]">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-[#29415F] pb-3">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-[#38BDF8]" />
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#EAF2FF]">
            Live Scientific Results & Telemetry
          </h2>
        </div>
        <span className="text-[11px] font-mono text-[#9FB3CC]">
          CODATA 2018 Precision Models
        </span>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Incident Light Parameters */}
        <div className="bg-[#142B47] p-3.5 rounded-xl border border-[#29415F] space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#FBBF24] border-b border-[#29415F]/60 pb-1.5">
            <Sun className="w-4 h-4" />
            <span>LIGHT PARAMETERS</span>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-[#9FB3CC]">Frequency (f):</span>
              <span className="text-[#EAF2FF] font-semibold">
                {(calc.frequencyHz / 1e14).toFixed(3)} &times; 10¹⁴ Hz
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9FB3CC]">Wavelength (λ):</span>
              <span className="text-[#FBBF24] font-semibold">
                {calc.wavelengthNm.toFixed(1)} nm
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9FB3CC]">Photon Energy:</span>
              <span className="text-[#38BDF8] font-bold">
                {calc.photonEnergyEV.toFixed(3)} eV
              </span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[#9FB3CC]">Energy (Joules):</span>
              <span className="text-[#9FB3CC]">
                {(calc.photonEnergyJoules / 1e-19).toFixed(3)} &times; 10⁻¹⁹ J
              </span>
            </div>
            <div className="flex justify-between pt-1 border-t border-[#29415F]/40">
              <span className="text-[#9FB3CC]">Relative Intensity:</span>
              <span className="text-[#FBBF24] font-bold">
                {params.intensityPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Metal Cathode Properties */}
        <div className="bg-[#142B47] p-3.5 rounded-xl border border-[#29415F] space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#38BDF8] border-b border-[#29415F]/60 pb-1.5">
            <Atom className="w-4 h-4" />
            <span>METAL PARAMETERS</span>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-[#9FB3CC]">Selected Metal:</span>
              <span className="text-[#EAF2FF] font-semibold">
                {calc.metal.name} ({calc.metal.symbol})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9FB3CC]">Work Function (φ):</span>
              <span className="text-[#FBBF24] font-bold">
                {calc.metal.workFunctionEV.toFixed(2)} eV
              </span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[#9FB3CC]">Work Function (J):</span>
              <span className="text-[#9FB3CC]">
                {(calc.metal.workFunctionJoules / 1e-19).toFixed(3)} &times; 10⁻¹⁹ J
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9FB3CC]">Threshold f₀:</span>
              <span className="text-[#38BDF8]">
                {(calc.thresholdFrequencyHz / 1e14).toFixed(3)} &times; 10¹⁴ Hz
              </span>
            </div>
            <div className="flex justify-between pt-1 border-t border-[#29415F]/40">
              <span className="text-[#9FB3CC]">Threshold λ₀:</span>
              <span className="text-[#EAF2FF]">
                {calc.thresholdWavelengthNm.toFixed(1)} nm
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Photoelectron Energetics */}
        <div className="bg-[#142B47] p-3.5 rounded-xl border border-[#29415F] space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#34D399] border-b border-[#29415F]/60 pb-1.5">
            <Sparkles className="w-4 h-4" />
            <span>PHOTOELECTRON RESULTS</span>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between items-center">
              <span className="text-[#9FB3CC]">Emission Occurs?</span>
              {calc.isEmissionPossible ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-[#34D399] px-2 py-0.5 rounded bg-[#34D399]/15 border border-[#34D399]/40">
                  <CheckCircle2 className="w-3 h-3" /> YES (E &ge; φ)
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-bold text-[#FB7185] px-2 py-0.5 rounded bg-[#FB7185]/15 border border-[#FB7185]/40">
                  <XCircle className="w-3 h-3" /> NO (E &lt; φ)
                </span>
              )}
            </div>

            <div className="flex justify-between">
              <span className="text-[#9FB3CC]">Max Kinetic Energy:</span>
              <span className="text-[#34D399] font-bold">
                {calc.maxKineticEnergyEV.toFixed(3)} eV
              </span>
            </div>

            <div className="flex justify-between text-[11px]">
              <span className="text-[#9FB3CC]">K_max in Joules:</span>
              <span className="text-[#9FB3CC]">
                {calc.isEmissionPossible
                  ? `${(calc.maxKineticEnergyJoules / 1e-19).toFixed(3)} × 10⁻¹⁹ J`
                  : '0.00 J'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#9FB3CC]">Stopping Potential:</span>
              <span className="text-[#FB7185] font-bold">
                {calc.stoppingPotentialVolts.toFixed(3)} V
              </span>
            </div>

            <div className="flex justify-between pt-1 border-t border-[#29415F]/40">
              <span className="text-[#9FB3CC]">Max Speed (v_max):</span>
              <span className="text-[#38BDF8] font-semibold">
                {calc.isEmissionPossible
                  ? `${(calc.maxElectronSpeedMs / 1e5).toFixed(2)} × 10⁵ m/s`
                  : '0 m/s'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Circuit Telemetry & Particle Rates */}
        <div className="bg-[#142B47] p-3.5 rounded-xl border border-[#29415F] space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#818CF8] border-b border-[#29415F]/60 pb-1.5">
            <Zap className="w-4 h-4" />
            <span>CIRCUIT & RATE TELEMETRY</span>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-[#9FB3CC]">Photocurrent (I):</span>
              <span className="text-[#34D399] font-bold text-sm">
                {calc.photocurrentMicroAmps.toFixed(2)} µA
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#9FB3CC]">Saturation (I_sat):</span>
              <span className="text-[#38BDF8] font-semibold">
                {calc.saturationCurrentMicroAmps.toFixed(2)} µA
              </span>
            </div>

            <div className="flex justify-between text-[11px]">
              <span className="text-[#9FB3CC]">Photon Flux Index:</span>
              <span className="text-[#9FB3CC]">
                {(calc.normalizedPhotonFlux / 1e14).toFixed(2)} &times; 10¹⁴ s⁻¹
              </span>
            </div>

            <div className="flex justify-between text-[11px]">
              <span className="text-[#9FB3CC]">Emitted e⁻ Rate:</span>
              <span className="text-[#9FB3CC]">
                {calc.isEmissionPossible
                  ? `${(calc.emittedElectronRate / 1e12).toFixed(2)} × 10¹² s⁻¹`
                  : '0 s⁻¹'}
              </span>
            </div>

            <div className="flex justify-between pt-1 border-t border-[#29415F]/40">
              <span className="text-[#9FB3CC]">Applied Bias (V):</span>
              <span
                className={`font-bold ${
                  params.appliedVoltage > 0
                    ? 'text-[#38BDF8]'
                    : params.appliedVoltage < 0
                    ? 'text-[#FB7185]'
                    : 'text-[#EAF2FF]'
                }`}
              >
                {params.appliedVoltage >= 0
                  ? `+${params.appliedVoltage.toFixed(2)} V`
                  : `${params.appliedVoltage.toFixed(2)} V`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
