/**
 * EQUATION 1 — Wave Interference Mode Selector Component
 * 5 visualization modes: Two-Source Interference, Constructive Interference,
 * Destructive Interference, Resultant Wave, and Interference Intensity Map.
 */

import React from 'react';
import { InterferenceVisualizationMode } from '../../physics/waves/types';
import { Waves, Sparkles, ShieldX, Activity, Eye } from 'lucide-react';

interface WaveModeSelectorProps {
  activeMode: InterferenceVisualizationMode;
  onSelectMode: (mode: InterferenceVisualizationMode) => void;
}

interface ModeConfig {
  id: InterferenceVisualizationMode;
  title: string;
  subtitle: string;
  condition: string;
  icon: React.ReactNode;
}

const MODES: ModeConfig[] = [
  {
    id: 'two-source',
    title: 'Two-Source Interference',
    subtitle: 'Expanding circular wavefronts & overlapping field',
    condition: 'y_R = y₁ + y₂',
    icon: <Waves className="w-4 h-4 text-cyan-400" />,
  },
  {
    id: 'constructive',
    title: 'Constructive Interference',
    subtitle: 'Waves arrive in phase (Reinforcement up to 2A)',
    condition: 'Δr = nλ',
    icon: <Sparkles className="w-4 h-4 text-yellow-400" />,
  },
  {
    id: 'destructive',
    title: 'Destructive Interference',
    subtitle: 'Waves arrive in opposite phase (Cancellation to 0)',
    condition: 'Δr = (n + ½)λ',
    icon: <ShieldX className="w-4 h-4 text-rose-400" />,
  },
  {
    id: 'resultant',
    title: 'Resultant Wave',
    subtitle: 'Individual waves (Wave 1 & 2) and superposition curve',
    condition: 'A_R = 2A|cos(Δφ/2)|',
    icon: <Activity className="w-4 h-4 text-emerald-400" />,
  },
  {
    id: 'intensity',
    title: 'Interference Intensity Map',
    subtitle: '2D continuous intensity fringes & spatial gradient',
    condition: 'I = I_max cos²(Δφ/2)',
    icon: <Eye className="w-4 h-4 text-purple-400" />,
  },
];

export const WaveModeSelector: React.FC<WaveModeSelectorProps> = ({
  activeMode,
  onSelectMode,
}) => {
  return (
    <div className="w-full bg-[#101D30] border border-slate-800 rounded-xl p-3 shadow-lg">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          Visualization Modes
        </span>
        <span className="text-[11px] text-slate-400">
          Select a mode to inspect specific interference mechanics
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
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
              <div className="flex items-center justify-between w-full mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md ${isActive ? 'bg-cyan-500/20' : 'bg-slate-800/80'}`}>
                    {m.icon}
                  </div>
                  <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {m.title}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-snug line-clamp-2 mb-2">
                {m.subtitle}
              </p>

              <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-500">Condition:</span>
                <span className={`font-semibold ${isActive ? 'text-cyan-300' : 'text-slate-400'}`}>
                  {m.condition}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
