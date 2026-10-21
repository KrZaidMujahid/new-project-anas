/**
 * EQUATION 1 — Photoelectric Effect Control Panel
 * Sliders, inputs, wavelength presets, metal selector, applied voltage,
 * and scientific annotations for all physical parameters.
 */

import React from 'react';
import { Sliders, RotateCcw, Zap, Sun, Atom, Info } from 'lucide-react';
import { PhotoelectricParameters, PhotoelectricCalculations } from '../../physics/photoelectric/types';
import { METALS, WAVELENGTH_PRESETS, SPEED_OF_LIGHT } from '../../physics/photoelectric/model';

interface PhotoelectricControlsProps {
  params: PhotoelectricParameters;
  calc: PhotoelectricCalculations;
  onUpdateParams: (updater: (prev: PhotoelectricParameters) => PhotoelectricParameters) => void;
  onResetDefaults: () => void;
}

export const PhotoelectricControls: React.FC<PhotoelectricControlsProps> = ({
  params,
  calc,
  onUpdateParams,
  onResetDefaults,
}) => {
  return (
    <div className="bg-[#10243D] rounded-xl border border-[#29415F] p-4 sm:p-5 shadow-2xl space-y-5 text-[#EAF2FF]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#29415F] pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#38BDF8]" />
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#EAF2FF]">
            Thermodynamic & Quantum Controls
          </h2>
        </div>
        <button
          onClick={onResetDefaults}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#9FB3CC] hover:text-[#EAF2FF] bg-[#142B47] hover:bg-[#1A375A] border border-[#29415F] rounded-lg transition-colors cursor-pointer"
          title="Reset all settings to Cesium, f = 8.0×10¹⁴ Hz, 50% intensity, 0 V"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* 1. Metal Cathode Selector */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
          <label className="font-bold text-[#9FB3CC] uppercase tracking-wider flex items-center gap-1.5">
            <Atom className="w-3.5 h-3.5 text-[#38BDF8]" />
            1. Target Metal Cathode (Emitter)
          </label>
          <span className="font-mono text-[11px] text-[#FBBF24]">
            Work Function φ ≈ {calc.metal.workFunctionEV.toFixed(2)} eV ({(calc.metal.workFunctionJoules / 1e-19).toFixed(2)} &times; 10⁻¹⁹ J)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {METALS.map((metal) => {
            const isSelected = params.selectedMetalId === metal.id;
            return (
              <button
                key={metal.id}
                onClick={() => onUpdateParams((p) => ({ ...p, selectedMetalId: metal.id }))}
                className={`p-2.5 rounded-lg text-xs font-bold transition-all border cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[#38BDF8]/20 border-[#38BDF8] text-[#38BDF8] shadow-sm ring-1 ring-[#38BDF8]/50'
                    : 'bg-[#142B47] border-[#29415F] text-[#9FB3CC] hover:text-[#EAF2FF] hover:border-[#38BDF8]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[#EAF2FF]">{metal.name}</span>
                  <span className="text-[10px] font-mono text-[#9FB3CC]">{metal.symbol}</span>
                </div>
                <div className="text-[10px] font-mono text-[#FBBF24] mt-0.5">
                  φ ≈ {metal.workFunctionEV.toFixed(2)} eV
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Metal Threshold Info */}
        <div className="text-[11px] font-mono text-[#9FB3CC] bg-[#142B47] p-2 rounded-lg border border-[#29415F] flex flex-wrap justify-between gap-2">
          <span>
            Threshold Frequency f₀: <strong className="text-[#38BDF8]">{(calc.thresholdFrequencyHz / 1e14).toFixed(2)} &times; 10¹⁴ Hz</strong>
          </span>
          <span>
            Cut-off Wavelength λ₀: <strong className="text-[#FBBF24]">{calc.thresholdWavelengthNm.toFixed(0)} nm</strong>
          </span>
        </div>
        <p className="text-[10px] text-[#9FB3CC]/80 italic">
          *Note: Work functions depend on surface conditions; values listed are representative textbook standards.
        </p>
      </div>

      {/* 2. Incident Light Frequency & Wavelength Presets */}
      <div className="space-y-2.5 bg-[#142B47] p-3.5 rounded-xl border border-[#29415F]">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#EAF2FF] flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full border border-white/50"
              style={{ backgroundColor: calc.spectralColorHex }}
            ></span>
            2. Incident Light Frequency (f)
          </span>
          <span className="font-mono font-bold text-[#38BDF8] text-sm">
            {(params.frequencyHz / 1e14).toFixed(2)} &times; 10¹⁴ Hz
          </span>
        </div>

        {/* Frequency Slider (Range: 3.0×10¹⁴ to 15.0×10¹⁴ Hz) */}
        <input
          type="range"
          min="3.0"
          max="15.0"
          step="0.05"
          value={params.frequencyHz / 1e14}
          onChange={(e) => {
            const val = parseFloat(e.target.value) * 1e14;
            onUpdateParams((p) => ({ ...p, frequencyHz: val }));
          }}
          className="w-full h-2 bg-[#071426] rounded-lg appearance-none cursor-pointer accent-[#38BDF8]"
        />

        {/* Wavelength & Spectral Tag */}
        <div className="flex items-center justify-between text-xs font-mono text-[#9FB3CC] pt-0.5">
          <span>
            Wavelength λ = c / f = <strong className="text-[#FBBF24]">{calc.wavelengthNm.toFixed(1)} nm</strong>
          </span>
          <span
            className="px-2 py-0.5 rounded font-bold text-[10px]"
            style={{
              color: calc.spectralColorHex,
              backgroundColor: `${calc.spectralColorHex}20`,
              border: `1px solid ${calc.spectralColorHex}50`,
            }}
          >
            {calc.spectralColorName} ({calc.spectralRegion})
          </span>
        </div>

        {/* Convenient Wavelength Presets (Section 4) */}
        <div className="pt-2 border-t border-[#29415F]/60">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#9FB3CC] block mb-1.5">
            Wavelength Presets (λ = c / f):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {WAVELENGTH_PRESETS.map((wp) => {
              const isMatch = Math.abs(calc.wavelengthNm - wp.wavelengthNm) < 10;
              return (
                <button
                  key={wp.wavelengthNm}
                  onClick={() => onUpdateParams((p) => ({ ...p, frequencyHz: wp.frequencyHz }))}
                  className={`px-2 py-1 rounded text-[10px] font-mono font-semibold border transition-all cursor-pointer ${
                    isMatch
                      ? 'border-[#38BDF8] text-[#38BDF8] bg-[#38BDF8]/20 ring-1 ring-[#38BDF8]'
                      : 'border-[#29415F] bg-[#10243D] text-[#9FB3CC] hover:text-[#EAF2FF] hover:border-[#38BDF8]/40'
                  }`}
                  title={`${wp.label}: ${wp.description}`}
                >
                  {wp.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Light Intensity Slider */}
      <div className="space-y-2 bg-[#142B47] p-3.5 rounded-xl border border-[#29415F]">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#EAF2FF] flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-[#FBBF24]" />
            3. Relative Light Intensity (Photon Flux)
          </span>
          <span className="font-mono font-bold text-[#FBBF24] text-sm">
            {params.intensityPercent}%
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={params.intensityPercent}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            onUpdateParams((p) => ({ ...p, intensityPercent: val }));
          }}
          className="w-full h-2 bg-[#071426] rounded-lg appearance-none cursor-pointer accent-[#FBBF24]"
        />

        <div className="flex justify-between text-[10px] font-mono text-[#9FB3CC]">
          <span>0% (Dark / Off)</span>
          <span>50% (Default)</span>
          <span>100% (Maximum Flux)</span>
        </div>
        <p className="text-[10px] text-[#9FB3CC] leading-relaxed pt-1">
          <strong className="text-[#EAF2FF]">Model Note:</strong> Intensity controls the rate of incident photons per second (photon flux). It does <em>not</em> alter the energy of individual photons.
        </p>
      </div>

      {/* 4. Applied Voltage Slider (Convention: V = V_collector - V_emitter) */}
      <div className="space-y-2.5 bg-[#142B47] p-3.5 rounded-xl border border-[#29415F]">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#EAF2FF] flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#34D399]" />
            4. Applied Potential Difference (V = V_collector - V_emitter)
          </span>
          <span
            className={`font-mono font-bold text-sm ${
              params.appliedVoltage > 0
                ? 'text-[#38BDF8]'
                : params.appliedVoltage < 0
                ? 'text-[#FB7185]'
                : 'text-[#EAF2FF]'
            }`}
          >
            {params.appliedVoltage >= 0 ? `+${params.appliedVoltage.toFixed(2)} V` : `${params.appliedVoltage.toFixed(2)} V`}
          </span>
        </div>

        <input
          type="range"
          min="-10.0"
          max="10.0"
          step="0.05"
          value={params.appliedVoltage}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            onUpdateParams((p) => ({ ...p, appliedVoltage: val }));
          }}
          className="w-full h-2 bg-[#071426] rounded-lg appearance-none cursor-pointer accent-[#34D399]"
        />

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex gap-2">
            <button
              onClick={() => onUpdateParams((p) => ({ ...p, appliedVoltage: 0 }))}
              className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#10243D] border border-[#29415F] text-[#9FB3CC] hover:text-[#EAF2FF] cursor-pointer"
            >
              Set to 0.00 V
            </button>
            {calc.isEmissionPossible && (
              <button
                onClick={() =>
                  onUpdateParams((p) => ({
                    ...p,
                    appliedVoltage: -parseFloat(calc.stoppingPotentialVolts.toFixed(2)),
                  }))
                }
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FB7185]/20 border border-[#FB7185]/50 text-[#FB7185] hover:bg-[#FB7185]/30 cursor-pointer"
              >
                Set to -V_stop (-{calc.stoppingPotentialVolts.toFixed(2)} V)
              </button>
            )}
          </div>
          <span className="text-[10px] font-mono text-[#9FB3CC]">
            Range: -10.0 V to +10.0 V
          </span>
        </div>

        <p className="text-[10px] text-[#9FB3CC] leading-relaxed pt-0.5">
          <strong className="text-[#38BDF8]">Positive V:</strong> Accelerates electrons toward collector.&nbsp;
          <strong className="text-[#FB7185]">Negative V:</strong> Opposes electron collection until stopping condition V = -V_stop.
        </p>
      </div>
    </div>
  );
};
