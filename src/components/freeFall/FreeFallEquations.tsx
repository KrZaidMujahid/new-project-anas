/**
 * EQUATION 1 — Free Fall Mathematical Equations Panel
 * LaTeX notation rendered with KaTeX, with algebraic and parameter-substituted views.
 */

import React, { useState } from 'react';
import {
  FreeFallAnalytical,
  FreeFallParameters,
} from '../../physics/freeFall/types';
import { MathView } from '../MathView';
import { Sigma, FunctionSquare, Variable } from 'lucide-react';

interface FreeFallEquationsProps {
  parameters: FreeFallParameters;
  analytical: FreeFallAnalytical;
}

export const FreeFallEquations: React.FC<FreeFallEquationsProps> = ({
  parameters,
  analytical,
}) => {
  const [tab, setTab] = useState<'algebraic' | 'substituted'>('algebraic');

  const { initialHeight, initialVelocity, gravity } = parameters;
  const isRest = initialVelocity === 0;

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
          {/* Vertical Kinematic Position Equation */}
          <div className="bg-[#07090e] border border-slate-800/80 rounded p-3 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span className="font-semibold text-slate-300">Height / Position y(t)</span>
              <span className="font-mono text-[10px] text-cyan-400">
                {isRest ? 'Special Case: Released from Rest (v₀ = 0)' : 'General Kinematics'}
              </span>
            </div>
            <div className="text-slate-100 overflow-x-auto py-1">
              {isRest ? (
                <MathView math="y(t) = y_0 - \frac{1}{2}gt^2" displayMode />
              ) : (
                <MathView math="y(t) = y_0 + v_0 t - \frac{1}{2}gt^2" displayMode />
              )}
            </div>
          </div>

          {/* Velocity Equation */}
          <div className="bg-[#07090e] border border-slate-800/80 rounded p-3 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span className="font-semibold text-slate-300">Velocity v(t) & Speed |v|</span>
              <span className="font-mono text-[10px] text-slate-500">Derivative dy/dt</span>
            </div>
            <div className="text-slate-100 overflow-x-auto py-1">
              {isRest ? (
                <MathView math="v(t) = -gt \quad \implies \quad |v(t)| = gt" displayMode />
              ) : (
                <MathView math="v(t) = v_0 - gt \quad \implies \quad |v(t)| = |v_0 - gt|" displayMode />
              )}
            </div>
          </div>

          {/* Time of Fall to Ground (y = 0) */}
          <div className="bg-[#07090e] border border-slate-800/80 rounded p-3 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span className="font-semibold text-slate-300">Time of Fall (T)</span>
              <span className="font-mono text-[10px] text-emerald-400">Root of y(T) = 0</span>
            </div>
            <div className="text-slate-100 overflow-x-auto py-1">
              {isRest ? (
                <MathView math="T = \sqrt{\frac{2y_0}{g}}" displayMode />
              ) : (
                <MathView math="T = \frac{v_0 + \sqrt{v_0^2 + 2gy_0}}{g}" displayMode />
              )}
            </div>
          </div>

          {/* Final Impact Velocity & Speed */}
          <div className="bg-[#07090e] border border-slate-800/80 rounded p-3 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span className="font-semibold text-slate-300">Ground Impact Speed</span>
              <span className="font-mono text-[10px] text-amber-400">Torricelli / Energy</span>
            </div>
            <div className="text-slate-100 overflow-x-auto py-1">
              {isRest ? (
                <MathView math="|v_{\text{final}}| = \sqrt{2gy_0} \quad (v_{\text{final}} = -\sqrt{2gy_0})" displayMode />
              ) : (
                <MathView math="|v_{\text{final}}| = \sqrt{v_0^2 + 2gy_0}" displayMode />
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Substituted Values Tab */
        <div className="space-y-3 text-xs">
          {/* Substituted Position */}
          <div className="bg-[#07090e] border border-slate-800/80 rounded p-3 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span className="font-semibold text-slate-300">Current Position Model</span>
              <span className="font-mono text-[10px] text-cyan-400">y(t) with parameters</span>
            </div>
            <div className="text-slate-100 overflow-x-auto py-1">
              {isRest ? (
                <MathView
                  math={`y(t) = ${initialHeight} - \\frac{1}{2}(${gravity})t^2 = ${initialHeight} - ${(gravity / 2).toFixed(2)}t^2`}
                  displayMode
                />
              ) : (
                <MathView
                  math={`y(t) = ${initialHeight} + (${initialVelocity})t - \\frac{1}{2}(${gravity})t^2`}
                  displayMode
                />
              )}
            </div>
          </div>

          {/* Substituted Velocity */}
          <div className="bg-[#07090e] border border-slate-800/80 rounded p-3 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span className="font-semibold text-slate-300">Current Velocity Model</span>
              <span className="font-mono text-[10px] text-slate-400">v(t) with parameters</span>
            </div>
            <div className="text-slate-100 overflow-x-auto py-1">
              {isRest ? (
                <MathView math={`v(t) = -(${gravity})t`} displayMode />
              ) : (
                <MathView math={`v(t) = ${initialVelocity} - (${gravity})t`} displayMode />
              )}
            </div>
          </div>

          {/* Substituted Time to Ground */}
          <div className="bg-[#07090e] border border-slate-800/80 rounded p-3 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span className="font-semibold text-slate-300">Time of Fall Calculation</span>
              <span className="font-mono text-[10px] text-emerald-400">
                = {isFinite(analytical.timeToGround) ? `${analytical.timeToGround.toFixed(2)} s` : '∞'}
              </span>
            </div>
            <div className="text-slate-100 overflow-x-auto py-1">
              {isRest ? (
                <MathView
                  math={`T = \\sqrt{\\frac{2(${initialHeight})}{${gravity}}} = ${analytical.timeToGround.toFixed(2)}\\text{ s}`}
                  displayMode
                />
              ) : (
                <MathView
                  math={`T = \\frac{${initialVelocity} + \\sqrt{(${initialVelocity})^2 + 2(${gravity})(${initialHeight})}}{${gravity}} = ${analytical.timeToGround.toFixed(2)}\\text{ s}`}
                  displayMode
                />
              )}
            </div>
          </div>

          {/* Substituted Final Impact Speed */}
          <div className="bg-[#07090e] border border-slate-800/80 rounded p-3 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span className="font-semibold text-slate-300">Impact Speed Calculation</span>
              <span className="font-mono text-[10px] text-amber-400">
                = {isFinite(analytical.finalSpeed) ? `${analytical.finalSpeed.toFixed(2)} m/s` : 'N/A'}
              </span>
            </div>
            <div className="text-slate-100 overflow-x-auto py-1">
              {isRest ? (
                <MathView
                  math={`|v_{\\text{final}}| = \\sqrt{2(${gravity})(${initialHeight})} = ${analytical.finalSpeed.toFixed(2)}\\text{ m/s}`}
                  displayMode
                />
              ) : (
                <MathView
                  math={`|v_{\\text{final}}| = \\sqrt{(${initialVelocity})^2 + 2(${gravity})(${initialHeight})} = ${analytical.finalSpeed.toFixed(2)}\\text{ m/s}`}
                  displayMode
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
