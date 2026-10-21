import React from 'react';
import { Volume2, ArrowUpRight, ArrowDownRight, Minus, AlertCircle, Info } from 'lucide-react';
import { DopplerDerivedValues } from '../../physics/doppler/types';

interface DopplerFrequencyDisplayProps {
  sourceFrequency: number;
  derived: DopplerDerivedValues;
}

export const DopplerFrequencyDisplay: React.FC<DopplerFrequencyDisplayProps> = ({
  sourceFrequency,
  derived,
}) => {
  const { observedFrequency, frequencyShift, relativeShiftPercent, regime, explanationText } = derived;

  // Color coding based on frequency change:
  // - Green (#34D399) when observed > emitted (approaching)
  // - Orange/Yellow (#FBBF24) when observed < emitted (receding)
  // - Neutral (#F1F5F9) when equal
  let freqColorClass = 'text-[#F1F5F9]';
  let badgeBg = 'bg-[#101D30] text-[#94A3B8] border-[#26364D]';
  let ShiftIcon = Minus;

  if (regime === 'approaching') {
    freqColorClass = 'text-[#34D399]';
    badgeBg = 'bg-[#10B981]/15 text-[#34D399] border-[#10B981]/30';
    ShiftIcon = ArrowUpRight;
  } else if (regime === 'receding') {
    freqColorClass = 'text-[#FBBF24]';
    badgeBg = 'bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/30';
    ShiftIcon = ArrowDownRight;
  }

  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl flex flex-col gap-4">
      <div className="flex items-center justify-between pb-2 border-b border-[#26364D]">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-[#38BDF8]" />
          <h3 className="text-sm font-bold text-[#F1F5F9] uppercase tracking-wide">
            Observer Frequency Telemetry
          </h3>
        </div>

        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 ${badgeBg}`}>
          <ShiftIcon className="w-3.5 h-3.5" />
          <span>
            {regime === 'approaching' && 'Pitch Higher (+Δf)'}
            {regime === 'receding' && 'Pitch Lower (-Δf)'}
            {regime === 'stationary' && 'No Shift (Δf = 0)'}
          </span>
        </span>
      </div>

      {/* Prominent Digital Readout Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Emitted Frequency (Cyan #38BDF8) */}
        <div className="bg-[#17263B] border border-[#26364D] rounded-xl p-4 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
            Emitted Frequency (fs)
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-[#38BDF8]">
              {sourceFrequency.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-[#94A3B8]">Hz</span>
          </div>
          <span className="text-[10px] text-[#94A3B8] mt-1">Source rest frame rate</span>
        </div>

        {/* Observed Frequency (Large, Color-Coded) */}
        <div className="bg-[#17263B] border border-[#26364D] rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
              Observed Frequency (f_obs)
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className={`text-2xl sm:text-3xl font-black font-mono ${freqColorClass}`}>
              {observedFrequency.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-[#94A3B8]">Hz</span>
          </div>
          <span className="text-[10px] text-[#94A3B8] mt-1">Rate received by observer</span>
        </div>

        {/* Frequency Shift (Δf) */}
        <div className="bg-[#17263B] border border-[#26364D] rounded-xl p-4 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
            Frequency Shift (Δf)
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className={`text-2xl sm:text-3xl font-black font-mono ${freqColorClass}`}>
              {frequencyShift >= 0 ? '+' : ''}{frequencyShift.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-[#94A3B8]">Hz</span>
          </div>
          <span className="text-[10px] text-[#94A3B8] mt-1">
            {relativeShiftPercent >= 0 ? '+' : ''}{relativeShiftPercent.toFixed(1)}% pitch change
          </span>
        </div>
      </div>

      {/* Explanatory Message Banner (Part 6) */}
      <div
        className={`p-3.5 rounded-lg border text-xs flex items-start gap-2.5 ${
          regime === 'approaching'
            ? 'bg-[#10B981]/10 border-[#10B981]/30 text-[#34D399]'
            : regime === 'receding'
            ? 'bg-[#F59E0B]/10 border-[#F59E0B]/30 text-[#FBBF24]'
            : 'bg-[#17263B] border-[#26364D] text-[#F1F5F9]'
        }`}
      >
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold text-sm">{explanationText}</p>
          <p className="text-[11px] opacity-85 leading-relaxed">
            {regime === 'approaching' &&
              'Because the relative distance between crests narrows along the line of sight, the observer encounters more wave cycles every second.'}
            {regime === 'receding' &&
              'Because the relative distance between crests broadens, the arrival time between consecutive wavefronts is prolonged, lowering perceived pitch.'}
            {regime === 'stationary' &&
              'When the relative line-of-sight velocity is zero, wavefronts arrive at the exact period with which they were emitted.'}
          </p>
        </div>
      </div>
    </div>
  );
};
