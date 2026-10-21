/**
 * EQUATION 1 — Wave Interference Mathematical Equations & Analytical Theory
 * High-fidelity KaTeX equations, live numerical substitutions, and explanations
 * distinguishing general formulas from equal-frequency and equal-amplitude cases.
 */

import React, { useState } from 'react';
import {
  WaveExperimentMode,
  WaveSuperpositionParameters,
  TwoSourceParameters,
  PointInterferenceAnalysis,
} from '../../physics/waves/types';
import {
  calculateWaveNumber,
  calculateAngularFrequency,
  calculatePeriod,
  calculateWaveSpeed,
  calculateResultantAmplitude,
} from '../../physics/waves/model';
import { MathView } from '../MathView';
import { BookOpen, Sigma, Calculator } from 'lucide-react';

interface WaveEquationsProps {
  mode: WaveExperimentMode;
  superpositionParams: WaveSuperpositionParameters;
  twoSourceParams: TwoSourceParameters;
  analysis: PointInterferenceAnalysis;
}

export const WaveEquations: React.FC<WaveEquationsProps> = ({
  mode,
  superpositionParams,
  twoSourceParams,
  analysis,
}) => {
  const [filter, setFilter] = useState<'all' | 'superposition' | 'phase-path' | 'two-source'>('all');

  const { wave1, wave2 } = superpositionParams;
  const k1 = calculateWaveNumber(wave1.wavelength);
  const omega1 = calculateAngularFrequency(wave1.frequency);
  const v1 = calculateWaveSpeed(wave1.frequency, wave1.wavelength);

  const deltaPhiDeg = wave2.initialPhaseDeg - wave1.initialPhaseDeg;
  const deltaPhiRad = (deltaPhiDeg * Math.PI) / 180;
  const calculatedAR = calculateResultantAmplitude(wave1.amplitude, wave2.amplitude, deltaPhiRad);

  return (
    <div className="bg-[#090d16] border border-slate-800/90 rounded-xl p-4 sm:p-5 select-none space-y-4">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold text-white tracking-wider uppercase font-mono">
            The Mathematics of Interference
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center bg-[#07090e] p-1 rounded-lg border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Equations
          </button>
          <button
            onClick={() => setFilter('superposition')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              filter === 'superposition'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Superposition
          </button>
          <button
            onClick={() => setFilter('phase-path')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              filter === 'phase-path'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Phase & Path Diff
          </button>
          <button
            onClick={() => setFilter('two-source')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              filter === 'two-source'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Two Sources
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Principle of Superposition */}
        {(filter === 'all' || filter === 'superposition') && (
          <div className="bg-[#07090e] border border-slate-800/90 rounded-lg p-3.5 space-y-2">
            <span className="text-[10px] uppercase font-mono text-cyan-400 tracking-wider block">
              1. Principle of Linear Superposition
            </span>
            <div className="py-1">
              <MathView
                math="y_{\text{resultant}}(x,t) = y_1(x,t) + y_2(x,t)"
                displayMode
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              When two or more waves overlap in a linear medium, the resultant displacement at any point is the exact algebraic sum of the instantaneous displacements of the individual waves.
            </p>
          </div>
        )}

        {/* 2. Sinusoidal Traveling Wave Model */}
        {(filter === 'all' || filter === 'superposition') && (
          <div className="bg-[#07090e] border border-slate-800/90 rounded-lg p-3.5 space-y-2">
            <span className="text-[10px] uppercase font-mono text-cyan-400 tracking-wider block">
              2. 1D Traveling Wave Formulation
            </span>
            <div className="py-1">
              <MathView
                math="y(x,t) = A \sin(kx \mp \omega t + \phi)"
                displayMode
              />
            </div>
            <div className="text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2 space-y-0.5">
              <div className="flex justify-between">
                <span>Wave number:</span>
                <span className="text-cyan-300">
                  <MathView math={`k = \\frac{2\\pi}{\\lambda} = \\frac{2\\pi}{${wave1.wavelength.toFixed(2)}} = ${k1.toFixed(2)}\\text{ rad/m}`} />
                </span>
              </div>
              <div className="flex justify-between">
                <span>Angular frequency:</span>
                <span className="text-cyan-300">
                  <MathView math={`\\omega = 2\\pi f = 2\\pi(${wave1.frequency.toFixed(2)}) = ${omega1.toFixed(2)}\\text{ rad/s}`} />
                </span>
              </div>
              <div className="flex justify-between">
                <span>Wave speed:</span>
                <span className="text-white">
                  <MathView math={`v = f\\lambda = (${wave1.frequency.toFixed(2)})(${wave1.wavelength.toFixed(2)}) = ${v1.toFixed(2)}\\text{ m/s}`} />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 3. Resultant Amplitude for Coherent Waves */}
        {(filter === 'all' || filter === 'phase-path') && (
          <div className="bg-[#07090e] border border-slate-800/90 rounded-lg p-3.5 space-y-2">
            <span className="text-[10px] uppercase font-mono text-cyan-400 tracking-wider block">
              3. Resultant Amplitude Equation (Equal Frequency)
            </span>
            <div className="py-1">
              <MathView
                math="A_R = \sqrt{A_1^2 + A_2^2 + 2A_1A_2 \cos(\Delta\phi)}"
                displayMode
              />
            </div>
            <div className="text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2 space-y-1">
              <div className="flex justify-between">
                <span>Equal-Amplitude Special Case:</span>
                <span className="text-amber-300">
                  <MathView math="A_R = 2A \left|\cos\left(\frac{\Delta\phi}{2}\right)\right|" />
                </span>
              </div>
              <div className="flex justify-between">
                <span>Current parameter substitution:</span>
                <span className="text-amber-400 font-bold">
                  <MathView math={`A_R = ${calculatedAR.toFixed(3)}\\text{ m}`} />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 4. Constructive and Destructive Phase Conditions */}
        {(filter === 'all' || filter === 'phase-path') && (
          <div className="bg-[#07090e] border border-slate-800/90 rounded-lg p-3.5 space-y-2">
            <span className="text-[10px] uppercase font-mono text-cyan-400 tracking-wider block">
              4. Ideal Interference Criteria
            </span>
            <div className="space-y-1 py-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-cyan-300 font-bold">Constructive:</span>
                <MathView math="\Delta\Phi = 2\pi n \quad (n = 0, \pm 1, \pm 2 \dots)" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-rose-300 font-bold">Destructive:</span>
                <MathView math="\Delta\Phi = (2n + 1)\pi \quad (n = 0, \pm 1, \pm 2 \dots)" />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 leading-relaxed">
              When initially in-phase (<MathView math="\Delta\phi_0 = 0" />), these conditions translate directly into spatial path differences: <MathView math="\Delta r = n\lambda" /> (constructive) and <MathView math="\Delta r = (n + \frac{1}{2})\lambda" /> (destructive).
            </p>
          </div>
        )}

        {/* 5. Phase Difference vs. Path Difference */}
        {(filter === 'all' || filter === 'two-source') && (
          <div className="bg-[#07090e] border border-slate-800/90 rounded-lg p-3.5 space-y-2 md:col-span-2">
            <span className="text-[10px] uppercase font-mono text-cyan-400 tracking-wider block">
              5. Spatial Path Difference vs. Effective Phase Shift at Point P
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-1">
              <div>
                <MathView
                  math="\Delta r = r_2 - r_1 = \sqrt{x^2 + (y + d/2)^2} - \sqrt{x^2 + (y - d/2)^2}"
                  displayMode
                />
              </div>
              <div>
                <MathView
                  math="\Delta\Phi = k\Delta r + \Delta\phi_0 = \frac{2\pi}{\lambda}(r_2 - r_1) + (\phi_2 - \phi_1)"
                  displayMode
                />
              </div>
            </div>
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded font-mono text-[11px] text-slate-300 flex flex-wrap justify-between gap-2">
              <span>Probe Point P: r₁ = {analysis.r1.toFixed(2)}m, r₂ = {analysis.r2.toFixed(2)}m</span>
              <span className="text-cyan-300">Path Difference: Δr = {analysis.pathDifference.toFixed(3)}m ({(analysis.pathDifferenceInWavelengths).toFixed(2)}λ)</span>
              <span className="text-purple-300">Phase Shift: ΔΦ = {analysis.effectivePhaseDiffDeg.toFixed(1)}° ({(analysis.effectivePhaseDiffRad / Math.PI).toFixed(2)}π rad)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
