/**
 * EQUATION 1 — AC Voltage and Current Waveform Visualizer
 * High-precision oscilloscope-style SVG graph displaying v(t) = V_pk sin(ωt)
 * and i(t) = I_pk sin(ωt - φ) with live animation, phase shift cursor, and playback controls.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, Activity } from 'lucide-react';
import { RLCParameters, SeriesCalculations } from '../../physics/circuits/types';

interface WaveformGraphSvgProps {
  params: RLCParameters;
  seriesCalc: SeriesCalculations;
}

export const WaveformGraphSvg: React.FC<WaveformGraphSvgProps> = ({
  params,
  seriesCalc,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeOffset, setTimeOffset] = useState(0);
  const animRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Oscilloscope Animation Loop
  useEffect(() => {
    const loop = (timestamp: number) => {
      if (lastTimestampRef.current === null) lastTimestampRef.current = timestamp;
      const deltaSec = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      if (isPlaying) {
        // advance time smoothly: 1 second of wall clock simulates ~1/10 second of electrical time for good visibility
        setTimeOffset((prev) => prev + deltaSec * 0.15);
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying]);

  const handleReset = () => {
    setTimeOffset(0);
  };

  const f = Math.max(0.1, params.sourceFrequency);
  const omega = 2 * Math.PI * f;
  const T = 1 / f; // Period in seconds
  const periodMs = T * 1000;

  // Display 2 complete cycles on screen
  const totalWindowSec = 2 * T;
  const totalWindowMs = totalWindowSec * 1000;

  const width = 640;
  const height = 280;
  const paddingLeft = 60;
  const paddingRight = 40;
  const paddingTop = 30;
  const paddingBottom = 40;
  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;
  const midY = paddingTop + plotHeight / 2;

  const vPeak = seriesCalc.vPeak;
  const iPeak = seriesCalc.currentPeak;
  const phaseRad = seriesCalc.phaseAngleRad;
  const phaseDeg = seriesCalc.phaseAngleDeg;

  // Generate waveform path points
  const { vPath, iPath, numPoints } = useMemo(() => {
    const pts = 240;
    let vD = '';
    let iD = '';

    const vMaxPlot = Math.max(1, vPeak * 1.25);
    const iMaxPlot = Math.max(0.001, iPeak * 1.25);

    for (let j = 0; j <= pts; j++) {
      const frac = j / pts;
      const x = paddingLeft + frac * plotWidth;
      const t = timeOffset + frac * totalWindowSec;

      // v(t) = V_peak * sin(ωt)
      const vVal = vPeak * Math.sin(omega * t);
      const vNorm = vVal / vMaxPlot;
      const yV = midY - vNorm * (plotHeight / 2);

      // i(t) = I_peak * sin(ωt - φ)
      const iVal = iPeak * Math.sin(omega * t - phaseRad);
      const iNorm = iVal / iMaxPlot;
      const yI = midY - iNorm * (plotHeight / 2);

      if (j === 0) {
        vD += `M ${x.toFixed(1)} ${yV.toFixed(1)}`;
        iD += `M ${x.toFixed(1)} ${yI.toFixed(1)}`;
      } else {
        vD += ` L ${x.toFixed(1)} ${yV.toFixed(1)}`;
        iD += ` L ${x.toFixed(1)} ${yI.toFixed(1)}`;
      }
    }

    return { vPath: vD, iPath: iD, numPoints: pts };
  }, [vPeak, iPeak, omega, phaseRad, timeOffset, totalWindowSec, plotWidth, plotHeight, paddingLeft, midY]);

  // Phase time difference: Δt = |φ| / ω in ms
  const deltaTMs = omega > 0 ? (Math.abs(phaseRad) / omega) * 1000 : 0;

  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl flex flex-col gap-3">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#26364D]">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#38BDF8]" />
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F1F5F9]">
            AC Voltage &amp; Current Waveforms
          </h2>
        </div>

        {/* Playback Controls & Phase Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0B1728] border border-[#26364D] text-xs font-mono">
            <span className="text-[#94A3B8]">Phase φ:</span>
            <span
              className={`font-bold ${
                seriesCalc.phaseRegime === 'resonant'
                  ? 'text-[#FB7185]'
                  : seriesCalc.phaseRegime === 'inductive'
                  ? 'text-[#38BDF8]'
                  : 'text-[#A78BFA]'
              }`}
            >
              {phaseDeg >= 0 ? `+${phaseDeg.toFixed(1)}°` : `${phaseDeg.toFixed(1)}°`}
              {seriesCalc.phaseRegime === 'inductive'
                ? ' (Lagging)'
                : seriesCalc.phaseRegime === 'capacitive'
                ? ' (Leading)'
                : ' (In Phase)'}
            </span>
          </div>

          <button
            onClick={() => setIsPlaying((p) => !p)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              isPlaying
                ? 'bg-[#17263B] text-[#FBBF24] border border-[#FBBF24]/40 hover:bg-[#1E334D]'
                : 'bg-[#38BDF8] text-[#07111F] hover:bg-[#7DD3FC]'
            }`}
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-1 rounded-lg bg-[#17263B] text-[#94A3B8] hover:text-[#F1F5F9] border border-[#26364D] transition-colors cursor-pointer"
            title="Reset wave phase"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Waveform Graph */}
      <div className="w-full relative rounded-xl overflow-hidden border border-[#26364D] bg-[#0A1526] shadow-inner">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto block select-none"
          style={{ minHeight: '220px' }}
        >
          {/* Grid lines */}
          <g opacity="0.3">
            {/* Horizontal center and quarter lines */}
            <line x1={paddingLeft} y1={midY} x2={width - paddingRight} y2={midY} stroke="#94A3B8" strokeWidth="1" />
            <line x1={paddingLeft} y1={paddingTop} x2={width - paddingRight} y2={paddingTop} stroke="#26364D" strokeWidth="1" strokeDasharray="3 3" />
            <line x1={paddingLeft} y1={midY - plotHeight / 4} x2={width - paddingRight} y2={midY - plotHeight / 4} stroke="#26364D" strokeWidth="1" strokeDasharray="2 2" />
            <line x1={paddingLeft} y1={midY + plotHeight / 4} x2={width - paddingRight} y2={midY + plotHeight / 4} stroke="#26364D" strokeWidth="1" strokeDasharray="2 2" />
            <line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} stroke="#26364D" strokeWidth="1" strokeDasharray="3 3" />

            {/* Vertical grid lines (time division: 4 quarters per cycle) */}
            {[0, 0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
              const xPos = paddingLeft + frac * plotWidth;
              return (
                <line
                  key={idx}
                  x1={xPos}
                  y1={paddingTop}
                  x2={xPos}
                  y2={height - paddingBottom}
                  stroke="#26364D"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              );
            })}
          </g>

          {/* Time axis label */}
          <text
            x={width / 2}
            y={height - 12}
            fill="#94A3B8"
            fontSize="10"
            fontFamily="ui-monospace, monospace"
            textAnchor="middle"
          >
            Time (Window: {totalWindowMs.toFixed(1)} ms &middot; 2 Full Cycles at {params.sourceFrequency} Hz)
          </text>

          {/* Voltage Y-Axis scale label (Left) */}
          <text
            x={15}
            y={paddingTop + 10}
            fill="#FBBF24"
            fontSize="10"
            fontWeight="bold"
            fontFamily="ui-monospace, monospace"
          >
            +{(vPeak).toFixed(0)}V
          </text>
          <text
            x={15}
            y={midY + 3}
            fill="#94A3B8"
            fontSize="10"
            fontFamily="ui-monospace, monospace"
          >
            0V
          </text>
          <text
            x={15}
            y={height - paddingBottom}
            fill="#FBBF24"
            fontSize="10"
            fontWeight="bold"
            fontFamily="ui-monospace, monospace"
          >
            -{(vPeak).toFixed(0)}V
          </text>

          {/* Current Y-Axis scale label (Right) */}
          <text
            x={width - 32}
            y={paddingTop + 10}
            fill="#34D399"
            fontSize="10"
            fontWeight="bold"
            fontFamily="ui-monospace, monospace"
            textAnchor="end"
          >
            +{(iPeak * 1000).toFixed(0)}mA
          </text>
          <text
            x={width - 32}
            y={height - paddingBottom}
            fill="#34D399"
            fontSize="10"
            fontWeight="bold"
            fontFamily="ui-monospace, monospace"
            textAnchor="end"
          >
            -{(iPeak * 1000).toFixed(0)}mA
          </text>

          {/* Voltage Waveform: v(t) in Yellow */}
          <path
            d={vPath}
            fill="none"
            stroke="#FBBF24"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Current Waveform: i(t) in Green */}
          <path
            d={iPath}
            fill="none"
            stroke="#34D399"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={seriesCalc.phaseRegime === 'resonant' ? 'none' : '4 1'}
          />

          {/* Legends at Top Right */}
          <g transform={`translate(${paddingLeft + 15}, ${paddingTop + 12})`}>
            <rect x="0" y="-8" width="220" height="24" rx="4" fill="#101D30" fillOpacity="0.85" stroke="#26364D" strokeWidth="1" />
            <line x1="10" y1="4" x2="30" y2="4" stroke="#FBBF24" strokeWidth="2.5" />
            <text x="36" y="7" fill="#FBBF24" fontSize="10" fontWeight="bold" fontFamily="ui-monospace, monospace">
              v(t) = V_pk sin(ωt)
            </text>

            <line x1="130" y1="4" x2="150" y2="4" stroke="#34D399" strokeWidth="2.5" strokeDasharray="3 1" />
            <text x="156" y="7" fill="#34D399" fontSize="10" fontWeight="bold" fontFamily="ui-monospace, monospace">
              i(t)
            </text>
          </g>
        </svg>
      </div>

      {/* Analytical Phase Explanation */}
      <div className="flex flex-wrap items-center justify-between text-xs text-[#94A3B8] pt-0.5">
        <span>
          <strong className="text-[#F1F5F9]">Waveform Analysis:</strong>{' '}
          {seriesCalc.phaseRegime === 'resonant' ? (
            <span className="text-[#FB7185] font-semibold">
              Resonance achieved! Voltage and current waveforms are synchronized in phase (φ = 0.0°).
            </span>
          ) : seriesCalc.phaseRegime === 'inductive' ? (
            <span className="text-[#38BDF8]">
              Inductive circuit (X_L &gt; X_C): current LAGS source voltage by {phaseDeg.toFixed(1)}° (&Delta;t = {deltaTMs.toFixed(2)} ms).
            </span>
          ) : (
            <span className="text-[#A78BFA]">
              Capacitive circuit (X_C &gt; X_L): current LEADS source voltage by {Math.abs(phaseDeg).toFixed(1)}° (&Delta;t = {deltaTMs.toFixed(2)} ms).
            </span>
          )}
        </span>
        <span className="font-mono text-[#F1F5F9]">
          Period T = {periodMs.toFixed(2)} ms
        </span>
      </div>
    </div>
  );
};
