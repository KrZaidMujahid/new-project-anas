/**
 * EQUATION 1 — Photoelectric Presets Modal (Section 11)
 * 8 functional preset experiment cards:
 * Preset 1: Below Threshold
 * Preset 2: Just Above Threshold
 * Preset 3: High-Frequency Light
 * Preset 4: Change Intensity
 * Preset 5: High Intensity Below Threshold
 * Preset 6: Compare Metals
 * Preset 7: Stopping Potential
 * Preset 8: Intensity vs. Frequency
 */

import React from 'react';
import { X, Sparkles, Sliders, ArrowRight } from 'lucide-react';
import { PhotoelectricParameters, PhotoelectricPreset } from '../../physics/photoelectric/types';
import { PHOTOELECTRIC_PRESETS } from '../../physics/photoelectric/model';

interface PhotoelectricPresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPreset: (params: Partial<PhotoelectricParameters>) => void;
}

export const PhotoelectricPresetsModal: React.FC<PhotoelectricPresetsModalProps> = ({
  isOpen,
  onClose,
  onApplyPreset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
      <div className="bg-[#0B1B31] border border-[#29415F] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#29415F] bg-[#10243D]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#EAF2FF]">
                Curated Preset Experiments
              </h2>
              <p className="text-xs text-[#9FB3CC]">
                Instantly load textbook benchmark scenarios to explore quantum vs. wave principles.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9FB3CC] hover:text-[#EAF2FF] hover:bg-[#142B47] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets Grid */}
        <div className="p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {PHOTOELECTRIC_PRESETS.map((preset) => (
            <div
              key={preset.id}
              className="bg-[#142B47] border border-[#29415F] hover:border-[#38BDF8]/60 p-4 rounded-xl flex flex-col justify-between gap-3 transition-all group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#EAF2FF] group-hover:text-[#38BDF8] transition-colors">
                    {preset.title}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#071426] text-[#FBBF24] border border-[#29415F]">
                    {preset.badge}
                  </span>
                </div>
                <p className="text-xs text-[#9FB3CC] leading-relaxed">
                  {preset.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#29415F]/50">
                <div className="text-[10px] font-mono text-[#9FB3CC]">
                  {preset.params.selectedMetalId?.toUpperCase()} &middot;{' '}
                  {preset.params.frequencyHz
                    ? `${(preset.params.frequencyHz / 1e14).toFixed(1)}e14 Hz`
                    : ''} &middot;{' '}
                  {preset.params.intensityPercent !== undefined
                    ? `${preset.params.intensityPercent}%`
                    : ''}
                </div>

                <button
                  onClick={() => {
                    onApplyPreset(preset.params);
                    onClose();
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#38BDF8] hover:bg-[#0284C7] text-[#071426] transition-colors cursor-pointer shadow-xs"
                >
                  <span>Load Preset</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#29415F] bg-[#10243D] flex items-center justify-between text-xs text-[#9FB3CC]">
          <span>8 pedagogical presets available</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#142B47] hover:bg-[#1A375A] border border-[#29415F] text-[#EAF2FF] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
