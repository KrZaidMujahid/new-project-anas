/**
 * EQUATION 1 — Circular Motion Presets Modal
 * Instant access to canonical textbook circular motion scenarios, benchmark tests, and scaling demonstrators.
 */

import React from 'react';
import { CircularParameters, CircularPreset } from '../../physics/circular/types';
import { Sparkles, X, Check } from 'lucide-react';

interface CircularPresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (params: CircularParameters) => void;
  currentParams: CircularParameters;
}

const PRESETS: CircularPreset[] = [
  {
    id: 'preset-1',
    name: 'Preset 1: Textbook Benchmark (r = 5m, ω = 2rad/s, m = 1kg)',
    category: 'Canonical Benchmarks',
    description: 'Standard physics problem testing linear velocity v = rω and centripetal acceleration a_c = rω².',
    expectedOutcome: 'v = 10.00 m/s, a_c = 20.00 m/s², F_c = 20.00 N',
    params: {
      mass: 1.0,
      radius: 5.0,
      angularVelocity: 2.0,
      initialAngleDeg: 0,
    },
  },
  {
    id: 'preset-2',
    name: 'Preset 2: Doubled Mass Comparison (m = 2kg, r = 5m, ω = 2rad/s)',
    category: 'Canonical Benchmarks',
    description: 'Doubling mass doubles required centripetal force while keeping centripetal acceleration unchanged.',
    expectedOutcome: 'v = 10.00 m/s, a_c = 20.00 m/s², F_c = 40.00 N',
    params: {
      mass: 2.0,
      radius: 5.0,
      angularVelocity: 2.0,
      initialAngleDeg: 0,
    },
  },
  {
    id: 'preset-3',
    name: 'Preset 3: High Angular Speed (r = 2m, ω = 4rad/s)',
    category: 'Canonical Benchmarks',
    description: 'Compact radius with high rotation speed demonstrating quadratic acceleration a_c = rω² = 2×16 = 32 m/s².',
    expectedOutcome: 'v = 8.00 m/s, a_c = 32.00 m/s², F_c = 32.00 N',
    params: {
      mass: 1.0,
      radius: 2.0,
      angularVelocity: 4.0,
      initialAngleDeg: 0,
    },
  },
  {
    id: 'preset-default',
    name: 'Default Circular Motion (r = 3m, ω = 2rad/s, m = 2kg)',
    category: 'Standard Orbits',
    description: 'Balanced visual baseline for exploring vector tangents and centripetal force components.',
    expectedOutcome: 'v = 6.00 m/s, a_c = 12.00 m/s², F_c = 24.00 N',
    params: {
      mass: 2.0,
      radius: 3.0,
      angularVelocity: 2.0,
      initialAngleDeg: 0,
    },
  },
  {
    id: 'preset-slow',
    name: 'Slow Circular Motion (r = 3m, ω = 1rad/s)',
    category: 'Speed Variations',
    description: 'Low rotational speed allowing close inspection of vector tangent and radial orientations.',
    expectedOutcome: 'v = 3.00 m/s, a_c = 3.00 m/s², T = 6.28 s',
    params: {
      mass: 1.5,
      radius: 3.0,
      angularVelocity: 1.0,
      initialAngleDeg: 0,
    },
  },
  {
    id: 'preset-fast',
    name: 'Fast Circular Motion (r = 3m, ω = 4rad/s)',
    category: 'Speed Variations',
    description: 'High rotational velocity showcasing rapid periodic oscillations in x(t) and y(t).',
    expectedOutcome: 'v = 12.00 m/s, a_c = 48.00 m/s², T = 1.57 s',
    params: {
      mass: 1.5,
      radius: 3.0,
      angularVelocity: 4.0,
      initialAngleDeg: 0,
    },
  },
  {
    id: 'preset-small-radius',
    name: 'Small Radius Orbit (r = 1m, ω = 2rad/s)',
    category: 'Radius Variations',
    description: 'Tight orbit illustrating reduced linear speed at fixed angular velocity.',
    expectedOutcome: 'v = 2.00 m/s, a_c = 4.00 m/s²',
    params: {
      mass: 1.0,
      radius: 1.0,
      angularVelocity: 2.0,
      initialAngleDeg: 0,
    },
  },
  {
    id: 'preset-large-radius',
    name: 'Large Radius Orbit (r = 6m, ω = 2rad/s)',
    category: 'Radius Variations',
    description: 'Expansive trajectory with long radius line demonstrating increased linear speed v = 12 m/s.',
    expectedOutcome: 'v = 12.00 m/s, a_c = 24.00 m/s²',
    params: {
      mass: 1.0,
      radius: 6.0,
      angularVelocity: 2.0,
      initialAngleDeg: 0,
    },
  },
  {
    id: 'preset-light-mass',
    name: 'Light Mass Bead (m = 0.5kg, r = 4m, ω = 2rad/s)',
    category: 'Mass Variations',
    description: 'Minimal inertia requiring low centripetal force for orbit maintenance.',
    expectedOutcome: 'F_c = 8.00 N, a_c = 16.00 m/s²',
    params: {
      mass: 0.5,
      radius: 4.0,
      angularVelocity: 2.0,
      initialAngleDeg: 0,
    },
  },
  {
    id: 'preset-heavy-mass',
    name: 'Heavy Mass Body (m = 5kg, r = 4m, ω = 2rad/s)',
    category: 'Mass Variations',
    description: 'High mass illustrating large required centripetal tension without altering acceleration.',
    expectedOutcome: 'F_c = 80.00 N, a_c = 16.00 m/s²',
    params: {
      mass: 5.0,
      radius: 4.0,
      angularVelocity: 2.0,
      initialAngleDeg: 0,
    },
  },
];

export const CircularPresetsModal: React.FC<CircularPresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
  currentParams,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-3xl bg-[#0B1728] border border-[#26364D] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#26364D] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                Circular Motion Preset Physics Scenarios
              </h2>
              <p className="text-xs text-slate-400">
                Textbook benchmarks, radius scaling demonstrators, and mass variations
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

        {/* Preset Cards List */}
        <div className="p-6 space-y-3 overflow-y-auto text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PRESETS.map((p) => {
              const isSelected =
                Math.abs(currentParams.radius - p.params.radius) < 0.01 &&
                Math.abs(currentParams.angularVelocity - p.params.angularVelocity) < 0.01 &&
                Math.abs(currentParams.mass - p.params.mass) < 0.01;

              return (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectPreset(p.params);
                    onClose();
                  }}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-cyan-950/20 border-cyan-500/50 shadow-sm'
                      : 'bg-[#07111F] border-[#26364D] hover:border-cyan-500/40'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
                        {p.category}
                      </span>
                      {isSelected && (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-300 font-bold">
                          <Check className="w-3 h-3 text-cyan-400" />
                          <span>Active</span>
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-white text-xs">{p.name}</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  <div className="bg-[#101D30] p-2 rounded text-[10px] font-mono text-emerald-300 border border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase">Expected:</span>
                    {p.expectedOutcome}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
