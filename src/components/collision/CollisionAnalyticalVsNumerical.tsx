/**
 * EQUATION 1 — Analytical vs Numerical Collision Verification
 * Directly benchmarks closed-form theoretical equations against the discrete time-step numerical simulation.
 */

import React, { useMemo } from 'react';
import {
  CollisionParameters,
  AnalyticalCollisionResult,
} from '../../physics/collision/types';
import { runNumericalSimulation } from '../../physics/collision/model';
import { Scale, CheckCircle2, AlertCircle } from 'lucide-react';

interface CollisionAnalyticalVsNumericalProps {
  params: CollisionParameters;
  analytical: AnalyticalCollisionResult;
}

export const CollisionAnalyticalVsNumerical: React.FC<CollisionAnalyticalVsNumericalProps> = ({
  params,
  analytical,
}) => {
  const numerical = useMemo(() => {
    return runNumericalSimulation(params, 6.0, 0.001);
  }, [params]);

  const rows = useMemo(() => {
    const diffV1 = Math.abs(analytical.v1_after - numerical.v1_after);
    const diffV2 = Math.abs(analytical.v2_after - numerical.v2_after);
    const diffP = Math.abs(analytical.P_total_after - numerical.P_total_after);
    const diffK = Math.abs(analytical.K_total_after - numerical.K_total_after);
    const diffT =
      analytical.collisionTime !== null && numerical.collisionTime !== null
        ? Math.abs(analytical.collisionTime - numerical.collisionTime)
        : 0;

    return [
      {
        id: 'v1',
        name: "Object 1 Final Velocity (v₁')",
        unit: 'm/s',
        analytical: analytical.v1_after,
        numerical: numerical.v1_after,
        diff: diffV1,
        tol: 0.05,
      },
      {
        id: 'v2',
        name: "Object 2 Final Velocity (v₂')",
        unit: 'm/s',
        analytical: analytical.v2_after,
        numerical: numerical.v2_after,
        diff: diffV2,
        tol: 0.05,
      },
      {
        id: 'p_tot',
        name: "Total Final Momentum (P')",
        unit: 'kg·m/s',
        analytical: analytical.P_total_after,
        numerical: numerical.P_total_after,
        diff: diffP,
        tol: 0.05,
      },
      {
        id: 'k_tot',
        name: "Total Final Kinetic Energy (K')",
        unit: 'J',
        analytical: analytical.K_total_after,
        numerical: numerical.K_total_after,
        diff: diffK,
        tol: 0.1,
      },
      {
        id: 't_col',
        name: 'Collision Impact Time (t_col)',
        unit: 's',
        analytical: analytical.collisionTime !== null ? analytical.collisionTime : 0,
        numerical: numerical.collisionTime !== null ? numerical.collisionTime : 0,
        diff: diffT,
        tol: 0.02,
      },
    ];
  }, [analytical, numerical]);

  const allWithinTolerance = rows.every((r) => r.diff <= r.tol);

  return (
    <div className="bg-[#0B1728] border border-[#26364D] rounded-xl p-4 select-none space-y-3 shadow-lg text-xs">
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-[#26364D]">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#F1F5F9]">
            Analytical Closed-Form vs Numerical Simulation
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          {allWithinTolerance ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>CONVERGENCE VERIFIED (dt = 0.001s)</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold">
              <AlertCircle className="w-3 h-3 text-amber-400" />
              <span>CHECKING TOLERANCE</span>
            </span>
          )}
        </div>
      </div>

      <p className="text-[11px] text-slate-400 leading-relaxed">
        Compares theoretical closed-form kinematic formulas with discrete time-stepping Euler-Cromer integration to verify physical accuracy and detect numerical artifacts.
      </p>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-[11px]">
          <thead>
            <tr className="text-slate-500 border-b border-slate-800 text-[10px] uppercase">
              <th className="py-1 px-2">Quantity</th>
              <th className="py-1 px-2 text-cyan-400">Analytical Exact</th>
              <th className="py-1 px-2 text-purple-400">Numerical (Δt = 1ms)</th>
              <th className="py-1 px-2 text-emerald-400">Difference |Δ|</th>
              <th className="py-1 px-2 text-slate-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {rows.map((row) => {
              const passed = row.diff <= row.tol;
              return (
                <tr key={row.id}>
                  <td className="py-1.5 px-2 text-slate-300 font-medium">{row.name}</td>
                  <td className="py-1.5 px-2 text-cyan-300 font-bold">
                    {row.analytical.toFixed(3)} {row.unit}
                  </td>
                  <td className="py-1.5 px-2 text-purple-300 font-bold">
                    {row.numerical.toFixed(3)} {row.unit}
                  </td>
                  <td className="py-1.5 px-2 text-slate-300">
                    {row.diff.toFixed(4)} {row.unit}
                  </td>
                  <td className="py-1.5 px-2">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        passed
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {passed ? 'MATCH' : 'DISCREPANCY'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
