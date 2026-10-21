/**
 * EQUATION 1 — Carnot Thermodynamic State Table
 * Comprehensive analytical state properties (P, V, T) for States A, B, C, D
 * in both SI and laboratory units, with real-time active state highlight.
 */

import React from 'react';
import { CarnotCycleResults, CycleStateId } from '../../physics/carnot/types';
import { Table, Compass, CheckCircle2 } from 'lucide-react';

interface CarnotStateTableProps {
  cycle: CarnotCycleResults;
  currentStateId: CycleStateId;
}

export const CarnotStateTable: React.FC<CarnotStateTableProps> = ({
  cycle,
  currentStateId,
}) => {
  const { states } = cycle;
  const stateKeys: CycleStateId[] = ['A', 'B', 'C', 'D'];

  return (
    <div className="bg-[#102740] border border-[#29445F] rounded-xl p-5 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#29445F]/70">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#38BDF8]" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Thermodynamic State Points (A, B, C, D)
          </h3>
        </div>

        <div className="text-xs font-mono text-[#AFC2D8]">
          Current: <span className="font-bold text-[#38BDF8]">State {currentStateId}</span>
        </div>
      </div>

      {/* State Points Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#29445F] text-[#AFC2D8] font-mono uppercase text-[11px] bg-[#0B1F36]/60">
              <th className="py-2.5 px-3">State Point</th>
              <th className="py-2.5 px-3 text-right">Pressure P (kPa)</th>
              <th className="py-2.5 px-3 text-right">Pressure P (Pa)</th>
              <th className="py-2.5 px-3 text-right">Volume V (L)</th>
              <th className="py-2.5 px-3 text-right">Volume V (m³)</th>
              <th className="py-2.5 px-3 text-right">Temperature T (K)</th>
              <th className="py-2.5 px-3 text-right">Temperature (°C)</th>
              <th className="py-2.5 px-3">Upstream Process</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#29445F]/50 font-mono">
            {stateKeys.map((key) => {
              const st = states[key];
              const isCurrent = currentStateId === key;
              const isHot = key === 'A' || key === 'B';

              return (
                <tr
                  key={`state-row-${key}`}
                  className={`transition-colors ${
                    isCurrent
                      ? 'bg-[#16334F] text-white font-bold border-l-4 border-l-[#38BDF8]'
                      : 'hover:bg-[#16334F]/30 text-[#AFC2D8]'
                  }`}
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-slate-950 ${
                          isHot ? 'bg-[#F97316]' : 'bg-[#60A5FA]'
                        }`}
                      >
                        {key}
                      </span>
                      <span className="font-semibold text-white">State {key}</span>
                      {isCurrent && (
                        <span className="text-[10px] uppercase font-sans font-bold px-1.5 py-0.2 rounded bg-[#38BDF8] text-slate-950">
                          Active
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-[#38BDF8]">
                    {st.pressureKPa.toFixed(1)}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-400">
                    {st.pressurePa.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-[#4ADE80]">
                    {st.volumeL.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-400">
                    {st.volumeM3.toFixed(4)}
                  </td>
                  <td className={`py-3 px-3 text-right font-bold ${isHot ? 'text-[#FB923C]' : 'text-[#60A5FA]'}`}>
                    {st.temperatureK.toFixed(1)} K
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300">
                    {st.temperatureC.toFixed(1)}°C
                  </td>
                  <td className="py-3 px-3 text-[11px] font-sans text-[#AFC2D8]">
                    {st.processArriving}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Thermodynamic Volume Expansion Ratios Banner */}
      <div className="p-3 rounded-lg bg-[#0B1F36] border border-[#29445F] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="text-[#AFC2D8]">
          <span className="font-bold text-white">Adiabatic Expansion Ratio r = (T_H / T_C)^(1/(γ - 1)):</span>{' '}
          <span className="text-[#38BDF8] font-bold">{cycle.adiabaticRatio.toFixed(3)}</span>
        </div>
        <div className="text-[#AFC2D8]">
          <span className="font-bold text-white">Isothermal Expansion Ratio V_B / V_A:</span>{' '}
          <span className="text-[#4ADE80] font-bold">{cycle.isothermalRatio.toFixed(3)}</span>
        </div>
        <div className="text-emerald-400 flex items-center gap-1 font-sans">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>V_C / V_D = V_B / V_A satisfies cycle closure</span>
        </div>
      </div>
    </div>
  );
};
