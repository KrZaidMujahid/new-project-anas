/**
 * EQUATION 1 — Optics Theory & Derivations Panel
 * Rigorous Class 11 and 12 syllabus physics: Snell's Law, Fermat's Principle,
 * Huygens' Wavefronts, Lateral Shift, Prism Formula, and Real vs Apparent Depth.
 */

import React, { useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Compass,
  Zap,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const OpticsTheoryPanel: React.FC = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    snell: true,
    fermat: true,
    huygens: false,
    lateral: false,
    prism: false,
    apparent: false,
    tir: false,
    atmospheric: false,
  });

  const toggle = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 text-[#F1F5F9]">
      {/* 1. Header Banner */}
      <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-black text-[#F1F5F9] tracking-tight">
            OPTICS THEORY &amp; MATHEMATICAL DERIVATIONS
          </h2>
          <p className="text-xs text-[#94A3B8] font-medium mt-0.5">
            Complete syllabus references for CBSE Class 11 &amp; 12 Physics, AP Physics 2, and introductory electrodynamics.
          </p>
        </div>
      </div>

      {/* Accordion Topics */}
      <div className="space-y-4">
        {/* SECTION 1: Snell's Law & Refraction */}
        <div className="bg-[#101D30] rounded-xl border border-[#26364D] overflow-hidden shadow-lg">
          <button
            onClick={() => toggle('snell')}
            className="w-full flex items-center justify-between p-4.5 text-left bg-[#101D30] hover:bg-[#17263B] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] text-xs font-bold font-mono">
                01
              </div>
              <span className="text-sm font-bold text-[#F1F5F9]">
                Laws of Refraction &amp; Snell's Law
              </span>
            </div>
            {openSections.snell ? <ChevronDown className="w-4 h-4 text-[#38BDF8]" /> : <ChevronRight className="w-4 h-4 text-[#94A3B8]" />}
          </button>

          {openSections.snell && (
            <div className="p-5 pt-1 border-t border-[#26364D] space-y-4 text-xs text-[#94A3B8] leading-relaxed">
              <p>
                When a ray of light passes obliquely from one transparent isotropic medium to another, it deviates from its original straight path at the interface. This bending phenomenon is known as <strong>refraction</strong>.
              </p>

              <div className="bg-[#17263B] p-4 rounded-lg border border-[#26364D] space-y-2">
                <h4 className="text-xs font-bold text-[#38BDF8] uppercase">The Two Laws of Refraction:</h4>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-[#F1F5F9]">
                  <li>
                    <strong>First Law:</strong> The incident ray, the refracted ray, and the normal to the interface at the point of incidence all lie in the <em>same plane</em> (the plane of incidence).
                  </li>
                  <li>
                    <strong>Second Law (Snell's Law):</strong> The ratio of the sine of the angle of incidence to the sine of the angle of refraction is a constant equal to the relative refractive index of the second medium with respect to the first:
                  </li>
                </ol>
                <div className="p-3 bg-[#0A1526] rounded border border-[#26364D] text-center font-mono text-sm font-black text-[#FBBF24]">
                  sin(θ₁) / sin(θ₂) = n₂₁ = n₂ / n₁ = v₁ / v₂ = λ₁ / λ₂
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[#17263B] p-3 rounded border border-[#26364D] space-y-1">
                  <strong className="text-[#34D399] block">Rarer to Denser Medium (n₁ &lt; n₂):</strong>
                  <span>Light slows down (v₂ &lt; v₁), bending <em>towards the normal</em> (θ₂ &lt; θ₁).</span>
                </div>
                <div className="bg-[#17263B] p-3 rounded border border-[#26364D] space-y-1">
                  <strong className="text-[#FB7185] block">Denser to Rarer Medium (n₁ &gt; n₂):</strong>
                  <span>Light speeds up (v₂ &gt; v₁), bending <em>away from the normal</em> (θ₂ &gt; θ₁).</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: Fermat's Principle of Least Time */}
        <div className="bg-[#101D30] rounded-xl border border-[#26364D] overflow-hidden shadow-lg">
          <button
            onClick={() => toggle('fermat')}
            className="w-full flex items-center justify-between p-4.5 text-left bg-[#101D30] hover:bg-[#17263B] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#FBBF24]/15 border border-[#FBBF24]/30 flex items-center justify-center text-[#FBBF24] text-xs font-bold font-mono">
                02
              </div>
              <span className="text-sm font-bold text-[#F1F5F9]">
                Fermat's Principle of Least Time (Variational Derivation)
              </span>
            </div>
            {openSections.fermat ? <ChevronDown className="w-4 h-4 text-[#FBBF24]" /> : <ChevronRight className="w-4 h-4 text-[#94A3B8]" />}
          </button>

          {openSections.fermat && (
            <div className="p-5 pt-1 border-t border-[#26364D] space-y-4 text-xs text-[#94A3B8] leading-relaxed">
              <p>
                Pierre de Fermat stated that light traveling between two points takes the path that requires the <strong>least time</strong> (stationary optical path length).
              </p>

              <div className="bg-[#17263B] p-4 rounded-lg border border-[#26364D] space-y-2 font-mono text-xs">
                <div className="text-[#FBBF24] font-bold">Mathematical Setup:</div>
                <p className="text-[#F1F5F9]">
                  Point A is at (0, h₁) in medium 1; Point B is at (d, -h₂) in medium 2. The boundary is y = 0. Light crosses at point (x, 0).
                </p>
                <p>Total time: t(x) = √(h₁² + x²) / v₁ + √(h₂² + (d - x)²) / v₂</p>
                <p>Setting dt / dx = 0 for minimum time:</p>
                <p className="text-[#38BDF8]">
                  x / [ v₁ √(h₁² + x²) ] - (d - x) / [ v₂ √(h₂² + (d - x)²) ] = 0
                </p>
                <p className="text-[#34D399]">
                  sin(θ₁) / v₁ = sin(θ₂) / v₂  ⟹  n₁ sin(θ₁) = n₂ sin(θ₂)
                </p>
              </div>
              <p>
                This proves that Snell's law is the exact physical consequence of time-minimization during wave propagation across boundaries!
              </p>
            </div>
          )}
        </div>

        {/* SECTION 3: Huygens' Wavefront Principle */}
        <div className="bg-[#101D30] rounded-xl border border-[#26364D] overflow-hidden shadow-lg">
          <button
            onClick={() => toggle('huygens')}
            className="w-full flex items-center justify-between p-4.5 text-left bg-[#101D30] hover:bg-[#17263B] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#34D399]/15 border border-[#34D399]/30 flex items-center justify-center text-[#34D399] text-xs font-bold font-mono">
                03
              </div>
              <span className="text-sm font-bold text-[#F1F5F9]">
                Huygens' Secondary Wavelets Derivation (Wave Optics)
              </span>
            </div>
            {openSections.huygens ? <ChevronDown className="w-4 h-4 text-[#34D399]" /> : <ChevronRight className="w-4 h-4 text-[#94A3B8]" />}
          </button>

          {openSections.huygens && (
            <div className="p-5 pt-1 border-t border-[#26364D] space-y-4 text-xs text-[#94A3B8] leading-relaxed">
              <p>
                Christian Huygens proposed that every point on a primary wavefront acts as a secondary source of spherical wavelets spreading in all directions with speed characteristic of that medium.
              </p>

              <div className="bg-[#17263B] p-4 rounded-lg border border-[#26364D] space-y-2 font-mono text-xs">
                <div className="text-[#34D399] font-bold">Geometric Invariant:</div>
                <p className="text-[#F1F5F9]">
                  In time τ, edge B of the wavefront travels distance BC = v₁·τ in medium 1, while edge A enters medium 2 and forms a wavelet of radius AE = v₂·τ.
                </p>
                <p>From right triangles ΔABC and ΔAEC with common hypotenuse AC:</p>
                <p>sin(i) = BC / AC = (v₁ · τ) / AC</p>
                <p>sin(r) = AE / AC = (v₂ · τ) / AC</p>
                <p className="text-[#38BDF8] font-bold">
                  sin(i) / sin(r) = v₁ / v₂ = n₂ / n₁
                </p>
              </div>
              <p>
                This confirms that light bends precisely because its wavefront travels slower in an optically denser medium, rotating the envelope tangent.
              </p>
            </div>
          )}
        </div>

        {/* SECTION 4: Parallel Slab Lateral Shift */}
        <div className="bg-[#101D30] rounded-xl border border-[#26364D] overflow-hidden shadow-lg">
          <button
            onClick={() => toggle('lateral')}
            className="w-full flex items-center justify-between p-4.5 text-left bg-[#101D30] hover:bg-[#17263B] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#A78BFA]/15 border border-[#A78BFA]/30 flex items-center justify-center text-[#A78BFA] text-xs font-bold font-mono">
                04
              </div>
              <span className="text-sm font-bold text-[#F1F5F9]">
                Lateral Displacement in a Parallel Glass Slab
              </span>
            </div>
            {openSections.lateral ? <ChevronDown className="w-4 h-4 text-[#A78BFA]" /> : <ChevronRight className="w-4 h-4 text-[#94A3B8]" />}
          </button>

          {openSections.lateral && (
            <div className="p-5 pt-1 border-t border-[#26364D] space-y-4 text-xs text-[#94A3B8] leading-relaxed">
              <p>
                When a ray passes through a rectangular slab of thickness <span className="font-mono text-[#F1F5F9]">t</span>, the emergent ray is <strong>parallel to the incident ray</strong> because the refraction angles at opposite parallel faces cancel out. However, the ray undergoes a perpendicular sideways shift known as <strong>lateral displacement (d)</strong>.
              </p>

              <div className="bg-[#17263B] p-4 rounded-lg border border-[#26364D] text-center font-mono space-y-2">
                <div className="text-sm font-black text-[#FB7185]">
                  d = t · sin(i - r) / cos(r)
                </div>
                <div className="text-xs text-[#94A3B8]">
                  For small angles of incidence (i &lt;&lt; 1 rad): d ≈ t · i · (1 - 1/n)
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-[#17263B] p-2.5 rounded border border-[#26364D]">
                  <strong className="text-[#38BDF8] block">Thickness Dependence:</strong>
                  <span>Lateral displacement d is directly proportional to thickness t.</span>
                </div>
                <div className="bg-[#17263B] p-2.5 rounded border border-[#26364D]">
                  <strong className="text-[#FBBF24] block">Angle Dependence:</strong>
                  <span>d increases monotonically as incidence angle i increases towards 90°.</span>
                </div>
                <div className="bg-[#17263B] p-2.5 rounded border border-[#26364D]">
                  <strong className="text-[#34D399] block">Refractive Index:</strong>
                  <span>Higher refractive index n causes greater bending (smaller r) and larger shift.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 5: Prism Formula & Minimum Deviation */}
        <div className="bg-[#101D30] rounded-xl border border-[#26364D] overflow-hidden shadow-lg">
          <button
            onClick={() => toggle('prism')}
            className="w-full flex items-center justify-between p-4.5 text-left bg-[#101D30] hover:bg-[#17263B] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#FB7185]/15 border border-[#FB7185]/30 flex items-center justify-center text-[#FB7185] text-xs font-bold font-mono">
                05
              </div>
              <span className="text-sm font-bold text-[#F1F5F9]">
                Refraction through a Triangular Prism &amp; Minimum Deviation
              </span>
            </div>
            {openSections.prism ? <ChevronDown className="w-4 h-4 text-[#FB7185]" /> : <ChevronRight className="w-4 h-4 text-[#94A3B8]" />}
          </button>

          {openSections.prism && (
            <div className="p-5 pt-1 border-t border-[#26364D] space-y-4 text-xs text-[#94A3B8] leading-relaxed">
              <p>
                In a triangular prism with vertex angle A, an incident ray at angle i refracts at face 1 (angle r₁), hits face 2 at angle r₂, and emerges at angle e.
              </p>

              <div className="bg-[#17263B] p-4 rounded-lg border border-[#26364D] font-mono text-xs space-y-2">
                <p>1. Geometric Angle Relation: r₁ + r₂ = A</p>
                <p>2. Total Deviation Angle: δ = i + e - A</p>
                <p className="text-[#34D399] font-bold">
                  3. Condition for Minimum Deviation (δ = δ_m):
                </p>
                <p>At minimum deviation, the ray passes symmetrically through the prism parallel to its base:</p>
                <p className="text-[#FBBF24]">i = e  and  r₁ = r₂ = A / 2</p>
                <p>Therefore: δ_m = 2i - A  ⟹  i = (A + δ_m) / 2</p>
                <div className="p-2.5 bg-[#0A1526] rounded text-center text-sm font-black text-[#38BDF8]">
                  n = sin[ (A + δ_m) / 2 ] / sin( A / 2 )
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 6: Real vs Apparent Depth */}
        <div className="bg-[#101D30] rounded-xl border border-[#26364D] overflow-hidden shadow-lg">
          <button
            onClick={() => toggle('apparent')}
            className="w-full flex items-center justify-between p-4.5 text-left bg-[#101D30] hover:bg-[#17263B] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] text-xs font-bold font-mono">
                06
              </div>
              <span className="text-sm font-bold text-[#F1F5F9]">
                Real Depth, Apparent Depth &amp; Normal Shift
              </span>
            </div>
            {openSections.apparent ? <ChevronDown className="w-4 h-4 text-[#38BDF8]" /> : <ChevronRight className="w-4 h-4 text-[#94A3B8]" />}
          </button>

          {openSections.apparent && (
            <div className="p-5 pt-1 border-t border-[#26364D] space-y-4 text-xs text-[#94A3B8] leading-relaxed">
              <p>
                When an object submerged in a denser medium (e.g. water or glass) is viewed from a rarer medium (air), rays emerging into air bend away from the normal. When traced backwards, they appear to originate from an apparent position closer to the surface.
              </p>

              <div className="bg-[#17263B] p-4 rounded-lg border border-[#26364D] font-mono text-center space-y-2">
                <div className="text-sm font-black text-[#38BDF8]">
                  Apparent Depth (d_app) = Real Depth (d_real) / n
                </div>
                <div className="text-xs text-[#34D399]">
                  Apparent Shift (Δs) = d_real - d_app = d_real · (1 - 1/n)
                </div>
              </div>
              <p>
                For example, a pool of water (n = 4/3) with a real depth of 4.0 meters appears only 3.0 meters deep to a person standing poolside, creating a deceptive illusion of shallowness!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
