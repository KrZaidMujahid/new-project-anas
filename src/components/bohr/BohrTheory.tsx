/**
 * EQUATION 1 — Understand the Bohr Model Theory & Equations
 * Deep physical explanations of quantized angular momentum, energy states,
 * spectral series derivations, KaTeX mathematical formulas, and historical limitations.
 */

import React from 'react';
import { MathView } from '../MathView';
import { BookOpen, CheckCircle2, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export const BohrTheory: React.FC = () => {
  return (
    <div className="bg-[#10243D] border border-[#29415F] rounded-xl p-5 shadow-xl flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#29415F]/70">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#818CF8]" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Understand the Bohr Model: Quantum Mechanics & Atomic Structure
          </h3>
        </div>
        <span className="text-xs font-mono text-[#818CF8]">
          Niels Bohr (1913 Nobel Prize)
        </span>
      </div>

      {/* Grid: Conceptual Foundations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Topic A: What is the Bohr Model? */}
        <div className="p-4 rounded-xl bg-[#0B1B31] border border-[#29415F] flex flex-col gap-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-[#38BDF8]" />
            A. The Historical Bohr Postulates
          </h4>
          <p className="text-xs text-[#9FB3CC] leading-relaxed">
            In 1913, Danish physicist <strong className="text-white">Niels Bohr</strong> reconciled Rutherford's planetary nuclear model with experimental hydrogen spectroscopy by introducing three revolutionary quantum postulates:
          </p>
          <ul className="text-xs text-[#9FB3CC] space-y-2 list-disc pl-4">
            <li>
              <strong className="text-white">Stationary Non-Radiating Orbits:</strong> Electrons revolve around the nucleus only in certain stable, non-radiating circular orbits without emitting electromagnetic radiation (defying classical electrodynamics).
            </li>
            <li>
              <strong className="text-white">Quantized Angular Momentum:</strong> The orbital angular momentum <MathView math="L" /> is quantized in integer multiples of Dirac's reduced Planck constant <MathView math="\hbar = \frac{h}{2\pi}" />:
              <div className="my-1.5 p-2 rounded bg-[#10243D] border border-[#29415F] flex justify-center">
                <MathView math="L = m_e v r = n \hbar = n \frac{h}{2\pi}, \quad n \in \{1, 2, 3, \dots\}" />
              </div>
            </li>
            <li>
              <strong className="text-white">Bohr Frequency Condition:</strong> Radiation is emitted or absorbed only when an electron transitions between two allowed stationary states:
              <div className="my-1.5 p-2 rounded bg-[#10243D] border border-[#29415F] flex justify-center">
                <MathView math="\Delta E = |E_f - E_i| = h \nu = \frac{h c}{\lambda}" />
              </div>
            </li>
          </ul>
        </div>

        {/* Topic B: Quantized Energy Levels & Orbit Radii */}
        <div className="p-4 rounded-xl bg-[#0B1B31] border border-[#29415F] flex flex-col gap-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            B. Derivation of Energy Levels & Bohr Radius
          </h4>
          <p className="text-xs text-[#9FB3CC] leading-relaxed">
            Equating Coulomb electrostatic attraction to centripetal acceleration yields the quantized orbital radius <MathView math="r_n" />:
          </p>
          <div className="p-2.5 rounded bg-[#10243D] border border-[#29415F] flex justify-center">
            <MathView math="r_n = a_0 \cdot n^2 = \frac{4\pi \varepsilon_0 \hbar^2}{m_e e^2} n^2 \approx 5.29177 \times 10^{-11} \text{ m} \cdot n^2" />
          </div>
          <p className="text-xs text-[#9FB3CC] leading-relaxed">
            Summing kinetic energy (<MathView math="K = \frac{1}{2} m_e v^2" />) and electrostatic potential energy (<MathView math="U = -\frac{e^2}{4\pi\varepsilon_0 r}" />) produces total quantized energy <MathView math="E_n" />:
          </p>
          <div className="p-2.5 rounded bg-[#10243D] border border-[#29415F] flex justify-center">
            <MathView math="E_n = -\frac{m_e e^4}{8 \varepsilon_0^2 h^2} \frac{1}{n^2} = -\frac{13.600 \text{ eV}}{n^2}" />
          </div>
          <div className="p-2 rounded bg-[#142B47] text-[11px] text-[#38BDF8] border border-[#29415F]">
            <strong>Symbol Definitions:</strong> <MathView math="a_0" /> is the Bohr radius (~0.529 Å), <MathView math="m_e" /> is electron mass, <MathView math="e" /> is elementary charge, <MathView math="\varepsilon_0" /> is vacuum permittivity, and <MathView math="n" /> is principal quantum number.
          </div>
        </div>
      </div>

      {/* Topic C & D: Absorption, Emission, and the Rydberg Formula */}
      <div className="p-4 rounded-xl bg-[#0B1B31] border border-[#29415F] flex flex-col gap-3">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-[#FBBF24]" />
          C. Atomic Transitions & the Rydberg Formula
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#9FB3CC]">
          <div>
            <strong className="text-amber-300 block mb-1">Photon Absorption (n_i &lt; n_f):</strong>
            An electron in lower state <MathView math="n_i" /> absorbs an incoming photon whose energy exactly equals <MathView math="\Delta E = E_f - E_i" />. The supplied electromagnetic energy elevates the electron outward to higher orbit <MathView math="n_f" />.
          </div>
          <div>
            <strong className="text-emerald-400 block mb-1">Photon Emission (n_i &gt; n_f):</strong>
            An electron in an excited state drops down to a more tightly bound orbit <MathView math="n_f" />. The released energy is spontaneously or stimulatedly expelled as a single photon of frequency <MathView math="f = \Delta E / h" />.
          </div>
        </div>

        <div className="mt-2 p-3 rounded-lg bg-[#10243D] border border-[#29415F] flex justify-center">
          <MathView math="\frac{1}{\lambda} = R_H \left( \frac{1}{n_f^2} - \frac{1}{n_i^2} \right), \quad R_H = \frac{m_e e^4}{8 \varepsilon_0^2 h^3 c} \approx 1.097373 \times 10^7 \text{ m}^{-1}" />
        </div>
      </div>

      {/* Topic H: Ground State, Ionization Limit & Binding Energy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-4 rounded-xl bg-[#0B1B31] border border-[#29415F] flex flex-col gap-2 text-xs text-[#9FB3CC]">
          <h4 className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            D. Ground State & The Ionization Limit
          </h4>
          <p>
            • <strong className="text-white">Ground State (n = 1):</strong> The most tightly bound, lowest-energy state with <MathView math="E_1 = -13.60 \text{ eV}" />. The electron cannot lose more energy.
          </p>
          <p>
            • <strong className="text-white">Ionization Energy (13.60 eV):</strong> The minimum energy required to completely remove the electron from the ground state to infinity (<MathView math="n \to \infty" />).
          </p>
          <p>
            • <strong className="text-white">Ionization Limit (0.00 eV):</strong> The boundary between bound states (<MathView math="E < 0" />, quantized negative potential well) and the continuum (<MathView math="E \ge 0" />, free electron with continuous kinetic energy).
          </p>
        </div>

        {/* Topic I: Historical Significance and Modern Quantum Mechanics Limitations */}
        <div className="p-4 rounded-xl bg-[#0B1B31] border border-[#29415F] flex flex-col gap-2 text-xs text-[#9FB3CC]">
          <h4 className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            E. Limitations & Evolution to Modern Quantum Mechanics
          </h4>
          <p>
            While Bohr’s model successfully explained hydrogen’s discrete lines, it possessed fundamental theoretical limitations that prompted modern quantum mechanics:
          </p>
          <ul className="space-y-1 list-disc pl-4">
            <li>
              <strong className="text-white">Multi-Electron Atoms:</strong> Failed to predict spectra of helium or heavier elements due to electron-electron Coulomb repulsion.
            </li>
            <li>
              <strong className="text-white">Heisenberg Uncertainty Principle:</strong> Classical circular orbits specify both exact position <MathView math="r" /> and momentum <MathView math="p" />, violating <MathView math="\Delta x \Delta p \ge \hbar / 2" />.
            </li>
            <li>
              <strong className="text-white">Modern Orbitals:</strong> In modern physics (Schrödinger equation), electrons exist as 3D standing wave probability clouds (<MathView math="1s, 2s, 2p, \dots" />) characterized by four quantum numbers (<MathView math="n, l, m_l, m_s" />).
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
