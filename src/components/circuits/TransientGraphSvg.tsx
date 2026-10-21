/**
 * EQUATION 1 — DC Transient Response Simulator & Numerical Graph
 * Accurately simulates and plots:
 * - RC Charging & Discharging (V_C(t), i_C(t), τ = RC)
 * - RL Current Growth & Decay (i_L(t), v_L(t), τ = L/R)
 * - Series RLC Step Response (Underdamped, Critically Damped, Overdamped)
 */

import React, { useMemo } from 'react';
import { Activity, Clock, Sliders, Zap } from 'lucide-react';
import { RLCParameters, TransientCalculations, TransientType, TransientAction } from '../../physics/circuits/types';

interface TransientGraphSvgProps {
  params: RLCParameters;
  transientCalc: TransientCalculations;
  onUpdateParams: (updater: (prev: RLCParameters) => RLCParameters) => void;
}

export const TransientGraphSvg: React.FC<TransientGraphSvgProps> = ({
  params,
  transientCalc,
  onUpdateParams,
}) => {
  const {
    timeConstantRC,
    timeConstantRL,
    dampingCoefficientAlpha,
    naturalFrequencyOmega0,
    dampingRegime,
    timePointsMs,
    voltagePoints,
    currentPoints,
  } = transientCalc;

  const width = 640;
  const height = 280;
  const padL = 60;
  const padR = 40;
  const padT = 30;
  const padB = 40;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  // Max values for plotting
  const maxTimeMs = Math.max(1, timePointsMs[timePointsMs.length - 1] || 10);
  const maxV = Math.max(1, ...voltagePoints.map((v) => Math.abs(v))) * 1.15;
  const maxI = Math.max(0.001, ...currentPoints.map((i) => Math.abs(i))) * 1.15;

  // Build SVG Paths
  const { vPath, iPath } = useMemo(() => {
    let vD = '';
    let iD = '';

    for (let k = 0; k < timePointsMs.length; k++) {
      const t = timePointsMs[k];
      const v = voltagePoints[k];
      const iVal = currentPoints[k];

      const x = padL + (t / maxTimeMs) * plotW;
      const yV = height - padB - (v / maxV) * plotH;
      const yI = height - padB - (iVal / maxI) * plotH;

      if (k === 0) {
        vD += `M ${x.toFixed(1)} ${yV.toFixed(1)}`;
        iD += `M ${x.toFixed(1)} ${yI.toFixed(1)}`;
      } else {
        vD += ` L ${x.toFixed(1)} ${yV.toFixed(1)}`;
        iD += ` L ${x.toFixed(1)} ${yI.toFixed(1)}`;
      }
    }

    return { vPath: vD, iPath: iD };
  }, [timePointsMs, voltagePoints, currentPoints, maxTimeMs, maxV, maxI, padL, padB, plotW, plotH, height]);

  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-4">
      {/* Transient Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#26364D] pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#38BDF8]" />
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F1F5F9]">
            DC Transient Response
          </h2>
        </div>

        {/* Sub-mode selector */}
        <div className="flex items-center gap-1.5 bg-[#17263B] p-1 rounded-lg border border-[#26364D]">
          {(['rc', 'rl', 'rlc'] as TransientType[]).map((type) => (
            <button
              key={type}
              onClick={() => onUpdateParams((p) => ({ ...p, transientType: type }))}
              className={`px-3 py-1 rounded text-xs font-bold uppercase transition-colors cursor-pointer ${
                params.transientType === type
                  ? 'bg-[#38BDF8] text-[#07111F] shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              {type === 'rc' ? 'RC Circuit' : type === 'rl' ? 'RL Circuit' : 'Series RLC Step'}
            </button>
          ))}
        </div>

        {/* Action Toggle (Charge vs Discharge) */}
        {params.transientType !== 'rlc' && (
          <div className="flex items-center gap-1 bg-[#17263B] p-1 rounded-lg border border-[#26364D]">
            <button
              onClick={() => onUpdateParams((p) => ({ ...p, transientAction: 'charge' }))}
              className={`px-2.5 py-0.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
                params.transientAction === 'charge'
                  ? 'bg-[#34D399] text-[#07111F] font-bold'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              Charge / Growth
            </button>
            <button
              onClick={() => onUpdateParams((p) => ({ ...p, transientAction: 'discharge' }))}
              className={`px-2.5 py-0.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
                params.transientAction === 'discharge'
                  ? 'bg-[#FB7185] text-[#07111F] font-bold'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              Discharge / Decay
            </button>
          </div>
        )}
      </div>

      {/* RLC Damping Status Badge if in RLC Mode */}
      {params.transientType === 'rlc' && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-[#17263B] border border-[#26364D] text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#94A3B8]">Damping Classification:</span>
            <span
              className={`font-mono font-bold px-2 py-0.5 rounded border ${
                dampingRegime === 'underdamped'
                  ? 'bg-[#FB7185]/20 border-[#FB7185] text-[#FB7185]'
                  : dampingRegime === 'critically_damped'
                  ? 'bg-[#34D399]/20 border-[#34D399] text-[#34D399]'
                  : 'bg-[#A78BFA]/20 border-[#A78BFA] text-[#A78BFA]'
              }`}
            >
              {dampingRegime === 'underdamped'
                ? 'UNDERDAMPED (Oscillatory Ringing)'
                : dampingRegime === 'critically_damped'
                ? 'CRITICALLY DAMPED (Fastest Settlement)'
                : 'OVERDAMPED (Sluggish Rise)'}
            </span>
          </div>

          <div className="font-mono text-[#94A3B8] text-[11px] flex items-center gap-3">
            <span>α = {dampingCoefficientAlpha.toFixed(1)} s⁻¹</span>
            <span>&middot;</span>
            <span>ω_0 = {naturalFrequencyOmega0.toFixed(1)} rad/s</span>
            <span>&middot;</span>
            <span className="text-[#38BDF8]">
              R_crit = {(2 * Math.sqrt((params.inductanceMilliHenries * 1e-3) / (params.capacitanceMicroFarads * 1e-6))).toFixed(1)} Ω
            </span>
          </div>
        </div>
      )}

      {/* Time Constant Callout if RC or RL */}
      {params.transientType === 'rc' && (
        <div className="flex items-center justify-between text-xs text-[#94A3B8] bg-[#17263B] p-2.5 rounded-lg border border-[#26364D]">
          <span>
            RC Time Constant: <code className="text-[#38BDF8] font-mono font-bold">τ = RC = {(timeConstantRC * 1000).toFixed(2)} ms</code>
          </span>
          <span>At t = 1τ, V_C reaches 63.2% of {(params.dcSourceVoltage)} V (~{(params.dcSourceVoltage * 0.632).toFixed(1)} V)</span>
        </div>
      )}

      {params.transientType === 'rl' && (
        <div className="flex items-center justify-between text-xs text-[#94A3B8] bg-[#17263B] p-2.5 rounded-lg border border-[#26364D]">
          <span>
            RL Time Constant: <code className="text-[#38BDF8] font-mono font-bold">τ = L / R = {(timeConstantRL * 1000).toFixed(2)} ms</code>
          </span>
          <span>At t = 1τ, current reaches 63.2% of max ({((params.dcSourceVoltage / params.resistance) * 1000).toFixed(1)} mA)</span>
        </div>
      )}

      {/* SVG Plot */}
      <div className="w-full relative rounded-xl overflow-hidden border border-[#26364D] bg-[#0A1526] shadow-inner">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto block select-none" style={{ minHeight: '220px' }}>
          {/* Grid lines */}
          <g opacity="0.3">
            <line x1={padL} y1={padT} x2={width - padR} y2={padT} stroke="#26364D" strokeWidth="1" strokeDasharray="3 3" />
            <line x1={padL} y1={padT + plotH / 2} x2={width - padR} y2={padT + plotH / 2} stroke="#26364D" strokeWidth="1" strokeDasharray="2 2" />
            <line x1={padL} y1={height - padB} x2={width - padR} y2={height - padB} stroke="#94A3B8" strokeWidth="1" />

            {[0, 0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
              const xPos = padL + frac * plotW;
              const tTick = (frac * maxTimeMs).toFixed(1);
              return (
                <g key={idx}>
                  <line x1={xPos} y1={padT} x2={xPos} y2={height - padB} stroke="#26364D" strokeWidth="1" strokeDasharray="2 2" />
                  <text x={xPos} y={height - padB + 14} fill="#94A3B8" fontSize="9" fontFamily="ui-monospace, monospace" textAnchor="middle">
                    {tTick} ms
                  </text>
                </g>
              );
            })}
          </g>

          {/* Voltage Y-Axis scale label (Left) */}
          <text x={14} y={padT + 10} fill="#FBBF24" fontSize="10" fontWeight="bold" fontFamily="ui-monospace, monospace">
            +{(maxV).toFixed(1)}V
          </text>
          <text x={14} y={height - padB} fill="#94A3B8" fontSize="10" fontFamily="ui-monospace, monospace">
            0V
          </text>

          {/* Current Y-Axis scale label (Right) */}
          <text x={width - 32} y={padT + 10} fill="#34D399" fontSize="10" fontWeight="bold" fontFamily="ui-monospace, monospace" textAnchor="end">
            +{(maxI * 1000).toFixed(0)}mA
          </text>
          <text x={width - 32} y={height - padB} fill="#94A3B8" fontSize="10" fontFamily="ui-monospace, monospace" textAnchor="end">
            0mA
          </text>

          {/* Time axis label */}
          <text x={width / 2} y={height - 12} fill="#94A3B8" fontSize="10" fontFamily="ui-monospace, monospace" textAnchor="middle">
            Time elapsed t (ms)
          </text>

          {/* Voltage Curve (Yellow) */}
          <path d={vPath} fill="none" stroke="#FBBF24" strokeWidth="2.8" strokeLinecap="round" />

          {/* Current Curve (Green) */}
          <path d={iPath} fill="none" stroke="#34D399" strokeWidth="2.5" strokeDasharray="4 2" strokeLinecap="round" />

          {/* Legends */}
          <g transform={`translate(${padL + 20}, ${padT + 8})`}>
            <rect x="0" y="0" width="190" height="24" rx="4" fill="#101D30" fillOpacity="0.85" stroke="#26364D" strokeWidth="1" />
            <line x1="10" y1="12" x2="28" y2="12" stroke="#FBBF24" strokeWidth="2.5" />
            <text x="34" y="15" fill="#FBBF24" fontSize="10" fontWeight="bold" fontFamily="ui-monospace, monospace">
              Voltage V(t)
            </text>

            <line x1="110" y1="12" x2="128" y2="12" stroke="#34D399" strokeWidth="2.5" strokeDasharray="3 1" />
            <text x="134" y="15" fill="#34D399" fontSize="10" fontWeight="bold" fontFamily="ui-monospace, monospace">
              Current i(t)
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};
