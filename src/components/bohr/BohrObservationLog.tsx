/**
 * EQUATION 1 — Bohr Model Experiment Observation Log
 * Experimental logging tool with localStorage persistence, editable notes,
 * and scientific CSV data export for hydrogen transition trials.
 */

import React, { useState, useEffect } from 'react';
import {
  BohrObservation,
  ElectronTransition,
  PrincipalQuantumNumber,
} from '../../physics/bohr/types';
import { calculateEnergyLevel } from '../../physics/bohr/model';
import {
  FileSpreadsheet,
  Download,
  Trash2,
  Plus,
  Check,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface BohrObservationLogProps {
  currentLevel: PrincipalQuantumNumber;
  activeTransition: ElectronTransition | null;
}

const STORAGE_KEY = 'bohr_model_observations_v1';

export const BohrObservationLog: React.FC<BohrObservationLogProps> = ({
  currentLevel,
  activeTransition,
}) => {
  const [observations, setObservations] = useState<BohrObservation[]>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      }
    } catch (e) {
      console.warn('Unable to load observations from localStorage', e);
    }
    // Default initial demonstration observation
    return [
      {
        id: 'initial-demo',
        timestamp: Date.now() - 120000,
        initialLevel: 3,
        finalLevel: 2,
        type: 'emission',
        initialEnergyEV: -1.5111,
        finalEnergyEV: -3.4,
        photonEnergyEV: 1.8889,
        wavelengthNM: 656.3,
        frequencyHz: 4.568e14,
        spectralSeries: 'Balmer',
        spectralRegion: 'visible',
        notes: 'Classic Balmer H-alpha red spectral line benchmark',
      },
    ];
  });

  const [studentNote, setStudentNote] = useState('');
  const [isExported, setIsExported] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(observations));
      }
    } catch (e) {
      console.warn('Unable to persist observations to localStorage', e);
    }
  }, [observations]);

  // Record current observation
  const handleRecord = () => {
    if (activeTransition) {
      const newObs: BohrObservation = {
        id: `obs-${Date.now()}`,
        timestamp: Date.now(),
        initialLevel: activeTransition.initialLevel,
        finalLevel: activeTransition.finalLevel,
        type: activeTransition.type,
        initialEnergyEV: calculateEnergyLevel(activeTransition.initialLevel).energyEV,
        finalEnergyEV: calculateEnergyLevel(activeTransition.finalLevel).energyEV,
        photonEnergyEV: activeTransition.deltaEnergyEV,
        wavelengthNM: activeTransition.wavelengthNM,
        frequencyHz: activeTransition.frequencyHz,
        spectralSeries: activeTransition.spectralSeries,
        spectralRegion: activeTransition.spectralRegion,
        notes: studentNote.trim() || undefined,
      };
      setObservations((prev) => [newObs, ...prev]);
      setStudentNote('');
    } else {
      // Record static bound state
      const state = calculateEnergyLevel(currentLevel);
      const newObs: BohrObservation = {
        id: `obs-${Date.now()}`,
        timestamp: Date.now(),
        initialLevel: currentLevel,
        finalLevel: currentLevel,
        type: 'emission',
        initialEnergyEV: state.energyEV,
        finalEnergyEV: state.energyEV,
        photonEnergyEV: 0,
        wavelengthNM: 0,
        frequencyHz: 0,
        spectralRegion: 'visible',
        notes: studentNote.trim() || `Static inspection of bound level n = ${currentLevel}`,
      };
      setObservations((prev) => [newObs, ...prev]);
      setStudentNote('');
    }
  };

  const handleDelete = (id: string) => {
    setObservations((prev) => prev.filter((o) => o.id !== id));
  };

  const handleClearAll = () => {
    setObservations([]);
    setShowClearConfirm(false);
  };

  const handleUpdateNote = (id: string, notes: string) => {
    setObservations((prev) =>
      prev.map((o) => (o.id === id ? { ...o, notes } : o))
    );
  };

  const exportCSV = () => {
    if (observations.length === 0) return;

    const headers = [
      'Timestamp_ISO',
      'Initial_n_i',
      'Final_n_f',
      'Type',
      'Initial_Energy_eV',
      'Final_Energy_eV',
      'Photon_Energy_eV',
      'Wavelength_nm',
      'Frequency_Hz',
      'Spectral_Series',
      'Spectral_Region',
      'Notes',
    ];

    const rows = observations.map((o) => [
      new Date(o.timestamp).toISOString(),
      o.initialLevel,
      o.finalLevel,
      o.type,
      o.initialEnergyEV.toFixed(4),
      o.finalEnergyEV.toFixed(4),
      o.photonEnergyEV.toFixed(4),
      o.wavelengthNM.toFixed(2),
      o.frequencyHz.toExponential(4),
      o.spectralSeries || 'N/A',
      o.spectralRegion,
      `"${(o.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hydrogen_bohr_observations_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsExported(true);
    setTimeout(() => setIsExported(false), 3000);
  };

  return (
    <div className="bg-[#10243D] border border-[#29415F] rounded-xl p-5 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#29415F]/70">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-[#38BDF8]" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Experimental Observation Log & CSV Export
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            disabled={observations.length === 0}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              observations.length > 0
                ? 'bg-[#142B47] hover:bg-[#1E3B61] text-white border border-[#38BDF8]/40'
                : 'bg-[#0B1B31] text-[#9FB3CC] border border-[#29415F] cursor-not-allowed opacity-50'
            }`}
          >
            {isExported ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">CSV Exported</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </>
            )}
          </button>

          {observations.length > 0 && !showClearConfirm && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="p-1.5 rounded-lg bg-[#0B1B31] hover:bg-rose-950/40 text-[#9FB3CC] hover:text-rose-400 border border-[#29415F] transition-colors cursor-pointer"
              title="Clear all log entries"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {showClearConfirm && (
            <div className="flex items-center gap-1.5 text-xs bg-rose-950/60 p-1 rounded border border-rose-500/40">
              <span className="text-rose-200 text-[11px]">Clear all?</span>
              <button
                onClick={handleClearAll}
                className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px]"
              >
                Yes
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-2 py-0.5 rounded bg-slate-700 text-white text-[10px]"
              >
                No
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Record Trial Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-lg bg-[#0B1B31] border border-[#29415F]">
        <input
          type="text"
          placeholder={
            activeTransition
              ? `Note for transition n=${activeTransition.initialLevel} → n=${activeTransition.finalLevel}...`
              : `Note for state n=${currentLevel}...`
          }
          value={studentNote}
          onChange={(e) => setStudentNote(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleRecord()}
          className="flex-1 px-3 py-1.5 rounded bg-[#10243D] border border-[#29415F] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#38BDF8]"
        />
        <button
          onClick={handleRecord}
          className="px-4 py-1.5 rounded-lg bg-[#38BDF8] hover:bg-[#0284C7] text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Record Observation</span>
        </button>
      </div>

      {/* Observations Table */}
      {observations.length === 0 ? (
        <div className="py-8 text-center text-xs text-[#9FB3CC] font-mono">
          No observations recorded yet. Run a quantum transition or select a bound state and click "Record Observation".
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#29415F] text-[#9FB3CC] font-mono uppercase text-[10px] bg-[#0B1B31]/60">
                <th className="py-2.5 px-2.5">Time</th>
                <th className="py-2.5 px-2.5">Transition</th>
                <th className="py-2.5 px-2.5">Type</th>
                <th className="py-2.5 px-2.5 text-right">ΔE (eV)</th>
                <th className="py-2.5 px-2.5 text-right">λ (nm)</th>
                <th className="py-2.5 px-2.5 text-right">f (THz)</th>
                <th className="py-2.5 px-2.5">Series</th>
                <th className="py-2.5 px-2.5">Notes</th>
                <th className="py-2.5 px-2.5 text-center">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#29415F]/50 font-mono">
              {observations.map((obs) => (
                <tr key={obs.id} className="hover:bg-[#142B47]/30 transition-colors">
                  <td className="py-2 px-2.5 text-slate-400 text-[11px]">
                    {new Date(obs.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="py-2 px-2.5 font-bold text-white">
                    {obs.initialLevel === obs.finalLevel ? `n = ${obs.initialLevel}` : `n = ${obs.initialLevel} → ${obs.finalLevel}`}
                  </td>
                  <td className="py-2 px-2.5 capitalize text-xs">
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        obs.type === 'absorption'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {obs.type}
                    </span>
                  </td>
                  <td className="py-2 px-2.5 text-right text-[#FBBF24] font-bold">
                    {obs.photonEnergyEV > 0 ? `${obs.photonEnergyEV.toFixed(3)} eV` : '—'}
                  </td>
                  <td className="py-2 px-2.5 text-right text-[#38BDF8] font-bold">
                    {obs.wavelengthNM > 0 ? `${obs.wavelengthNM.toFixed(1)} nm` : '—'}
                  </td>
                  <td className="py-2 px-2.5 text-right text-slate-300">
                    {obs.frequencyHz > 0 ? (obs.frequencyHz / 1e12).toFixed(1) : '—'}
                  </td>
                  <td className="py-2 px-2.5 text-xs text-[#818CF8]">
                    {obs.spectralSeries || '—'}
                  </td>
                  <td className="py-2 px-2.5 text-[11px] font-sans text-slate-300 max-w-[200px]">
                    <input
                      type="text"
                      value={obs.notes || ''}
                      onChange={(e) => handleUpdateNote(obs.id, e.target.value)}
                      placeholder="Add note..."
                      className="w-full bg-transparent border-b border-transparent hover:border-[#29415F] focus:border-[#38BDF8] px-1 py-0.5 focus:outline-none text-xs"
                    />
                  </td>
                  <td className="py-2 px-2.5 text-center">
                    <button
                      onClick={() => handleDelete(obs.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
