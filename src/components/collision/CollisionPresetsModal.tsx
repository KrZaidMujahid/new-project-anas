/**
 * EQUATION 1 — Collision & Momentum Presets Modal
 * Instant access to canonical textbook collision scenarios, benchmark tests, and corner cases.
 */

import React from 'react';
import { CollisionParameters, CollisionPreset } from '../../physics/collision/types';
import { Sparkles, X, Check, ArrowRight } from 'lucide-react';

interface CollisionPresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (params: CollisionParameters) => void;
  currentParams: CollisionParameters;
}

const PRESETS: CollisionPreset[] = [
  {
    id: 'preset-1',
    name: 'Preset 1: Equal-Mass Elastic Velocity Transfer',
    category: 'Textbook Benchmarks',
    description: 'm₁ = 2 kg, v₁ = 5 m/s, m₂ = 2 kg, v₂ = 0. Object 1 comes to a full stop and Object 2 departs with v₁.',
    expectedOutcome: "v₁' ≈ 0.00 m/s, v₂' ≈ 5.00 m/s",
    params: {
      collisionType: 'elastic',
      m1: 2.0,
      v1: 5.0,
      x1: 1.0,
      m2: 2.0,
      v2: 0.0,
      x2: 7.0,
      restitution: 1.0,
      collisionDuration: 0.05,
    },
  },
  {
    id: 'preset-2',
    name: 'Preset 2: Perfectly Inelastic Coalescence',
    category: 'Textbook Benchmarks',
    description: 'm₁ = 2 kg, v₁ = 5 m/s, m₂ = 3 kg, v₂ = 0. Carts latch together into a 5 kg object.',
    expectedOutcome: 'v_final = (2×5 + 3×0) / 5 = 2.00 m/s',
    params: {
      collisionType: 'perfectly-inelastic',
      m1: 2.0,
      v1: 5.0,
      x1: 1.0,
      m2: 3.0,
      v2: 0.0,
      x2: 7.0,
      restitution: 0.0,
      collisionDuration: 0.05,
    },
  },
  {
    id: 'preset-3',
    name: 'Preset 3: Same Velocity (No Relative Motion)',
    category: 'Invariants & Zero Relatives',
    description: 'Both carts have v₁ = v₂ = 4 m/s separated by 5 meters. No relative approach.',
    expectedOutcome: 'Zero relative velocity, no collision occurs, parallel trajectories.',
    params: {
      collisionType: 'elastic',
      m1: 2.0,
      v1: 4.0,
      x1: 1.0,
      m2: 2.0,
      v2: 4.0,
      x2: 6.0,
      restitution: 1.0,
      collisionDuration: 0.05,
    },
  },
  {
    id: 'preset-4',
    name: 'Preset 4: Zero Initial Velocity',
    category: 'Invariants & Zero Relatives',
    description: 'Both carts at rest at origin. Invariant state p₁ = 0, p₂ = 0, P_total = 0.',
    expectedOutcome: 'p₁ = 0, p₂ = 0, P_total = 0 kg·m/s, zero motion.',
    params: {
      collisionType: 'elastic',
      m1: 3.0,
      v1: 0.0,
      x1: 1.0,
      m2: 3.0,
      v2: 0.0,
      x2: 7.0,
      restitution: 1.0,
      collisionDuration: 0.05,
    },
  },
  {
    id: 'preset-5',
    name: 'Preset 5: Opposite-Direction Symmetrical Head-On',
    category: 'Opposite Directions',
    description: 'm₁ = 3 kg (v₁ = +4 m/s), m₂ = 3 kg (v₂ = -4 m/s). System momentum equals zero.',
    expectedOutcome: "v₁' = -4.00 m/s, v₂' = +4.00 m/s, P_total = 0 kg·m/s",
    params: {
      collisionType: 'elastic',
      m1: 3.0,
      v1: 4.0,
      x1: 1.0,
      m2: 3.0,
      v2: -4.0,
      x2: 9.0,
      restitution: 1.0,
      collisionDuration: 0.05,
    },
  },
  {
    id: 'preset-6',
    name: 'Light vs Heavy Projectile (m₁ = 1 kg, m₂ = 5 kg)',
    category: 'Mass Ratios',
    description: 'Light cart strikes massive cart at rest. Light cart rebounds with negative velocity.',
    expectedOutcome: "v₁' = -2.67 m/s, v₂' = +2.00 m/s",
    params: {
      collisionType: 'elastic',
      m1: 1.0,
      v1: 6.0,
      x1: 1.0,
      m2: 5.0,
      v2: 0.0,
      x2: 7.0,
      restitution: 1.0,
      collisionDuration: 0.05,
    },
  },
  {
    id: 'preset-7',
    name: 'Heavy vs Light Battering Ram (m₁ = 6 kg, m₂ = 1 kg)',
    category: 'Mass Ratios',
    description: 'Massive cart strikes stationary light cart. Light cart is accelerated to near double speed.',
    expectedOutcome: "v₁' = +2.86 m/s, v₂' = +6.86 m/s",
    params: {
      collisionType: 'elastic',
      m1: 6.0,
      v1: 4.0,
      x1: 1.0,
      m2: 1.0,
      v2: 0.0,
      x2: 7.0,
      restitution: 1.0,
      collisionDuration: 0.05,
    },
  },
  {
    id: 'preset-8',
    name: 'Same Direction Overtake / Rear-End Collision',
    category: 'Overtaking',
    description: 'm₁ = 4 kg at 5 m/s catches up to m₂ = 2 kg moving at 2 m/s in the same direction.',
    expectedOutcome: "v₁' = +3.00 m/s, v₂' = +6.00 m/s (both continue moving rightward)",
    params: {
      collisionType: 'elastic',
      m1: 4.0,
      v1: 5.0,
      x1: 1.0,
      m2: 2.0,
      v2: 2.0,
      x2: 7.0,
      restitution: 1.0,
      collisionDuration: 0.05,
    },
  },
  {
    id: 'preset-9',
    name: 'Partially Inelastic Tennis Ball Rebound (e = 0.75)',
    category: 'Inelastic & Restitution',
    description: 'Simulates realistic elastomer or tennis bounce coefficient of restitution.',
    expectedOutcome: 'Relative speed decreases to 75% of initial speed, partial energy loss.',
    params: {
      collisionType: 'inelastic',
      m1: 2.0,
      v1: 5.0,
      x1: 1.0,
      m2: 2.0,
      v2: 0.0,
      x2: 7.0,
      restitution: 0.75,
      collisionDuration: 0.05,
    },
  },
];

export const CollisionPresetsModal: React.FC<CollisionPresetsModalProps> = ({
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
                Collision & Momentum Preset Physics Scenarios
              </h2>
              <p className="text-xs text-slate-400">
                Textbook collision cases, mass ratio benchmarks, and restitution demonstrators
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
                currentParams.collisionType === p.params.collisionType &&
                currentParams.m1 === p.params.m1 &&
                currentParams.m2 === p.params.m2 &&
                currentParams.v1 === p.params.v1 &&
                currentParams.v2 === p.params.v2;

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
