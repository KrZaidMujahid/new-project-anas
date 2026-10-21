/**
 * EQUATION 1 — Kinetic Theory of Gases Laboratory
 * Minimalist Studio Split Architecture:
 * - Top Left: 2D Molecular Dynamics Chamber (GasContainerSimulation)
 * - Top Right: Essential Parameters Deck (T, V, n, Gas Species)
 * - Middle: Mathematical Maxwell-Boltzmann Speed Distribution Plot (MaxwellBoltzmannGraph)
 * - Bottom: KaTeX Formula Card & Law Definitions
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  KineticParameters,
  KineticResults,
  GasType,
} from '../../physics/kinetic/types';
import {
  DEFAULT_KINETIC_PARAMS,
  computeKineticResults,
  GAS_CATALOG,
} from '../../physics/kinetic/model';
import { GasContainerSimulation } from './GasContainerSimulation';
import { MaxwellBoltzmannGraph } from './MaxwellBoltzmannGraph';
import { FormulaCard } from '../FormulaCard';
import { Flame, RotateCcw, Sliders } from 'lucide-react';

interface KineticLaboratoryProps {
  onBackToPhysics?: () => void;
}

export const KineticLaboratory: React.FC<KineticLaboratoryProps> = () => {
  const [params, setParams] = useState<KineticParameters>(DEFAULT_KINETIC_PARAMS);

  // Compute live physics results
  const results: KineticResults = useMemo(
    () => computeKineticResults(params),
    [params]
  );

  const handleParamChange = useCallback(
    <K extends keyof KineticParameters>(key: K, value: KineticParameters[K]) => {
      setParams((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const handleResetDefaults = useCallback(() => {
    setParams(DEFAULT_KINETIC_PARAMS);
  }, []);

  return (
    <div className="space-y-6 text-[#F8FAFC]">
      {/* 1. Module Header */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FB923C] uppercase tracking-wider font-semibold">
            <Flame className="w-4 h-4" />
            <span>Thermodynamics &amp; Statistical Mechanics</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#F8FAFC] tracking-tight mt-1">
            Kinetic Theory of Gases Laboratory
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
            Microscopic molecular collisions, pressure emergence, and Maxwell–Boltzmann velocity distributions.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#050508] hover:bg-[#121722] border border-[#1E293B] text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer min-h-[36px]"
            title="Reset parameters to standard 300 K Helium defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 2. Studio Split Layout: Simulation (Left) + Parameters (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Simulation Canvas (Hero, 8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-3 min-w-0">
          <GasContainerSimulation
            params={params}
            results={results}
            onParamChange={handleParamChange}
            onReset={handleResetDefaults}
          />
        </div>

        {/* Right: Essential Parameters Deck (4 cols on desktop) */}
        <div className="lg:col-span-4 bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 space-y-4 shadow-sm min-w-0">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#FB923C] font-bold">
              <Sliders className="w-4 h-4" />
              <span>State Variables</span>
            </div>
            <button
              onClick={handleResetDefaults}
              className="text-[11px] font-mono text-[#64748B] hover:text-[#FB923C] transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Gas Species Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8]">
              Gas Species
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['helium', 'neon', 'argon', 'nitrogen', 'oxygen'] as GasType[]).map((type) => {
                const sp = GAS_CATALOG[type];
                const active = params.gasType === type;
                return (
                  <button
                    key={type}
                    onClick={() => handleParamChange('gasType', type)}
                    className={`py-1.5 px-2 rounded text-xs font-mono border transition-colors cursor-pointer truncate ${
                      active
                        ? 'border-[#FB923C] text-[#FB923C] bg-[#FB923C]/10 font-bold'
                        : 'border-[#1E293B] text-[#94A3B8] bg-[#050508] hover:text-[#F8FAFC]'
                    }`}
                  >
                    {sp.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Parameter 1: Temperature T */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Temperature (T)</span>
              <span className="text-[#FB923C] font-bold">{params.temperatureK.toFixed(0)} K</span>
            </div>
            <input
              type="range"
              min={100}
              max={1000}
              step={10}
              value={params.temperatureK}
              onChange={(e) => handleParamChange('temperatureK', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#FB923C]"
            />
          </div>

          {/* Parameter 2: Volume V */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Chamber Volume (V)</span>
              <span className="text-[#38BDF8] font-bold">{params.volumeLiters.toFixed(1)} L</span>
            </div>
            <input
              type="range"
              min={1.0}
              max={10.0}
              step={0.5}
              value={params.volumeLiters}
              onChange={(e) => handleParamChange('volumeLiters', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#38BDF8]"
            />
          </div>

          {/* Parameter 3: Quantity n */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Amount of Substance (n)</span>
              <span className="text-[#34D399] font-bold">{params.moles.toFixed(2)} mol</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={2.0}
              step={0.1}
              value={params.moles}
              onChange={(e) => handleParamChange('moles', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#34D399]"
            />
          </div>

          {/* Key Calculated Thermodynamic Readouts */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1E293B]">
            <div className="p-2.5 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
              <div className="text-[10px] text-[#64748B]">Ideal Pressure (P)</div>
              <div className="text-sm font-bold text-[#A78BFA] mt-0.5">
                {results.pressureKPa.toFixed(1)} kPa
              </div>
            </div>
            <div className="p-2.5 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
              <div className="text-[10px] text-[#64748B]">RMS Speed (v_rms)</div>
              <div className="text-sm font-bold text-[#38BDF8] mt-0.5">
                {results.vRms.toFixed(0)} m/s
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Mathematical Speed Distribution Graph */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#FB923C] font-bold">
            Maxwell–Boltzmann Molecular Speed Distribution P(v)
          </span>
          <span className="text-[11px] font-mono text-[#64748B]">
            Analytical Probability Density Function
          </span>
        </div>
        <MaxwellBoltzmannGraph params={params} results={results} />
      </div>

      {/* 4. Minimalist KaTeX Formula Card */}
      <FormulaCard
        title="Kinetic Theory of Gases & Maxwell–Boltzmann Relations"
        formula="PV = nRT = N k_B T"
        additionalFormula="v_{\text{rms}} = \sqrt{\frac{3 k_B T}{m}} = \sqrt{\frac{3RT}{M}}"
        description="Macroscopic pressure arises from microscopic elastic momentum transfers against container walls. The root-mean-square molecular velocity depends strictly on absolute temperature T and molecular mass M, with average translational kinetic energy given by E_k = 3/2 k_B T."
        parameters={[
          { symbol: 'P', name: 'Gas Pressure', unit: 'kPa' },
          { symbol: 'V', name: 'Chamber Volume', unit: 'L' },
          { symbol: 'T', name: 'Absolute Temperature', unit: 'K' },
          { symbol: 'n', name: 'Molar Quantity', unit: 'mol' },
          { symbol: 'v_{\\text{rms}}', name: 'Root Mean Square Speed', unit: 'm/s' },
          { symbol: 'k_B', name: "Boltzmann Constant", unit: '1.381 \\times 10^{-23} J/K' },
        ]}
      />
    </div>
  );
};
