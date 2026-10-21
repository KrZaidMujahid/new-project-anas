/**
 * EQUATION 1 — Bohr Model of the Hydrogen Atom Laboratory
 * Minimalist Studio Split Architecture:
 * - Top Left: Quantized Orbit Apparatus (BohrAtomVisualization)
 * - Top Right: Essential Parameters Deck (ni, nf, transition triggers)
 * - Middle: Mathematical Emission Spectrum & Energy Level Diagram (HydrogenSpectrum)
 * - Bottom: KaTeX Formula Card & Law Definitions
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  PrincipalQuantumNumber,
  ElectronTransition,
} from '../../physics/bohr/types';
import {
  calculateEnergyLevel,
  calculateTransition,
} from '../../physics/bohr/model';
import { BohrAtomVisualization } from './BohrAtomVisualization';
import { HydrogenSpectrum } from './HydrogenSpectrum';
import { BohrPresetsModal } from './BohrPresetsModal';
import { FormulaCard } from '../FormulaCard';
import { Atom, RotateCcw, Sparkles, Sliders } from 'lucide-react';

interface BohrLaboratoryProps {
  onBackToPhysics?: () => void;
  isPresetsOpenExternal?: boolean;
  onClosePresetsExternal?: () => void;
}

export const BohrLaboratory: React.FC<BohrLaboratoryProps> = ({
  isPresetsOpenExternal,
  onClosePresetsExternal,
}) => {
  const [currentLevel, setCurrentLevel] = useState<PrincipalQuantumNumber>(1);
  const [initialLevel, setInitialLevel] = useState<PrincipalQuantumNumber>(3);
  const [finalLevel, setFinalLevel] = useState<PrincipalQuantumNumber>(2);
  const [activeTransition, setActiveTransition] = useState<ElectronTransition | null>(() =>
    calculateTransition(3, 2)
  );
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [transitionProgress, setTransitionProgress] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isPresetsOpenInternal, setIsPresetsOpenInternal] = useState(false);

  const isPresetsOpen = isPresetsOpenExternal ?? isPresetsOpenInternal;
  const handleClosePresets = onClosePresetsExternal ?? (() => setIsPresetsOpenInternal(false));

  const transitionAnimRef = useRef<number | null>(null);

  const handleExecuteTransition = useCallback(
    (ni: PrincipalQuantumNumber, nf: PrincipalQuantumNumber) => {
      if (ni === nf) return;
      const t = calculateTransition(ni, nf);
      setActiveTransition(t);
      setInitialLevel(ni);
      setFinalLevel(nf);
      setIsTransitioning(true);
      setTransitionProgress(0);

      const startTime = performance.now();
      const durationMs = 1000;

      const animateTransition = (now: number) => {
        const elapsed = now - startTime;
        const p = Math.min(1, elapsed / durationMs);
        setTransitionProgress(p);
        if (p < 1) {
          transitionAnimRef.current = requestAnimationFrame(animateTransition);
        } else {
          setIsTransitioning(false);
          setCurrentLevel(nf);
        }
      };

      if (transitionAnimRef.current) cancelAnimationFrame(transitionAnimRef.current);
      transitionAnimRef.current = requestAnimationFrame(animateTransition);
    },
    []
  );

  useEffect(() => {
    return () => {
      if (transitionAnimRef.current) cancelAnimationFrame(transitionAnimRef.current);
    };
  }, []);

  const handleResetDefaults = useCallback(() => {
    if (transitionAnimRef.current) cancelAnimationFrame(transitionAnimRef.current);
    setIsTransitioning(false);
    setTransitionProgress(0);
    setCurrentLevel(1);
    setInitialLevel(3);
    setFinalLevel(2);
    setActiveTransition(calculateTransition(3, 2));
  }, []);

  return (
    <div className="space-y-6 text-[#F8FAFC]">
      {/* 1. Module Header */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#38BDF8] uppercase tracking-wider font-semibold">
            <Atom className="w-4 h-4" />
            <span>Atomic &amp; Quantum Physics</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#F8FAFC] tracking-tight mt-1">
            Bohr Hydrogen Atom &amp; Spectral Transitions
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
            Quantized energy states, orbital radii, Rydberg transitions, and discrete hydrogen emission lines.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setIsPresetsOpenInternal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#050508] hover:bg-[#121722] border border-[#1E293B] hover:border-[#38BDF8]/50 text-xs font-medium text-[#38BDF8] transition-colors cursor-pointer min-h-[36px]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Presets</span>
          </button>
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#050508] hover:bg-[#121722] border border-[#1E293B] text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer min-h-[36px]"
            title="Reset atom to n=3 -> 2 Balmer H-alpha transition"
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
          <BohrAtomVisualization
            currentLevel={currentLevel}
            activeTransition={activeTransition}
            isTransitioning={isTransitioning}
            transitionProgress={transitionProgress}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying((p) => !p)}
            onSelectLevel={(n) => {
              handleExecuteTransition(currentLevel, n);
            }}
          />
        </div>

        {/* Right: Essential Parameters (4 cols on desktop) */}
        <div className="lg:col-span-4 bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 space-y-4 shadow-sm min-w-0">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#38BDF8] font-bold">
              <Sliders className="w-4 h-4" />
              <span>Quantum Level Selector</span>
            </div>
            <button
              onClick={handleResetDefaults}
              className="text-[11px] font-mono text-[#64748B] hover:text-[#38BDF8] transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Initial State ni */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Initial State (nᵢ)</span>
              <span className="text-[#38BDF8] font-bold">n = {initialLevel}</span>
            </div>
            <div className="grid grid-cols-6 gap-1">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <button
                  key={`ni-${n}`}
                  onClick={() => setInitialLevel(n as PrincipalQuantumNumber)}
                  className={`py-1.5 text-xs font-mono rounded border transition-colors cursor-pointer ${
                    initialLevel === n
                      ? 'border-[#38BDF8] text-[#38BDF8] bg-[#38BDF8]/10 font-bold'
                      : 'border-[#1E293B] text-[#94A3B8] bg-[#050508] hover:text-[#F8FAFC]'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Final State nf */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Final State (n_f)</span>
              <span className="text-[#FBBF24] font-bold">n = {finalLevel}</span>
            </div>
            <div className="grid grid-cols-6 gap-1">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <button
                  key={`nf-${n}`}
                  onClick={() => setFinalLevel(n as PrincipalQuantumNumber)}
                  className={`py-1.5 text-xs font-mono rounded border transition-colors cursor-pointer ${
                    finalLevel === n
                      ? 'border-[#FBBF24] text-[#FBBF24] bg-[#FBBF24]/10 font-bold'
                      : 'border-[#1E293B] text-[#94A3B8] bg-[#050508] hover:text-[#F8FAFC]'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Trigger Transition Button */}
          <button
            onClick={() => handleExecuteTransition(initialLevel, finalLevel)}
            disabled={initialLevel === finalLevel}
            className="w-full py-2.5 rounded-lg font-bold font-mono text-xs text-[#050508] bg-[#38BDF8] hover:bg-[#0284C7] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-sm"
          >
            {initialLevel > finalLevel
              ? `Emit Photon (n=${initialLevel} → n=${finalLevel})`
              : initialLevel < finalLevel
              ? `Absorb Photon (n=${initialLevel} → n=${finalLevel})`
              : 'Select Distinct Quantum Numbers'}
          </button>

          {/* Transition Energy and Wavelength Readout */}
          {activeTransition && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1E293B]">
              <div className="p-2.5 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
                <div className="text-[10px] text-[#64748B]">Transition ΔE</div>
                <div className="text-sm font-bold text-[#38BDF8]">
                  {activeTransition.deltaEnergyEV.toFixed(3)} eV
                </div>
              </div>
              <div className="p-2.5 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
                <div className="text-[10px] text-[#64748B]">Wavelength (λ)</div>
                <div className="text-sm font-bold text-[#FBBF24]">
                  {activeTransition.wavelengthNM.toFixed(1)} nm
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Mathematical Hydrogen Emission Spectrum */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
        <HydrogenSpectrum
          activeTransition={activeTransition}
          onSelectTransition={handleExecuteTransition}
        />
      </div>

      {/* 4. Minimalist KaTeX Formula Card */}
      <FormulaCard
        title="Bohr Hydrogen Atom Quantization"
        formula="E_n = -\frac{13.6\text{ eV}}{n^2} \quad \text{and} \quad r_n = n^2 a_0 = n^2(0.529\text{ \AA})"
        additionalFormula="\Delta E = hf = \frac{hc}{\lambda} = 13.6\text{ eV} \left(\frac{1}{n_f^2} - \frac{1}{n_i^2}\right)"
        description="Electrons orbit the proton only in discrete quantized stationary states where angular momentum L = n(h / 2π). Photon emission or absorption occurs solely during transitions between stationary states, with wavelength given by the Rydberg formula."
        parameters={[
          { symbol: 'n', name: 'Principal Quantum Number', unit: '1, 2, 3...' },
          { symbol: 'E_n', name: 'Energy Level', unit: 'eV' },
          { symbol: 'r_n', name: 'Orbital Radius', unit: 'Å' },
          { symbol: '\\Delta E', name: 'Transition Energy', unit: 'eV' },
          { symbol: '\\lambda', name: 'Spectral Wavelength', unit: 'nm' },
        ]}
      />

      {/* Presets Modal */}
      {isPresetsOpen && (
        <BohrPresetsModal
          isOpen={isPresetsOpen}
          onClose={handleClosePresets}
          onSelectPreset={(preset) => {
            setInitialLevel(preset.initialLevel);
            setFinalLevel(preset.finalLevel);
            handleExecuteTransition(preset.initialLevel, preset.finalLevel);
            handleClosePresets();
          }}
        />
      )}
    </div>
  );
};
