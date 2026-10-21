/**
 * EQUATION 1 — Gas Observations Table & CSV Exporter
 * LocalStorage persistence, record management, and RFC 4180-compliant CSV export.
 */

import React, { useState, useEffect } from 'react';
import {
  KineticParameters,
  KineticResults,
  ObservationRecord,
} from '../../physics/kinetic/types';
import {
  Table,
  Plus,
  Trash2,
  Download,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

interface GasObservationsTableProps {
  params: KineticParameters;
  results: KineticResults;
}

const STORAGE_KEY = 'equation1_kinetic_observations_v1';

export const GasObservationsTable: React.FC<GasObservationsTableProps> = ({
  params,
  results,
}) => {
  const [observations, setObservations] = useState<ObservationRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse stored observations, initializing empty.', e);
    }
    return [];
  });

  const [confirmClear, setConfirmClear] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(observations));
    } catch (e) {
      console.warn('Failed to save observations to localStorage:', e);
    }
  }, [observations]);

  const handleAddObservation = () => {
    const nextNumber = observations.length > 0 ? observations[observations.length - 1].experimentNumber + 1 : 1;
    const newRecord: ObservationRecord = {
      id: `obs_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      experimentNumber: nextNumber,
      timestamp: new Date().toLocaleTimeString(),
      gasType: results.gasSpecies.name,
      gasFormula: results.gasSpecies.formula,
      temperatureK: Math.round(params.temperatureK),
      volumeL: parseFloat(params.volumeLiters.toFixed(2)),
      moles: parseFloat(params.moles.toFixed(2)),
      pressureKPa: parseFloat(results.pressureKPa.toFixed(2)),
      vMostProbableMs: Math.round(results.vMostProbable),
      vMeanMs: Math.round(results.vMean),
      vRmsMs: Math.round(results.vRms),
      avgKineticEnergyJ: results.avgKineticEnergyJ.toExponential(3),
    };

    setObservations((prev) => [...prev, newRecord]);
    setToastMessage(`Experiment #${nextNumber} recorded successfully!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleRemoveObservation = (id: string) => {
    setObservations((prev) => prev.filter((o) => o.id !== id));
  };

  const handleClearAll = () => {
    setObservations([]);
    setConfirmClear(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  };

  const handleExportCSV = () => {
    if (observations.length === 0) return;

    const headers = [
      'Experiment #',
      'Timestamp',
      'Gas Species',
      'Formula',
      'Temperature (K)',
      'Volume (L)',
      'Amount (mol)',
      'Pressure (kPa)',
      'Most Probable Speed (m/s)',
      'Mean Speed (m/s)',
      'RMS Speed (m/s)',
      'Avg KE per molecule (J)',
    ];

    const escapeCell = (val: string | number) => {
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = observations.map((o) => [
      o.experimentNumber,
      o.timestamp,
      o.gasType,
      o.gasFormula,
      o.temperatureK,
      o.volumeL,
      o.moles,
      o.pressureKPa,
      o.vMostProbableMs,
      o.vMeanMs,
      o.vRmsMs,
      o.avgKineticEnergyJ,
    ]);

    const csvContent = [
      headers.map(escapeCell).join(','),
      ...rows.map((r) => r.map(escapeCell).join(',')),
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `kinetic_theory_gas_observations_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#102740] rounded-xl border border-[#29445F] p-5 shadow-xl space-y-4 text-[#F1F5F9]">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#29445F] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
            <Table className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F1F5F9] tracking-wide flex items-center gap-2">
              <span>Record Your Experiment</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#16334F] text-[#38BDF8] border border-[#29445F]">
                {observations.length} {observations.length === 1 ? 'entry' : 'entries'}
              </span>
            </h3>
            <p className="text-[11px] text-[#AFC2D8]">
              Log physical states, analyze trends, and export offline CSV datasets
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Add Observation Button */}
          <button
            onClick={handleAddObservation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-[#071426] text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Observation</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            disabled={observations.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16334F] hover:bg-[#29445F] text-[#F1F5F9] text-xs font-semibold border border-[#29445F] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          {/* Clear All Button */}
          {observations.length > 0 && (
            <>
              {confirmClear ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleClearAll}
                    className="px-2.5 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
                  >
                    Confirm Clear
                  </button>
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="px-2 py-1.5 rounded bg-[#16334F] text-[#AFC2D8] hover:text-white text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmClear(true)}
                  className="p-1.5 rounded-lg bg-[#16334F] hover:bg-rose-950/40 text-rose-400 border border-[#29445F] text-xs transition-colors cursor-pointer"
                  title="Clear all observations"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Toast Confirmation */}
      {toastMessage && (
        <div className="p-2.5 rounded-lg bg-[#16334F] border border-[#38BDF8] text-xs text-[#38BDF8] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Observation Table */}
      {observations.length === 0 ? (
        <div className="py-10 text-center rounded-xl border border-dashed border-[#29445F] bg-[#071426] p-6 space-y-2">
          <Table className="w-8 h-8 text-[#AFC2D8]/40 mx-auto" />
          <div className="text-xs font-semibold text-[#AFC2D8]">
            No observations recorded yet.
          </div>
          <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
            Adjust the temperature, volume, moles, or gas species, then click{' '}
            <strong className="text-[#38BDF8]">"Add Observation"</strong> above to capture the thermodynamic state.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#29445F] bg-[#071426]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#29445F] bg-[#0B1F36] text-[11px] font-mono text-[#AFC2D8]">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Gas</th>
                <th className="py-2.5 px-3">T (K)</th>
                <th className="py-2.5 px-3">V (L)</th>
                <th className="py-2.5 px-3">n (mol)</th>
                <th className="py-2.5 px-3">P (kPa)</th>
                <th className="py-2.5 px-3">v_mp (m/s)</th>
                <th className="py-2.5 px-3">v_mean (m/s)</th>
                <th className="py-2.5 px-3">v_rms (m/s)</th>
                <th className="py-2.5 px-3">⟨E_k⟩ (J)</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#29445F]/50 font-mono text-slate-200">
              {observations.map((o) => (
                <tr
                  key={o.id}
                  className="hover:bg-[#16334F]/40 transition-colors"
                >
                  <td className="py-2 px-3 text-[#38BDF8] font-bold">
                    {o.experimentNumber}
                  </td>
                  <td className="py-2 px-3">
                    <span className="font-sans font-bold text-white">
                      {o.gasType}
                    </span>{' '}
                    <span className="text-[#AFC2D8]">({o.gasFormula})</span>
                  </td>
                  <td className="py-2 px-3 text-[#FB923C] font-semibold">
                    {o.temperatureK}
                  </td>
                  <td className="py-2 px-3">{o.volumeL}</td>
                  <td className="py-2 px-3">{o.moles}</td>
                  <td className="py-2 px-3 text-[#A78BFA] font-bold">
                    {o.pressureKPa}
                  </td>
                  <td className="py-2 px-3 text-[#FBBF24]">
                    {o.vMostProbableMs}
                  </td>
                  <td className="py-2 px-3 text-[#4ADE80]">
                    {o.vMeanMs}
                  </td>
                  <td className="py-2 px-3 text-[#38BDF8] font-bold">
                    {o.vRmsMs}
                  </td>
                  <td className="py-2 px-3 text-[10px] text-slate-400">
                    {o.avgKineticEnergyJ}
                  </td>
                  <td className="py-2 px-3 text-right">
                    <button
                      onClick={() => handleRemoveObservation(o.id)}
                      className="p-1 rounded text-[#AFC2D8] hover:text-rose-400 hover:bg-rose-950/30 cursor-pointer"
                      title="Delete record"
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
