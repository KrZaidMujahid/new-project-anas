/**
 * EQUATION 1 — Snell's Law and Refraction Laboratory
 * Minimalist Studio Split Architecture:
 * - Top Left: Interactive Optical Ray Tracer (OpticsSimulationCanvas)
 * - Top Right: Essential Parameters Deck (θ1, n1, n2, geometry)
 * - Middle: Mathematical Refraction Curve θ2(θ1) & Critical Angle Plot
 * - Bottom: KaTeX Formula Card & Law Definitions
 */

import React, { useState, useMemo, useCallback } from 'react';
import { SnellParameters } from '../../physics/optics/types';
import {
  computePlanarOptics,
  computeSlabOptics,
  computePrismOptics,
  computeFiberOptics,
  OPTICAL_MEDIA_DATABASE,
} from '../../physics/optics/opticsModel';
import { OpticsSimulationCanvas } from './OpticsSimulationCanvas';
import { FormulaCard } from '../FormulaCard';
import { Eye, RotateCcw, Sliders } from 'lucide-react';

const DEFAULT_SNELL_PARAMS: SnellParameters = {
  geometry: 'planar',
  medium1Id: 'air',
  medium1CustomN: 1.0,
  medium2Id: 'crown_glass',
  medium2CustomN: 1.52,
  angleDeg: 45,
  wavelengthNm: 589,
  isWhiteLight: false,
  showNormal: true,
  showProtractor: true,
  showWavefronts: false,
  showRays: true,
  showIntensityFading: true,
  showPhotons: true,
  isReversed: false,
  slabThicknessMm: 100,
  prismApexAngleDeg: 60,
  fiberCoreRadiusMm: 50,
  fiberCladdingN: 1.38,
};

export const OpticsLaboratory: React.FC = () => {
  const [params, setParams] = useState<SnellParameters>(DEFAULT_SNELL_PARAMS);

  const planarResult = useMemo(() => computePlanarOptics(params), [params]);
  const slabResult = useMemo(() => computeSlabOptics(params), [params]);
  const prismResult = useMemo(() => computePrismOptics(params), [params]);
  const fiberResult = useMemo(() => computeFiberOptics(params), [params]);

  const handleParamChange = useCallback(
    <K extends keyof SnellParameters>(key: K, value: SnellParameters[K]) => {
      setParams((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const handleResetDefaults = useCallback(() => {
    setParams(DEFAULT_SNELL_PARAMS);
  }, []);

  const n1 = params.medium1CustomN;
  const n2 = params.medium2CustomN;
  const isTIRPossible = n1 > n2;
  const criticalAngleDeg = isTIRPossible ? (Math.asin(n2 / n1) * 180) / Math.PI : null;

  // Generate curve data points for theta2 vs theta1
  const curvePoints = useMemo(() => {
    const points: Array<{ theta1: number; theta2: number | null }> = [];
    for (let th1 = 0; th1 <= 90; th1 += 1) {
      const sinTh2 = (n1 / n2) * Math.sin((th1 * Math.PI) / 180);
      if (sinTh2 <= 1.0) {
        points.push({ theta1: th1, theta2: (Math.asin(sinTh2) * 180) / Math.PI });
      } else {
        points.push({ theta1: th1, theta2: null });
      }
    }
    return points;
  }, [n1, n2]);

  return (
    <div className="space-y-6 text-[#F8FAFC]">
      {/* 1. Module Header */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#38BDF8] uppercase tracking-wider font-semibold">
            <Eye className="w-4 h-4" />
            <span>Geometrical Optics</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#F8FAFC] tracking-tight mt-1">
            Snell&apos;s Law &amp; Refraction Laboratory
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
            Refraction across dielectric interfaces, critical angle, and total internal reflection (TIR).
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#050508] hover:bg-[#121722] border border-[#1E293B] text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer min-h-[36px]"
            title="Reset optical media to standard Air -> Glass"
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
          <OpticsSimulationCanvas
            params={params}
            onParamChange={handleParamChange}
            planarResult={planarResult}
            slabResult={slabResult}
            prismResult={prismResult}
            fiberResult={fiberResult}
          />
        </div>

        {/* Right: Essential Parameters (4 cols on desktop) */}
        <div className="lg:col-span-4 bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 space-y-4 shadow-sm min-w-0">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#38BDF8] font-bold">
              <Sliders className="w-4 h-4" />
              <span>Optical Parameters</span>
            </div>
            <button
              onClick={handleResetDefaults}
              className="text-[11px] font-mono text-[#64748B] hover:text-[#38BDF8] transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Geometry Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8]">
              Target Geometry
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'planar', label: 'Planar Interface' },
                { id: 'slab', label: 'Parallel Slab' },
                { id: 'prism', label: 'Triangular Prism' },
                { id: 'fiber', label: 'Optical Fiber' },
              ].map((geom) => (
                <button
                  key={geom.id}
                  onClick={() => handleParamChange('geometry', geom.id as any)}
                  className={`py-1.5 px-2 text-center text-[10px] font-mono rounded border transition-colors cursor-pointer ${
                    params.geometry === geom.id
                      ? 'border-[#38BDF8] text-[#38BDF8] bg-[#38BDF8]/10 font-bold'
                      : 'border-[#1E293B] text-[#94A3B8] bg-[#050508] hover:text-[#F8FAFC]'
                  }`}
                >
                  {geom.label}
                </button>
              ))}
            </div>
          </div>

          {/* Parameter 1: Angle of Incidence θ1 */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Incidence Angle (θ₁)</span>
              <span className="text-[#38BDF8] font-bold">{params.angleDeg.toFixed(1)}°</span>
            </div>
            <input
              type="range"
              min={0}
              max={89}
              step={0.5}
              value={params.angleDeg}
              onChange={(e) => handleParamChange('angleDeg', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#38BDF8]"
            />
          </div>

          {/* Parameter 2: Medium 1 Index n1 */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Medium 1 (n₁)</span>
              <span className="text-[#FBBF24] font-bold">{params.medium1CustomN.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={1.0}
              max={2.5}
              step={0.01}
              value={params.medium1CustomN}
              onChange={(e) => handleParamChange('medium1CustomN', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#FBBF24]"
            />
          </div>

          {/* Parameter 3: Medium 2 Index n2 */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Medium 2 (n₂)</span>
              <span className="text-[#34D399] font-bold">{params.medium2CustomN.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={1.0}
              max={2.5}
              step={0.01}
              value={params.medium2CustomN}
              onChange={(e) => handleParamChange('medium2CustomN', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#34D399]"
            />
          </div>

          {/* Readout of Optical Result */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1E293B]">
            <div className="p-2.5 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
              <div className="text-[10px] text-[#64748B]">Refracted (θ₂)</div>
              <div className="text-sm font-bold text-[#38BDF8]">
                {planarResult.isTIR || planarResult.theta2Deg === null ? 'TIR (Reflected)' : `${planarResult.theta2Deg.toFixed(1)}°`}
              </div>
            </div>
            <div className="p-2.5 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
              <div className="text-[10px] text-[#64748B]">Critical Angle (θc)</div>
              <div className="text-sm font-bold text-[#FBBF24]">
                {criticalAngleDeg ? `${criticalAngleDeg.toFixed(1)}°` : 'None (n1 ≤ n2)'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Mathematical Refraction Function Graph */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#38BDF8] font-bold">
            Mathematical Refraction Function θ₂(θ₁)
          </span>
          <span className="text-[11px] font-mono text-[#64748B]">Snell&apos;s Law Domain Plot</span>
        </div>

        <div className="relative w-full h-[220px] bg-[#050508] rounded-lg border border-[#1E293B] p-2 overflow-hidden">
          <svg viewBox="0 0 800 200" className="w-full h-full">
            {/* Grid Lines */}
            {[0, 30, 60, 90].map((th) => (
              <line
                key={`grid-x-${th}`}
                x1={50 + (th / 90) * 700}
                y1={20}
                x2={50 + (th / 90) * 700}
                y2={160}
                stroke="#1E293B"
                strokeDasharray="2 2"
              />
            ))}
            {[0, 30, 60, 90].map((th) => (
              <line
                key={`grid-y-${th}`}
                x1={50}
                y1={160 - (th / 90) * 140}
                x2={750}
                y2={160 - (th / 90) * 140}
                stroke="#1E293B"
                strokeDasharray="2 2"
              />
            ))}

            {/* Axes */}
            <line x1={50} y1={160} x2={750} y2={160} stroke="#475569" strokeWidth="1.5" />
            <line x1={50} y1={20} x2={50} y2={160} stroke="#475569" strokeWidth="1.5" />

            {/* Axis Labels */}
            <text x={400} y={185} textAnchor="middle" className="fill-[#94A3B8] font-mono text-[11px]">
              Angle of Incidence θ₁ (degrees)
            </text>
            <text x={20} y={95} textAnchor="middle" transform="rotate(-90 20 95)" className="fill-[#94A3B8] font-mono text-[11px]">
              θ₂ (deg)
            </text>

            {/* Refraction Curve */}
            {(() => {
              const validPoints = curvePoints.filter((p) => p.theta2 !== null) as Array<{ theta1: number; theta2: number }>;
              if (validPoints.length === 0) return null;
              const pathD = validPoints.reduce((acc, p, idx) => {
                const x = 50 + (p.theta1 / 90) * 700;
                const y = 160 - (p.theta2 / 90) * 140;
                return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
              }, '');
              return <path d={pathD} fill="none" stroke="#38BDF8" strokeWidth="2.5" />;
            })()}

            {/* Current operating point marker */}
            {!planarResult.isTIR && planarResult.theta2Deg !== null && (
              <circle
                cx={50 + (params.angleDeg / 90) * 700}
                cy={160 - (planarResult.theta2Deg / 90) * 140}
                r="5"
                fill="#38BDF8"
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            )}

            {/* Critical Angle Line */}
            {criticalAngleDeg && (
              <g>
                <line
                  x1={50 + (criticalAngleDeg / 90) * 700}
                  y1={20}
                  x2={50 + (criticalAngleDeg / 90) * 700}
                  y2={160}
                  stroke="#FBBF24"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <text
                  x={50 + (criticalAngleDeg / 90) * 700 + 5}
                  y={40}
                  className="fill-[#FBBF24] font-mono text-[10px] font-bold"
                >
                  θc = {criticalAngleDeg.toFixed(1)}° (TIR Threshold)
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* 4. Minimalist KaTeX Formula Card */}
      <FormulaCard
        title="Snell's Law of Refraction & Critical Angle"
        formula="n_1 \sin\theta_1 = n_2 \sin\theta_2 \implies \theta_2 = \arcsin\left(\frac{n_1}{n_2}\sin\theta_1\right)"
        additionalFormula="\theta_c = \arcsin\left(\frac{n_2}{n_1}\right) \quad (\text{for } n_1 > n_2)"
        description="Light bends towards the normal when passing into an optically denser medium (n2 > n1) and away when entering a rarer medium (n1 > n2). Beyond the critical angle θc, the refracted wave ceases to propagate and 100% of light energy undergoes total internal reflection."
        parameters={[
          { symbol: 'n_1', name: 'Incident Medium Index', unit: 'dimensionless' },
          { symbol: 'n_2', name: 'Refracting Medium Index', unit: 'dimensionless' },
          { symbol: '\\theta_1', name: 'Incidence Angle', unit: 'degrees' },
          { symbol: '\\theta_2', name: 'Refraction Angle', unit: 'degrees' },
          { symbol: '\\theta_c', name: 'Critical Angle', unit: 'degrees' },
        ]}
      />
    </div>
  );
};
