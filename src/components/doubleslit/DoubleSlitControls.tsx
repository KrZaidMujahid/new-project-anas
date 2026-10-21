/**
 * EQUATION 1 — Double-Slit Experiment Parameter Controls
 * Part 4: High-Precision Controls A through E with Synchronized Numerical Inputs
 *
 * Implements:
 * - CONTROL A: Light Wavelength (380 to 750 nm, default 550 nm)
 * - CONTROL B: Slit Separation d (0.05 to 1.00 mm, default 0.25 mm)
 * - CONTROL C: Slit Width a (0.01 to 0.20 mm, default 0.05 mm)
 * - CONTROL D: Screen Distance L (0.5 to 5.0 m, default 2.0 m)
 * - CONTROL E: Light Intensity I_0 (0% to 100%, default 70%)
 * - Synchronized sliders & numerical inputs with bounds validation
 * - Spectral color swatch and laser presets
 * - Slit toggles (S1, S2) and mode selector (Single, Double, Multi)
 * - Medium immersion refractive index
 * - Display overlay toggles
 */

import React from 'react';
import {
  DoubleSlitParameters,
  DoubleSlitPhysicsResults,
  OpticalMediumPreset,
  ApparatusSlitMode,
} from '../../physics/doubleslit/types';
import { WAVELENGTH_PRESETS } from '../../physics/doubleslit/model';
import {
  Sliders,
  Layers,
  Sparkles,
  Sun,
  Eye,
  EyeOff,
  RotateCcw,
  CheckCircle2,
  Atom,
} from 'lucide-react';

interface DoubleSlitControlsProps {
  params: DoubleSlitParameters;
  results: DoubleSlitPhysicsResults;
  onParamChange: <K extends keyof DoubleSlitParameters>(
    key: K,
    value: DoubleSlitParameters[K]
  ) => void;
  onResetDefaults: () => void;
}

export const DoubleSlitControls: React.FC<DoubleSlitControlsProps> = ({
  params,
  results,
  onParamChange,
  onResetDefaults,
}) => {
  const handleMediumChange = (preset: OpticalMediumPreset) => {
    let n = 1.0;
    if (preset === 'air') n = 1.0003;
    else if (preset === 'water') n = 1.333;
    else if (preset === 'glass') n = 1.52;
    onParamChange('mediumPreset', preset);
    onParamChange('mediumRefractiveIndex', n);
  };

  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-5 text-[#F1F5F9]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#26364D] pb-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[#38BDF8]">
          <Sliders className="w-4 h-4 text-[#38BDF8]" />
          <span>Experimental Parameter Controls</span>
        </div>
        <button
          onClick={onResetDefaults}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#94A3B8] hover:text-[#F1F5F9] bg-[#17263B] hover:bg-[#26364D] rounded-md transition-colors border border-[#26364D] cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* APPARATUS SLIT MODE & SLIT APERTURES */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider flex items-center justify-between">
          <span>Apparatus Slit Configuration</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onParamChange('slit1Open', !params.slit1Open)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono border cursor-pointer ${
                params.slit1Open ? 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]' : 'bg-red-500/20 text-red-400 border-red-500'
              }`}
            >
              Slit 1: {params.slit1Open ? 'Open ✓' : 'Closed ✗'}
            </button>
            <button
              onClick={() => onParamChange('slit2Open', !params.slit2Open)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono border cursor-pointer ${
                params.slit2Open ? 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]' : 'bg-red-500/20 text-red-400 border-red-500'
              }`}
            >
              Slit 2: {params.slit2Open ? 'Open ✓' : 'Closed ✗'}
            </button>
          </div>
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {(
            [
              { id: 'single', label: 'Single Slit', desc: 'Diffraction' },
              { id: 'double', label: "Double Slit", desc: "Young's (N=2)" },
              { id: 'three', label: '3 Slits', desc: 'N=3' },
              { id: 'five', label: '5 Slits', desc: 'N=5' },
              { id: 'grating', label: 'Grating', desc: 'N=10' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => onParamChange('slitMode', item.id as ApparatusSlitMode)}
              className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                params.slitMode === item.id
                  ? 'bg-[#17263B] border-[#38BDF8] text-[#38BDF8] shadow-md shadow-[#38BDF8]/10'
                  : 'bg-[#0B1728] border-[#26364D] text-[#94A3B8] hover:bg-[#17263B] hover:text-[#F1F5F9]'
              }`}
            >
              <div className="font-bold text-xs">{item.label}</div>
              <div className="text-[10px] text-slate-400 truncate">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 5 CORE EXPERIMENTAL CONTROLS (A through E) */}
      <div className="space-y-4">
        {/* CONTROL A: LIGHT WAVELENGTH */}
        <div className="bg-[#0B1728] p-4 rounded-lg border border-[#26364D] space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">CONTROL A: Light Wavelength (λ)</span>
              <div
                className="w-4 h-4 rounded-full border border-white/20 shadow-xs"
                style={{ backgroundColor: params.isWhiteLight ? '#FFFFFF' : results.rgbColor }}
              />
              <span className="text-[11px] text-[#94A3B8] font-mono">
                {params.isWhiteLight ? 'Polychromatic Spectrum' : `${params.wavelengthNm.toFixed(0)} nm`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-[11px] text-slate-400">Value (nm):</label>
              <input
                type="number"
                min="380"
                max="750"
                step="1"
                value={Math.round(params.wavelengthNm)}
                disabled={params.isWhiteLight}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) {
                    onParamChange('wavelengthNm', Math.max(380, Math.min(750, val)));
                  }
                }}
                className="w-20 px-2 py-0.5 rounded bg-[#17263B] border border-[#26364D] font-mono text-xs text-right text-white focus:outline-none focus:border-[#38BDF8] disabled:opacity-50"
              />
              <button
                onClick={() => onParamChange('isWhiteLight', !params.isWhiteLight)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                  params.isWhiteLight
                    ? 'bg-white text-black border-white shadow-xs'
                    : 'bg-[#17263B] text-slate-300 border-[#26364D] hover:text-white'
                }`}
              >
                {params.isWhiteLight ? '✓ White Light' : 'White Light'}
              </button>
            </div>
          </div>

          {!params.isWhiteLight && (
            <div className="space-y-1">
              <input
                type="range"
                min="380"
                max="750"
                step="1"
                value={params.wavelengthNm}
                onChange={(e) => onParamChange('wavelengthNm', parseFloat(e.target.value))}
                className="w-full accent-[#38BDF8] cursor-pointer"
              />
              {/* Spectral gradient bar */}
              <div
                className="h-2 rounded-full w-full opacity-80"
                style={{
                  background:
                    'linear-gradient(to right, #8B5CF6 0%, #3B82F6 18%, #06B6D4 28%, #22C55E 42%, #EAB308 58%, #F97316 68%, #EF4444 85%, #B91C1C 100%)',
                }}
              />
            </div>
          )}

          {/* Quick Laser Presets */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mr-1">Presets:</span>
            {WAVELENGTH_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  onParamChange('isWhiteLight', false);
                  onParamChange('wavelengthNm', preset.wavelengthNm);
                }}
                className={`px-2 py-1 rounded text-[10px] font-mono border transition-all cursor-pointer flex items-center gap-1 ${
                  !params.isWhiteLight && Math.abs(params.wavelengthNm - preset.wavelengthNm) < 1
                    ? 'bg-[#17263B] border-white/60 text-white shadow-xs font-bold'
                    : 'bg-[#0B1728] border-[#26364D] text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: preset.colorName }}
                />
                <span>{preset.wavelengthNm} nm</span>
              </button>
            ))}
          </div>
        </div>

        {/* CONTROLS B, C, D (Geometry: d, a, L) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0B1728] p-4 rounded-lg border border-[#26364D]">
          {/* CONTROL B: SLIT SEPARATION */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#FBBF24]">CONTROL B: Slit Separation (d)</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0.05"
                  max="1.00"
                  step="0.01"
                  value={params.slitSeparationMm}
                  disabled={params.slitMode === 'single'}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) {
                      onParamChange('slitSeparationMm', Math.max(0.05, Math.min(1.0, val)));
                    }
                  }}
                  className="w-16 px-1.5 py-0.5 rounded bg-[#17263B] border border-[#26364D] font-mono text-xs text-right text-[#FBBF24] focus:outline-none focus:border-[#FBBF24]"
                />
                <span className="text-[10px] text-slate-400 font-mono">mm</span>
              </div>
            </div>
            <input
              type="range"
              min="0.05"
              max="1.00"
              step="0.01"
              value={params.slitSeparationMm}
              disabled={params.slitMode === 'single'}
              onChange={(e) => onParamChange('slitSeparationMm', parseFloat(e.target.value))}
              className="w-full accent-[#FBBF24] cursor-pointer disabled:opacity-40"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.05 mm (50 μm)</span>
              <span>{(params.slitSeparationMm * 1e-3).toExponential(2)} m</span>
              <span>1.00 mm</span>
            </div>
          </div>

          {/* CONTROL C: SLIT WIDTH */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#34D399]">CONTROL C: Slit Width (a)</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0.01"
                  max="0.20"
                  step="0.005"
                  value={params.slitWidthMm}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) {
                      onParamChange('slitWidthMm', Math.max(0.01, Math.min(0.2, val)));
                    }
                  }}
                  className="w-16 px-1.5 py-0.5 rounded bg-[#17263B] border border-[#26364D] font-mono text-xs text-right text-[#34D399] focus:outline-none focus:border-[#34D399]"
                />
                <span className="text-[10px] text-slate-400 font-mono">mm</span>
              </div>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.20"
              step="0.005"
              value={params.slitWidthMm}
              onChange={(e) => onParamChange('slitWidthMm', parseFloat(e.target.value))}
              className="w-full accent-[#34D399] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.01 mm (10 μm)</span>
              <span>{(params.slitWidthMm * 1e-3).toExponential(2)} m</span>
              <span>0.20 mm</span>
            </div>
          </div>

          {/* CONTROL D: SCREEN DISTANCE */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#38BDF8]">CONTROL D: Screen Distance (L)</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0.5"
                  max="5.0"
                  step="0.1"
                  value={params.screenDistanceM}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) {
                      onParamChange('screenDistanceM', Math.max(0.5, Math.min(5.0, val)));
                    }
                  }}
                  className="w-16 px-1.5 py-0.5 rounded bg-[#17263B] border border-[#26364D] font-mono text-xs text-right text-[#38BDF8] focus:outline-none focus:border-[#38BDF8]"
                />
                <span className="text-[10px] text-slate-400 font-mono">m</span>
              </div>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.1"
              value={params.screenDistanceM}
              onChange={(e) => onParamChange('screenDistanceM', parseFloat(e.target.value))}
              className="w-full accent-[#38BDF8] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.5 m</span>
              <span>{params.screenDistanceM.toFixed(1)} m ({Math.round(params.screenDistanceM * 100)} cm)</span>
              <span>5.0 m</span>
            </div>
          </div>
        </div>

        {/* CONTROL E: LIGHT INTENSITY */}
        <div className="bg-[#0B1728] p-4 rounded-lg border border-[#26364D] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-[#FBBF24]" />
              <span className="font-semibold text-white">CONTROL E: Light Intensity (I₀)</span>
              <span className="text-[11px] text-[#94A3B8] font-mono">
                (Scales pattern brightness without shifting fringe positions)
              </span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max="100"
                step="5"
                value={params.intensityPercent ?? 70}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) {
                    onParamChange('intensityPercent', Math.max(0, Math.min(100, val)));
                  }
                }}
                className="w-16 px-1.5 py-0.5 rounded bg-[#17263B] border border-[#26364D] font-mono text-xs text-right text-white focus:outline-none focus:border-white"
              />
              <span className="text-[10px] text-slate-400 font-mono">%</span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={params.intensityPercent ?? 70}
            onChange={(e) => onParamChange('intensityPercent', parseInt(e.target.value))}
            className="w-full accent-white cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0% (Off)</span>
            <span>Current: {params.intensityPercent ?? 70}%</span>
            <span>100% (Max Brightness)</span>
          </div>
        </div>
      </div>

      {/* SURROUNDING MEDIUM IMMERSION */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider flex items-center justify-between">
          <span>Surrounding Medium Immersion (Refractive Index n)</span>
          <span className="font-mono text-[#A78BFA]">
            n = {params.mediumRefractiveIndex.toFixed(4)} | λ' = {(params.wavelengthNm / params.mediumRefractiveIndex).toFixed(1)} nm
          </span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(
            [
              { id: 'vacuum', label: 'Vacuum', n: 1.0, sub: 'n = 1.000' },
              { id: 'air', label: 'Air (STP)', n: 1.0003, sub: 'n = 1.0003' },
              { id: 'water', label: 'Water', n: 1.333, sub: 'β shrinks 25%' },
              { id: 'glass', label: 'Dense Glass', n: 1.52, sub: 'β shrinks 34%' },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              onClick={() => handleMediumChange(m.id as OpticalMediumPreset)}
              className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                params.mediumPreset === m.id
                  ? 'bg-[#17263B] border-[#A78BFA] text-[#A78BFA] shadow-xs'
                  : 'bg-[#0B1728] border-[#26364D] text-[#94A3B8] hover:bg-[#17263B] hover:text-[#F1F5F9]'
              }`}
            >
              <div className="font-bold text-xs">{m.label}</div>
              <div className="text-[10px] text-slate-400 font-mono">{m.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* DISPLAY OVERLAYS & TOGGLES */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>Apparatus &amp; Screen Display Overlays</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <label className="flex items-center gap-2 p-2 rounded bg-[#0B1728] border border-[#26364D] cursor-pointer hover:bg-[#17263B]">
            <input
              type="checkbox"
              checked={params.showWaveField}
              onChange={(e) => onParamChange('showWaveField', e.target.checked)}
              className="accent-[#38BDF8] rounded"
            />
            <span className="text-slate-300">2D Wavefield</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded bg-[#0B1728] border border-[#26364D] cursor-pointer hover:bg-[#17263B]">
            <input
              type="checkbox"
              checked={params.showRays}
              onChange={(e) => onParamChange('showRays', e.target.checked)}
              className="accent-[#38BDF8] rounded"
            />
            <span className="text-slate-300">Geometric Rays</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded bg-[#0B1728] border border-[#26364D] cursor-pointer hover:bg-[#17263B]">
            <input
              type="checkbox"
              checked={params.showEnvelope}
              onChange={(e) => onParamChange('showEnvelope', e.target.checked)}
              className="accent-[#38BDF8] rounded"
            />
            <span className="text-slate-300">Diffraction Envelope</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded bg-[#0B1728] border border-[#26364D] cursor-pointer hover:bg-[#17263B]">
            <input
              type="checkbox"
              checked={params.showFringeLabels}
              onChange={(e) => onParamChange('showFringeLabels', e.target.checked)}
              className="accent-[#38BDF8] rounded"
            />
            <span className="text-slate-300">Show Fringe Labels</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded bg-[#0B1728] border border-[#26364D] cursor-pointer hover:bg-[#17263B]">
            <input
              type="checkbox"
              checked={params.showIntensityScale}
              onChange={(e) => onParamChange('showIntensityScale', e.target.checked)}
              className="accent-[#38BDF8] rounded"
            />
            <span className="text-slate-300">Show Intensity Scale</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded bg-[#0B1728] border border-[#26364D] cursor-pointer hover:bg-[#17263B]">
            <input
              type="checkbox"
              checked={params.showFringes}
              onChange={(e) => onParamChange('showFringes', e.target.checked)}
              className="accent-[#38BDF8] rounded"
            />
            <span className="text-slate-300">Screen Strip</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded bg-[#0B1728] border border-[#26364D] cursor-pointer hover:bg-[#17263B]">
            <input
              type="checkbox"
              checked={params.showGrid}
              onChange={(e) => onParamChange('showGrid', e.target.checked)}
              className="accent-[#38BDF8] rounded"
            />
            <span className="text-slate-300">Screen Ruler Grid</span>
          </label>

          <div className="flex items-center gap-2 p-1.5 rounded bg-[#0B1728] border border-[#26364D]">
            <span className="text-[10px] text-slate-400">Coherence:</span>
            <select
              value={params.coherence}
              onChange={(e) => onParamChange('coherence', e.target.value as any)}
              className="bg-transparent text-[11px] text-[#38BDF8] font-bold focus:outline-none cursor-pointer"
            >
              <option value="coherent" className="bg-[#101D30]">Coherent</option>
              <option value="partially_coherent" className="bg-[#101D30]">Partial (V=0.5)</option>
              <option value="incoherent" className="bg-[#101D30]">Incoherent</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
