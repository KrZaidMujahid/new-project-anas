/**
 * EQUATION 1 — Carnot Observation Table & CSV Export
 * Experimental logging tool allowing students to record thermodynamic trials,
 * annotate observations, and export raw data to standard scientific CSV format.
 */

import React, { useState } from 'react';
import { CarnotObservation, CarnotCycleResults, CarnotParameters } from '../../physics/carnot/types';
import { Table, Download, Trash2, Plus, FileSpreadsheet, Check } from 'lucide-react';

interface CarnotObservationTableProps {
  observations: CarnotObservation[];
  onAddObservation: (notes?: string) => void;
  onClearObservations: () => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

export const CarnotObservationTable: React.FC<CarnotObservationTableProps> = ({
  observations,
  onAddObservation,
  onClearObservations,
  onUpdateNotes,
}) => {
  const [noteInput, setNoteInput] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleRecord = () => {
    onAddObservation(noteInput.trim() || undefined);
    setNoteInput('');
  };

  const exportCsv = () => {
    if (observations.length === 0) return;

    const headers = [
      'Trial',
      'Timestamp',
      'T_Hot_K',
      'T_Cold_K',
      'Moles_n',
      'Initial_Volume_L',
      'Gas_Type',
      'Efficiency_Percent',
      'Heat_Absorbed_Q_H_J',
      'Heat_Rejected_Q_C_J',
      'Net_Work_W_net_J',
      'Notes',
    ];

    const rows = observations.map((obs) => [
      obs.experimentNumber,
      new Date(obs.timestamp).toISOString(),
      obs.tHotK,
      obs.tColdK,
      obs.moles,
      obs.initialVolumeL,
      obs.gasType,
      obs.efficiencyPercent.toFixed(2),
      obs.heatAbsorbedJ.toFixed(2),
      obs.heatRejectedJ.toFixed(2),
      obs.netWorkJ.toFixed(2),
      `"${(obs.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `carnot_engine_lab_trials_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  return (
    <div className="bg-[#102740] border border-[#29445F] rounded-xl p-5 shadow-xl flex flex-col gap-4">
      {/* Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#29445F]/70">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-[#38BDF8]" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Experimental Observation Log & CSV Export
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCsv}
            disabled={observations.length === 0}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              observations.length > 0
                ? 'bg-[#16334F] hover:bg-[#1E4369] text-white border border-[#38BDF8]/40'
                : 'bg-[#0B1F36] text-[#AFC2D8] border border-[#29445F] cursor-not-allowed opacity-50'
            }`}
          >
            {copiedNotification ? (
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

          {observations.length > 0 && (
            <button
              onClick={onClearObservations}
              className="p-1.5 rounded-lg bg-[#0B1F36] hover:bg-rose-950/40 text-[#AFC2D8] hover:text-rose-400 border border-[#29445F] transition-colors cursor-pointer"
              title="Clear all log entries"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Record Current Observation Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-lg bg-[#0B1F36] border border-[#29445F]">
        <input
          type="text"
          placeholder="Optional notes for this trial (e.g. Doubled T_H to test efficiency growth)..."
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleRecord()}
          className="flex-1 px-3 py-1.5 rounded bg-[#102740] border border-[#29445F] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#38BDF8]"
        />
        <button
          onClick={handleRecord}
          className="px-4 py-1.5 rounded-lg bg-[#38BDF8] hover:bg-[#0284C7] text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Record Trial</span>
        </button>
      </div>

      {/* Observations Table */}
      {observations.length === 0 ? (
        <div className="py-8 text-center text-xs text-[#AFC2D8] font-mono">
          No trials recorded yet. Adjust parameters above and click "Record Trial" to capture observations.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#29445F] text-[#AFC2D8] font-mono uppercase text-[10px] bg-[#0B1F36]/60">
                <th className="py-2.5 px-2.5">Trial</th>
                <th className="py-2.5 px-2.5 text-right">T_H (K)</th>
                <th className="py-2.5 px-2.5 text-right">T_C (K)</th>
                <th className="py-2.5 px-2.5 text-right">Moles</th>
                <th className="py-2.5 px-2.5 text-right">V_A (L)</th>
                <th className="py-2.5 px-2.5">Gas</th>
                <th className="py-2.5 px-2.5 text-right">Carnot η</th>
                <th className="py-2.5 px-2.5 text-right">Q_H (J)</th>
                <th className="py-2.5 px-2.5 text-right">Q_C (J)</th>
                <th className="py-2.5 px-2.5 text-right">W_net (J)</th>
                <th className="py-2.5 px-2.5">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#29445F]/50 font-mono">
              {observations.map((obs) => (
                <tr key={obs.id} className="hover:bg-[#16334F]/30 transition-colors">
                  <td className="py-2 px-2.5 font-bold text-white">#{obs.experimentNumber}</td>
                  <td className="py-2 px-2.5 text-right text-[#FB923C]">{obs.tHotK}</td>
                  <td className="py-2 px-2.5 text-right text-[#60A5FA]">{obs.tColdK}</td>
                  <td className="py-2 px-2.5 text-right text-slate-300">{obs.moles}</td>
                  <td className="py-2 px-2.5 text-right text-slate-300">{obs.initialVolumeL}</td>
                  <td className="py-2 px-2.5 text-[11px] capitalize text-[#AFC2D8]">{obs.gasType}</td>
                  <td className="py-2 px-2.5 text-right font-bold text-[#4ADE80]">
                    {obs.efficiencyPercent.toFixed(1)}%
                  </td>
                  <td className="py-2 px-2.5 text-right text-[#FB923C]">
                    {obs.heatAbsorbedJ.toFixed(0)}
                  </td>
                  <td className="py-2 px-2.5 text-right text-[#60A5FA]">
                    {obs.heatRejectedJ.toFixed(0)}
                  </td>
                  <td className="py-2 px-2.5 text-right font-bold text-white">
                    {obs.netWorkJ.toFixed(0)}
                  </td>
                  <td className="py-2 px-2.5 text-[11px] font-sans text-slate-300 max-w-[200px] truncate">
                    <input
                      type="text"
                      value={obs.notes || ''}
                      onChange={(e) => onUpdateNotes(obs.id, e.target.value)}
                      placeholder="Add note..."
                      className="w-full bg-transparent border-b border-transparent hover:border-[#29445F] focus:border-[#38BDF8] px-1 py-0.5 focus:outline-none text-xs"
                    />
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
