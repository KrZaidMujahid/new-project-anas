/**
 * EQUATION 1 — Photoelectric Effect Observation Log & CSV Export (Section 15)
 * Allows students to record experimental trials, log telemetry snapshots,
 * add custom notes, persist in localStorage, and export to scientific CSV format.
 */

import React, { useState, useEffect } from 'react';
import { ClipboardList, Plus, Download, Trash2, AlertTriangle, FileSpreadsheet } from 'lucide-react';
import {
  PhotoelectricParameters,
  PhotoelectricCalculations,
  PhotoelectricObservation,
} from '../../physics/photoelectric/types';

interface PhotoelectricObservationLogProps {
  params: PhotoelectricParameters;
  calc: PhotoelectricCalculations;
}

const STORAGE_KEY = 'photoelectric_experiment_observations_v1';

export const PhotoelectricObservationLog: React.FC<PhotoelectricObservationLogProps> = ({
  params,
  calc,
}) => {
  const [observations, setObservations] = useState<PhotoelectricObservation[]>([]);
  const [customNote, setCustomNote] = useState<string>('');
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setObservations(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load observations from localStorage:', e);
    }
  }, []);

  // Save to localStorage whenever observations change
  const saveObservations = (newObs: PhotoelectricObservation[]) => {
    setObservations(newObs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newObs));
    } catch (e) {
      console.warn('Failed to save observations to localStorage:', e);
    }
  };

  // Add observation
  const handleRecordObservation = () => {
    const newEntry: PhotoelectricObservation = {
      id: `obs-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      metalName: calc.metal.name,
      workFunctionEV: calc.metal.workFunctionEV,
      frequencyHz: calc.frequencyHz,
      wavelengthNm: calc.wavelengthNm,
      photonEnergyEV: calc.photonEnergyEV,
      intensityPercent: params.intensityPercent,
      appliedVoltage: params.appliedVoltage,
      isEmissionPossible: calc.isEmissionPossible,
      maxKineticEnergyEV: calc.maxKineticEnergyEV,
      stoppingPotentialVolts: calc.stoppingPotentialVolts,
      photocurrentMicroAmps: calc.photocurrentMicroAmps,
      notes: customNote.trim() || (calc.isEmissionPossible ? 'Emission active' : 'Sub-threshold: no emission'),
    };

    saveObservations([newEntry, ...observations]);
    setCustomNote('');
  };

  // Delete single observation
  const handleDeleteObservation = (id: string) => {
    saveObservations(observations.filter((o) => o.id !== id));
  };

  // Clear all
  const handleClearAll = () => {
    saveObservations([]);
    setShowClearConfirm(false);
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (observations.length === 0) return;

    const headers = [
      'Timestamp',
      'Metal',
      'Work Function (eV)',
      'Frequency (Hz)',
      'Wavelength (nm)',
      'Photon Energy (eV)',
      'Intensity (%)',
      'Applied Voltage (V)',
      'Emission Occurred',
      'K_max (eV)',
      'Stopping Potential (V)',
      'Photocurrent (uA)',
      'Observations & Notes',
    ];

    const rows = observations.map((o) => [
      `"${o.timestamp}"`,
      `"${o.metalName}"`,
      o.workFunctionEV.toFixed(2),
      o.frequencyHz.toExponential(4),
      o.wavelengthNm.toFixed(1),
      o.photonEnergyEV.toFixed(3),
      o.intensityPercent,
      o.appliedVoltage.toFixed(2),
      o.isEmissionPossible ? 'YES' : 'NO',
      o.maxKineticEnergyEV.toFixed(3),
      o.stoppingPotentialVolts.toFixed(3),
      o.photocurrentMicroAmps.toFixed(2),
      `"${(o.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Photoelectric_Lab_Data_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#10243D] rounded-xl border border-[#29415F] p-4 sm:p-5 shadow-2xl space-y-4 text-[#EAF2FF]">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#29415F] pb-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-[#38BDF8]" />
          <div>
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#EAF2FF]">
              Experiment Observation Log & CSV Export
            </h2>
            <p className="text-[11px] text-[#9FB3CC]">
              Capture live experimental trials into local storage and export raw data for spreadsheet analysis.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {observations.length > 0 && (
            <>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#34D399] hover:bg-[#059669] text-[#071426] transition-colors cursor-pointer shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#FB7185] hover:bg-[#FB7185]/20 border border-[#FB7185]/40 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Log</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Confirmation Modal / Banner for Clear */}
      {showClearConfirm && (
        <div className="p-3 bg-[#FB7185]/15 border border-[#FB7185]/40 rounded-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#FB7185]">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Are you sure you want to delete all recorded observations? This action cannot be undone.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearAll}
              className="px-2.5 py-1 text-xs font-bold rounded bg-[#FB7185] text-[#071426] hover:bg-[#E11D48] transition-colors cursor-pointer"
            >
              Yes, Clear All
            </button>
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-2.5 py-1 text-xs font-semibold rounded bg-[#142B47] text-[#9FB3CC] hover:text-[#EAF2FF] cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Input Row for New Observation */}
      <div className="flex flex-col sm:flex-row items-center gap-2 bg-[#142B47] p-3 rounded-xl border border-[#29415F]">
        <input
          type="text"
          value={customNote}
          onChange={(e) => setCustomNote(e.target.value)}
          placeholder="Enter student observation or hypothesis notes (optional)..."
          className="flex-1 bg-[#071426] border border-[#29415F] rounded-lg px-3 py-2 text-xs text-[#EAF2FF] placeholder-[#9FB3CC]/60 focus:outline-none focus:border-[#38BDF8]"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleRecordObservation();
          }}
        />

        <button
          onClick={handleRecordObservation}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-[#38BDF8] hover:bg-[#0284C7] text-[#071426] transition-colors cursor-pointer shadow-md whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Record Trial Snapshot</span>
        </button>
      </div>

      {/* Table of Observations */}
      {observations.length === 0 ? (
        <div className="text-center py-8 bg-[#142B47]/50 border border-[#29415F] rounded-xl space-y-2">
          <FileSpreadsheet className="w-8 h-8 text-[#9FB3CC] mx-auto opacity-60" />
          <div className="text-xs text-[#9FB3CC]">
            No observations recorded yet. Click <strong>"Record Trial Snapshot"</strong> to log the current simulation state.
          </div>
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-xl border border-[#29415F]">
          <table className="w-full text-left text-xs font-mono select-none">
            <thead className="bg-[#142B47] text-[#9FB3CC] uppercase tracking-wider text-[10px] border-b border-[#29415F]">
              <tr>
                <th className="p-2.5">Time</th>
                <th className="p-2.5">Metal</th>
                <th className="p-2.5">φ (eV)</th>
                <th className="p-2.5">f (Hz)</th>
                <th className="p-2.5">λ (nm)</th>
                <th className="p-2.5">E_ph (eV)</th>
                <th className="p-2.5">Intensity</th>
                <th className="p-2.5">Voltage</th>
                <th className="p-2.5">Emitted?</th>
                <th className="p-2.5">K_max (eV)</th>
                <th className="p-2.5">V_stop (V)</th>
                <th className="p-2.5">Current</th>
                <th className="p-2.5">Notes</th>
                <th className="p-2.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#29415F]/50 bg-[#071426]">
              {observations.map((obs) => (
                <tr key={obs.id} className="hover:bg-[#142B47]/40 transition-colors">
                  <td className="p-2.5 text-[#9FB3CC]">{obs.timestamp}</td>
                  <td className="p-2.5 text-[#EAF2FF] font-bold">{obs.metalName}</td>
                  <td className="p-2.5 text-[#FBBF24]">{obs.workFunctionEV.toFixed(2)}</td>
                  <td className="p-2.5 text-[#38BDF8]">{(obs.frequencyHz / 1e14).toFixed(2)}e14</td>
                  <td className="p-2.5 text-[#EAF2FF]">{obs.wavelengthNm.toFixed(0)}</td>
                  <td className="p-2.5 text-[#38BDF8] font-semibold">{obs.photonEnergyEV.toFixed(2)}</td>
                  <td className="p-2.5 text-[#FBBF24]">{obs.intensityPercent}%</td>
                  <td className="p-2.5 font-semibold">
                    {obs.appliedVoltage >= 0 ? `+${obs.appliedVoltage.toFixed(2)} V` : `${obs.appliedVoltage.toFixed(2)} V`}
                  </td>
                  <td className="p-2.5">
                    {obs.isEmissionPossible ? (
                      <span className="text-[#34D399] font-bold">YES</span>
                    ) : (
                      <span className="text-[#FB7185] font-bold">NO</span>
                    )}
                  </td>
                  <td className="p-2.5 text-[#34D399] font-bold">{obs.maxKineticEnergyEV.toFixed(2)}</td>
                  <td className="p-2.5 text-[#FB7185]">{obs.stoppingPotentialVolts.toFixed(2)}</td>
                  <td className="p-2.5 text-[#34D399] font-bold">{obs.photocurrentMicroAmps.toFixed(2)} µA</td>
                  <td className="p-2.5 text-[#9FB3CC] max-w-[150px] truncate" title={obs.notes}>
                    {obs.notes}
                  </td>
                  <td className="p-2.5 text-center">
                    <button
                      onClick={() => handleDeleteObservation(obs.id)}
                      className="p-1 text-[#9FB3CC] hover:text-[#FB7185] rounded transition-colors cursor-pointer"
                      title="Delete row"
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
