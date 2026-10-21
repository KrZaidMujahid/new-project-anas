/**
 * EQUATION 1 — Double-Slit Experimental Measurement Tool
 * Part 14: Interactive Fringe Width Measurement & Precision Metrology
 *
 * Allows students to:
 * - Inspect a virtual ruler along the observation screen
 * - Select any two bright fringes (m1 and m2)
 * - Calculate measured separation: Δy = |y_m2 - y_m1|
 * - Calculate theoretical fringe width: β = λL / d
 * - Calculate average measured fringe spacing: β_measured = Δy / |m2 - m1|
 * - Compute percentage error: (|measured - theoretical| / theoretical) × 100%
 * - Prevent division by zero when m1 == m2
 * - Understand physical sources of experimental uncertainty
 */

import React, { useState } from 'react';
import {
  DoubleSlitParameters,
  DoubleSlitPhysicsResults,
} from '../../physics/doubleslit/types';
import {
  Ruler,
  Calculator,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Info,
  Scale,
} from 'lucide-react';

interface DoubleSlitMeasurementToolProps {
  params: DoubleSlitParameters;
  results: DoubleSlitPhysicsResults;
  onSetDetectorY: (yMm: number) => void;
}

export const DoubleSlitMeasurementTool: React.FC<DoubleSlitMeasurementToolProps> = ({
  params,
  results,
  onSetDetectorY,
}) => {
  // Selected fringe orders for measurement
  const [m1, setM1] = useState<number>(-2);
  const [m2, setM2] = useState<number>(2);

  // Far-field calculation for positions of selected fringes
  const n = Math.max(1.0, params.mediumRefractiveIndex);
  const lambdaM = (params.wavelengthNm * 1e-9) / n;
  const dM = params.slitSeparationMm * 1e-3;
  const LM = params.screenDistanceM;

  const y1Mm = ((m1 * lambdaM * LM) / dM) * 1000;
  const y2Mm = ((m2 * lambdaM * LM) / dM) * 1000;

  const deltaY = Math.abs(y2Mm - y1Mm);
  const orderDiff = Math.abs(m2 - m1);
  const betaTheoryMm = results.fringeWidthMm;

  const betaMeasuredMm = orderDiff > 0 ? deltaY / orderDiff : 0;
  const percentError =
    orderDiff > 0 && betaTheoryMm > 0
      ? (Math.abs(betaMeasuredMm - betaTheoryMm) / betaTheoryMm) * 100
      : 0;

  const handleReset = () => {
    setM1(-2);
    setM2(2);
  };

  const availableOrders = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];

  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-5 text-[#F1F5F9]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#26364D] gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
            <Ruler className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F1F5F9]">Measure Fringe Width (β)</h3>
            <p className="text-xs text-[#94A3B8]">
              Virtual optical caliper: select two bright fringes to determine average fringe spacing and percentage error.
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#94A3B8] hover:text-[#F1F5F9] bg-[#17263B] hover:bg-[#26364D] rounded-lg border border-[#26364D] transition-colors cursor-pointer self-start sm:self-center"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Measurement</span>
        </button>
      </div>

      {/* Fringe Order Selector Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fringe 1 (m1) */}
        <div className="bg-[#0B1728] p-4 rounded-lg border border-[#26364D] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#FBBF24]">Fringe 1 Order (m₁)</span>
            <span className="font-mono font-bold text-xs text-[#FBBF24]">
              {m1 === 0 ? 'm₁ = 0 (Central Max)' : `m₁ = ${m1 > 0 ? `+${m1}` : m1}`}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {availableOrders.map((order) => (
              <button
                key={`m1-${order}`}
                onClick={() => {
                  setM1(order);
                  onSetDetectorY(((order * lambdaM * LM) / dM) * 1000);
                }}
                className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors cursor-pointer ${
                  m1 === order
                    ? 'bg-[#FBBF24] text-black font-bold border-[#FBBF24]'
                    : 'bg-[#17263B] text-slate-300 border-[#26364D] hover:bg-[#26364D]'
                }`}
              >
                {order > 0 ? `+${order}` : order}
              </button>
            ))}
          </div>
          <div className="text-[11px] text-slate-400 font-mono pt-1">
            Position: <strong className="text-white">{y1Mm.toFixed(3)} mm</strong> ({((y1Mm * 1e-3) / LM).toFixed(5)} rad)
          </div>
        </div>

        {/* Fringe 2 (m2) */}
        <div className="bg-[#0B1728] p-4 rounded-lg border border-[#26364D] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#38BDF8]">Fringe 2 Order (m₂)</span>
            <span className="font-mono font-bold text-xs text-[#38BDF8]">
              {m2 === 0 ? 'm₂ = 0 (Central Max)' : `m₂ = ${m2 > 0 ? `+${m2}` : m2}`}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {availableOrders.map((order) => (
              <button
                key={`m2-${order}`}
                onClick={() => {
                  setM2(order);
                  onSetDetectorY(((order * lambdaM * LM) / dM) * 1000);
                }}
                className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors cursor-pointer ${
                  m2 === order
                    ? 'bg-[#38BDF8] text-black font-bold border-[#38BDF8]'
                    : 'bg-[#17263B] text-slate-300 border-[#26364D] hover:bg-[#26364D]'
                }`}
              >
                {order > 0 ? `+${order}` : order}
              </button>
            ))}
          </div>
          <div className="text-[11px] text-slate-400 font-mono pt-1">
            Position: <strong className="text-white">{y2Mm.toFixed(3)} mm</strong> ({((y2Mm * 1e-3) / LM).toFixed(5)} rad)
          </div>
        </div>
      </div>

      {/* Calculation Readout Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Separation Δy */}
        <div className="bg-[#17263B] p-3.5 rounded-lg border border-[#26364D] space-y-1">
          <div className="text-[10px] text-[#94A3B8] uppercase font-semibold">Total Measured Distance (Δy)</div>
          <div className="font-mono font-bold text-lg text-white">
            {deltaY.toFixed(3)} mm
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            |y₂ - y₁| = |{y2Mm.toFixed(2)} - {y1Mm.toFixed(2)}|
          </div>
        </div>

        {/* Number of Orders Δm */}
        <div className="bg-[#17263B] p-3.5 rounded-lg border border-[#26364D] space-y-1">
          <div className="text-[10px] text-[#94A3B8] uppercase font-semibold">Order Interval (|m₂ - m₁|)</div>
          <div className="font-mono font-bold text-lg text-[#FBBF24]">
            {orderDiff} {orderDiff === 1 ? 'order' : 'orders'}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Spanning {orderDiff} fringe widths
          </div>
        </div>

        {/* Average Measured β */}
        <div className="bg-[#17263B] p-3.5 rounded-lg border border-[#26364D] space-y-1">
          <div className="text-[10px] text-[#94A3B8] uppercase font-semibold">Measured Fringe Width (β_meas)</div>
          <div className="font-mono font-bold text-lg text-[#34D399]">
            {orderDiff > 0 ? `${betaMeasuredMm.toFixed(3)} mm` : 'N/A (m₁ = m₂)'}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            β_meas = Δy / |m₂ - m₁|
          </div>
        </div>

        {/* Theoretical β & % Error */}
        <div className="bg-[#17263B] p-3.5 rounded-lg border border-[#26364D] space-y-1">
          <div className="text-[10px] text-[#94A3B8] uppercase font-semibold">Theoretical vs Error</div>
          <div className="font-mono font-bold text-lg text-[#38BDF8]">
            {betaTheoryMm.toFixed(3)} mm
          </div>
          <div className="text-[10px] font-mono flex items-center gap-1.5">
            <span className="text-slate-400">Error:</span>
            <span className={`font-bold ${percentError < 0.01 ? 'text-[#34D399]' : 'text-[#FBBF24]'}`}>
              {orderDiff > 0 ? `${percentError.toFixed(3)}%` : '0%'}
            </span>
          </div>
        </div>
      </div>

      {/* Experimental Metrology Explanatory Callout */}
      <div className="bg-[#0B1728] p-4 rounded-lg border border-[#26364D] flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-5 h-5 text-[#38BDF8] shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <div className="font-bold text-white flex items-center gap-2">
            <span>Why Measure Across Multiple Fringes? (Optical Metrology Technique)</span>
          </div>
          <p className="text-slate-400">
            In physical optics laboratories, measuring the separation between two adjacent fringes (m = 0 to m = 1) introduces high percentage reading error due to finite slit width and detector pixel resolution. By measuring across <strong className="text-white">N fringe orders</strong> (such as m = -2 to m = +2, spanning 4 fringes), the experimental random error is divided by <strong className="text-[#38BDF8]">N</strong>:
          </p>
          <div className="font-mono text-[11px] text-[#34D399] bg-[#101D30] p-2 rounded border border-[#26364D] inline-block">
            β_average = Δy / N = {deltaY.toFixed(3)} mm / {orderDiff || 1} = {betaMeasuredMm.toFixed(3)} mm
          </div>
          <p className="text-slate-400 text-[11px]">
            The theoretical fringe width is given strictly by <strong className="text-white font-mono">β = λL / d</strong>. In paraxial geometry where <strong className="text-white font-mono">L ≫ d</strong>, the theoretical and measured results align with near zero analytical error.
          </p>
        </div>
      </div>
    </div>
  );
};
