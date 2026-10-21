/**
 * EQUATION 1 — Doppler Effect Laboratory
 * Minimalist Studio Split Architecture:
 * - Top Left: Acoustic Wavefront Simulation (DopplerSimulationCanvas)
 * - Top Right: Essential Parameters Deck (fs, vs, vo, v) & Playback Controls
 * - Middle: Mathematical Doppler Frequency Curve fo(vs)
 * - Bottom: KaTeX Formula Card & Law Definitions
 */

import React, { useState, useMemo, useCallback } from 'react';
import { DopplerParameters, DopplerDerivedValues } from '../../physics/doppler/types';
import { computeDopplerDerivedValues, DOPPLER_PRESETS } from '../../physics/doppler/model';
import { DopplerSimulationCanvas } from './DopplerSimulationCanvas';
import { FormulaCard } from '../FormulaCard';
import { Volume2, RotateCcw, Sparkles, Sliders } from 'lucide-react';

const DEFAULT_DOPPLER_PARAMS: DopplerParameters = {
  sourceFrequency: 500,
  speedOfSound: 343,
  sourceVelocity: 30,
  observerVelocity: 0,
  animationSpeed: 1.0,
};

export const DopplerLaboratory: React.FC = () => {
  const [params, setParams] = useState<DopplerParameters>(DEFAULT_DOPPLER_PARAMS);

  // Compute derived invariants
  const derived = useMemo<DopplerDerivedValues>(() => {
    return computeDopplerDerivedValues(params);
  }, [params]);

  const handleResetDefaults = useCallback(() => {
    setParams(DEFAULT_DOPPLER_PARAMS);
  }, []);

  // Compute fo vs vs points for mathematical plot
  const graphPoints = useMemo(() => {
    const points: Array<{ vs: number; fo: number }> = [];
    const v = params.speedOfSound;
    const fs = params.sourceFrequency;
    const vo = params.observerVelocity;

    for (let vs = -150; vs <= 150; vs += 5) {
      if (Math.abs(v - vs) > 10) {
        const fo = fs * ((v + vo) / (v - vs));
        if (fo > 0 && fo < 3000) {
          points.push({ vs, fo });
        }
      }
    }
    return points;
  }, [params.speedOfSound, params.sourceFrequency, params.observerVelocity]);

  return (
    <div className="space-y-6 text-[#F8FAFC]">
      {/* 1. Module Header */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#38BDF8] uppercase tracking-wider font-semibold">
            <Volume2 className="w-4 h-4" />
            <span>Acoustics &amp; Wave Mechanics</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#F8FAFC] tracking-tight mt-1">
            Doppler Effect &amp; Acoustic Wavefronts
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
            Wavefront compression, frequency shift from relative velocity, and acoustic Mach shock transitions.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#050508] hover:bg-[#121722] border border-[#1E293B] text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer min-h-[36px]"
            title="Reset parameters to standard 500 Hz source"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 2. Studio Split Layout: Simulation Canvas (Left) + Parameters (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Simulation Canvas (Hero, 8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-3 min-w-0">
          <DopplerSimulationCanvas
            params={params}
            onUpdateParams={setParams}
          />
        </div>

        {/* Right: Essential Parameters (4 cols on desktop) */}
        <div className="lg:col-span-4 bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 space-y-4 shadow-sm min-w-0">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#38BDF8] font-bold">
              <Sliders className="w-4 h-4" />
              <span>Acoustic Controls</span>
            </div>
            <button
              onClick={handleResetDefaults}
              className="text-[11px] font-mono text-[#64748B] hover:text-[#38BDF8] transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Quick Presets */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8]">
              Standard Scenarios
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label: 'Ambulance (30 m/s)', vs: 30, fs: 700 },
                { label: 'Police Siren (45 m/s)', vs: 45, fs: 850 },
                { label: 'Stationary (0 m/s)', vs: 0, fs: 500 },
                { label: 'High Speed (80 m/s)', vs: 80, fs: 400 },
              ].map((sc) => (
                <button
                  key={sc.label}
                  onClick={() => setParams((p) => ({ ...p, sourceVelocity: sc.vs, sourceFrequency: sc.fs }))}
                  className="py-1 px-2 text-[10px] font-mono rounded border border-[#1E293B] text-[#94A3B8] bg-[#050508] hover:text-[#F8FAFC] transition-colors cursor-pointer truncate"
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Parameter 1: Source Frequency fs */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Source Frequency (fₛ)</span>
              <span className="text-[#38BDF8] font-bold">{params.sourceFrequency} Hz</span>
            </div>
            <input
              type="range"
              min={200}
              max={1200}
              step={25}
              value={params.sourceFrequency}
              onChange={(e) => setParams((p) => ({ ...p, sourceFrequency: parseInt(e.target.value) }))}
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#38BDF8]"
            />
          </div>

          {/* Parameter 2: Source Velocity vs */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Source Speed (vₛ)</span>
              <span className="text-[#FBBF24] font-bold">{params.sourceVelocity.toFixed(0)} m/s</span>
            </div>
            <input
              type="range"
              min={-150}
              max={150}
              step={5}
              value={params.sourceVelocity}
              onChange={(e) => setParams((p) => ({ ...p, sourceVelocity: parseFloat(e.target.value) }))}
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#FBBF24]"
            />
          </div>

          {/* Parameter 3: Observer Velocity vo */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Observer Speed (vₒ)</span>
              <span className="text-[#34D399] font-bold">{params.observerVelocity.toFixed(0)} m/s</span>
            </div>
            <input
              type="range"
              min={-60}
              max={60}
              step={5}
              value={params.observerVelocity}
              onChange={(e) => setParams((p) => ({ ...p, observerVelocity: parseFloat(e.target.value) }))}
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#34D399]"
            />
          </div>

          {/* Doppler Result Readout */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1E293B]">
            <div className="p-2.5 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
              <div className="text-[10px] text-[#64748B]">Observed (fₒ)</div>
              <div className="text-sm font-bold text-[#38BDF8]">
                {derived.observedFrequency.toFixed(1)} Hz
              </div>
            </div>
            <div className="p-2.5 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
              <div className="text-[10px] text-[#64748B]">Shift (Δf)</div>
              <div className="text-sm font-bold text-[#FBBF24]">
                {derived.frequencyShift >= 0 ? '+' : ''}{derived.frequencyShift.toFixed(1)} Hz
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Mathematical Doppler Response Graph */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#38BDF8] font-bold">
            Mathematical Observed Frequency Function fₒ(vₛ)
          </span>
          <span className="text-[11px] font-mono text-[#64748B]">Shift vs Relative Velocity</span>
        </div>

        <div className="relative w-full h-[200px] bg-[#050508] rounded-lg border border-[#1E293B] p-2 overflow-hidden">
          <svg viewBox="0 0 800 180" className="w-full h-full">
            {/* Grid */}
            {[-100, -50, 0, 50, 100].map((vs) => (
              <line
                key={`g-${vs}`}
                x1={400 + (vs / 150) * 350}
                y1={20}
                x2={400 + (vs / 150) * 350}
                y2={150}
                stroke="#1E293B"
                strokeDasharray="2 2"
              />
            ))}

            {/* Axes */}
            <line x1={50} y1={150} x2={750} y2={150} stroke="#475569" strokeWidth="1.5" />
            <line x1={400} y1={20} x2={400} y2={150} stroke="#475569" strokeWidth="1.5" />

            <text x={400} y={170} textAnchor="middle" className="fill-[#94A3B8] font-mono text-[10px]">
              Source Velocity vₛ (m/s)  [Approaching →]
            </text>
            <text x={20} y={85} textAnchor="middle" transform="rotate(-90 20 85)" className="fill-[#94A3B8] font-mono text-[10px]">
              fₒ (Hz)
            </text>

            {/* Curve */}
            {(() => {
              if (graphPoints.length < 2) return null;
              const maxFo = Math.max(...graphPoints.map((p) => p.fo), 1200);
              const minFo = Math.min(...graphPoints.map((p) => p.fo), 200);

              const pathD = graphPoints.reduce((acc, p, idx) => {
                const x = 400 + (p.vs / 150) * 350;
                const y = 150 - ((p.fo - minFo) / (maxFo - minFo)) * 125;
                return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
              }, '');

              const curX = 400 + (params.sourceVelocity / 150) * 350;
              const curY = 150 - ((derived.observedFrequency - minFo) / (maxFo - minFo)) * 125;

              return (
                <g>
                  <path d={pathD} fill="none" stroke="#38BDF8" strokeWidth="2.5" />
                  <circle cx={curX} cy={curY} r="5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.5" />
                </g>
              );
            })()}
          </svg>
        </div>
      </div>

      {/* 4. Minimalist KaTeX Formula Card */}
      <FormulaCard
        title="Doppler Effect Equations"
        formula="f_o = f_s \left(\frac{v \pm v_o}{v \mp v_s}\right)"
        additionalFormula="\lambda' = \lambda_0 \left(1 \mp \frac{v_s}{v}\right) \quad \text{and} \quad \Delta f = f_o - f_s"
        description="When the source moves toward the observer (vs > 0), successive wavefronts compress ahead of the source, decreasing wavelength λ' and increasing observed frequency fo. When receding, wavefronts stretch, causing a red shift."
        parameters={[
          { symbol: 'f_s', name: 'Emitted Source Frequency', unit: 'Hz' },
          { symbol: 'f_o', name: 'Perceived Observer Frequency', unit: 'Hz' },
          { symbol: 'v', name: 'Speed of Sound', unit: 'm/s' },
          { symbol: 'v_s', name: 'Source Velocity', unit: 'm/s' },
          { symbol: 'v_o', name: 'Observer Velocity', unit: 'm/s' },
          { symbol: '\\lambda\'', name: 'Compressed Wavelength', unit: 'm' },
        ]}
      />
    </div>
  );
};
