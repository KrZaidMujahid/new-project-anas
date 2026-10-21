/**
 * EQUATION 1 — Circular Motion Governing Physical Equations
 * Renders LaTeX formulas using KaTeX MathView component with clear physical explanations.
 */

import React, { useState } from 'react';
import { MathView } from '../MathView';
import { BookOpen, ChevronDown, ChevronRight, AlertCircle } from 'lucide-react';

export const CircularEquations: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string>('kinematics');

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

      {/* Critical Concept Callout Banner */}
      <div className="bg-amber-950/20 border border-amber-500/40 rounded-lg p-3 space-y-1">
        <div className="flex items-center gap-1.5 font-mono font-bold text-amber-300 text-[11px]">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Fundamental Physics Concept: Centripetal Force is a Net Force Requirement</span>
        </div>
        <p className="text-[11px] text-amber-200/90 leading-relaxed">
          <strong>Centripetal force is NOT a separate or new physical interaction.</strong> It is the <em>required net inward radial force</em> (<MathView math="\Sigma \vec{F}_{\text{radial}}" />) needed to continuously bend an object&apos;s velocity vector into a circular arc of radius <MathView math="r" />. Depending on the scenario, this required force is provided by string tension, gravity, electrostatic attraction, surface normal force, or friction.
        </p>
      </div>

      {/* Accordion Sections */}
      <div className="space-y-2">
        {/* Section 1: Position & Angular Kinematics */}
        <div className="border border-[#26364D] rounded-lg overflow-hidden bg-[#07111F]">
          <button
            onClick={() => toggleSection('kinematics')}
            className="w-full flex items-center justify-between p-2.5 hover:bg-[#101D30] transition-colors cursor-pointer text-left"
          >
            <span className="font-semibold text-cyan-300 font-mono">
              1. Angular Position & Parametric Coordinates
            </span>
            {expandedSection === 'kinematics' ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {expandedSection === 'kinematics' && (
            <div className="p-3 pt-1 border-t border-[#1E293B] space-y-2.5 text-slate-300">
              <p className="text-[11px] leading-relaxed">
                In uniform circular motion with constant angular velocity <MathView math="\omega" />, the angular displacement increases linearly with time:
              </p>
              <div className="bg-[#101D30] p-2 rounded text-center overflow-x-auto">
                <MathView math="\theta(t) = \theta_0 + \omega t" displayMode />
              </div>
              <p className="text-[11px] leading-relaxed">
                Projected onto 2D Cartesian coordinates centered at <MathView math="(x_c, y_c)" />:
              </p>
              <div className="bg-[#101D30] p-2 rounded text-center overflow-x-auto space-y-1">
                <MathView math="x(t) = x_c + r \cos(\theta) = x_c + r \cos(\theta_0 + \omega t)" displayMode />
                <MathView math="y(t) = y_c + r \sin(\theta) = y_c + r \sin(\theta_0 + \omega t)" displayMode />
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Linear Velocity & Tangential Direction */}
        <div className="border border-[#26364D] rounded-lg overflow-hidden bg-[#07111F]">
          <button
            onClick={() => toggleSection('velocity')}
            className="w-full flex items-center justify-between p-2.5 hover:bg-[#101D30] transition-colors cursor-pointer text-left"
          >
            <span className="font-semibold text-emerald-300 font-mono">
              2. Linear Speed & Tangential Velocity Vector
            </span>
            {expandedSection === 'velocity' ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {expandedSection === 'velocity' && (
            <div className="p-3 pt-1 border-t border-[#1E293B] space-y-2.5 text-slate-300">
              <p className="text-[11px] leading-relaxed">
                The linear tangential speed is the product of radius and angular velocity:
              </p>
              <div className="bg-[#101D30] p-2 rounded text-center overflow-x-auto">
                <MathView math="v = r |\omega|" displayMode />
              </div>
              <p className="text-[11px] leading-relaxed">
                Differentiating the position vector with respect to time yields the velocity vector components:
              </p>
              <div className="bg-[#101D30] p-2 rounded text-center overflow-x-auto space-y-1">
                <MathView math="v_x(t) = \frac{dx}{dt} = -r \omega \sin(\theta)" displayMode />
                <MathView math="v_y(t) = \frac{dy}{dt} = r \omega \cos(\theta)" displayMode />
              </div>
              <p className="text-[10px] text-slate-400">
                Notice that the dot product <MathView math="\vec{r} \cdot \vec{v} = x v_x + y v_y = -r^2\omega\sin\theta\cos\theta + r^2\omega\sin\theta\cos\theta = 0" />, confirming that velocity is always strictly perpendicular to the position radius vector.
              </p>
            </div>
          )}
        </div>

        {/* Section 3: Centripetal Acceleration & Force */}
        <div className="border border-[#26364D] rounded-lg overflow-hidden bg-[#07111F]">
          <button
            onClick={() => toggleSection('centripetal')}
            className="w-full flex items-center justify-between p-2.5 hover:bg-[#101D30] transition-colors cursor-pointer text-left"
          >
            <span className="font-semibold text-amber-300 font-mono">
              3. Centripetal Acceleration & Centripetal Force
            </span>
            {expandedSection === 'centripetal' ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {expandedSection === 'centripetal' && (
            <div className="p-3 pt-1 border-t border-[#1E293B] space-y-2.5 text-slate-300">
              <p className="text-[11px] leading-relaxed">
                Because velocity constantly changes direction, the object undergoes centripetal acceleration directed radially inward toward the rotation center:
              </p>
              <div className="bg-[#101D30] p-2 rounded text-center overflow-x-auto">
                <MathView math="a_c = \frac{v^2}{r} = r \omega^2" displayMode />
              </div>
              <div className="bg-[#101D30] p-2 rounded text-center overflow-x-auto space-y-1">
                <MathView math="a_x(t) = -r \omega^2 \cos(\theta) = -a_c \cos(\theta)" displayMode />
                <MathView math="a_y(t) = -r \omega^2 \sin(\theta) = -a_c \sin(\theta)" displayMode />
              </div>
              <p className="text-[11px] leading-relaxed">
                Applying Newton&apos;s Second Law (<MathView math="\vec{F}_{\text{net}} = m \vec{a}" />), the required net centripetal force is:
              </p>
              <div className="bg-[#101D30] p-2 rounded text-center overflow-x-auto">
                <MathView math="F_c = m a_c = \frac{m v^2}{r} = m r \omega^2" displayMode />
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Period, Frequency & Energy */}
        <div className="border border-[#26364D] rounded-lg overflow-hidden bg-[#07111F]">
          <button
            onClick={() => toggleSection('period')}
            className="w-full flex items-center justify-between p-2.5 hover:bg-[#101D30] transition-colors cursor-pointer text-left"
          >
            <span className="font-semibold text-purple-300 font-mono">
              4. Orbital Period, Frequency & Invariant Kinetic Energy
            </span>
            {expandedSection === 'period' ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {expandedSection === 'period' && (
            <div className="p-3 pt-1 border-t border-[#1E293B] space-y-2.5 text-slate-300">
              <p className="text-[11px] leading-relaxed">
                The time to complete one full revolution of <MathView math="2\pi" /> radians is the period <MathView math="T" />, and the frequency <MathView math="f" /> is its reciprocal:
              </p>
              <div className="bg-[#101D30] p-2 rounded text-center overflow-x-auto space-y-1">
                <MathView math="T = \frac{2\pi}{|\omega|} \quad \Longleftrightarrow \quad f = \frac{1}{T} = \frac{|\omega|}{2\pi} \quad \Longleftrightarrow \quad \omega = 2\pi f" displayMode />
              </div>
              <p className="text-[11px] leading-relaxed">
                Because the speed <MathView math="v = r|\omega|" /> is constant in uniform circular motion, kinetic energy is time-invariant:
              </p>
              <div className="bg-[#101D30] p-2 rounded text-center overflow-x-auto">
                <MathView math="K = \frac{1}{2} m v^2 = \frac{1}{2} m r^2 \omega^2 = \text{constant}" displayMode />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
