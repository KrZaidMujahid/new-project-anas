/**
 * EQUATION 1 — Double-Slit Experiment Laboratory
 * Minimalist Studio Split Architecture:
 * - Top Left: Interactive Optical Bench (DoubleSlitCanvas)
 * - Top Right: Essential Parameters Deck (λ, d, a, L)
 * - Middle: High-Precision Mathematical Intensity Graph I(y)
 * - Bottom: KaTeX Formula Card & Law Definitions
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  DoubleSlitParameters,
  DoubleSlitPhysicsResults,
} from '../../physics/doubleslit/types';
import {
  DEFAULT_DOUBLE_SLIT_PARAMS,
  computeDoubleSlitPhysics,
  WAVELENGTH_PRESETS,
} from '../../physics/doubleslit/model';
import { DoubleSlitCanvas } from './DoubleSlitCanvas';
import { DoubleSlitIntensityGraph } from './DoubleSlitIntensityGraph';
import { DoubleSlitPresetsModal } from './DoubleSlitPresetsModal';
import { FormulaCard } from '../FormulaCard';
import { Eye, RotateCcw, Sparkles, Sliders } from 'lucide-react';

interface DoubleSlitLaboratoryProps {
  isPresetsOpenExternal?: boolean;
  onClosePresetsExternal?: () => void;
}

export const DoubleSlitLaboratory: React.FC<DoubleSlitLaboratoryProps> = ({
  isPresetsOpenExternal,
  onClosePresetsExternal,
}) => {
  const [params, setParams] = useState<DoubleSlitParameters>(DEFAULT_DOUBLE_SLIT_PARAMS);
  const [isPresetsModalOpen, setIsPresetsModalOpen] = useState(false);

  // Sync external preset opening from header
  const isPresetsOpen = isPresetsOpenExternal !== undefined ? isPresetsOpenExternal : isPresetsModalOpen;
  const handleClosePresets = () => {
    setIsPresetsModalOpen(false);
    if (onClosePresetsExternal) onClosePresetsExternal();
  };

  // Compute live physics results
  const results: DoubleSlitPhysicsResults = useMemo(
    () => computeDoubleSlitPhysics(params),
    [params]
  );

  const handleParamChange = useCallback(
    <K extends keyof DoubleSlitParameters>(key: K, value: DoubleSlitParameters[K]) => {
      setParams((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const handleResetDefaults = useCallback(() => {
    setParams(DEFAULT_DOUBLE_SLIT_PARAMS);
  }, []);

  const handleSetDetectorY = useCallback((yMm: number) => {
    setParams((prev) => ({
      ...prev,
      detectorYMm: yMm,
    }));
  }, []);

  return (
    <div className="space-y-6 text-[#F8FAFC]">
      {/* 1. Module Header */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#38BDF8] uppercase tracking-wider font-semibold">
            <Eye className="w-4 h-4" />
            <span>Optics &amp; Wave Interference</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#F8FAFC] tracking-tight mt-1">
            Double-Slit Experiment Laboratory
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
            Young&apos;s experiment demonstrating wave interference, diffraction envelope modulation, and fringe formation.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setIsPresetsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#050508] hover:bg-[#121722] border border-[#1E293B] hover:border-[#38BDF8]/50 text-xs font-medium text-[#38BDF8] transition-colors cursor-pointer min-h-[36px]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Presets</span>
          </button>
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#050508] hover:bg-[#121722] border border-[#1E293B] text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer min-h-[36px]"
            title="Reset parameters to standard defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 2. Studio Split Layout: Simulation (Left) + Parameters (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Simulation Canvas (Hero, 8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-3 min-w-0">
          <DoubleSlitCanvas
            params={params}
            results={results}
            onParamChange={handleParamChange}
            onSetDetectorY={handleSetDetectorY}
          />
        </div>

        {/* Right: Essential Parameters (4 cols on desktop) */}
        <div className="lg:col-span-4 bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 space-y-4 shadow-sm min-w-0">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#38BDF8] font-bold">
              <Sliders className="w-4 h-4" />
              <span>Core Parameters</span>
            </div>
            <button
              onClick={handleResetDefaults}
              className="text-[11px] font-mono text-[#64748B] hover:text-[#38BDF8] transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Quick Laser Color Presets */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8]">
              Laser Preset
            </label>
            <div className="grid grid-cols-5 gap-1">
              {WAVELENGTH_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleParamChange('wavelengthNm', preset.wavelengthNm)}
                  className={`px-1.5 py-1 text-[10px] font-mono rounded border transition-colors cursor-pointer truncate ${
                    Math.abs(params.wavelengthNm - preset.wavelengthNm) < 5
                      ? 'border-[#38BDF8] text-[#38BDF8] bg-[#38BDF8]/10 font-bold'
                      : 'border-[#1E293B] text-[#94A3B8] bg-[#050508] hover:text-[#F8FAFC]'
                  }`}
                  title={`${preset.name} (${preset.wavelengthNm} nm)`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Parameter 1: Wavelength λ */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Wavelength (λ)</span>
              <span className="text-[#38BDF8] font-bold">{params.wavelengthNm.toFixed(0)} nm</span>
            </div>
            <input
              type="range"
              min={380}
              max={750}
              step={1}
              value={params.wavelengthNm}
              onChange={(e) => handleParamChange('wavelengthNm', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#38BDF8]"
            />
          </div>

          {/* Parameter 2: Slit Separation d */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Slit Separation (d)</span>
              <span className="text-[#FBBF24] font-bold">{params.slitSeparationMm.toFixed(2)} mm</span>
            </div>
            <input
              type="range"
              min={0.05}
              max={1.00}
              step={0.01}
              value={params.slitSeparationMm}
              onChange={(e) => handleParamChange('slitSeparationMm', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#FBBF24]"
            />
          </div>

          {/* Parameter 3: Slit Width a */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Slit Width (a)</span>
              <span className="text-[#34D399] font-bold">{params.slitWidthMm.toFixed(2)} mm</span>
            </div>
            <input
              type="range"
              min={0.01}
              max={0.20}
              step={0.01}
              value={params.slitWidthMm}
              onChange={(e) => handleParamChange('slitWidthMm', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#34D399]"
            />
          </div>

          {/* Parameter 4: Screen Distance L */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Screen Distance (L)</span>
              <span className="text-[#A78BFA] font-bold">{params.screenDistanceM.toFixed(1)} m</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={5.0}
              step={0.1}
              value={params.screenDistanceM}
              onChange={(e) => handleParamChange('screenDistanceM', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#A78BFA]"
            />
          </div>

          {/* Slit Toggles */}
          <div className="pt-2 border-t border-[#1E293B] grid grid-cols-2 gap-2">
            <button
              onClick={() => handleParamChange('slit1Open', !params.slit1Open)}
              className={`py-1.5 px-2 rounded text-xs font-mono border transition-colors cursor-pointer ${
                params.slit1Open
                  ? 'bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/40 font-semibold'
                  : 'bg-[#050508] text-[#64748B] border-[#1E293B]'
              }`}
            >
              Slit 1: {params.slit1Open ? 'Active' : 'Blocked'}
            </button>
            <button
              onClick={() => handleParamChange('slit2Open', !params.slit2Open)}
              className={`py-1.5 px-2 rounded text-xs font-mono border transition-colors cursor-pointer ${
                params.slit2Open
                  ? 'bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/40 font-semibold'
                  : 'bg-[#050508] text-[#64748B] border-[#1E293B]'
              }`}
            >
              Slit 2: {params.slit2Open ? 'Active' : 'Blocked'}
            </button>
          </div>

          {/* Key Calculated Metric */}
          <div className="p-3 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
            <div className="text-[10px] uppercase tracking-wider text-[#64748B]">
              Calculated Fringe Width (β)
            </div>
            <div className="text-lg font-bold text-[#38BDF8] mt-0.5">
              {results.fringeWidthMm.toFixed(3)} mm
            </div>
          </div>
        </div>
      </div>

      {/* 3. Mathematical Intensity Distribution Graph */}
      <DoubleSlitIntensityGraph
        params={params}
        results={results}
        onSetDetectorY={handleSetDetectorY}
      />

      {/* 4. Minimalist KaTeX Formula Card */}
      <FormulaCard
        title="Young's Double-Slit Equations"
        formula="\beta = \frac{\lambda L}{d}"
        additionalFormula="I(y) = I_0 \cos^2\left(\frac{\pi d y}{\lambda L}\right) \left[\frac{\sin(\frac{\pi a y}{\lambda L})}{\frac{\pi a y}{\lambda L}}\right]^2"
        description="Light from two coherent slits interferes on the observation screen. The fringe separation β is directly proportional to wavelength λ and distance L, and inversely proportional to slit spacing d. The outer envelope is modulated by single-slit diffraction of aperture width a."
        parameters={[
          { symbol: '\\beta', name: 'Fringe Width', unit: 'mm' },
          { symbol: '\\lambda', name: 'Wavelength', unit: 'nm' },
          { symbol: 'd', name: 'Slit Separation', unit: 'mm' },
          { symbol: 'a', name: 'Slit Aperture', unit: 'mm' },
          { symbol: 'L', name: 'Screen Distance', unit: 'm' },
        ]}
      />

      {/* Presets Modal */}
      {isPresetsOpen && (
        <DoubleSlitPresetsModal
          isOpen={isPresetsOpen}
          onClose={handleClosePresets}
          onSelectPreset={(preset) => {
            setParams((prev) => ({
              ...prev,
              ...preset,
            }));
            handleClosePresets();
          }}
        />
      )}
    </div>
  );
};
