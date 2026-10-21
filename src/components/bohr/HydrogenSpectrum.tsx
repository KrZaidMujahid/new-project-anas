/**
 * EQUATION 1 — Live Hydrogen Spectrum Visualization
 * Horizontal electromagnetic spectrum display featuring:
 * - Ultraviolet (< 380 nm), Visible (380-750 nm), and Infrared (> 750 nm) regions
 * - Discrete emission line spectrum for Hydrogen (Balmer H-α, H-β, H-γ, H-δ, Lyman, Paschen)
 * - Dynamic marker tracking the active transition photon wavelength
 * - Click-to-load transition feature for any spectral line
 */

import React, { useState } from 'react';
import {
  ElectronTransition,
  SpectralSeriesName,
  PrincipalQuantumNumber,
} from '../../physics/bohr/types';
import { calculateTransition, wavelengthToRGB } from '../../physics/bohr/model';
import { Activity, Sparkles, Filter, Info } from 'lucide-react';

interface HydrogenSpectrumProps {
  activeTransition: ElectronTransition | null;
  onSelectTransition: (ni: PrincipalQuantumNumber, nf: PrincipalQuantumNumber) => void;
}

export const HydrogenSpectrum: React.FC<HydrogenSpectrumProps> = ({
  activeTransition,
  onSelectTransition,
}) => {
  const [selectedSeriesFilter, setSelectedSeriesFilter] = useState<string>('all');

  // Key hydrogen emission lines
  const keyLines: {
    name: string;
    ni: PrincipalQuantumNumber;
    nf: PrincipalQuantumNumber;
    series: SpectralSeriesName;
    lambdaNM: number;
    color: string;
    region: 'UV' | 'Visible' | 'IR';
  }[] = [
    // Lyman (UV)
    { name: 'Ly-α', ni: 2, nf: 1, series: 'Lyman', lambdaNM: 121.6, color: '#C084FC', region: 'UV' },
    { name: 'Ly-β', ni: 3, nf: 1, series: 'Lyman', lambdaNM: 102.6, color: '#A855F7', region: 'UV' },
    { name: 'Ly-γ', ni: 4, nf: 1, series: 'Lyman', lambdaNM: 97.3, color: '#9333EA', region: 'UV' },
    // Balmer (Visible)
    { name: 'H-δ', ni: 6, nf: 2, series: 'Balmer', lambdaNM: 410.2, color: '#8B5CF6', region: 'Visible' },
    { name: 'H-γ', ni: 5, nf: 2, series: 'Balmer', lambdaNM: 434.0, color: '#3B82F6', region: 'Visible' },
    { name: 'H-β', ni: 4, nf: 2, series: 'Balmer', lambdaNM: 486.1, color: '#06B6D4', region: 'Visible' },
    { name: 'H-α', ni: 3, nf: 2, series: 'Balmer', lambdaNM: 656.3, color: '#EF4444', region: 'Visible' },
    // Paschen (IR)
    { name: 'Pa-α', ni: 4, nf: 3, series: 'Paschen', lambdaNM: 1875.1, color: '#F43F5E', region: 'IR' },
    { name: 'Pa-β', ni: 5, nf: 3, series: 'Paschen', lambdaNM: 1281.8, color: '#FB7185', region: 'IR' },
    { name: 'Pa-γ', ni: 6, nf: 3, series: 'Paschen', lambdaNM: 1093.8, color: '#FDA4AF', region: 'IR' },
  ];

  // Filtered lines
  const displayedLines = keyLines.filter(
    (l) => selectedSeriesFilter === 'all' || l.series.toLowerCase() === selectedSeriesFilter
  );

  // Position of active transition on the visible spectrum strip
  // Visible spectrum spans 380 nm to 750 nm
  const getVisiblePercent = (lambdaNM: number): number => {
    return Math.max(0, Math.min(100, ((lambdaNM - 380) / (750 - 380)) * 100));
  };

  return (
    <div className="bg-[#10243D] border border-[#29415F] rounded-xl p-5 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#29415F]/70">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#38BDF8]" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Live Hydrogen Electromagnetic & Emission-Line Spectrum
          </h3>
        </div>

        {/* Series Filter Selector */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <Filter className="w-3.5 h-3.5 text-[#9FB3CC]" />
          <span className="text-[#9FB3CC]">Filter:</span>
          {['all', 'balmer', 'lyman', 'paschen'].map((series) => (
            <button
              key={`filter-${series}`}
              onClick={() => setSelectedSeriesFilter(series)}
              className={`px-2 py-0.5 rounded uppercase text-[10px] font-bold transition-colors cursor-pointer ${
                selectedSeriesFilter === series
                  ? 'bg-[#38BDF8] text-slate-950 font-black'
                  : 'bg-[#0B1B31] text-[#9FB3CC] hover:text-white border border-[#29415F]'
              }`}
            >
              {series}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Continuous Visible Spectrum Strip (380 - 750 nm) */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-purple-400 font-bold">Ultraviolet (UV &lt; 380 nm)</span>
          <span className="text-white font-bold">Visible Range (380 nm — 750 nm)</span>
          <span className="text-rose-400 font-bold">Infrared (IR &gt; 750 nm)</span>
        </div>

        {/* Rainbow Gradient Spectrum Bar with Marker */}
        <div className="relative w-full h-8 rounded-lg overflow-hidden border border-[#29415F] shadow-inner bg-gradient-to-r from-[#7C3AED] via-[#3B82F6] via-[#10B981] via-[#FBBF24] via-[#F97316] to-[#DC2626]">
          {/* Active Wavelength Indicator Marker */}
          {activeTransition && activeTransition.spectralRegion === 'visible' && (
            <div
              style={{ left: `${getVisiblePercent(activeTransition.wavelengthNM)}%` }}
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_8px_#FFF] transform -translate-x-1/2 flex flex-col items-center pointer-events-none"
            >
              <div className="w-2.5 h-2.5 bg-white rotate-45 -mt-1 shadow-sm" />
            </div>
          )}
        </div>

        {/* Ticks under visible spectrum */}
        <div className="flex justify-between text-[10px] font-mono text-[#9FB3CC] px-1">
          <span>380 nm (Violet)</span>
          <span>450 nm (Blue)</span>
          <span>520 nm (Green)</span>
          <span>590 nm (Yellow)</span>
          <span>650 nm (Red)</span>
          <span>750 nm (Near-IR)</span>
        </div>
      </div>

      {/* Active Transition Banner when UV or IR */}
      {activeTransition && activeTransition.spectralRegion !== 'visible' && (
        <div className="p-2.5 rounded-lg bg-[#0B1B31] border border-[#29415F] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                activeTransition.spectralRegion === 'ultraviolet' ? 'bg-purple-400' : 'bg-rose-400'
              }`}
            />
            <span className="text-white font-bold">
              Non-Visible Photon: {activeTransition.wavelengthNM.toFixed(1)} nm ({activeTransition.spectralRegion.toUpperCase()})
            </span>
          </div>
          <span className="text-[#9FB3CC] text-[11px]">
            {activeTransition.spectralRegion === 'ultraviolet'
              ? 'Lyman series emissions lie in the UV domain and require photodetectors or fluorescence'
              : 'Paschen/Brackett/Pfund emissions lie in the infrared thermal domain'}
          </span>
        </div>
      )}

      {/* 2. Discrete Hydrogen Emission Lines Strip (Dark Spectrogram) */}
      <div className="space-y-1.5 pt-2 border-t border-[#29415F]/70">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-white">
            Hydrogen Emission Spectrum (Click any line to load transition):
          </span>
          <span className="font-mono text-[10px] text-[#38BDF8]">
            Balmer H-α (656.3 nm), H-β (486.1 nm), H-γ (434.0 nm), H-δ (410.2 nm)
          </span>
        </div>

        {/* Dark Spectrograph Chamber */}
        <div className="relative w-full h-16 bg-[#070D18] rounded-lg border border-[#29415F] p-2 flex items-center shadow-inner overflow-hidden">
          {/* Subtle faint background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-950/20 via-transparent to-transparent pointer-events-none" />

          {/* Render Emission Lines */}
          <div className="relative w-full h-full">
            {displayedLines.map((line) => {
              // Only draw lines on horizontal scale if they are within or near visible
              // For UV/IR, group them symbolically on edges
              let leftPercent = 50;
              if (line.region === 'Visible') {
                leftPercent = getVisiblePercent(line.lambdaNM);
              } else if (line.region === 'UV') {
                leftPercent = Math.max(3, Math.min(18, (line.lambdaNM / 150) * 18));
              } else {
                leftPercent = Math.max(82, Math.min(97, 82 + ((line.lambdaNM - 800) / 1200) * 15));
              }

              const isCurrent =
                activeTransition?.initialLevel === line.ni &&
                activeTransition?.finalLevel === line.nf;

              return (
                <button
                  key={`spectrogram-line-${line.name}`}
                  onClick={() => onSelectTransition(line.ni, line.nf)}
                  style={{ left: `${leftPercent}%` }}
                  title={`${line.name}: n=${line.ni} → n=${line.nf} (${line.lambdaNM} nm, ${line.series} series)`}
                  className={`absolute top-0 bottom-0 flex flex-col items-center justify-between group cursor-pointer transform -translate-x-1/2 transition-transform hover:scale-110 z-10`}
                >
                  {/* Top Line Tag */}
                  <span
                    className={`text-[9px] font-mono font-bold px-1 rounded transition-colors ${
                      isCurrent
                        ? 'bg-white text-slate-950 shadow-md font-black'
                        : 'text-white opacity-70 group-hover:opacity-100 group-hover:bg-white/20'
                    }`}
                  >
                    {line.name}
                  </span>

                  {/* Bright Emission Line Bar */}
                  <div
                    style={{
                      backgroundColor: line.color,
                      boxShadow: isCurrent
                        ? `0 0 12px ${line.color}, 0 0 4px #FFF`
                        : `0 0 6px ${line.color}`,
                    }}
                    className={`w-1 h-7 rounded-full transition-all ${
                      isCurrent ? 'w-1.5' : 'group-hover:w-1.5'
                    }`}
                  />

                  {/* Bottom Wavelength */}
                  <span className="text-[8px] font-mono text-[#9FB3CC] opacity-60 group-hover:opacity-100">
                    {line.lambdaNM.toFixed(0)}nm
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
