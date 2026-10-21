/**
 * EQUATION 1 — Simple Harmonic Motion Mathematical Equation Panel
 * Professional mathematical notation using KaTeX, step-by-step substitutions,
 * and current parameter calculations.
 */

import React, { useState } from 'react';
import { SHMParameters, SHMDerivedValues, SHMState } from '../../physics/shm/types';
import { MathView } from '../MathView';
import { BookOpen, ChevronDown, ChevronRight, Calculator } from 'lucide-react';

interface SHMEquationsProps {
  params: SHMParameters;
  derived: SHMDerivedValues;
  state: SHMState;
}

export const SHMEquations: React.FC<SHMEquationsProps> = ({
  params,
  derived,
  state,
}) => {
  const [activeSection, setActiveSection] = useState<'all' | 'kinematics' | 'dynamics' | 'energy'>('all');

  const { mass, springConstant, amplitude, gravity, pendulumLength } = params;
  const { omega, frequency, period, totalEnergy, vMax, aMax, fMax, staticExtension } = derived;

  return (
    <div className="bg-[#090d16] border border-slate-800/90 rounded-xl p-4 sm:p-5 select-none space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold text-white tracking-wider uppercase font-mono">
            Equations & Analytical Theory
          </h2>
        </div>

        {/* Section Filter Pills */}
        <div className="flex items-center bg-[#07090e] p-1 rounded-lg border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveSection('all')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeSection === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Equations
          </button>
          <button
            onClick={() => setActiveSection('kinematics')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeSection === 'kinematics'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Kinematics
          </button>
          <button
            onClick={() => setActiveSection('dynamics')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeSection === 'dynamics'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Dynamics
          </button>
          <button
            onClick={() => setActiveSection('energy')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeSection === 'energy'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Energy
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Fundamental SHM Differential Equation */}
        {(activeSection === 'all' || activeSection === 'dynamics') && (
          <div className="bg-[#07090e] border border-slate-800/90 rounded-lg p-3.5 space-y-2">
            <span className="text-[10px] uppercase font-mono text-cyan-400 tracking-wider block">
              1. Fundamental SHM Differential Equation
            </span>
            <div className="py-1">
              <MathView
                math="\frac{d^2x}{dt^2} + \omega^2 x = 0 \iff \frac{d^2x}{dt^2} = -\omega^2 x"
                displayMode
              />
            </div>
            <div className="text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2 flex items-center justify-between">
              <span>Current substitution:</span>
              <span className="text-cyan-300">
                <MathView
                  math={`a = -(${omega.toFixed(2)})^2 x = -${(omega * omega).toFixed(2)} x`}
                />
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Restoring acceleration is strictly proportional to displacement and directed toward equilibrium.
            </p>
          </div>
        )}

        {/* 2. Angular Frequency & Period */}
        {(activeSection === 'all' || activeSection === 'kinematics') && (
          <div className="bg-[#07090e] border border-slate-800/90 rounded-lg p-3.5 space-y-2">
            <span className="text-[10px] uppercase font-mono text-cyan-400 tracking-wider block">
              2. Frequency & Oscillation Period
            </span>
            <div className="py-1">
              {params.systemType === 'pendulum' ? (
                <MathView
                  math="\omega = \sqrt{\frac{g}{L}}, \quad T = 2\pi\sqrt{\frac{L}{g}}, \quad f = \frac{1}{T}"
                  displayMode
                />
              ) : (
                <MathView
                  math="\omega = \sqrt{\frac{k}{m}}, \quad T = 2\pi\sqrt{\frac{m}{k}}, \quad f = \frac{1}{T}"
                  displayMode
                />
              )}
            </div>
            <div className="text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2 space-y-1">
              {params.systemType === 'pendulum' ? (
                <div className="flex justify-between">
                  <span>Current substitution:</span>
                  <span className="text-cyan-300">
                    <MathView
                      math={`\\omega = \\sqrt{\\frac{${gravity.toFixed(2)}}{${pendulumLength.toFixed(2)}}} = ${omega.toFixed(3)}\\text{ rad/s}`}
                    />
                  </span>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span>Current substitution:</span>
                  <span className="text-cyan-300">
                    <MathView
                      math={`\\omega = \\sqrt{\\frac{${springConstant.toFixed(1)}}{${mass.toFixed(1)}}} = ${omega.toFixed(3)}\\text{ rad/s}`}
                    />
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Period calculation:</span>
                <span className="text-purple-300">
                  <MathView
                    math={`T = \\frac{2\\pi}{${omega.toFixed(3)}} = ${period.toFixed(3)}\\text{ s}`}
                  />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 3. Displacement, Velocity & Acceleration Functions */}
        {(activeSection === 'all' || activeSection === 'kinematics') && (
          <div className="bg-[#07090e] border border-slate-800/90 rounded-lg p-3.5 space-y-2">
            <span className="text-[10px] uppercase font-mono text-cyan-400 tracking-wider block">
              3. Kinematic Harmonic Functions
            </span>
            <div className="space-y-1.5 py-1 text-xs">
              <MathView
                math="x(t) = A \cos(\omega t + \phi)"
                displayMode
              />
              <MathView
                math="v(t) = \frac{dx}{dt} = -A\omega \sin(\omega t + \phi)"
                displayMode
              />
              <MathView
                math="a(t) = \frac{dv}{dt} = -A\omega^2 \cos(\omega t + \phi) = -\omega^2 x(t)"
                displayMode
              />
            </div>
            <div className="text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2 space-y-1">
              <div className="flex justify-between">
                <span>Maximum speed:</span>
                <span className="text-emerald-300">
                  <MathView math={`v_{\\text{max}} = A\\omega = ${vMax.toFixed(3)}\\text{ m/s}`} />
                </span>
              </div>
              <div className="flex justify-between">
                <span>Maximum acceleration:</span>
                <span className="text-amber-300">
                  <MathView math={`a_{\\text{max}} = A\\omega^2 = ${aMax.toFixed(3)}\\text{ m/s}^2`} />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 4. Restoring Force & Hooke's Law */}
        {(activeSection === 'all' || activeSection === 'dynamics') && (
          <div className="bg-[#07090e] border border-slate-800/90 rounded-lg p-3.5 space-y-2">
            <span className="text-[10px] uppercase font-mono text-cyan-400 tracking-wider block">
              4. Restoring Force (Hooke's Law)
            </span>
            <div className="py-1">
              {params.systemType === 'pendulum' ? (
                <MathView
                  math="F_t = -mg \sin\theta \approx -mg\theta = -\frac{mg}{L}s"
                  displayMode
                />
              ) : (
                <MathView
                  math="F = -kx, \quad a = \frac{F}{m} = -\frac{k}{m}x = -\omega^2 x"
                  displayMode
                />
              )}
            </div>
            <div className="text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2 space-y-1">
              <div className="flex justify-between">
                <span>Instantaneous Force at t={state.time.toFixed(2)}s:</span>
                <span className="text-rose-300">
                  <MathView
                    math={`F = -${springConstant.toFixed(1)} \\times (${state.displacement.toFixed(3)}) = ${state.restoringForce.toFixed(2)}\\text{ N}`}
                  />
                </span>
              </div>
              <div className="flex justify-between">
                <span>Maximum force magnitude:</span>
                <span className="text-rose-400">
                  <MathView math={`F_{\\text{max}} = kA = ${fMax.toFixed(2)}\\text{ N}`} />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 5. Mechanical Energy Conservation */}
        {(activeSection === 'all' || activeSection === 'energy') && (
          <div className="bg-[#07090e] border border-slate-800/90 rounded-lg p-3.5 space-y-2 md:col-span-2">
            <span className="text-[10px] uppercase font-mono text-cyan-400 tracking-wider block">
              5. Conservation of Mechanical Energy
            </span>
            <div className="py-1">
              <MathView
                math="E = K + U = \frac{1}{2}mv(t)^2 + \frac{1}{2}kx(t)^2 = \frac{1}{2}kA^2 = \text{Constant}"
                displayMode
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
              <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                <span className="text-cyan-400 block font-semibold">Kinetic (K):</span>
                <span>½mv² = ½({mass.toFixed(1)})({state.velocity.toFixed(2)})²</span>
                <span className="block text-white font-bold mt-0.5">{state.kineticEnergy.toFixed(4)} J</span>
              </div>
              <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                <span className="text-purple-400 block font-semibold">Potential (U):</span>
                <span>½kx² = ½({springConstant.toFixed(1)})({state.displacement.toFixed(2)})²</span>
                <span className="block text-white font-bold mt-0.5">{state.potentialEnergy.toFixed(4)} J</span>
              </div>
              <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                <span className="text-emerald-400 block font-semibold">Total (E = K + U):</span>
                <span>½kA² = ½({springConstant.toFixed(1)})({derived.effectiveAmplitude.toFixed(2)})²</span>
                <span className="block text-white font-bold mt-0.5">{totalEnergy.toFixed(4)} J (Const)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
