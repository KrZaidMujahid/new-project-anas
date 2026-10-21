/**
 * EQUATION 1 — Lorentz Force Laboratory Controls
 * High-contrast dark theme scientific control panel with particle selectors,
 * field strength sliders, orientation toggles, and 8 experiment presets.
 */

import React from 'react';
import {
  Sliders,
  Zap,
  Compass,
  RotateCcw,
  Sparkles,
  ArrowRight,
  CircleDot,
  Radio,
} from 'lucide-react';
import {
  LorentzParameters,
  LorentzPreset,
} from '../../physics/lorentz/types';
import {
  LORENTZ_PRESETS,
  ELEMENTARY_CHARGE,
  PROTON_MASS,
  ELECTRON_MASS,
  ALPHA_MASS,
} from '../../physics/lorentz/model';

interface LorentzControlsProps {
  params: LorentzParameters;
  onUpdateParams: (updater: (prev: LorentzParameters) => LorentzParameters) => void;
  onApplyPreset: (preset: LorentzPreset) => void;
  onResetDefaults: () => void;
}

export const LorentzControls: React.FC<LorentzControlsProps> = ({
  params,
  onUpdateParams,
  onApplyPreset,
  onResetDefaults,
}) => {
  // Preset particle selector helper
  const handleSelectParticleType = (type: 'proton' | 'electron' | 'alpha' | 'positron') => {
    if (type === 'proton') {
      onUpdateParams((p) => ({
        ...p,
        charge: ELEMENTARY_CHARGE,
        chargeNumber: 1,
        mass: PROTON_MASS,
      }));
    } else if (type === 'electron') {
      onUpdateParams((p) => ({
        ...p,
        charge: -ELEMENTARY_CHARGE,
        chargeNumber: -1,
        mass: PROTON_MASS, // normalized mass for visible comparative curvature on same canvas
      }));
    } else if (type === 'alpha') {
      onUpdateParams((p) => ({
        ...p,
        charge: 2 * ELEMENTARY_CHARGE,
        chargeNumber: 2,
        mass: ALPHA_MASS,
      }));
    } else if (type === 'positron') {
      onUpdateParams((p) => ({
        ...p,
        charge: ELEMENTARY_CHARGE,
        chargeNumber: 1,
        mass: PROTON_MASS,
      }));
    }
  };

  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-5 text-[#F1F5F9]">
      {/* Header with Title and Reset */}
      <div className="flex items-center justify-between border-b border-[#26364D] pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#38BDF8]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9]">
            Experimental Parameters
          </h2>
        </div>
        <button
          onClick={onResetDefaults}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#94A3B8] hover:text-[#F1F5F9] bg-[#17263B] hover:bg-[#1E334D] border border-[#26364D] rounded-lg transition-colors cursor-pointer"
          title="Reset to default proton in 0.5 T field"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Particle Type Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider flex items-center justify-between">
          <span>Charged Particle Species</span>
          <span className="font-mono text-[11px] text-[#38BDF8]">
            q = {params.chargeNumber > 0 ? `+${params.chargeNumber}e` : `${params.chargeNumber}e`}
          </span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleSelectParticleType('proton')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer text-center ${
              params.chargeNumber === 1
                ? 'bg-[#FBBF24]/20 border-[#FBBF24] text-[#FBBF24]'
                : 'bg-[#17263B] border-[#26364D] text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            <div>Proton (p⁺)</div>
            <div className="text-[10px] font-mono opacity-80 mt-0.5">q = +1e, m = 1 u</div>
          </button>

          <button
            onClick={() => handleSelectParticleType('electron')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer text-center ${
              params.chargeNumber === -1
                ? 'bg-[#38BDF8]/20 border-[#38BDF8] text-[#38BDF8]'
                : 'bg-[#17263B] border-[#26364D] text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            <div>Electron (e⁻)</div>
            <div className="text-[10px] font-mono opacity-80 mt-0.5">q = -1e</div>
          </button>

          <button
            onClick={() => handleSelectParticleType('alpha')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer text-center ${
              params.chargeNumber === 2
                ? 'bg-[#34D399]/20 border-[#34D399] text-[#34D399]'
                : 'bg-[#17263B] border-[#26364D] text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            <div>Alpha (α²⁺)</div>
            <div className="text-[10px] font-mono opacity-80 mt-0.5">q = +2e, m = 4 u</div>
          </button>
        </div>
      </div>

      {/* 2. Initial Speed v & Launch Angle */}
      <div className="space-y-3 bg-[#17263B] p-3.5 rounded-lg border border-[#26364D]">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#F1F5F9] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#34D399]"></span>
            Initial Speed (|v|)
          </span>
          <span className="font-mono font-bold text-[#34D399]">
            {(params.speed / 1e6).toFixed(2)} × 10⁶ m/s
          </span>
        </div>
        <input
          type="range"
          min="0.5"
          max="4.0"
          step="0.1"
          value={params.speed / 1e6}
          onChange={(e) => {
            const val = parseFloat(e.target.value) * 1e6;
            onUpdateParams((p) => ({ ...p, speed: val }));
          }}
          className="w-full h-1.5 bg-[#0B1728] rounded-lg appearance-none cursor-pointer accent-[#34D399]"
        />

        {/* Pitch Angle Theta with Magnetic Field */}
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="font-semibold text-[#F1F5F9]">
            Angle θ with B-Field (Pitch)
          </span>
          <span className="font-mono font-bold text-[#38BDF8]">
            {params.angleThetaDeg}° {params.angleThetaDeg === 90 ? '(v ⊥ B)' : params.angleThetaDeg === 0 ? '(v ∥ B)' : '(Helical)'}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="180"
          step="5"
          value={params.angleThetaDeg}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            onUpdateParams((p) => ({
              ...p,
              angleThetaDeg: val,
              mode: val === 90 ? 'perpendicular' : val === 0 || val === 180 ? 'parallel' : 'helical',
            }));
          }}
          className="w-full h-1.5 bg-[#0B1728] rounded-lg appearance-none cursor-pointer accent-[#38BDF8]"
        />
        <div className="flex justify-between text-[10px] font-mono text-[#94A3B8]">
          <span>0° (Parallel)</span>
          <span>45° (Spiral)</span>
          <span>90° (Circular)</span>
          <span>180°</span>
        </div>
      </div>

      {/* 3. Magnetic Field (B) Controls */}
      <div className="space-y-3 bg-[#17263B] p-3.5 rounded-lg border border-[#26364D]">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#F1F5F9] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8]"></span>
            Magnetic Field Strength (B)
          </span>
          <span className="font-mono font-bold text-[#38BDF8]">
            {params.bFieldStrength.toFixed(2)} Tesla (T)
          </span>
        </div>
        <input
          type="range"
          min="0.0"
          max="2.0"
          step="0.05"
          value={params.bFieldStrength}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            onUpdateParams((p) => ({ ...p, bFieldStrength: val }));
          }}
          className="w-full h-1.5 bg-[#0B1728] rounded-lg appearance-none cursor-pointer accent-[#38BDF8]"
        />

        {/* B-Field Direction Selector */}
        <div className="pt-1">
          <div className="text-[11px] font-semibold text-[#94A3B8] mb-1.5">
            Magnetic Field Direction
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onUpdateParams((p) => ({ ...p, bFieldDirection: 'out-of-screen' }))}
              className={`flex items-center justify-center gap-2 py-1.5 px-2 rounded-md text-xs font-semibold transition-colors border cursor-pointer ${
                params.bFieldDirection === 'out-of-screen'
                  ? 'bg-[#38BDF8]/20 border-[#38BDF8] text-[#38BDF8]'
                  : 'bg-[#101D30] border-[#26364D] text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              <CircleDot className="w-3.5 h-3.5" />
              <span>⊙ Out of Screen (+z)</span>
            </button>

            <button
              onClick={() => onUpdateParams((p) => ({ ...p, bFieldDirection: 'into-screen' }))}
              className={`flex items-center justify-center gap-2 py-1.5 px-2 rounded-md text-xs font-semibold transition-colors border cursor-pointer ${
                params.bFieldDirection === 'into-screen'
                  ? 'bg-[#38BDF8]/20 border-[#38BDF8] text-[#38BDF8]'
                  : 'bg-[#101D30] border-[#26364D] text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              <span className="font-mono font-bold text-sm leading-none">⊗</span>
              <span>⊗ Into Screen (-z)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Electric Field (E) Controls */}
      <div className="space-y-3 bg-[#17263B] p-3.5 rounded-lg border border-[#26364D]">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[#F1F5F9] flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={params.electricFieldEnabled}
              onChange={(e) => onUpdateParams((p) => ({ ...p, electricFieldEnabled: e.target.checked }))}
              className="rounded bg-[#0B1728] border-[#26364D] text-[#A78BFA] focus:ring-0 w-3.5 h-3.5 cursor-pointer"
            />
            <span className="w-2 h-2 rounded-full bg-[#A78BFA]"></span>
            Enable Electric Field (E)
          </label>
          <span className="font-mono text-xs font-bold text-[#A78BFA]">
            {params.electricFieldEnabled ? `${(params.eFieldStrength / 1e5).toFixed(1)} × 10⁵ N/C` : 'Disabled'}
          </span>
        </div>

        {params.electricFieldEnabled && (
          <div className="space-y-2.5 pt-1">
            <input
              type="range"
              min="0.5"
              max="20.0"
              step="0.5"
              value={params.eFieldStrength / 1e5}
              onChange={(e) => {
                const val = parseFloat(e.target.value) * 1e5;
                onUpdateParams((p) => ({ ...p, eFieldStrength: val }));
              }}
              className="w-full h-1.5 bg-[#0B1728] rounded-lg appearance-none cursor-pointer accent-[#A78BFA]"
            />

            {/* E-Field Direction */}
            <div>
              <div className="text-[11px] font-semibold text-[#94A3B8] mb-1.5">
                Electric Field Vector Direction
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {(['up', 'down', 'left', 'right'] as const).map((dir) => (
                  <button
                    key={dir}
                    onClick={() => onUpdateParams((p) => ({ ...p, eFieldDirection: dir }))}
                    className={`py-1 px-1.5 text-center rounded text-[11px] font-semibold uppercase border transition-colors cursor-pointer ${
                      params.eFieldDirection === dir
                        ? 'bg-[#A78BFA]/20 border-[#A78BFA] text-[#A78BFA]'
                        : 'bg-[#101D30] border-[#26364D] text-[#94A3B8] hover:text-[#F1F5F9]'
                    }`}
                  >
                    {dir}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Quick Experiment Presets (Part 11) */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
          <span>Curated Experiment Presets</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {LORENTZ_PRESETS.map((pst) => (
            <button
              key={pst.id}
              onClick={() => onApplyPreset(pst)}
              className="p-2.5 rounded-lg bg-[#17263B] hover:bg-[#1E334D] border border-[#26364D] hover:border-[#38BDF8]/50 text-left transition-all cursor-pointer group shadow-xs"
            >
              <div className="flex items-center justify-between text-xs font-bold text-[#F1F5F9] group-hover:text-[#38BDF8]">
                <span>{pst.name}</span>
                <ArrowRight className="w-3 h-3 text-[#94A3B8] group-hover:text-[#38BDF8] transition-transform group-hover:translate-x-0.5" />
              </div>
              <div className="text-[10px] text-[#38BDF8] font-mono mt-0.5">
                {pst.tagline}
              </div>
              <div className="text-[10px] text-[#94A3B8] line-clamp-1 mt-1">
                {pst.description}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
