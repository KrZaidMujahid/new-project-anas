/**
 * EQUATION 1 — AC Power Analyzer & Power Factor Panel
 * Calculates real power P (W), reactive power Q_var (var), apparent power S (VA),
 * and power factor PF with leading/lagging classification.
 */

import React from 'react';
import { Zap, Gauge, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { SeriesCalculations } from '../../physics/circuits/types';

interface PowerAnalyzerPanelProps {
  seriesCalc: SeriesCalculations;
}

export const PowerAnalyzerPanel: React.FC<PowerAnalyzerPanelProps> = ({
  seriesCalc,
}) => {
  const {
    apparentPowerVA,
    realPowerWatts,
    reactivePowerVar,
    powerFactor,
    powerFactorType,
    phaseAngleDeg,
  } = seriesCalc;

  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl flex flex-col justify-between gap-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#26364D] pb-2.5">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#FBBF24]" />
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F1F5F9]">
            AC Power Analyzer
          </h3>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#17263B] border border-[#26364D] text-xs font-mono">
          <span className="text-[#94A3B8]">PF:</span>
          <span
            className={`font-bold ${
              powerFactorType === 'unity'
                ? 'text-[#34D399]'
                : powerFactorType === 'lagging'
                ? 'text-[#38BDF8]'
                : 'text-[#A78BFA]'
            }`}
          >
            {powerFactor.toFixed(3)} ({powerFactorType.toUpperCase()})
          </span>
        </div>
      </div>

      {/* Grid of Power Values */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* 1. Real Power P */}
        <div className="p-3 rounded-lg bg-[#17263B] border border-[#26364D] space-y-1">
          <div className="text-[10px] uppercase font-bold text-[#34D399] flex items-center justify-between">
            <span>Real Power (P)</span>
            <span className="font-mono text-[#94A3B8]">Watts</span>
          </div>
          <div className="text-base sm:text-lg font-mono font-black text-[#34D399]">
            {realPowerWatts.toFixed(2)} W
          </div>
          <div className="text-[10px] text-[#94A3B8] font-mono">
            P = I²R = VI cos(φ)
          </div>
        </div>

        {/* 2. Reactive Power Q_var */}
        <div className="p-3 rounded-lg bg-[#17263B] border border-[#26364D] space-y-1">
          <div className="text-[10px] uppercase font-bold text-[#A78BFA] flex items-center justify-between">
            <span>Reactive (Q_var)</span>
            <span className="font-mono text-[#94A3B8]">var</span>
          </div>
          <div className="text-base sm:text-lg font-mono font-black text-[#A78BFA]">
            {Math.abs(reactivePowerVar).toFixed(2)} var
          </div>
          <div className="text-[10px] text-[#94A3B8] font-mono">
            Q = VI sin(φ)
          </div>
        </div>

        {/* 3. Apparent Power S */}
        <div className="p-3 rounded-lg bg-[#17263B] border border-[#26364D] space-y-1">
          <div className="text-[10px] uppercase font-bold text-[#FBBF24] flex items-center justify-between">
            <span>Apparent (S)</span>
            <span className="font-mono text-[#94A3B8]">VA</span>
          </div>
          <div className="text-base sm:text-lg font-mono font-black text-[#FBBF24]">
            {apparentPowerVA.toFixed(2)} VA
          </div>
          <div className="text-[10px] text-[#94A3B8] font-mono">
            S = V_RMS &times; I_RMS
          </div>
        </div>
      </div>

      {/* Power Factor Triangle Verification */}
      <div className="bg-[#0B1728] p-3 rounded-lg border border-[#26364D] text-xs text-[#94A3B8] space-y-1.5 leading-relaxed">
        <div className="flex items-center justify-between font-bold text-[#F1F5F9]">
          <span>Apparent Power Conservation:</span>
          <span className="font-mono text-[#38BDF8]">
            S² = P² + Q² &rArr; {Math.sqrt(realPowerWatts * realPowerWatts + reactivePowerVar * reactivePowerVar).toFixed(2)} VA
          </span>
        </div>
        <p className="text-[11px]">
          <strong>Note on Variables:</strong> The electrical reactive power <code className="text-[#A78BFA] font-mono">Q_var</code> (measured in volt-amperes reactive) must not be confused with the dimensionless circuit quality factor <code className="text-[#38BDF8] font-mono">Q = {seriesCalc.qualityFactor.toFixed(2)}</code>.
        </p>
      </div>
    </div>
  );
};
