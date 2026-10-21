/**
 * EQUATION 1 — Optics Laboratory Parameter Controls
 * High precision controls for angles, refractive indices, media selection,
 * wavelength dispersion, and optical geometries.
 */

import React from 'react';
import {
  Sliders,
  Layers,
  Sun,
  Eye,
  RotateCcw,
  Sparkles,
  ArrowRightLeft,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import {
  SnellParameters,
  OpticalGeometry,
} from '../../physics/optics/types';
import {
  OPTICAL_MEDIA_DATABASE,
  wavelengthToHexColor,
} from '../../physics/optics/opticsModel';

interface OpticsControlsProps {
  params: SnellParameters;
  onParamChange: <K extends keyof SnellParameters>(key: K, value: SnellParameters[K]) => void;
  onReset: () => void;
}

export const OpticsControls: React.FC<OpticsControlsProps> = ({
  params,
  onParamChange,
  onReset,
}) => {
  const geometries: { id: OpticalGeometry; label: string; desc: string }[] = [
    { id: 'planar', label: 'Planar Boundary', desc: 'Dual-media interface with refraction & reflection' },
    { id: 'slab', label: 'Parallel Slab', desc: 'Lateral shift through rectangular glass block' },
    { id: 'prism', label: 'Triangular Prism', desc: 'Dispersion, rainbow spectrum & minimum deviation' },
    { id: 'semicircle', label: 'Semicircular Block', desc: 'Radial normal entry for critical angle & TIR bench' },
    { id: 'fiber', label: 'Optical Fiber', desc: 'Core & cladding total internal reflection waveguide' },
  ];

  const currentWavelengthHex = wavelengthToHexColor(params.wavelengthNm);

  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-6 text-[#F1F5F9]">
      {/* 1. Header with Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-[#26364D]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-wide uppercase text-[#F1F5F9]">
              Optical Controls
            </h2>
            <p className="text-[11px] text-[#94A3B8]">
              Configure medium properties, incidence angle, and wavelengths
            </p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#17263B] hover:bg-[#26364D] text-[#94A3B8] hover:text-[#F1F5F9] text-xs font-semibold border border-[#26364D] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* 2. Optical Geometry Mode Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>Experimental Apparatus Geometry</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {geometries.map((geo) => {
            const isSelected = params.geometry === geo.id;
            return (
              <button
                key={geo.id}
                onClick={() => onParamChange('geometry', geo.id)}
                className={`p-2.5 rounded-lg text-left transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-[#17263B] border-[#38BDF8] text-[#F1F5F9] shadow-sm'
                    : 'bg-[#0B1728] border-[#26364D] text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#17263B]/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${isSelected ? 'text-[#38BDF8]' : ''}`}>
                    {geo.label}
                  </span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8]" />}
                </div>
                <p className="text-[10px] text-[#94A3B8] leading-tight line-clamp-2">
                  {geo.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Angle of Incidence Slider */}
      <div className="bg-[#17263B] rounded-lg p-4 border border-[#26364D] space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[#FBBF24] flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-[#FBBF24]" />
            <span>Angle of Incidence (θ₁)</span>
          </label>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min="0"
              max="89.9"
              step="0.5"
              value={params.angleDeg}
              onChange={(e) => onParamChange('angleDeg', parseFloat(e.target.value) || 0)}
              className="w-16 px-2 py-0.5 rounded bg-[#0A1526] border border-[#26364D] text-xs font-mono font-bold text-[#FBBF24] text-right focus:outline-none focus:border-[#FBBF24]"
            />
            <span className="text-xs font-mono text-[#94A3B8]">deg (°)</span>
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="89.5"
          step="0.1"
          value={params.angleDeg}
          onChange={(e) => onParamChange('angleDeg', parseFloat(e.target.value))}
          className="w-full h-2 bg-[#0A1526] rounded-lg appearance-none cursor-pointer accent-[#FBBF24]"
        />

        <div className="flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
          <span>0.0° (Normal Incidence)</span>
          <span>45.0°</span>
          <span>89.5° (Grazing Incidence)</span>
        </div>
      </div>

      {/* 4. Medium 1 & Medium 2 Selectors (Dual Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* MEDIUM 1 (Incident Medium) */}
        <div className="bg-[#17263B] rounded-lg p-4 border border-[#26364D] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#38BDF8] uppercase tracking-wider">
              MEDIUM 1 (Upper / Incident)
            </span>
            <span className="text-[11px] font-mono text-[#94A3B8]">
              {params.medium1Id === 'custom'
                ? `n₁ = ${params.medium1CustomN.toFixed(3)}`
                : `n₁ = ${OPTICAL_MEDIA_DATABASE.find((m) => m.id === params.medium1Id)?.refractiveIndex.toFixed(3)}`}
            </span>
          </div>

          <select
            value={params.medium1Id}
            onChange={(e) => onParamChange('medium1Id', e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#0A1526] border border-[#26364D] text-xs font-semibold text-[#F1F5F9] focus:outline-none focus:border-[#38BDF8] cursor-pointer"
          >
            {OPTICAL_MEDIA_DATABASE.map((m) => (
              <option key={`med1-${m.id}`} value={m.id}>
                {m.name} (n = {m.refractiveIndex.toFixed(3)})
              </option>
            ))}
          </select>

          {params.medium1Id === 'custom' && (
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-[#94A3B8]">Custom Refractive Index:</span>
                <span className="text-[#38BDF8] font-bold">{params.medium1CustomN.toFixed(3)}</span>
              </div>
              <input
                type="range"
                min="1.000"
                max="4.000"
                step="0.005"
                value={params.medium1CustomN}
                onChange={(e) => onParamChange('medium1CustomN', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#0A1526] rounded appearance-none cursor-pointer accent-[#38BDF8]"
              />
            </div>
          )}

          {/* Quick preset buttons for medium 1 */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {['air', 'water', 'crown_glass', 'diamond'].map((presetId) => {
              const med = OPTICAL_MEDIA_DATABASE.find((m) => m.id === presetId);
              if (!med) return null;
              return (
                <button
                  key={`p1-${presetId}`}
                  onClick={() => onParamChange('medium1Id', presetId)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer border ${
                    params.medium1Id === presetId
                      ? 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]'
                      : 'bg-[#0A1526] text-[#94A3B8] border-[#26364D] hover:text-[#F1F5F9]'
                  }`}
                >
                  {med.formulaSymbol}
                </button>
              );
            })}
          </div>
        </div>

        {/* MEDIUM 2 (Refracting Medium) */}
        <div className="bg-[#17263B] rounded-lg p-4 border border-[#26364D] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#34D399] uppercase tracking-wider">
              MEDIUM 2 (Lower / Refracting)
            </span>
            <span className="text-[11px] font-mono text-[#94A3B8]">
              {params.medium2Id === 'custom'
                ? `n₂ = ${params.medium2CustomN.toFixed(3)}`
                : `n₂ = ${OPTICAL_MEDIA_DATABASE.find((m) => m.id === params.medium2Id)?.refractiveIndex.toFixed(3)}`}
            </span>
          </div>

          <select
            value={params.medium2Id}
            onChange={(e) => onParamChange('medium2Id', e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#0A1526] border border-[#26364D] text-xs font-semibold text-[#F1F5F9] focus:outline-none focus:border-[#34D399] cursor-pointer"
          >
            {OPTICAL_MEDIA_DATABASE.map((m) => (
              <option key={`med2-${m.id}`} value={m.id}>
                {m.name} (n = {m.refractiveIndex.toFixed(3)})
              </option>
            ))}
          </select>

          {params.medium2Id === 'custom' && (
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-[#94A3B8]">Custom Refractive Index:</span>
                <span className="text-[#34D399] font-bold">{params.medium2CustomN.toFixed(3)}</span>
              </div>
              <input
                type="range"
                min="1.000"
                max="4.000"
                step="0.005"
                value={params.medium2CustomN}
                onChange={(e) => onParamChange('medium2CustomN', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#0A1526] rounded appearance-none cursor-pointer accent-[#34D399]"
              />
            </div>
          )}

          {/* Quick preset buttons for medium 2 */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {['air', 'water', 'crown_glass', 'diamond'].map((presetId) => {
              const med = OPTICAL_MEDIA_DATABASE.find((m) => m.id === presetId);
              if (!med) return null;
              return (
                <button
                  key={`p2-${presetId}`}
                  onClick={() => onParamChange('medium2Id', presetId)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer border ${
                    params.medium2Id === presetId
                      ? 'bg-[#34D399]/20 text-[#34D399] border-[#34D399]'
                      : 'bg-[#0A1526] text-[#94A3B8] border-[#26364D] hover:text-[#F1F5F9]'
                  }`}
                >
                  {med.formulaSymbol}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Light Source & Wavelength Dispersion Controls */}
      <div className="bg-[#17263B] rounded-lg p-4 border border-[#26364D] space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[#F1F5F9] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#A78BFA]" />
            <span>Light Source Spectrum (Cauchy Dispersion)</span>
          </label>

          <button
            onClick={() => onParamChange('isWhiteLight', !params.isWhiteLight)}
            className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer border ${
              params.isWhiteLight
                ? 'bg-gradient-to-r from-red-500 via-yellow-400 via-green-400 to-blue-500 text-[#07111F] border-white'
                : 'bg-[#0A1526] text-[#94A3B8] hover:text-[#F1F5F9] border-[#26364D]'
            }`}
          >
            {params.isWhiteLight ? 'Polychromatic (White Light)' : 'Monochromatic'}
          </button>
        </div>

        {!params.isWhiteLight ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#94A3B8]">Wavelength (λ₀):</span>
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full inline-block border border-white/20 shadow-xs"
                  style={{ backgroundColor: currentWavelengthHex }}
                />
                <span className="font-bold text-[#F1F5F9]">{params.wavelengthNm} nm</span>
              </div>
            </div>

            <input
              type="range"
              min="380"
              max="750"
              step="5"
              value={params.wavelengthNm}
              onChange={(e) => onParamChange('wavelengthNm', parseInt(e.target.value) || 589)}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background:
                  'linear-gradient(to right, #8B5CF6, #3B82F6, #06B6D4, #10B981, #FBBF24, #F97316, #EF4444)',
              }}
            />

            <div className="flex justify-between text-[10px] font-mono text-[#94A3B8]">
              <span>Violet (380 nm)</span>
              <span>Sodium D (589 nm)</span>
              <span>Deep Red (750 nm)</span>
            </div>
          </div>
        ) : (
          <div className="p-2.5 rounded bg-[#0A1526] border border-[#26364D] text-xs text-[#94A3B8] leading-relaxed">
            <strong className="text-[#F1F5F9]">White light mode active:</strong> Rays of all visible frequencies
            experience wavelength-dependent index <span className="font-mono text-[#38BDF8]">n(λ) = A + B/λ²</span>.
            Shorter wavelengths (violet) slow down more and refract at sharper angles than red wavelengths!
          </div>
        )}
      </div>

      {/* 6. Geometry-Specific Parameters (Slab thickness, Prism apex, Fiber cladding) */}
      {params.geometry === 'slab' && (
        <div className="bg-[#17263B] rounded-lg p-4 border border-[#26364D] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#38BDF8]">Glass Slab Thickness (t)</span>
            <span className="font-mono font-bold text-[#F1F5F9]">{params.slabThicknessMm} mm</span>
          </div>
          <input
            type="range"
            min="40"
            max="180"
            step="5"
            value={params.slabThicknessMm}
            onChange={(e) => onParamChange('slabThicknessMm', parseInt(e.target.value) || 100)}
            className="w-full h-1.5 bg-[#0A1526] rounded appearance-none cursor-pointer accent-[#38BDF8]"
          />
        </div>
      )}

      {params.geometry === 'prism' && (
        <div className="bg-[#17263B] rounded-lg p-4 border border-[#26364D] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#FBBF24]">Prism Apex Angle (A)</span>
            <span className="font-mono font-bold text-[#F1F5F9]">{params.prismApexAngleDeg}°</span>
          </div>
          <input
            type="range"
            min="30"
            max="75"
            step="1"
            value={params.prismApexAngleDeg}
            onChange={(e) => onParamChange('prismApexAngleDeg', parseInt(e.target.value) || 60)}
            className="w-full h-1.5 bg-[#0A1526] rounded appearance-none cursor-pointer accent-[#FBBF24]"
          />
        </div>
      )}

      {params.geometry === 'fiber' && (
        <div className="bg-[#17263B] rounded-lg p-4 border border-[#26364D] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#A78BFA]">Cladding Refractive Index (n_clad)</span>
            <span className="font-mono font-bold text-[#F1F5F9]">{params.fiberCladdingN.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="1.00"
            max="1.50"
            step="0.01"
            value={params.fiberCladdingN}
            onChange={(e) => onParamChange('fiberCladdingN', parseFloat(e.target.value) || 1.35)}
            className="w-full h-1.5 bg-[#0A1526] rounded appearance-none cursor-pointer accent-[#A78BFA]"
          />
        </div>
      )}

      {/* 7. Display & Visual Toggles */}
      <div className="space-y-2 pt-1">
        <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>Visual Overlays</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { key: 'showNormal' as const, label: 'Normal Line (N)' },
            { key: 'showProtractor' as const, label: 'Protractor' },
            { key: 'showWavefronts' as const, label: 'Wavefronts' },
            { key: 'showIntensityFading' as const, label: 'Fresnel Fading' },
            { key: 'showPhotons' as const, label: 'Photon Pulses' },
            { key: 'showRays' as const, label: 'Light Rays' },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center gap-2 p-2 rounded-lg bg-[#17263B] border border-[#26364D] text-xs cursor-pointer hover:bg-[#26364D]/50 transition-colors"
            >
              <input
                type="checkbox"
                checked={params[item.key] as boolean}
                onChange={(e) => onParamChange(item.key, e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-[#0A1526] border-[#26364D] text-[#38BDF8] focus:ring-0 cursor-pointer"
              />
              <span className="text-[#F1F5F9] font-medium text-[11px]">{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
