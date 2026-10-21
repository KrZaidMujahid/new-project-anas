/**
 * EQUATION 1 — Newton's Laws Real-Time Measurements
 * Telemetry deck displaying live values from simulation states with standard SI units.
 */

import React from 'react';
import {
  NewtonFirstLawParameters,
  NewtonFirstLawState,
  NewtonMode,
  NewtonSecondLawParameters,
  NewtonSecondLawState,
  NewtonThirdLawParameters,
  NewtonThirdLawState,
} from '../../physics/newton/types';
import { Activity, Gauge } from 'lucide-react';

interface NewtonMeasurementsProps {
  mode: NewtonMode;
  secondLawParams: NewtonSecondLawParameters;
  secondLawState: NewtonSecondLawState;
  firstLawParams: NewtonFirstLawParameters;
  firstLawState: NewtonFirstLawState;
  thirdLawParams: NewtonThirdLawParameters;
  thirdLawState: NewtonThirdLawState;
}

export const NewtonMeasurements: React.FC<NewtonMeasurementsProps> = ({
  mode,
  secondLawParams,
  secondLawState,
  firstLawParams,
  firstLawState,
  thirdLawParams,
  thirdLawState,
}) => {
  return (
    <div className="bg-[#0b101b] border border-slate-800/90 rounded-lg p-4 select-none space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Measurements & Telemetry
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
          <Activity className="w-3 h-3 animate-pulse" />
          <span>LIVE METRICS</span>
        </div>
      </div>

      {/* Mode 2: Second Law Telemetry */}
      {mode === 'second-law' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Net Force */}
            <div className="bg-[#07090e] border border-slate-800/80 rounded p-2.5 space-y-1">
              <div className="text-[10px] font-medium text-slate-400">
                Net Force <span className="font-mono text-slate-400">(ΣF)</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-bold font-mono text-emerald-400 tabular-nums">
                  {secondLawState.netForce.toFixed(2)}
                </span>
                <span className="text-[10px] font-mono text-slate-400">N</span>
              </div>
              <div className="text-[9px] font-mono text-slate-400">
                F_net = ΣF
              </div>
            </div>

            {/* Acceleration */}
            <div className="bg-[#07090e] border border-slate-800/80 rounded p-2.5 space-y-1">
              <div className="text-[10px] font-medium text-slate-400">
                Acceleration <span className="font-mono text-slate-400">(a)</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-bold font-mono text-yellow-400 tabular-nums">
                  {secondLawState.acceleration.toFixed(2)}
                </span>
                <span className="text-[10px] font-mono text-slate-400">m/s²</span>
              </div>
              <div className="text-[9px] font-mono text-slate-400">
                a = ΣF / m
              </div>
            </div>

            {/* Velocity */}
            <div className="bg-[#07090e] border border-slate-800/80 rounded p-2.5 space-y-1">
              <div className="text-[10px] font-medium text-slate-400">
                Velocity <span className="font-mono text-slate-400">(v)</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-bold font-mono text-cyan-400 tabular-nums">
                  {secondLawState.velocity.toFixed(2)}
                </span>
                <span className="text-[10px] font-mono text-slate-400">m/s</span>
              </div>
              <div className="text-[9px] font-mono text-slate-400">
                v = v₀ + at
              </div>
            </div>

            {/* Position */}
            <div className="bg-[#07090e] border border-slate-800/80 rounded p-2.5 space-y-1">
              <div className="text-[10px] font-medium text-slate-400">
                Position <span className="font-mono text-slate-400">(x)</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-bold font-mono text-white tabular-nums">
                  {secondLawState.position.toFixed(2)}
                </span>
                <span className="text-[10px] font-mono text-slate-400">m</span>
              </div>
              <div className="text-[9px] font-mono text-slate-400">
                Displacement
              </div>
            </div>
          </div>

          {/* Secondary Details Row */}
          <div className="grid grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-2 bg-[#07090e] border border-slate-800 rounded">
              <div className="text-[10px] text-slate-400">Mass (m)</div>
              <div className="text-white font-semibold tabular-nums mt-0.5">
                {secondLawParams.mass.toFixed(1)} <span className="text-[10px] text-slate-400">kg</span>
              </div>
            </div>

            <div className="p-2 bg-[#07090e] border border-slate-800 rounded">
              <div className="text-[10px] text-slate-400">Applied (F₁)</div>
              <div className="text-cyan-400 font-semibold tabular-nums mt-0.5">
                {secondLawParams.appliedForce.toFixed(1)} <span className="text-[10px] text-slate-400">N</span>
              </div>
            </div>

            <div className="p-2 bg-[#07090e] border border-slate-800 rounded">
              <div className="text-[10px] text-slate-400">Friction (f)</div>
              <div className="text-amber-400 font-semibold tabular-nums mt-0.5">
                {secondLawState.frictionForce.toFixed(2)} <span className="text-[10px] text-slate-400">N</span>
              </div>
            </div>

            <div className="p-2 bg-[#07090e] border border-slate-800 rounded">
              <div className="text-[10px] text-slate-400">Time (t)</div>
              <div className="text-emerald-400 font-semibold tabular-nums mt-0.5">
                {secondLawState.time.toFixed(2)} <span className="text-[10px] text-slate-400">s</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 1: First Law Telemetry */}
      {mode === 'first-law' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-[#07090e] border border-slate-800/80 rounded p-2.5 space-y-1">
              <div className="text-[10px] font-medium text-slate-400">Net Force (F_net)</div>
              <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
                {firstLawState.netForce.toFixed(1)} <span className="text-[10px] text-slate-400">N</span>
              </div>
              <div className="text-[9px] font-mono text-slate-400">External input</div>
            </div>

            <div className="bg-[#07090e] border border-slate-800/80 rounded p-2.5 space-y-1">
              <div className="text-[10px] font-medium text-slate-400">Acceleration (a)</div>
              <div className="text-lg font-bold font-mono text-yellow-400 tabular-nums">
                {firstLawState.acceleration.toFixed(2)} <span className="text-[10px] text-slate-400">m/s²</span>
              </div>
              <div className="text-[9px] font-mono text-slate-400">
                {Math.abs(firstLawState.acceleration) < 0.001 ? 'Zero (Constant v)' : 'Non-zero'}
              </div>
            </div>

            <div className="bg-[#07090e] border border-slate-800/80 rounded p-2.5 space-y-1">
              <div className="text-[10px] font-medium text-slate-400">Velocity (v)</div>
              <div className="text-lg font-bold font-mono text-cyan-400 tabular-nums">
                {firstLawState.velocity.toFixed(2)} <span className="text-[10px] text-slate-400">m/s</span>
              </div>
              <div className="text-[9px] font-mono text-slate-400">Instantaneous</div>
            </div>

            <div className="bg-[#07090e] border border-slate-800/80 rounded p-2.5 space-y-1">
              <div className="text-[10px] font-medium text-slate-400">Position (x)</div>
              <div className="text-lg font-bold font-mono text-white tabular-nums">
                {firstLawState.position.toFixed(2)} <span className="text-[10px] text-slate-400">m</span>
              </div>
              <div className="text-[9px] font-mono text-slate-400">Linear glide</div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 3: Third Law Telemetry */}
      {mode === 'third-law' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Force on A */}
            <div className="bg-[#07090e] border border-slate-800/80 rounded p-2.5 space-y-1">
              <div className="text-[10px] font-medium text-slate-400">
                Force on A <span className="font-mono text-rose-400">(F_B→A)</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-bold font-mono text-rose-400 tabular-nums">
                  {thirdLawState.forceOnA.toFixed(1)}
                </span>
                <span className="text-[10px] font-mono text-slate-400">N</span>
              </div>
              <div className="text-[9px] font-mono text-slate-400">Reaction (Left ←)</div>
            </div>

            {/* Force on B */}
            <div className="bg-[#07090e] border border-slate-800/80 rounded p-2.5 space-y-1">
              <div className="text-[10px] font-medium text-slate-400">
                Force on B <span className="font-mono text-rose-400">(F_A→B)</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-bold font-mono text-rose-400 tabular-nums">
                  {thirdLawState.forceOnB.toFixed(1)}
                </span>
                <span className="text-[10px] font-mono text-slate-400">N</span>
              </div>
              <div className="text-[9px] font-mono text-slate-400">Action (Right →)</div>
            </div>

            {/* Acceleration of A */}
            <div className="bg-[#07090e] border border-slate-800/80 rounded p-2.5 space-y-1">
              <div className="text-[10px] font-medium text-slate-400">
                Accel of A <span className="font-mono text-cyan-400">(a_A)</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-bold font-mono text-cyan-400 tabular-nums">
                  {thirdLawState.accA.toFixed(2)}
                </span>
                <span className="text-[10px] font-mono text-slate-400">m/s²</span>
              </div>
              <div className="text-[9px] font-mono text-slate-400">
                F_A / m_A ({thirdLawParams.massA} kg)
              </div>
            </div>

            {/* Acceleration of B */}
            <div className="bg-[#07090e] border border-slate-800/80 rounded p-2.5 space-y-1">
              <div className="text-[10px] font-medium text-slate-400">
                Accel of B <span className="font-mono text-purple-400">(a_B)</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-bold font-mono text-purple-400 tabular-nums">
                  {thirdLawState.accB.toFixed(2)}
                </span>
                <span className="text-[10px] font-mono text-slate-400">m/s²</span>
              </div>
              <div className="text-[9px] font-mono text-slate-400">
                F_B / m_B ({thirdLawParams.massB} kg)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-2 bg-[#07090e] border border-slate-800 rounded">
              <div className="text-[10px] text-slate-400">Speed of A (|v_A|)</div>
              <div className="text-cyan-300 font-semibold tabular-nums mt-0.5">
                {thirdLawState.speedA.toFixed(2)} <span className="text-[10px] text-slate-400">m/s</span>
              </div>
            </div>

            <div className="p-2 bg-[#07090e] border border-slate-800 rounded">
              <div className="text-[10px] text-slate-400">Speed of B (|v_B|)</div>
              <div className="text-purple-300 font-semibold tabular-nums mt-0.5">
                {thirdLawState.speedB.toFixed(2)} <span className="text-[10px] text-slate-400">m/s</span>
              </div>
            </div>

            <div className="p-2 bg-[#07090e] border border-slate-800 rounded">
              <div className="text-[10px] text-slate-400">Ratio a_A / a_B</div>
              <div className="text-white font-semibold tabular-nums mt-0.5">
                {(thirdLawParams.massB / thirdLawParams.massA).toFixed(2)}× <span className="text-[10px] text-slate-400">(= m_B/m_A)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
