/**
 * EQUATION 1 — Collision Results Scientific Summary Banner
 * Compact scientific summary displayed upon collision completion to make
 * conservation laws immediately understandable.
 */

import React from 'react';
import {
  CollisionParameters,
  AnalyticalCollisionResult,
} from '../../physics/collision/types';
import { CheckCircle2, Zap, ArrowRight, Activity, ShieldCheck, Flame } from 'lucide-react';

interface CollisionResultsSummaryProps {
  params: CollisionParameters;
  analytical: AnalyticalCollisionResult;
  hasCollided: boolean;
}

export const CollisionResultsSummary: React.FC<CollisionResultsSummaryProps> = ({
  params,
  analytical,
  hasCollided,
}) => {
  if (!hasCollided && (!analytical.hasCollision || analytical.collisionTime === null)) {
    return null;
  }

  const isPerfectInelastic = params.collisionType === 'perfectly-inelastic';

  return (
    <div className="bg-[#0B1728] border-2 border-cyan-500/40 rounded-xl p-4 select-none space-y-3 shadow-xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#26364D]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
              COLLISION COMPLETE — CONSERVATION LAW SUMMARY
            </h3>
            <span className="text-[10px] text-slate-400">
              Deterministic outcome of {params.collisionType.toUpperCase()} interaction
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            ΔP = 0.000 kg·m/s
          </span>
          <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            {analytical.fractionEnergyRetained > 0.999
              ? '100% K CONSERVED'
              : `${(analytical.fractionEnergyRetained * 100).toFixed(1)}% K RETAINED`}
          </span>
        </div>
      </div>

      {/* Primary 3-Card Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        {/* Momentum Card */}
        <div className="bg-[#07111F] p-3 rounded-lg border border-[#26364D] space-y-1.5">
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
            Linear Momentum
          </span>
          <div className="flex justify-between text-slate-300">
            <span>Initial Momentum:</span>
            <span className="font-bold text-white">{analytical.P_total_before.toFixed(2)} kg·m/s</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Final Momentum:</span>
            <span className="font-bold text-cyan-300">{analytical.P_total_after.toFixed(2)} kg·m/s</span>
          </div>
          <div className="flex justify-between text-emerald-400 font-bold border-t border-[#1E293B] pt-1">
            <span>Momentum Error:</span>
            <span>{Math.abs(analytical.momentumError).toFixed(6)} kg·m/s</span>
          </div>
        </div>

        {/* Kinetic Energy Card */}
        <div className="bg-[#07111F] p-3 rounded-lg border border-[#26364D] space-y-1.5">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
            Kinetic Energy
          </span>
          <div className="flex justify-between text-slate-300">
            <span>Initial Energy (K):</span>
            <span className="font-bold text-white">{analytical.K_total_before.toFixed(2)} J</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Final Energy (K&apos;):</span>
            <span className="font-bold text-amber-300">{analytical.K_total_after.toFixed(2)} J</span>
          </div>
          <div className="flex justify-between text-slate-300 border-t border-[#1E293B] pt-1">
            <span>Energy Lost:</span>
            <span className={analytical.kineticEnergyLost > 0.01 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
              {analytical.kineticEnergyLost.toFixed(2)} J
            </span>
          </div>
        </div>

        {/* Impulse & Collision Dynamics Card */}
        <div className="bg-[#07111F] p-3 rounded-lg border border-[#26364D] space-y-1.5">
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
            Impulse & Force
          </span>
          <div className="flex justify-between text-slate-300">
            <span>Impulse |J|:</span>
            <span className="font-bold text-purple-300">{analytical.impulseMagnitude.toFixed(2)} N·s</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Duration (Δt):</span>
            <span className="font-bold text-white">{analytical.collisionDuration.toFixed(2)} s</span>
          </div>
          <div className="flex justify-between text-slate-300 border-t border-[#1E293B] pt-1">
            <span>Average Force:</span>
            <span className="font-bold text-rose-400">{analytical.averageForce.toFixed(1)} N</span>
          </div>
        </div>
      </div>

      {/* Velocities & Inelastic Coalescence readout */}
      <div className="bg-[#07111F] p-3 rounded-lg border border-[#26364D] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Object 1 Final Velocity (v₁&apos;)</span>
            <span className="text-sm font-bold text-cyan-300">
              {analytical.v1_after >= 0 ? '+' : ''}{analytical.v1_after.toFixed(2)} m/s
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Object 2 Final Velocity (v₂&apos;)</span>
            <span className="text-sm font-bold text-purple-300">
              {analytical.v2_after >= 0 ? '+' : ''}{analytical.v2_after.toFixed(2)} m/s
            </span>
          </div>
        </div>

        {isPerfectInelastic && (
          <div className="bg-amber-950/30 border border-amber-500/40 px-3 py-1.5 rounded-md text-amber-200">
            <span className="text-[9px] uppercase tracking-wider text-amber-400 block font-bold">
              Coalesced Object Properties
            </span>
            <div className="flex items-center gap-3 mt-0.5">
              <span>Combined Mass: <strong>{analytical.combinedMass.toFixed(2)} kg</strong></span>
              <span>Final Velocity: <strong>{analytical.finalCombinedVelocity >= 0 ? '+' : ''}{analytical.finalCombinedVelocity.toFixed(2)} m/s</strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
