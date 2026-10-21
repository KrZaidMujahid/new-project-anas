/**
 * EQUATION 1 — Circular Motion Results Summary Card
 * Compact scientific breakdown showing kinematic relationships and scaling laws.
 */

import React from 'react';
import { CircularParameters, CircularState } from '../../physics/circular/types';
import { CheckCircle2, RotateCw, Gauge, Zap, Compass } from 'lucide-react';

interface CircularResultsSummaryProps {
  params: CircularParameters;
  state: CircularState;
}

export const CircularResultsSummary: React.FC<CircularResultsSummaryProps> = ({
  params,
  state,
}) => {
  return (
    <div className="bg-[#0B1728] border-2 border-cyan-500/40 rounded-xl p-4 select-none space-y-3 shadow-xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#26364D]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
            <RotateCw className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
              CIRCULAR MOTION SCIENTIFIC SUMMARY
            </h3>
            <span className="text-[10px] text-slate-400">
              Rotational kinematics & centripetal dynamics breakdown
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            v = {state.speed.toFixed(2)} m/s (Tangential)
          </span>
          <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            a_c = {state.centripetalAccel.toFixed(2)} m/s² (Radially Inward)
          </span>
        </div>
      </div>

      {/* Primary 3-Card Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        {/* Core Inputs Card */}
        <div className="bg-[#07111F] p-3 rounded-lg border border-[#26364D] space-y-1.5">
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
            Apparatus Properties
          </span>
          <div className="flex justify-between text-slate-300">
            <span>Orbit Radius (r):</span>
            <span className="font-bold text-white">{params.radius.toFixed(2)} m</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Orbital Mass (m):</span>
            <span className="font-bold text-white">{params.mass.toFixed(2)} kg</span>
          </div>
          <div className="flex justify-between text-cyan-300 font-bold border-t border-[#1E293B] pt-1">
            <span>Angular Velocity (ω):</span>
            <span>{params.angularVelocity.toFixed(2)} rad/s</span>
          </div>
        </div>

        {/* Dynamics Card */}
        <div className="bg-[#07111F] p-3 rounded-lg border border-[#26364D] space-y-1.5">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
            Kinematics & Dynamics
          </span>
          <div className="flex justify-between text-slate-300">
            <span>Linear Speed (v = r|ω|):</span>
            <span className="font-bold text-emerald-400">{state.speed.toFixed(2)} m/s</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Centripetal Accel (a_c):</span>
            <span className="font-bold text-amber-300">{state.centripetalAccel.toFixed(2)} m/s²</span>
          </div>
          <div className="flex justify-between text-rose-300 font-bold border-t border-[#1E293B] pt-1">
            <span>Centripetal Force (F_c):</span>
            <span>{state.centripetalForce.toFixed(2)} N</span>
          </div>
        </div>

        {/* Periodic Properties Card */}
        <div className="bg-[#07111F] p-3 rounded-lg border border-[#26364D] space-y-1.5">
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
            Periodic Properties
          </span>
          <div className="flex justify-between text-slate-300">
            <span>Period (T = 2π/|ω|):</span>
            <span className="font-bold text-white">
              {Number.isFinite(state.period) ? state.period.toFixed(3) + ' s' : '∞'}
            </span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Frequency (f = 1/T):</span>
            <span className="font-bold text-white">{state.frequency.toFixed(3)} Hz</span>
          </div>
          <div className="flex justify-between text-cyan-300 font-bold border-t border-[#1E293B] pt-1">
            <span>Kinetic Energy (K):</span>
            <span>{state.kineticEnergy.toFixed(2)} J</span>
          </div>
        </div>
      </div>

      {/* Exact Mathematical Law Equations Bar */}
      <div className="bg-[#07111F] p-3 rounded-lg border border-[#26364D] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="text-slate-500 uppercase text-[9px]">Linear Speed:</span>
          <span className="px-2 py-0.5 rounded bg-[#101D30] border border-[#26364D] text-emerald-400 font-bold">
            v = rω = {params.radius.toFixed(1)} × {Math.abs(params.angularVelocity).toFixed(1)} = {state.speed.toFixed(2)} m/s
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="text-slate-500 uppercase text-[9px]">Centripetal Accel:</span>
          <span className="px-2 py-0.5 rounded bg-[#101D30] border border-[#26364D] text-amber-400 font-bold">
            a_c = rω² = {params.radius.toFixed(1)} × {params.angularVelocity.toFixed(1)}² = {state.centripetalAccel.toFixed(2)} m/s²
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="text-slate-500 uppercase text-[9px]">Centripetal Force:</span>
          <span className="px-2 py-0.5 rounded bg-[#101D30] border border-[#26364D] text-rose-400 font-bold">
            F_c = mrω² = {params.mass.toFixed(1)} × {state.centripetalAccel.toFixed(1)} = {state.centripetalForce.toFixed(1)} N
          </span>
        </div>
      </div>
    </div>
  );
};
