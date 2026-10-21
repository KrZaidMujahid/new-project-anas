/**
 * EQUATION 1 — Inclined Plane Mathematical Equations Panel
 * LaTeX notation rendered with KaTeX, displaying analytical formulations and live substituted calculations.
 */

import React, { useState } from 'react';
import {
  InclineMode,
  InclineParameters,
  InclineState,
} from '../../physics/incline/types';
import { MathView } from '../MathView';
import { Sigma, FunctionSquare, Variable } from 'lucide-react';

interface InclineEquationsProps {
  mode: InclineMode;
  params: InclineParameters;
  state: InclineState;
}

export const InclineEquations: React.FC<InclineEquationsProps> = ({
  mode,
  params,
  state,
}) => {
  const [tab, setTab] = useState<'algebraic' | 'substituted'>('algebraic');

  const thetaRad = (params.angleDeg * Math.PI) / 180;
  const sinTheta = Math.sin(thetaRad);
  const cosTheta = Math.cos(thetaRad);

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
        <div className="space-y-3.5 text-xs">
          {/* Gravity Components */}
          <div className="p-3 bg-slate-900/50 border border-slate-800/80 rounded-md space-y-2">
            <div className="text-slate-300 font-semibold flex items-center justify-between">
              <span>1. Resolution of Gravitational Weight</span>
              <span className="text-[10px] text-cyan-400 font-mono">Coordinate Projection</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Weight <span className="font-mono text-slate-300">W = mg</span> acts vertically downwards. Projecting onto axes parallel and perpendicular to the inclined ramp at angle <span className="font-mono text-cyan-300">θ</span>:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-cyan-200">
              <div className="p-2 bg-[#07090e] border border-slate-800 rounded">
                <MathView math="W_\parallel = mg \sin\theta \quad \text{(down slope)}" />
              </div>
              <div className="p-2 bg-[#07090e] border border-slate-800 rounded">
                <MathView math="W_\perp = mg \cos\theta \quad \text{(into surface)}" />
              </div>
            </div>
          </div>

          {/* Normal Force Balance */}
          <div className="p-3 bg-slate-900/50 border border-slate-800/80 rounded-md space-y-2">
            <div className="text-slate-300 font-semibold flex items-center justify-between">
              <span>2. Normal Force Equilibrium (Perpendicular Axis)</span>
              <span className="text-[10px] text-amber-400 font-mono">ΣF_n = 0</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Because the block does not accelerate perpendicularly off or into the incline surface:
            </p>
            <div className="p-2 bg-[#07090e] border border-slate-800 rounded font-mono text-amber-200">
              <MathView math="\Sigma F_\perp = N - mg \cos\theta = 0 \implies N = mg \cos\theta" />
            </div>
          </div>

          {/* Friction & Angle of Repose */}
          <div className="p-3 bg-slate-900/50 border border-slate-800/80 rounded-md space-y-2">
            <div className="text-slate-300 font-semibold flex items-center justify-between">
              <span>3. Coulomb Friction & Critical Angle of Repose</span>
              <span className="text-[10px] text-rose-400 font-mono">Coulomb Model</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Static friction matches driving force up to threshold <span className="font-mono text-rose-300">f_s \le \mu_s N</span>. On an unforced incline, slipping occurs when <span className="font-mono text-rose-300">mg \sin\theta &gt; \mu_s mg \cos\theta</span>:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-rose-200">
              <div className="p-2 bg-[#07090e] border border-slate-800 rounded">
                <MathView math="f_k = \mu_k N = \mu_k mg \cos\theta" />
              </div>
              <div className="p-2 bg-[#07090e] border border-slate-800 rounded">
                <MathView math="\tan\theta_c = \mu_s \implies \theta_c = \arctan(\mu_s)" />
              </div>
            </div>
          </div>

          {/* Net Force & Second Law */}
          <div className="p-3 bg-slate-900/50 border border-slate-800/80 rounded-md space-y-2">
            <div className="text-slate-300 font-semibold flex items-center justify-between">
              <span>4. Equation of Motion along the Ramp</span>
              <span className="text-[10px] text-emerald-400 font-mono">ΣF_s = ma</span>
            </div>
            <div className="p-2 bg-[#07090e] border border-slate-800 rounded font-mono text-emerald-200">
              <MathView math="\Sigma F_\parallel = F_{\text{app}} - mg \sin\theta + f_{\text{friction}} = m a" />
            </div>
            <div className="p-2 bg-[#07090e] border border-slate-800 rounded font-mono text-emerald-300 text-center">
              <MathView math="a = \frac{F_{\text{app}} - mg \sin\theta + f_{\text{friction}}}{m}" />
            </div>
          </div>

          {/* Work-Energy Theorem */}
          <div className="p-3 bg-slate-900/50 border border-slate-800/80 rounded-md space-y-2">
            <div className="text-slate-300 font-semibold flex items-center justify-between">
              <span>5. Work-Energy Conservation</span>
              <span className="text-[10px] text-purple-400 font-mono">ΔE = W_nc</span>
            </div>
            <div className="p-2 bg-[#07090e] border border-slate-800 rounded font-mono text-purple-200">
              <MathView math="\Delta K + \Delta U = W_{\text{applied}} + W_{\text{friction}}" />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3.5 text-xs">
          {/* Live Substituted Quantities */}
          <div className="p-3 bg-slate-900/50 border border-slate-800/80 rounded-md space-y-2.5">
            <div className="text-slate-300 font-semibold">
              Live Numerical Evaluations at Current Parameters:
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="p-2 bg-[#07090e] border border-slate-800 rounded text-cyan-300">
                <MathView
                  math={`W = mg = (${params.mass.toFixed(1)})(${params.gravity.toFixed(2)}) = ${state.weight.toFixed(2)}\\text{ N}`}
                />
              </div>

              <div className="p-2 bg-[#07090e] border border-slate-800 rounded text-sky-300">
                <MathView
                  math={`W_\\parallel = mg \\sin(${params.angleDeg.toFixed(1)}^\\circ) = (${state.weight.toFixed(1)})(${sinTheta.toFixed(3)}) = ${state.gravityParallel.toFixed(2)}\\text{ N}`}
                />
              </div>

              <div className="p-2 bg-[#07090e] border border-slate-800 rounded text-amber-300">
                <MathView
                  math={`N = mg \\cos(${params.angleDeg.toFixed(1)}^\\circ) = (${state.weight.toFixed(1)})(${cosTheta.toFixed(3)}) = ${state.normalForce.toFixed(2)}\\text{ N}`}
                />
              </div>

              {params.frictionEnabled && (
                <div className="p-2 bg-[#07090e] border border-slate-800 rounded text-rose-300">
                  <MathView
                    math={`f_{s,\\max} = \\mu_s N = (${params.staticFrictionCoeff.toFixed(2)})(${state.normalForce.toFixed(1)}) = ${state.maxStaticFriction.toFixed(2)}\\text{ N}`}
                  />
                </div>
              )}

              <div className="p-2 bg-[#07090e] border border-slate-800 rounded text-emerald-300">
                <MathView
                  math={`\\Sigma F = ${state.appliedForceSigned.toFixed(1)} - ${state.gravityParallel.toFixed(1)} + (${state.currentFrictionForce.toFixed(1)}) = ${state.netForce.toFixed(2)}\\text{ N}`}
                />
              </div>

              <div className="p-2 bg-[#07090e] border border-slate-800 rounded text-purple-300">
                <MathView
                  math={`a = \\frac{\\Sigma F}{m} = \\frac{${state.netForce.toFixed(2)}}{${params.mass.toFixed(1)}} = ${state.acceleration.toFixed(2)}\\text{ m/s}^2`}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
