/**
 * EQUATION 1 — Single-Variable Parameter Experiment Studio
 * Part 12: "Change One Parameter at a Time"
 *
 * Provides structured scientific comparisons:
 * - EXPERIMENT A: Wavelength (λ) — Compare 450 nm, 550 nm, 650 nm (β ∝ λ)
 * - EXPERIMENT B: Slit Separation (d) — Compare 0.15 mm, 0.25 mm, 0.50 mm (β ∝ 1/d)
 * - EXPERIMENT C: Screen Distance (L) — Compare 1.0 m, 2.0 m, 3.5 m (β ∝ L)
 * - EXPERIMENT D: Slit Width (a) — Compare 0.02 mm, 0.05 mm, 0.12 mm (diffraction envelope)
 * - EXPERIMENT E: Light Intensity (I_0) — Compare 30%, 70%, 100% (brightness without shifting fringes)
 *
 * Each comparison actively modifies the live apparatus parameters!
 */

import React, { useState } from 'react';
import {
  DoubleSlitParameters,
  DoubleSlitPhysicsResults,
} from '../../physics/doubleslit/types';
import {
  Sliders,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Eye,
  Layers,
  Zap,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface ParameterStudioProps {
  params: DoubleSlitParameters;
  results: DoubleSlitPhysicsResults;
  onParamChange: <K extends keyof DoubleSlitParameters>(
    key: K,
    value: DoubleSlitParameters[K]
  ) => void;
  onBatchParamChange: (newParams: Partial<DoubleSlitParameters>) => void;
  onResetDefaults: () => void;
}

export const DoubleSlitParameterStudio: React.FC<ParameterStudioProps> = ({
  params,
  results,
  onParamChange,
  onBatchParamChange,
  onResetDefaults,
}) => {
  const [activeExperiment, setActiveExperiment] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');

  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-5 text-[#F1F5F9]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#26364D] gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F1F5F9]">Change One Parameter at a Time (ceteris paribus)</h3>
            <p className="text-xs text-[#94A3B8]">
              Isolate individual physical variables to observe their exact quantitative effect on fringes and envelopes.
            </p>
          </div>
        </div>

        <button
          onClick={onResetDefaults}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#94A3B8] hover:text-[#F1F5F9] bg-[#17263B] hover:bg-[#26364D] rounded-lg border border-[#26364D] transition-colors cursor-pointer self-start sm:self-center"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Experiment</span>
        </button>
      </div>

      {/* Experiment Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <button
          onClick={() => setActiveExperiment('A')}
          className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
            activeExperiment === 'A'
              ? 'bg-[#17263B] border-[#38BDF8] text-[#38BDF8] shadow-md'
              : 'bg-[#0B1728] border-[#26364D] text-[#94A3B8] hover:bg-[#17263B] hover:text-[#F1F5F9]'
          }`}
        >
          <div className="text-[10px] uppercase font-mono font-bold text-slate-400">Exp A</div>
          <div className="font-bold text-xs">Wavelength (λ)</div>
          <div className="text-[10px] text-slate-400 mt-0.5">β ∝ λ</div>
        </button>

        <button
          onClick={() => setActiveExperiment('B')}
          className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
            activeExperiment === 'B'
              ? 'bg-[#17263B] border-[#FBBF24] text-[#FBBF24] shadow-md'
              : 'bg-[#0B1728] border-[#26364D] text-[#94A3B8] hover:bg-[#17263B] hover:text-[#F1F5F9]'
          }`}
        >
          <div className="text-[10px] uppercase font-mono font-bold text-slate-400">Exp B</div>
          <div className="font-bold text-xs">Slit Separation (d)</div>
          <div className="text-[10px] text-slate-400 mt-0.5">β ∝ 1/d</div>
        </button>

        <button
          onClick={() => setActiveExperiment('C')}
          className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
            activeExperiment === 'C'
              ? 'bg-[#17263B] border-[#34D399] text-[#34D399] shadow-md'
              : 'bg-[#0B1728] border-[#26364D] text-[#94A3B8] hover:bg-[#17263B] hover:text-[#F1F5F9]'
          }`}
        >
          <div className="text-[10px] uppercase font-mono font-bold text-slate-400">Exp C</div>
          <div className="font-bold text-xs">Screen Distance (L)</div>
          <div className="text-[10px] text-slate-400 mt-0.5">β ∝ L</div>
        </button>

        <button
          onClick={() => setActiveExperiment('D')}
          className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
            activeExperiment === 'D'
              ? 'bg-[#17263B] border-[#A78BFA] text-[#A78BFA] shadow-md'
              : 'bg-[#0B1728] border-[#26364D] text-[#94A3B8] hover:bg-[#17263B] hover:text-[#F1F5F9]'
          }`}
        >
          <div className="text-[10px] uppercase font-mono font-bold text-slate-400">Exp D</div>
          <div className="font-bold text-xs">Slit Width (a)</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Envelope Width</div>
        </button>

        <button
          onClick={() => setActiveExperiment('E')}
          className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
            activeExperiment === 'E'
              ? 'bg-[#17263B] border-white text-white shadow-md'
              : 'bg-[#0B1728] border-[#26364D] text-[#94A3B8] hover:bg-[#17263B] hover:text-[#F1F5F9]'
          }`}
        >
          <div className="text-[10px] uppercase font-mono font-bold text-slate-400">Exp E</div>
          <div className="font-bold text-xs">Light Intensity (I₀)</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Brightness Only</div>
        </button>
      </div>

      {/* EXPERIMENT A: WAVELENGTH */}
      {activeExperiment === 'A' && (
        <div className="bg-[#0B1728] p-5 rounded-lg border border-[#26364D] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#26364D] pb-3">
            <div>
              <h4 className="font-bold text-sm text-[#38BDF8]">EXPERIMENT A: Change Wavelength (λ)</h4>
              <p className="text-xs text-slate-400">
                Keep slit separation d = 0.25 mm, slit width a = 0.05 mm, and screen distance L = 2.0 m constant.
              </p>
            </div>
            <div className="font-mono text-xs text-[#38BDF8]">
              Current β = {results.fringeWidthMm.toFixed(3)} mm
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { wl: 450, label: 'Blue (450 nm)', beta: (450e-9 * params.screenDistanceM / (params.slitSeparationMm * 1e-3)) * 1000, desc: 'Tightly packed, narrow fringes' },
              { wl: 550, label: 'Green (550 nm)', beta: (550e-9 * params.screenDistanceM / (params.slitSeparationMm * 1e-3)) * 1000, desc: 'Standard baseline optical width' },
              { wl: 650, label: 'Red (650 nm)', beta: (650e-9 * params.screenDistanceM / (params.slitSeparationMm * 1e-3)) * 1000, desc: 'Broadest, widely separated fringes' },
            ].map((item) => (
              <button
                key={item.wl}
                onClick={() => {
                  onBatchParamChange({
                    wavelengthNm: item.wl,
                    isWhiteLight: false,
                    slitSeparationMm: 0.25,
                    slitWidthMm: 0.05,
                    screenDistanceM: 2.0,
                  });
                }}
                className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                  params.wavelengthNm === item.wl
                    ? 'bg-[#17263B] border-[#38BDF8] text-white shadow-md'
                    : 'bg-[#101D30] border-[#26364D] text-[#94A3B8] hover:bg-[#17263B] hover:text-white'
                }`}
              >
                <div className="font-bold text-xs text-white">{item.label}</div>
                <div className="font-mono text-xs text-[#38BDF8] mt-1 font-bold">
                  β = {item.beta.toFixed(3)} mm
                </div>
                <div className="text-[11px] text-slate-400 mt-1">{item.desc}</div>
              </button>
            ))}
          </div>

          <div className="p-3 bg-[#101D30] rounded-lg border border-[#26364D] text-xs text-slate-300">
            <strong className="text-white">Scientific Finding:</strong> Because fringe width is directly proportional to wavelength (<span className="text-[#38BDF8] font-mono">β ∝ λ</span>), red light (650 nm) produces fringes that are <strong className="text-[#38BDF8]">44% wider</strong> than blue light (450 nm).
          </div>
        </div>
      )}

      {/* EXPERIMENT B: SLIT SEPARATION */}
      {activeExperiment === 'B' && (
        <div className="bg-[#0B1728] p-5 rounded-lg border border-[#26364D] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#26364D] pb-3">
            <div>
              <h4 className="font-bold text-sm text-[#FBBF24]">EXPERIMENT B: Change Slit Separation (d)</h4>
              <p className="text-xs text-slate-400">
                Keep wavelength λ = 550 nm, slit width a = 0.05 mm, and screen distance L = 2.0 m constant.
              </p>
            </div>
            <div className="font-mono text-xs text-[#FBBF24]">
              Current β = {results.fringeWidthMm.toFixed(3)} mm
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { d: 0.15, label: 'Narrow d = 0.15 mm', beta: (550e-9 * 2.0 / (0.15e-3)) * 1000, desc: 'Large fringe spacing (wide bands)' },
              { d: 0.25, label: 'Medium d = 0.25 mm', beta: (550e-9 * 2.0 / (0.25e-3)) * 1000, desc: 'Standard laboratory separation' },
              { d: 0.50, label: 'Wide d = 0.50 mm', beta: (550e-9 * 2.0 / (0.50e-3)) * 1000, desc: 'Dense, closely packed fringes' },
            ].map((item) => (
              <button
                key={item.d}
                onClick={() => {
                  onBatchParamChange({
                    slitSeparationMm: item.d,
                    wavelengthNm: 550,
                    slitWidthMm: 0.05,
                    screenDistanceM: 2.0,
                  });
                }}
                className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                  params.slitSeparationMm === item.d
                    ? 'bg-[#17263B] border-[#FBBF24] text-white shadow-md'
                    : 'bg-[#101D30] border-[#26364D] text-[#94A3B8] hover:bg-[#17263B] hover:text-white'
                }`}
              >
                <div className="font-bold text-xs text-white">{item.label}</div>
                <div className="font-mono text-xs text-[#FBBF24] mt-1 font-bold">
                  β = {item.beta.toFixed(3)} mm
                </div>
                <div className="text-[11px] text-slate-400 mt-1">{item.desc}</div>
              </button>
            ))}
          </div>

          <div className="p-3 bg-[#101D30] rounded-lg border border-[#26364D] text-xs text-slate-300">
            <strong className="text-white">Scientific Finding:</strong> Fringe width is inversely proportional to slit separation (<span className="text-[#FBBF24] font-mono">β ∝ 1/d</span>). Increasing the separation between slits forces the waves to interfere at smaller angular increments, cramming more fringes together on the screen.
          </div>
        </div>
      )}

      {/* EXPERIMENT C: SCREEN DISTANCE */}
      {activeExperiment === 'C' && (
        <div className="bg-[#0B1728] p-5 rounded-lg border border-[#26364D] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#26364D] pb-3">
            <div>
              <h4 className="font-bold text-sm text-[#34D399]">EXPERIMENT C: Change Screen Distance (L)</h4>
              <p className="text-xs text-slate-400">
                Keep wavelength λ = 550 nm, slit separation d = 0.25 mm, and slit width a = 0.05 mm constant.
              </p>
            </div>
            <div className="font-mono text-xs text-[#34D399]">
              Current β = {results.fringeWidthMm.toFixed(3)} mm
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { L: 1.0, label: 'Near L = 1.0 m', beta: (550e-9 * 1.0 / (0.25e-3)) * 1000, desc: 'Compact projection scale' },
              { L: 2.0, label: 'Mid L = 2.0 m', beta: (550e-9 * 2.0 / (0.25e-3)) * 1000, desc: 'Balanced default bench distance' },
              { L: 3.5, label: 'Far L = 3.5 m', beta: (550e-9 * 3.5 / (0.25e-3)) * 1000, desc: 'Large magnification of fringe pattern' },
            ].map((item) => (
              <button
                key={item.L}
                onClick={() => {
                  onBatchParamChange({
                    screenDistanceM: item.L,
                    wavelengthNm: 550,
                    slitSeparationMm: 0.25,
                    slitWidthMm: 0.05,
                  });
                }}
                className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                  params.screenDistanceM === item.L
                    ? 'bg-[#17263B] border-[#34D399] text-white shadow-md'
                    : 'bg-[#101D30] border-[#26364D] text-[#94A3B8] hover:bg-[#17263B] hover:text-white'
                }`}
              >
                <div className="font-bold text-xs text-white">{item.label}</div>
                <div className="font-mono text-xs text-[#34D399] mt-1 font-bold">
                  β = {item.beta.toFixed(3)} mm
                </div>
                <div className="text-[11px] text-slate-400 mt-1">{item.desc}</div>
              </button>
            ))}
          </div>

          <div className="p-3 bg-[#101D30] rounded-lg border border-[#26364D] text-xs text-slate-300">
            <strong className="text-white">Scientific Finding:</strong> Under the far-field approximation, spatial fringe width is directly proportional to screen distance (<span className="text-[#34D399] font-mono">β ∝ L</span>). Moving the screen further away linearly magnifies the pattern while the angular fringe separation (<span className="text-[#34D399] font-mono">Δθ = λ/d</span>) remains unchanged.
          </div>
        </div>
      )}

      {/* EXPERIMENT D: SLIT WIDTH */}
      {activeExperiment === 'D' && (
        <div className="bg-[#0B1728] p-5 rounded-lg border border-[#26364D] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#26364D] pb-3">
            <div>
              <h4 className="font-bold text-sm text-[#A78BFA]">EXPERIMENT D: Change Slit Width (a)</h4>
              <p className="text-xs text-slate-400">
                Keep λ = 550 nm, d = 0.25 mm, and L = 2.0 m constant. Observe diffraction envelope changes.
              </p>
            </div>
            <div className="font-mono text-xs text-[#A78BFA]">
              Envelope Width = {results.centralDiffractionWidthMm.toFixed(2)} mm
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { a: 0.02, label: 'Very Narrow a = 0.02 mm', env: (2 * 550e-9 * 2.0 / (0.02e-3)) * 1000, desc: 'Broad envelope: many bright fringes visible' },
              { a: 0.05, label: 'Medium a = 0.05 mm', env: (2 * 550e-9 * 2.0 / (0.05e-3)) * 1000, desc: 'Standard envelope: d/a = 5 (10 fringes in central)' },
              { a: 0.12, label: 'Wide a = 0.12 mm', env: (2 * 550e-9 * 2.0 / (0.12e-3)) * 1000, desc: 'Narrow envelope: rapid outer fringe dimming' },
            ].map((item) => (
              <button
                key={item.a}
                onClick={() => {
                  onBatchParamChange({
                    slitWidthMm: item.a,
                    wavelengthNm: 550,
                    slitSeparationMm: 0.25,
                    screenDistanceM: 2.0,
                    showEnvelope: true,
                  });
                }}
                className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                  params.slitWidthMm === item.a
                    ? 'bg-[#17263B] border-[#A78BFA] text-white shadow-md'
                    : 'bg-[#101D30] border-[#26364D] text-[#94A3B8] hover:bg-[#17263B] hover:text-white'
                }`}
              >
                <div className="font-bold text-xs text-white">{item.label}</div>
                <div className="font-mono text-xs text-[#A78BFA] mt-1 font-bold">
                  Central Env = {item.env.toFixed(2)} mm
                </div>
                <div className="text-[11px] text-slate-400 mt-1">{item.desc}</div>
              </button>
            ))}
          </div>

          <div className="p-3 bg-[#101D30] rounded-lg border border-[#26364D] text-xs text-slate-300">
            <strong className="text-white">Crucial Concept:</strong> Slit separation <strong className="text-[#FBBF24] font-mono">d</strong> primarily controls interference fringe spacing (<span className="text-slate-300 font-mono">β = λL/d</span>), while slit width <strong className="text-[#A78BFA] font-mono">a</strong> governs the single-slit diffraction envelope width (<span className="text-slate-300 font-mono">2λL/a</span>). Increasing slit width narrows the central envelope without changing the positions of individual interference maxima!
          </div>
        </div>
      )}

      {/* EXPERIMENT E: INTENSITY */}
      {activeExperiment === 'E' && (
        <div className="bg-[#0B1728] p-5 rounded-lg border border-[#26364D] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#26364D] pb-3">
            <div>
              <h4 className="font-bold text-sm text-white">EXPERIMENT E: Change Light Intensity (I₀)</h4>
              <p className="text-xs text-slate-400">
                Vary the optical source power from 30% to 100% while keeping all spatial dimensions fixed.
              </p>
            </div>
            <div className="font-mono text-xs text-white">
              Intensity = {params.intensityPercent}%
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { val: 30, label: 'Low Intensity (30%)', desc: 'Faint fringes, exact same positions' },
              { val: 70, label: 'Default Intensity (70%)', desc: 'Optimal contrast on dark background' },
              { val: 100, label: 'High Intensity (100%)', desc: 'Maximum screen luminance, same β' },
            ].map((item) => (
              <button
                key={item.val}
                onClick={() => onParamChange('intensityPercent', item.val)}
                className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                  params.intensityPercent === item.val
                    ? 'bg-[#17263B] border-white text-white shadow-md'
                    : 'bg-[#101D30] border-[#26364D] text-[#94A3B8] hover:bg-[#17263B] hover:text-white'
                }`}
              >
                <div className="font-bold text-xs text-white">{item.label}</div>
                <div className="font-mono text-xs text-[#38BDF8] mt-1 font-bold">
                  I₀ = {item.val}%
                </div>
                <div className="text-[11px] text-slate-400 mt-1">{item.desc}</div>
              </button>
            ))}
          </div>

          <div className="p-3 bg-[#101D30] rounded-lg border border-[#26364D] text-xs text-slate-300">
            <strong className="text-white">Scientific Finding:</strong> Changing the light source intensity alters the absolute amplitude of the electric field and therefore the luminance of the screen pattern, but leaves fringe positions (<span className="font-mono text-[#38BDF8]">y_m = mλL/d</span>) and fringe width (<span className="font-mono text-[#38BDF8]">β</span>) completely unchanged.
          </div>
        </div>
      )}
    </div>
  );
};
