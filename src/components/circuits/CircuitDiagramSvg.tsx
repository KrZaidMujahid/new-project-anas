/**
 * EQUATION 1 — RLC Circuits Live Diagram (SVG)
 * Animated circuit schematic with AC source, zigzag resistor, inductor coil,
 * capacitor plates, animated AC current particles, voltage tags, and mode switching.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Zap, Eye, ArrowRight, Activity, ToggleLeft, ToggleRight } from 'lucide-react';
import {
  RLCParameters,
  SeriesCalculations,
  ParallelCalculations,
  SelectedComponent,
} from '../../physics/circuits/types';

interface CircuitDiagramSvgProps {
  params: RLCParameters;
  seriesCalc: SeriesCalculations;
  parallelCalc: ParallelCalculations;
  selectedComponent: SelectedComponent;
  onSelectComponent: (comp: SelectedComponent) => void;
  onToggleVoltages: () => void;
  onToggleCurrentDirection: () => void;
}

export const CircuitDiagramSvg: React.FC<CircuitDiagramSvgProps> = ({
  params,
  seriesCalc,
  parallelCalc,
  selectedComponent,
  onSelectComponent,
  onToggleVoltages,
  onToggleCurrentDirection,
}) => {
  const [animTime, setAnimTime] = useState(0);
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Animation loop for flowing current charges
  useEffect(() => {
    const loop = (timestamp: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = timestamp;
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      setAnimTime((prev) => prev + delta);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const f = params.sourceFrequency;
  const omega = 2 * Math.PI * f;

  // Instantaneous current calculation for particle motion
  // i(t) = I_peak * sin(ωt - φ)
  const currentMagnitude =
    params.circuitMode === 'series'
      ? seriesCalc.currentPeak
      : params.circuitMode === 'parallel'
      ? parallelCalc.currentSourcePeak
      : 0.1;

  const phaseRad =
    params.circuitMode === 'series'
      ? seriesCalc.phaseAngleRad
      : (parallelCalc.phaseAngleDeg * Math.PI) / 180;

  // Instantaneous AC factor in range [-1, 1]
  const instACFactor = Math.sin(omega * animTime - phaseRad);
  const instCurrentVal = currentMagnitude * instACFactor;

  // SVG dimensions
  const width = 640;
  const height = 340;

  // Render Series RLC Circuit
  const renderSeriesCircuit = () => {
    // Loop path: Rectangular loop from (80, 60) to (560, 280)
    // Left: AC Source at (80, 170)
    // Top: Resistor R centered at (200, 60), Inductor L centered at (360, 60), Capacitor C centered at (500, 60)
    // Or distributed: Top has Resistor, Right has Inductor, Bottom has Capacitor
    // Standard clear layout:
    // Top wire: Resistor (x: 200) -> Inductor (x: 360) -> Capacitor (x: 500)
    // Bottom wire: return line to AC Source
    return (
      <g>
        {/* Wire paths */}
        {/* Outer loop background wire */}
        <path
          d="M 90 120 L 90 60 L 150 60 
             M 250 60 L 310 60 
             M 410 60 L 460 60 
             M 540 60 L 560 60 L 560 280 L 90 280 L 90 220"
          fill="none"
          stroke="#26364D"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 1. AC Voltage Source at (90, 170) */}
        <g
          transform="translate(90, 170)"
          className="cursor-pointer"
          onClick={() => onSelectComponent(null)}
        >
          <circle cx="0" cy="0" r="28" fill="#101D30" stroke="#FBBF24" strokeWidth="2.5" />
          {/* Sine wave inside circle */}
          <path
            d="M -16 0 Q -8 -16 0 0 T 16 0"
            fill="none"
            stroke="#FBBF24"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <text
            x="-42"
            y="-10"
            fill="#FBBF24"
            fontSize="12"
            fontWeight="bold"
            fontFamily="ui-monospace, monospace"
            textAnchor="end"
          >
            {params.voltageDisplayMode === 'peak'
              ? `${seriesCalc.vPeak.toFixed(1)} V pk`
              : `${params.sourceVoltageRMS} V RMS`}
          </text>
          <text
            x="-42"
            y="8"
            fill="#94A3B8"
            fontSize="10"
            fontFamily="ui-monospace, monospace"
            textAnchor="end"
          >
            {params.sourceFrequency} Hz (AC)
          </text>
        </g>

        {/* 2. Resistor R (Orange) between x=150 and x=250 at y=60 */}
        <g
          transform="translate(200, 60)"
          className="cursor-pointer group"
          onClick={() => onSelectComponent('resistor')}
        >
          {/* Highlight aura if selected */}
          {selectedComponent === 'resistor' && (
            <rect x="-56" y="-30" width="112" height="60" rx="8" fill="#F97316" fillOpacity="0.15" stroke="#F97316" strokeWidth="1.5" />
          )}
          {/* Zigzag Resistor Symbol */}
          <path
            d="M -50 0 L -40 0 L -33 -14 L -20 14 L -7 -14 L 6 14 L 19 -14 L 32 14 L 39 0 L 50 0"
            fill="none"
            stroke="#F97316"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            x="0"
            y="-22"
            fill="#F97316"
            fontSize="12"
            fontWeight="bold"
            fontFamily="ui-monospace, monospace"
            textAnchor="middle"
          >
            R = {params.resistance} Ω
          </text>
          {params.showComponentVoltages && (
            <text
              x="0"
              y="32"
              fill="#FBBF24"
              fontSize="11"
              fontWeight="bold"
              fontFamily="ui-monospace, monospace"
              textAnchor="middle"
            >
              V_R = {seriesCalc.voltageResistorRMS.toFixed(1)} V
            </text>
          )}
        </g>

        {/* 3. Inductor L (Cyan) between x=310 and x=410 at y=60 */}
        <g
          transform="translate(360, 60)"
          className="cursor-pointer group"
          onClick={() => onSelectComponent('inductor')}
        >
          {selectedComponent === 'inductor' && (
            <rect x="-56" y="-30" width="112" height="60" rx="8" fill="#38BDF8" fillOpacity="0.15" stroke="#38BDF8" strokeWidth="1.5" />
          )}
          {/* Coiled loop inductor symbol */}
          <path
            d="M -50 0 L -40 0 
               A 10 10 0 0 1 -20 0 
               A 10 10 0 0 1 0 0 
               A 10 10 0 0 1 20 0 
               A 10 10 0 0 1 40 0 
               L 50 0"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <text
            x="0"
            y="-22"
            fill="#38BDF8"
            fontSize="12"
            fontWeight="bold"
            fontFamily="ui-monospace, monospace"
            textAnchor="middle"
          >
            L = {params.inductanceMilliHenries} mH
          </text>
          <text
            x="0"
            y="-8"
            fill="#94A3B8"
            fontSize="9"
            fontFamily="ui-monospace, monospace"
            textAnchor="middle"
          >
            X_L = {seriesCalc.inductiveReactance.toFixed(1)} Ω
          </text>
          {params.showComponentVoltages && (
            <text
              x="0"
              y="32"
              fill="#FBBF24"
              fontSize="11"
              fontWeight="bold"
              fontFamily="ui-monospace, monospace"
              textAnchor="middle"
            >
              V_L = {seriesCalc.voltageInductorRMS.toFixed(1)} V
            </text>
          )}
        </g>

        {/* 4. Capacitor C (Purple) between x=460 and x=540 at y=60 */}
        <g
          transform="translate(500, 60)"
          className="cursor-pointer group"
          onClick={() => onSelectComponent('capacitor')}
        >
          {selectedComponent === 'capacitor' && (
            <rect x="-46" y="-30" width="92" height="60" rx="8" fill="#A78BFA" fillOpacity="0.15" stroke="#A78BFA" strokeWidth="1.5" />
          )}
          {/* Capacitor Plates Symbol */}
          <line x1="-40" y1="0" x2="-8" y2="0" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" />
          <line x1="-8" y1="-18" x2="-8" y2="18" stroke="#A78BFA" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="8" y1="-18" x2="8" y2="18" stroke="#A78BFA" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="8" y1="0" x2="40" y2="0" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" />

          <text
            x="0"
            y="-24"
            fill="#A78BFA"
            fontSize="12"
            fontWeight="bold"
            fontFamily="ui-monospace, monospace"
            textAnchor="middle"
          >
            C = {params.capacitanceMicroFarads} µF
          </text>
          <text
            x="0"
            y="-10"
            fill="#94A3B8"
            fontSize="9"
            fontFamily="ui-monospace, monospace"
            textAnchor="middle"
          >
            X_C = {seriesCalc.capacitiveReactance.toFixed(1)} Ω
          </text>
          {params.showComponentVoltages && (
            <text
              x="0"
              y="32"
              fill="#FBBF24"
              fontSize="11"
              fontWeight="bold"
              fontFamily="ui-monospace, monospace"
              textAnchor="middle"
            >
              V_C = {seriesCalc.voltageCapacitorRMS.toFixed(1)} V
            </text>
          )}
        </g>

        {/* Current Flow Direction Indicator */}
        {params.showCurrentDirection && (
          <g transform="translate(325, 280)">
            <rect x="-85" y="-14" width="170" height="28" rx="6" fill="#101D30" stroke="#34D399" strokeWidth="1" />
            <path
              d={instCurrentVal >= 0 ? "M -40 0 L 40 0 M 32 -5 L 40 0 L 32 5" : "M 40 0 L -40 0 M -32 -5 L -40 0 L -32 5"}
              fill="none"
              stroke="#34D399"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <text
              x="0"
              y="4"
              fill="#34D399"
              fontSize="10"
              fontWeight="bold"
              fontFamily="ui-monospace, monospace"
              textAnchor="middle"
            >
              i(t) = {(instCurrentVal * 1000).toFixed(0)} mA
            </text>
          </g>
        )}
      </g>
    );
  };

  // Render Parallel RLC Circuit
  const renderParallelCircuit = () => {
    return (
      <g>
        {/* Parallel Buses */}
        {/* Top Bus y=70, Bottom Bus y=270 */}
        <line x1="120" y1="70" x2="520" y2="70" stroke="#26364D" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="120" y1="270" x2="520" y2="270" stroke="#26364D" strokeWidth="3.5" strokeLinecap="round" />

        {/* Left AC Source */}
        <line x1="120" y1="70" x2="120" y2="140" stroke="#26364D" strokeWidth="3.5" />
        <line x1="120" y1="200" x2="120" y2="270" stroke="#26364D" strokeWidth="3.5" />

        <g transform="translate(120, 170)" className="cursor-pointer" onClick={() => onSelectComponent(null)}>
          <circle cx="0" cy="0" r="26" fill="#101D30" stroke="#FBBF24" strokeWidth="2.5" />
          <path d="M -14 0 Q -7 -14 0 0 T 14 0" fill="none" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
          <text x="-36" y="-8" fill="#FBBF24" fontSize="11" fontWeight="bold" fontFamily="ui-monospace, monospace" textAnchor="end">
            {params.sourceVoltageRMS} V RMS
          </text>
          <text x="-36" y="8" fill="#94A3B8" fontSize="9" fontFamily="ui-monospace, monospace" textAnchor="end">
            {params.sourceFrequency} Hz
          </text>
        </g>

        {/* Branch 1: Resistor R (x=240) */}
        <line x1="240" y1="70" x2="240" y2="120" stroke="#26364D" strokeWidth="3" />
        <line x1="240" y1="220" x2="240" y2="270" stroke="#26364D" strokeWidth="3" />
        <circle cx="240" cy="70" r="4" fill="#38BDF8" />
        <circle cx="240" cy="270" r="4" fill="#38BDF8" />

        <g
          transform="translate(240, 170)"
          className="cursor-pointer"
          onClick={() => onSelectComponent('resistor')}
        >
          {selectedComponent === 'resistor' && (
            <rect x="-35" y="-50" width="70" height="100" rx="8" fill="#F97316" fillOpacity="0.15" stroke="#F97316" strokeWidth="1.5" />
          )}
          {/* Vertical Zigzag Resistor */}
          <path
            d="M 0 -45 L 0 -35 L -12 -25 L 12 -13 L -12 -1 L 12 11 L -12 23 L 12 35 L 0 45"
            fill="none"
            stroke="#F97316"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x="24" y="-8" fill="#F97316" fontSize="11" fontWeight="bold" fontFamily="ui-monospace, monospace">
            R = {params.resistance} Ω
          </text>
          <text x="24" y="8" fill="#94A3B8" fontSize="10" fontFamily="ui-monospace, monospace">
            I_R = {parallelCalc.currentResistorRMS.toFixed(2)} A
          </text>
        </g>

        {/* Branch 2: Inductor L (x=380) */}
        <line x1="380" y1="70" x2="380" y2="120" stroke="#26364D" strokeWidth="3" />
        <line x1="380" y1="220" x2="380" y2="270" stroke="#26364D" strokeWidth="3" />
        <circle cx="380" cy="70" r="4" fill="#38BDF8" />
        <circle cx="380" cy="270" r="4" fill="#38BDF8" />

        <g
          transform="translate(380, 170)"
          className="cursor-pointer"
          onClick={() => onSelectComponent('inductor')}
        >
          {selectedComponent === 'inductor' && (
            <rect x="-35" y="-50" width="70" height="100" rx="8" fill="#38BDF8" fillOpacity="0.15" stroke="#38BDF8" strokeWidth="1.5" />
          )}
          {/* Vertical Coil loops */}
          <path
            d="M 0 -45 L 0 -36 
               A 9 9 0 0 1 0 -18 
               A 9 9 0 0 1 0 0 
               A 9 9 0 0 1 0 18 
               A 9 9 0 0 1 0 36 
               L 0 45"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <text x="22" y="-8" fill="#38BDF8" fontSize="11" fontWeight="bold" fontFamily="ui-monospace, monospace">
            L = {params.inductanceMilliHenries} mH
          </text>
          <text x="22" y="8" fill="#94A3B8" fontSize="10" fontFamily="ui-monospace, monospace">
            I_L = {parallelCalc.currentInductorRMS.toFixed(2)} A
          </text>
        </g>

        {/* Branch 3: Capacitor C (x=500) */}
        <line x1="500" y1="70" x2="500" y2="155" stroke="#26364D" strokeWidth="3" />
        <line x1="500" y1="185" x2="500" y2="270" stroke="#26364D" strokeWidth="3" />
        <circle cx="500" cy="70" r="4" fill="#38BDF8" />
        <circle cx="500" cy="270" r="4" fill="#38BDF8" />

        <g
          transform="translate(500, 170)"
          className="cursor-pointer"
          onClick={() => onSelectComponent('capacitor')}
        >
          {selectedComponent === 'capacitor' && (
            <rect x="-35" y="-50" width="70" height="100" rx="8" fill="#A78BFA" fillOpacity="0.15" stroke="#A78BFA" strokeWidth="1.5" />
          )}
          {/* Horizontal parallel plates */}
          <line x1="-18" y1="-8" x2="18" y2="-8" stroke="#A78BFA" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="-18" y1="8" x2="18" y2="8" stroke="#A78BFA" strokeWidth="3.5" strokeLinecap="round" />
          <text x="24" y="-8" fill="#A78BFA" fontSize="11" fontWeight="bold" fontFamily="ui-monospace, monospace">
            C = {params.capacitanceMicroFarads} µF
          </text>
          <text x="24" y="8" fill="#94A3B8" fontSize="10" fontFamily="ui-monospace, monospace">
            I_C = {parallelCalc.currentCapacitorRMS.toFixed(2)} A
          </text>
        </g>

        {/* Source Current Indicator */}
        {params.showCurrentDirection && (
          <g transform="translate(180, 50)">
            <text x="0" y="0" fill="#34D399" fontSize="10" fontWeight="bold" fontFamily="ui-monospace, monospace">
              I_source = {parallelCalc.currentSourceRMS.toFixed(2)} A RMS
            </text>
          </g>
        )}
      </g>
    );
  };

  // Render DC Transient Circuit
  const renderTransientCircuit = () => {
    return (
      <g>
        {/* Rectangular Loop */}
        <path
          d="M 120 130 L 120 70 L 220 70 
             M 260 55 L 295 70 
             M 295 70 L 370 70 
             M 460 70 L 520 70 L 520 270 L 120 270 L 120 210"
          fill="none"
          stroke="#26364D"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Switch Symbol at (240, 70) */}
        <circle cx="220" cy="70" r="4" fill="#FBBF24" />
        <line x1="220" y1="70" x2="255" y2="48" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
        <circle cx="265" cy="70" r="4" fill="#26364D" />
        <text x="235" y="36" fill="#FBBF24" fontSize="10" fontWeight="bold" fontFamily="ui-monospace, monospace">
          Switch (t = 0)
        </text>

        {/* DC Voltage Source (Battery) at (120, 170) */}
        <g transform="translate(120, 170)">
          <line x1="0" y1="-30" x2="0" y2="-12" stroke="#26364D" strokeWidth="3" />
          <line x1="-18" y1="-12" x2="18" y2="-12" stroke="#FBBF24" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="-10" y1="0" x2="10" y2="0" stroke="#FBBF24" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="-18" y1="12" x2="18" y2="12" stroke="#FBBF24" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="-10" y1="24" x2="10" y2="24" stroke="#FBBF24" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="0" y1="24" x2="0" y2="40" stroke="#26364D" strokeWidth="3" />

          <text x="-26" y="2" fill="#FBBF24" fontSize="12" fontWeight="bold" fontFamily="ui-monospace, monospace" textAnchor="end">
            {params.dcSourceVoltage} V DC
          </text>
        </g>

        {/* Resistor R at (370, 70) */}
        <g transform="translate(370, 70)">
          <path
            d="M -35 0 L -25 0 L -20 -12 L -10 12 L 0 -12 L 10 12 L 20 -12 L 25 0 L 35 0"
            fill="none"
            stroke="#F97316"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x="0" y="-18" fill="#F97316" fontSize="11" fontWeight="bold" fontFamily="ui-monospace, monospace" textAnchor="middle">
            R = {params.resistance} Ω
          </text>
        </g>

        {/* Dynamic Component depending on transient type */}
        {params.transientType === 'rc' ? (
          <g transform="translate(520, 170)">
            <line x1="-18" y1="-8" x2="18" y2="-8" stroke="#A78BFA" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="-18" y1="8" x2="18" y2="8" stroke="#A78BFA" strokeWidth="3.5" strokeLinecap="round" />
            <text x="26" y="4" fill="#A78BFA" fontSize="11" fontWeight="bold" fontFamily="ui-monospace, monospace">
              C = {params.capacitanceMicroFarads} µF
            </text>
          </g>
        ) : params.transientType === 'rl' ? (
          <g transform="translate(520, 170)">
            <path
              d="M 0 -36 A 9 9 0 0 1 0 -18 A 9 9 0 0 1 0 0 A 9 9 0 0 1 0 18 A 9 9 0 0 1 0 36"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <text x="24" y="4" fill="#38BDF8" fontSize="11" fontWeight="bold" fontFamily="ui-monospace, monospace">
              L = {params.inductanceMilliHenries} mH
            </text>
          </g>
        ) : (
          <g transform="translate(520, 170)">
            {/* Both L and C */}
            <path
              d="M 0 -45 A 8 8 0 0 1 0 -25 A 8 8 0 0 1 0 -5"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line x1="-14" y1="12" x2="14" y2="12" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" />
            <line x1="-14" y1="24" x2="14" y2="24" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" />
            <text x="24" y="-12" fill="#38BDF8" fontSize="10" fontWeight="bold" fontFamily="ui-monospace, monospace">
              L = {params.inductanceMilliHenries} mH
            </text>
            <text x="24" y="24" fill="#A78BFA" fontSize="10" fontWeight="bold" fontFamily="ui-monospace, monospace">
              C = {params.capacitanceMicroFarads} µF
            </text>
          </g>
        )}
      </g>
    );
  };

  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl flex flex-col gap-3">
      {/* Top Bar with Mode and Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#26364D]">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#FBBF24]" />
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F1F5F9]">
            Live Circuit Schematic
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#17263B] text-[#38BDF8] border border-[#26364D]">
            {params.circuitMode.toUpperCase()} RLC
          </span>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleVoltages}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
              params.showComponentVoltages
                ? 'bg-[#FBBF24]/20 border-[#FBBF24] text-[#FBBF24]'
                : 'bg-[#17263B] border-[#26364D] text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Voltages</span>
          </button>

          <button
            onClick={onToggleCurrentDirection}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
              params.showCurrentDirection
                ? 'bg-[#34D399]/20 border-[#34D399] text-[#34D399]'
                : 'bg-[#17263B] border-[#26364D] text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Current Flow</span>
          </button>
        </div>
      </div>

      {/* Interactive SVG Diagram Box */}
      <div className="w-full relative rounded-xl overflow-hidden border border-[#26364D] bg-[#0A1526] shadow-inner">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto block select-none"
          style={{ minHeight: '280px' }}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="circuitGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#17263B" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* Grid Background */}
          <rect width={width} height={height} fill="#0A1526" />
          <rect width={width} height={height} fill="url(#circuitGrid)" />

          {/* Circuit Geometry based on mode */}
          {params.circuitMode === 'series' && renderSeriesCircuit()}
          {params.circuitMode === 'parallel' && renderParallelCircuit()}
          {params.circuitMode === 'transient' && renderTransientCircuit()}

          {/* Legend / Key in bottom right */}
          <g transform={`translate(${width - 150}, ${height - 40})`} opacity="0.85">
            <rect x="0" y="0" width="140" height="30" rx="4" fill="#101D30" stroke="#26364D" strokeWidth="1" />
            <circle cx="14" cy="15" r="4" fill="#F97316" />
            <text x="22" y="18" fill="#F1F5F9" fontSize="9" fontFamily="ui-monospace, monospace">R</text>

            <circle cx="50" cy="15" r="4" fill="#38BDF8" />
            <text x="58" y="18" fill="#F1F5F9" fontSize="9" fontFamily="ui-monospace, monospace">L</text>

            <circle cx="86" cy="15" r="4" fill="#A78BFA" />
            <text x="94" y="18" fill="#F1F5F9" fontSize="9" fontFamily="ui-monospace, monospace">C</text>

            <circle cx="120" cy="15" r="4" fill="#34D399" />
            <text x="127" y="18" fill="#F1F5F9" fontSize="9" fontFamily="ui-monospace, monospace">I</text>
          </g>
        </svg>
      </div>

      {/* Bottom Information Bar */}
      <div className="flex flex-wrap items-center justify-between text-xs text-[#94A3B8] pt-1">
        <span>
          <strong className="text-[#F1F5F9]">Circuit Tip:</strong> Click any component symbol above or the educational cards below to highlight and inspect its governing physics.
        </span>
        <span className="font-mono text-[#FBBF24]">
          {params.circuitMode === 'series' && `Impedance Z = ${seriesCalc.impedance.toFixed(1)} Ω`}
          {params.circuitMode === 'parallel' && `Equiv Impedance Z_eq = ${parallelCalc.equivalentImpedance.toFixed(1)} Ω`}
          {params.circuitMode === 'transient' && `DC Source = ${params.dcSourceVoltage} V`}
        </span>
      </div>
    </div>
  );
};
