/**
 * EQUATION 1 — Free Fall Measurements & Analytical vs Simulation Analysis
 * Real-time dynamic telemetry and Section 8 numerical accuracy comparison.
 */

import React, { useState, useMemo } from 'react';
import {
  FreeFallAnalytical,
  FreeFallParameters,
  FreeFallState,
} from '../../physics/freeFall/types';
import { compareSimulationWithAnalytical } from '../../physics/freeFall/model';
import { Activity, Gauge, Scale } from 'lucide-react';

interface FreeFallMeasurementsProps {
  parameters: FreeFallParameters;
  analytical: FreeFallAnalytical;
  currentState: FreeFallState;
}

export const FreeFallMeasurements: React.FC<FreeFallMeasurementsProps> = ({
  parameters,
  analytical,
  currentState,
}) => {
  const [activeTab, setActiveTab] = useState<'live' | 'comparison'>('live');

  // Compute numerical simulation comparison
  const comparison = useMemo(() => {
    return compareSimulationWithAnalytical(parameters);
  }, [parameters]);

  return (
    <div className="bg-[#0b101b] border border-slate-800/90 rounded-lg p-4 select-none space-y-4">
      {/* Header & View Mode Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Telemetry & Verification
          </h2>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-[#07090e] border border-slate-800 rounded p-0.5 text-[11px] font-mono">
          <button
            onClick={() => setActiveTab('live')}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded transition-colors cursor-pointer ${
              activeTab === 'live'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3 h-3" />
            <span>Live Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab('comparison')}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded transition-colors cursor-pointer ${
              activeTab === 'comparison'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Compare closed-form analytical results vs discrete numerical simulation"
          >
            <Scale className="w-3 h-3" />
            <span>Analytical vs Sim</span>
          </button>
        </div>
      </div>

      {activeTab === 'live' ? (
        <div className="space-y-3">
          {/* Top Primary Measurements Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Height y */}
            <div className="bg-[#07090e] border border-slate-800/80 rounded p-2.5 space-y-1">
              <div className="text-[10px] font-medium text-slate-400">
                Height <span className="font-mono text-slate-400">(y)</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-bold font-mono text-cyan-400 tabular-nums">
                  {currentState.height.toFixed(2)}
                </span>
                <span className="text-[10px] font-mono text-slate-400">m</span>
              </div>
              <div className="text-[9px] font-mono text-slate-400">
                Above ground
              </div>
            </div>

            {/* Velocity v (signed) */}
            <div className="bg-[#07090e] border border-slate-800/80 rounded p-2.5 space-y-1">
              <div className="text-[10px] font-medium text-slate-400">
                Velocity <span className="font-mono text-slate-400">(v)</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-lg sm:text-xl font-bold font-mono tabular-nums ${
                    currentState.velocity >= 0 ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {currentState.velocity.toFixed(2)}
                </span>
                <span className="text-[10px] font-mono text-slate-400">m/s</span>
              </div>
              <div className="text-[9px] font-mono text-slate-400">
                {currentState.velocity > 0 ? '↑ Ascending' : currentState.velocity < 0 ? '↓ Descending' : 'At Rest'}
              </div>
            </div>

            {/* Speed |v| */}
            <div className="bg-[#07090e] border border-slate-800/80 rounded p-2.5 space-y-1">
              <div className="text-[10px] font-medium text-slate-400">
                Speed <span className="font-mono text-slate-400">(|v|)</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-bold font-mono text-white tabular-nums">
                  {currentState.speed.toFixed(2)}
                </span>
                <span className="text-[10px] font-mono text-slate-400">m/s</span>
              </div>
              <div className="text-[9px] font-mono text-slate-400">
                Magnitude
              </div>
            </div>

            {/* Acceleration a */}
            <div className="bg-[#07090e] border border-slate-800/80 rounded p-2.5 space-y-1">
              <div className="text-[10px] font-medium text-slate-400">
                Acceleration <span className="font-mono text-slate-400">(a)</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-bold font-mono text-amber-400 tabular-nums">
                  {currentState.acceleration.toFixed(2)}
                </span>
                <span className="text-[10px] font-mono text-slate-400">m/s²</span>
              </div>
              <div className="text-[9px] font-mono text-slate-400">
                a = -g (constant)
              </div>
            </div>
          </div>

          {/* Secondary Telemetry Strip */}
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-2 bg-[#07090e] border border-slate-800 rounded">
              <div className="text-[10px] text-slate-400">Displacement (Δy)</div>
              <div className="text-white font-semibold tabular-nums mt-0.5">
                {currentState.displacement.toFixed(2)} <span className="text-[10px] text-slate-400">m</span>
              </div>
            </div>

            <div className="p-2 bg-[#07090e] border border-slate-800 rounded">
              <div className="text-[10px] text-slate-400">Distance Traveled</div>
              <div className="text-white font-semibold tabular-nums mt-0.5">
                {currentState.distanceTravelled.toFixed(2)} <span className="text-[10px] text-slate-400">m</span>
              </div>
            </div>

            <div className="p-2 bg-[#07090e] border border-slate-800 rounded">
              <div className="text-[10px] text-slate-400">Elapsed Time (t)</div>
              <div className="text-cyan-400 font-semibold tabular-nums mt-0.5">
                {currentState.time.toFixed(2)} <span className="text-[10px] text-slate-400">s</span>
              </div>
            </div>
          </div>

          {/* Post-Landing Summary Report */}
          <div className="p-3 bg-[#07090e] border border-slate-800 rounded-md space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
              <span>Ground Impact Analytical Summary (y = 0)</span>
              {currentState.isGrounded && (
                <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded text-[9px] font-mono">
                  IMPACT COMPLETE
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">Time of Fall (T):</span>
                <span className="text-emerald-400 font-bold">
                  {isFinite(analytical.timeToGround) ? `${analytical.timeToGround.toFixed(2)} s` : '∞ (Never)'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Final Velocity:</span>
                <span className="text-amber-400 font-bold">
                  {isFinite(analytical.finalVelocity) ? `${analytical.finalVelocity.toFixed(2)} m/s` : 'N/A'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Final Impact Speed:</span>
                <span className="text-white font-bold">
                  {isFinite(analytical.finalSpeed) ? `${analytical.finalSpeed.toFixed(2)} m/s` : 'N/A'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Total Distance:</span>
                <span className="text-cyan-400 font-bold">
                  {analytical.totalDistanceTravelled.toFixed(2)} m
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Section 8: Analytical vs Numerical Simulation Comparison */
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-[#07090e] border border-slate-800 rounded-md space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 text-xs">
                Euler-Cromer Numerical Integration vs Closed-Form Analytical
              </span>
              <span className="text-[10px] font-mono text-cyan-400">
                Δt = {comparison.integrationTimestep}s ({comparison.stepsCount} steps)
              </span>
            </div>

            <table className="w-full text-left font-mono text-[11px]">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-1">Physical Quantity</th>
                  <th className="py-1">Analytical Formula</th>
                  <th className="py-1">Simulation (Euler-Cromer)</th>
                  <th className="py-1 text-right">Absolute Delta (|Δ|)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr>
                  <td className="py-1.5 text-slate-300 font-medium">Time to ground</td>
                  <td className="py-1.5 text-emerald-400 font-bold">
                    {comparison.analyticalTime.toFixed(3)} s
                  </td>
                  <td className="py-1.5 text-cyan-300">
                    {comparison.simulationTime.toFixed(3)} s
                  </td>
                  <td className="py-1.5 text-right text-slate-400">
                    {comparison.timeDelta.toFixed(4)} s
                  </td>
                </tr>

                <tr>
                  <td className="py-1.5 text-slate-300 font-medium">Final velocity (v_land)</td>
                  <td className="py-1.5 text-emerald-400 font-bold">
                    {comparison.analyticalFinalVelocity.toFixed(3)} m/s
                  </td>
                  <td className="py-1.5 text-cyan-300">
                    {comparison.simulationFinalVelocity.toFixed(3)} m/s
                  </td>
                  <td className="py-1.5 text-right text-slate-400">
                    {comparison.velocityDelta.toFixed(4)} m/s
                  </td>
                </tr>

                <tr>
                  <td className="py-1.5 text-slate-300 font-medium">Final speed (|v_land|)</td>
                  <td className="py-1.5 text-emerald-400 font-bold">
                    {comparison.analyticalFinalSpeed.toFixed(3)} m/s
                  </td>
                  <td className="py-1.5 text-cyan-300">
                    {comparison.simulationFinalSpeed.toFixed(3)} m/s
                  </td>
                  <td className="py-1.5 text-right text-slate-400">
                    {comparison.speedDelta.toFixed(4)} m/s
                  </td>
                </tr>
              </tbody>
            </table>

            <p className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2">
              Note: The simulation engine updates positions using exact closed-form kinematics to prevent drift during animation.
              The numerical integration above confirms that discrete stepping with Δt = 5ms converges to the exact analytical solution with negligible truncation error.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
