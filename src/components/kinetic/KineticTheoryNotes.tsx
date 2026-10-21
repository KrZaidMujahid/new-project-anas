/**
 * EQUATION 1 — Kinetic Theory of Gases Master Physics Theory & Derivations
 * Comprehensive educational notes covering assumptions, molecular momentum,
 * Maxwell-Boltzmann statistics, and empirical gas laws using KaTeX via MathView.
 */

import React, { useState } from 'react';
import { MathView } from '../MathView';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Atom,
  Flame,
  Activity,
  Layers,
  Scale,
  Sparkles,
} from 'lucide-react';

export const KineticTheoryNotes: React.FC = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    assumptions: true,
    pressure: true,
    energy: true,
    speeds: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-[#102740] rounded-xl border border-[#29445F] p-5 shadow-xl space-y-5 text-[#F1F5F9]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#29445F] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F1F5F9] tracking-wide">
              Learn the Kinetic Theory of Gases
            </h3>
            <p className="text-[11px] text-[#AFC2D8]">
              Microscopic statistical derivations and empirical thermodynamic principles
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const allOpen = Object.values(openSections).every(Boolean);
            setOpenSections({
              assumptions: !allOpen,
              pressure: !allOpen,
              energy: !allOpen,
              speeds: !allOpen,
              maxwell: !allOpen,
              laws: !allOpen,
              limitations: !allOpen,
            });
          }}
          className="text-xs text-[#38BDF8] hover:underline cursor-pointer"
        >
          {Object.values(openSections).every(Boolean) ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      {/* Accordion Topics */}
      <div className="space-y-3 text-xs leading-relaxed">
        {/* A. BASIC ASSUMPTIONS */}
        <div className="rounded-lg bg-[#0B1F36] border border-[#29445F] overflow-hidden">
          <button
            onClick={() => toggleSection('assumptions')}
            className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold text-white hover:bg-[#16334F] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2 text-[#38BDF8]">
              <Atom className="w-4 h-4" />
              <span>A. Basic Postulates of the Kinetic Molecular Theory</span>
            </span>
            {openSections.assumptions ? <ChevronUp className="w-4 h-4 text-[#AFC2D8]" /> : <ChevronDown className="w-4 h-4 text-[#AFC2D8]" />}
          </button>
          {openSections.assumptions && (
            <div className="p-4 pt-1 text-[#AFC2D8] space-y-2 border-t border-[#29445F]/60 bg-[#071426]">
              <p>The elementary ideal gas model is founded upon five foundational physical assumptions:</p>
              <ul className="space-y-1.5 pl-4 list-disc text-slate-300">
                <li><strong className="text-white">Large Number &amp; Random Motion:</strong> A gas consists of an enormous number of identical particles moving continually in random directions at a distribution of speeds.</li>
                <li><strong className="text-white">Point-Particle Approximation:</strong> The combined volume of the gas molecules is negligible compared with the total volume of the container (<MathView math="V_{\text{molecules}} \ll V_{\text{container}}" />).</li>
                <li><strong className="text-white">Negligible Intermolecular Forces:</strong> Attractive and repulsive forces between molecules are zero, except during instantaneous collisions.</li>
                <li><strong className="text-white">Perfectly Elastic Collisions:</strong> All collisions (molecule-molecule and molecule-wall) are frictionless and conserve both linear momentum and total kinetic energy.</li>
                <li><strong className="text-white">Newtonian Mechanics:</strong> Molecular trajectories between collisions obey classical Newtonian physics without relativistic corrections.</li>
              </ul>
            </div>
          )}
        </div>

        {/* B. ORIGIN OF GAS PRESSURE */}
        <div className="rounded-lg bg-[#0B1F36] border border-[#29445F] overflow-hidden">
          <button
            onClick={() => toggleSection('pressure')}
            className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold text-white hover:bg-[#16334F] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2 text-[#A78BFA]">
              <Scale className="w-4 h-4" />
              <span>B. Microscopic Origin of Gas Pressure &amp; Momentum Transfer</span>
            </span>
            {openSections.pressure ? <ChevronUp className="w-4 h-4 text-[#AFC2D8]" /> : <ChevronDown className="w-4 h-4 text-[#AFC2D8]" />}
          </button>
          {openSections.pressure && (
            <div className="p-4 pt-1 text-[#AFC2D8] space-y-2.5 border-t border-[#29445F]/60 bg-[#071426]">
              <p>
                Macroscopic pressure is not a static force; it is the time-averaged result of trillions of microscopic impacts per second.
                When a molecule of mass <MathView math="m" /> and velocity component <MathView math="v_x" /> bounces elastically from a wall normal to the x-axis, its velocity reverses to <MathView math="-v_x" />.
              </p>
              <div className="p-2.5 bg-[#0B1F36] rounded-md font-mono text-center text-white">
                <MathView math="\Delta p_x = m v_x - (-m v_x) = 2 m v_x" displayMode />
              </div>
              <p>
                Summing the momentum transfer over all <MathView math="N" /> molecules in volume <MathView math="V" /> and accounting for isotropic 3D motion (<MathView math="\langle v_x^2 \rangle = \frac{1}{3}\langle v^2 \rangle = \frac{1}{3}v_{\text{rms}}^2" />) yields the fundamental kinetic equation:
              </p>
              <div className="p-2.5 bg-[#0B1F36] rounded-md font-mono text-center text-[#A78BFA]">
                <MathView math="P = \frac{1}{3}\rho v_{\text{rms}}^2 = \frac{1}{3}\frac{N m}{V} v_{\text{rms}}^2" displayMode />
              </div>
            </div>
          )}
        </div>

        {/* C. TEMPERATURE & AVERAGE KINETIC ENERGY */}
        <div className="rounded-lg bg-[#0B1F36] border border-[#29445F] overflow-hidden">
          <button
            onClick={() => toggleSection('energy')}
            className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold text-white hover:bg-[#16334F] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2 text-[#4ADE80]">
              <Flame className="w-4 h-4" />
              <span>C. Temperature and Translational Kinetic Energy</span>
            </span>
            {openSections.energy ? <ChevronUp className="w-4 h-4 text-[#AFC2D8]" /> : <ChevronDown className="w-4 h-4 text-[#AFC2D8]" />}
          </button>
          {openSections.energy && (
            <div className="p-4 pt-1 text-[#AFC2D8] space-y-2.5 border-t border-[#29445F]/60 bg-[#071426]">
              <p>
                The central discovery of kinetic theory is that <strong className="text-white">absolute temperature is a direct measure of average molecular kinetic energy</strong>.
                By equating <MathView math="P V = \frac{1}{3} N m v_{\text{rms}}^2" /> with the ideal gas law <MathView math="P V = N k_B T" />:
              </p>
              <div className="p-2.5 bg-[#0B1F36] rounded-md font-mono text-center text-[#4ADE80]">
                <MathView math="\langle E_k \rangle = \frac{1}{2}m v_{\text{rms}}^2 = \frac{3}{2} k_B T" displayMode />
              </div>
              <p>
                Crucially, <MathView math="\langle E_k \rangle" /> depends <strong className="text-white">only on temperature T</strong>, not on the mass of the molecule!
                At 300 K, a heavy Argon atom and a light Helium atom possess the exact same average translational kinetic energy (<MathView math="\approx 6.21 \times 10^{-21}\text{ J}" />).
              </p>
            </div>
          )}
        </div>

        {/* D. CHARACTERISTIC MOLECULAR SPEEDS */}
        <div className="rounded-lg bg-[#0B1F36] border border-[#29445F] overflow-hidden">
          <button
            onClick={() => toggleSection('speeds')}
            className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold text-white hover:bg-[#16334F] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2 text-[#38BDF8]">
              <Activity className="w-4 h-4" />
              <span>D. The Three Characteristic Speeds (v_mp, v_mean, v_rms)</span>
            </span>
            {openSections.speeds ? <ChevronUp className="w-4 h-4 text-[#AFC2D8]" /> : <ChevronDown className="w-4 h-4 text-[#AFC2D8]" />}
          </button>
          {openSections.speeds && (
            <div className="p-4 pt-1 text-[#AFC2D8] space-y-2.5 border-t border-[#29445F]/60 bg-[#071426]">
              <p>
                Because molecules collide constantly, their speeds vary over a continuum. Kinetic theory defines three statistical reference speeds:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
                <div className="p-2.5 bg-[#0B1F36] rounded border border-[#29445F]">
                  <div className="text-[11px] text-[#FBBF24] font-bold">1. Most Probable Speed</div>
                  <MathView math="v_{\text{mp}} = \sqrt{\frac{2 R T}{M}}" />
                  <div className="text-[10px] text-slate-400 mt-1">Peak of f(v)</div>
                </div>
                <div className="p-2.5 bg-[#0B1F36] rounded border border-[#29445F]">
                  <div className="text-[11px] text-[#4ADE80] font-bold">2. Mean Speed</div>
                  <MathView math="v_{\text{mean}} = \sqrt{\frac{8 R T}{\pi M}}" />
                  <div className="text-[10px] text-slate-400 mt-1">Arithmetic average</div>
                </div>
                <div className="p-2.5 bg-[#0B1F36] rounded border border-[#38BDF8]">
                  <div className="text-[11px] text-[#38BDF8] font-bold">3. Root-Mean-Square Speed</div>
                  <MathView math="v_{\text{rms}} = \sqrt{\frac{3 R T}{M}}" />
                  <div className="text-[10px] text-slate-400 mt-1">Governs energy &amp; pressure</div>
                </div>
              </div>
              <p className="pt-1">
                For any gas, their numeric ratio is strictly <MathView math="v_{\text{mp}} : v_{\text{mean}} : v_{\text{rms}} = \sqrt{2} : \sqrt{8/\pi} : \sqrt{3} \approx 1.000 : 1.128 : 1.225" />.
              </p>
            </div>
          )}
        </div>

        {/* E. MAXWELL-BOLTZMANN DISTRIBUTION */}
        <div className="rounded-lg bg-[#0B1F36] border border-[#29445F] overflow-hidden">
          <button
            onClick={() => toggleSection('maxwell')}
            className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold text-white hover:bg-[#16334F] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2 text-[#FB923C]">
              <Sparkles className="w-4 h-4" />
              <span>E. Maxwell–Boltzmann Molecular Speed Distribution</span>
            </span>
            {openSections.maxwell ? <ChevronUp className="w-4 h-4 text-[#AFC2D8]" /> : <ChevronDown className="w-4 h-4 text-[#AFC2D8]" />}
          </button>
          {openSections.maxwell && (
            <div className="p-4 pt-1 text-[#AFC2D8] space-y-2.5 border-t border-[#29445F]/60 bg-[#071426]">
              <p>
                In 1859, James Clerk Maxwell, later generalized by Ludwig Boltzmann, proved that thermal equilibrium produces a stationary distribution of molecular speeds:
              </p>
              <div className="p-2.5 bg-[#0B1F36] rounded-md font-mono text-center text-white">
                <MathView math="f(v) = 4\pi \left(\frac{M}{2\pi R T}\right)^{3/2} v^2 \exp\left(-\frac{M v^2}{2 R T}\right)" displayMode />
              </div>
              <p>
                The factor <MathView math="v^2" /> arises from the spherical surface area of velocity space in 3D (<MathView math="4\pi v^2 dv" />), ensuring <MathView math="f(0) = 0" /> (zero probability of zero speed).
                The exponential factor <MathView math="\exp(-E_k / k_B T)" /> comes from the Boltzmann factor, suppressing ultra-high speeds.
              </p>
            </div>
          )}
        </div>

        {/* F. EMPIRICAL GAS LAWS DERIVATION */}
        <div className="rounded-lg bg-[#0B1F36] border border-[#29445F] overflow-hidden">
          <button
            onClick={() => toggleSection('laws')}
            className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold text-white hover:bg-[#16334F] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2 text-[#38BDF8]">
              <Layers className="w-4 h-4" />
              <span>F. Microscopic Explanation of Empirical Gas Laws</span>
            </span>
            {openSections.laws ? <ChevronUp className="w-4 h-4 text-[#AFC2D8]" /> : <ChevronDown className="w-4 h-4 text-[#AFC2D8]" />}
          </button>
          {openSections.laws && (
            <div className="p-4 pt-1 text-[#AFC2D8] space-y-2 border-t border-[#29445F]/60 bg-[#071426]">
              <div>
                <strong className="text-white">• Boyle's Law (<MathView math="P \propto 1/V" /> at constant T):</strong> Halving the container volume doubles the spatial density of molecules, doubling the collision rate per unit wall area.
              </div>
              <div>
                <strong className="text-white">• Gay-Lussac's Law (<MathView math="P \propto T" /> at constant V):</strong> Heating increases molecular speeds (<MathView math="v \propto \sqrt{T}" />). Faster molecules collide more often AND deliver greater momentum per collision, compounding into <MathView math="P \propto T" />.
              </div>
              <div>
                <strong className="text-white">• Avogadro's Principle (<MathView math="V \propto n" /> at constant P, T):</strong> Equal volumes of all gases under identical conditions contain equal numbers of particles, regardless of molecular identity.
              </div>
            </div>
          )}
        </div>

        {/* G. LIMITATIONS & VAN DER WAALS DEVIATIONS */}
        <div className="rounded-lg bg-[#0B1F36] border border-[#29445F] overflow-hidden">
          <button
            onClick={() => toggleSection('limitations')}
            className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold text-white hover:bg-[#16334F] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2 text-rose-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>G. Real Gas Limitations &amp; Van der Waals Corrections</span>
            </span>
            {openSections.limitations ? <ChevronUp className="w-4 h-4 text-[#AFC2D8]" /> : <ChevronDown className="w-4 h-4 text-[#AFC2D8]" />}
          </button>
          {openSections.limitations && (
            <div className="p-4 pt-1 text-[#AFC2D8] space-y-2 border-t border-[#29445F]/60 bg-[#071426]">
              <p>
                The ideal gas model fails under two extreme regimes:
              </p>
              <ul className="space-y-1 pl-4 list-disc text-slate-300">
                <li><strong className="text-white">Very High Pressure:</strong> Molecular size is no longer negligible compared to container volume; available free volume is reduced (<MathView math="V - nb" />).</li>
                <li><strong className="text-white">Very Low Temperature:</strong> Low kinetic energies allow intermolecular van der Waals attractions to pull molecules toward each other, reducing wall impact forces (<MathView math="P + a(n/V)^2" />).</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
