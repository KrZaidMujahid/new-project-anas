/**
 * EQUATION 1 — RLC Circuits Laboratory
 * Minimalist Studio Split Architecture:
 * - Top Left: Interactive AC Circuit Diagram (CircuitDiagramSvg)
 * - Top Right: Essential Parameters Deck (R, L, C, f, mode)
 * - Middle: Mathematical Oscilloscope Waveform Graph v(t) & i(t) (WaveformGraphSvg)
 * - Bottom: KaTeX Formula Card & Law Definitions
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  RLCParameters,
  SelectedComponent,
} from '../../physics/circuits/types';
import {
  computeSeriesRLC,
  computeParallelRLC,
} from '../../physics/circuits/model';
import { CircuitDiagramSvg } from './CircuitDiagramSvg';
import { WaveformGraphSvg } from './WaveformGraphSvg';
import { FormulaCard } from '../FormulaCard';
import { Zap, RotateCcw, Sliders } from 'lucide-react';

const DEFAULT_CIRCUITS_PARAMS: RLCParameters = {
  circuitMode: 'series',
  resistance: 100, // 100 Ω
  inductanceMilliHenries: 100, // 100 mH
  capacitanceMicroFarads: 100, // 100 µF
  sourceVoltageRMS: 12, // 12 V RMS
  voltageDisplayMode: 'rms',
  sourceFrequency: 50, // 50 Hz
  showComponentVoltages: true,
  showCurrentDirection: true,
  transientType: 'rc',
  transientAction: 'charge',
  dcSourceVoltage: 12,
  transientSimulationTimeMs: 20,
};

export const CircuitsLaboratory: React.FC = () => {
  const [params, setParams] = useState<RLCParameters>(DEFAULT_CIRCUITS_PARAMS);
  const [selectedComponent, setSelectedComponent] = useState<SelectedComponent>(null);

  // Compute electrodynamic quantities
  const seriesCalc = useMemo(() => computeSeriesRLC(params), [params]);
  const parallelCalc = useMemo(() => computeParallelRLC(params), [params]);

  const handleParamChange = useCallback(
    <K extends keyof RLCParameters>(key: K, value: RLCParameters[K]) => {
      setParams((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const handleResetDefaults = useCallback(() => {
    setParams(DEFAULT_CIRCUITS_PARAMS);
    setSelectedComponent(null);
  }, []);

  const activeCalc = params.circuitMode === 'series' ? seriesCalc : parallelCalc;

  return (
    <div className="space-y-6 text-[#F8FAFC]">
      {/* 1. Module Header */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FBBF24] uppercase tracking-wider font-semibold">
            <Zap className="w-4 h-4" />
            <span>Electrodynamics &amp; AC Circuits</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#F8FAFC] tracking-tight mt-1">
            RLC Circuits &amp; Electrical Resonance
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
            Alternating current response, reactive impedance, phase shift, and resonance in series and parallel topologies.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#050508] hover:bg-[#121722] border border-[#1E293B] text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer min-h-[36px]"
            title="Reset parameters to standard 50 Hz RLC values"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 2. Studio Split Layout: Simulation (Left) + Parameters (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Circuit Schematic (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-3 min-w-0">
          <CircuitDiagramSvg
            params={params}
            seriesCalc={seriesCalc}
            parallelCalc={parallelCalc}
            selectedComponent={selectedComponent}
            onSelectComponent={setSelectedComponent}
            onToggleVoltages={() =>
              handleParamChange('showComponentVoltages', !params.showComponentVoltages)
            }
            onToggleCurrentDirection={() =>
              handleParamChange('showCurrentDirection', !params.showCurrentDirection)
            }
          />
        </div>

        {/* Right: Essential Parameters Deck (4 cols on desktop) */}
        <div className="lg:col-span-4 bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 space-y-4 shadow-sm min-w-0">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#FBBF24] font-bold">
              <Sliders className="w-4 h-4" />
              <span>Circuit Parameters</span>
            </div>
            <button
              onClick={handleResetDefaults}
              className="text-[11px] font-mono text-[#64748B] hover:text-[#FBBF24] transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Circuit Mode: Series vs Parallel */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8]">
              Topology
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleParamChange('circuitMode', 'series')}
                className={`py-1.5 px-3 rounded text-xs font-mono border transition-colors cursor-pointer text-center ${
                  params.circuitMode === 'series'
                    ? 'border-[#FBBF24] text-[#FBBF24] bg-[#FBBF24]/10 font-bold'
                    : 'border-[#1E293B] text-[#94A3B8] bg-[#050508] hover:text-[#F8FAFC]'
                }`}
              >
                Series RLC
              </button>
              <button
                onClick={() => handleParamChange('circuitMode', 'parallel')}
                className={`py-1.5 px-3 rounded text-xs font-mono border transition-colors cursor-pointer text-center ${
                  params.circuitMode === 'parallel'
                    ? 'border-[#FBBF24] text-[#FBBF24] bg-[#FBBF24]/10 font-bold'
                    : 'border-[#1E293B] text-[#94A3B8] bg-[#050508] hover:text-[#F8FAFC]'
                }`}
              >
                Parallel RLC
              </button>
            </div>
          </div>

          {/* Parameter 1: Resistance R */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Resistance (R)</span>
              <span className="text-[#38BDF8] font-bold">{params.resistance.toFixed(0)} Ω</span>
            </div>
            <input
              type="range"
              min={10}
              max={500}
              step={5}
              value={params.resistance}
              onChange={(e) => handleParamChange('resistance', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#38BDF8]"
            />
          </div>

          {/* Parameter 2: Inductance L */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Inductance (L)</span>
              <span className="text-[#A78BFA] font-bold">{params.inductanceMilliHenries.toFixed(0)} mH</span>
            </div>
            <input
              type="range"
              min={10}
              max={500}
              step={5}
              value={params.inductanceMilliHenries}
              onChange={(e) =>
                handleParamChange('inductanceMilliHenries', parseFloat(e.target.value))
              }
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#A78BFA]"
            />
          </div>

          {/* Parameter 3: Capacitance C */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Capacitance (C)</span>
              <span className="text-[#34D399] font-bold">{params.capacitanceMicroFarads.toFixed(0)} µF</span>
            </div>
            <input
              type="range"
              min={10}
              max={500}
              step={5}
              value={params.capacitanceMicroFarads}
              onChange={(e) =>
                handleParamChange('capacitanceMicroFarads', parseFloat(e.target.value))
              }
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#34D399]"
            />
          </div>

          {/* Parameter 4: Source Frequency f */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">AC Frequency (f)</span>
              <span className="text-[#FBBF24] font-bold">{params.sourceFrequency.toFixed(1)} Hz</span>
            </div>
            <input
              type="range"
              min={10}
              max={300}
              step={1}
              value={params.sourceFrequency}
              onChange={(e) => handleParamChange('sourceFrequency', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#FBBF24]"
            />
          </div>

          {/* Key Calculated Electrodynamic Invariants */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1E293B]">
            <div className="p-2 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
              <div className="text-[10px] text-[#64748B]">Impedance (Z)</div>
              <div className="text-xs font-bold text-[#FBBF24] mt-0.5">
                {(params.circuitMode === 'series' ? seriesCalc.impedance : parallelCalc.equivalentImpedance).toFixed(1)} Ω
              </div>
            </div>
            <div className="p-2 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
              <div className="text-[10px] text-[#64748B]">Resonance (f₀)</div>
              <div className="text-xs font-bold text-[#38BDF8] mt-0.5">
                {seriesCalc.resonanceFrequency.toFixed(1)} Hz
              </div>
            </div>
            <div className="p-2 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
              <div className="text-[10px] text-[#64748B]">Phase (φ)</div>
              <div className="text-xs font-bold text-[#34D399] mt-0.5">
                {(seriesCalc.phaseAngleRad * (180 / Math.PI)).toFixed(1)}°
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Mathematical Oscilloscope Graph */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#FBBF24] font-bold">
            Oscilloscope: Voltage v(t) &amp; Current i(t) Waveforms
          </span>
          <span className="text-[11px] font-mono text-[#64748B]">
            Synchronized Phase Shift &amp; Instantaneous AC Coordinates
          </span>
        </div>
        <WaveformGraphSvg params={params} seriesCalc={seriesCalc} />
      </div>

      {/* 4. Minimalist KaTeX Formula Card */}
      <FormulaCard
        title="Electrodynamics of RLC Circuits & Resonance"
        formula="Z = \sqrt{R^2 + (X_L - X_C)^2} \quad \text{where} \quad X_L = 2\pi f L, \; X_C = \frac{1}{2\pi f C}"
        additionalFormula="f_0 = \frac{1}{2\pi\sqrt{LC}} \quad \text{and} \quad \tan\phi = \frac{X_L - X_C}{R}"
        description="In an AC circuit, inductive reactance XL advances current phase while capacitive reactance XC retards it. At the resonant frequency f0, inductive and capacitive reactances cancel out (XL = XC), minimizing circuit impedance to pure resistance R and maximizing current amplitude."
        parameters={[
          { symbol: 'Z', name: 'Total Impedance', unit: 'Ω' },
          { symbol: 'R', name: 'Ohmic Resistance', unit: 'Ω' },
          { symbol: 'L', name: 'Inductance', unit: 'H' },
          { symbol: 'C', name: 'Capacitance', unit: 'F' },
          { symbol: 'f_0', name: 'Resonant Frequency', unit: 'Hz' },
          { symbol: '\\phi', name: 'Phase Angle', unit: 'rad' },
        ]}
      />
    </div>
  );
};
