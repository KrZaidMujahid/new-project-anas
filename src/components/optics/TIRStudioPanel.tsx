/**
 * EQUATION 1 — Total Internal Reflection (TIR) & Critical Angle Studio
 * Exploration of critical angle conditions, optical fibers, diamond sparkle,
 * underwater Snell's window, Porro prisms, and mirages.
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Cable,
  Gem,
  Waves,
  Eye,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { OPTICAL_MEDIA_DATABASE } from '../../physics/optics/opticsModel';

export const TIRStudioPanel: React.FC = () => {
  const [selectedDenseId, setSelectedDenseId] = useState('crown_glass');
  const [selectedRareId, setSelectedRareId] = useState('air');
  const [diverDepthM, setDiverDepthM] = useState(3.0); // 3 meters depth underwater

  const denseMed = OPTICAL_MEDIA_DATABASE.find((m) => m.id === selectedDenseId) || OPTICAL_MEDIA_DATABASE[5];
  const rareMed = OPTICAL_MEDIA_DATABASE.find((m) => m.id === selectedRareId) || OPTICAL_MEDIA_DATABASE[1];

  const nDense = denseMed.refractiveIndex;
  const nRare = rareMed.refractiveIndex;

  const canTIR = nDense > nRare;
  const criticalAngleDeg = canTIR ? (Math.asin(nRare / nDense) * 180) / Math.PI : null;

  // Snell's window radius underwater: r = h * tan(theta_c)
  const waterN = 1.333;
  const waterAirCritDeg = (Math.asin(1.0 / waterN) * 180) / Math.PI;
  const snellWindowRadiusM = diverDepthM * Math.tan((waterAirCritDeg * Math.PI) / 180);
  const snellWindowAreaM2 = Math.PI * snellWindowRadiusM * snellWindowRadiusM;

  return (
    <div className="space-y-6 text-[#F1F5F9]">
      {/* 1. Header Banner */}
      <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#A78BFA]/10 border border-[#A78BFA]/30 flex items-center justify-center text-[#A78BFA] shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#F1F5F9] tracking-tight">
              CRITICAL ANGLE &amp; TOTAL INTERNAL REFLECTION STUDIO
            </h2>
            <p className="text-xs text-[#94A3B8] font-medium mt-0.5">
              Explore when 100% of light energy is reflected without absorption, driving optical fibers, diamond sparkle, and mirages.
            </p>
          </div>
        </div>

        {/* Live Calculation Pill */}
        <div className="bg-[#17263B] px-4 py-2 rounded-lg border border-[#26364D] flex items-center gap-2">
          <span className="text-xs text-[#94A3B8]">Selected Interface:</span>
          <span className="text-xs font-mono font-bold text-[#A78BFA]">
            {canTIR ? `θ_c = ${criticalAngleDeg?.toFixed(2)}°` : 'No TIR (n₁ ≤ n₂)'}
          </span>
        </div>
      </div>

      {/* 2. Interactive Critical Angle Calculator Matrix */}
      <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#26364D]">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#38BDF8] flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>Interactive Critical Angle Matrix: θ_c = arcsin(n_rare / n_dense)</span>
          </h3>
          <span className="text-xs text-[#94A3B8] font-mono">Prerequisite: n_dense &gt; n_rare</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dense medium selector */}
          <div className="bg-[#17263B] p-4 rounded-lg border border-[#26364D] space-y-2">
            <label className="text-xs font-bold text-[#FBBF24]">Optically Denser Medium (n₁)</label>
            <select
              value={selectedDenseId}
              onChange={(e) => setSelectedDenseId(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#0A1526] border border-[#26364D] text-xs font-bold text-[#F1F5F9] focus:outline-none focus:border-[#FBBF24]"
            >
              {OPTICAL_MEDIA_DATABASE.filter((m) => m.id !== 'vacuum').map((m) => (
                <option key={`dense-${m.id}`} value={m.id}>
                  {m.name} (n = {m.refractiveIndex.toFixed(3)})
                </option>
              ))}
            </select>
          </div>

          {/* Rarer medium selector */}
          <div className="bg-[#17263B] p-4 rounded-lg border border-[#26364D] space-y-2">
            <label className="text-xs font-bold text-[#38BDF8]">Optically Rarer Medium (n₂)</label>
            <select
              value={selectedRareId}
              onChange={(e) => setSelectedRareId(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#0A1526] border border-[#26364D] text-xs font-bold text-[#F1F5F9] focus:outline-none focus:border-[#38BDF8]"
            >
              {OPTICAL_MEDIA_DATABASE.map((m) => (
                <option key={`rare-${m.id}`} value={m.id}>
                  {m.name} (n = {m.refractiveIndex.toFixed(3)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Calculation Result Breakdown */}
        <div className="p-4 rounded-lg bg-[#0B1728] border border-[#26364D] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs text-[#94A3B8]">
              Boundary: <strong className="text-[#F1F5F9]">{denseMed.name}</strong> (n₁ = {nDense.toFixed(3)}) →{' '}
              <strong className="text-[#F1F5F9]">{rareMed.name}</strong> (n₂ = {nRare.toFixed(3)})
            </div>
            <div className="text-xs font-mono text-[#A78BFA]">
              {canTIR
                ? `sin(θ_c) = ${nRare.toFixed(3)} / ${nDense.toFixed(3)} = ${(nRare / nDense).toFixed(4)}`
                : 'Condition violated: Light travels from rarer to denser medium. Refraction occurs for all angles.'}
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-xs text-[#94A3B8] font-mono">Critical Angle:</div>
            <div className="text-2xl font-mono font-black text-[#A78BFA]">
              {canTIR ? `${criticalAngleDeg?.toFixed(2)}°` : 'None'}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Real World Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Application 1: Optical Fibers */}
        <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-2.5 text-[#38BDF8]">
            <Cable className="w-5 h-5" />
            <h3 className="text-sm font-black uppercase tracking-wider">
              1. Optical Fiber Communication
            </h3>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Modern internet backbones transmit petabits of data across oceans via silica glass fiber optic cables.
            The cylindrical core of high refractive index (<span className="text-[#38BDF8] font-mono">n_core ≈ 1.50</span>)
            is surrounded by a lower index cladding (<span className="text-[#A78BFA] font-mono">n_clad ≈ 1.48</span>).
          </p>
          <div className="bg-[#17263B] p-3 rounded-lg border border-[#26364D] space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[#94A3B8]">Acceptance Cone Angle:</span>
              <span className="font-mono text-[#FBBF24] font-bold">θ_a = arcsin(NA)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94A3B8]">Numerical Aperture (NA):</span>
              <span className="font-mono text-[#34D399] font-bold">√(n_core² - n_clad²) ≈ 0.24</span>
            </div>
            <div className="text-[11px] text-[#94A3B8] pt-1">
              Because internal reflection is 100% total (no mirror silver loss), optical signals travel tens of kilometers before requiring repeaters.
            </div>
          </div>
        </div>

        {/* Application 2: Diamond Brilliance & "Fire" */}
        <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-2.5 text-[#FBBF24]">
            <Gem className="w-5 h-5" />
            <h3 className="text-sm font-black uppercase tracking-wider">
              2. Diamond Brilliance &amp; "Fire"
            </h3>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Diamond possesses an extraordinarily high refractive index of <span className="font-mono text-[#38BDF8]">n = 2.417</span>.
            This gives it an extremely narrow critical angle in air:
          </p>
          <div className="bg-[#17263B] p-3 rounded-lg border border-[#26364D] space-y-2 text-xs">
            <div className="flex items-center justify-between font-mono">
              <span className="text-[#94A3B8]">Diamond Critical Angle:</span>
              <span className="text-[#FBBF24] font-extrabold text-sm">θ_c = 24.4°</span>
            </div>
            <div className="flex items-center justify-between font-mono">
              <span className="text-[#94A3B8]">Glass Critical Angle:</span>
              <span className="text-[#94A3B8]">θ_c = 41.8°</span>
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed pt-1">
              Expert gem cutters facet diamond pavilions at ~43° so light entering the top table facet hits the bottom faces at angles exceeding 24.4°,
              undergoes 3 to 5 internal reflections, and emerges back through the top facets into the viewer's eye!
            </p>
          </div>
        </div>

        {/* Application 3: Underwater "Snell's Window" */}
        <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-2.5 text-[#34D399]">
            <Waves className="w-5 h-5" />
            <h3 className="text-sm font-black uppercase tracking-wider">
              3. Underwater "Snell's Window"
            </h3>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            A fish or scuba diver looking up from beneath the water surface sees the entire 180° hemisphere of the above-water sky compressed into a circular cone of half-angle equal to water's critical angle (<span className="text-[#34D399] font-mono">θ_c = 48.6°</span>). Outside this circle, the surface appears as a perfect mirror reflecting the ocean floor.
          </p>

          <div className="bg-[#17263B] p-3 rounded-lg border border-[#26364D] space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#94A3B8]">Diver / Fish Depth (h):</span>
              <span className="font-mono text-[#F1F5F9] font-bold">{diverDepthM.toFixed(1)} m</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="15.0"
              step="0.5"
              value={diverDepthM}
              onChange={(e) => setDiverDepthM(parseFloat(e.target.value) || 1)}
              className="w-full h-1.5 bg-[#0A1526] rounded appearance-none cursor-pointer accent-[#34D399]"
            />
            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
              <div className="bg-[#0A1526] p-2 rounded">
                <span className="text-[#94A3B8] block text-[10px]">Window Radius r = h·tan(θ_c):</span>
                <span className="text-[#34D399] font-bold">{snellWindowRadiusM.toFixed(2)} m</span>
              </div>
              <div className="bg-[#0A1526] p-2 rounded">
                <span className="text-[#94A3B8] block text-[10px]">Illuminated Circular Area:</span>
                <span className="text-[#38BDF8] font-bold">{snellWindowAreaM2.toFixed(1)} m²</span>
              </div>
            </div>
          </div>
        </div>

        {/* Application 4: Totally Reflecting Porro Prisms */}
        <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-2.5 text-[#FB7185]">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="text-sm font-black uppercase tracking-wider">
              4. Porro Prisms in Binoculars &amp; Periscopes
            </h3>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            In right-angled isosceles prisms (45°-90°-45°), light enters normal to one face, strikes the hypotenuse at <span className="font-mono text-[#FB7185]">45°</span>, which exceeds glass's critical angle of <span className="font-mono text-[#A78BFA]">41.8°</span>.
          </p>
          <div className="bg-[#17263B] p-3 rounded-lg border border-[#26364D] space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#34D399]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>100% reflectance without metal silver oxidation or tarnishing over decades.</span>
            </div>
            <div className="flex items-center gap-2 text-[#34D399]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Erects inverted astronomical images inside field binoculars.</span>
            </div>
            <div className="flex items-center gap-2 text-[#34D399]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Submarine periscopes use two 45° prisms to bend sightlines by 90° twice without light loss.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
