/**
 * EQUATION 1 — Diffraction vs Interference Studio
 * Dedicated comparative investigation into:
 * - Pure Two-Point Interference vs Single-Slit Diffraction vs Real Double-Slit Modulation
 * - Missing Orders phenomenon where interference maxima coincide with diffraction envelope zeros
 * - N-slit sharpening (transition to diffraction grating)
 * - Complete syllabus comparison table (Class 12 / AP Physics)
 */

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Layers,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';

export const DiffractionVsInterferenceStudio: React.FC = () => {
  const [ratioDa, setRatioDa] = useState<number>(3); // d/a ratio
  const [activeComparison, setActiveComparison] = useState<'pure_vs_real' | 'missing_orders' | 'n_slits'>('pure_vs_real');

  // SVG plot dimensions
  const plotWidth = 720;
  const plotHeight = 220;
  const plotCenter = plotWidth / 2;
  const plotBaseline = plotHeight - 30;

  // Compute curve paths for comparison
  const { pureInterferencePath, singleSlitPath, realDoubleSlitPath } = useMemo(() => {
    const steps = 300;
    const purePts: string[] = [];
    const singlePts: string[] = [];
    const realPts: string[] = [];

    // Range of theta parameter
    const maxTheta = 4.5 * Math.PI;

    for (let i = 0; i <= steps; i++) {
      const u = (i / steps) * 2 - 1; // -1 to +1
      const theta = u * maxTheta;
      const x = plotCenter + u * (plotWidth / 2 - 30);

      // Single slit beta = theta
      const beta = theta;
      const sinc = Math.abs(beta) < 1e-4 ? 1 : Math.sin(beta) / beta;
      const diffIntensity = sinc * sinc;

      // Double slit alpha = ratioDa * theta
      const alpha = ratioDa * theta;
      const pureInterf = Math.pow(Math.cos(alpha), 2);

      const realInterf = diffIntensity * pureInterf;

      const yPure = plotBaseline - pureInterf * 150;
      const ySingle = plotBaseline - diffIntensity * 150;
      const yReal = plotBaseline - realInterf * 150;

      purePts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yPure.toFixed(1)}`);
      singlePts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${ySingle.toFixed(1)}`);
      realPts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yReal.toFixed(1)}`);
    }

    return {
      pureInterferencePath: purePts.join(' '),
      singleSlitPath: singlePts.join(' '),
      realDoubleSlitPath: realPts.join(' '),
    };
  }, [ratioDa]);

  // Missing orders for the chosen integer ratio
  const missingOrders = useMemo(() => {
    const orders: { m: number; p: number }[] = [];
    const r = Math.round(ratioDa);
    for (let p = 1; p <= 3; p++) {
      orders.push({ m: p * r, p });
    }
    return orders;
  }, [ratioDa]);

  return (
    <div className="space-y-6 text-[#F1F5F9]">
      {/* 1. Header Banner */}
      <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#F1F5F9] flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-[#38BDF8]" />
            <span>INTERFERENCE VS. DIFFRACTION STUDIO</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Discover why real double-slit fringes are modulated by a single-slit diffraction envelope and how missing orders occur.
          </p>
        </div>

        {/* Studio sub-navigation tabs */}
        <div className="flex items-center gap-2 bg-[#0B1728] p-1 rounded-lg border border-[#26364D] self-start md:self-auto">
          <button
            onClick={() => setActiveComparison('pure_vs_real')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
              activeComparison === 'pure_vs_real'
                ? 'bg-[#17263B] text-[#38BDF8] border border-[#38BDF8]/40 shadow-xs'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            Modulation Curves
          </button>
          <button
            onClick={() => setActiveComparison('missing_orders')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
              activeComparison === 'missing_orders'
                ? 'bg-[#17263B] text-[#FB7185] border border-[#FB7185]/40 shadow-xs'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            Missing Orders (d/a)
          </button>
          <button
            onClick={() => setActiveComparison('n_slits')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
              activeComparison === 'n_slits'
                ? 'bg-[#17263B] text-[#34D399] border border-[#34D399]/40 shadow-xs'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            N-Slits to Grating
          </button>
        </div>
      </div>

      {/* 2. INTERACTIVE CURVE COMPARISON */}
      <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#F1F5F9] flex items-center gap-2">
              <span>Superposition of Diffraction Envelope & Interference Fringes</span>
              <span className="font-mono text-xs text-[#38BDF8] bg-[#17263B] px-2 py-0.5 rounded border border-[#26364D]">
                d/a = {ratioDa}
              </span>
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              The combined intensity is the product: <strong className="text-white font-mono">I(θ) = I₀ sinc²(β) · cos²(α)</strong>
            </p>
          </div>

          {/* Ratio Slider */}
          <div className="flex items-center gap-3 bg-[#0B1728] px-3 py-1.5 rounded-lg border border-[#26364D]">
            <span className="text-xs text-[#FBBF24] font-semibold whitespace-nowrap">Slit Ratio (d/a):</span>
            <input
              type="range"
              min="1"
              max="7"
              step="1"
              value={ratioDa}
              onChange={(e) => setRatioDa(parseInt(e.target.value))}
              className="w-28 accent-[#FBBF24] cursor-pointer"
            />
            <span className="font-mono font-bold text-xs text-white w-6">{ratioDa}:1</span>
          </div>
        </div>

        {/* SVG Curve Plot */}
        <div className="bg-[#0A1526] rounded-lg border border-[#26364D] p-3 overflow-x-auto">
          <svg viewBox={`0 0 ${plotWidth} ${plotHeight}`} className="w-full h-auto min-w-[600px] select-none">
            {/* Horizontal baseline */}
            <line x1="30" y1={plotBaseline} x2={plotWidth - 30} y2={plotBaseline} stroke="#334155" strokeWidth="1.5" />
            {/* Center axis */}
            <line x1={plotCenter} y1="20" x2={plotCenter} y2={plotBaseline} stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
            <text x={plotCenter} y={plotBaseline + 18} textAnchor="middle" className="fill-slate-400 font-mono text-[10px]">
              θ = 0 (Central Maximum)
            </text>

            {/* 1. Pure Interference (Ideal, infinite thin slits: dotted cyan) */}
            <path d={pureInterferencePath} fill="none" stroke="#38BDF8" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.35" />

            {/* 2. Single-slit diffraction envelope (purple dashed) */}
            <path d={singleSlitPath} fill="none" stroke="#A78BFA" strokeWidth="2" strokeDasharray="5 4" opacity="0.75" />

            {/* 3. Real Double-Slit (green solid) */}
            <path d={realDoubleSlitPath} fill="none" stroke="#34D399" strokeWidth="2.5" opacity="0.95" />

            {/* First diffraction zero markers */}
            <line x1={plotCenter - 145} y1="30" x2={plotCenter - 145} y2={plotBaseline} stroke="#A78BFA" strokeWidth="1" strokeDasharray="2 2" />
            <line x1={plotCenter + 145} y1="30" x2={plotCenter + 145} y2={plotBaseline} stroke="#A78BFA" strokeWidth="1" strokeDasharray="2 2" />
            <text x={plotCenter + 145} y={plotBaseline + 18} textAnchor="middle" className="fill-[#A78BFA] font-mono text-[9px] font-bold">
              β = π (1st Zero)
            </text>
            <text x={plotCenter - 145} y={plotBaseline + 18} textAnchor="middle" className="fill-[#A78BFA] font-mono text-[9px] font-bold">
              β = -π (1st Zero)
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs pt-1">
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-[#A78BFA] border-b border-dashed border-[#A78BFA] inline-block" />
            <span className="text-slate-300">Diffraction Envelope: <strong className="text-[#A78BFA] font-mono">sinc²(β)</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-[#38BDF8] border-b border-dotted border-[#38BDF8] inline-block" />
            <span className="text-slate-300">Pure Interference: <strong className="text-[#38BDF8] font-mono">cos²(α)</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-1 bg-[#34D399] rounded inline-block" />
            <span className="text-slate-300">Actual Double-Slit Resultant: <strong className="text-[#34D399] font-mono">I(θ)</strong></span>
          </div>
        </div>
      </div>

      {/* 3. MISSING ORDERS EXPLANATION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#FB7185]">
            <AlertTriangle className="w-4 h-4 text-[#FB7185]" />
            <span>Missing Orders Mechanism (d / a = {ratioDa})</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            In physical double slits, the slits have a non-zero finite width <strong className="text-white font-mono">a</strong>.
            When an interference maximum condition <strong className="text-[#38BDF8] font-mono">d sin θ = m λ</strong> falls at the exact same diffraction angle as a single-slit diffraction minimum <strong className="text-[#A78BFA] font-mono">a sin θ = p λ</strong>, the diffraction envelope zeroes out that entire fringe!
          </p>

          <div className="bg-[#0B1728] p-3 rounded-lg border border-[#26364D] space-y-2">
            <div className="text-xs font-mono font-bold text-slate-200">
              d / a = m / p ⟹ m = p × (d / a)
            </div>
            <div className="text-xs text-slate-400">
              For your current ratio <strong className="text-[#FBBF24]">d/a = {ratioDa}</strong>:
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {missingOrders.map((mo) => (
                <div
                  key={mo.m}
                  className="px-2.5 py-1 rounded bg-[#17263B] border border-[#FB7185]/40 text-[#FB7185] font-mono text-xs font-bold"
                >
                  m = ±{mo.m} (p = {mo.p})
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[#94A3B8] italic pt-1">
              Hence, bright fringes of order m = ±{ratioDa}, ±{2 * ratioDa}, ±{3 * ratioDa}... are completely missing from the screen!
            </p>
          </div>
        </div>

        {/* 4. SYLLABUS COMPARISON TABLE */}
        <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#38BDF8]">
            <CheckCircle2 className="w-4 h-4 text-[#38BDF8]" />
            <span>Key Syllabus Differences (Interference vs Diffraction)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#26364D] text-[#94A3B8]">
                  <th className="py-1.5 px-2">Property</th>
                  <th className="py-1.5 px-2 text-[#38BDF8]">Interference</th>
                  <th className="py-1.5 px-2 text-[#A78BFA]">Diffraction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#26364D] text-slate-300">
                <tr>
                  <td className="py-2 px-2 font-semibold text-slate-400">Origin</td>
                  <td className="py-2 px-2">Superposition of waves from two distinct coherent wavefronts (Slit 1 & Slit 2).</td>
                  <td className="py-2 px-2">Superposition of continuous secondary wavelets from different parts of the same wavefront.</td>
                </tr>
                <tr>
                  <td className="py-2 px-2 font-semibold text-slate-400">Fringe Width</td>
                  <td className="py-2 px-2 font-mono text-[#38BDF8]">All fringes have equal width (β = λD/d).</td>
                  <td className="py-2 px-2 font-mono text-[#A78BFA]">Central max is twice as wide as secondary maxima (2λD/a).</td>
                </tr>
                <tr>
                  <td className="py-2 px-2 font-semibold text-slate-400">Peak Intensity</td>
                  <td className="py-2 px-2">All bright fringes have equal peak intensity (in ideal thin slits).</td>
                  <td className="py-2 px-2">Intensity drops drastically for secondary maxima (1/22, 1/61...).</td>
                </tr>
                <tr>
                  <td className="py-2 px-2 font-semibold text-slate-400">Minima Darkness</td>
                  <td className="py-2 px-2">Completely dark (perfect contrast I_min = 0).</td>
                  <td className="py-2 px-2">Minima are dark, but secondary peaks are faint.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
