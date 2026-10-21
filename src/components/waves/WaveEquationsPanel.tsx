/**
 * EQUATION 1 — Physics Equations Panel: "Physics Behind the Simulation"
 * Rigorous KaTeX-rendered equations with real-time numeric parameter substitutions,
 * step-by-step mathematical proofs, and active highlights.
 */

import React, { useState } from 'react';
import { TwoSourceParameters, PointInterferenceAnalysis } from '../../physics/waves/types';
import { calculateWaveNumber, calculateAngularFrequency, calculatePeriod } from '../../physics/waves/model';
import { MathView } from '../MathView';
import { BookOpen, Calculator, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface WaveEquationsPanelProps {
  params: TwoSourceParameters;
  analysis: PointInterferenceAnalysis;
}

export const WaveEquationsPanel: React.FC<WaveEquationsPanelProps> = ({
  params,
  analysis,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const k = calculateWaveNumber(params.wavelength);
  const omega = calculateAngularFrequency(params.frequency);
  const period = calculatePeriod(params.frequency);
  const waveSpeed = params.frequency * params.wavelength;

  const phi0Rad = (params.phaseDifferenceDeg * Math.PI) / 180;
  const equalAmp = params.amplitude;

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
              Physics Behind the Simulation
            </h2>
            <p className="text-[11px] text-slate-400">
              Fundamental wave equations & live parameter evaluation
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
          {/* A. Wave Equation */}
          <div className="p-3 rounded-lg bg-[#07111F] border border-slate-800/90 space-y-1.5">
            <span className="font-semibold text-cyan-300 block">
              A. General Sinusoidal Wave Equation
            </span>
            <div className="py-1 text-center font-mono">
              <MathView math="y(r, t) = A \sin(kr - \omega t + \phi)" displayMode />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Describes instantaneous harmonic displacement at distance <MathView math="r" /> and time <MathView math="t" />.
            </p>
          </div>

          {/* B. Wave Number */}
          <div className="p-3 rounded-lg bg-[#07111F] border border-slate-800/90 space-y-1.5">
            <span className="font-semibold text-cyan-300 block">
              B. Spatial Frequency (Wave Number)
            </span>
            <div className="py-1 text-center font-mono">
              <MathView
                math={`k = \\frac{2\\pi}{\\lambda} = \\frac{2\\pi}{${params.wavelength.toFixed(2)}} = ${k.toFixed(3)} \\text{ rad/m}`}
                displayMode
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Spatial rate of phase rotation per meter of travel.
            </p>
          </div>

          {/* C. Angular Frequency */}
          <div className="p-3 rounded-lg bg-[#07111F] border border-slate-800/90 space-y-1.5">
            <span className="font-semibold text-cyan-300 block">
              C. Temporal Angular Frequency
            </span>
            <div className="py-1 text-center font-mono">
              <MathView
                math={`\\omega = 2\\pi f = 2\\pi(${params.frequency.toFixed(2)}) = ${omega.toFixed(2)} \\text{ rad/s}`}
                displayMode
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Rate of phase rotation with time (<MathView math={`T = 1/f = ${period.toFixed(2)} \\text{ s}`} />).
            </p>
          </div>

          {/* D. Wave Speed */}
          <div className="p-3 rounded-lg bg-[#07111F] border border-slate-800/90 space-y-1.5">
            <span className="font-semibold text-cyan-300 block">
              D. Wave Speed in the Medium
            </span>
            <div className="py-1 text-center font-mono">
              <MathView
                math={`v = f\\lambda = (${params.frequency.toFixed(1)})(${params.wavelength.toFixed(2)}) = ${waveSpeed.toFixed(2)} \\text{ m/s}`}
                displayMode
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Phase velocity at which circular wavefronts propagate outward from S₁ and S₂.
            </p>
          </div>

          {/* E. Path Difference */}
          <div className="p-3 rounded-lg bg-[#07111F] border border-slate-800/90 space-y-1.5">
            <span className="font-semibold text-yellow-300 block">
              E. Path Difference at Point P
            </span>
            <div className="py-1 text-center font-mono">
              <MathView
                math={`\\Delta r = r_2 - r_1 = ${analysis.r2.toFixed(3)} - ${analysis.r1.toFixed(3)} = ${analysis.pathDifference.toFixed(3)} \\text{ m}`}
                displayMode
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Geometric difference in distance traveled from each source to observation point P.
            </p>
          </div>

          {/* F. Phase Difference Caused by Path Difference */}
          <div className="p-3 rounded-lg bg-[#07111F] border border-slate-800/90 space-y-1.5">
            <span className="font-semibold text-yellow-300 block">
              F. Total Phase Difference at Point P
            </span>
            <div className="py-1 text-center font-mono">
              <MathView
                math={`\\Delta\\phi = \\frac{2\\pi \\Delta r}{\\lambda} + \\phi_0 = ${analysis.effectivePhaseDiffDeg.toFixed(1)}^\\circ \\text{ (${(analysis.effectivePhaseDiffRad / Math.PI).toFixed(2)}\\pi rad)}`}
                displayMode
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Combines geometric delay <MathView math="k\\Delta r" /> and source phase shift <MathView math={`\\phi_0 = ${params.phaseDifferenceDeg}^\\circ`} />.
            </p>
          </div>

          {/* G. Constructive Condition */}
          <div className="p-3 rounded-lg bg-[#07111F] border border-emerald-500/30 space-y-1.5">
            <span className="font-semibold text-emerald-300 block flex items-center justify-between">
              <span>G. Constructive Interference Condition</span>
              <span className="text-[10px] text-emerald-400 font-mono">In-Phase Waves</span>
            </span>
            <div className="py-1 text-center font-mono">
              <MathView
                math="\Delta r = n\lambda, \quad n = 0, \pm 1, \pm 2, \dots"
                displayMode
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Waves arrive in phase (<MathView math="\Delta\phi = 2\pi n" />); displacements add constructively.
            </p>
          </div>

          {/* H. Destructive Condition */}
          <div className="p-3 rounded-lg bg-[#07111F] border border-rose-500/30 space-y-1.5">
            <span className="font-semibold text-rose-300 block flex items-center justify-between">
              <span>H. Destructive Interference Condition</span>
              <span className="text-[10px] text-rose-400 font-mono">Opposite-Phase Waves</span>
            </span>
            <div className="py-1 text-center font-mono">
              <MathView
                math="\Delta r = \left(n + \frac{1}{2}\right)\lambda, \quad n = 0, \pm 1, \pm 2, \dots"
                displayMode
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Waves arrive in anti-phase (<MathView math="\Delta\phi = (2n+1)\pi" />); displacements cancel completely.
            </p>
          </div>

          {/* I. Resultant Amplitude */}
          <div className="p-3 rounded-lg bg-[#07111F] border border-slate-800/90 space-y-1.5">
            <span className="font-semibold text-cyan-300 block">
              I. Resultant Amplitude (Equal Amplitude A)
            </span>
            <div className="py-1 text-center font-mono">
              <MathView
                math={`A_r = 2A\\left|\\cos\\frac{\\Delta\\phi}{2}\\right| = 2(${equalAmp.toFixed(1)})\\left|\\cos\\frac{${analysis.effectivePhaseDiffDeg.toFixed(0)}^\\circ}{2}\\right| = ${analysis.resultantAmplitude.toFixed(2)} \\text{ a.u.}`}
                displayMode
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              For general amplitudes: <MathView math="A_r = \sqrt{A_1^2 + A_2^2 + 2A_1 A_2 \cos\Delta\phi}" />.
            </p>
          </div>

          {/* J. Intensity Relationship */}
          <div className="p-3 rounded-lg bg-[#07111F] border border-slate-800/90 space-y-1.5">
            <span className="font-semibold text-cyan-300 block">
              J. Relative Intensity Relationship
            </span>
            <div className="py-1 text-center font-mono">
              <MathView
                math={`I = I_{\\max}\\cos^2\\left(\\frac{\\Delta\\phi}{2}\\right) = ${(analysis.relativeIntensity * 25).toFixed(1)}\\% \\text{ of } I_{\\max}`}
                displayMode
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Intensity is proportional to square of amplitude (<MathView math="I \propto A_r^2" />), producing bright fringes and dark nulls.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
