/**
 * EQUATION 1 — Educational Theory Panel: Physics Behind RLC Circuits
 * Comprehensive Class 11/12 & introductory electronics theory covering:
 * - Fundamental R, L, C definitions & AC vs DC dynamics
 * - Inductive and capacitive reactance derivations
 * - Complex impedance and phase relationships
 * - Electrical resonance (series acceptor vs parallel rejector)
 * - Quality factor Q and bandwidth Δf
 * - Energy exchange between L and C
 * - Damping regimes in transient circuits
 */

import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Zap, Layers, Compass, Activity, Clock } from 'lucide-react';

export const CircuitsTheoryPanel: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>('basics');

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4 text-[#F1F5F9]">
      {/* Overview Banner */}
      <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-extrabold uppercase tracking-wide text-[#F1F5F9]">
            Physics Behind RLC Circuits (Class 11 &amp; 12 Syllabus)
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
            Alternating Current (AC) circuits containing resistors, inductors, and capacitors form the bedrock of radio receivers, audio filters, power distribution grids, and wireless transmitters. Explore the mathematical laws and physical intuition governing impedance, phase difference, and resonance below.
          </p>
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="space-y-3">
        {/* Section 1: R, L, C & AC vs DC */}
        <div className="bg-[#101D30] rounded-xl border border-[#26364D] overflow-hidden shadow-lg">
          <button
            onClick={() => toggleSection('basics')}
            className="w-full p-4 text-left flex items-center justify-between hover:bg-[#17263B] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-[#FBBF24]" />
              <span className="text-xs sm:text-sm font-bold text-[#F1F5F9]">
                1. What R, L, and C Represent (AC vs. DC Circuits)
              </span>
            </div>
            {openSection === 'basics' ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
          </button>

          {openSection === 'basics' && (
            <div className="p-4 pt-0 border-t border-[#26364D] text-xs text-[#94A3B8] space-y-3 leading-relaxed">
              <p>
                In a <strong>Direct Current (DC)</strong> circuit, current flows steadily in one unchanging direction with constant voltage. In an <strong>Alternating Current (AC)</strong> circuit, the source voltage alternates sinusoidally:
              </p>
              <div className="bg-[#0B1728] p-2.5 rounded font-mono text-center text-[#FBBF24]">
                v(t) = V_peak &middot; sin(&omega;t) &emsp; where &omega; = 2&pi;f
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="bg-[#17263B] p-3 rounded-lg border border-[#26364D]">
                  <strong className="text-[#F97316] block mb-1">Resistor (R)</strong>
                  Opposes electrical current equally at all frequencies via atomic collisions. Dissipates energy permanently as heat (P = I&sup2;R). Current and voltage are always in phase.
                </div>
                <div className="bg-[#17263B] p-3 rounded-lg border border-[#26364D]">
                  <strong className="text-[#38BDF8] block mb-1">Inductor (L)</strong>
                  A coiled conductor that generates an opposing back-EMF whenever current changes (v_L = L di/dt). Stores energy in a magnetic field (E = &frac12;LI&sup2;). Blocks high frequencies.
                </div>
                <div className="bg-[#17263B] p-3 rounded-lg border border-[#26364D]">
                  <strong className="text-[#A78BFA] block mb-1">Capacitor (C)</strong>
                  Two conducting plates separated by an insulator that store charge Q = CV. Opposes changes in voltage (i_C = C dv/dt). Blocks steady DC, but allows AC to pass easily.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Reactances and Impedance */}
        <div className="bg-[#101D30] rounded-xl border border-[#26364D] overflow-hidden shadow-lg">
          <button
            onClick={() => toggleSection('reactance')}
            className="w-full p-4 text-left flex items-center justify-between hover:bg-[#17263B] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Compass className="w-4 h-4 text-[#38BDF8]" />
              <span className="text-xs sm:text-sm font-bold text-[#F1F5F9]">
                2. Why Reactance Depends on Frequency &amp; What Impedance (Z) Means
              </span>
            </div>
            {openSection === 'reactance' ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
          </button>

          {openSection === 'reactance' && (
            <div className="p-4 pt-0 border-t border-[#26364D] text-xs text-[#94A3B8] space-y-3 leading-relaxed">
              <div>
                <strong className="text-[#38BDF8]">Inductive Reactance (X_L = 2&pi;fL = &omega;L):</strong>
                <p className="mt-0.5">
                  Because back-EMF depends on the rate of current change (di/dt), higher AC frequencies cause more rapid current reversals, inducing stronger opposing voltage. Hence, inductive opposition increases linearly with frequency.
                </p>
              </div>

              <div>
                <strong className="text-[#A78BFA]">Capacitive Reactance (X_C = 1 / (2&pi;fC) = 1 / (&omega;C)):</strong>
                <p className="mt-0.5">
                  At low frequencies, plates have ample time to charge up to supply voltage, completely opposing further current flow (X_C &rarr; &infin; at DC). At high frequencies, polarity alternates before charges accumulate, allowing current to pass with little opposition (X_C &rarr; 0).
                </p>
              </div>

              <div className="bg-[#17263B] p-3 rounded-lg border border-[#26364D]">
                <strong className="text-[#F1F5F9]">Total Impedance Z:</strong>
                <p className="mt-1">
                  Because inductor voltage leads current by +90&deg; and capacitor voltage lags by -90&deg;, their reactances point in opposite directions along the imaginary phasor axis. In series:
                </p>
                <div className="font-mono text-center text-[#38BDF8] my-2 text-sm font-bold">
                  Z = &radic;( R&sup2; + (X_L - X_C)&sup2; )
                </div>
                <p>
                  Impedance is the total opposition to alternating current, combining resistive friction R and reactive inertia (X_L - X_C).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Electrical Resonance & Voltage Magnification */}
        <div className="bg-[#101D30] rounded-xl border border-[#26364D] overflow-hidden shadow-lg">
          <button
            onClick={() => toggleSection('resonance')}
            className="w-full p-4 text-left flex items-center justify-between hover:bg-[#17263B] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4 text-[#FB7185]" />
              <span className="text-xs sm:text-sm font-bold text-[#F1F5F9]">
                3. Electrical Resonance, Quality Factor (Q), &amp; Bandwidth (&Delta;f)
              </span>
            </div>
            {openSection === 'resonance' ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
          </button>

          {openSection === 'resonance' && (
            <div className="p-4 pt-0 border-t border-[#26364D] text-xs text-[#94A3B8] space-y-3 leading-relaxed">
              <p>
                <strong>Electrical Resonance</strong> occurs when inductive reactance exactly cancels capacitive reactance:
              </p>
              <div className="bg-[#0B1728] p-3 rounded font-mono text-center text-[#FB7185] text-sm font-bold">
                X_L = X_C &emsp;&rArr;&emsp; 2&pi;f_0 L = 1 / (2&pi;f_0 C) &emsp;&rArr;&emsp; f_0 = 1 / (2&pi;&radic;(LC))
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="bg-[#17263B] p-3 rounded-lg border border-[#26364D]">
                  <strong className="text-[#38BDF8] block mb-1">Series Resonance (Acceptor)</strong>
                  Net reactance drops to zero, impedance drops to its minimum Z = R, and current reaches its maximum peak I = V/R. Voltages across L and C can be Q times larger than the supply voltage (V_L = V_C = Q &middot; V_source)!
                </div>
                <div className="bg-[#17263B] p-3 rounded-lg border border-[#26364D]">
                  <strong className="text-[#FBBF24] block mb-1">Parallel Resonance (Rejector)</strong>
                  Inductive and capacitive branch currents are equal in magnitude and 180&deg; out of phase. They circulate between L and C without drawing net reactive current from the source, minimizing source current to I_source = V/R.
                </div>
              </div>

              <div className="bg-[#17263B] p-3 rounded-lg border border-[#26364D] space-y-1">
                <div className="text-[#F1F5F9] font-bold">Quality Factor (Q) &amp; Sharpness:</div>
                <p>
                  Q = (1/R) &radic;(L/C) measures the sharpness of the resonance curve. A high-Q circuit possesses very sharp frequency selectivity (narrow bandwidth &Delta;f = f_0 / Q), making it ideal for radio antenna tuning to select one station while rejecting neighboring frequencies.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Section 4: DC Transient Response & Damping */}
        <div className="bg-[#101D30] rounded-xl border border-[#26364D] overflow-hidden shadow-lg">
          <button
            onClick={() => toggleSection('transients')}
            className="w-full p-4 text-left flex items-center justify-between hover:bg-[#17263B] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-[#34D399]" />
              <span className="text-xs sm:text-sm font-bold text-[#F1F5F9]">
                4. DC Transients, Time Constants (&tau;), &amp; Damping Regimes
              </span>
            </div>
            {openSection === 'transients' ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
          </button>

          {openSection === 'transients' && (
            <div className="p-4 pt-0 border-t border-[#26364D] text-xs text-[#94A3B8] space-y-3 leading-relaxed">
              <p>
                When a DC switch is closed, circuits do not jump instantaneously to steady state. Energy storage components (capacitors and inductors) enforce continuous boundary conditions:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#17263B] p-3 rounded-lg border border-[#26364D]">
                  <strong className="text-[#A78BFA] block mb-1">RC Time Constant (&tau; = RC)</strong>
                  Capacitor voltage cannot change instantaneously. Voltage climbs exponentially: V_C(t) = V(1 - e^(-t/RC)). At t = &tau;, it reaches 63.2% of final voltage.
                </div>
                <div className="bg-[#17263B] p-3 rounded-lg border border-[#26364D]">
                  <strong className="text-[#38BDF8] block mb-1">RL Time Constant (&tau; = L/R)</strong>
                  Inductor current cannot change instantaneously. Current rises exponentially: i(t) = (V/R)(1 - e^(-tR/L)). At t = &tau;, current reaches 63.2% of V/R.
                </div>
              </div>

              <div className="bg-[#17263B] p-3 rounded-lg border border-[#26364D] space-y-1.5">
                <div className="text-[#F1F5F9] font-bold">Series RLC Second-Order Differential Equation:</div>
                <div className="font-mono text-center text-[#FBBF24]">
                  L (d&sup2;q/dt&sup2;) + R (dq/dt) + q/C = V_source
                </div>
                <p>
                  Comparing the damping coefficient &alpha; = R / (2L) to the natural angular frequency &omega;_0 = 1 / &radic;(LC):
                </p>
                <ul className="list-disc list-inside space-y-1 font-mono text-[11px] text-[#F1F5F9]">
                  <li><strong className="text-[#FB7185]">&alpha; &lt; &omega;_0 (Underdamped):</strong> Energy sloshes back and forth between L and C, producing decaying sinusoidal ringing.</li>
                  <li><strong className="text-[#34D399]">&alpha; = &omega;_0 (Critically Damped):</strong> Circuit settles to steady-state voltage in the minimum possible time with zero overshoot (R_crit = 2&radic;(L/C)).</li>
                  <li><strong className="text-[#A78BFA]">&alpha; &gt; &omega;_0 (Overdamped):</strong> Excessive resistance slows down energy transfer; voltage creeps sluggishly to final value without oscillating.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
