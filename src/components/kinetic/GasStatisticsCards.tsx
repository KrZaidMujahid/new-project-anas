/**
 * EQUATION 1 — Gas Statistics Live Cards
 * Displays the 4 primary thermodynamic observables with distinct visual accents,
 * units, and clear distinction between theoretical and visual sample estimates.
 */

import React from 'react';
import { KineticParameters, KineticResults } from '../../physics/kinetic/types';
import {
  Thermometer,
  Gauge,
  Zap,
  Activity,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

interface GasStatisticsCardsProps {
  params: KineticParameters;
  results: KineticResults;
}

export const GasStatisticsCards: React.FC<GasStatisticsCardsProps> = ({
  params,
  results,
}) => {
  // Convert temperature to Celsius for reference
  const tempC = (params.temperatureK - 273.15).toFixed(1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Gas Temperature */}
      <div className="bg-[#102740] rounded-xl border border-[#29445F] p-4 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-[#FB923C]/50 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#AFC2D8]">
            <Thermometer className="w-4 h-4 text-[#FB923C]" />
            <span>GAS TEMPERATURE</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#16334F] text-[#FB923C] border border-[#29445F]">
            T (Thermal State)
          </span>
        </div>

        <div className="my-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black font-mono text-[#F1F5F9]">
              {params.temperatureK.toFixed(0)}
            </span>
            <span className="text-sm font-bold text-[#FB923C]">K</span>
          </div>
          <div className="text-xs text-[#AFC2D8] mt-1 font-mono">
            {tempC} °C
          </div>
        </div>

        <div className="pt-2 border-t border-[#29445F]/60 flex items-center justify-between text-[11px] text-[#AFC2D8]">
          <span>Average KE ∝ T</span>
          <span className="text-[#FB923C] font-mono font-semibold">
            {params.temperatureK >= 500 ? 'High Thermal Energy' : params.temperatureK <= 200 ? 'Cryogenic' : 'Ambient Room'}
          </span>
        </div>
      </div>

      {/* 2. Gas Pressure */}
      <div className="bg-[#102740] rounded-xl border border-[#29445F] p-4 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-[#A78BFA]/50 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#AFC2D8]">
            <Gauge className="w-4 h-4 text-[#A78BFA]" />
            <span>GAS PRESSURE</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#16334F] text-[#A78BFA] border border-[#29445F]">
            P = nRT / V
          </span>
        </div>

        <div className="my-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black font-mono text-[#F1F5F9]">
              {results.pressureKPa >= 1000
                ? (results.pressureKPa / 1000).toFixed(2)
                : results.pressureKPa.toFixed(1)}
            </span>
            <span className="text-sm font-bold text-[#A78BFA]">
              {results.pressureKPa >= 1000 ? 'MPa' : 'kPa'}
            </span>
          </div>
          <div className="text-xs text-[#AFC2D8] mt-1 font-mono">
            {Math.round(results.pressurePa).toLocaleString()} Pa • {results.pressureAtm.toFixed(2)} atm
          </div>
        </div>

        <div className="pt-2 border-t border-[#29445F]/60 flex items-center justify-between text-[11px] text-[#AFC2D8]">
          <span>Wall Impulses</span>
          <span className="text-[#A78BFA] font-mono font-semibold">
            P = ⅓ ρ v²_rms
          </span>
        </div>
      </div>

      {/* 3. Average Translational Kinetic Energy */}
      <div className="bg-[#102740] rounded-xl border border-[#29445F] p-4 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-[#4ADE80]/50 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#AFC2D8]">
            <Zap className="w-4 h-4 text-[#4ADE80]" />
            <span>AVG TRANSLATIONAL KE</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#16334F] text-[#4ADE80] border border-[#29445F]">
            ⟨E_k⟩ = ³⁄₂ k_B T
          </span>
        </div>

        <div className="my-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-[#F1F5F9]">
              {(results.avgKineticEnergyJ * 1e21).toFixed(2)}
            </span>
            <span className="text-xs font-bold text-[#4ADE80]">× 10⁻²¹ J</span>
          </div>
          <div className="text-xs text-[#AFC2D8] mt-1 font-mono">
            Total E: {results.totalKineticEnergyJ.toFixed(1)} J (for {params.moles} mol)
          </div>
        </div>

        <div className="pt-2 border-t border-[#29445F]/60 flex items-center justify-between text-[11px] text-[#AFC2D8]">
          <span>Per Molecule</span>
          <span className="text-[#4ADE80] font-mono font-semibold">
            Mass-Independent
          </span>
        </div>
      </div>

      {/* 4. RMS Molecular Speed */}
      <div className="bg-[#102740] rounded-xl border border-[#29445F] p-4 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-[#38BDF8]/50 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#AFC2D8]">
            <Activity className="w-4 h-4 text-[#38BDF8]" />
            <span>RMS MOLECULAR SPEED</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#16334F] text-[#38BDF8] border border-[#29445F]">
            v_rms = √(3RT/M)
          </span>
        </div>

        <div className="my-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black font-mono text-[#F1F5F9]">
              {Math.round(results.vRms)}
            </span>
            <span className="text-sm font-bold text-[#38BDF8]">m/s</span>
          </div>
          <div className="text-xs text-[#AFC2D8] mt-1 font-mono">
            v_mp: {Math.round(results.vMostProbable)} m/s • v_mean: {Math.round(results.vMean)} m/s
          </div>
        </div>

        <div className="pt-2 border-t border-[#29445F]/60 flex items-center justify-between text-[11px] text-[#AFC2D8]">
          <span>Species: {results.gasSpecies.formula}</span>
          <span className="text-[#38BDF8] font-mono font-semibold">
            {results.gasSpecies.molarMassGPerMol} g/mol
          </span>
        </div>
      </div>
    </div>
  );
};
