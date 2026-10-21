/**
 * EQUATION 1 — Bohr Model Live Results Panel
 * Complete physical telemetry for the current electron state and active transition:
 * Energy (eV & J), Radius (m & Å), Speed (m/s & fraction of c),
 * Photon Frequency, Wavelength, Spectral Region & Series.
 */

import React from 'react';
import {
  PrincipalQuantumNumber,
  ElectronTransition,
  BohrEnergyLevel,
} from '../../physics/bohr/types';
import { calculateEnergyLevel } from '../../physics/bohr/model';
import { Gauge, Zap, Compass, Activity, CheckCircle2, Sparkles } from 'lucide-react';

interface BohrResultsPanelProps {
  currentLevel: PrincipalQuantumNumber;
  activeTransition: ElectronTransition | null;
}

export const BohrResultsPanel: React.FC<BohrResultsPanelProps> = ({
  currentLevel,
  activeTransition,
}) => {
  const levelData: BohrEnergyLevel = calculateEnergyLevel(currentLevel);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Panel 1: Current Electron State */}
      <div className="bg-[#10243D] border border-[#29415F] rounded-xl p-5 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-[#29415F]/70">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-[#38BDF8]" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Current Bound State (n = {currentLevel})
            </h3>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#142B47] text-[#38BDF8] border border-[#29415F]">
            {levelData.label}
          </span>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-3 font-mono">
          {/* Energy in eV */}
          <div className="p-3 rounded-lg bg-[#0B1B31] border border-[#29415F]">
            <div className="text-[10px] text-[#9FB3CC] uppercase tracking-wider">
              Binding Energy (eV)
            </div>
            <div className="text-base sm:text-lg font-bold text-[#38BDF8] mt-1">
              {levelData.energyEV.toFixed(4)}
              <span className="text-xs text-[#9FB3CC] ml-1">eV</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              −13.60 / {currentLevel * currentLevel}
            </div>
          </div>

          {/* Energy in Joules */}
          <div className="p-3 rounded-lg bg-[#0B1B31] border border-[#29415F]">
            <div className="text-[10px] text-[#9FB3CC] uppercase tracking-wider">
              Energy (Joules)
            </div>
            <div className="text-base sm:text-lg font-bold text-white mt-1">
              {levelData.energyJoules.toExponential(3)}
              <span className="text-xs text-[#9FB3CC] ml-1">J</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              E_eV × 1.602×10⁻¹⁹
            </div>
          </div>

          {/* Orbital Radius in Å */}
          <div className="p-3 rounded-lg bg-[#0B1B31] border border-[#29415F]">
            <div className="text-[10px] text-[#9FB3CC] uppercase tracking-wider">
              Bohr Radius (Å)
            </div>
            <div className="text-base sm:text-lg font-bold text-[#4ADE80] mt-1">
              {levelData.radiusAngstroms.toFixed(3)}
              <span className="text-xs text-[#9FB3CC] ml-1">Å</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {currentLevel * currentLevel} × 0.529 Å
            </div>
          </div>

          {/* Orbital Radius in Meters */}
          <div className="p-3 rounded-lg bg-[#0B1B31] border border-[#29415F]">
            <div className="text-[10px] text-[#9FB3CC] uppercase tracking-wider">
              Radius (Meters)
            </div>
            <div className="text-base sm:text-lg font-bold text-[#4ADE80] mt-1">
              {levelData.radiusMeters.toExponential(3)}
              <span className="text-xs text-[#9FB3CC] ml-1">m</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              a₀ · n²
            </div>
          </div>

          {/* Idealized Speed in m/s */}
          <div className="p-3 rounded-lg bg-[#0B1B31] border border-[#29415F]">
            <div className="text-[10px] text-[#9FB3CC] uppercase tracking-wider">
              Orbital Speed
            </div>
            <div className="text-base sm:text-lg font-bold text-[#FBBF24] mt-1">
              {(levelData.speedMetersPerSec / 1e6).toFixed(3)}
              <span className="text-xs text-[#9FB3CC] ml-1">×10⁶ m/s</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              v_n = αc / n
            </div>
          </div>

          {/* Speed Fraction of c */}
          <div className="p-3 rounded-lg bg-[#0B1B31] border border-[#29415F]">
            <div className="text-[10px] text-[#9FB3CC] uppercase tracking-wider">
              Speed / c
            </div>
            <div className="text-base sm:text-lg font-bold text-[#FBBF24] mt-1">
              {(levelData.speedFractionOfC * 100).toFixed(3)}
              <span className="text-xs text-[#9FB3CC] ml-1">% c</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              (1/137) / {currentLevel}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-[#29415F]/70 text-[11px] text-[#9FB3CC] flex items-center justify-between">
          <span>Non-relativistic Bohr electron speed</span>
          <span className="font-mono text-[#38BDF8]">v₁ ≈ 2,187,691 m/s</span>
        </div>
      </div>

      {/* Panel 2: Transition Telemetry */}
      <div className="bg-[#10243D] border border-[#29415F] rounded-xl p-5 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-[#29415F]/70">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#FBBF24]" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Active Photon Transition Results
            </h3>
          </div>
          {activeTransition ? (
            <span
              className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                activeTransition.type === 'absorption'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              {activeTransition.type} (n={activeTransition.initialLevel} → n={activeTransition.finalLevel})
            </span>
          ) : (
            <span className="text-xs font-mono text-[#9FB3CC]">No transition active</span>
          )}
        </div>

        {activeTransition ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-3 font-mono">
            {/* Photon Energy in eV */}
            <div className="p-3 rounded-lg bg-[#0B1B31] border border-[#29415F]">
              <div className="text-[10px] text-[#9FB3CC] uppercase tracking-wider">
                Photon Energy (ΔE)
              </div>
              <div className="text-base sm:text-lg font-bold text-[#FBBF24] mt-1">
                {activeTransition.deltaEnergyEV.toFixed(4)}
                <span className="text-xs text-[#9FB3CC] ml-1">eV</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                |E_f − E_i|
              </div>
            </div>

            {/* Photon Energy in Joules */}
            <div className="p-3 rounded-lg bg-[#0B1B31] border border-[#29415F]">
              <div className="text-[10px] text-[#9FB3CC] uppercase tracking-wider">
                Photon Energy (J)
              </div>
              <div className="text-base sm:text-lg font-bold text-white mt-1">
                {activeTransition.deltaEnergyJoules.toExponential(3)}
                <span className="text-xs text-[#9FB3CC] ml-1">J</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                ΔE_eV × e
              </div>
            </div>

            {/* Wavelength in nm */}
            <div className="p-3 rounded-lg bg-[#0B1B31] border border-[#29415F]">
              <div className="text-[10px] text-[#9FB3CC] uppercase tracking-wider">
                Wavelength (λ)
              </div>
              <div className="text-base sm:text-lg font-bold text-[#38BDF8] mt-1 flex items-center gap-1.5">
                {activeTransition.visibleColorHex && (
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: activeTransition.visibleColorHex }}
                  />
                )}
                <span>{activeTransition.wavelengthNM.toFixed(1)}</span>
                <span className="text-xs text-[#9FB3CC]">nm</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                λ = hc / ΔE
              </div>
            </div>

            {/* Frequency in THz */}
            <div className="p-3 rounded-lg bg-[#0B1B31] border border-[#29415F]">
              <div className="text-[10px] text-[#9FB3CC] uppercase tracking-wider">
                Frequency (f)
              </div>
              <div className="text-base sm:text-lg font-bold text-white mt-1">
                {(activeTransition.frequencyHz / 1e12).toFixed(2)}
                <span className="text-xs text-[#9FB3CC] ml-1">THz</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                f = ΔE / h
              </div>
            </div>

            {/* Spectral Series */}
            <div className="p-3 rounded-lg bg-[#0B1B31] border border-[#29415F]">
              <div className="text-[10px] text-[#9FB3CC] uppercase tracking-wider">
                Spectral Series
              </div>
              <div className="text-base sm:text-lg font-bold text-[#818CF8] mt-1 font-sans">
                {activeTransition.spectralSeries || 'Higher'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Lower level n = {Math.min(activeTransition.initialLevel, activeTransition.finalLevel)}
              </div>
            </div>

            {/* Spectral Region */}
            <div className="p-3 rounded-lg bg-[#0B1B31] border border-[#29415F]">
              <div className="text-[10px] text-[#9FB3CC] uppercase tracking-wider">
                Spectral Region
              </div>
              <div className="text-base sm:text-lg font-bold text-emerald-400 mt-1 capitalize font-sans">
                {activeTransition.spectralRegion}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {activeTransition.isHAlpha ? 'Balmer H-α (Red)' : activeTransition.isHBeta ? 'Balmer H-β (Cyan)' : activeTransition.isHGamma ? 'Balmer H-γ (Blue)' : 'Electromagnetic'}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-[#9FB3CC] font-mono">
            Select initial and final levels in the control panel and click "Run Quantum Transition" to view photon telemetry.
          </div>
        )}

        {/* Footer info: Rydberg formula agreement */}
        <div className="pt-2 border-t border-[#29415F]/70 text-[11px] text-[#9FB3CC] flex items-center justify-between font-mono">
          <span>Rydberg Verification: 1/λ = R_H(1/n_f² − 1/n_i²)</span>
          {activeTransition && (
            <span className="text-emerald-400 flex items-center gap-1 font-sans">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{activeTransition.rydbergWavelengthNM.toFixed(1)} nm ({activeTransition.rydbergAgreementPercent.toFixed(2)}% agree)</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
