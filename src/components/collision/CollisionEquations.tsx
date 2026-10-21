/**
 * EQUATION 1 — Collision & Momentum Governing Mathematical Equations
 * Renders LaTeX formulas using KaTeX MathView component with clear physical explanations.
 */

import React, { useState } from 'react';
import { MathView } from '../MathView';
import { BookOpen, ChevronDown, ChevronRight, Binary } from 'lucide-react';
import { CollisionType } from '../../physics/collision/types';

interface CollisionEquationsProps {
  collisionType: CollisionType;
  restitution: number;
}

export const CollisionEquations: React.FC<CollisionEquationsProps> = ({
  collisionType,
  restitution,
}) => {
  const [expandedSection, setExpandedSection] = useState<string>('momentum');

  const toggleSection = (id: string) => {
    setExpandedSection((prev) => (prev === id ? '' : id));
  };

  return (
    <div className="bg-[#0B1728] border border-[#26364D] rounded-xl p-4 select-none space-y-3 shadow-lg text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#26364D]">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#F1F5F9]">
            Governing Physical Equations
          </h2>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          KaTeX Formulations
        </span>
      </div>

      {/* Accordion Sections */}
      <div className="space-y-2">
        {/* Section 1: Momentum & Conservation */}
        <div className="border border-[#26364D] rounded-lg overflow-hidden bg-[#07111F]">
          <button
            onClick={() => toggleSection('momentum')}
            className="w-full flex items-center justify-between p-2.5 hover:bg-[#101D30] transition-colors cursor-pointer text-left"
          >
            <span className="font-semibold text-cyan-300 font-mono">
              1. Linear Momentum & Conservation Law
            </span>
            {expandedSection === 'momentum' ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {expandedSection === 'momentum' && (
            <div className="p-3 pt-1 border-t border-[#1E293B] space-y-2.5 text-slate-300">
              <p className="text-[11px] leading-relaxed">
                Linear momentum <MathView math="p" /> is the product of mass and velocity. In an isolated 1D system with zero external net horizontal forces, total linear momentum is strictly invariant:
              </p>
              <div className="bg-[#101D30] p-2 rounded text-center overflow-x-auto">
                <MathView math="p = m v \quad \Longrightarrow \quad P_{\text{total}} = m_1 v_1 + m_2 v_2" displayMode />
              </div>
              <div className="bg-[#101D30] p-2 rounded text-center overflow-x-auto">
                <MathView math="P_{\text{before}} = P_{\text{after}} \quad \Longleftrightarrow \quad m_1 v_1 + m_2 v_2 = m_1 v_1' + m_2 v_2'" displayMode />
              </div>
              <p className="text-[10px] text-slate-400">
                Vector signs: Positive velocity indicates rightward motion (<MathView math="+x" />), negative indicates leftward motion (<MathView math="-x" />).
              </p>
            </div>
          )}
        </div>

        {/* Section 2: Restitution & Collision Modes */}
        <div className="border border-[#26364D] rounded-lg overflow-hidden bg-[#07111F]">
          <button
            onClick={() => toggleSection('restitution')}
            className="w-full flex items-center justify-between p-2.5 hover:bg-[#101D30] transition-colors cursor-pointer text-left"
          >
            <span className="font-semibold text-purple-300 font-mono">
              2. Coefficient of Restitution & Final Velocities
            </span>
            {expandedSection === 'restitution' ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {expandedSection === 'restitution' && (
            <div className="p-3 pt-1 border-t border-[#1E293B] space-y-2.5 text-slate-300">
              <p className="text-[11px] leading-relaxed">
                The coefficient of restitution <MathView math="e" /> is the ratio of relative separation speed to relative approach speed:
              </p>
              <div className="bg-[#101D30] p-2 rounded text-center overflow-x-auto">
                <MathView math="e = \frac{|v_2' - v_1'|}{|v_1 - v_2|} = -\frac{v_2' - v_1'}{v_2 - v_1} \in [0, 1]" displayMode />
              </div>

              {collisionType === 'elastic' && (
                <div className="space-y-1.5">
                  <span className="text-cyan-400 font-bold block text-[11px]">
                    Elastic Collision (e = 1.0):
                  </span>
                  <div className="bg-[#101D30] p-2 rounded text-center overflow-x-auto space-y-1">
                    <MathView math="v_1' = \left(\frac{m_1 - m_2}{m_1 + m_2}\right) v_1 + \left(\frac{2 m_2}{m_1 + m_2}\right) v_2" displayMode />
                    <MathView math="v_2' = \left(\frac{2 m_1}{m_1 + m_2}\right) v_1 + \left(\frac{m_2 - m_1}{m_1 + m_2}\right) v_2" displayMode />
                  </div>
                </div>
              )}

              {collisionType === 'perfectly-inelastic' && (
                <div className="space-y-1.5">
                  <span className="text-amber-400 font-bold block text-[11px]">
                    Perfectly Inelastic Collision (e = 0.0 — Coalescence):
                  </span>
                  <div className="bg-[#101D30] p-2 rounded text-center overflow-x-auto">
                    <MathView math="v_1' = v_2' = v_{\text{final}} = \frac{m_1 v_1 + m_2 v_2}{m_1 + m_2}" displayMode />
                  </div>
                </div>
              )}

              {collisionType === 'inelastic' && (
                <div className="space-y-1.5">
                  <span className="text-purple-400 font-bold block text-[11px]">
                    General Inelastic Collision (0 &lt; e &lt; 1):
                  </span>
                  <div className="bg-[#101D30] p-2 rounded text-center overflow-x-auto space-y-1">
                    <MathView math="v_1' = \frac{(m_1 - e m_2) v_1 + m_2 (1 + e) v_2}{m_1 + m_2}" displayMode />
                    <MathView math="v_2' = \frac{m_1 (1 + e) v_1 + (m_2 - e m_1) v_2}{m_1 + m_2}" displayMode />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section 3: Impulse & Collision Force */}
        <div className="border border-[#26364D] rounded-lg overflow-hidden bg-[#07111F]">
          <button
            onClick={() => toggleSection('impulse')}
            className="w-full flex items-center justify-between p-2.5 hover:bg-[#101D30] transition-colors cursor-pointer text-left"
          >
            <span className="font-semibold text-rose-300 font-mono">
              3. Impulse & Average Collision Force
            </span>
            {expandedSection === 'impulse' ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {expandedSection === 'impulse' && (
            <div className="p-3 pt-1 border-t border-[#1E293B] space-y-2.5 text-slate-300">
              <p className="text-[11px] leading-relaxed">
                By Newton&apos;s Second and Third Laws, impulse <MathView math="J" /> equals the time integral of the collision contact force and produces the exact momentum change <MathView math="\Delta p" />:
              </p>
              <div className="bg-[#101D30] p-2 rounded text-center overflow-x-auto">
                <MathView math="J = \int_{t_{\text{col}}}^{t_{\text{col}} + \Delta t} F(t) \, dt = \Delta p = m (v' - v)" displayMode />
              </div>
              <div className="bg-[#101D30] p-2 rounded text-center overflow-x-auto">
                <MathView math="F_{\text{avg}} = \frac{|\Delta p|}{\Delta t_{\text{col}}} \quad \text{and} \quad J_1 = -J_2" displayMode />
              </div>
              <p className="text-[10px] text-slate-400">
                Notice: Momentum is the state quantity (<MathView math="kg\cdot m/s" />), impulse is the transferred quantity (<MathView math="N\cdot s" />), and force is the rate of momentum transfer (<MathView math="N" />).
              </p>
            </div>
          )}
        </div>

        {/* Section 4: Kinetic Energy & Dissipation */}
        <div className="border border-[#26364D] rounded-lg overflow-hidden bg-[#07111F]">
          <button
            onClick={() => toggleSection('energy')}
            className="w-full flex items-center justify-between p-2.5 hover:bg-[#101D30] transition-colors cursor-pointer text-left"
          >
            <span className="font-semibold text-emerald-300 font-mono">
              4. Kinetic Energy & Dissipation
            </span>
            {expandedSection === 'energy' ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {expandedSection === 'energy' && (
            <div className="p-3 pt-1 border-t border-[#1E293B] space-y-2.5 text-slate-300">
              <div className="bg-[#101D30] p-2 rounded text-center overflow-x-auto">
                <MathView math="K = \frac{1}{2} m v^2 \quad \Longrightarrow \quad K_{\text{total}} = \frac{1}{2} m_1 v_1^2 + \frac{1}{2} m_2 v_2^2" displayMode />
              </div>
              <p className="text-[11px] leading-relaxed">
                For an inelastic collision with coefficient <MathView math="e" />, the kinetic energy dissipated is:
              </p>
              <div className="bg-[#101D30] p-2 rounded text-center overflow-x-auto">
                <MathView math="\Delta K_{\text{lost}} = K_{\text{before}} - K_{\text{after}} = \frac{1}{2} \left(\frac{m_1 m_2}{m_1 + m_2}\right) (1 - e^2) (v_1 - v_2)^2" displayMode />
              </div>
              <p className="text-[10px] text-slate-400">
                When <MathView math="e = 1" />, <MathView math="\Delta K_{\text{lost}} = 0" /> (ideal elasticity). When <MathView math="e = 0" />, energy loss is maximized.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
