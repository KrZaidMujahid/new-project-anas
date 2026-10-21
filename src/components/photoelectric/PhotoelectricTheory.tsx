/**
 * EQUATION 1 — Photoelectric Effect Theory & Educational Explanation
 * Comprehensive scientific background with KaTeX mathematical formulas:
 * Sections A through J fulfilling Section 13 of user requirements.
 */

import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronRight, Award, Lightbulb, ShieldAlert } from 'lucide-react';
import { MathView } from '../MathView';

export const PhotoelectricTheory: React.FC = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    secA: true,
    secB: true,
    secE: true,
    secF: true,
    secH: true,
  });

  const toggleSection = (sec: string) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  return (
    <div className="bg-[#10243D] rounded-xl border border-[#29415F] p-4 sm:p-6 shadow-2xl space-y-6 text-[#EAF2FF]">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#29415F] pb-4">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-[#38BDF8]" />
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#EAF2FF]">
              Understand the Photoelectric Effect
            </h2>
            <p className="text-xs text-[#9FB3CC]">
              Classical wave failure, Einstein’s light quantum hypothesis, and the foundations of modern quantum physics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#142B47] border border-[#29415F] text-xs text-[#FBBF24]">
          <Award className="w-4 h-4" />
          <span>1921 Nobel Prize in Physics &middot; Albert Einstein</span>
        </div>
      </div>

      {/* Accordion / Structured Sections A through J */}
      <div className="space-y-3">
        {/* Section A: What is the Photoelectric Effect? */}
        <div className="bg-[#142B47] rounded-xl border border-[#29415F] overflow-hidden">
          <button
            onClick={() => toggleSection('secA')}
            className="w-full flex items-center justify-between p-3.5 text-left font-bold text-xs sm:text-sm text-[#EAF2FF] hover:text-[#38BDF8] transition-colors cursor-pointer"
          >
            <span>A. What is the Photoelectric Effect?</span>
            {openSections.secA ? <ChevronDown className="w-4 h-4 text-[#38BDF8]" /> : <ChevronRight className="w-4 h-4 text-[#9FB3CC]" />}
          </button>
          {openSections.secA && (
            <div className="p-4 pt-1 border-t border-[#29415F]/60 text-xs sm:text-sm text-[#9FB3CC] leading-relaxed space-y-2">
              <p>
                The <strong>photoelectric effect</strong> is the phenomenon in which electrons (termed <em>photoelectrons</em>) are emitted from the surface of a material—most prominently metals—when illuminated by electromagnetic radiation (light) of sufficiently high frequency.
              </p>
              <p>
                First noticed by Heinrich Hertz in 1887 during spark-gap experiments and investigated systematically by Philipp Lenard in 1902, the phenomenon presented catastrophic contradictions to 19th-century classical wave theory of light.
              </p>
            </div>
          )}
        </div>

        {/* Section B: Einstein's Photon Model */}
        <div className="bg-[#142B47] rounded-xl border border-[#29415F] overflow-hidden">
          <button
            onClick={() => toggleSection('secB')}
            className="w-full flex items-center justify-between p-3.5 text-left font-bold text-xs sm:text-sm text-[#EAF2FF] hover:text-[#38BDF8] transition-colors cursor-pointer"
          >
            <span>B. Einstein's Photon Model</span>
            {openSections.secB ? <ChevronDown className="w-4 h-4 text-[#38BDF8]" /> : <ChevronRight className="w-4 h-4 text-[#9FB3CC]" />}
          </button>
          {openSections.secB && (
            <div className="p-4 pt-1 border-t border-[#29415F]/60 text-xs sm:text-sm text-[#9FB3CC] leading-relaxed space-y-3">
              <p>
                In 1905, Albert Einstein resolved the paradox by extending Max Planck’s quantum hypothesis. Einstein proposed that light is not merely emitted in quanta, but travels through space and is absorbed as discrete, localized packets of energy called <strong>photons</strong> (light quanta).
              </p>
              <div className="p-3 bg-[#071426] rounded-lg border border-[#29415F] flex justify-center">
                <MathView math="E_{\text{photon}} = h f = \frac{h c}{\lambda}" />
              </div>
              <p>
                Where <span className="font-mono text-[#38BDF8]">h = 6.62607015 &times; 10⁻³⁴ J&middot;s</span> is Planck's constant, <span className="font-mono text-[#38BDF8]">f</span> is incident radiation frequency in Hertz, <span className="font-mono text-[#38BDF8]">c</span> is the speed of light, and <span className="font-mono text-[#38BDF8]">λ</span> is wavelength in vacuum.
              </p>
            </div>
          )}
        </div>

        {/* Section C: Work Function */}
        <div className="bg-[#142B47] rounded-xl border border-[#29415F] overflow-hidden">
          <button
            onClick={() => toggleSection('secC')}
            className="w-full flex items-center justify-between p-3.5 text-left font-bold text-xs sm:text-sm text-[#EAF2FF] hover:text-[#38BDF8] transition-colors cursor-pointer"
          >
            <span>C. Work Function (φ)</span>
            {openSections.secC ? <ChevronDown className="w-4 h-4 text-[#38BDF8]" /> : <ChevronRight className="w-4 h-4 text-[#9FB3CC]" />}
          </button>
          {openSections.secC && (
            <div className="p-4 pt-1 border-t border-[#29415F]/60 text-xs sm:text-sm text-[#9FB3CC] leading-relaxed space-y-3">
              <p>
                Conduction electrons inside a metal are held by the electrostatic attraction of positive atomic nuclei. The <strong>work function (φ)</strong> represents the minimum energy required to liberate the least tightly bound conduction electron from the metal’s surface into the surrounding vacuum.
              </p>
              <div className="p-3 bg-[#071426] rounded-lg border border-[#29415F] flex justify-center">
                <MathView math="\phi_{\text{J}} = \phi_{\text{eV}} \times e \quad (\text{where } e = 1.602176634 \times 10^{-19} \text{ C})" />
              </div>
              <p>
                Alkali metals like Cesium (<span className="text-[#FBBF24] font-mono">φ ≈ 2.14 eV</span>) and Sodium (<span className="text-[#38BDF8] font-mono">φ ≈ 2.28 eV</span>) possess low work functions and emit in visible light, whereas Zinc (<span className="text-[#94A3B8] font-mono">φ ≈ 4.30 eV</span>) and Copper (<span className="text-[#FB923C] font-mono">φ ≈ 4.70 eV</span>) require energetic ultraviolet photons.
              </p>
            </div>
          )}
        </div>

        {/* Section D: Threshold Frequency */}
        <div className="bg-[#142B47] rounded-xl border border-[#29415F] overflow-hidden">
          <button
            onClick={() => toggleSection('secD')}
            className="w-full flex items-center justify-between p-3.5 text-left font-bold text-xs sm:text-sm text-[#EAF2FF] hover:text-[#38BDF8] transition-colors cursor-pointer"
          >
            <span>D. Threshold Frequency and Cut-off Wavelength</span>
            {openSections.secD ? <ChevronDown className="w-4 h-4 text-[#38BDF8]" /> : <ChevronRight className="w-4 h-4 text-[#9FB3CC]" />}
          </button>
          {openSections.secD && (
            <div className="p-4 pt-1 border-t border-[#29415F]/60 text-xs sm:text-sm text-[#9FB3CC] leading-relaxed space-y-3">
              <p>
                Because energy is delivered in single-photon quanta, photoemission is strictly impossible if each incident photon has less energy than the work function:
              </p>
              <div className="p-3 bg-[#071426] rounded-lg border border-[#29415F] flex flex-col items-center gap-2">
                <MathView math="f_0 = \frac{\phi}{h} \quad \text{and} \quad \lambda_0 = \frac{c}{f_0} = \frac{h c}{\phi}" />
              </div>
              <p>
                <span className="font-mono text-[#38BDF8]">f₀</span> is the <strong>threshold frequency</strong> (cut-off frequency) and <span className="font-mono text-[#FBBF24]">λ₀</span> is the <strong>threshold wavelength</strong>. For photoemission to occur in the standard one-photon model, the incident light must satisfy <span className="font-mono text-[#34D399]">f &ge; f₀</span> (or <span className="font-mono text-[#34D399]">λ &le; λ₀</span>).
              </p>
            </div>
          )}
        </div>

        {/* Section E: Einstein's Photoelectric Equation */}
        <div className="bg-[#142B47] rounded-xl border border-[#29415F] overflow-hidden">
          <button
            onClick={() => toggleSection('secE')}
            className="w-full flex items-center justify-between p-3.5 text-left font-bold text-xs sm:text-sm text-[#EAF2FF] hover:text-[#38BDF8] transition-colors cursor-pointer"
          >
            <span>E. Einstein's Photoelectric Equation</span>
            {openSections.secE ? <ChevronDown className="w-4 h-4 text-[#38BDF8]" /> : <ChevronRight className="w-4 h-4 text-[#9FB3CC]" />}
          </button>
          {openSections.secE && (
            <div className="p-4 pt-1 border-t border-[#29415F]/60 text-xs sm:text-sm text-[#9FB3CC] leading-relaxed space-y-3">
              <p>
                Applying the conservation of energy to a 1-to-1 collision between an incident photon and an electron:
              </p>
              <div className="p-3 bg-[#071426] rounded-lg border border-[#29415F] flex flex-col items-center gap-2">
                <MathView math="h f = \phi + K_{\max}" />
                <div className="text-xs text-[#9FB3CC]">Rearranging for maximum kinetic energy:</div>
                <MathView math="K_{\max} = h f - \phi = h(f - f_0)" />
              </div>
              <p>
                Some electrons originate deeper inside the metal lattice and lose energy through collisions before reaching the surface. Therefore, emitted photoelectrons emerge with a spread of kinetic energies ranging from zero up to the theoretical upper bound <span className="font-mono text-[#38BDF8]">K_max</span>.
              </p>
            </div>
          )}
        </div>

        {/* Section F: Role of Intensity vs. Frequency */}
        <div className="bg-[#142B47] rounded-xl border border-[#29415F] overflow-hidden">
          <button
            onClick={() => toggleSection('secF')}
            className="w-full flex items-center justify-between p-3.5 text-left font-bold text-xs sm:text-sm text-[#EAF2FF] hover:text-[#38BDF8] transition-colors cursor-pointer"
          >
            <span>F. Role of Intensity vs. Role of Frequency</span>
            {openSections.secF ? <ChevronDown className="w-4 h-4 text-[#38BDF8]" /> : <ChevronRight className="w-4 h-4 text-[#9FB3CC]" />}
          </button>
          {openSections.secF && (
            <div className="p-4 pt-1 border-t border-[#29415F]/60 text-xs sm:text-sm text-[#9FB3CC] leading-relaxed space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[#071426] p-3 rounded-lg border border-[#29415F]">
                  <h4 className="font-bold text-[#FBBF24] mb-1">Role of Light Intensity</h4>
                  <p className="text-xs leading-relaxed">
                    Intensity is proportional to <strong>photon flux</strong> (number of photons striking the cathode per second). Increasing intensity above threshold releases more electrons per second, proportionally increasing the <strong>photocurrent</strong>, but leaves the kinetic energy of individual electrons completely unchanged.
                  </p>
                </div>
                <div className="bg-[#071426] p-3 rounded-lg border border-[#29415F]">
                  <h4 className="font-bold text-[#38BDF8] mb-1">Role of Light Frequency</h4>
                  <p className="text-xs leading-relaxed">
                    Frequency dictates <strong>individual photon energy</strong> (<MathView math="E = hf" />). Increasing frequency increases the energy packet delivered to each electron, thereby directly increasing <span className="font-mono text-[#38BDF8]">K_max</span> and the required stopping potential <span className="font-mono text-[#FB7185]">V_stop</span>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section G: Stopping Potential */}
        <div className="bg-[#142B47] rounded-xl border border-[#29415F] overflow-hidden">
          <button
            onClick={() => toggleSection('secH')}
            className="w-full flex items-center justify-between p-3.5 text-left font-bold text-xs sm:text-sm text-[#EAF2FF] hover:text-[#38BDF8] transition-colors cursor-pointer"
          >
            <span>G. Stopping Potential and Experimental Verification</span>
            {openSections.secH ? <ChevronDown className="w-4 h-4 text-[#38BDF8]" /> : <ChevronRight className="w-4 h-4 text-[#9FB3CC]" />}
          </button>
          {openSections.secH && (
            <div className="p-4 pt-1 border-t border-[#29415F]/60 text-xs sm:text-sm text-[#9FB3CC] leading-relaxed space-y-3">
              <p>
                When a negative retarding voltage is applied to the collector plate, electrons experience an opposing electric force. Work done by the retarding field reduces electron kinetic energy:
              </p>
              <div className="p-3 bg-[#071426] rounded-lg border border-[#29415F] flex flex-col items-center gap-2">
                <MathView math="e V_{\text{stop}} = K_{\max}" />
                <div className="text-xs text-[#9FB3CC]">Expressed in Volts:</div>
                <MathView math="V_{\text{stop}} = \frac{h}{e} f - \frac{\phi}{e}" />
              </div>
              <p>
                When kinetic energy is measured in electronvolts (eV), the stopping potential magnitude in Volts is numerically identical to <span className="font-mono text-[#34D399]">K_max</span> in eV.
              </p>
            </div>
          )}
        </div>

        {/* Section H: Limitations of the Simulation */}
        <div className="bg-[#142B47] rounded-xl border border-[#29415F] overflow-hidden">
          <button
            onClick={() => toggleSection('secLim')}
            className="w-full flex items-center justify-between p-3.5 text-left font-bold text-xs sm:text-sm text-[#EAF2FF] hover:text-[#38BDF8] transition-colors cursor-pointer"
          >
            <span>H. Model Assumptions & Educational Approximations</span>
            {openSections.secLim ? <ChevronDown className="w-4 h-4 text-[#38BDF8]" /> : <ChevronRight className="w-4 h-4 text-[#9FB3CC]" />}
          </button>
          {openSections.secLim && (
            <div className="p-4 pt-1 border-t border-[#29415F]/60 text-xs sm:text-sm text-[#9FB3CC] leading-relaxed space-y-2">
              <p>
                This interactive simulation is an idealized educational model. In real physical laboratories:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>Work functions depend on surface purity, crystal orientation, and oxidation layers.</li>
                <li>Actual quantum efficiencies are typically between 0.1% and 10%.</li>
                <li>At relativistic velocities (<MathView math="v > 0.1 c" />), the relativistic kinetic energy formula <MathView math="K = (\gamma - 1) m_e c^2" /> must be used. For the photon energy regime here (up to ~6 eV), the nonrelativistic formula <MathView math="v = \sqrt{2 K / m_e}" /> is accurate to over 99.99%.</li>
                <li>Multi-photon absorption, while possible under ultra-intense femtosecond pulsed lasers, does not occur under typical continuous laboratory illumination.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
