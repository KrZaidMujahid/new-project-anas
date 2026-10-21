/**
 * EQUATION 1 — Driven Resonance & Harmonic Oscillators Laboratory
 * Minimalist Studio Split Architecture:
 * - Top Left: Driven Damped Mechanical Oscillator (ResonanceOscillatorSvg)
 * - Top Right: Essential Parameters Deck (f, m, k, c)
 * - Middle: Mathematical Frequency Response Curve A(f) (ResonanceGraphSvg)
 * - Bottom: KaTeX Formula Card & Law Definitions
 */

import React, { useState, useMemo, useCallback } from 'react';
import { ResonanceParameters, OscillatorDerivedValues } from '../../physics/resonance/types';
import { computeOscillatorDerivedValues } from '../../physics/resonance/model';
import { ResonanceOscillatorSvg } from './ResonanceOscillatorSvg';
import { ResonanceGraphSvg } from './ResonanceGraphSvg';
import { FormulaCard } from '../FormulaCard';
import { Radio, RotateCcw, Sliders } from 'lucide-react';

const DEFAULT_PARAMS: ResonanceParameters = {
  mass: 1.0,
  springConstant: 50.0,
  drivingFrequencyHz: 1.125,
  dampingCoefficient: 0.5,
  drivingForceAmplitude: 2.0,
  initialDisplacement: 0.0,
  initialVelocity: 0.0,
};

export const ResonanceLab: React.FC = () => {
  const [params, setParams] = useState<ResonanceParameters>(DEFAULT_PARAMS);

  const derived = useMemo<OscillatorDerivedValues>(() => {
    return computeOscillatorDerivedValues(params);
  }, [params]);

  const handleParamChange = useCallback(
    <K extends keyof ResonanceParameters>(key: K, value: ResonanceParameters[K]) => {
      setParams((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const handleResetDefaults = useCallback(() => {
    setParams(DEFAULT_PARAMS);
  }, []);

  const handleSelectFrequency = useCallback((freqHz: number) => {
    setParams((prev) => ({
      ...prev,
      drivingFrequencyHz: freqHz,
    }));
  }, []);

  return (
    <div className="space-y-6 text-[#F8FAFC]">
      {/* 1. Module Header */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#38BDF8] uppercase tracking-wider font-semibold">
            <Radio className="w-4 h-4" />
            <span>Oscillations &amp; Resonance</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#F8FAFC] tracking-tight mt-1">
            Driven Damped Resonance Laboratory
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
            Phase lag, quality factor Q, amplitude magnification, and resonant frequency response curves.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={() => handleSelectFrequency(derived.naturalFrequencyHz)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#050508] hover:bg-[#121722] border border-[#1E293B] hover:border-[#38BDF8]/50 text-xs font-medium text-[#38BDF8] transition-colors cursor-pointer min-h-[36px]"
            title="Snap to Natural Resonance Frequency"
          >
            <span>Snap to f₀</span>
          </button>
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#050508] hover:bg-[#121722] border border-[#1E293B] text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer min-h-[36px]"
            title="Reset parameters to standard defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 2. Studio Split Layout: Simulation (Left) + Parameters (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Mechanical Oscillator (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-3 min-w-0">
          <ResonanceOscillatorSvg params={params} />
        </div>

        {/* Right: Essential Parameters Deck (4 cols on desktop) */}
        <div className="lg:col-span-4 bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 space-y-4 shadow-sm min-w-0">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#38BDF8] font-bold">
              <Sliders className="w-4 h-4" />
              <span>Oscillator Parameters</span>
            </div>
            <button
              onClick={handleResetDefaults}
              className="text-[11px] font-mono text-[#64748B] hover:text-[#38BDF8] transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Parameter 1: Driving Frequency f */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Driving Frequency (f)</span>
              <span className="text-[#38BDF8] font-bold">{params.drivingFrequencyHz.toFixed(2)} Hz</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={3.0}
              step={0.05}
              value={params.drivingFrequencyHz}
              onChange={(e) =>
                handleParamChange('drivingFrequencyHz', parseFloat(e.target.value))
              }
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#38BDF8]"
            />
          </div>

          {/* Parameter 2: Spring Constant k */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Spring Constant (k)</span>
              <span className="text-[#FBBF24] font-bold">{params.springConstant.toFixed(0)} N/m</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={2}
              value={params.springConstant}
              onChange={(e) => handleParamChange('springConstant', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#FBBF24]"
            />
          </div>

          {/* Parameter 3: Oscillator Mass m */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Oscillator Mass (m)</span>
              <span className="text-[#34D399] font-bold">{params.mass.toFixed(1)} kg</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={3.0}
              step={0.1}
              value={params.mass}
              onChange={(e) => handleParamChange('mass', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#34D399]"
            />
          </div>

          {/* Parameter 4: Damping Coefficient c */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Damping (c)</span>
              <span className="text-[#A78BFA] font-bold">{params.dampingCoefficient.toFixed(2)} N·s/m</span>
            </div>
            <input
              type="range"
              min={0.05}
              max={2.5}
              step={0.05}
              value={params.dampingCoefficient}
              onChange={(e) =>
                handleParamChange('dampingCoefficient', parseFloat(e.target.value))
              }
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#A78BFA]"
            />
          </div>

          {/* Key Calculated Invariants */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1E293B]">
            <div className="p-2 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
              <div className="text-[10px] text-[#64748B]">Natural f₀</div>
              <div className="text-xs font-bold text-[#34D399] mt-0.5">
                {derived.naturalFrequencyHz.toFixed(2)} Hz
              </div>
            </div>
            <div className="p-2 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
              <div className="text-[10px] text-[#64748B]">Amplitude A</div>
              <div className="text-xs font-bold text-[#38BDF8] mt-0.5">
                {derived.steadyStateAmplitude.toFixed(2)} m
              </div>
            </div>
            <div className="p-2 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
              <div className="text-[10px] text-[#64748B]">Quality Q</div>
              <div className="text-xs font-bold text-[#FBBF24] mt-0.5">
                {derived.qualityFactor !== null ? derived.qualityFactor.toFixed(1) : '—'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Mathematical Resonance Curve Graph */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#38BDF8] font-bold">
            Frequency Response Curve A(f)
          </span>
          <span className="text-[11px] font-mono text-[#64748B]">
            Steady-State Amplitude vs Driving Frequency
          </span>
        </div>
        <ResonanceGraphSvg
          params={params}
          onSelectFrequency={handleSelectFrequency}
        />
      </div>

      {/* 4. Minimalist KaTeX Formula Card */}
      <FormulaCard
        title="Physics of Driven Damped Harmonic Resonance"
        formula="A(\omega) = \frac{F_0}{\sqrt{m^2(\omega_0^2 - \omega^2)^2 + (c\omega)^2}} \quad \text{where} \quad \omega_0 = \sqrt{\frac{k}{m}}"
        additionalFormula="Q = \frac{\omega_0 m}{c} \quad \text{and} \quad \tan\phi = \frac{c\omega}{k - m\omega^2}"
        description="When periodic driving frequency ω matches the natural undamped frequency ω0, reactive inertia cancels spring stiffness. Oscillation amplitude surges to a sharp peak constrained exclusively by damping coefficient c, characterized by the dimensionless quality factor Q."
        parameters={[
          { symbol: 'A(\\omega)', name: 'Steady-State Amplitude', unit: 'm' },
          { symbol: 'F_0', name: 'Driving Force Amplitude', unit: 'N' },
          { symbol: '\\omega_0', name: 'Natural Angular Frequency', unit: 'rad/s' },
          { symbol: 'c', name: 'Damping Coefficient', unit: 'N·s/m' },
          { symbol: 'k', name: 'Spring Stiffness', unit: 'N/m' },
          { symbol: 'Q', name: 'Quality Factor', unit: 'dimensionless' },
        ]}
      />
    </div>
  );
};
