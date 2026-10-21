/**
 * EQUATION 1 — Resonance Mathematical Equations Panel (Section 14)
 * KaTeX-rendered Equations 1 through 8 with symbols, units, and real-time numeric calculations.
 */

import React, { useState } from 'react';
import { ResonanceParameters, OscillatorDerivedValues } from '../../physics/resonance/types';
import { MathView } from '../MathView';
import { Calculator, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface MathematicalEquationsProps {
  params: ResonanceParameters;
  derived: OscillatorDerivedValues;
}

export const MathematicalEquations: React.FC<MathematicalEquationsProps> = ({
  params,
  derived,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const { mass: m, springConstant: k, dampingCoefficient: c, drivingForceAmplitude: F0, drivingFrequencyHz: fd } = params;
  const omegaD = derived.drivingAngularFreq;

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
              Mathematical Equations of Resonance
            </h2>
            <p className="text-[11px] text-slate-400">
              Governing differential equations, eigenvalues, and steady-state solutions
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-lg bg-[#07111F] text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Equation 1: Undamped Natural Angular Frequency */}
          <div className="p-3 rounded-lg bg-[#07111F] border border-slate-800/90 space-y-1.5">
            <span className="font-semibold text-cyan-300 block">
              Equation 1: Undamped Natural Angular Frequency
            </span>
            <div className="py-1 text-center font-mono">
              <MathView
                math={`\\omega_0 = \\sqrt{\\frac{k}{m}} = \\sqrt{\\frac{${k}}{${m}}} = ${derived.naturalAngularFreq.toFixed(3)} \\text{ rad/s}`}
                displayMode
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Intrinsic angular frequency of the oscillator without damping. <MathView math="k" /> in N/m, <MathView math="m" /> in kg.
            </p>
          </div>

          {/* Equation 2: Undamped Natural Frequency */}
          <div className="p-3 rounded-lg bg-[#07111F] border border-slate-800/90 space-y-1.5">
            <span className="font-semibold text-cyan-300 block">
              Equation 2: Undamped Natural Frequency (Cycles/Second)
            </span>
            <div className="py-1 text-center font-mono">
              <MathView
                math={`f_0 = \\frac{1}{2\\pi}\\sqrt{\\frac{k}{m}} = \\frac{${derived.naturalAngularFreq.toFixed(2)}}{2\\pi} = ${derived.naturalFrequencyHz.toFixed(3)} \\text{ Hz}`}
                displayMode
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Number of free oscillations completed per second in the ideal unforced system.
            </p>
          </div>

          {/* Equation 3: Damped Free Oscillation Frequency */}
          <div className="p-3 rounded-lg bg-[#07111F] border border-slate-800/90 space-y-1.5">
            <span className="font-semibold text-purple-300 block">
              Equation 3: Damped Free Oscillation Frequency
            </span>
            <div className="py-1 text-center font-mono">
              <MathView
                math={
                  derived.dampedAngularFreq !== null
                    ? `\\omega_{\\text{damped}} = \\sqrt{\\omega_0^2 - \\left(\\frac{c}{2m}\\right)^2} = ${derived.dampedAngularFreq.toFixed(3)} \\text{ rad/s}`
                    : `\\omega_{\\text{damped}} = \\text{Not oscillatory (Overdamped)}`
                }
                displayMode
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Frequency of unforced decay under viscous damping <MathView math="c" /> (N·s/m).
            </p>
          </div>

          {/* Equation 4: Driven Oscillator Differential Equation */}
          <div className="p-3 rounded-lg bg-[#07111F] border border-amber-500/30 space-y-1.5">
            <span className="font-semibold text-amber-300 block">
              Equation 4: Driven Oscillator Equation of Motion
            </span>
            <div className="py-1 text-center font-mono">
              <MathView
                math={`m\\frac{d^2x}{dt^2} + c\\frac{dx}{dt} + kx = F_0 \\sin(\\omega_d t)`}
                displayMode
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Newton's 2nd Law balancing inertial (<MathView math="m\\ddot{x}" />), damping (<MathView math="c\\dot{x}" />), spring restoring (<MathView math="kx" />), and external forcing (<MathView math="F_0\\sin\\omega_d t" />).
            </p>
          </div>

          {/* Equation 5: Steady-State Amplitude */}
          <div className="p-3 rounded-lg bg-[#07111F] border border-slate-800/90 space-y-1.5">
            <span className="font-semibold text-cyan-300 block">
              Equation 5: Steady-State Amplitude Response
            </span>
            <div className="py-1 text-center font-mono">
              <MathView
                math={`A(\\omega) = \\frac{F_0}{\\sqrt{(k - m\\omega^2)^2 + (c\\omega)^2}} = ${derived.steadyStateAmplitude.toFixed(3)} \\text{ m}`}
                displayMode
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Constant amplitude of long-term oscillation after transient decays. Proportional to <MathView math="F_0" />.
            </p>
          </div>

          {/* Equation 6: Phase Lag */}
          <div className="p-3 rounded-lg bg-[#07111F] border border-slate-800/90 space-y-1.5">
            <span className="font-semibold text-purple-300 block">
              Equation 6: Phase Lag Between Force and Displacement
            </span>
            <div className="py-1 text-center font-mono">
              <MathView
                math={`\\phi = \\text{atan2}(c\\omega, k - m\\omega^2) = ${derived.steadyStatePhaseLagDeg.toFixed(1)}^\\circ`}
                displayMode
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Amount by which displacement lags behind applied force (<MathView math="0^\\circ" /> below, <MathView math="90^\\circ" /> at resonance, <MathView math="180^\\circ" /> above).
            </p>
          </div>

          {/* Equation 7: Resonance Peak Frequency */}
          <div className="p-3 rounded-lg bg-[#07111F] border border-yellow-500/30 space-y-1.5">
            <span className="font-semibold text-yellow-300 block">
              Equation 7: Displacement-Amplitude Peak Frequency
            </span>
            <div className="py-1 text-center font-mono">
              <MathView
                math={
                  derived.amplitudePeakFrequencyHz !== null
                    ? `f_{\\text{peak}} = \\frac{1}{2\\pi}\\sqrt{\\omega_0^2 - \\frac{c^2}{2m^2}} = ${derived.amplitudePeakFrequencyHz.toFixed(3)} \\text{ Hz}`
                    : `f_{\\text{peak}} = \\text{No non-zero peak (Heavy damping)}`
                }
                displayMode
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Exact frequency where displacement amplitude reaches its absolute maximum.
            </p>
          </div>

          {/* Equation 8: Quality Factor */}
          <div className="p-3 rounded-lg bg-[#07111F] border border-emerald-500/30 space-y-1.5">
            <span className="font-semibold text-emerald-300 block">
              Equation 8: Quality Factor (Q)
            </span>
            <div className="py-1 text-center font-mono">
              <MathView
                math={
                  derived.qualityFactor !== null
                    ? `Q = \\frac{m\\omega_0}{c} = \\frac{(${m})(${derived.naturalAngularFreq.toFixed(2)})}{${c}} = ${derived.qualityFactor.toFixed(2)}`
                    : `Q = \\infty \\text{ (Undamped, } c = 0\\text{)}`
                }
                displayMode
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Dimensionless sharpness metric: ratio of energy stored to energy dissipated per cycle.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
