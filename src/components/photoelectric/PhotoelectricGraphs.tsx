/**
 * EQUATION 1 — Photoelectric Interactive Graphs Workspace
 * Tabbed container holding:
 * 1. Graph 1: Maximum Kinetic Energy vs. Frequency (K_max vs f)
 * 2. Graph 2: Photocurrent vs. Applied Voltage (I-V Curve)
 * 3. Graph 3: Stopping Potential vs. Frequency (V_stop vs f)
 */

import React, { useState } from 'react';
import { TrendingUp, Activity, ShieldCheck, Layers } from 'lucide-react';
import { PhotoelectricParameters, PhotoelectricCalculations } from '../../physics/photoelectric/types';
import { KineticEnergyGraphSvg } from './KineticEnergyGraphSvg';
import { IVCurveGraphSvg } from './IVCurveGraphSvg';
import { StoppingPotentialGraphSvg } from './StoppingPotentialGraphSvg';

interface PhotoelectricGraphsProps {
  params: PhotoelectricParameters;
  calc: PhotoelectricCalculations;
  onSetFrequency: (f: number) => void;
  onSetVoltage: (v: number) => void;
}

export const PhotoelectricGraphs: React.FC<PhotoelectricGraphsProps> = ({
  params,
  calc,
  onSetFrequency,
  onSetVoltage,
}) => {
  const [activeTab, setActiveTab] = useState<'kmax' | 'iv' | 'vstop'>('kmax');

  return (
    <div className="space-y-3">
      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#10243D] p-1.5 rounded-xl border border-[#29415F]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('kmax')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'kmax'
                ? 'bg-[#38BDF8] text-[#071426] shadow-md'
                : 'text-[#9FB3CC] hover:text-[#EAF2FF] hover:bg-[#142B47]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Graph 1: K_max vs. Frequency</span>
          </button>

          <button
            onClick={() => setActiveTab('iv')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'iv'
                ? 'bg-[#34D399] text-[#071426] shadow-md'
                : 'text-[#9FB3CC] hover:text-[#EAF2FF] hover:bg-[#142B47]'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Graph 2: Photocurrent vs. Voltage (I-V)</span>
          </button>

          <button
            onClick={() => setActiveTab('vstop')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'vstop'
                ? 'bg-[#818CF8] text-[#071426] shadow-md'
                : 'text-[#9FB3CC] hover:text-[#EAF2FF] hover:bg-[#142B47]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Graph 3: Stopping Potential vs. Frequency</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-[#9FB3CC] pr-2 hidden md:block">
          Interactive SVG Graphs with Click-to-Tune
        </div>
      </div>

      {/* Render Active Graph */}
      <div>
        {activeTab === 'kmax' && (
          <KineticEnergyGraphSvg
            params={params}
            calc={calc}
            onSetFrequency={onSetFrequency}
          />
        )}
        {activeTab === 'iv' && (
          <IVCurveGraphSvg
            params={params}
            calc={calc}
            onSetVoltage={onSetVoltage}
          />
        )}
        {activeTab === 'vstop' && (
          <StoppingPotentialGraphSvg
            params={params}
            calc={calc}
            onSetFrequency={onSetFrequency}
          />
        )}
      </div>
    </div>
  );
};
