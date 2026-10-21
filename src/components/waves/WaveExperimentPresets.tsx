/**
 * EQUATION 1 — Preset Experiments Catalog (Section 7)
 * Interactive one-click setup for Experiments A through F with real physical parameters,
 * visual highlighting, and pedagogical commentary.
 */

import React from 'react';
import { TwoSourceParameters, InterferenceVisualizationMode } from '../../physics/waves/types';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Waves, Eye } from 'lucide-react';

interface WaveExperimentPresetsProps {
  currentParams: TwoSourceParameters;
  onApplyPreset: (params: Partial<TwoSourceParameters>, mode: InterferenceVisualizationMode) => void;
}

interface PresetExperimentItem {
  id: string;
  name: string;
  label: string;
  badge: string;
  mode: InterferenceVisualizationMode;
  explanation: string;
  params: Partial<TwoSourceParameters>;
}

const PRESET_EXPERIMENTS: PresetExperimentItem[] = [
  {
    id: 'exp-a',
    name: 'Experiment A: Perfect Constructive Interference',
    label: 'In-Phase Maximum Reinforcement',
    badge: 'Δφ₀ = 0°, Δr = nλ',
    mode: 'constructive',
    explanation:
      'Sources emit in phase (Δφ₀ = 0°). At points where path difference Δr is an exact integer multiple of wavelength (Δr = nλ), crests align with crests and resultant amplitude doubles to 2A = 2.0 a.u.',
    params: {
      phaseDifferenceDeg: 0,
      sourcePhase1Deg: 0,
      sourcePhase2Deg: 0,
      wavelength: 1.0,
      frequency: 2.0,
      separation: 2.5,
      showConstructiveHyperbolas: true,
      showDestructiveHyperbolas: false,
      probePoint: { x: 3.5, y: 0.0 }, // on central maximum
    },
  },
  {
    id: 'exp-b',
    name: 'Experiment B: Perfect Destructive Interference',
    label: 'Complete Cancellation & Nodal Lines',
    badge: 'Δφ₀ = 0°, Δr = (n+½)λ',
    mode: 'destructive',
    explanation:
      'Where path difference Δr is an odd half-multiple of wavelength ((n + ½)λ), the waves arrive exactly 180° out of phase. Equal-amplitude waves cancel completely, creating stationary nodal lines of zero disturbance.',
    params: {
      phaseDifferenceDeg: 0,
      sourcePhase1Deg: 0,
      sourcePhase2Deg: 0,
      wavelength: 1.0,
      frequency: 2.0,
      separation: 2.5,
      showConstructiveHyperbolas: false,
      showDestructiveHyperbolas: true,
      probePoint: { x: 3.0, y: 0.8 }, // near first nodal line
    },
  },
  {
    id: 'exp-c',
    name: 'Experiment C: Out-of-Phase Sources (180° Anti-Phase)',
    label: 'Phase Inversion of the Fringe Pattern',
    badge: 'Δφ₀ = 180°',
    mode: 'two-source',
    explanation:
      'Sources oscillate in opposite phase (Δφ₀ = 180°). The central perpendicular bisector line (Δr = 0), which was previously a bright constructive maximum, is now a completely dark destructive nodal line!',
    params: {
      phaseDifferenceDeg: 180,
      sourcePhase1Deg: 0,
      sourcePhase2Deg: 180,
      wavelength: 1.0,
      frequency: 2.0,
      separation: 2.5,
      showConstructiveHyperbolas: true,
      showDestructiveHyperbolas: true,
      probePoint: { x: 3.5, y: 0.0 }, // on central nodal line
    },
  },
  {
    id: 'exp-d',
    name: 'Experiment D: Long Wavelength (Wide Fringe Spacing)',
    label: 'Broad Interference Spacing',
    badge: 'λ = 2.50 m (Long)',
    mode: 'intensity',
    explanation:
      'Setting a large wavelength (λ = 2.5 m) increases the spatial spacing between adjacent nodal and antinodal hyperbolas (sin θ ≈ nλ/d). The fringes become wide, prominent, and spread out across the field.',
    params: {
      wavelength: 2.5,
      frequency: 1.2,
      separation: 2.5,
      phaseDifferenceDeg: 0,
      sourcePhase1Deg: 0,
      sourcePhase2Deg: 0,
      showWavefronts: true,
      probePoint: { x: 4.0, y: 1.0 },
    },
  },
  {
    id: 'exp-e',
    name: 'Experiment E: Short Wavelength (Dense Fringe Pattern)',
    label: 'High-Density Interference Fringes',
    badge: 'λ = 0.50 m (Short)',
    mode: 'intensity',
    explanation:
      'Setting a short wavelength (λ = 0.5 m) dramatically packs the interference hyperbolas closely together. Many higher-order antinodes (n = ±1, ±2, ±3, ±4...) fit within the field.',
    params: {
      wavelength: 0.5,
      frequency: 3.0,
      separation: 2.5,
      phaseDifferenceDeg: 0,
      sourcePhase1Deg: 0,
      sourcePhase2Deg: 0,
      showWavefronts: true,
      probePoint: { x: 3.0, y: 0.5 },
    },
  },
  {
    id: 'exp-f',
    name: 'Experiment F: Source Separation Comparison',
    label: 'Wide Separation (d = 4.0 m)',
    badge: 'd = 4.0 m vs 1.0 m',
    mode: 'two-source',
    explanation:
      'When source separation d is large compared to wavelength (d/λ = 4), the angular width of fringes narrows (fringe spacing β ∝ λ/d). Compare this with small separation d = 1.0 m to see how geometry changes.',
    params: {
      separation: 4.0,
      wavelength: 1.0,
      frequency: 2.0,
      phaseDifferenceDeg: 0,
      sourcePhase1Deg: 0,
      sourcePhase2Deg: 0,
      showConstructiveHyperbolas: true,
      showDestructiveHyperbolas: true,
      probePoint: { x: 4.5, y: 1.2 },
    },
  },
];

export const WaveExperimentPresets: React.FC<WaveExperimentPresetsProps> = ({
  currentParams,
  onApplyPreset,
}) => {
  return (
    <div className="bg-[#101D30] border border-slate-800 rounded-xl p-4 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Preset Benchmark Experiments
            </h2>
            <p className="text-[11px] text-slate-400">
              Curated Class 11 & Class 12 physical scenarios
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Preset Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {PRESET_EXPERIMENTS.map((exp) => (
          <div
            key={exp.id}
            className="p-3.5 rounded-lg bg-[#07111F] border border-slate-800 hover:border-cyan-500/50 hover:bg-[#0c182a] transition-all flex flex-col justify-between space-y-2.5"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs font-bold text-white">{exp.name}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                  {exp.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
                {exp.explanation}
              </p>
            </div>

            <button
              onClick={() => onApplyPreset(exp.params, exp.mode)}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 rounded-md transition-colors cursor-pointer group"
            >
              <span>Load Preset</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
