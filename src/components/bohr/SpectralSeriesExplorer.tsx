/**
 * EQUATION 1 — Hydrogen Spectral Series Explorer
 * Interactive analysis of the five classical spectral series:
 * Lyman (n_f=1, UV), Balmer (n_f=2, Visible), Paschen (n_f=3, IR),
 * Brackett (n_f=4, IR), and Pfund (n_f=5, IR), with Rydberg verification.
 */

import React, { useState } from 'react';
import {
  PrincipalQuantumNumber,
  SpectralSeriesName,
  ElectronTransition,
} from '../../physics/bohr/types';
import { calculateTransition } from '../../physics/bohr/model';
import { BookOpen, Sparkles, ArrowRight, Play, CheckCircle2 } from 'lucide-react';

interface SpectralSeriesExplorerProps {
  onLoadTransition: (ni: PrincipalQuantumNumber, nf: PrincipalQuantumNumber) => void;
  activeTransition: ElectronTransition | null;
}

interface SeriesInfo {
  name: SpectralSeriesName;
  nf: PrincipalQuantumNumber;
  region: string;
  discoverer: string;
  year: string;
  description: string;
  allowedNi: PrincipalQuantumNumber[];
}

export const SpectralSeriesExplorer: React.FC<SpectralSeriesExplorerProps> = ({
  onLoadTransition,
  activeTransition,
}) => {
  const [selectedSeries, setSelectedSeries] = useState<SpectralSeriesName>('Balmer');

  const seriesData: Record<SpectralSeriesName, SeriesInfo> = {
    Lyman: {
      name: 'Lyman',
      nf: 1,
      region: 'Ultraviolet (UV)',
      discoverer: 'Theodore Lyman',
      year: '1906',
      description:
        'All transitions decaying down to the ground state (n_f = 1). Because of the large energy gap (minimum 10.20 eV), all Lyman photons reside in the energetic vacuum ultraviolet domain.',
      allowedNi: [2, 3, 4, 5, 6],
    },
    Balmer: {
      name: 'Balmer',
      nf: 2,
      region: 'Visible & Near-UV',
      discoverer: 'Johann Jakob Balmer',
      year: '1885',
      description:
        'The only spectral series in hydrogen with lines in the human visible range. Includes H-α (656.3 nm red), H-β (486.1 nm cyan), H-γ (434.0 nm violet), and H-δ (410.2 nm violet).',
      allowedNi: [3, 4, 5, 6],
    },
    Paschen: {
      name: 'Paschen',
      nf: 3,
      region: 'Near-Infrared (IR)',
      discoverer: 'Friedrich Paschen',
      year: '1908',
      description:
        'Transitions terminating at the second excited state (n_f = 3). Emits lower-energy infrared photons utilized in astrophysics to penetrate interstellar dust.',
      allowedNi: [4, 5, 6],
    },
    Brackett: {
      name: 'Brackett',
      nf: 4,
      region: 'Mid-Infrared (IR)',
      discoverer: 'Frederick Sumner Brackett',
      year: '1922',
      description:
        'Transitions dropping to n_f = 4. Produces thermal mid-infrared lines observed in hot stellar atmospheres and galactic cores.',
      allowedNi: [5, 6],
    },
    Pfund: {
      name: 'Pfund',
      nf: 5,
      region: 'Far-Infrared (IR)',
      discoverer: 'August Herman Pfund',
      year: '1924',
      description:
        'Transitions into n_f = 5. Generates long-wavelength far-infrared photons with small energy differences (ΔE < 0.20 eV).',
      allowedNi: [6],
    },
  };

  const currentInfo = seriesData[selectedSeries];

  return (
    <div className="bg-[#10243D] border border-[#29415F] rounded-xl p-5 shadow-xl flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#29415F]/70">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#818CF8]" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Hydrogen Spectral Series Explorer & Historical Context
          </h3>
        </div>
        <span className="text-xs font-mono text-[#818CF8]">
          Rydberg Formula: 1/λ = R_H (1/n_f² − 1/n_i²)
        </span>
      </div>

      {/* Series Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {(Object.keys(seriesData) as SpectralSeriesName[]).map((seriesName) => {
          const isSelected = selectedSeries === seriesName;
          const info = seriesData[seriesName];

          return (
            <button
              key={`series-tab-${seriesName}`}
              onClick={() => setSelectedSeries(seriesName)}
              className={`p-3 rounded-lg text-left transition-all cursor-pointer border flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#142B47] border-[#818CF8] text-white shadow-sm ring-1 ring-[#818CF8]/40'
                  : 'bg-[#0B1B31] border-[#29415F] text-[#9FB3CC] hover:border-slate-500 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">{seriesName}</span>
                <span className="text-[10px] font-mono text-[#38BDF8]">
                  n_f = {info.nf}
                </span>
              </div>
              <div className="text-[10px] font-mono text-[#9FB3CC] mt-1">
                {info.region}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Series Overview Box */}
      <div className="p-4 rounded-xl bg-[#0B1B31] border border-[#29415F] flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <span className="text-[#818CF8]">{currentInfo.name} Series</span>
            <span className="text-slate-500">·</span>
            <span className="text-xs font-mono text-[#38BDF8]">
              Final Bound State n_f = {currentInfo.nf}
            </span>
          </div>
          <span className="text-xs font-mono text-[#9FB3CC]">
            Discovered by {currentInfo.discoverer} ({currentInfo.year})
          </span>
        </div>

        <p className="text-xs text-[#9FB3CC] leading-relaxed">
          {currentInfo.description}
        </p>

        {/* Allowed Transitions Table for this Series */}
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#29415F] text-[#9FB3CC] font-mono uppercase text-[10px] bg-[#10243D]/60">
                <th className="py-2 px-3">Transition</th>
                <th className="py-2 px-3">Common Name</th>
                <th className="py-2 px-3 text-right">Photon Energy (eV)</th>
                <th className="py-2 px-3 text-right">Wavelength (nm)</th>
                <th className="py-2 px-3">Spectral Region</th>
                <th className="py-2 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#29415F]/50 font-mono">
              {currentInfo.allowedNi.map((ni) => {
                const trans = calculateTransition(ni, currentInfo.nf);
                if (!trans) return null;

                const isCurrentlyActive =
                  activeTransition?.initialLevel === ni &&
                  activeTransition?.finalLevel === currentInfo.nf;

                return (
                  <tr
                    key={`series-row-${ni}-${currentInfo.nf}`}
                    className={`transition-colors ${
                      isCurrentlyActive
                        ? 'bg-[#142B47] text-white font-bold border-l-4 border-l-[#38BDF8]'
                        : 'hover:bg-[#142B47]/40 text-[#9FB3CC]'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-semibold text-white">
                      n = {ni} → n = {currentInfo.nf}
                    </td>
                    <td className="py-2.5 px-3 text-white">
                      {trans.isHAlpha
                        ? 'Balmer H-α (Red)'
                        : trans.isHBeta
                        ? 'Balmer H-β (Cyan)'
                        : trans.isHGamma
                        ? 'Balmer H-γ (Blue)'
                        : trans.isHDelta
                        ? 'Balmer H-δ (Violet)'
                        : currentInfo.name === 'Lyman' && ni === 2
                        ? 'Lyman-α'
                        : currentInfo.name === 'Lyman' && ni === 3
                        ? 'Lyman-β'
                        : `${currentInfo.name}-${String.fromCharCode(96 + (ni - currentInfo.nf))}`}
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#FBBF24] font-bold">
                      {trans.deltaEnergyEV.toFixed(3)} eV
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#38BDF8] font-bold flex items-center justify-end gap-1.5">
                      {trans.visibleColorHex && (
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block shadow-sm"
                          style={{ backgroundColor: trans.visibleColorHex }}
                        />
                      )}
                      <span>{trans.wavelengthNM.toFixed(1)} nm</span>
                    </td>
                    <td className="py-2.5 px-3 capitalize font-sans text-xs">
                      {trans.spectralRegion}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => onLoadTransition(ni, currentInfo.nf)}
                        className="py-1 px-2.5 rounded bg-[#10243D] hover:bg-[#38BDF8] hover:text-slate-950 text-white font-semibold text-[11px] border border-[#29415F] transition-colors cursor-pointer flex items-center gap-1 mx-auto"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Load & Animate</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
