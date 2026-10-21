/**
 * EQUATION 1 — Photoelectric Effect Laboratory
 * Minimalist Studio Split Architecture:
 * - Top Left: Vacuum Chamber Apparatus (PhotoelectricApparatusSvg)
 * - Top Right: Essential Parameters Deck (Metal Φ, Frequency f, Intensity, Voltage)
 * - Middle: Mathematical Quantum Graphs (Kmax vs f, I-V Curve)
 * - Bottom: KaTeX Formula Card & Law Definitions
 */

import React, { useState, useMemo, useCallback } from 'react';
import { PhotoelectricParameters } from '../../physics/photoelectric/types';
import { computePhotoelectricCalculations } from '../../physics/photoelectric/model';
import { PhotoelectricApparatusSvg } from './PhotoelectricApparatusSvg';
import { PhotoelectricControls } from './PhotoelectricControls';
import { PhotoelectricGraphs } from './PhotoelectricGraphs';
import { PhotoelectricPresetsModal } from './PhotoelectricPresetsModal';
import { FormulaCard } from '../FormulaCard';
import { Atom, RotateCcw, Sparkles } from 'lucide-react';

interface PhotoelectricLaboratoryProps {
  onBackToPhysics?: () => void;
  isPresetsOpenExternal?: boolean;
  onClosePresetsExternal?: () => void;
}

const DEFAULT_PARAMETERS: PhotoelectricParameters = {
  frequencyHz: 8.0e14,
  intensityPercent: 50,
  selectedMetalId: 'cesium',
  appliedVoltage: 0.0,
  showElectricField: true,
  showTrajectories: true,
  isPaused: false,
  animationSpeed: 1.0,
};

export const PhotoelectricLaboratory: React.FC<PhotoelectricLaboratoryProps> = ({
  isPresetsOpenExternal,
  onClosePresetsExternal,
}) => {
  const [params, setParams] = useState<PhotoelectricParameters>(DEFAULT_PARAMETERS);
  const [isLocalPresetsOpen, setIsLocalPresetsOpen] = useState<boolean>(false);

  const isPresetsOpen = isPresetsOpenExternal ?? isLocalPresetsOpen;
  const handleClosePresets = onClosePresetsExternal ?? (() => setIsLocalPresetsOpen(false));

  const calc = useMemo(() => computePhotoelectricCalculations(params), [params]);

  const handleUpdateParams = useCallback(
    (updater: (prev: PhotoelectricParameters) => PhotoelectricParameters) => {
      setParams((prev) => updater(prev));
    },
    []
  );

  const handleResetDefaults = useCallback(() => {
    setParams(DEFAULT_PARAMETERS);
  }, []);

  return (
    <div className="space-y-6 text-[#F8FAFC]">
      {/* 1. Module Header */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#38BDF8] uppercase tracking-wider font-semibold">
            <Atom className="w-4 h-4" />
            <span>Quantum Physics</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#F8FAFC] tracking-tight mt-1">
            Photoelectric Effect Laboratory
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
            Einstein&apos;s photon model, work function, threshold frequency, and stopping potential.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setIsLocalPresetsOpen(true)}
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

      {/* 2. Studio Split Layout: Simulation Canvas (Left) + Parameters (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Simulation Canvas (Hero, 7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-3 min-w-0">
          <PhotoelectricApparatusSvg
            params={params}
            calc={calc}
            onUpdateParams={handleUpdateParams}
            onResetAnimation={() => {}}
          />
        </div>

        {/* Right: Essential Parameters (5 cols on desktop) */}
        <div className="lg:col-span-5 bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 shadow-sm min-w-0">
          <PhotoelectricControls
            params={params}
            calc={calc}
            onUpdateParams={handleUpdateParams}
            onResetDefaults={handleResetDefaults}
          />
        </div>
      </div>

      {/* 3. Mathematical Graphs: Kmax vs Frequency & I-V Response */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
        <PhotoelectricGraphs
          params={params}
          calc={calc}
          onSetFrequency={(f) => setParams((p) => ({ ...p, frequencyHz: f }))}
          onSetVoltage={(v) => setParams((p) => ({ ...p, appliedVoltage: v }))}
        />
      </div>

      {/* 4. Minimalist KaTeX Formula Card */}
      <FormulaCard
        title="Einstein's Photoelectric Equation"
        formula="K_{\text{max}} = hf - \Phi = h(f - f_0)"
        additionalFormula="e V_{\text{stop}} = K_{\text{max}} \quad \text{and} \quad \Phi = h f_0 = \frac{hc}{\lambda_0}"
        description="Light arrives as discrete energy quanta (photons) of energy E = hf. Below the material-specific threshold frequency f0, no electrons are emitted regardless of light intensity. Above f0, kinetic energy increases linearly with frequency with slope equal to Planck's constant h."
        parameters={[
          { symbol: 'h', name: "Planck's Constant", unit: '6.626×10⁻³⁴ J·s' },
          { symbol: 'f', name: 'Photon Frequency', unit: 'Hz' },
          { symbol: '\\Phi', name: 'Metal Work Function', unit: 'eV' },
          { symbol: 'K_{\\text{max}}', name: 'Max Kinetic Energy', unit: 'eV' },
          { symbol: 'V_{\\text{stop}}', name: 'Stopping Voltage', unit: 'V' },
        ]}
      />

      {/* Presets Modal */}
      {isPresetsOpen && (
        <PhotoelectricPresetsModal
          isOpen={isPresetsOpen}
          onClose={handleClosePresets}
          onApplyPreset={(newParams) => {
            setParams((prev) => ({ ...prev, ...newParams }));
            handleClosePresets();
          }}
        />
      )}
    </div>
  );
};
