import React from 'react';
import { Sliders, RotateCcw } from 'lucide-react';
import { ResonanceParameters } from '../../physics/resonance/types';

interface ResonanceControlsProps {
  params: ResonanceParameters;
  naturalFrequencyHz: number;
  peakFrequencyHz: number | null;
  onChangeParams: (updater: (prev: ResonanceParameters) => ResonanceParameters) => void;
  onPresetBelowResonance: () => void;
  onPresetNearResonance: () => void;
  onPresetHighDamping: () => void;
  onResetDefaults: () => void;
}

export const ResonanceControls: React.FC<ResonanceControlsProps> = ({
  params,
  naturalFrequencyHz,
  peakFrequencyHz,
  onChangeParams,
  onPresetBelowResonance,
  onPresetNearResonance,
  onPresetHighDamping,
  onResetDefaults,
}) => {
  const handleSliderChange = (key: keyof ResonanceParameters, value: number) => {
    onChangeParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl flex flex-col gap-4">
      {/* Title & Presets Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#26364D]">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#38BDF8]" />
          <h3 className="text-sm font-bold text-[#F1F5F9] uppercase tracking-wide">
            Experimental Controls
          </h3>
        </div>

        <button
          onClick={onResetDefaults}
          className="flex items-center gap-1 text-xs text-[#94A3B8] hover:text-[#38BDF8] cursor-pointer transition-colors"
          title="Reset to default values"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Defaults</span>
        </button>
      </div>

      {/* Preset Experiments */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
          Experiment Presets:
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onPresetBelowResonance}
            className="px-2.5 py-2 rounded-lg bg-[#17263B] hover:bg-[#1E334D] text-[#38BDF8] border border-[#38BDF8]/40 text-xs font-bold transition-colors cursor-pointer text-center shadow-xs"
            title="Set driving frequency below natural frequency"
          >
            1. BELOW RESONANCE
          </button>

          <button
            onClick={onPresetNearResonance}
            className="px-2.5 py-2 rounded-lg bg-[#17263B] hover:bg-[#1E334D] text-[#FB7185] border border-[#FB7185]/40 text-xs font-bold transition-colors cursor-pointer text-center shadow-xs"
            title="Drive oscillator directly at resonance peak"
          >
            2. NEAR RESONANCE
          </button>

          <button
            onClick={onPresetHighDamping}
            className="px-2.5 py-2 rounded-lg bg-[#17263B] hover:bg-[#1E334D] text-[#FBBF24] border border-[#FBBF24]/40 text-xs font-bold transition-colors cursor-pointer text-center shadow-xs"
            title="Increase damping coefficient to widen and suppress peak"
          >
            3. HIGH DAMPING
          </button>
        </div>
      </div>

      {/* Parameter Sliders */}
      <div className="space-y-4 pt-1">
        {/* 1. Driving Frequency (f) */}
        <div className="space-y-1.5 bg-[#17263B] p-3 rounded-lg border border-[#26364D]">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#F1F5F9] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
              Driving Frequency (f)
            </label>
            <span className="text-xs font-mono font-bold text-[#38BDF8] bg-[#101D30] px-2 py-0.5 rounded border border-[#26364D]">
              {params.drivingFrequencyHz.toFixed(2)} Hz
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="10.0"
            step="0.05"
            value={params.drivingFrequencyHz}
            onChange={(e) => handleSliderChange('drivingFrequencyHz', parseFloat(e.target.value))}
            className="w-full accent-[#38BDF8] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-[#94A3B8]">
            <span>Min: 0.1 Hz</span>
            <span className="font-semibold text-[#34D399]">f₀ = {naturalFrequencyHz.toFixed(2)} Hz</span>
            <span>Max: 10.0 Hz</span>
          </div>
        </div>

        {/* 2. Mass (m) */}
        <div className="space-y-1.5 bg-[#17263B] p-3 rounded-lg border border-[#26364D]">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#F1F5F9]">
              Mass (m)
            </label>
            <span className="text-xs font-mono font-bold text-[#FBBF24] bg-[#101D30] px-2 py-0.5 rounded border border-[#26364D]">
              {params.mass.toFixed(2)} kg
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="5.0"
            step="0.05"
            value={params.mass}
            onChange={(e) => handleSliderChange('mass', parseFloat(e.target.value))}
            className="w-full accent-[#FBBF24] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-[#94A3B8]">
            <span>0.1 kg</span>
            <span>Default: 1.0 kg</span>
            <span>5.0 kg</span>
          </div>
        </div>

        {/* 3. Spring Constant (k) */}
        <div className="space-y-1.5 bg-[#17263B] p-3 rounded-lg border border-[#26364D]">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#F1F5F9]">
              Spring Constant (k)
            </label>
            <span className="text-xs font-mono font-bold text-[#F1F5F9] bg-[#101D30] px-2 py-0.5 rounded border border-[#26364D]">
              {params.springConstant} N/m
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="200"
            step="1"
            value={params.springConstant}
            onChange={(e) => handleSliderChange('springConstant', parseFloat(e.target.value))}
            className="w-full accent-[#94A3B8] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-[#94A3B8]">
            <span>5 N/m</span>
            <span>Default: 50 N/m</span>
            <span>200 N/m</span>
          </div>
        </div>

        {/* 4. Damping Coefficient (c) */}
        <div className="space-y-1.5 bg-[#17263B] p-3 rounded-lg border border-[#26364D]">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#F1F5F9]">
              Damping Coefficient (c)
            </label>
            <span className="text-xs font-mono font-bold text-[#A78BFA] bg-[#101D30] px-2 py-0.5 rounded border border-[#26364D]">
              {params.dampingCoefficient.toFixed(2)} N·s/m
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="5.0"
            step="0.05"
            value={params.dampingCoefficient}
            onChange={(e) => handleSliderChange('dampingCoefficient', parseFloat(e.target.value))}
            className="w-full accent-[#A78BFA] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-[#94A3B8]">
            <span>0 N·s/m (Undamped)</span>
            <span>Default: 0.50 N·s/m</span>
            <span>5.0 N·s/m</span>
          </div>
        </div>

        {/* 5. Driving Force Amplitude (F0) */}
        <div className="space-y-1.5 bg-[#17263B] p-3 rounded-lg border border-[#26364D]">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#F1F5F9]">
              Driving Force Amplitude (F₀)
            </label>
            <span className="text-xs font-mono font-bold text-[#FB7185] bg-[#101D30] px-2 py-0.5 rounded border border-[#26364D]">
              {params.drivingForceAmplitude.toFixed(1)} N
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="10.0"
            step="0.1"
            value={params.drivingForceAmplitude}
            onChange={(e) => handleSliderChange('drivingForceAmplitude', parseFloat(e.target.value))}
            className="w-full accent-[#FB7185] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-[#94A3B8]">
            <span>0.1 N</span>
            <span>Default: 2.0 N</span>
            <span>10.0 N</span>
          </div>
        </div>
      </div>
    </div>
  );
};
