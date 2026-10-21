/**
 * EQUATION 1 — Double-Slit Theory & Derivations Panel
 * Part 16: "Physics Behind Young's Double-Slit Experiment"
 *
 * Rigorous Class 11 and Class 12 syllabus physics:
 * - Historical background and Huygens' wave theory (Thomas Young 1801)
 * - Coherent source requirements & spatial coherence
 * - Mathematical derivation of path difference δ = d sin θ ≈ dy / L
 * - Constructive & destructive interference conditions
 * - Proof of constant fringe width β = λL / d
 * - Intensity distribution & phasor superposition (I = 4I₀ cos²(Δφ/2))
 * - Single-slit diffraction envelope & missing orders condition (d/a = m/p)
 * - Liquid dielectric immersion in a medium of refractive index n
 * - Polychromatic white light interference and dispersion
 */

import React, { useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Calculator,
  Compass,
  CheckCircle2,
  Atom,
  Sparkles,
} from 'lucide-react';

interface TheorySection {
  id: string;
  title: string;
  summary: string;
  content: React.ReactNode;
}

export const DoubleSlitTheoryPanel: React.FC = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    history: true,
    path_diff: true,
    fringe_width: true,
    intensity: false,
    envelope: false,
    medium: false,
    white_light: false,
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const sections: TheorySection[] = [
    {
      id: 'history',
      title: "1. Historical Significance & Young's 1801 Experiment",
      summary: "How Thomas Young disproved Newton's corpuscular theory and proved light is a wave.",
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            In 1801, the English polymath <strong className="text-white">Thomas Young</strong> presented his famous double-slit experiment to the Royal Society of London. At the time, Sir Isaac Newton’s corpuscular (particle) theory of light dominated physics. Newton posited that light consists of streams of microscopic particles travelling in straight lines.
          </p>
          <p>
            Young reasoned that if light were a wave, like water ripples or acoustic sound, two synchronized light beams should interfere: their crests and troughs would combine constructively to produce brightness and destructively to create darkness.
          </p>
          <div className="bg-[#0B1728] p-3 rounded-lg border border-[#26364D] space-y-1.5">
            <div className="font-bold text-[#38BDF8] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>The Coherent Source Requirement</span>
            </div>
            <p className="text-slate-400">
              Two independent light sources (such as two separate bulbs or candles) cannot produce a steady interference pattern because atomic emissions undergo random, rapid phase jumps every ~10⁻¹⁰ seconds. Young overcame this by using a <strong className="text-white">single primary pinhole/slit</strong> to illuminate two closely spaced secondary slits (<strong className="text-white font-mono">S₁</strong> and <strong className="text-white font-mono">S₂</strong>), ensuring division of wavefront and a constant phase relationship (<strong className="text-[#34D399]">spatial coherence</strong>).
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'path_diff',
      title: '2. Derivation of Path Difference (δ = d sin θ ≈ dy / L)',
      summary: 'Geometric derivation using the small-angle approximation for L >> d.',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            Let <strong className="text-white font-mono">S₁</strong> and <strong className="text-white font-mono">S₂</strong> be two narrow slits separated by distance <strong className="text-[#FBBF24] font-mono">d</strong>. A screen is placed parallel to the slit plane at a large distance <strong className="text-[#38BDF8] font-mono">L</strong> (<strong className="text-white font-mono">L ≫ d</strong>). Let <strong className="text-white font-mono">P</strong> be any point on the screen at vertical distance <strong className="text-white font-mono">y</strong> from the central zero axis <strong className="text-white font-mono">O</strong>.
          </p>
          <div className="bg-[#0B1728] p-3.5 rounded-lg border border-[#26364D] space-y-2">
            <div className="font-bold text-[#38BDF8]">Geometric Pythagoras Relation:</div>
            <div className="font-mono text-slate-300 space-y-1">
              <div>(S₂P)² = L² + (y + d/2)²</div>
              <div>(S₁P)² = L² + (y - d/2)²</div>
              <div className="pt-1 text-[#38BDF8] font-bold">
                (S₂P)² - (S₁P)² = [(y + d/2)² - (y - d/2)²] = 2yd
              </div>
              <div className="pt-1">
                (S₂P - S₁P)(S₂P + S₁P) = 2yd
              </div>
            </div>
            <p className="text-slate-400 text-[11px] pt-1">
              Since <strong className="text-white font-mono">L ≫ d</strong> and <strong className="text-white font-mono">L ≫ y</strong>, the rays are nearly parallel, so <strong className="text-white font-mono">S₂P + S₁P ≈ 2L</strong>:
            </p>
            <div className="font-mono text-sm font-bold text-[#FBBF24] bg-[#17263B] p-2 rounded border border-[#26364D] text-center">
              δ = S₂P - S₁P = (2yd) / (2L) = (yd) / L = d sin θ
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'fringe_width',
      title: '3. Conditions for Maxima, Minima, and Constant Fringe Width (β = λL / d)',
      summary: 'Step-by-step proof that all interference fringes have identical spacing.',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Constructive Interference */}
            <div className="bg-[#0B1728] p-3 rounded-lg border border-[#26364D] space-y-1.5">
              <div className="font-bold text-[#34D399]">Constructive Interference (Bright Fringes)</div>
              <p className="text-slate-400">
                Waves arrive in phase when path difference is an integer multiple of wavelength:
              </p>
              <div className="font-mono text-xs font-bold text-white bg-[#17263B] p-1.5 rounded text-center">
                δ = mλ  ⟹  y_m = m(λL / d)
              </div>
              <p className="text-[10px] text-slate-500 font-mono">
                where m = 0 (central bright), ±1 (1st order), ±2 (2nd order)...
              </p>
            </div>

            {/* Destructive Interference */}
            <div className="bg-[#0B1728] p-3 rounded-lg border border-[#26364D] space-y-1.5">
              <div className="font-bold text-[#FB7185]">Destructive Interference (Dark Fringes)</div>
              <p className="text-slate-400">
                Waves arrive out of phase when path difference is an odd half-multiple of wavelength:
              </p>
              <div className="font-mono text-xs font-bold text-white bg-[#17263B] p-1.5 rounded text-center">
                δ = (m + 1/2)λ  ⟹  y_dark = (m + 1/2)(λL / d)
              </div>
              <p className="text-[10px] text-slate-500 font-mono">
                where m = 0 (1st dark), ±1 (2nd dark), ±2 (3rd dark)...
              </p>
            </div>
          </div>

          {/* Fringe Width Proof */}
          <div className="bg-[#0B1728] p-3 rounded-lg border border-[#26364D] space-y-2">
            <div className="font-bold text-[#38BDF8]">Proof of Constant Fringe Width (β):</div>
            <p className="text-slate-300">
              The separation between any two consecutive bright fringes (or two consecutive dark fringes) is:
            </p>
            <div className="font-mono text-sm font-black text-[#38BDF8] bg-[#17263B] p-2 rounded border border-[#26364D] text-center">
              β = y_(m+1) - y_m = (m+1)(λL / d) - m(λL / d) = λL / d
            </div>
            <p className="text-slate-400 text-[11px]">
              Notice that <strong className="text-white font-mono">β</strong> is completely independent of the fringe order <strong className="text-white font-mono">m</strong>! Hence, <strong className="text-[#34D399]">all bright and dark fringes in Young's experiment are equally spaced</strong>.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'intensity',
      title: '4. Intensity Distribution & Phasor Superposition (I = 4I₀ cos²(Δφ / 2))',
      summary: 'Electric field vector superposition and mathematical derivation of peak intensity.',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            Let the electric fields from the two slits at point <strong className="text-white font-mono">P</strong> be represented as harmonic plane waves:
          </p>
          <div className="font-mono bg-[#0B1728] p-2.5 rounded border border-[#26364D] text-center space-y-1">
            <div>E₁ = E₀ cos(ωt)</div>
            <div>E₂ = E₀ cos(ωt + Δφ)</div>
          </div>
          <p>
            By the principle of superposition, the resultant field is <strong className="text-white font-mono">E_R = E₁ + E₂ = 2E₀ cos(Δφ / 2) cos(ωt + Δφ / 2)</strong>.
          </p>
          <p>
            Since optical intensity is proportional to the square of the electric field amplitude (<strong className="text-white font-mono">I ∝ E_R²</strong>):
          </p>
          <div className="font-mono text-sm font-black text-[#FBBF24] bg-[#17263B] p-2 rounded border border-[#26364D] text-center">
            I(Δφ) = 4 I₀ cos²(Δφ / 2)
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            <div className="bg-[#0B1728] p-2 rounded border border-[#26364D]">
              <strong className="text-[#34D399]">Maximum Intensity:</strong> When Δφ = 2mπ, cos² = 1 ⟹ <strong className="text-white font-mono">I_max = 4I₀</strong>.
            </div>
            <div className="bg-[#0B1728] p-2 rounded border border-[#26364D]">
              <strong className="text-[#FB7185]">Minimum Intensity:</strong> When Δφ = (2m+1)π, cos² = 0 ⟹ <strong className="text-white font-mono">I_min = 0</strong>.
            </div>
          </div>
          <p className="text-slate-400 text-[11px]">
            Energy Conservation: The average intensity across the pattern is <strong className="text-white font-mono">⟨I⟩ = 2I₀</strong>, exactly equal to the sum of the independent intensities (<strong className="text-white font-mono">I₀ + I₀</strong>). Interference merely redistributes energy from dark regions to bright regions without violating conservation of energy.
          </p>
        </div>
      ),
    },
    {
      id: 'envelope',
      title: '5. Single-Slit Diffraction Envelope & Missing Orders',
      summary: 'Combined intensity formula and the condition d / a = m / p.',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            In any physical apparatus, the slits have finite width <strong className="text-white font-mono">a</strong>. Therefore, diffraction from each slit modulates the interference pattern:
          </p>
          <div className="font-mono text-sm font-bold text-[#A78BFA] bg-[#0B1728] p-2.5 rounded border border-[#26364D] text-center">
            I(θ) = I₀ [sin(β) / β]² · cos²(α)
          </div>
          <div className="text-[11px] font-mono text-slate-400 text-center">
            where β = (πa sin θ) / λ  and  α = (πd sin θ) / λ
          </div>
          <div className="bg-[#17263B] p-3 rounded-lg border border-[#26364D] space-y-1.5">
            <div className="font-bold text-[#FB7185]">Missing Orders (Suppressed Fringes):</div>
            <p className="text-slate-300">
              When an interference bright fringe (<strong className="text-white font-mono">d sin θ = mλ</strong>) coincides with a diffraction minimum (<strong className="text-white font-mono">a sin θ = pλ</strong>):
            </p>
            <div className="font-mono text-xs font-bold text-[#FB7185] bg-[#0B1728] p-1.5 rounded text-center">
              d / a = m / p  ⟹  m = p(d / a)
            </div>
            <p className="text-slate-400 text-[11px]">
              For example, if <strong className="text-white font-mono">d = 3a</strong>, the interference orders <strong className="text-white font-mono">m = ±3, ±6, ±9...</strong> are absent from the screen.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'medium',
      title: '6. Immersion in a Liquid Medium of Refractive Index n',
      summary: 'How fringe width decreases when the apparatus is submerged in water or oil.',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            When the entire double-slit apparatus is submerged in a medium of refractive index <strong className="text-white font-mono">n</strong> (such as water, where <strong className="text-[#38BDF8] font-mono">n ≈ 1.333</strong>):
          </p>
          <ul className="list-disc list-inside space-y-1 font-mono text-slate-300 pl-2">
            <li>Speed of light slows down: <span className="text-[#FBBF24]">v = c / n</span></li>
            <li>Frequency remains invariant: <span className="text-[#34D399]">f' = f</span> (determined solely by the source)</li>
            <li>Wavelength compresses: <span className="text-[#38BDF8]">λ' = λ / n</span></li>
          </ul>
          <p>
            Consequently, the new fringe width <strong className="text-white font-mono">β'</strong> becomes:
          </p>
          <div className="font-mono text-sm font-bold text-[#38BDF8] bg-[#0B1728] p-2 rounded border border-[#26364D] text-center">
            β' = (λ'L) / d = (λL) / (n · d) = β / n
          </div>
          <p className="text-slate-400 text-[11px]">
            In water (<strong className="text-white font-mono">n = 1.333</strong>), fringe spacing shrinks by 25%. In dense glass (<strong className="text-white font-mono">n = 1.52</strong>), it shrinks by 34%.
          </p>
        </div>
      ),
    },
    {
      id: 'white_light',
      title: '7. White Light Interference & Spectral Dispersion',
      summary: 'Why the central fringe is white and adjacent fringes are colored.',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            When polychromatic white light is used instead of a monochromatic laser:
          </p>
          <div className="space-y-2">
            <div className="bg-[#0B1728] p-2.5 rounded-lg border border-[#26364D]">
              <strong className="text-white">Central Fringe (m = 0):</strong>
              <p className="text-slate-400 mt-0.5">
                At <strong className="text-white font-mono">y = 0</strong>, the path difference <strong className="text-white font-mono">δ = 0</strong> for all wavelengths simultaneously! Every color has its zero-order maximum at the exact center, superposing into an <strong className="text-white">achromatic brilliant white central fringe</strong>.
              </p>
            </div>
            <div className="bg-[#0B1728] p-2.5 rounded-lg border border-[#26364D]">
              <strong className="text-white">Adjacent Fringes (m ≥ 1):</strong>
              <p className="text-slate-400 mt-0.5">
                Since <strong className="text-white font-mono">β ∝ λ</strong>, violet light (<strong className="text-[#A78BFA] font-mono">~400 nm</strong>) has a smaller fringe width than red light (<strong className="text-[#EF4444] font-mono">~700 nm</strong>). The first bright fringe closest to the center is violet/blue, while the outer edge is red. Beyond 2 or 3 orders, the overlapping colors wash out into uniform white illumination.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-4 text-[#F1F5F9]">
      <div className="flex items-center gap-2.5 border-b border-[#26364D] pb-3">
        <BookOpen className="w-5 h-5 text-[#38BDF8]" />
        <div>
          <h2 className="text-lg font-bold text-[#F1F5F9]">Physics Behind Young's Double-Slit Experiment</h2>
          <p className="text-xs text-[#94A3B8]">
            Comprehensive textbook physics, proofs, phasor derivations, and mathematical principles.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {sections.map((sec) => {
          const isOpen = !!openSections[sec.id];
          return (
            <div
              key={sec.id}
              className="bg-[#0B1728] rounded-lg border border-[#26364D] overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleSection(sec.id)}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#17263B] transition-colors cursor-pointer"
              >
                <div>
                  <div className="font-bold text-sm text-[#F1F5F9]">{sec.title}</div>
                  <div className="text-xs text-[#94A3B8] mt-0.5">{sec.summary}</div>
                </div>
                <div className="text-slate-400 ml-3">
                  {isOpen ? <ChevronDown className="w-4 h-4 text-[#38BDF8]" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && <div className="p-4 border-t border-[#26364D] bg-[#101D30]/60">{sec.content}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
