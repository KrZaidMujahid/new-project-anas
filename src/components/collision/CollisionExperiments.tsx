/**
 * EQUATION 1 — Collision & Momentum Guided Experiments Laboratory
 * 8 Interactive scientific experiments exploring conservation laws,
 * mass ratios, restitution effects, and impulse-force dynamics.
 */

import React from 'react';
import { CollisionParameters, CollisionType } from '../../physics/collision/types';
import { Compass, Play, Sparkles, Check, ArrowRight } from 'lucide-react';

interface CollisionExperimentsProps {
  currentParams: CollisionParameters;
  onApplyExperiment: (params: CollisionParameters) => void;
}

interface ExperimentItem {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  scientificGoal: string;
  params: CollisionParameters;
}

const EXPERIMENTS: ExperimentItem[] = [
  {
    id: 'exp-1',
    number: 1,
    title: 'Equal Masses & Velocity Swap',
    subtitle: 'Ideal elastic collision with m₁ = m₂',
    description:
      'When two identical masses collide elastically with one at rest, Object 1 transfers 100% of its kinetic energy and velocity to Object 2, coming to a dead stop.',
    scientificGoal: "Verify that v₁' = 0 and v₂' = v₁ when m₁ = m₂ and v₂ = 0.",
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
    id: 'exp-2',
    number: 2,
    title: 'Heavy vs Light (Mass Ratio Dynamics)',
    subtitle: 'Massive projectile striking a light stationary target',
    description:
      'Object 1 is 5× more massive than Object 2. Observe how the massive projectile barely slows down while catapulting the lighter target forward at nearly twice the initial speed.',
    scientificGoal: "As m₁ ≫ m₂, v₂' approaches 2·v₁ while v₁' ≈ v₁.",
    params: {
      collisionType: 'elastic',
      m1: 5.0,
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
    id: 'exp-3',
    number: 3,
    title: 'Light Striking Massive Stationary Wall',
    subtitle: 'Light mass colliding into heavy target',
    description:
      'A 1 kg object strikes a 6 kg stationary object. Object 1 rebounds backward (v₁\' < 0), transmitting positive momentum to Object 2.',
    scientificGoal: "Observe momentum sign reversal: p₁ becomes negative while total P remains constant.",
    params: {
      collisionType: 'elastic',
      m1: 1.0,
      v1: 6.0,
      x1: 1.0,
      m2: 6.0,
      v2: 0.0,
      x2: 7.0,
      restitution: 1.0,
      collisionDuration: 0.05,
    },
  },
  {
    id: 'exp-4',
    number: 4,
    title: 'Head-On Symmetrical Collision',
    subtitle: 'Opposite velocity vectors with identical masses',
    description:
      'Two 3 kg carts approach each other at +4 m/s and -4 m/s. The total system momentum is exactly 0 kg·m/s before and after collision.',
    scientificGoal: "Prove that P_total = 0 throughout the collision while individual momenta mirror and reverse.",
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
    id: 'exp-5',
    number: 5,
    title: 'Elastic vs Inelastic Comparison',
    subtitle: 'Partially inelastic collision with e = 0.5',
    description:
      'With coefficient of restitution e = 0.50, momentum is perfectly preserved, but kinetic energy drops due to internal dissipation.',
    scientificGoal: "Measure the exact kinetic energy dissipation: ΔK_lost = ½ μ (1 - e²)(v₁ - v₂)², where μ is reduced mass.",
    params: {
      collisionType: 'inelastic',
      m1: 2.0,
      v1: 6.0,
      x1: 1.0,
      m2: 2.0,
      v2: 0.0,
      x2: 7.0,
      restitution: 0.5,
      collisionDuration: 0.05,
    },
  },
  {
    id: 'exp-6',
    number: 6,
    title: 'Perfect Inelastic Coalescence',
    subtitle: 'Complete adhesion: carts stick together (e = 0.0)',
    description:
      'Object 1 (2 kg, 5 m/s) hits stationary Object 2 (3 kg). The carts latch together and move as a combined 5 kg body at exactly 2.0 m/s.',
    scientificGoal: "Confirm v_final = (m₁v₁ + m₂v₂) / (m₁ + m₂) and observe maximum kinetic energy loss.",
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
    id: 'exp-7',
    number: 7,
    title: 'Varying Restitution e from 0.1 to 0.9',
    subtitle: 'High-restitution bounce (e = 0.85)',
    description:
      'Demonstrates the continuum between rubber-like elastic rebound and plastic deformation. Relative separation velocity is 85% of approach velocity.',
    scientificGoal: "Confirm that |v₂' - v₁'| = e · |v₁ - v₂| holds continuously.",
    params: {
      collisionType: 'inelastic',
      m1: 3.0,
      v1: 5.0,
      x1: 1.0,
      m2: 2.0,
      v2: -1.0,
      x2: 8.0,
      restitution: 0.85,
      collisionDuration: 0.05,
    },
  },
  {
    id: 'exp-8',
    number: 8,
    title: 'Impulse, Duration & Collision Force',
    subtitle: 'Elongated contact duration (Δt = 0.15s)',
    description:
      'Increasing collision duration cushions the impact: the total impulse J remains identical, but the peak and average forces are drastically reduced.',
    scientificGoal: "Demonstrate that F_avg = Δp / Δt: tripling Δt cuts average contact force by 3×.",
    params: {
      collisionType: 'elastic',
      m1: 3.0,
      v1: 6.0,
      x1: 1.0,
      m2: 3.0,
      v2: 0.0,
      x2: 7.0,
      restitution: 1.0,
      collisionDuration: 0.15,
    },
  },
];

export const CollisionExperiments: React.FC<CollisionExperimentsProps> = ({
  currentParams,
  onApplyExperiment,
}) => {
  return (
    <div className="bg-[#0B1728] border border-[#26364D] rounded-xl p-4 select-none space-y-4 shadow-lg text-xs">
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-[#26364D]">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#F1F5F9]">
            Guided Scientific Experiments (8 Laboratory Investigations)
          </h2>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Interactive Scenarios
        </span>
      </div>

      <p className="text-[11px] text-slate-400 leading-relaxed">
        Select an experiment below to instantly configure apparatus parameters and investigate fundamental momentum conservation, restitution ratios, and impulse dynamics.
      </p>

      {/* Experiment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {EXPERIMENTS.map((exp) => {
          const isCurrent =
            currentParams.collisionType === exp.params.collisionType &&
            currentParams.m1 === exp.params.m1 &&
            currentParams.m2 === exp.params.m2 &&
            currentParams.v1 === exp.params.v1 &&
            currentParams.v2 === exp.params.v2;

          return (
            <div
              key={exp.id}
              className={`p-3.5 rounded-lg border transition-all flex flex-col justify-between space-y-2.5 ${
                isCurrent
                  ? 'bg-cyan-950/20 border-cyan-500/50 shadow-sm'
                  : 'bg-[#07111F] border-[#26364D] hover:border-slate-700'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                    Exp {exp.number}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {exp.params.collisionType}
                  </span>
                </div>

                <h3 className="font-bold text-white text-xs">{exp.title}</h3>
                <p className="text-[10px] font-mono text-cyan-400/90">{exp.subtitle}</p>
                <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                  {exp.description}
                </p>

                <div className="bg-[#101D30] p-2 rounded text-[10px] font-mono text-emerald-300 border border-slate-800">
                  <span className="text-slate-500 block text-[9px] uppercase">Goal:</span>
                  {exp.scientificGoal}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onApplyExperiment(exp.params)}
                className={`w-full py-1.5 px-3 rounded font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/40'
                    : 'bg-[#101D30] hover:bg-[#17263B] text-slate-200 border border-[#26364D] hover:border-cyan-500/40'
                }`}
              >
                {isCurrent ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Loaded in Simulation</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-cyan-400 fill-current" />
                    <span>Load Experiment {exp.number}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
