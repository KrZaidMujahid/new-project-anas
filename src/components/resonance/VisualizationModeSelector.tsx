/**
 * EQUATION 1 — Resonance Visualization Mode Selector Component (Section 8)
 * 6 visualization modes:
 * Mode 1: Below Resonance
 * Mode 2: At Resonance
 * Mode 3: Above Resonance
 * Mode 4: Low Damping
 * Mode 5: High Damping
 * Mode 6: Compare Two Systems
 */

import React from 'react';
import { ResonanceVisualizationMode } from '../../physics/resonance/types';
import {
  TrendingDown,
  Sparkles,
  TrendingUp,
  Sliders,
  Layers,
  Activity,
} from 'lucide-react';

interface VisualizationModeSelectorProps {
  activeMode: ResonanceVisualizationMode;
  onSelectMode: (mode: ResonanceVisualizationMode) => void;
}

interface ModeConfig {
  id: ResonanceVisualizationMode;
  title: string;
  badge: string;
  description: string;
  icon: React.ReactNode;
}

const MODES: ModeConfig[] = [
  {
    id: 'below-resonance',
    title: 'Below Resonance',
    badge: 'f_d < f₀',
    description: 'Driver oscillates slower than natural frequency. Small response in phase (φ ≈ 0°).',
    icon: <TrendingDown className="w-4 h-4 text-cyan-400" />,
  },
  {
    id: 'at-resonance',
    title: 'At Resonance',
    badge: 'f_d ≈ f₀',
    description: 'Driver matches natural frequency. Maximal amplitude amplification with 90° phase lag.',
    icon: <Sparkles className="w-4 h-4 text-amber-400" />,
  },
  {
    id: 'above-resonance',
    title: 'Above Resonance',
    badge: 'f_d > f₀',
    description: 'Driver oscillates faster than natural frequency. Amplitude drops with ~180° phase lag.',
    icon: <TrendingUp className="w-4 h-4 text-purple-400" />,
  },
  {
    id: 'low-damping',
    title: 'Low Damping',
    badge: 'c = 0.15, High Q',
    description: 'Low energy dissipation creates a very tall, narrow, sharp resonance peak.',
    icon: <Sliders className="w-4 h-4 text-emerald-400" />,
  },
  {
    id: 'high-damping',
    title: 'High Damping',
    badge: 'c = 2.0, Low Q',
    description: 'Strong dissipation suppresses resonance into a broad, flat, low response.',
    icon: <Activity className="w-4 h-4 text-rose-400" />,
  },
  {
    id: 'compare-two',
    title: 'Compare Two Systems',
    badge: 'Dual Oscillator',
    description: 'Run two independent oscillators side-by-side with overlaid resonance response curves.',
    icon: <Layers className="w-4 h-4 text-cyan-300" />,
  },
];

export const VisualizationModeSelector: React.FC<VisualizationModeSelectorProps> = ({
  activeMode,
  onSelectMode,
}) => {
  return (
    <div className="bg-[#101D30] border border-slate-800 rounded-xl p-3 shadow-lg">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          Visualization & Study Modes
        </span>
        <span className="text-[11px] text-slate-400">
          Switch regimes to explore frequency tuning, damping width, and dual comparisons
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {MODES.map((m) => {
          const isActive = activeMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelectMode(m.id)}
              className={`text-left p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-cyan-950/40 border-cyan-500/70 shadow-md ring-1 ring-cyan-500/30'
                  : 'bg-[#07111F]/70 border-slate-800 hover:border-slate-700 hover:bg-[#0c182a]'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <div className="flex items-center gap-1.5">
                  <div className={`p-1.5 rounded-md ${isActive ? 'bg-cyan-500/20' : 'bg-slate-800/80'}`}>
                    {m.icon}
                  </div>
                  <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {m.title}
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 leading-snug line-clamp-2 mb-2">
                {m.description}
              </p>

              <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-500">Regime:</span>
                <span className={`font-semibold ${isActive ? 'text-cyan-300' : 'text-slate-400'}`}>
                  {m.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
