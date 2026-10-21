/**
 * EQUATION 1 — RLC Interactive Component Cards
 * 3 educational component cards (Resistor, Inductor, Capacitor)
 * with governing differential laws, energy formulas, and circuit highlight linkage.
 */

import React from 'react';
import { Flame, Compass, Layers, CheckCircle2 } from 'lucide-react';
import { SelectedComponent, SeriesCalculations } from '../../physics/circuits/types';

interface ComponentCardsProps {
  selectedComponent: SelectedComponent;
  onSelectComponent: (comp: SelectedComponent) => void;
  seriesCalc: SeriesCalculations;
}

export const ComponentCards: React.FC<ComponentCardsProps> = ({
  selectedComponent,
  onSelectComponent,
  seriesCalc,
}) => {
  const {
    voltageResistorRMS,
    voltageInductorRMS,
    voltageCapacitorRMS,
    currentRMS,
    inductanceH,
    capacitanceF,
    realPowerWatts,
  } = seriesCalc;

  // Stored energies
  // E_L = 1/2 L I_peak² = 1/2 L (sqrt(2) I_RMS)² = L I_RMS²
  const storedEnergyL = 0.5 * inductanceH * Math.pow(Math.SQRT2 * currentRMS, 2);
  const storedEnergyC = 0.5 * capacitanceF * Math.pow(Math.SQRT2 * voltageCapacitorRMS, 2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Resistor Card */}
      <div
        onClick={() => onSelectComponent(selectedComponent === 'resistor' ? null : 'resistor')}
        className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 shadow-lg ${
          selectedComponent === 'resistor'
            ? 'bg-[#17263B] border-[#F97316] ring-1 ring-[#F97316]/50'
            : 'bg-[#101D30] border-[#26364D] hover:border-[#F97316]/50'
        }`}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 border border-[#F97316]/30 flex items-center justify-center text-[#F97316]">
                <Flame className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#F97316]">
                RESISTOR (R)
              </h3>
            </div>
            {selectedComponent === 'resistor' && (
              <span className="text-[10px] font-mono text-[#F97316] bg-[#F97316]/10 px-2 py-0.5 rounded border border-[#F97316]/30">
                Selected
              </span>
            )}
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Opposes current flow via microscopic electron collisions, irreversibly converting electrical potential energy into thermal heat.
          </p>
        </div>

        <div className="bg-[#0B1728] p-3 rounded-lg border border-[#26364D] space-y-1.5 font-mono text-xs">
          <div className="flex justify-between text-[#F1F5F9]">
            <span>V_R = I &middot; R</span>
            <span className="text-[#FBBF24] font-bold">{voltageResistorRMS.toFixed(1)} V</span>
          </div>
          <div className="flex justify-between text-[#94A3B8]">
            <span>P_R = I&sup2; &middot; R</span>
            <span className="text-[#34D399] font-bold">{realPowerWatts.toFixed(2)} W</span>
          </div>
        </div>
      </div>

      {/* 2. Inductor Card */}
      <div
        onClick={() => onSelectComponent(selectedComponent === 'inductor' ? null : 'inductor')}
        className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 shadow-lg ${
          selectedComponent === 'inductor'
            ? 'bg-[#17263B] border-[#38BDF8] ring-1 ring-[#38BDF8]/50'
            : 'bg-[#101D30] border-[#26364D] hover:border-[#38BDF8]/50'
        }`}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#38BDF8]">
                INDUCTOR (L)
              </h3>
            </div>
            {selectedComponent === 'inductor' && (
              <span className="text-[10px] font-mono text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded border border-[#38BDF8]/30">
                Selected
              </span>
            )}
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Stores energy in a concentric magnetic field. Opposes instantaneous changes in current via Faraday back-EMF (inertia of electronics).
          </p>
        </div>

        <div className="bg-[#0B1728] p-3 rounded-lg border border-[#26364D] space-y-1.5 font-mono text-xs">
          <div className="flex justify-between text-[#F1F5F9]">
            <span>V_L = L &middot; (di/dt)</span>
            <span className="text-[#FBBF24] font-bold">{voltageInductorRMS.toFixed(1)} V</span>
          </div>
          <div className="flex justify-between text-[#94A3B8]">
            <span>E_L = &frac12; L I&sup2;</span>
            <span className="text-[#38BDF8] font-bold">{(storedEnergyL * 1000).toFixed(2)} mJ</span>
          </div>
        </div>
      </div>

      {/* 3. Capacitor Card */}
      <div
        onClick={() => onSelectComponent(selectedComponent === 'capacitor' ? null : 'capacitor')}
        className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 shadow-lg ${
          selectedComponent === 'capacitor'
            ? 'bg-[#17263B] border-[#A78BFA] ring-1 ring-[#A78BFA]/50'
            : 'bg-[#101D30] border-[#26364D] hover:border-[#A78BFA]/50'
        }`}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#A78BFA]/10 border border-[#A78BFA]/30 flex items-center justify-center text-[#A78BFA]">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#A78BFA]">
                CAPACITOR (C)
              </h3>
            </div>
            {selectedComponent === 'capacitor' && (
              <span className="text-[10px] font-mono text-[#A78BFA] bg-[#A78BFA]/10 px-2 py-0.5 rounded border border-[#A78BFA]/30">
                Selected
              </span>
            )}
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Stores electrostatic energy between separated conducting plates. Opposes sudden changes in voltage by accumulating charge Q = C &middot; V.
          </p>
        </div>

        <div className="bg-[#0B1728] p-3 rounded-lg border border-[#26364D] space-y-1.5 font-mono text-xs">
          <div className="flex justify-between text-[#F1F5F9]">
            <span>i_C = C &middot; (dv_C/dt)</span>
            <span className="text-[#FBBF24] font-bold">{voltageCapacitorRMS.toFixed(1)} V</span>
          </div>
          <div className="flex justify-between text-[#94A3B8]">
            <span>E_C = &frac12; C V&sup2;</span>
            <span className="text-[#A78BFA] font-bold">{(storedEnergyC * 1000).toFixed(2)} mJ</span>
          </div>
        </div>
      </div>
    </div>
  );
};
