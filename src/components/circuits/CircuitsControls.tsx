/**
 * EQUATION 1 — RLC Circuits Laboratory Controls Panel
 * Sliders, inputs, mode selectors (Series, Parallel, Transient), and source parameters.
 */

import React from 'react';
import { Sliders, RotateCcw, Zap, Layers, Clock } from 'lucide-react';
import { RLCParameters, CircuitMode } from '../../physics/circuits/types';

interface CircuitsControlsProps {
  params: RLCParameters;
  onUpdateParams: (updater: (prev: RLCParameters) => RLCParameters) => void;
  onResetDefaults: () => void;
}

export const CircuitsControls: React.FC<CircuitsControlsProps> = ({
  params,
  onUpdateParams,
  onResetDefaults,
}) => {
  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-5 text-[#F1F5F9]">
      {/* Header with Title and Reset */}
      <div className="flex items-center justify-between border-b border-[#26364D] pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#38BDF8]" />
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F1F5F9]">
            Component Parameters &amp; Source
          </h2>
        </div>
        <button
          onClick={onResetDefaults}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#94A3B8] hover:text-[#F1F5F9] bg-[#17263B] hover:bg-[#1E334D] border border-[#26364D] rounded-lg transition-colors cursor-pointer"
          title="Reset to default 100 Ω, 100 mH, 100 µF, 12 V, 50 Hz"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* 1. Circuit Mode Selector (Series, Parallel, DC Transient) */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
          Circuit Operating Mode
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onUpdateParams((p) => ({ ...p, circuitMode: 'series' }))}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer text-center ${
              params.circuitMode === 'series'
                ? 'bg-[#38BDF8] text-[#07111F] border-[#38BDF8] shadow-sm'
                : 'bg-[#17263B] border-[#26364D] text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            1. Series RLC
          </button>

          <button
            onClick={() => onUpdateParams((p) => ({ ...p, circuitMode: 'parallel' }))}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer text-center ${
              params.circuitMode === 'parallel'
                ? 'bg-[#38BDF8] text-[#07111F] border-[#38BDF8] shadow-sm'
                : 'bg-[#17263B] border-[#26364D] text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            2. Parallel RLC
          </button>

          <button
            onClick={() => onUpdateParams((p) => ({ ...p, circuitMode: 'transient' }))}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer text-center ${
              params.circuitMode === 'transient'
                ? 'bg-[#38BDF8] text-[#07111F] border-[#38BDF8] shadow-sm'
                : 'bg-[#17263B] border-[#26364D] text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            3. DC Transient
          </button>
        </div>
      </div>

      {/* 2. Resistance R Slider */}
      <div className="space-y-2 bg-[#17263B] p-3.5 rounded-lg border border-[#26364D]">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#F1F5F9] flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]"></span>
            Resistance (R)
          </span>
          <span className="font-mono font-bold text-[#F97316]">
            {params.resistance} Ω
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="1000"
          step="1"
          value={params.resistance}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            onUpdateParams((p) => ({ ...p, resistance: val }));
          }}
          className="w-full h-1.5 bg-[#0B1728] rounded-lg appearance-none cursor-pointer accent-[#F97316]"
        />
        <div className="flex justify-between text-[10px] font-mono text-[#94A3B8]">
          <span>1 Ω</span>
          <span>100 Ω (Default)</span>
          <span>500 Ω</span>
          <span>1000 Ω</span>
        </div>
      </div>

      {/* 3. Inductance L Slider */}
      <div className="space-y-2 bg-[#17263B] p-3.5 rounded-lg border border-[#26364D]">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#F1F5F9] flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]"></span>
            Inductance (L)
          </span>
          <span className="font-mono font-bold text-[#38BDF8]">
            {params.inductanceMilliHenries} mH ({(params.inductanceMilliHenries * 1e-3).toFixed(3)} H)
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="1000"
          step="1"
          value={params.inductanceMilliHenries}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            onUpdateParams((p) => ({ ...p, inductanceMilliHenries: val }));
          }}
          className="w-full h-1.5 bg-[#0B1728] rounded-lg appearance-none cursor-pointer accent-[#38BDF8]"
        />
        <div className="flex justify-between text-[10px] font-mono text-[#94A3B8]">
          <span>1 mH</span>
          <span>100 mH</span>
          <span>500 mH</span>
          <span>1000 mH</span>
        </div>
      </div>

      {/* 4. Capacitance C Slider */}
      <div className="space-y-2 bg-[#17263B] p-3.5 rounded-lg border border-[#26364D]">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#F1F5F9] flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A78BFA]"></span>
            Capacitance (C)
          </span>
          <span className="font-mono font-bold text-[#A78BFA]">
            {params.capacitanceMicroFarads} µF ({(params.capacitanceMicroFarads * 1e-6).toExponential(2)} F)
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="1000"
          step="1"
          value={params.capacitanceMicroFarads}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            onUpdateParams((p) => ({ ...p, capacitanceMicroFarads: val }));
          }}
          className="w-full h-1.5 bg-[#0B1728] rounded-lg appearance-none cursor-pointer accent-[#A78BFA]"
        />
        <div className="flex justify-between text-[10px] font-mono text-[#94A3B8]">
          <span>1 µF</span>
          <span>100 µF</span>
          <span>500 µF</span>
          <span>1000 µF</span>
        </div>
      </div>

      {/* 5. AC Source Parameters (Voltage & Frequency) */}
      {params.circuitMode !== 'transient' ? (
        <div className="space-y-3 bg-[#17263B] p-3.5 rounded-lg border border-[#26364D]">
          {/* Source Voltage with RMS vs Peak toggle */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-[#F1F5F9] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]"></span>
                Source Voltage
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#FBBF24]">
                  {params.voltageDisplayMode === 'peak'
                    ? `${(params.sourceVoltageRMS * Math.SQRT2).toFixed(1)} V Peak`
                    : `${params.sourceVoltageRMS} V RMS`}
                </span>
                <button
                  onClick={() =>
                    onUpdateParams((p) => ({
                      ...p,
                      voltageDisplayMode: p.voltageDisplayMode === 'rms' ? 'peak' : 'rms',
                    }))
                  }
                  className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#0B1728] border border-[#26364D] text-[#38BDF8] hover:bg-[#101D30] cursor-pointer"
                >
                  {params.voltageDisplayMode === 'rms' ? 'Show Peak' : 'Show RMS'}
                </button>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="240"
              step="1"
              value={params.sourceVoltageRMS}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                onUpdateParams((p) => ({ ...p, sourceVoltageRMS: val }));
              }}
              className="w-full h-1.5 bg-[#0B1728] rounded-lg appearance-none cursor-pointer accent-[#FBBF24]"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#94A3B8] mt-1">
              <span>1 V</span>
              <span>12 V (Default)</span>
              <span>120 V</span>
              <span>240 V</span>
            </div>
          </div>

          {/* Source Frequency */}
          <div className="pt-2 border-t border-[#26364D]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-[#F1F5F9]">
                Source Frequency (f)
              </span>
              <span className="font-mono font-bold text-[#34D399]">
                {params.sourceFrequency} Hz
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="1000"
              step="1"
              value={params.sourceFrequency}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                onUpdateParams((p) => ({ ...p, sourceFrequency: val }));
              }}
              className="w-full h-1.5 bg-[#0B1728] rounded-lg appearance-none cursor-pointer accent-[#34D399]"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#94A3B8] mt-1">
              <span>1 Hz</span>
              <span>50 Hz (Mains)</span>
              <span>500 Hz</span>
              <span>1000 Hz</span>
            </div>
          </div>
        </div>
      ) : (
        /* DC Source Controls for Transient Mode */
        <div className="space-y-3 bg-[#17263B] p-3.5 rounded-lg border border-[#26364D]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#F1F5F9] flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]"></span>
              DC Voltage Step (V_source)
            </span>
            <span className="font-mono font-bold text-[#FBBF24]">
              {params.dcSourceVoltage} V DC
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            step="1"
            value={params.dcSourceVoltage}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              onUpdateParams((p) => ({ ...p, dcSourceVoltage: val }));
            }}
            className="w-full h-1.5 bg-[#0B1728] rounded-lg appearance-none cursor-pointer accent-[#FBBF24]"
          />
          <div className="flex justify-between text-[10px] font-mono text-[#94A3B8]">
            <span>1 V</span>
            <span>12 V</span>
            <span>24 V</span>
            <span>50 V</span>
          </div>
        </div>
      )}
    </div>
  );
};
