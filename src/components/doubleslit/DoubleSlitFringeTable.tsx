/**
 * EQUATION 1 — Double-Slit Fringe Width Calculator & Live Table
 * Part 6: Mathematical Table of Bright & Dark Fringes (m = -5 to +5)
 *
 * Implements:
 * - Exact and Far-Field fringe width: β = λL / d
 * - Display in meters and millimeters
 * - Central bright fringe position (y_0 = 0.00 mm)
 * - Complete live table for orders m = -5 to +5
 * - Clear distinction between slit width a and slit separation d
 * - Quick jump button to inspect any row on the canvas detector
 */

import React, { useMemo } from 'react';
import {
  DoubleSlitParameters,
  DoubleSlitPhysicsResults,
} from '../../physics/doubleslit/types';
import { generateFringeOrdersTable } from '../../physics/doubleslit/model';
import {
  Table,
  Calculator,
  ArrowRight,
  Crosshair,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface DoubleSlitFringeTableProps {
  params: DoubleSlitParameters;
  results: DoubleSlitPhysicsResults;
  onSelectY: (yMm: number) => void;
}

export const DoubleSlitFringeTable: React.FC<DoubleSlitFringeTableProps> = ({
  params,
  results,
  onSelectY,
}) => {
  const tableData = useMemo(() => generateFringeOrdersTable(params), [params]);

  const n = Math.max(1.0, params.mediumRefractiveIndex);
  const lambdaEffNm = params.wavelengthNm / n;
  const lambdaEffM = lambdaEffNm * 1e-9;
  const dM = params.slitSeparationMm * 1e-3;
  const LM = params.screenDistanceM;
  const betaM = (lambdaEffM * LM) / dM;
  const betaMm = betaM * 1000;

  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-4 text-[#F1F5F9]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#26364D] gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F1F5F9]">Fringe Width Calculator &amp; Live Order Table</h3>
            <p className="text-xs text-[#94A3B8]">
              Far-field interference positions for bright and dark fringes from m = -5 to +5.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#FBBF24] bg-[#17263B] px-3 py-1 rounded-md border border-[#26364D]">
            β = {betaMm.toFixed(3)} mm ({betaM.toExponential(3)} m)
          </span>
        </div>
      </div>

      {/* Critical Theory Callout: d vs a */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-[#0B1728] p-3 rounded-lg border border-[#26364D]">
          <div className="text-[10px] text-[#94A3B8] uppercase font-semibold">Fringe Width Formula</div>
          <div className="font-mono font-bold text-sm text-[#38BDF8] mt-1">
            β = λL / d
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Separation <strong className="text-[#FBBF24] font-mono">d = {params.slitSeparationMm.toFixed(2)} mm</strong> determines fringe spacing.
          </div>
        </div>

        <div className="bg-[#0B1728] p-3 rounded-lg border border-[#26364D]">
          <div className="text-[10px] text-[#94A3B8] uppercase font-semibold">Slit Width Distinction</div>
          <div className="font-mono font-bold text-sm text-[#34D399] mt-1">
            a = {params.slitWidthMm.toFixed(2)} mm (Diffraction)
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Slit width <strong className="text-[#34D399] font-mono">a</strong> only shapes envelope, <span className="text-rose-400">NOT</span> fringe spacing.
          </div>
        </div>

        <div className="bg-[#0B1728] p-3 rounded-lg border border-[#26364D]">
          <div className="text-[10px] text-[#94A3B8] uppercase font-semibold">Central Maximum (m = 0)</div>
          <div className="font-mono font-bold text-sm text-white mt-1">
            y₀ = 0.000 mm (δ = 0 nm)
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Zero path difference; waves arrive perfectly in phase with maximum intensity.
          </div>
        </div>
      </div>

      {/* Live Table */}
      <div className="overflow-x-auto max-h-[380px] rounded-lg border border-[#26364D] scrollbar-thin">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0B1728] text-[#94A3B8] sticky top-0 uppercase tracking-wider font-mono text-[10px] border-b border-[#26364D]">
            <tr>
              <th className="py-2.5 px-3">Order (m)</th>
              <th className="py-2.5 px-3">Condition</th>
              <th className="py-2.5 px-3">Position y_m (mm)</th>
              <th className="py-2.5 px-3">Path Diff δ (nm)</th>
              <th className="py-2.5 px-3">Phase Diff Δφ</th>
              <th className="py-2.5 px-3">Relative Intensity</th>
              <th className="py-2.5 px-3 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#17263B] font-mono bg-[#101D30]">
            {tableData.map((row) => {
              const isSelected = Math.abs(params.detectorYMm - row.yMm) < 0.15;
              const isCentral = row.type === 'central';
              const isBright = row.type === 'bright';
              const isDark = row.type === 'dark';

              return (
                <tr
                  key={`fringe-${row.order}`}
                  className={`hover:bg-[#17263B] transition-colors ${
                    isSelected ? 'bg-[#17263B] font-bold' : ''
                  }`}
                >
                  <td className="py-2 px-3 text-white font-bold">
                    {row.order > 0 ? `+${row.order}` : row.order}
                  </td>
                  <td className="py-2 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-sans font-semibold ${
                        isCentral
                          ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40'
                          : isBright
                          ? 'bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/40'
                          : 'bg-[#FB7185]/20 text-[#FB7185] border border-[#FB7185]/40'
                      }`}
                    >
                      {row.orderLabel}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-slate-200">
                    {row.yMm > 0 ? `+${row.yMm.toFixed(3)}` : row.yMm.toFixed(3)}
                  </td>
                  <td className="py-2 px-3 text-[#FBBF24]">
                    {row.pathDiffNm.toFixed(1)} nm ({Math.abs(row.order).toFixed(1)}λ)
                  </td>
                  <td className="py-2 px-3 text-[#A78BFA]">
                    {row.phaseDiffDeg.toFixed(0)}° ({(row.phaseDiffDeg * Math.PI / 180).toFixed(2)} rad)
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-[#0B1728] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${(row.theoreticalIntensity * 100).toFixed(0)}%`,
                            backgroundColor: results.rgbColor,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {(row.theoreticalIntensity * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-right">
                    <button
                      onClick={() => onSelectY(row.yMm)}
                      className="px-2 py-1 text-[10px] text-[#38BDF8] hover:text-white bg-[#0B1728] hover:bg-[#38BDF8]/20 rounded border border-[#26364D] hover:border-[#38BDF8] transition-colors cursor-pointer"
                      title="Move detector to this fringe"
                    >
                      Probe
                    </button>
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
