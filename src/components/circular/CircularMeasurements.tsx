/**
 * EQUATION 1 — Circular Motion Live Measurements Panel
 * Displays real-time angular, linear, dynamic, and Cartesian telemetry.
 */

import React from 'react';
import { CircularParameters, CircularState } from '../../physics/circular/types';
import { Activity, Gauge, Compass, Scale, Clock, Zap } from 'lucide-react';

interface CircularMeasurementsProps {
  params: CircularParameters;
  state: CircularState;
}

export const CircularMeasurements: React.FC<CircularMeasurementsProps> = ({
  params,
  state,
}) => {
  return (
    <div className="bg-[#0B1728] border border-[#26364D] rounded-xl p-4 select-none space-y-4 shadow-lg text-xs">
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-[#26364D]">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#F1F5F9]">
            Live Circular Telemetry & Kinematics
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-400">
            t = {state.time.toFixed(2)}s
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
            Uniform Motion (v = const)
          </span>
        </div>
      </div>

      {/* Grid: 3 Main Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Card 1: Angular Quantities */}
        <div className="bg-[#07111F] rounded-lg border border-[#26364D] p-3 space-y-2">
          <div className="flex items-center gap-1.5 font-mono font-bold text-cyan-400 text-xs border-b border-[#1E293B] pb-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>Angular Quantities</span>
          </div>

          <div className="space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Angular Position (θ):</span>
              <span className="text-white font-bold">{state.thetaDeg.toFixed(1)}°</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Angle in Radians:</span>
              <span className="text-cyan-300 font-bold">{state.thetaRad.toFixed(3)} rad</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Angular Velocity (ω):</span>
              <span className="text-cyan-300 font-bold">{params.angularVelocity.toFixed(2)} rad/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Orbital Period (T):</span>
              <span className="text-emerald-300 font-bold">
                {Number.isFinite(state.period) ? state.period.toFixed(3) + ' s' : '∞ (Stationary)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Frequency (f):</span>
              <span className="text-emerald-300 font-bold">{state.frequency.toFixed(3)} Hz</span>
            </div>
          </div>
        </div>

        {/* Card 2: Linear & Centripetal Dynamics */}
        <div className="bg-[#07111F] rounded-lg border border-[#26364D] p-3 space-y-2">
          <div className="flex items-center gap-1.5 font-mono font-bold text-amber-400 text-xs border-b border-[#1E293B] pb-1.5">
            <Gauge className="w-3.5 h-3.5" />
            <span>Linear & Centripetal Dynamics</span>
          </div>

          <div className="space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Orbit Radius (r):</span>
              <span className="text-white font-bold">{params.radius.toFixed(2)} m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Linear Speed (v = r|ω|):</span>
              <span className="text-emerald-300 font-bold">{state.speed.toFixed(2)} m/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Centripetal Accel (a_c):</span>
              <span className="text-amber-300 font-bold">{state.centripetalAccel.toFixed(2)} m/s²</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Centripetal Force (F_c):</span>
              <span className="text-rose-300 font-bold">{state.centripetalForce.toFixed(2)} N</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Kinetic Energy (K):</span>
              <span className="text-cyan-300 font-bold">{state.kineticEnergy.toFixed(2)} J</span>
            </div>
          </div>
        </div>

        {/* Card 3: Cartesian Coordinates & Vectors */}
        <div className="bg-[#07111F] rounded-lg border border-[#26364D] p-3 space-y-2">
          <div className="flex items-center gap-1.5 font-mono font-bold text-purple-400 text-xs border-b border-[#1E293B] pb-1.5">
            <Scale className="w-3.5 h-3.5" />
            <span>Cartesian Vectors (x, y)</span>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Position x</span>
              <span className="text-white font-bold">{state.x.toFixed(2)} m</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Position y</span>
              <span className="text-white font-bold">{state.y.toFixed(2)} m</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Velocity vx</span>
              <span className="text-emerald-300 font-bold">{state.vx.toFixed(2)} m/s</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Velocity vy</span>
              <span className="text-emerald-300 font-bold">{state.vy.toFixed(2)} m/s</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Accel ax</span>
              <span className="text-amber-300 font-bold">{state.ax.toFixed(2)} m/s²</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Accel ay</span>
              <span className="text-amber-300 font-bold">{state.ay.toFixed(2)} m/s²</span>
            </div>
          </div>
        </div>
      </div>

      {/* Invariants & Geometric Alignment Banner */}
      <div className="bg-[#07111F] rounded-lg border border-[#26364D] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-[11px]">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-slate-500 text-[9px] uppercase block">Orthogonality (v ⊥ r)</span>
            <span className="text-emerald-400 font-bold">
              r · v = {(state.x * state.vx + state.y * state.vy).toFixed(4)} ≈ 0 (Tangent)
            </span>
          </div>
          <div>
            <span className="text-slate-500 text-[9px] uppercase block">Centripetal Direction</span>
            <span className="text-amber-400 font-bold">
              a || -r (Strictly Inward)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span className="text-slate-400 text-[10px]">Mass m = {params.mass.toFixed(1)} kg</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 text-[10px]">Radius r = {params.radius.toFixed(1)} m</span>
        </div>
      </div>
    </div>
  );
};
