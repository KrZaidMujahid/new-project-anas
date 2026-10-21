/**
 * EQUATION 1 — RLC Resonance Laboratory & Frequency Response Graph
 * Plots steady-state current I(f) vs. frequency, highlights f_0, and provides
 * a 1-click "Set Frequency to Resonance" shortcut.
 */

import React, { useMemo, useCallback } from 'react';
import { Target, Sparkles, ArrowRight, Gauge, Activity } from 'lucide-react';
import { RLCParameters, SeriesCalculations, ParallelCalculations } from '../../physics/circuits/types';

interface ResonancePanelProps {
  params: RLCParameters;
  seriesCalc: SeriesCalculations;
  parallelCalc: ParallelCalculations;
  onSetFrequency: (freq: number) => void;
}

export const ResonancePanel: React.FC<ResonancePanelProps> = ({
  params,
  seriesCalc,
  parallelCalc,
  onSetFrequency,
}) => {
  const isSeries = params.circuitMode === 'series';
  const f0 = isSeries ? seriesCalc.resonanceFrequency : parallelCalc.resonanceFrequency;
  const currentF = params.sourceFrequency;

  // Determine an intelligent frequency range for the plot centered around f0
  // e.g. from max(1, 0.1 * f0) to 2.5 * f0
  const { minF, maxF, curvePoints, maxCurrentInPlot, minCurrentInPlot } = useMemo(() => {
    const safeF0 = Math.max(1, f0);
    const lowF = Math.max(1, Math.min(10, safeF0 * 0.15));
    const highF = Math.max(lowF + 50, Math.min(1000, safeF0 * 2.5));

    const steps = 180;
    const df = (highF - lowF) / steps;
    const pts: { f: number; iVal: number }[] = [];
    let maxI = 0.001;
    let minI = 1e6;

    const R = Math.max(0.1, params.resistance);
    const L = Math.max(1e-6, params.inductanceMilliHenries * 1e-3);
    const C = Math.max(1e-12, params.capacitanceMicroFarads * 1e-6);
    const vRMS = Math.max(0.1, params.sourceVoltageRMS);

    for (let s = 0; s <= steps; s++) {
      const fVal = lowF + s * df;
      const omega = 2 * Math.PI * fVal;
      const XL = omega * L;
      const XC = 1 / (omega * C);

      let iVal = 0;
      if (isSeries) {
        const netX = XL - XC;
        const Z = Math.sqrt(R * R + netX * netX);
        iVal = vRMS / Z;
      } else {
        const cond = 1 / R;
        const susc = 1 / XC - 1 / XL;
        const Y = Math.sqrt(cond * cond + susc * susc);
        iVal = vRMS * Y;
      }

      if (iVal > maxI) maxI = iVal;
      if (iVal < minI) minI = iVal;
      pts.push({ f: fVal, iVal });
    }

    return { minF: lowF, maxF: highF, curvePoints: pts, maxCurrentInPlot: maxI, minCurrentInPlot: minI };
  }, [f0, params.resistance, params.inductanceMilliHenries, params.capacitanceMicroFarads, params.sourceVoltageRMS, isSeries]);

  const width = 640;
  const height = 260;
  const padL = 60;
  const padR = 30;
  const padT = 30;
  const padB = 40;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  // Build SVG path
  const svgPath = useMemo(() => {
    if (curvePoints.length < 2) return '';
    let d = '';

    const yMax = maxCurrentInPlot * 1.15;
    for (let k = 0; k < curvePoints.length; k++) {
      const pt = curvePoints[k];
      const xNorm = (pt.f - minF) / (maxF - minF);
      const x = padL + xNorm * plotW;
      const yNorm = pt.iVal / yMax;
      const y = height - padB - yNorm * plotH;

      if (k === 0) d += `M ${x.toFixed(1)} ${y.toFixed(1)}`;
      else d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    return d;
  }, [curvePoints, minF, maxF, maxCurrentInPlot, padL, padB, plotW, plotH, height]);

  // Current marker position
  const currentMarkerX = useMemo(() => {
    if (currentF < minF) return padL;
    if (currentF > maxF) return width - padR;
    const norm = (currentF - minF) / (maxF - minF);
    return padL + norm * plotW;
  }, [currentF, minF, maxF, padL, padR, plotW, width]);

  // Resonance frequency f0 marker position
  const resonanceMarkerX = useMemo(() => {
    if (f0 < minF) return padL;
    if (f0 > maxF) return width - padR;
    const norm = (f0 - minF) / (maxF - minF);
    return padL + norm * plotW;
  }, [f0, minF, maxF, padL, padR, plotW, width]);

  // Click on graph to set frequency
  const handleGraphClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const scaleX = width / rect.width;
      const svgX = clickX * scaleX;

      if (svgX >= padL && svgX <= width - padR) {
        const frac = (svgX - padL) / plotW;
        const targetFreq = Math.round(minF + frac * (maxF - minF));
        onSetFrequency(Math.max(1, Math.min(1000, targetFreq)));
      }
    },
    [width, padL, padR, plotW, minF, maxF, onSetFrequency]
  );

  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-4">
      {/* Title & Resonance Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#26364D] pb-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-[#FB7185]" />
          <div>
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F1F5F9]">
              RLC Resonance Laboratory &amp; Frequency Response
            </h2>
            <div className="text-[11px] text-[#94A3B8]">
              Resonance Frequency: <span className="font-mono font-bold text-[#FB7185]">{f0.toFixed(1)} Hz</span>
              {isSeries && (
                <> &middot; Q Factor = <span className="font-mono text-[#38BDF8]">{seriesCalc.qualityFactor.toFixed(2)}</span> &middot; Bandwidth = <span className="font-mono text-[#34D399]">{seriesCalc.bandwidthHz.toFixed(1)} Hz</span></>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => onSetFrequency(parseFloat(f0.toFixed(1)))}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FB7185] hover:bg-[#F43F5E] text-[#07111F] text-xs font-bold transition-all cursor-pointer shadow-md shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Set Frequency to Resonance ({f0.toFixed(1)} Hz)</span>
        </button>
      </div>

      {/* SVG Frequency Response Graph */}
      <div className="w-full relative rounded-xl overflow-hidden border border-[#26364D] bg-[#0A1526] shadow-inner">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto block select-none cursor-crosshair"
          onClick={handleGraphClick}
          style={{ minHeight: '200px' }}
        >
          {/* Grid lines */}
          <g opacity="0.3">
            <line x1={padL} y1={padT} x2={width - padR} y2={padT} stroke="#26364D" strokeWidth="1" strokeDasharray="3 3" />
            <line x1={padL} y1={padT + plotH / 2} x2={width - padR} y2={padT + plotH / 2} stroke="#26364D" strokeWidth="1" strokeDasharray="2 2" />
            <line x1={padL} y1={height - padB} x2={width - padR} y2={height - padB} stroke="#94A3B8" strokeWidth="1" />

            {[0, 0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
              const xPos = padL + frac * plotW;
              const fTick = Math.round(minF + frac * (maxF - minF));
              return (
                <g key={idx}>
                  <line x1={xPos} y1={padT} x2={xPos} y2={height - padB} stroke="#26364D" strokeWidth="1" strokeDasharray="2 2" />
                  <text x={xPos} y={height - padB + 14} fill="#94A3B8" fontSize="9" fontFamily="ui-monospace, monospace" textAnchor="middle">
                    {fTick} Hz
                  </text>
                </g>
              );
            })}
          </g>

          {/* Current Axis Labels */}
          <text x={12} y={padT + 10} fill="#38BDF8" fontSize="10" fontWeight="bold" fontFamily="ui-monospace, monospace">
            {(maxCurrentInPlot).toFixed(2)}A
          </text>
          <text x={12} y={padT + plotH / 2 + 3} fill="#94A3B8" fontSize="9" fontFamily="ui-monospace, monospace">
            {(maxCurrentInPlot / 2).toFixed(2)}A
          </text>
          <text x={12} y={height - padB} fill="#94A3B8" fontSize="9" fontFamily="ui-monospace, monospace">
            0A
          </text>

          {/* Vertical Resonance Line at f0 */}
          <line
            x1={resonanceMarkerX}
            y1={padT}
            x2={resonanceMarkerX}
            y2={height - padB}
            stroke="#FB7185"
            strokeWidth="1.8"
            strokeDasharray="4 2"
          />
          <text
            x={resonanceMarkerX}
            y={padT - 8}
            fill="#FB7185"
            fontSize="10"
            fontWeight="bold"
            fontFamily="ui-monospace, monospace"
            textAnchor="middle"
          >
            f_0 = {f0.toFixed(1)} Hz
          </text>

          {/* Resonance Curve Path */}
          <path
            d={svgPath}
            fill="none"
            stroke={isSeries ? '#38BDF8' : '#FBBF24'}
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Vertical Active Frequency Marker */}
          <line
            x1={currentMarkerX}
            y1={padT}
            x2={currentMarkerX}
            y2={height - padB}
            stroke="#34D399"
            strokeWidth="2"
          />
          <circle cx={currentMarkerX} cy={height - padB} r="4" fill="#34D399" />
          <text
            x={currentMarkerX}
            y={height - padB + 28}
            fill="#34D399"
            fontSize="10"
            fontWeight="bold"
            fontFamily="ui-monospace, monospace"
            textAnchor="middle"
          >
            f = {currentF} Hz
          </text>

          {/* Graph Legend */}
          <g transform={`translate(${width - 220}, ${padT + 8})`}>
            <rect x="0" y="0" width="180" height="24" rx="4" fill="#101D30" fillOpacity="0.85" stroke="#26364D" strokeWidth="1" />
            <line x1="10" y1="12" x2="28" y2="12" stroke={isSeries ? '#38BDF8' : '#FBBF24'} strokeWidth="2.5" />
            <text x="36" y="15" fill="#F1F5F9" fontSize="10" fontWeight="bold" fontFamily="ui-monospace, monospace">
              {isSeries ? 'Series I(f) Current' : 'Parallel I_source(f)'}
            </text>
          </g>
        </svg>
      </div>

      {/* Physics Resonance Insights Box */}
      <div className="bg-[#17263B] p-3.5 rounded-lg border border-[#26364D] text-xs text-[#94A3B8] leading-relaxed space-y-1.5">
        <div className="font-bold text-[#F1F5F9] flex items-center justify-between">
          <span>Resonant Magnification &amp; Energy Exchange Principle:</span>
          <span className="text-[#FB7185] font-mono">
            {isSeries ? `I_max = ${(params.sourceVoltageRMS / params.resistance).toFixed(2)} A` : `I_min = ${(params.sourceVoltageRMS / params.resistance).toFixed(2)} A`}
          </span>
        </div>
        <p>
          At resonance (f = {f0.toFixed(1)} Hz), inductive reactance (X_L = {seriesCalc.inductiveReactance.toFixed(1)} Ω) exactly equals capacitive reactance (X_C = {seriesCalc.capacitiveReactance.toFixed(1)} Ω). The reactive voltage drops V_L and V_C are 180° out of phase and cancel out in Kirchhoff&apos;s loop, allowing the entire source voltage to fall across the resistor.
          {isSeries && seriesCalc.qualityFactor > 1 && (
            <span className="text-[#38BDF8] block mt-1">
              <strong>Voltage Magnification:</strong> Because Q = {seriesCalc.qualityFactor.toFixed(1)}, the RMS voltage across the inductor and capacitor reaches V_L = V_C = Q &times; V_source = {(seriesCalc.qualityFactor * params.sourceVoltageRMS).toFixed(1)} V, which exceeds the supply voltage!
            </span>
          )}
        </p>
      </div>
    </div>
  );
};
