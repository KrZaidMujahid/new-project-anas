/**
 * EQUATION 1 — Bohr Atom Presets Modal
 * Quick setup modal with calibrated benchmark states, Balmer lines, and Lyman transitions.
 */

import React from 'react';
import { X, Sparkles, Sliders, CheckCircle2 } from 'lucide-react';
import { BohrPreset } from '../../physics/bohr/types';
import { BOHR_PRESETS } from '../../physics/bohr/model';

interface BohrPresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: BohrPreset) => void;
}

export const BohrPresetsModal: React.FC<BohrPresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#10243D] border border-[#29415F] rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#29415F] flex items-center justify-between bg-[#0B1B31]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#818CF8]/10 text-[#818CF8] border border-[#818CF8]/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Bohr Hydrogen Model Presets & Transitions
              </h2>
              <p className="text-xs text-[#9FB3CC]">
                Instantly load calibrated atomic bound states, Balmer emission lines, and Lyman transitions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9FB3CC] hover:text-white hover:bg-[#142B47] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BOHR_PRESETS.map((preset) => (
              <div
                key={preset.id}
                className="p-4 rounded-xl bg-[#0B1B31] border border-[#29415F] hover:border-[#38BDF8] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#38BDF8] font-bold">
                      {preset.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#818CF8]">
                      {preset.isTransition
                        ? `n = ${preset.initialLevel} → ${preset.finalLevel}`
                        : `n = ${preset.initialLevel}`}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mt-1 group-hover:text-[#38BDF8] transition-colors">
                    {preset.title}
                  </h3>
                  <div className="text-xs font-mono text-[#9FB3CC] mt-0.5">
                    {preset.subtitle}
                  </div>
                  <p className="text-xs text-[#9FB3CC] mt-2 leading-relaxed">
                    {preset.description}
                  </p>
                </div>

                <button
                  onClick={() => {
                    onSelectPreset(preset);
                    onClose();
                  }}
                  className="mt-4 w-full py-2 px-4 rounded-lg bg-[#142B47] hover:bg-[#38BDF8] hover:text-slate-950 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 border border-[#29415F] hover:border-[#38BDF8]"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Load Setup into Atom</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#29415F] bg-[#0B1B31] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#142B47] text-[#9FB3CC] hover:text-white text-xs font-semibold cursor-pointer border border-[#29415F]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
