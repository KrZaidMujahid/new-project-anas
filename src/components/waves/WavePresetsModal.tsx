/**
 * EQUATION 1 — Wave Interference Presets Catalog Modal
 * Benchmark presets for constructive, destructive, partial, standing waves, beats, and point-source geometries.
 */

import React from 'react';
import { WavePreset, WaveSuperpositionParameters, TwoSourceParameters } from '../../physics/waves/types';
import { X, Sparkles, ArrowRight, Waves } from 'lucide-react';

interface WavePresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSuperpositionPreset: (params: Partial<WaveSuperpositionParameters>) => void;
  onSelectTwoSourcePreset: (params: Partial<TwoSourceParameters>) => void;
}

export const WAVE_PRESETS: WavePreset[] = [
  {
    id: 'constructive',
    name: 'Pure Constructive Interference',
    category: 'superposition',
    description: 'Two identical waves in phase (Δφ = 0°). Complete reinforcement yielding resultant amplitude 2A = 2.0 m.',
    params: {
      wave1: { amplitude: 1.0, wavelength: 3.0, frequency: 1.0, initialPhaseDeg: 0, direction: 'forward', visible: true },
      wave2: { amplitude: 1.0, wavelength: 3.0, frequency: 1.0, initialPhaseDeg: 0, direction: 'forward', visible: true },
      sameMediumLocked: true,
      showResultant: true,
    },
  },
  {
    id: 'destructive',
    name: 'Complete Destructive Cancellation',
    category: 'superposition',
    description: 'Two identical waves exactly in anti-phase (Δφ = 180°). Resultant amplitude cancels strictly to 0 at every point.',
    params: {
      wave1: { amplitude: 1.0, wavelength: 3.0, frequency: 1.0, initialPhaseDeg: 0, direction: 'forward', visible: true },
      wave2: { amplitude: 1.0, wavelength: 3.0, frequency: 1.0, initialPhaseDeg: 180, direction: 'forward', visible: true },
      sameMediumLocked: true,
      showResultant: true,
    },
  },
  {
    id: 'partial-quadrature',
    name: 'Quadrature Partial Interference (90°)',
    category: 'superposition',
    description: 'Phase difference of π/2 rad (90°). Resultant amplitude A_R = √(1² + 1²) = √2 ≈ 1.414 m.',
    params: {
      wave1: { amplitude: 1.0, wavelength: 3.0, frequency: 1.0, initialPhaseDeg: 0, direction: 'forward', visible: true },
      wave2: { amplitude: 1.0, wavelength: 3.0, frequency: 1.0, initialPhaseDeg: 90, direction: 'forward', visible: true },
      sameMediumLocked: true,
      showResultant: true,
    },
  },
  {
    id: 'standing-wave',
    name: 'Stationary Standing Wave',
    category: 'superposition',
    description: 'Two identical waves propagating in opposite directions (+x and -x). Forms stationary nodal points of zero motion and resonant antinodes.',
    params: {
      wave1: { amplitude: 0.9, wavelength: 3.0, frequency: 1.0, initialPhaseDeg: 0, direction: 'forward', visible: true },
      wave2: { amplitude: 0.9, wavelength: 3.0, frequency: 1.0, initialPhaseDeg: 0, direction: 'backward', visible: true },
      sameMediumLocked: true,
      showResultant: true,
    },
  },
  {
    id: 'acoustic-beats',
    name: 'Acoustic Beats (Slightly Different Frequencies)',
    category: 'superposition',
    description: 'f₁ = 1.0 Hz and f₂ = 1.25 Hz. Modulates resultant envelope at beat frequency f_beat = |f₁ - f₂| = 0.25 Hz.',
    params: {
      wave1: { amplitude: 0.9, wavelength: 3.0, frequency: 1.0, initialPhaseDeg: 0, direction: 'forward', visible: true },
      wave2: { amplitude: 0.9, wavelength: 2.4, frequency: 1.25, initialPhaseDeg: 0, direction: 'forward', visible: true },
      sameMediumLocked: false,
      showResultant: true,
    },
  },
  {
    id: 'unequal-amplitudes',
    name: 'Unequal Amplitudes (Incomplete Cancellation)',
    category: 'superposition',
    description: 'A₁ = 1.6 m, A₂ = 0.6 m with Δφ = 180°. Leaves residual minimum amplitude of 1.0 m (contrast reduction).',
    params: {
      wave1: { amplitude: 1.6, wavelength: 3.0, frequency: 1.0, initialPhaseDeg: 0, direction: 'forward', visible: true },
      wave2: { amplitude: 0.6, wavelength: 3.0, frequency: 1.0, initialPhaseDeg: 180, direction: 'forward', visible: true },
      sameMediumLocked: true,
      showResultant: true,
    },
  },
  {
    id: 'young-double-slit',
    name: '2D Coherent Double-Source Pattern',
    category: 'two-source',
    description: 'Standard two-point source interference (d = 3.0 m, λ = 1.0 m) generating alternating hyperbolic nodal and antinodal fringe rays.',
    params: {
      separation: 3.0,
      wavelength: 1.0,
      frequency: 1.5,
      sourcePhase1Deg: 0,
      sourcePhase2Deg: 0,
      renderMode: 'field',
      showConstructiveHyperbolas: true,
      showDestructiveHyperbolas: true,
    },
  },
  {
    id: 'fine-fringes',
    name: '2D Fine High-Density Fringes (Large d/λ)',
    category: 'two-source',
    description: 'Large separation to wavelength ratio (d = 5.0 m, λ = 0.6 m). Produces a dense array of fine angular fringes.',
    params: {
      separation: 5.0,
      wavelength: 0.6,
      frequency: 2.0,
      sourcePhase1Deg: 0,
      sourcePhase2Deg: 0,
      renderMode: 'field',
      showConstructiveHyperbolas: true,
      showDestructiveHyperbolas: true,
    },
  },
];

export const WavePresetsModal: React.FC<WavePresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectSuperpositionPreset,
  onSelectTwoSourcePreset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#090d16] border border-slate-800 rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-[#07090e]">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Wave Interference Presets
              </h2>
              <p className="text-xs text-slate-400">
                Validated physical scenarios: constructive, destructive, beats, standing waves
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-3">
          {WAVE_PRESETS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => {
                if (preset.category === 'superposition') {
                  onSelectSuperpositionPreset(preset.params);
                } else {
                  onSelectTwoSourcePreset(preset.params);
                }
                onClose();
              }}
              className="p-4 rounded-lg bg-[#07090e] border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-950/20 transition-all cursor-pointer group flex items-start justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                    {preset.name}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                    {preset.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {preset.description}
                </p>
              </div>

              <button className="px-3 py-1.5 rounded-md text-xs font-semibold text-cyan-300 bg-cyan-950/40 group-hover:bg-cyan-500 group-hover:text-slate-950 border border-cyan-500/30 transition-all shrink-0 flex items-center gap-1 mt-1">
                <span>Load</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
