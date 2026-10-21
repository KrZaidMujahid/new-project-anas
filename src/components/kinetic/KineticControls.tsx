/**
 * EQUATION 1 — Thermodynamic & Experimental Controls Panel
 * High-precision controls for Temperature, Volume, Moles, Gas Species,
 * and visual particle density.
 */

import React from 'react';
import {
  KineticParameters,
  KineticResults,
  GasType,
} from '../../physics/kinetic/types';
import { GAS_CATALOG } from '../../physics/kinetic/model';
import {
  Sliders,
  RotateCcw,
  Thermometer,
  Layers,
  Atom,
  Flame,
  Snowflake,
  Sun,
  Beaker,
} from 'lucide-react';

interface KineticControlsProps {
  params: KineticParameters;
  results: KineticResults;
  onParamChange: <K extends keyof KineticParameters>(
    key: K,
    value: KineticParameters[K]
  ) => void;
  onResetDefaults: () => void;
}

export const KineticControls: React.FC<KineticControlsProps> = ({
  params,
  results,
  onParamChange,
  onResetDefaults,
}) => {
  const gasSpeciesList = Object.values(GAS_CATALOG);

  return (
    <div className="bg-[#102740] rounded-xl border border-[#29445F] p-5 shadow-xl space-y-5 text-[#F1F5F9]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#29445F] pb-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[#38BDF8]">
          <Sliders className="w-4 h-4 text-[#38BDF8]" />
          <span>Thermodynamic Parameters &amp; Controls</span>
        </div>
        <button
          onClick={onResetDefaults}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#AFC2D8] hover:text-[#F1F5F9] bg-[#16334F] hover:bg-[#29445F] rounded-md transition-colors border border-[#29445F] cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* 1. GAS SPECIES SELECTOR */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[#AFC2D8] uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Atom className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Select Gas Type (Molar Mass M)</span>
          </span>
          <span className="font-mono text-[#38BDF8] text-[11px]">
            Current: {results.gasSpecies.name} ({results.gasSpecies.formula}) • {results.gasSpecies.molarMassGPerMol} g/mol
          </span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {gasSpeciesList.map((gas) => {
            const isSelected = params.gasType === gas.id;
            return (
              <button
                key={gas.id}
                onClick={() => onParamChange('gasType', gas.id)}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#16334F] border-[#38BDF8] text-[#38BDF8] shadow-md shadow-[#38BDF8]/10'
                    : 'bg-[#0B1F36] border-[#29445F] text-[#AFC2D8] hover:bg-[#16334F] hover:text-[#F1F5F9]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">{gas.name}</span>
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: gas.particleColor }}
                  />
                </div>
                <div className="text-[11px] font-mono mt-1 text-slate-300">
                  {gas.formula} ({gas.molarMassGPerMol} g/mol)
                </div>
                <div className="text-[9px] text-[#AFC2D8] truncate capitalize mt-0.5">
                  {gas.atomicity}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. TEMPERATURE (100 K to 1000 K) */}
      <div className="bg-[#0B1F36] p-4 rounded-lg border border-[#29445F] space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-[#FB923C]" />
            <span className="font-semibold text-white">Absolute Temperature (T)</span>
            <span className="text-[11px] text-[#AFC2D8] font-mono">
              [100 K – 1000 K]
            </span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-[11px] text-[#AFC2D8]">Value (K):</label>
            <input
              type="number"
              min="100"
              max="1000"
              step="5"
              value={Math.round(params.temperatureK)}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) {
                  onParamChange('temperatureK', Math.max(100, Math.min(1000, val)));
                }
              }}
              className="w-20 px-2 py-0.5 rounded bg-[#16334F] border border-[#29445F] font-mono text-xs text-right text-white focus:outline-none focus:border-[#FB923C]"
            />
            <span className="text-[11px] font-mono text-[#FB923C]">K</span>
          </div>
        </div>

        <input
          type="range"
          min="100"
          max="1000"
          step="5"
          value={params.temperatureK}
          onChange={(e) => onParamChange('temperatureK', parseFloat(e.target.value))}
          className="w-full accent-[#FB923C] cursor-pointer"
        />

        {/* Quick Temperature Presets */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 text-[10px]">
          <span className="text-slate-400 font-mono">Presets:</span>
          {[
            { label: '200 K (Liquid Nitrogen)', temp: 200, icon: <Snowflake className="w-3 h-3 text-[#38BDF8]" /> },
            { label: '273 K (Ice Point)', temp: 273, icon: <Snowflake className="w-3 h-3 text-[#38BDF8]" /> },
            { label: '300 K (Room Temp)', temp: 300, icon: <Sun className="w-3 h-3 text-[#4ADE80]" /> },
            { label: '500 K (Heated Steam)', temp: 500, icon: <Flame className="w-3 h-3 text-[#FB923C]" /> },
            { label: '800 K (Furnace Flame)', temp: 800, icon: <Flame className="w-3 h-3 text-[#EF4444]" /> },
          ].map((preset) => (
            <button
              key={preset.temp}
              onClick={() => onParamChange('temperatureK', preset.temp)}
              className={`px-2 py-1 rounded font-mono border transition-all cursor-pointer flex items-center gap-1 ${
                Math.abs(params.temperatureK - preset.temp) < 2
                  ? 'bg-[#16334F] border-[#FB923C] text-[#FB923C] font-bold'
                  : 'bg-[#071426] border-[#29445F] text-[#AFC2D8] hover:text-[#F1F5F9]'
              }`}
            >
              {preset.icon}
              <span>{preset.temp} K</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. GEOMETRY: VOLUME (1 L to 10 L) & MOLES (0.1 to 2.0 mol) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* VOLUME */}
        <div className="bg-[#0B1F36] p-4 rounded-lg border border-[#29445F] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#38BDF8]">Container Volume (V)</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="1"
                max="10"
                step="0.1"
                value={params.volumeLiters}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) {
                    onParamChange('volumeLiters', Math.max(1, Math.min(10, val)));
                  }
                }}
                className="w-16 px-1.5 py-0.5 rounded bg-[#16334F] border border-[#29445F] font-mono text-xs text-right text-[#38BDF8] focus:outline-none focus:border-[#38BDF8]"
              />
              <span className="text-[10px] text-[#AFC2D8] font-mono">L</span>
            </div>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="0.1"
            value={params.volumeLiters}
            onChange={(e) => onParamChange('volumeLiters', parseFloat(e.target.value))}
            className="w-full accent-[#38BDF8] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#AFC2D8] font-mono">
            <span>1.0 L (Compressed)</span>
            <span>V = {(params.volumeLiters * 1e-3).toFixed(3)} m³</span>
            <span>10.0 L (Expanded)</span>
          </div>
        </div>

        {/* NUMBER OF MOLES */}
        <div className="bg-[#0B1F36] p-4 rounded-lg border border-[#29445F] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#A78BFA]">Amount of Gas (n)</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0.1"
                max="2.0"
                step="0.1"
                value={params.moles}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) {
                    onParamChange('moles', Math.max(0.1, Math.min(2.0, val)));
                  }
                }}
                className="w-16 px-1.5 py-0.5 rounded bg-[#16334F] border border-[#29445F] font-mono text-xs text-right text-[#A78BFA] focus:outline-none focus:border-[#A78BFA]"
              />
              <span className="text-[10px] text-[#AFC2D8] font-mono">mol</span>
            </div>
          </div>
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.05"
            value={params.moles}
            onChange={(e) => onParamChange('moles', parseFloat(e.target.value))}
            className="w-full accent-[#A78BFA] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#AFC2D8] font-mono">
            <span>0.1 mol</span>
            <span>N ≈ {(params.moles * 6.022e23).toExponential(2)} molecules</span>
            <span>2.0 mol</span>
          </div>
        </div>
      </div>

      {/* 4. NUMBER OF VISIBLE PARTICLES (50 to 150) */}
      <div className="bg-[#0B1F36] p-4 rounded-lg border border-[#29445F] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#4ADE80]" />
            <span className="font-semibold text-white">Visual Particle Count (Sample Ensemble)</span>
            <span className="text-[11px] text-[#AFC2D8] font-mono">
              [50 to 150 particles]
            </span>
          </div>
          <span className="font-mono text-xs text-[#4ADE80] font-bold">
            {params.visibleParticleCount} particles
          </span>
        </div>
        <input
          type="range"
          min="50"
          max="150"
          step="10"
          value={params.visibleParticleCount}
          onChange={(e) =>
            onParamChange('visibleParticleCount', parseInt(e.target.value, 10))
          }
          className="w-full accent-[#4ADE80] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#AFC2D8]">
          <span>50 (Sparse illustration)</span>
          <span className="italic">Visual sample only; does not alter macroscopic moles (n)</span>
          <span>150 (Dense ensemble)</span>
        </div>
      </div>
    </div>
  );
};
