/**
 * EQUATION 1 — Inclined Plane Presets Explorer Modal
 * Curated presets for Galileo's incline, angle of repose, force overcoming friction, and stick-and-slide.
 */

import React from 'react';
import { INCLINE_PRESETS } from '../../physics/incline/model';
import { InclinePreset } from '../../physics/incline/types';
import { X, Sparkles, ArrowRight } from 'lucide-react';

interface InclinePresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: InclinePreset) => void;
}

export const InclinePresetsModal: React.FC<InclinePresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-xl bg-[#0b101b] border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                Inclined Plane Scenario Presets
              </h2>
              <p className="text-xs text-slate-400">
                Explore canonical inclined plane physical dynamics scenarios
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close presets modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of Presets */}
        <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
          {INCLINE_PRESETS.map((preset: InclinePreset) => {
            const modeBadgeMap = {
              basic: { label: 'Basic Incline', color: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/40' },
              'force-lab': { label: 'Force Dynamics', color: 'text-blue-300 border-blue-500/40 bg-blue-950/40' },
              'friction-lab': { label: 'Friction & Repose', color: 'text-rose-300 border-rose-500/40 bg-rose-950/40' },
            };
            const badge = modeBadgeMap[preset.mode];

            return (
              <div
                key={preset.id}
                onClick={() => {
                  onSelectPreset(preset);
                  onClose();
                }}
                className="group p-3.5 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 rounded-lg transition-all cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                      {preset.name}
                    </span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded border font-mono ${badge.color}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-0.5" />
                </div>

                <p className="text-xs text-slate-400 line-clamp-2">
                  {preset.description}
                </p>

                <div className="flex flex-wrap gap-3 text-[11px] font-mono text-slate-500 pt-1">
                  <span>θ: <strong className="text-slate-300">{preset.params.angleDeg}°</strong></span>
                  <span>m: <strong className="text-slate-300">{preset.params.mass} kg</strong></span>
                  {preset.params.appliedForceMag > 0 && (
                    <span>F_app: <strong className="text-blue-300">{preset.params.appliedForceMag} N</strong></span>
                  )}
                  {preset.params.frictionEnabled && (
                    <span>μs: <strong className="text-rose-300">{preset.params.staticFrictionCoeff}</strong></span>
                  )}
                  <span>g: <strong className="text-slate-300">{preset.params.gravity.toFixed(2)} m/s²</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
