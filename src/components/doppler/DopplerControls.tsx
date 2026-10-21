import React from 'react';
import { Sliders, RotateCcw, FastForward, Sparkles, Navigation } from 'lucide-react';
import { DopplerParameters } from '../../physics/doppler/types';
import { DOPPLER_PRESETS } from '../../physics/doppler/model';

interface DopplerControlsProps {
  params: DopplerParameters;
  onChangeParams: (updater: (prev: DopplerParameters) => DopplerParameters) => void;
  onApplyPreset: (presetParams: DopplerParameters) => void;
  onResetDefaults: () => void;
}

export const DopplerControls: React.FC<DopplerControlsProps> = ({
  params,
  onChangeParams,
  onApplyPreset,
  onResetDefaults,
}) => {
  const handleSliderChange = (key: keyof DopplerParameters, value: number) => {
    onChangeParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#26364D]">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#38BDF8]" />
          <h3 className="text-sm font-bold text-[#F1F5F9] uppercase tracking-wide">
            Experimental Controls
          </h3>
        </div>

        <button
          onClick={onResetDefaults}
          className="flex items-center gap-1 text-xs text-[#94A3B8] hover:text-[#38BDF8] transition-colors cursor-pointer"
          title="Reset to default experiment values"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Preset Experiments (Part 9: 6 visible functional preset buttons) */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
          <span>Preset Experiments:</span>
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {DOPPLER_PRESETS.map((p) => {
            const isMatch =
              params.sourceVelocity === p.params.sourceVelocity &&
              params.observerVelocity === p.params.observerVelocity &&
              params.sourceFrequency === p.params.sourceFrequency;

            return (
              <button
                key={p.id}
                onClick={() => onApplyPreset(p.params)}
                className={`p-2 rounded-lg text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isMatch
                    ? 'bg-[#17263B] border-[#38BDF8] text-[#38BDF8] shadow-sm'
                    : 'bg-[#17263B]/60 hover:bg-[#17263B] border-[#26364D] hover:border-[#38BDF8]/40 text-[#F1F5F9]'
                }`}
              >
                <span className="text-xs font-bold truncate">{p.name}</span>
                <span className="text-[10px] font-mono text-[#94A3B8] mt-0.5">{p.tagline}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Parameter Sliders */}
      <div className="space-y-4 pt-1">
        {/* CONTROL A: SOURCE FREQUENCY (100 Hz to 1000 Hz, default 500 Hz) */}
        <div className="space-y-1.5 bg-[#17263B] p-3 rounded-lg border border-[#26364D]">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#F1F5F9] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
              Emitted Frequency (fs)
            </label>
            <span className="text-xs font-mono font-bold text-[#38BDF8] bg-[#101D30] px-2 py-0.5 rounded border border-[#26364D]">
              {params.sourceFrequency} Hz
            </span>
          </div>
          <input
            type="range"
            min="100"
            max="1000"
            step="10"
            value={params.sourceFrequency}
            onChange={(e) => handleSliderChange('sourceFrequency', parseInt(e.target.value))}
            className="w-full accent-[#38BDF8] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-[#94A3B8] font-mono">
            <span>100 Hz</span>
            <span>Default: 500 Hz</span>
            <span>1000 Hz</span>
          </div>
        </div>

        {/* CONTROL B: SPEED OF SOUND (250 m/s to 400 m/s, default 343 m/s) */}
        <div className="space-y-1.5 bg-[#17263B] p-3 rounded-lg border border-[#26364D]">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#F1F5F9] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#A78BFA]" />
              Speed of Sound (v)
            </label>
            <span className="text-xs font-mono font-bold text-[#A78BFA] bg-[#101D30] px-2 py-0.5 rounded border border-[#26364D]">
              {params.speedOfSound} m/s
            </span>
          </div>
          <input
            type="range"
            min="250"
            max="400"
            step="1"
            value={params.speedOfSound}
            onChange={(e) => handleSliderChange('speedOfSound', parseInt(e.target.value))}
            className="w-full accent-[#A78BFA] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-[#94A3B8] font-mono">
            <span>250 m/s (Cold Air / High Altitude)</span>
            <span>343 m/s (20°C STP)</span>
            <span>400 m/s</span>
          </div>
        </div>

        {/* CONTROL C: SOURCE VELOCITY (-100 m/s to +100 m/s, default +30 m/s) */}
        <div className="space-y-1.5 bg-[#17263B] p-3 rounded-lg border border-[#26364D]">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <label className="text-xs font-bold text-[#F1F5F9] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FBBF24]" />
                Source Velocity (vs)
              </label>
              <span className="text-[10px] text-[#94A3B8]">
                {params.sourceVelocity > 0
                  ? 'Moving toward observer (Positive)'
                  : params.sourceVelocity < 0
                  ? 'Moving away from observer (Negative)'
                  : 'Stationary'}
              </span>
            </div>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                params.sourceVelocity > 0
                  ? 'text-[#FBBF24] bg-[#F59E0B]/15 border-[#F59E0B]/30'
                  : params.sourceVelocity < 0
                  ? 'text-[#FB7185] bg-[#FB7185]/15 border-[#FB7185]/30'
                  : 'text-[#94A3B8] bg-[#101D30] border-[#26364D]'
              }`}
            >
              {params.sourceVelocity > 0 ? '+' : ''}{params.sourceVelocity} m/s
            </span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            step="5"
            value={params.sourceVelocity}
            onChange={(e) => handleSliderChange('sourceVelocity', parseInt(e.target.value))}
            className="w-full accent-[#FBBF24] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-[#94A3B8] font-mono">
            <span>-100 m/s (Receding)</span>
            <span>0 m/s (Rest)</span>
            <span>+100 m/s (Approaching)</span>
          </div>
        </div>

        {/* CONTROL D: OBSERVER VELOCITY (-50 m/s to +50 m/s, default 0 m/s) */}
        <div className="space-y-1.5 bg-[#17263B] p-3 rounded-lg border border-[#26364D]">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <label className="text-xs font-bold text-[#F1F5F9] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#34D399]" />
                Observer Velocity (vo)
              </label>
              <span className="text-[10px] text-[#94A3B8]">
                {params.observerVelocity > 0
                  ? 'Moving toward source (Positive)'
                  : params.observerVelocity < 0
                  ? 'Moving away from source (Negative)'
                  : 'Stationary'}
              </span>
            </div>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                params.observerVelocity > 0
                  ? 'text-[#34D399] bg-[#10B981]/15 border-[#10B981]/30'
                  : params.observerVelocity < 0
                  ? 'text-[#FB7185] bg-[#FB7185]/15 border-[#FB7185]/30'
                  : 'text-[#94A3B8] bg-[#101D30] border-[#26364D]'
              }`}
            >
              {params.observerVelocity > 0 ? '+' : ''}{params.observerVelocity} m/s
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            step="5"
            value={params.observerVelocity}
            onChange={(e) => handleSliderChange('observerVelocity', parseInt(e.target.value))}
            className="w-full accent-[#34D399] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-[#94A3B8] font-mono">
            <span>-50 m/s (Away)</span>
            <span>0 m/s (Rest)</span>
            <span>+50 m/s (Toward)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
