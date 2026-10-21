import React from 'react';
import { Gauge, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { DopplerParameters, DopplerDerivedValues } from '../../physics/doppler/types';

interface DopplerMeasurementsPanelProps {
  params: DopplerParameters;
  derived: DopplerDerivedValues;
}

export const DopplerMeasurementsPanel: React.FC<DopplerMeasurementsPanelProps> = ({
  params,
  derived,
}) => {
  const { sourceFrequency: fs, speedOfSound: v, sourceVelocity: vs, observerVelocity: vo } = params;
  const { observedFrequency: fo, frequencyShift: df, wavelengthFront: lf, wavelengthBehind: lb, machNumberSource: ms } = derived;

  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#26364D]">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-[#38BDF8]" />
          <h3 className="text-sm font-bold text-[#F1F5F9] uppercase tracking-wide">
            Doppler Effect Precision Measurements
          </h3>
        </div>

        <span className="text-xs font-mono font-bold text-[#34D399] bg-[#10B981]/15 px-2.5 py-0.5 rounded border border-[#10B981]/30">
          Subsonic Regime (Mach {ms.toFixed(2)})
        </span>
      </div>

      {/* 8 Essential Parameters Grid (Part 5) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* 1. Emitted Frequency */}
        <div className="bg-[#17263B] border border-[#26364D] rounded-xl p-3">
          <span className="text-[11px] font-semibold text-[#94A3B8] block">Emitted Frequency (fs)</span>
          <span className="text-lg font-mono font-bold text-[#38BDF8] block mt-0.5">
            {fs} Hz
          </span>
          <span className="text-[10px] text-[#94A3B8]">Period T = {(1000 / fs).toFixed(2)} ms</span>
        </div>

        {/* 2. Observed Frequency */}
        <div className="bg-[#17263B] border border-[#26364D] rounded-xl p-3">
          <span className="text-[11px] font-semibold text-[#94A3B8] block">Observed Frequency (fo)</span>
          <span className="text-lg font-mono font-bold text-[#34D399] block mt-0.5">
            {fo.toFixed(2)} Hz
          </span>
          <span className="text-[10px] text-[#94A3B8]">Period T = {(1000 / Math.max(1, fo)).toFixed(2)} ms</span>
        </div>

        {/* 3. Frequency Difference */}
        <div className="bg-[#17263B] border border-[#26364D] rounded-xl p-3">
          <span className="text-[11px] font-semibold text-[#94A3B8] block">Frequency Shift (Δf)</span>
          <span className="text-lg font-mono font-bold text-[#FBBF24] block mt-0.5">
            {df >= 0 ? '+' : ''}{df.toFixed(2)} Hz
          </span>
          <span className="text-[10px] text-[#94A3B8]">fo - fs</span>
        </div>

        {/* 4. Speed of Sound */}
        <div className="bg-[#17263B] border border-[#26364D] rounded-xl p-3">
          <span className="text-[11px] font-semibold text-[#94A3B8] block">Speed of Sound (v)</span>
          <span className="text-lg font-mono font-bold text-[#A78BFA] block mt-0.5">
            {v} m/s
          </span>
          <span className="text-[10px] text-[#94A3B8]">Medium propagation speed</span>
        </div>

        {/* 5. Source Velocity */}
        <div className="bg-[#17263B] border border-[#26364D] rounded-xl p-3">
          <span className="text-[11px] font-semibold text-[#94A3B8] block">Source Velocity (vs)</span>
          <span className="text-lg font-mono font-bold text-[#FBBF24] block mt-0.5">
            {vs >= 0 ? '+' : ''}{vs} m/s
          </span>
          <span className="text-[10px] text-[#94A3B8]">{vs > 0 ? 'Toward observer' : vs < 0 ? 'Away from obs.' : 'At rest'}</span>
        </div>

        {/* 6. Observer Velocity */}
        <div className="bg-[#17263B] border border-[#26364D] rounded-xl p-3">
          <span className="text-[11px] font-semibold text-[#94A3B8] block">Observer Velocity (vo)</span>
          <span className="text-lg font-mono font-bold text-[#34D399] block mt-0.5">
            {vo >= 0 ? '+' : ''}{vo} m/s
          </span>
          <span className="text-[10px] text-[#94A3B8]">{vo > 0 ? 'Toward source' : vo < 0 ? 'Away from src.' : 'At rest'}</span>
        </div>

        {/* 7. Wavelength In Front */}
        <div className="bg-[#17263B] border border-[#26364D] rounded-xl p-3">
          <span className="text-[11px] font-semibold text-[#94A3B8] block">λ in Front (Approach)</span>
          <span className="text-lg font-mono font-bold text-[#38BDF8] block mt-0.5">
            {lf.toFixed(3)} m
          </span>
          <span className="text-[10px] text-[#94A3B8]">λ_front = (v - vs)/fs</span>
        </div>

        {/* 8. Wavelength Behind */}
        <div className="bg-[#17263B] border border-[#26364D] rounded-xl p-3">
          <span className="text-[11px] font-semibold text-[#94A3B8] block">λ Behind (Receding)</span>
          <span className="text-lg font-mono font-bold text-[#FB7185] block mt-0.5">
            {lb.toFixed(3)} m
          </span>
          <span className="text-[10px] text-[#94A3B8]">λ_behind = (v + vs)/fs</span>
        </div>
      </div>

      {/* Physical Cases Reference Table */}
      <div className="bg-[#17263B] border border-[#26364D] rounded-xl p-4 text-xs space-y-2.5">
        <span className="font-bold text-[#F1F5F9] block text-xs">
          General Doppler Equation Evaluation:
        </span>
        <div className="font-mono bg-[#101D30] p-3 rounded-lg border border-[#26364D] text-[#38BDF8] text-xs leading-relaxed">
          f_obs = {fs} × ({v} + ({vo})) / ({v} - ({vs})) = {fo.toFixed(2)} Hz
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#94A3B8] pt-1">
          <div className="flex items-start gap-1.5">
            <span className="text-[#34D399] font-bold">Case A &amp; B:</span>
            <span>Moving source alters the physical distance between wave crests in the medium.</span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="text-[#38BDF8] font-bold">Case D &amp; E:</span>
            <span>Moving observer intercepts crests at an altered relative interception speed.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
