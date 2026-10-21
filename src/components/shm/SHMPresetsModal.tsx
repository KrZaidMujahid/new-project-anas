/**
 * EQUATION 1 — Simple Harmonic Motion Presets Catalog Modal
 * Curated scientific physical scenarios across horizontal springs, vertical springs, and pendulums.
 */

import React from 'react';
import { SHMPreset, SHMParameters } from '../../physics/shm/types';
import { X, Sparkles, ArrowRight, Activity, Compass, Scale } from 'lucide-react';

interface SHMPresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: SHMPreset) => void;
}

export const SHM_PRESETS: SHMPreset[] = [
  {
    id: 'standard-benchmark',
    name: 'Standard Laboratory Benchmark',
    systemType: 'horizontal-spring',
    description: 'Textbook standard mass-spring configuration (m = 1.0 kg, k = 20 N/m, A = 0.20 m) with ω = √20 ≈ 4.47 rad/s.',
    tags: ['Standard', 'Textbook', 'Benchmark'],
    params: {
      systemType: 'horizontal-spring',
      mass: 1.0,
      springConstant: 20.0,
      amplitude: 0.20,
      initialPhaseDeg: 0,
      inputMode: 'amplitude-phase',
    },
  },
  {
    id: 'heavy-inertia',
    name: 'Heavy Inertia Oscillator',
    systemType: 'horizontal-spring',
    description: 'High mass with moderate spring constant produces slow, majestic oscillations (T = 3.14 s, f = 0.32 Hz).',
    tags: ['High Inertia', 'Slow Period'],
    params: {
      systemType: 'horizontal-spring',
      mass: 4.0,
      springConstant: 16.0,
      amplitude: 0.25,
      initialPhaseDeg: 0,
      inputMode: 'amplitude-phase',
    },
  },
  {
    id: 'high-freq-stiff',
    name: 'High-Frequency Stiff Spring',
    systemType: 'horizontal-spring',
    description: 'Lightweight mass paired with stiff spring (k = 80 N/m, m = 0.2 kg) producing rapid oscillations (f = 3.18 Hz).',
    tags: ['High Frequency', 'Stiff Spring'],
    params: {
      systemType: 'horizontal-spring',
      mass: 0.2,
      springConstant: 80.0,
      amplitude: 0.08,
      initialPhaseDeg: 0,
      inputMode: 'amplitude-phase',
    },
  },
  {
    id: 'vertical-earth',
    name: 'Vertical Spring on Earth',
    systemType: 'vertical-spring',
    description: 'Suspended spring under Earth gravity (g = 9.8 m/s²). Demonstrates static extension ΔL = 49 cm with stable oscillation about equilibrium.',
    tags: ['Vertical', 'Earth Gravity', 'Static Stretch'],
    params: {
      systemType: 'vertical-spring',
      mass: 1.0,
      springConstant: 20.0,
      amplitude: 0.15,
      gravity: 9.8,
      initialPhaseDeg: 0,
      inputMode: 'amplitude-phase',
    },
  },
  {
    id: 'vertical-moon',
    name: 'Vertical Spring on the Moon',
    systemType: 'vertical-spring',
    description: 'Suspended spring on the lunar surface (g = 1.62 m/s²). Static extension drops to 8.1 cm while period T = 1.405 s remains identical to Earth!',
    tags: ['Vertical', 'Lunar Gravity', 'Isochronous'],
    params: {
      systemType: 'vertical-spring',
      mass: 1.0,
      springConstant: 20.0,
      amplitude: 0.15,
      gravity: 1.62,
      initialPhaseDeg: 0,
      inputMode: 'amplitude-phase',
    },
  },
  {
    id: 'seconds-pendulum',
    name: 'Grandfather "Seconds" Pendulum',
    systemType: 'pendulum',
    description: 'Classic horological pendulum where L = 0.994 m produces a half-period of exactly 1 second (full period T = 2.0 s).',
    tags: ['Pendulum', 'Horology', 'Small Angle'],
    params: {
      systemType: 'pendulum',
      mass: 1.0,
      pendulumLength: 0.994,
      pendulumInitialAngleDeg: 10,
      gravity: 9.80,
      initialPhaseDeg: 0,
    },
  },
  {
    id: 'rapid-pendulum',
    name: 'Short Rapid Pendulum',
    systemType: 'pendulum',
    description: 'Compact pendulum (L = 0.25 m) oscillating with period T = 1.00 s at small release angle.',
    tags: ['Pendulum', 'Rapid'],
    params: {
      systemType: 'pendulum',
      mass: 0.5,
      pendulumLength: 0.248,
      pendulumInitialAngleDeg: 8,
      gravity: 9.80,
      initialPhaseDeg: 0,
    },
  },
];

export const SHMPresetsModal: React.FC<SHMPresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
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
                Simple Harmonic Motion Presets
              </h2>
              <p className="text-xs text-slate-400">
                Validated physical configurations & benchmarks
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
          {SHM_PRESETS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className="p-4 rounded-lg bg-[#07090e] border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-950/20 transition-all cursor-pointer group flex items-start justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                    {preset.name}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                    {preset.systemType}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {preset.description}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  {preset.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono text-slate-500"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
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
