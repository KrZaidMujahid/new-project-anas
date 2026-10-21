/**
 * EQUATION 1 — Carnot Engine Presets Modal
 * Instant configuration scenarios for classroom demonstrations,
 * historical engines, cryogenic machines, and extreme thermal boundaries.
 */

import React from 'react';
import { X, Sparkles, Sliders, CheckCircle2 } from 'lucide-react';
import { CarnotParameters } from '../../physics/carnot/types';

interface PresetItem {
  id: string;
  category: 'Benchmark' | 'Historical' | 'Modern Power' | 'Cryogenics';
  title: string;
  subtitle: string;
  params: CarnotParameters;
  description: string;
  efficiencyPercent: number;
}

export const PRESET_SCENARIOS: PresetItem[] = [
  {
    id: 'classroom-50',
    category: 'Benchmark',
    title: 'Standard Textbook Benchmark',
    subtitle: 'T_H = 600 K, T_C = 300 K (η = 50.0%)',
    params: {
      tHotK: 600,
      tColdK: 300,
      moles: 1.0,
      initialVolumeL: 2.0,
      gasType: 'diatomic',
      numCycles: 1,
    },
    description: 'The prototypical physics textbook example demonstrating exact 50% Carnot theoretical efficiency.',
    efficiencyPercent: 50.0,
  },
  {
    id: 'watt-steam',
    category: 'Historical',
    title: 'James Watt Atmospheric Steam Engine',
    subtitle: 'T_H = 373 K, T_C = 293 K (η = 21.4%)',
    params: {
      tHotK: 373,
      tColdK: 293,
      moles: 1.2,
      initialVolumeL: 3.0,
      gasType: 'diatomic',
      numCycles: 1,
    },
    description: 'Early industrial revolution steam power operating between boiling water (100°C) and river cooling water (20°C).',
    efficiencyPercent: 21.4,
  },
  {
    id: 'gas-turbine',
    category: 'Modern Power',
    title: 'Supercritical Gas Turbine Combined Cycle',
    subtitle: 'T_H = 850 K, T_C = 300 K (η = 64.7%)',
    params: {
      tHotK: 850,
      tColdK: 300,
      moles: 1.5,
      initialVolumeL: 1.5,
      gasType: 'diatomic',
      numCycles: 1,
    },
    description: 'State-of-the-art combined cycle natural gas power plant operating at high turbine inlet temperature.',
    efficiencyPercent: 64.7,
  },
  {
    id: 'cryogenic-cooler',
    category: 'Cryogenics',
    title: 'Liquid Nitrogen Cryogenic Cooler',
    subtitle: 'T_H = 300 K, T_C = 120 K (η = 60.0%)',
    params: {
      tHotK: 300,
      tColdK: 120,
      moles: 0.8,
      initialVolumeL: 2.0,
      gasType: 'monatomic',
      numCycles: 1,
    },
    description: 'Room-temperature heat rejection into a deep cryogenic nitrogen bath using helium working gas (γ = 5/3).',
    efficiencyPercent: 60.0,
  },
  {
    id: 'otec-low-dt',
    category: 'Benchmark',
    title: 'Ocean Thermal Energy Conversion (OTEC)',
    subtitle: 'T_H = 310 K, T_C = 280 K (η = 9.7%)',
    params: {
      tHotK: 310,
      tColdK: 280,
      moles: 2.0,
      initialVolumeL: 4.0,
      gasType: 'diatomic',
      numCycles: 1,
    },
    description: 'Harvesting thermal energy between tropical ocean surface water (37°C) and deep oceanic water (7°C).',
    efficiencyPercent: 9.7,
  },
  {
    id: 'extreme-fusion',
    category: 'Modern Power',
    title: 'Ultra-High Temperature Ceramic Boundary',
    subtitle: 'T_H = 1000 K, T_C = 300 K (η = 70.0%)',
    params: {
      tHotK: 1000,
      tColdK: 300,
      moles: 1.0,
      initialVolumeL: 1.0,
      gasType: 'monatomic',
      numCycles: 1,
    },
    description: 'Upper thermal structural limit of advanced ceramic heat exchangers achieving 70% thermal conversion efficiency.',
    efficiencyPercent: 70.0,
  },
];

interface CarnotPresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (params: CarnotParameters) => void;
}

export const CarnotPresetsModal: React.FC<CarnotPresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#102740] border border-[#29445F] rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#29445F] flex items-center justify-between bg-[#0B1F36]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Carnot Heat Engine Presets & Pedagogical Scenarios
              </h2>
              <p className="text-xs text-[#AFC2D8]">
                Instantly load calibrated thermodynamic systems and historical benchmarks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#AFC2D8] hover:text-white hover:bg-[#16334F] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRESET_SCENARIOS.map((preset) => (
              <div
                key={preset.id}
                className="p-4 rounded-xl bg-[#0B1F36] border border-[#29445F] hover:border-[#38BDF8] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#38BDF8] font-bold">
                      {preset.category}
                    </span>
                    <span className="text-xs font-mono font-black text-[#4ADE80]">
                      η = {preset.efficiencyPercent.toFixed(1)}%
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mt-1 group-hover:text-[#38BDF8] transition-colors">
                    {preset.title}
                  </h3>
                  <div className="text-xs font-mono text-[#AFC2D8] mt-0.5">
                    {preset.subtitle}
                  </div>
                  <p className="text-xs text-[#AFC2D8] mt-2 leading-relaxed">
                    {preset.description}
                  </p>

                  <div className="mt-3 pt-2 border-t border-[#29445F]/60 flex flex-wrap gap-2 text-[10px] font-mono text-slate-400">
                    <span>n = {preset.params.moles} mol</span>
                    <span>·</span>
                    <span>V_A = {preset.params.initialVolumeL} L</span>
                    <span>·</span>
                    <span className="capitalize">{preset.params.gasType}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectPreset(preset.params);
                    onClose();
                  }}
                  className="mt-4 w-full py-2 px-4 rounded-lg bg-[#16334F] hover:bg-[#38BDF8] hover:text-slate-950 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 border border-[#29445F] hover:border-[#38BDF8]"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Load Setup into Engine</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#29445F] bg-[#0B1F36] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#16334F] text-[#AFC2D8] hover:text-white text-xs font-semibold cursor-pointer border border-[#29445F]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
