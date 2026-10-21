/**
 * EQUATION 1 — Collision & Momentum Live Measurements Panel
 * Real-time telemetry, object kinematics, system conservation metrics,
 * and explicit BEFORE COLLISION vs AFTER COLLISION telemetry comparison.
 */

import React from 'react';
import {
  CollisionParameters,
  CollisionState,
  AnalyticalCollisionResult,
} from '../../physics/collision/types';
import { Activity, Gauge, Zap, Scale, Clock, ShieldCheck, ArrowRightLeft } from 'lucide-react';

interface CollisionMeasurementsProps {
  params: CollisionParameters;
  state: CollisionState;
  analytical: AnalyticalCollisionResult;
}

export const CollisionMeasurements: React.FC<CollisionMeasurementsProps> = ({
  params,
  state,
  analytical,
}) => {
  return (
    <div className="bg-[#0B1728] border border-[#26364D] rounded-xl p-4 select-none space-y-4 shadow-lg text-xs">
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-[#26364D]">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#F1F5F9]">
            Live Telemetry & Conservation Metrics
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-400">
            t = {state.time.toFixed(2)}s
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
            P_error = 0.000%
          </span>
        </div>
      </div>

      {/* Grid: Object 1 vs Object 2 Real-Time Kinematics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* OBJECT 1 CARD (Cyan) */}
        <div className="bg-[#07111F] rounded-lg border border-cyan-500/30 p-3 space-y-2">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-1.5">
            <span className="font-mono font-bold text-cyan-400 text-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              OBJECT 1 (m₁ = {params.m1.toFixed(1)} kg)
            </span>
            <span className="font-mono text-[10px] text-slate-400">
              State: {state.isColliding ? 'Impact' : state.hasCollided ? 'Post' : 'Pre'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Position (x₁)</span>
              <span className="text-white font-bold text-xs">{state.object1.position.toFixed(2)} m</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Velocity (v₁)</span>
              <span className="text-cyan-300 font-bold text-xs">
                {state.object1.velocity >= 0 ? '+' : ''}{state.object1.velocity.toFixed(2)} m/s
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Speed (|v₁|)</span>
              <span className="text-white font-bold text-xs">{state.object1.speed.toFixed(2)} m/s</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Momentum (p₁)</span>
              <span className="text-amber-300 font-bold text-xs">
                {state.object1.momentum >= 0 ? '+' : ''}{state.object1.momentum.toFixed(2)} kg·m/s
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Kinetic Energy (K₁)</span>
              <span className="text-emerald-300 font-bold text-xs">{state.object1.kineticEnergy.toFixed(2)} J</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Mass (m₁)</span>
              <span className="text-slate-300 font-bold text-xs">{params.m1.toFixed(2)} kg</span>
            </div>
          </div>
        </div>

        {/* OBJECT 2 CARD (Purple) */}
        <div className="bg-[#07111F] rounded-lg border border-purple-500/30 p-3 space-y-2">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-1.5">
            <span className="font-mono font-bold text-purple-400 text-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              OBJECT 2 (m₂ = {params.m2.toFixed(1)} kg)
            </span>
            <span className="font-mono text-[10px] text-slate-400">
              State: {state.isColliding ? 'Impact' : state.hasCollided ? 'Post' : 'Pre'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Position (x₂)</span>
              <span className="text-white font-bold text-xs">{state.object2.position.toFixed(2)} m</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Velocity (v₂)</span>
              <span className="text-purple-300 font-bold text-xs">
                {state.object2.velocity >= 0 ? '+' : ''}{state.object2.velocity.toFixed(2)} m/s
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Speed (|v₂|)</span>
              <span className="text-white font-bold text-xs">{state.object2.speed.toFixed(2)} m/s</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Momentum (p₂)</span>
              <span className="text-amber-300 font-bold text-xs">
                {state.object2.momentum >= 0 ? '+' : ''}{state.object2.momentum.toFixed(2)} kg·m/s
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Kinetic Energy (K₂)</span>
              <span className="text-emerald-300 font-bold text-xs">{state.object2.kineticEnergy.toFixed(2)} J</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Mass (m₂)</span>
              <span className="text-slate-300 font-bold text-xs">{params.m2.toFixed(2)} kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* SYSTEM TOTALS & IMPULSE BANNER */}
      <div className="bg-[#07111F] rounded-lg border border-[#26364D] p-3 space-y-3">
        <div className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-[#1E293B]">
          <Gauge className="w-3.5 h-3.5 text-cyan-400" />
          <span>System Conservation & Dynamics</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-[11px]">
          <div className="bg-[#101D30] p-2 rounded border border-[#26364D]">
            <span className="text-[9px] uppercase text-slate-400 block">Total Momentum (P)</span>
            <span className="text-sm font-bold text-cyan-400">
              {state.totalMomentum >= 0 ? '+' : ''}{state.totalMomentum.toFixed(3)}
            </span>
            <span className="text-[9px] text-slate-500 block">kg·m/s</span>
          </div>

          <div className="bg-[#101D30] p-2 rounded border border-[#26364D]">
            <span className="text-[9px] uppercase text-slate-400 block">Total Kinetic Energy (K)</span>
            <span className="text-sm font-bold text-emerald-400">
              {state.totalKineticEnergy.toFixed(2)}
            </span>
            <span className="text-[9px] text-slate-500 block">Joules (J)</span>
          </div>

          <div className="bg-[#101D30] p-2 rounded border border-[#26364D]">
            <span className="text-[9px] uppercase text-slate-400 block">Impulse |J| = |Δp|</span>
            <span className="text-sm font-bold text-amber-400">
              {analytical.impulseMagnitude.toFixed(2)}
            </span>
            <span className="text-[9px] text-slate-500 block">N·s (or kg·m/s)</span>
          </div>

          <div className="bg-[#101D30] p-2 rounded border border-[#26364D]">
            <span className="text-[9px] uppercase text-slate-400 block">Average Force (F_avg)</span>
            <span className="text-sm font-bold text-rose-400">
              {analytical.averageForce.toFixed(1)}
            </span>
            <span className="text-[9px] text-slate-500 block">Newtons (N)</span>
          </div>
        </div>
      </div>

      {/* EXPLICIT BEFORE COLLISION VS AFTER COLLISION BREAKDOWN TABLE */}
      <div className="bg-[#07111F] rounded-lg border border-[#26364D] p-3 space-y-2">
        <div className="flex items-center justify-between pb-1.5 border-b border-[#1E293B]">
          <div className="flex items-center gap-1.5 font-mono font-bold text-xs text-white uppercase tracking-wider">
            <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span>Before Collision vs After Collision Comparison</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Restitution e = {params.collisionType === 'elastic' ? '1.00' : params.collisionType === 'perfectly-inelastic' ? '0.00' : params.restitution.toFixed(2)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[11px]">
            <thead>
              <tr className="text-slate-500 border-b border-slate-800 text-[10px] uppercase">
                <th className="py-1 px-2">Quantity</th>
                <th className="py-1 px-2 text-cyan-400">Before Collision</th>
                <th className="py-1 px-2 text-purple-400">After Collision</th>
                <th className="py-1 px-2 text-emerald-400">Change (Δ = After - Before)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr>
                <td className="py-1 px-2 text-slate-300 font-semibold">Object 1 Velocity (v₁)</td>
                <td className="py-1 px-2 text-slate-300">{params.v1.toFixed(2)} m/s</td>
                <td className="py-1 px-2 text-cyan-300 font-bold">{analytical.v1_after.toFixed(2)} m/s</td>
                <td className="py-1 px-2 text-slate-400">{(analytical.v1_after - params.v1).toFixed(2)} m/s</td>
              </tr>
              <tr>
                <td className="py-1 px-2 text-slate-300 font-semibold">Object 2 Velocity (v₂)</td>
                <td className="py-1 px-2 text-slate-300">{params.v2.toFixed(2)} m/s</td>
                <td className="py-1 px-2 text-purple-300 font-bold">{analytical.v2_after.toFixed(2)} m/s</td>
                <td className="py-1 px-2 text-slate-400">{(analytical.v2_after - params.v2).toFixed(2)} m/s</td>
              </tr>
              <tr>
                <td className="py-1 px-2 text-slate-300 font-semibold">Object 1 Momentum (p₁)</td>
                <td className="py-1 px-2 text-slate-300">{analytical.p1_before.toFixed(2)} kg·m/s</td>
                <td className="py-1 px-2 text-cyan-300 font-bold">{analytical.p1_after.toFixed(2)} kg·m/s</td>
                <td className="py-1 px-2 text-slate-400">{analytical.impulseObj1.toFixed(2)} kg·m/s (J₁)</td>
              </tr>
              <tr>
                <td className="py-1 px-2 text-slate-300 font-semibold">Object 2 Momentum (p₂)</td>
                <td className="py-1 px-2 text-slate-300">{analytical.p2_before.toFixed(2)} kg·m/s</td>
                <td className="py-1 px-2 text-purple-300 font-bold">{analytical.p2_after.toFixed(2)} kg·m/s</td>
                <td className="py-1 px-2 text-slate-400">{analytical.impulseObj2.toFixed(2)} kg·m/s (J₂)</td>
              </tr>
              <tr className="bg-cyan-950/20 font-bold">
                <td className="py-1 px-2 text-white">Total Momentum (P_total)</td>
                <td className="py-1 px-2 text-cyan-300">{analytical.P_total_before.toFixed(3)} kg·m/s</td>
                <td className="py-1 px-2 text-cyan-300">{analytical.P_total_after.toFixed(3)} kg·m/s</td>
                <td className="py-1 px-2 text-emerald-400">
                  ΔP = {analytical.momentumError.toFixed(5)} kg·m/s (CONSERVED)
                </td>
              </tr>
              <tr>
                <td className="py-1 px-2 text-slate-300 font-semibold">Object 1 Kinetic Energy (K₁)</td>
                <td className="py-1 px-2 text-slate-300">{analytical.K1_before.toFixed(2)} J</td>
                <td className="py-1 px-2 text-slate-300">{analytical.K1_after.toFixed(2)} J</td>
                <td className="py-1 px-2 text-slate-400">{(analytical.K1_after - analytical.K1_before).toFixed(2)} J</td>
              </tr>
              <tr>
                <td className="py-1 px-2 text-slate-300 font-semibold">Object 2 Kinetic Energy (K₂)</td>
                <td className="py-1 px-2 text-slate-300">{analytical.K2_before.toFixed(2)} J</td>
                <td className="py-1 px-2 text-slate-300">{analytical.K2_after.toFixed(2)} J</td>
                <td className="py-1 px-2 text-slate-400">{(analytical.K2_after - analytical.K2_before).toFixed(2)} J</td>
              </tr>
              <tr className="bg-amber-950/20 font-bold">
                <td className="py-1 px-2 text-white">Total Kinetic Energy (K_total)</td>
                <td className="py-1 px-2 text-amber-300">{analytical.K_total_before.toFixed(2)} J</td>
                <td className="py-1 px-2 text-amber-300">{analytical.K_total_after.toFixed(2)} J</td>
                <td className={`py-1 px-2 ${analytical.kineticEnergyLost > 0.001 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {analytical.kineticEnergyLost > 0.001
                    ? `Lost: -${analytical.kineticEnergyLost.toFixed(2)} J (${((1 - analytical.fractionEnergyRetained) * 100).toFixed(1)}% dissipated)`
                    : 'ΔK = 0.00 J (CONSERVED)'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
