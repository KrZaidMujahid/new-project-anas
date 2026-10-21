/**
 * EQUATION 1 — Educational Explanation Panel (Section 8)
 * Expandable pedagogical guide tailored for Class 11 & Class 12 physics students:
 * Sections A through G covering theory, coherent sources, superposition, and applications.
 */

import React, { useState } from 'react';
import { BookOpen, Sparkles, ChevronDown, ChevronUp, Layers, CheckCircle, ShieldCheck } from 'lucide-react';
import { MathView } from '../MathView';

export const WaveEducationalPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[#101D30] border border-slate-800 rounded-xl p-4 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Educational Theory & Physics Foundations
            </h2>
            <p className="text-[11px] text-slate-400">
              Class 11 & Class 12 syllabus guide: Sections A through G
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 rounded-md transition-colors cursor-pointer"
        >
          <span>{isExpanded ? 'Collapse Theory' : 'Expand Full Theory'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed">
          {/* A. What is Wave Interference? */}
          <div className="p-3.5 rounded-lg bg-[#07111F] border border-slate-800/80 space-y-2">
            <h3 className="font-bold text-cyan-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              A. What is Wave Interference?
            </h3>
            <p className="text-slate-400 text-[11px]">
              Wave interference is the physical phenomenon that occurs when two or more waves propagate
              through the same medium and superpose simultaneously. Rather than colliding like solid particles,
              waves pass freely through one another, creating a stationary or evolving spatial distribution of
              reinforced intensity (crests meeting crests) and cancelled disturbance (crests meeting troughs).
            </p>
          </div>

          {/* B. Principle of Superposition */}
          <div className="p-3.5 rounded-lg bg-[#07111F] border border-slate-800/80 space-y-2">
            <h3 className="font-bold text-cyan-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              B. Principle of Superposition
            </h3>
            <p className="text-slate-400 text-[11px]">
              When two or more waves overlap at any spatial point at any time instant <MathView math="t" />, the resultant displacement <MathView math="y" /> is the exact algebraic sum of the individual displacements caused by each wave acting independently:
            </p>
            <div className="p-1.5 rounded bg-[#101D30] border border-slate-800 text-center font-mono my-1">
              <MathView math="y(r, t) = y_1(r_1, t) + y_2(r_2, t)" displayMode />
            </div>
            <p className="text-slate-400 text-[11px]">
              Linearity ensures that displacements with opposite signs cancel directly by subtraction.
            </p>
          </div>

          {/* C. Coherent Sources */}
          <div className="p-3.5 rounded-lg bg-[#07111F] border border-slate-800/80 space-y-2">
            <h3 className="font-bold text-purple-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              C. Coherent Sources
            </h3>
            <p className="text-slate-400 text-[11px]">
              Two wave sources are called <strong className="text-white">coherent</strong> if they maintain:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
              <li>Identical frequency (<MathView math="f_1 = f_2" />) and wavelength (<MathView math="\lambda_1 = \lambda_2" />)</li>
              <li>A strictly constant relative phase difference (<MathView math="\Delta\phi_0 = \text{constant}" />)</li>
            </ul>
            <p className="text-slate-400 text-[11px]">
              Without coherence, the phase difference fluctuates millions of times per second, averaging out all fringes into uniform intensity.
            </p>
          </div>

          {/* D. Constructive Interference */}
          <div className="p-3.5 rounded-lg bg-[#07111F] border border-emerald-500/20 space-y-2">
            <h3 className="font-bold text-emerald-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              D. Constructive Interference
            </h3>
            <p className="text-slate-400 text-[11px]">
              Occurs when the two waves arrive in phase (<MathView math="\Delta\phi = 2\pi n" />). The condition in terms of path difference is:
            </p>
            <div className="p-1.5 rounded bg-[#101D30] border border-slate-800 text-center font-mono my-1">
              <MathView math="\Delta r = |r_2 - r_1| = n\lambda \quad (n = 0, \pm 1, \pm 2, \dots)" displayMode />
            </div>
            <p className="text-slate-400 text-[11px]">
              For equal amplitudes <MathView math="A" />, resultant amplitude reaches its theoretical maximum of <MathView math="A_r = 2A" />, and intensity quadruples (<MathView math="I \propto (2A)^2 = 4A^2" />).
            </p>
          </div>

          {/* E. Destructive Interference */}
          <div className="p-3.5 rounded-lg bg-[#07111F] border border-rose-500/20 space-y-2">
            <h3 className="font-bold text-rose-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              E. Destructive Interference
            </h3>
            <p className="text-slate-400 text-[11px]">
              Occurs when the two waves arrive in exact anti-phase (<MathView math="\Delta\phi = (2n + 1)\pi" />). The path difference condition is:
            </p>
            <div className="p-1.5 rounded bg-[#101D30] border border-slate-800 text-center font-mono my-1">
              <MathView math="\Delta r = \left(n + \frac{1}{2}\right)\lambda \quad (n = 0, \pm 1, \dots)" displayMode />
            </div>
            <p className="text-slate-400 text-[11px]">
              Crests of Wave 1 coincide exactly with troughs of Wave 2, resulting in complete cancellation (<MathView math="A_r = |A_1 - A_2| = 0" />).
            </p>
          </div>

          {/* F. Real-World Applications */}
          <div className="p-3.5 rounded-lg bg-[#07111F] border border-slate-800/80 space-y-2">
            <h3 className="font-bold text-yellow-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              F. Real-World Applications
            </h3>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li>
                <strong className="text-slate-200">1. Young's Double-Slit Experiment:</strong> Historic proof of wave nature of light.
              </li>
              <li>
                <strong className="text-slate-200">2. Thin-Film Colors:</strong> Iridescent shimmer on soap bubbles and oil slicks via reflection interference.
              </li>
              <li>
                <strong className="text-slate-200">3. Anti-Reflection Lens Coatings:</strong> Destructive cancellation of reflected light on camera and eyeglass lenses (<MathView math="2t = \lambda / 2" />).
              </li>
              <li>
                <strong className="text-slate-200">4. Noise-Cancelling Headphones:</strong> Microphones pick up ambient sound and generate an exact 180° inverted acoustic wave to destroy noise.
              </li>
              <li>
                <strong className="text-slate-200">5. Laser Interferometers (LIGO):</strong> Detecting gravitational waves by measuring path shifts smaller than a proton diameter.
              </li>
            </ul>
          </div>

          {/* G. Important Observations for Students */}
          <div className="p-3.5 rounded-lg bg-[#07111F] border border-slate-800/80 space-y-2 md:col-span-2">
            <h3 className="font-bold text-cyan-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              G. Important Quantitative Observations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px]">
              <div className="p-2.5 rounded bg-[#101D30] border border-slate-800">
                <strong className="text-white block mb-1">Effect of Wavelength (λ):</strong>
                Fringe separation <MathView math="\beta \propto \lambda" />. Larger wavelengths spread fringes farther apart; shorter wavelengths compress them.
              </div>
              <div className="p-2.5 rounded bg-[#101D30] border border-slate-800">
                <strong className="text-white block mb-1">Effect of Separation (d):</strong>
                Fringe spacing <MathView math="\beta \propto 1/d" />. Increasing source distance packs more hyperbolic nodal orders into the visible field.
              </div>
              <div className="p-2.5 rounded bg-[#101D30] border border-slate-800">
                <strong className="text-white block mb-1">Effect of Initial Phase (Δφ₀):</strong>
                Shifts the entire interference pattern. Setting <MathView math="\Delta\phi_0 = 180^\circ" /> turns central maximum into a nodal minimum!
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-400">
          Click <strong className="text-cyan-300">"Expand Full Theory"</strong> to review the complete Class 11 & Class 12 syllabus guide on the principle of superposition, coherence conditions, nodal hyperbolas, anti-reflective coatings, and noise cancellation.
        </p>
      )}
    </div>
  );
};
