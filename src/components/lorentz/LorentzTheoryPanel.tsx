/**
 * EQUATION 1 — Lorentz Force Physics Theory & Mathematical Foundations
 * Deep Class 11 & Class 12 pedagogical syllabus coverage:
 * - General Lorentz Force Law
 * - Right-Hand Palm / Fleming's Left-Hand Rule
 * - Work-Energy Theorem (Zero magnetic work)
 * - Circular and Helical Kinematics
 * - Crossed Fields & Velocity Selector
 * - Cyclotron Resonance
 */

import React from 'react';
import { BookOpen, Compass, Zap, Layers, Target, Atom } from 'lucide-react';

export const LorentzTheoryPanel: React.FC = () => {
  return (
    <div className="space-y-6 text-[#F1F5F9]">
      {/* Overview Banner */}
      <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-extrabold uppercase tracking-wide text-[#F1F5F9]">
            Electrodynamics &amp; Lorentz Force Theory (Class 11 &amp; 12 Syllabus)
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
            When a charged particle moves through space containing both electric and magnetic fields, it experiences a net electromagnetic force known as the <strong>Lorentz Force</strong>. This fundamental equation governs particle accelerators, mass spectrometers, cathode ray tubes, cosmic rays, and planetary magnetospheres.
          </p>
        </div>
      </div>

      {/* Core Equation Showcase */}
      <div className="bg-[#0B1728] rounded-xl border border-[#26364D] p-5 shadow-xl text-center space-y-3">
        <span className="text-[11px] font-mono uppercase text-[#38BDF8] tracking-widest font-bold">
          The Universal Lorentz Force Equation
        </span>
        <div className="text-2xl sm:text-3xl font-serif font-black text-[#FBBF24] tracking-wide py-2">
          F&#8407; = q ( E&#8407; + v&#8407; &times; B&#8407; )
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-[#94A3B8]">
          <span className="text-[#A78BFA]">F&#8407;_E = q E&#8407; (Electric Component)</span>
          <span className="text-[#26364D] font-bold">|</span>
          <span className="text-[#FB7185]">F&#8407;_B = q (v&#8407; &times; B&#8407;) (Magnetic Component)</span>
        </div>
      </div>

      {/* Two Column Grid of Core Theory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Electric vs Magnetic Force Comparison */}
        <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-2 border-b border-[#26364D] pb-2.5">
            <Zap className="w-4 h-4 text-[#A78BFA]" />
            <h3 className="text-sm font-bold text-[#F1F5F9]">
              1. Electric vs. Magnetic Forces
            </h3>
          </div>
          <div className="space-y-2.5 text-xs text-[#94A3B8] leading-relaxed">
            <p>
              <strong className="text-[#A78BFA]">Electric Force (F_E = qE):</strong>
              <br />
              &bull; Acts on a charge whether it is at rest or in motion.
              <br />
              &bull; Directed along the electric field lines (for +q) or opposite (for -q).
              <br />
              &bull; Can do work on the particle, altering both its speed and kinetic energy (W = &Delta;K).
            </p>
            <p>
              <strong className="text-[#FB7185]">Magnetic Force (F_B = q(v &times; B)):</strong>
              <br />
              &bull; Acts <em>only</em> on moving charges (v &ne; 0). If v = 0, F_B = 0.
              <br />
              &bull; Always perpendicular to both velocity v&#8407; and magnetic field B&#8407;.
              <br />
              &bull; Does <strong>zero mechanical work</strong> (W_magnetic = 0). It deflects the direction of motion without changing the particle&apos;s speed or kinetic energy.
            </p>
          </div>
        </div>

        {/* Card 2: Right-Hand Palm Rule */}
        <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-2 border-b border-[#26364D] pb-2.5">
            <Compass className="w-4 h-4 text-[#34D399]" />
            <h3 className="text-sm font-bold text-[#F1F5F9]">
              2. Determining Direction: Right-Hand Rule
            </h3>
          </div>
          <div className="space-y-2 text-xs text-[#94A3B8] leading-relaxed">
            <p>
              The magnetic force involves a vector cross product:
              <br />
              <code className="text-[#FB7185] font-mono font-bold block my-1">
                |F_B| = |q| &middot; v &middot; B &middot; sin(&theta;)
              </code>
              where &theta; is the angle between velocity vector v&#8407; and magnetic field B&#8407;.
            </p>
            <div className="bg-[#17263B] p-3 rounded-lg border border-[#26364D] space-y-1.5 font-mono text-[11px]">
              <div className="text-[#34D399] font-bold">Right-Hand Palm Rule for (+q):</div>
              <div>&bull; <strong>Thumb:</strong> Points in direction of velocity v&#8407;</div>
              <div>&bull; <strong>Fingers:</strong> Point in direction of magnetic field B&#8407;</div>
              <div>&bull; <strong>Palm (Push):</strong> Points in direction of magnetic force F&#8407;_B</div>
            </div>
            <p className="text-[11px] text-[#FB7185]">
              <strong>Rule for Negative Charge (-q):</strong> Reverses the direction by 180&deg;. If the right hand predicts upward force, an electron experiences a downward force!
            </p>
          </div>
        </div>

        {/* Card 3: Trajectory Regimes in Uniform B */}
        <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-2 border-b border-[#26364D] pb-2.5">
            <Layers className="w-4 h-4 text-[#38BDF8]" />
            <h3 className="text-sm font-bold text-[#F1F5F9]">
              3. Trajectories in Pure Magnetic Fields
            </h3>
          </div>
          <div className="space-y-2.5 text-xs text-[#94A3B8] leading-relaxed">
            <div>
              <strong className="text-[#38BDF8]">Case A: Velocity Parallel to Field (&theta; = 0&deg; or 180&deg;)</strong>
              <p>Since sin(0&deg;) = 0, F_B = 0. The particle continues in a straight line with constant velocity.</p>
            </div>
            <div>
              <strong className="text-[#38BDF8]">Case B: Velocity Perpendicular to Field (&theta; = 90&deg;)</strong>
              <p>
                The magnetic force is constant in magnitude and perpendicular to velocity at every instant, providing the exact centripetal force:
                <br />
                <code className="text-[#FBBF24] font-mono font-bold block my-1">
                  qvB = m v&sup2; / r &rArr; r = (m v) / (q B)
                </code>
              </p>
            </div>
            <div>
              <strong className="text-[#38BDF8]">Case C: Oblique Velocity (0&deg; &lt; &theta; &lt; 90&deg;)</strong>
              <p>
                Velocity decomposes into parallel component v_&parallel; = v cos(&theta;) and perpendicular component v_&perp; = v sin(&theta;). The perpendicular component drives circular motion, while the parallel component drifts unchanged, resulting in a <strong>helical spiral</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Card 4: Cyclotron Frequency Invariant & Pitch */}
        <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-2 border-b border-[#26364D] pb-2.5">
            <Atom className="w-4 h-4 text-[#FBBF24]" />
            <h3 className="text-sm font-bold text-[#F1F5F9]">
              4. Cyclotron Resonance &amp; Helical Pitch
            </h3>
          </div>
          <div className="space-y-2 text-xs text-[#94A3B8] leading-relaxed">
            <p>
              The time period T to complete one full revolution is:
              <br />
              <code className="text-[#34D399] font-mono font-bold block my-1">
                T = (2&pi; r) / v_&perp; = (2&pi; m) / (q B)
              </code>
            </p>
            <div className="bg-[#17263B] p-2.5 rounded border border-[#26364D] text-[11px] space-y-1">
              <div className="text-[#FBBF24] font-bold">Crucial NCERT/CBSE Theorem:</div>
              <p>
                Notice that both the period T and the cyclotron frequency f_c = (qB) / (2&pi;m) are <strong>independent of the particle&apos;s speed and radius</strong>! Fast particles travel in larger circles, slow particles travel in smaller circles, but both complete an orbit in the exact same time. This is the operating principle of the cyclotron particle accelerator.
              </p>
            </div>
            <p>
              <strong>Helical Pitch (p):</strong> The longitudinal distance traveled along the magnetic field per single rotation:
              <br />
              <code className="text-[#F1F5F9] font-mono font-bold block my-1">
                p = v_&parallel; &times; T = (2&pi; m v cos &theta;) / (q B)
              </code>
            </p>
          </div>
        </div>
      </div>

      {/* Crossed Fields & Velocity Selector Card */}
      <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-[#26364D] pb-2.5">
          <Target className="w-4 h-4 text-[#38BDF8]" />
          <h3 className="text-sm font-bold text-[#F1F5F9]">
            5. Crossed Fields &amp; The Velocity Selector (Wien Filter)
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#94A3B8]">
          <div className="space-y-1 md:col-span-2">
            <p className="leading-relaxed">
              When electric field E&#8407; and magnetic field B&#8407; are set mutually perpendicular to each other and to the particle&apos;s trajectory, the electric force F&#8407;_E = qE&#8407; and magnetic force F&#8407;_B = q(v&#8407;&times;B&#8407;) point in opposite directions.
            </p>
            <p className="leading-relaxed">
              For a specific speed, the two forces balance in magnitude:
            </p>
            <div className="bg-[#0B1728] p-3 rounded-lg border border-[#26364D] my-2 font-mono text-center text-sm font-bold text-[#38BDF8]">
              q E = q v B &emsp;&rArr;&emsp; v = E / B
            </div>
            <p className="leading-relaxed">
              Particles with this exact velocity pass straight through undeflected, regardless of their charge or mass. Particles with v &gt; E/B deflect toward the magnetic force; particles with v &lt; E/B deflect toward the electric force.
            </p>
          </div>

          <div className="bg-[#17263B] p-3.5 rounded-lg border border-[#26364D] flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-bold text-[#F1F5F9] uppercase tracking-wider mb-1">
                Mass Spectrometry Formula
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                After exiting the velocity selector with known speed v = E/B, ions enter a second magnetic field B&apos; where they curl into circular arcs:
              </p>
              <div className="text-xs font-mono font-bold text-[#FBBF24] my-2 text-center">
                m / q = (r &middot; B &middot; B&apos;) / E
              </div>
            </div>
            <div className="text-[10px] text-[#34D399] font-mono border-t border-[#26364D] pt-2">
              Used to discover isotopes and detect forensic mass spectra.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
