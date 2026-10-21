/**
 * EQUATION 1 — Inclined Plane Telemetry & Measurements Deck
 * Real-time dynamic readouts for kinematics, resolved forces, friction state, and energetics.
 */

import React from 'react';
import {
  InclineMode,
  InclineParameters,
  InclineState,
} from '../../physics/incline/types';
import { Gauge, Zap, Activity, ShieldAlert, CheckCircle } from 'lucide-react';

interface InclineMeasurementsProps {
  mode: InclineMode;
  params: InclineParameters;
  state: InclineState;
}

export const InclineMeasurements: React.FC<InclineMeasurementsProps> = ({
  mode,
  params,
  state,
}) => {
  const frictionBadgeMap: Record<
    InclineState['frictionState'],
    { label: string; bg: string; text: string; border: string }
  > = {
    none: {
      label: 'Frictionless',
      bg: 'bg-slate-800/60',
      text: 'text-slate-400',
      border: 'border-slate-700/60',
    },
    'static-hold': {
      label: 'Static Hold (|fs| ≤ μs·N)',
      bg: 'bg-amber-950/40',
      text: 'text-amber-300',
      border: 'border-amber-500/40',
    },
    'kinetic-opposing-up': {
      label: 'Kinetic (Opposing +s)',
      bg: 'bg-rose-950/40',
      text: 'text-rose-300',
      border: 'border-rose-500/40',
    },
    'kinetic-opposing-down': {
      label: 'Kinetic (Opposing -s)',
      bg: 'bg-rose-950/40',
      text: 'text-rose-300',
      border: 'border-rose-500/40',
    },
  };

  const fBadge = frictionBadgeMap[state.frictionState];

  return (
    <div className="bg-[#0b101b] border border-slate-800/90 rounded-lg p-4 space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Real-Time Telemetry
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
          <span>t = </span>
          <span className="text-cyan-300 font-bold">{state.time.toFixed(2)}s</span>
        </div>
      </div>

      {/* 1. Primary Kinematics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-md p-2.5">
          <div className="text-[10px] text-slate-400 font-medium">Position along ramp</div>
          <div className="text-base font-bold font-mono text-cyan-300 mt-0.5">
            {state.position.toFixed(2)}
            <span className="text-[10px] text-slate-400 font-sans ml-1">m</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            h = {state.height.toFixed(2)}m
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-md p-2.5">
          <div className="text-[10px] text-slate-400 font-medium">Velocity along ramp</div>
          <div
            className={`text-base font-bold font-mono mt-0.5 ${
              state.velocity > 0
                ? 'text-emerald-400'
                : state.velocity < 0
                ? 'text-cyan-400'
                : 'text-slate-300'
            }`}
          >
            {state.velocity.toFixed(2)}
            <span className="text-[10px] text-slate-400 font-sans ml-1">m/s</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            speed: {state.speed.toFixed(2)} m/s
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-md p-2.5">
          <div className="text-[10px] text-slate-400 font-medium">Acceleration</div>
          <div className="text-base font-bold font-mono text-purple-300 mt-0.5">
            {state.acceleration.toFixed(2)}
            <span className="text-[10px] text-slate-400 font-sans ml-1">m/s²</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            a = ΣF / m
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-md p-2.5">
          <div className="text-[10px] text-slate-400 font-medium">Net Resultant Force</div>
          <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
            {state.netForce.toFixed(2)}
            <span className="text-[10px] text-slate-400 font-sans ml-1">N</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            {state.netForce > 0 ? 'accelerates up' : state.netForce < 0 ? 'accelerates down' : 'equilibrium'}
          </div>
        </div>
      </div>

      {/* 2. Forces Breakdown Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Resolved Dynamic Forces</span>
          </span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${fBadge.bg} ${fBadge.text} ${fBadge.border}`}>
            {fBadge.label}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          {/* Weight */}
          <div className="p-2 bg-slate-900/40 border border-slate-800 rounded">
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span>Gravity Weight (W)</span>
              <span className="text-cyan-400 font-mono">mg</span>
            </div>
            <div className="text-sm font-bold font-mono text-slate-200 mt-0.5">
              {state.weight.toFixed(1)} N
            </div>
          </div>

          {/* Parallel Gravity Component */}
          <div className="p-2 bg-slate-900/40 border border-slate-800 rounded">
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span>Parallel Gravity (W∥)</span>
              <span className="text-sky-400 font-mono">mg sin θ</span>
            </div>
            <div className="text-sm font-bold font-mono text-sky-300 mt-0.5">
              {state.gravityParallel.toFixed(1)} N
              <span className="text-[10px] text-slate-400 font-normal ml-1">(-s)</span>
            </div>
          </div>

          {/* Normal Force N */}
          <div className="p-2 bg-slate-900/40 border border-slate-800 rounded">
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span>Normal Force (N)</span>
              <span className="text-amber-400 font-mono">mg cos θ</span>
            </div>
            <div className="text-sm font-bold font-mono text-amber-300 mt-0.5">
              {state.normalForce.toFixed(1)} N
              <span className="text-[10px] text-slate-400 font-normal ml-1">(+n)</span>
            </div>
          </div>

          {/* Applied Force */}
          <div className="p-2 bg-slate-900/40 border border-slate-800 rounded">
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span>Applied Force (F_app)</span>
              <span className="text-blue-400 font-mono">
                {params.appliedForceDirection === 'up' ? '+s' : '-s'}
              </span>
            </div>
            <div className="text-sm font-bold font-mono text-blue-300 mt-0.5">
              {state.appliedForceSigned.toFixed(1)} N
            </div>
          </div>

          {/* Friction Force */}
          <div className="p-2 bg-slate-900/40 border border-slate-800 rounded">
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span>Friction Force (f)</span>
              <span className="text-rose-400 font-mono">
                {params.frictionEnabled ? `max fs=${state.maxStaticFriction.toFixed(1)}` : 'off'}
              </span>
            </div>
            <div className="text-sm font-bold font-mono text-rose-300 mt-0.5">
              {state.currentFrictionForce.toFixed(1)} N
            </div>
          </div>

          {/* Net Force along ramp */}
          <div className="p-2 bg-slate-900/40 border border-slate-800 rounded">
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span>Net Driving Force</span>
              <span className="text-emerald-400 font-mono">ΣF</span>
            </div>
            <div className="text-sm font-bold font-mono text-emerald-300 mt-0.5">
              {state.netForce.toFixed(1)} N
            </div>
          </div>
        </div>
      </div>

      {/* 3. Energetics & Work Breakdown */}
      <div className="pt-2 border-t border-slate-800/60 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Energy & Work Conservation</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            E = Ek + Ep
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2 bg-slate-900/30 border border-slate-800/70 rounded">
            <div className="text-[10px] text-slate-400">Kinetic Energy (Ek)</div>
            <div className="text-sm font-bold font-mono text-emerald-300 mt-0.5">
              {state.kineticEnergy.toFixed(1)} J
            </div>
          </div>

          <div className="p-2 bg-slate-900/30 border border-slate-800/70 rounded">
            <div className="text-[10px] text-slate-400">Potential Energy (Ep)</div>
            <div className="text-sm font-bold font-mono text-cyan-300 mt-0.5">
              {state.potentialEnergy.toFixed(1)} J
            </div>
          </div>

          <div className="p-2 bg-slate-900/30 border border-slate-800/70 rounded">
            <div className="text-[10px] text-slate-400">Total Mechanical (E)</div>
            <div className="text-sm font-bold font-mono text-amber-300 mt-0.5">
              {state.mechanicalEnergy.toFixed(1)} J
            </div>
          </div>

          <div className="p-2 bg-slate-900/30 border border-slate-800/70 rounded">
            <div className="text-[10px] text-slate-400">Work by Friction (Wf)</div>
            <div className="text-sm font-bold font-mono text-rose-300 mt-0.5">
              {state.workFriction.toFixed(1)} J
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
