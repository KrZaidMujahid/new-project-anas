/**
 * EQUATION 1 — Lorentz Force Laboratory
 * Minimalist Studio Split Architecture:
 * - Top Left: Charged Particle Trajectory Viewport (LorentzSimulationCanvas)
 * - Top Right: Essential Parameters Deck (Mode, Species, Speed, B, E)
 * - Middle: Mathematical Cyclotron Radius Function r(B)
 * - Bottom: KaTeX Formula Card & Law Definitions
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  LorentzParameters,
  LorentzDerivedValues,
  LorentzMotionMode,
} from '../../physics/lorentz/types';
import {
  computeLorentzDerivedValues,
  ELEMENTARY_CHARGE,
  PROTON_MASS,
  ELECTRON_MASS,
  ALPHA_MASS,
} from '../../physics/lorentz/model';
import { LorentzSimulationCanvas } from './LorentzSimulationCanvas';
import { FormulaCard } from '../FormulaCard';
import { Zap, RotateCcw, Sliders } from 'lucide-react';

const DEFAULT_LORENTZ_PARAMS: LorentzParameters = {
  charge: ELEMENTARY_CHARGE,
  chargeNumber: 1,
  mass: PROTON_MASS,
  speed: 2.0e6, // 2.0 × 10⁶ m/s
  initialVelocityAngleDeg: 0,
  bFieldStrength: 0.5, // 0.5 T
  bFieldDirection: 'out-of-screen',
  angleThetaDeg: 90,
  electricFieldEnabled: false,
  eFieldStrength: 1.0e6,
  eFieldDirection: 'up',
  mode: 'perpendicular',
  animationSpeed: 1.0,
};

export const LorentzLaboratory: React.FC = () => {
  const [params, setParams] = useState<LorentzParameters>(DEFAULT_LORENTZ_PARAMS);

  // Compute derived invariants
  const derived = useMemo<LorentzDerivedValues>(() => {
    return computeLorentzDerivedValues(params);
  }, [params]);

  const handleUpdateParams = useCallback(
    (updater: (prev: LorentzParameters) => LorentzParameters) => {
      setParams(updater);
    },
    []
  );

  const handleSelectMode = useCallback((mode: LorentzMotionMode) => {
    setParams((prev) => ({
      ...prev,
      mode,
      electricFieldEnabled: mode === 'crossed-fields' || mode === 'electric-only',
      angleThetaDeg: mode === 'helical' ? 60 : 90,
    }));
  }, []);

  const handleSelectSpecies = useCallback((species: 'proton' | 'electron' | 'alpha') => {
    if (species === 'proton') {
      setParams((prev) => ({
        ...prev,
        charge: ELEMENTARY_CHARGE,
        chargeNumber: 1,
        mass: PROTON_MASS,
      }));
    } else if (species === 'electron') {
      setParams((prev) => ({
        ...prev,
        charge: -ELEMENTARY_CHARGE,
        chargeNumber: -1,
        mass: ELECTRON_MASS,
      }));
    } else {
      setParams((prev) => ({
        ...prev,
        charge: 2 * ELEMENTARY_CHARGE,
        chargeNumber: 2,
        mass: ALPHA_MASS,
      }));
    }
  }, []);

  const handleResetDefaults = useCallback(() => {
    setParams(DEFAULT_LORENTZ_PARAMS);
  }, []);

  // Compute points for mathematical curve r(B) = (m * v) / (|q| * B)
  const graphPoints = useMemo(() => {
    const points: Array<{ B: number; rCm: number }> = [];
    const qAbs = Math.max(1e-25, Math.abs(params.charge));
    const m = params.mass;
    const vPerp = params.speed * Math.sin((params.angleThetaDeg * Math.PI) / 180);

    for (let b = 0.05; b <= 1.5; b += 0.05) {
      const rM = (m * vPerp) / (qAbs * b);
      points.push({ B: b, rCm: rM * 100 });
    }
    return points;
  }, [params.charge, params.mass, params.speed, params.angleThetaDeg]);

  const currentRCm = (derived.cyclotronRadius ?? 0) * 100;

  return (
    <div className="space-y-6 text-[#F8FAFC]">
      {/* 1. Module Header */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FBBF24] uppercase tracking-wider font-semibold">
            <Zap className="w-4 h-4" />
            <span>Electromagnetism &amp; Particle Dynamics</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#F8FAFC] tracking-tight mt-1">
            Lorentz Force &amp; Charged Particle Motion
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
            Cyclotron orbits, helical trajectories, and crossed electromagnetic fields governed by F = q(E + v × B).
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#050508] hover:bg-[#121722] border border-[#1E293B] text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer min-h-[36px]"
            title="Reset parameters to standard 0.5 T proton defaults"
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
          <LorentzSimulationCanvas
            params={params}
            onUpdateParams={handleUpdateParams}
            onSelectMode={handleSelectMode}
          />
        </div>

        {/* Right: Essential Parameters Deck (4 cols on desktop) */}
        <div className="lg:col-span-4 bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 space-y-4 shadow-sm min-w-0">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#FBBF24] font-bold">
              <Sliders className="w-4 h-4" />
              <span>Particle &amp; Field Controls</span>
            </div>
            <button
              onClick={handleResetDefaults}
              className="text-[11px] font-mono text-[#64748B] hover:text-[#FBBF24] transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Mode Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8]">
              Motion Mode
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'perpendicular', label: 'Circular' },
                { id: 'helical', label: 'Helical' },
                { id: 'crossed-fields', label: 'Crossed E×B' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleSelectMode(m.id as LorentzMotionMode)}
                  className={`py-1.5 px-2 rounded text-xs font-mono border transition-colors cursor-pointer text-center truncate ${
                    params.mode === m.id
                      ? 'border-[#FBBF24] text-[#FBBF24] bg-[#FBBF24]/10 font-bold'
                      : 'border-[#1E293B] text-[#94A3B8] bg-[#050508] hover:text-[#F8FAFC]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Species Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8]">
              Test Particle
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'proton', label: 'Proton (p⁺)' },
                { id: 'electron', label: 'Electron (e⁻)' },
                { id: 'alpha', label: 'Alpha (α²⁺)' },
              ].map((s) => {
                const active =
                  (s.id === 'proton' && params.charge > 0 && params.mass > 1e-27 && params.chargeNumber === 1) ||
                  (s.id === 'electron' && params.charge < 0) ||
                  (s.id === 'alpha' && params.chargeNumber === 2);
                return (
                  <button
                    key={s.id}
                    onClick={() => handleSelectSpecies(s.id as 'proton' | 'electron' | 'alpha')}
                    className={`py-1.5 px-2 rounded text-xs font-mono border transition-colors cursor-pointer text-center truncate ${
                      active
                        ? 'border-[#38BDF8] text-[#38BDF8] bg-[#38BDF8]/10 font-bold'
                        : 'border-[#1E293B] text-[#94A3B8] bg-[#050508] hover:text-[#F8FAFC]'
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Parameter 1: Magnetic Field B */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Magnetic Field (B)</span>
              <span className="text-[#38BDF8] font-bold">{params.bFieldStrength.toFixed(2)} T</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={1.5}
              step={0.05}
              value={params.bFieldStrength}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  bFieldStrength: parseFloat(e.target.value),
                }))
              }
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#38BDF8]"
            />
          </div>

          {/* Parameter 2: Particle Speed v */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Initial Speed (v)</span>
              <span className="text-[#A78BFA] font-bold">
                {(params.speed / 1e6).toFixed(2)} × 10⁶ m/s
              </span>
            </div>
            <input
              type="range"
              min={0.5e6}
              max={5.0e6}
              step={0.1e6}
              value={params.speed}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  speed: parseFloat(e.target.value),
                }))
              }
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#A78BFA]"
            />
          </div>

          {/* Parameter 3: Pitch Angle θ (for helical) */}
          {params.mode === 'helical' && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#F8FAFC]">Field Angle (θ)</span>
                <span className="text-[#34D399] font-bold">{params.angleThetaDeg.toFixed(0)}°</span>
              </div>
              <input
                type="range"
                min={15}
                max={85}
                step={5}
                value={params.angleThetaDeg}
                onChange={(e) =>
                  setParams((prev) => ({
                    ...prev,
                    angleThetaDeg: parseFloat(e.target.value),
                  }))
                }
                className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#34D399]"
              />
            </div>
          )}

          {/* Key Calculated Electrodynamic Invariants */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1E293B]">
            <div className="p-2 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
              <div className="text-[10px] text-[#64748B]">Radius (r)</div>
              <div className="text-xs font-bold text-[#FBBF24] mt-0.5">
                {derived.cyclotronRadius !== null ? `${(derived.cyclotronRadius * 100).toFixed(2)} cm` : '—'}
              </div>
            </div>
            <div className="p-2 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
              <div className="text-[10px] text-[#64748B]">Period (T)</div>
              <div className="text-xs font-bold text-[#38BDF8] mt-0.5">
                {derived.cyclotronPeriod !== null ? `${(derived.cyclotronPeriod * 1e9).toFixed(1)} ns` : '—'}
              </div>
            </div>
            <div className="p-2 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
              <div className="text-[10px] text-[#64748B]">Cyclotron f</div>
              <div className="text-xs font-bold text-[#34D399] mt-0.5">
                {derived.cyclotronFrequency !== null ? `${(derived.cyclotronFrequency / 1e6).toFixed(1)} MHz` : '—'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Mathematical Cyclotron Radius Graph */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#FBBF24] font-bold">
            Mathematical Cyclotron Radius Function r(B)
          </span>
          <span className="text-[11px] font-mono text-[#64748B]">
            Gyroradius Inversely Proportional to Magnetic Field
          </span>
        </div>

        {/* SVG Curve Plot */}
        <div className="w-full h-44 bg-[#050508] rounded-lg border border-[#1E293B] p-2 flex items-center justify-center">
          <svg viewBox="0 0 700 160" className="w-full h-full">
            {/* Grid Lines */}
            <line x1="60" y1="20" x2="60" y2="130" stroke="#1E293B" strokeWidth="1" />
            <line x1="60" y1="130" x2="680" y2="130" stroke="#1E293B" strokeWidth="1" />
            <line x1="60" y1="75" x2="680" y2="75" stroke="#1E293B" strokeDasharray="4,4" strokeWidth="1" />

            {/* Axis labels */}
            <text x="35" y="25" fill="#64748B" fontSize="10" fontFamily="monospace">r (cm)</text>
            <text x="640" y="145" fill="#64748B" fontSize="10" fontFamily="monospace">B (T)</text>

            {/* Plot path */}
            {graphPoints.length > 0 && (() => {
              const maxR = Math.max(...graphPoints.map((p) => p.rCm));
              const pts = graphPoints.map((p) => {
                const x = 60 + ((p.B - 0.05) / (1.5 - 0.05)) * 600;
                const y = 130 - (p.rCm / maxR) * 105;
                return `${x.toFixed(1)},${Math.max(25, y).toFixed(1)}`;
              });

              // Operating point
              const currentX = 60 + ((params.bFieldStrength - 0.05) / (1.5 - 0.05)) * 600;
              const currentY = Math.max(25, 130 - (currentRCm / maxR) * 105);

              return (
                <>
                  <polyline
                    fill="none"
                    stroke="#FBBF24"
                    strokeWidth="2"
                    points={pts.join(' ')}
                  />
                  {/* Current operating marker */}
                  <circle cx={currentX} cy={currentY} r="5" fill="#38BDF8" stroke="#F8FAFC" strokeWidth="1.5" />
                  <line x1={currentX} y1="20" x2={currentX} y2="130" stroke="#38BDF8" strokeDasharray="3,3" strokeWidth="1" />
                  <text x={Math.min(currentX + 8, 620)} y={currentY - 8} fill="#38BDF8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                    {currentRCm.toFixed(2)} cm @ {params.bFieldStrength.toFixed(2)} T
                  </text>
                </>
              );
            })()}
          </svg>
        </div>
      </div>

      {/* 4. Minimalist KaTeX Formula Card */}
      <FormulaCard
        title="Electrodynamics of Lorentz Force & Cyclotron Motion"
        formula="\vec{F} = q(\vec{E} + \vec{v} \times \vec{B})"
        additionalFormula="r = \frac{m v_\perp}{|q| B} \quad \text{and} \quad \omega_c = \frac{|q| B}{m}"
        description="A magnetic field exerts a velocity-dependent deflecting force perpendicular to both motion and magnetic field lines, performing zero work and causing circular centripetal acceleration. When velocity has a parallel component, helical motion results with invariant cyclotron gyrofrequency."
        parameters={[
          { symbol: '\\vec{F}', name: 'Lorentz Force', unit: 'N' },
          { symbol: 'q', name: 'Particle Charge', unit: 'C' },
          { symbol: '\\vec{B}', name: 'Magnetic Flux Density', unit: 'T' },
          { symbol: 'r', name: 'Cyclotron Orbit Radius', unit: 'cm' },
          { symbol: '\\omega_c', name: 'Cyclotron Frequency', unit: 'rad/s' },
          { symbol: 'T', name: 'Revolution Period', unit: 's' },
        ]}
      />
    </div>
  );
};
