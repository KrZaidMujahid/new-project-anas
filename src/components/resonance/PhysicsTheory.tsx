/**
 * EQUATION 1 — Resonance Educational Theory Guide (Section 13)
 * Comprehensive syllabus notes tailored for Class 11 & Class 12 students:
 * Sections A through I covering theoretical mechanics, damping, phase transitions, and engineering applications.
 */

import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import { MathView } from '../MathView';

export const PhysicsTheory: React.FC = () => {
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
              Physics Behind Resonance (Theory & Syllabus Guide)
            </h2>
            <p className="text-[11px] text-slate-400">
              Class 11 & Class 12 physics foundations: Sections A through I
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
          {/* A. What is Resonance? */}
          <div className="p-3.5 rounded-lg bg-[#07111F] border border-slate-800/80 space-y-2">
            <h3 className="font-bold text-cyan-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              A. What is Resonance?
            </h3>
            <p className="text-slate-400 text-[11px]">
              Resonance is a fundamental physical phenomenon that occurs when an oscillating system is driven by an external periodic force whose frequency matches or is very close to the system's natural frequency (<MathView math="f_d \approx f_0" />).
            </p>
            <p className="text-slate-400 text-[11px]">
              Under this condition, energy is transferred continuously into the oscillator in phase with its motion, allowing the steady-state amplitude to grow dramatically compared to off-resonance excitation.
            </p>
          </div>

          {/* B. Natural Frequency */}
          <div className="p-3.5 rounded-lg bg-[#07111F] border border-slate-800/80 space-y-2">
            <h3 className="font-bold text-cyan-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              B. Natural Frequency
            </h3>
            <p className="text-slate-400 text-[11px]">
              The natural frequency <MathView math="f_0 = \frac{1}{2\pi}\sqrt{k/m}" /> is the intrinsic rate at which a system oscillates freely on its own after being disturbed and released, without any continuing external force or damping.
            </p>
            <p className="text-slate-400 text-[11px]">
              It depends strictly on physical properties: increasing mass increases inertia and lowers <MathView math="f_0" />, while increasing spring stiffness increases restoring force and raises <MathView math="f_0" />.
            </p>
          </div>

          {/* C. Forced Oscillations */}
          <div className="p-3.5 rounded-lg bg-[#07111F] border border-amber-500/20 space-y-2">
            <h3 className="font-bold text-amber-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              C. Forced Oscillations
            </h3>
            <p className="text-slate-400 text-[11px]">
              When an external periodic force <MathView math="F(t) = F_0\sin(\omega_d t)" /> acts on an oscillator, the motion initially exhibits a complex combination of natural free decay (the <strong className="text-white">transient response</strong>) and forced oscillation.
            </p>
            <p className="text-slate-400 text-[11px]">
              After the transient decays due to friction, the oscillator settles into a stable <strong className="text-white">steady-state response</strong> oscillating strictly at the driving frequency <MathView math="\omega_d" />.
            </p>
          </div>

          {/* D. Damping */}
          <div className="p-3.5 rounded-lg bg-[#07111F] border border-purple-500/20 space-y-2">
            <h3 className="font-bold text-purple-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              D. Role of Damping
            </h3>
            <p className="text-slate-400 text-[11px]">
              Damping represents dissipative resistive forces (air drag, viscous friction, internal material hysteresis) that oppose velocity with magnitude <MathView math="F_{\text{damping}} = -c v" />.
            </p>
            <p className="text-slate-400 text-[11px]">
              Damping transforms mechanical energy into heat (<MathView math="P = c v^2" />). Without damping, the steady-state amplitude at exact resonance would mathematically approach infinity. Real damping keeps the resonant response finite.
            </p>
          </div>

          {/* E. Resonance Curve */}
          <div className="p-3.5 rounded-lg bg-[#07111F] border border-slate-800/80 space-y-2">
            <h3 className="font-bold text-cyan-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              E. Resonance Curve & Peak Width
            </h3>
            <p className="text-slate-400 text-[11px]">
              The graph of steady-state amplitude <MathView math="A(\omega)" /> versus driving frequency <MathView math="\omega_d" /> is called the <strong className="text-white">resonance curve</strong>.
            </p>
            <p className="text-slate-400 text-[11px]">
              At low damping, the curve has a sharp, tall peak with narrow bandwidth. As damping increases, the peak broadens, drops in height, and shifts slightly to a lower frequency: <MathView math="\omega_{\text{peak}} = \sqrt{\omega_0^2 - c^2/2m^2}" />.
            </p>
          </div>

          {/* F. Phase Difference */}
          <div className="p-3.5 rounded-lg bg-[#07111F] border border-slate-800/80 space-y-2">
            <h3 className="font-bold text-cyan-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              F. Phase Lag Transition
            </h3>
            <p className="text-slate-400 text-[11px]">
              Displacement lags behind the driving force by phase angle <MathView math="\phi = \text{atan2}(c\omega, k - m\omega^2)" />:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
              <li><strong className="text-white">Low frequency (ω ≪ ω₀):</strong> <MathView math="\phi \approx 0^\circ" /> (mass moves in phase with force).</li>
              <li><strong className="text-white">Resonance (ω = ω₀):</strong> <MathView math="\phi = 90^\circ" /> (<MathView math="\pi/2" /> rad). Velocity is in phase with force, optimizing mechanical work transfer!</li>
              <li><strong className="text-white">High frequency (ω ≫ ω₀):</strong> <MathView math="\phi \approx 180^\circ" /> (inertia dominates, mass opposes force).</li>
            </ul>
          </div>

          {/* G. Quality Factor Q */}
          <div className="p-3.5 rounded-lg bg-[#07111F] border border-emerald-500/20 space-y-2">
            <h3 className="font-bold text-emerald-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              G. Quality Factor (Q)
            </h3>
            <p className="text-slate-400 text-[11px]">
              The Quality factor <MathView math="Q = m\omega_0 / c" /> measures how "sharp" or underdamped an oscillator is:
            </p>
            <div className="p-1.5 rounded bg-[#101D30] border border-slate-800 text-center font-mono my-1">
              <MathView math="Q = 2\pi \frac{\text{Energy Stored}}{\text{Energy Dissipated per Cycle}}" displayMode />
            </div>
            <p className="text-slate-400 text-[11px]">
              High <MathView math="Q" /> systems (like quartz crystals or acoustic bells, <MathView math="Q > 10^4" />) ring for a long time and respond only to an extremely narrow frequency band. Low <MathView math="Q" /> systems decay quickly.
            </p>
          </div>

          {/* H. Technological Applications */}
          <div className="p-3.5 rounded-lg bg-[#07111F] border border-slate-800/80 space-y-2">
            <h3 className="font-bold text-yellow-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              H. Scientific & Engineering Applications
            </h3>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li><strong className="text-slate-200">1. Radio & Wi-Fi Tuning:</strong> RLC circuits resonate at specific radio carrier frequencies to select one station while rejecting millions of others.</li>
              <li><strong className="text-slate-200">2. Quartz Crystal Clocks:</strong> Piezoelectric quartz crystals oscillate at precisely 32,768 Hz to keep accurate time.</li>
              <li><strong className="text-slate-200">3. Magnetic Resonance Imaging (MRI):</strong> Radiofrequency pulses resonate with nuclear magnetic spins in hydrogen atoms to produce 3D medical scans.</li>
              <li><strong className="text-slate-200">4. Acoustic Resonators:</strong> Violins and guitars amplify faint string vibrations via resonance of their hollow wooden soundboxes.</li>
            </ul>
          </div>

          {/* I. Structural Hazards & Engineering Damping */}
          <div className="p-3.5 rounded-lg bg-[#07111F] border border-rose-500/20 space-y-2 md:col-span-2">
            <h3 className="font-bold text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              I. Structural Hazards & Vibration Management
            </h3>
            <p className="text-slate-400 text-[11px]">
              Uncontrolled resonant vibration can tear mechanical structures apart (e.g. historical aeroelastic flutter of the Tacoma Narrows Bridge in 1940, or excessive sway in skyscrapers caused by earthquake ground waves).
            </p>
            <p className="text-slate-400 text-[11px]">
              Engineers manage resonance through three primary strategies:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px]">
              <div className="p-2.5 rounded bg-[#101D30] border border-slate-800">
                <strong className="text-white block mb-0.5">1. Detuning:</strong>
                Designing natural frequencies well away from known operational excitation frequencies (engine RPM, vortex shedding).
              </div>
              <div className="p-2.5 rounded bg-[#101D30] border border-slate-800">
                <strong className="text-white block mb-0.5">2. Added Damping:</strong>
                Incorporating hydraulic dampers, elastomeric pads, and viscous shock absorbers to broaden and flatten the resonance peak.
              </div>
              <div className="p-2.5 rounded bg-[#101D30] border border-slate-800">
                <strong className="text-white block mb-0.5">3. Tuned Mass Dampers:</strong>
                Suspending a secondary counter-oscillating pendulum mass (like the 660-tonne pendulum inside Taipei 101) to absorb sway energy.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-400">
          Click <strong className="text-cyan-300">"Expand Full Theory"</strong> to read the complete Class 11 & Class 12 physics notes on forced vibrations, transient decay, phase transitions, Quality factor, and structural resonance management.
        </p>
      )}
    </div>
  );
};
