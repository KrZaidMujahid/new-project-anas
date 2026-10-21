/**
 * EQUATION 1 — Newton's Laws Mathematical Equations Panel
 * LaTeX notation rendered with KaTeX, displaying analytical formulations and live substituted calculations.
 */

import React, { useState } from 'react';
import {
  NewtonFirstLawParameters,
  NewtonMode,
  NewtonSecondLawParameters,
  NewtonSecondLawState,
  NewtonThirdLawParameters,
  NewtonThirdLawState,
} from '../../physics/newton/types';
import { MathView } from '../MathView';
import { Sigma, FunctionSquare, Variable } from 'lucide-react';

interface NewtonEquationsProps {
  mode: NewtonMode;
  secondLawParams: NewtonSecondLawParameters;
  secondLawState: NewtonSecondLawState;
  firstLawParams: NewtonFirstLawParameters;
  thirdLawParams: NewtonThirdLawParameters;
  thirdLawState: NewtonThirdLawState;
}

export const NewtonEquations: React.FC<NewtonEquationsProps> = ({
  mode,
  secondLawParams,
  secondLawState,
  firstLawParams,
  thirdLawParams,
  thirdLawState,
}) => {
  const [tab, setTab] = useState<'algebraic' | 'substituted'>('algebraic');

  return (
    <div className="bg-[#0b101b] border border-slate-800/90 rounded-lg p-4 select-none space-y-4">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <Sigma className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Governing Equations
          </h2>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-[#07090e] border border-slate-800 rounded p-0.5 text-[11px] font-mono">
          <button
            onClick={() => setTab('algebraic')}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded transition-colors cursor-pointer ${
              tab === 'algebraic'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FunctionSquare className="w-3 h-3" />
            <span>Analytical Form</span>
          </button>

          <button
            onClick={() => setTab('substituted')}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded transition-colors cursor-pointer ${
              tab === 'substituted'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Variable className="w-3 h-3" />
            <span>Substituted Values</span>
          </button>
        </div>
      </div>

      {tab === 'algebraic' ? (
        <div className="space-y-3 text-xs">
          {mode === 'second-law' && (
            <>
              {/* Second Law: F = ma */}
              <div className="bg-[#07090e] border border-slate-800/80 rounded p-3 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span className="font-semibold text-slate-300">Second Law of Motion</span>
                  <span className="font-mono text-[10px] text-emerald-400">Fundamental Law</span>
                </div>
                <div className="text-slate-100 overflow-x-auto py-1">
                  <MathView math="\Sigma \vec{F} = m \vec{a} \quad \implies \quad \vec{a} = \frac{\Sigma \vec{F}}{m}" displayMode />
                </div>
              </div>

              {/* Kinematic Evolution Equations */}
              <div className="bg-[#07090e] border border-slate-800/80 rounded p-3 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span className="font-semibold text-slate-300">1D Kinematic Equations</span>
                  <span className="font-mono text-[10px] text-slate-400">Position & Velocity</span>
                </div>
                <div className="text-slate-100 overflow-x-auto py-1">
                  <MathView math="v(t) = v_0 + a t, \quad x(t) = x_0 + v_0 t + \frac{1}{2}a t^2" displayMode />
                </div>
              </div>

              {/* Friction Model */}
              {secondLawParams.frictionEnabled && (
                <div className="bg-[#07090e] border border-slate-800/80 rounded p-3 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="font-semibold text-slate-300">Surface Friction Force</span>
                    <span className="font-mono text-[10px] text-amber-400">Opposes motion</span>
                  </div>
                  <div className="text-slate-100 overflow-x-auto py-1">
                    <MathView math="f_k = \mu_k N = \mu_k (m g), \quad \Sigma F = F_{\text{app}} - \text{sgn}(v) f_k" displayMode />
                  </div>
                </div>
              )}
            </>
          )}

          {mode === 'first-law' && (
            <>
              {/* First Law: Inertia */}
              <div className="bg-[#07090e] border border-slate-800/80 rounded p-3 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span className="font-semibold text-slate-300">First Law (Law of Inertia)</span>
                  <span className="font-mono text-[10px] text-cyan-400">Zero Net Force</span>
                </div>
                <div className="text-slate-100 overflow-x-auto py-1">
                  <MathView math="\Sigma \vec{F} = 0 \quad \implies \quad \vec{a} = 0 \quad \implies \quad \vec{v} = \text{constant}" displayMode />
                </div>
              </div>

              <div className="bg-[#07090e] border border-slate-800/80 rounded p-3 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span className="font-semibold text-slate-300">Uniform Motion Equation</span>
                  <span className="font-mono text-[10px] text-slate-400">Zero acceleration</span>
                </div>
                <div className="text-slate-100 overflow-x-auto py-1">
                  <MathView math="x(t) = x_0 + v_0 t" displayMode />
                </div>
              </div>
            </>
          )}

          {mode === 'third-law' && (
            <>
              {/* Third Law: Action-Reaction */}
              <div className="bg-[#07090e] border border-slate-800/80 rounded p-3 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span className="font-semibold text-slate-300">Third Law (Action & Reaction)</span>
                  <span className="font-mono text-[10px] text-rose-400">Interaction Pair</span>
                </div>
                <div className="text-slate-100 overflow-x-auto py-1">
                  <MathView math="\vec{F}_{A \to B} = -\vec{F}_{B \to A} \quad \implies \quad |\vec{F}_{A \to B}| = |\vec{F}_{B \to A}|" displayMode />
                </div>
              </div>

              {/* Distinct Accelerations */}
              <div className="bg-[#07090e] border border-slate-800/80 rounded p-3 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span className="font-semibold text-slate-300">Mass-Dependent Accelerations</span>
                  <span className="font-mono text-[10px] text-purple-400">Inverse ratio</span>
                </div>
                <div className="text-slate-100 overflow-x-auto py-1">
                  <MathView math="a_A = \frac{F_{B \to A}}{m_A}, \quad a_B = \frac{F_{A \to B}}{m_B} \quad \implies \quad \frac{a_A}{a_B} = -\frac{m_B}{m_A}" displayMode />
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        /* Substituted Values Tab */
        <div className="space-y-3 text-xs">
          {mode === 'second-law' && (
            <>
              <div className="bg-[#07090e] border border-slate-800/80 rounded p-3 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span className="font-semibold text-slate-300">Acceleration Calculation</span>
                  <span className="font-mono text-[10px] text-yellow-400">= {secondLawState.acceleration.toFixed(2)} m/s²</span>
                </div>
                <div className="text-slate-100 overflow-x-auto py-1">
                  <MathView
                    math={`a = \\frac{\\Sigma F}{m} = \\frac{${secondLawState.netForce.toFixed(1)}\\text{ N}}{${secondLawParams.mass.toFixed(1)}\\text{ kg}} = ${secondLawState.acceleration.toFixed(2)}\\text{ m/s}^2`}
                    displayMode
                  />
                </div>
              </div>

              <div className="bg-[#07090e] border border-slate-800/80 rounded p-3 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span className="font-semibold text-slate-300">Net Force Evaluation</span>
                  <span className="font-mono text-[10px] text-emerald-400">= {secondLawState.netForce.toFixed(2)} N</span>
                </div>
                <div className="text-slate-100 overflow-x-auto py-1">
                  <MathView
                    math={`\\Sigma F = F_1 (${secondLawParams.appliedForce.toFixed(1)}) + F_2 (${secondLawParams.opposingForce.toFixed(1)}) ${secondLawParams.frictionEnabled ? `+ f (${secondLawState.frictionForce.toFixed(1)})` : ''} = ${secondLawState.netForce.toFixed(2)}\\text{ N}`}
                    displayMode
                  />
                </div>
              </div>
            </>
          )}

          {mode === 'first-law' && (
            <div className="bg-[#07090e] border border-slate-800/80 rounded p-3 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="font-semibold text-slate-300">Inertial Invariant Evaluation</span>
                <span className="font-mono text-[10px] text-emerald-400">a = 0</span>
              </div>
              <div className="text-slate-100 overflow-x-auto py-1">
                <MathView
                  math={`\\Sigma F = ${firstLawParams.appliedForce.toFixed(1)}\\text{ N} \\implies a = \\frac{${firstLawParams.appliedForce.toFixed(1)}}{${firstLawParams.mass.toFixed(1)}} = ${(firstLawParams.appliedForce / firstLawParams.mass).toFixed(2)}\\text{ m/s}^2`}
                  displayMode
                />
              </div>
            </div>
          )}

          {mode === 'third-law' && (
            <>
              <div className="bg-[#07090e] border border-slate-800/80 rounded p-3 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span className="font-semibold text-slate-300">Action & Reaction Vector Pair</span>
                  <span className="font-mono text-[10px] text-rose-400">|F| = {thirdLawParams.interactionForce} N</span>
                </div>
                <div className="text-slate-100 overflow-x-auto py-1">
                  <MathView
                    math={`F_{A \\to B} = +${thirdLawParams.interactionForce}\\text{ N}, \\quad F_{B \\to A} = -${thirdLawParams.interactionForce}\\text{ N}`}
                    displayMode
                  />
                </div>
              </div>

              <div className="bg-[#07090e] border border-slate-800/80 rounded p-3 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span className="font-semibold text-slate-300">Calculated Accelerations</span>
                  <span className="font-mono text-[10px] text-cyan-400">Distinct |a|</span>
                </div>
                <div className="text-slate-100 overflow-x-auto py-1">
                  <MathView
                    math={`a_A = \\frac{-${thirdLawParams.interactionForce}}{${thirdLawParams.massA}} = ${(-thirdLawParams.interactionForce / thirdLawParams.massA).toFixed(2)}\\text{ m/s}^2, \\quad a_B = \\frac{+${thirdLawParams.interactionForce}}{${thirdLawParams.massB}} = ${(thirdLawParams.interactionForce / thirdLawParams.massB).toFixed(2)}\\text{ m/s}^2`}
                    displayMode
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
