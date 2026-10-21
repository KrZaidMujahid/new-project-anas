/**
 * EQUATION 1 — Natural Frequency Calculator Panel (Section 5)
 * Dedicated calculator displaying undamped natural frequency f_0,
 * damped free oscillation frequency f_damped, resonance peak frequency f_peak,
 * detuning Δf, and Quality factor Q.
 */

import React from 'react';
import { ResonanceParameters, OscillatorDerivedValues } from '../../physics/resonance/types';
import { Calculator, Compass, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { MathView } from '../MathView';

interface NaturalFrequencyCalculatorProps {
  params: ResonanceParameters;
  derived: OscillatorDerivedValues;
}

export const NaturalFrequencyCalculator: React.FC<NaturalFrequencyCalculatorProps> = ({
  params,
  derived,
}) => {
  const isNearResonance = Math.abs(derived.frequencyDetuningHz) < 0.15;

  return (
    <div className="bg-[#101D30] border border-slate-800 rounded-xl p-4 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Natural Frequency Calculator
            </h2>
            <p className="text-[11px] text-slate-400">
              System eigenvalues, frequency detuning, and damping regime
            </p>
          </div>
        </div>

        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
            isNearResonance
              ? 'bg-amber-950/40 text-amber-300 border-amber-500/50 animate-pulse'
              : 'bg-[#07111F] text-slate-400 border-slate-800'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isNearResonance ? 'bg-amber-400' : 'bg-slate-500'
            }`}
          />
          <span>{isNearResonance ? 'Resonance Zone' : 'Off-Resonance'}</span>
        </div>
      </div>

      {/* Grid of Key Calculations */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {/* Undamped Natural Angular Frequency ω₀ */}
        <div className="p-2.5 rounded-lg bg-[#07111F] border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">
            Natural Angular Freq (ω₀)
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-mono font-bold text-cyan-300">
              {derived.naturalAngularFreq.toFixed(3)}
            </span>
            <span className="text-[10px] font-mono text-slate-500">rad/s</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">ω₀ = √(k/m)</span>
        </div>

        {/* Undamped Natural Frequency f₀ */}
        <div className="p-2.5 rounded-lg bg-[#07111F] border border-cyan-500/30 space-y-1 ring-1 ring-cyan-500/20">
          <span className="text-[10px] text-cyan-400 uppercase font-mono block font-bold">
            Natural Frequency (f₀)
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-mono font-bold text-white">
              {derived.naturalFrequencyHz.toFixed(3)}
            </span>
            <span className="text-[10px] font-mono text-cyan-400">Hz</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono block">f₀ = ω₀ / 2π</span>
        </div>

        {/* Current Driving Frequency f_d */}
        <div className="p-2.5 rounded-lg bg-[#07111F] border border-amber-500/30 space-y-1">
          <span className="text-[10px] text-amber-400 uppercase font-mono block font-bold">
            Driving Frequency (f_d)
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-mono font-bold text-amber-300">
              {params.drivingFrequencyHz.toFixed(3)}
            </span>
            <span className="text-[10px] font-mono text-amber-400">Hz</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">External Force</span>
        </div>

        {/* Frequency Detuning Δf = f_d - f₀ */}
        <div className="p-2.5 rounded-lg bg-[#07111F] border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">
            Detuning (f_d - f₀)
          </span>
          <div className="flex items-baseline gap-1">
            <span
              className={`text-sm font-mono font-bold ${
                isNearResonance ? 'text-amber-400' : 'text-slate-300'
              }`}
            >
              {derived.frequencyDetuningHz >= 0 ? '+' : ''}
              {derived.frequencyDetuningHz.toFixed(3)}
            </span>
            <span className="text-[10px] font-mono text-slate-500">Hz</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">Distance from f₀</span>
        </div>

        {/* Damped Free Frequency f_damped */}
        <div className="p-2.5 rounded-lg bg-[#07111F] border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">
            Damped Frequency (f_damped)
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-mono font-bold text-purple-300">
              {derived.dampedFrequencyHz !== null
                ? `${derived.dampedFrequencyHz.toFixed(3)} Hz`
                : 'Overdamped'}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">Free Decay Rate</span>
        </div>

        {/* Quality Factor Q */}
        <div className="p-2.5 rounded-lg bg-[#07111F] border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">
            Quality Factor (Q)
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-mono font-bold text-emerald-300">
              {derived.qualityFactor !== null ? derived.qualityFactor.toFixed(2) : '∞ (Undamped)'}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">Q = m ω₀ / c</span>
        </div>
      </div>

      {/* Explanatory Distinction Banner */}
      <div className="p-3 rounded-lg bg-[#07111F] border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed space-y-1.5">
        <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
          <Compass className="w-3.5 h-3.5" />
          <span>Core Physical Distinction</span>
        </div>
        <p className="text-slate-400">
          <strong className="text-white">Natural frequency f₀ = {derived.naturalFrequencyHz.toFixed(2)} Hz</strong> is an intrinsic property determined solely by system mass (<MathView math="m" />) and spring stiffness (<MathView math="k" />). In contrast, <strong className="text-amber-300">Driving frequency f_d = {params.drivingFrequencyHz.toFixed(2)} Hz</strong> is an independent parameter imposed externally by the periodic driver motor.
        </p>
        <p className="text-slate-400">
          Displacement amplitude peak occurs at <strong className="text-white">f_peak = {derived.amplitudePeakFrequencyHz !== null ? `${derived.amplitudePeakFrequencyHz.toFixed(3)} Hz` : 'N/A'}</strong> (slightly shifted below <MathView math="f_0" /> due to damping <MathView math="c" />).
        </p>
      </div>
    </div>
  );
};
