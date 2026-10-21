/**
 * EQUATION 1 — Wave Interference Experiment Workbench & Observation Logger
 * 7 structured guided experiments, parameter presets, observation recording,
 * and CSV data export without a backend.
 */

import React, { useState } from 'react';
import {
  WaveExperimentMode,
  WaveSuperpositionParameters,
  TwoSourceParameters,
  ObservationLogEntry,
} from '../../physics/waves/types';
import {
  FlaskConical,
  Play,
  ClipboardList,
  Download,
  Trash2,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

interface WaveWorkbenchProps {
  mode: WaveExperimentMode;
  superpositionParams: WaveSuperpositionParameters;
  twoSourceParams: TwoSourceParameters;
  onApplySuperposition: (params: Partial<WaveSuperpositionParameters>) => void;
  onApplyTwoSource: (params: Partial<TwoSourceParameters>) => void;
  onSelectMode: (mode: WaveExperimentMode) => void;
  simTime: number;
}

interface GuidedExperiment {
  id: number;
  title: string;
  targetMode: WaveExperimentMode;
  objective: string;
  setupSummary: string;
  parametersToAdjust: string;
  whatToObserve: string;
  equations: string;
  explanation: string;
  applyAction: () => void;
}

export const WaveWorkbench: React.FC<WaveWorkbenchProps> = ({
  mode,
  superpositionParams,
  twoSourceParams,
  onApplySuperposition,
  onApplyTwoSource,
  onSelectMode,
  simTime,
}) => {
  const [selectedExpId, setSelectedExpId] = useState(1);
  const [logs, setLogs] = useState<ObservationLogEntry[]>([]);
  const [userNote, setUserNote] = useState('');

  // 7 Guided Experiments
  const experiments: GuidedExperiment[] = [
    {
      id: 1,
      title: 'Experiment 1: Pure Constructive Interference',
      targetMode: 'superposition',
      objective: 'Observe maximum wave reinforcement when two identical waves are in phase (Δφ = 0°).',
      setupSummary: 'A₁ = 1.0 m, A₂ = 1.0 m, λ₁ = λ₂ = 3.0 m, f₁ = f₂ = 1.0 Hz, Δφ = 0°',
      parametersToAdjust: 'Verify that A_R doubles to exactly 2.0 m and energy scales quadratically with amplitude.',
      whatToObserve: 'Crests coincide with crests and troughs with troughs; resultant wave is a pure amplified wave with amplitude A_R = 2A.',
      equations: 'A_R = A₁ + A₂ = 2A, \\quad \\Delta\\phi = 2\\pi n',
      explanation: 'Because both waves reach their peaks at the identical position and time, their displacements strictly add up at every single point.',
      applyAction: () => {
        onSelectMode('superposition');
        onApplySuperposition({
          wave1: { ...superpositionParams.wave1, amplitude: 1.0, wavelength: 3.0, frequency: 1.0, initialPhaseDeg: 0, direction: 'forward' },
          wave2: { ...superpositionParams.wave2, amplitude: 1.0, wavelength: 3.0, frequency: 1.0, initialPhaseDeg: 0, direction: 'forward' },
          sameMediumLocked: true,
          showResultant: true,
        });
      },
    },
    {
      id: 2,
      title: 'Experiment 2: Complete Destructive Interference',
      targetMode: 'superposition',
      objective: 'Demonstrate total cancellation when two equal-amplitude waves are exactly in anti-phase (Δφ = 180°).',
      setupSummary: 'A₁ = 1.0 m, A₂ = 1.0 m, λ₁ = λ₂ = 3.0 m, f₁ = f₂ = 1.0 Hz, Δφ = 180°',
      parametersToAdjust: 'Observe resultant wave line collapse to zero displacement across the entire medium.',
      whatToObserve: 'The resultant wave y_R(x,t) remains strictly flat at 0 at all times, despite both individual waves continuously propagating!',
      equations: 'A_R = |A₁ - A₂| = 0, \\quad \\Delta\\phi = (2n + 1)\\pi',
      explanation: 'Every crest of Wave 1 is exactly countered by an equal trough of Wave 2, resulting in complete destructive interference.',
      applyAction: () => {
        onSelectMode('superposition');
        onApplySuperposition({
          wave1: { ...superpositionParams.wave1, amplitude: 1.0, wavelength: 3.0, frequency: 1.0, initialPhaseDeg: 0, direction: 'forward' },
          wave2: { ...superpositionParams.wave2, amplitude: 1.0, wavelength: 3.0, frequency: 1.0, initialPhaseDeg: 180, direction: 'forward' },
          sameMediumLocked: true,
          showResultant: true,
        });
      },
    },
    {
      id: 3,
      title: 'Experiment 3: Changing Relative Phase Continuously',
      targetMode: 'superposition',
      objective: 'Investigate how continuously sweeping Δφ from 0° to 180° modulates resultant amplitude A_R.',
      setupSummary: 'A₁ = 1.0 m, A₂ = 1.0 m; adjust Δφ slider across 0°, 60°, 90°, 120°, 180°.',
      parametersToAdjust: 'Watch Graph C (A_R vs Δφ) and verify analytical curve matches resultant amplitude.',
      whatToObserve: 'At 90° (π/2 rad), A_R = √(1² + 1²) = √2 ≈ 1.414 m. At 120°, A_R = 1.0 m.',
      equations: 'A_R = \\sqrt{A_1^2 + A_2^2 + 2A_1A_2\\cos\\Delta\\phi}',
      explanation: 'Partial interference transitions smoothly between the constructive ceiling (2A) and destructive floor (0).',
      applyAction: () => {
        onSelectMode('superposition');
        onApplySuperposition({
          wave1: { ...superpositionParams.wave1, amplitude: 1.0, wavelength: 3.0, frequency: 1.0, initialPhaseDeg: 0 },
          wave2: { ...superpositionParams.wave2, amplitude: 1.0, wavelength: 3.0, frequency: 1.0, initialPhaseDeg: 90 },
          sameMediumLocked: true,
          showResultant: true,
        });
      },
    },
    {
      id: 4,
      title: 'Experiment 4: Effect of Source Separation (d)',
      targetMode: 'two-source',
      objective: 'Investigate how varying distance d between point sources S1 and S2 affects fringe angular width.',
      setupSummary: 'Two coherent sources in 2D space. Test d = 1.5 m, 3.0 m, and 5.0 m with λ = 1.0 m.',
      parametersToAdjust: 'Adjust Source Separation d slider and observe the density of nodal/antinodal hyperbolic fringes.',
      whatToObserve: 'As d increases, the number of interference fringes increases and they pack closer together (angular spacing θ ≈ λ/d shrinks).',
      equations: '\\sin\\theta_n = \\frac{n\\lambda}{d}, \\quad \\Delta\\theta \\approx \\frac{\\lambda}{d}',
      explanation: 'Larger separation creates a steeper path-difference gradient across space, producing more alternating fringes in the field.',
      applyAction: () => {
        onSelectMode('two-source');
        onApplyTwoSource({
          separation: 4.0,
          wavelength: 1.0,
          frequency: 1.5,
          sourcePhase1Deg: 0,
          sourcePhase2Deg: 0,
          showConstructiveHyperbolas: true,
          showDestructiveHyperbolas: true,
          renderMode: 'field',
        });
      },
    },
    {
      id: 5,
      title: 'Experiment 5: Effect of Wavelength (λ)',
      targetMode: 'two-source',
      objective: 'Investigate how changing wavelength affects the spacing of the interference fringes.',
      setupSummary: 'Fix d = 3.0 m. Test λ = 0.5 m, 1.0 m, 1.8 m.',
      parametersToAdjust: 'Adjust Wavelength slider and observe how fringe lines spread out.',
      whatToObserve: 'Longer wavelengths spread fringes far apart; shorter wavelengths create fine, closely spaced fringes.',
      equations: '\\text{Fringe Spacing } w \\approx \\frac{\\lambda L}{d}',
      explanation: 'A longer wavelength requires a larger spatial distance to accumulate a full path difference of λ or λ/2.',
      applyAction: () => {
        onSelectMode('two-source');
        onApplyTwoSource({
          separation: 3.0,
          wavelength: 1.8,
          frequency: 1.0,
          sourcePhase1Deg: 0,
          sourcePhase2Deg: 0,
          showConstructiveHyperbolas: true,
          showDestructiveHyperbolas: true,
          renderMode: 'field',
        });
      },
    },
    {
      id: 6,
      title: 'Experiment 6: Equal vs. Unequal Amplitudes',
      targetMode: 'superposition',
      objective: 'Demonstrate that destructive interference cannot completely cancel when amplitudes are unequal.',
      setupSummary: 'Set A₁ = 1.6 m and A₂ = 0.6 m with opposite phase (Δφ = 180°).',
      parametersToAdjust: 'Observe minimum resultant amplitude floor A_min = |A₁ - A₂| = 1.0 m.',
      whatToObserve: 'Even at 180° out of phase, an oscillation with amplitude 1.0 m persists (incomplete destructive interference).',
      equations: 'A_{\\text{min}} = |A_1 - A_2| > 0 \\quad (A_1 \\neq A_2)',
      explanation: 'Complete zero cancellation requires both opposite phase AND identical wave amplitudes.',
      applyAction: () => {
        onSelectMode('superposition');
        onApplySuperposition({
          wave1: { ...superpositionParams.wave1, amplitude: 1.6, wavelength: 3.0, frequency: 1.0, initialPhaseDeg: 0 },
          wave2: { ...superpositionParams.wave2, amplitude: 0.6, wavelength: 3.0, frequency: 1.0, initialPhaseDeg: 180 },
          sameMediumLocked: true,
          showResultant: true,
        });
      },
    },
    {
      id: 7,
      title: 'Experiment 7: Initial Source Phase Shift Steering',
      targetMode: 'two-source',
      objective: 'Investigate how an initial phase difference between sources shifts and steers the interference pattern.',
      setupSummary: 'Set S1 and S2 with Δφ₀ = 0°, 90°, 180°.',
      parametersToAdjust: 'Adjust Source Phase Shift slider in Two-Source mode.',
      whatToObserve: 'When Δφ₀ = 180°, the central axis (y = 0) becomes a destructive dark nodal line instead of a bright antinode!',
      equations: '\\Delta\\Phi = k\\Delta r + \\Delta\\phi_0 \\implies \\text{Central axis } (\\Delta r = 0) \\text{ has } \\Delta\\Phi = \\Delta\\phi_0',
      explanation: 'Phased array steering: introducing a time/phase delay between sources shifts the angular position of the interference lobes.',
      applyAction: () => {
        onSelectMode('two-source');
        onApplyTwoSource({
          separation: 3.0,
          wavelength: 1.0,
          frequency: 1.5,
          sourcePhase1Deg: 0,
          sourcePhase2Deg: 180, // opposite phase
          showConstructiveHyperbolas: true,
          showDestructiveHyperbolas: true,
          renderMode: 'field',
        });
      },
    },
  ];

  const currentExp = experiments.find((e) => e.id === selectedExpId) || experiments[0];

  // Record an observation into state log
  const handleRecordObservation = () => {
    let summary = '';
    if (mode === 'superposition') {
      summary = `A1=${superpositionParams.wave1.amplitude}m, A2=${superpositionParams.wave2.amplitude}m, Δφ=${(superpositionParams.wave2.initialPhaseDeg - superpositionParams.wave1.initialPhaseDeg).toFixed(0)}°`;
    } else {
      summary = `d=${twoSourceParams.separation}m, λ=${twoSourceParams.wavelength}m, Probe=(${twoSourceParams.probePoint.x.toFixed(1)}, ${twoSourceParams.probePoint.y.toFixed(1)})`;
    }

    const newEntry: ObservationLogEntry = {
      id: String(Date.now()),
      timestamp: new Date().toLocaleTimeString(),
      experimentName: currentExp.title,
      mode,
      parametersSummary: summary,
      observedResult: currentExp.whatToObserve,
      notes: userNote.trim() || 'Verified expected theoretical prediction.',
    };

    setLogs((prev) => [newEntry, ...prev]);
    setUserNote('');
  };

  // Export logs to CSV
  const handleExportCSV = () => {
    if (logs.length === 0) return;
    const headers = ['Timestamp', 'Experiment', 'Mode', 'Parameters', 'Observed Result', 'Notes'];
    const rows = logs.map((l) => [
      `"${l.timestamp}"`,
      `"${l.experimentName}"`,
      `"${l.mode}"`,
      `"${l.parametersSummary}"`,
      `"${l.observedResult}"`,
      `"${l.notes.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `wave_interference_observations_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#090d16] border border-slate-800/90 rounded-xl p-4 sm:p-5 select-none space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold text-white tracking-wider uppercase font-mono">
            Experiment Workbench & Observation Logger
          </h2>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          7 Guided Investigations · Observation Log · CSV Export
        </span>
      </div>

      {/* 7 Experiment Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5 p-1 bg-[#07090e] rounded-lg border border-slate-800 text-xs font-medium">
        {experiments.map((exp) => (
          <button
            key={exp.id}
            onClick={() => setSelectedExpId(exp.id)}
            className={`py-2 px-1 text-center rounded-md transition-colors cursor-pointer truncate ${
              selectedExpId === exp.id
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title={exp.title}
          >
            Exp {exp.id}
          </button>
        ))}
      </div>

      {/* Selected Experiment Card */}
      <div className="p-4 rounded-lg bg-[#07090e] border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white">{currentExp.title}</h3>
            <p className="text-xs text-cyan-300 mt-0.5">{currentExp.objective}</p>
          </div>
          <button
            onClick={currentExp.applyAction}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-all shadow-sm cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Load & Run Experiment</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">What to observe:</span>
            <p className="text-slate-300 leading-relaxed">{currentExp.whatToObserve}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Theoretical explanation:</span>
            <p className="text-slate-400 leading-relaxed">{currentExp.explanation}</p>
          </div>
        </div>

        {/* Observation Input and Record CTA */}
        <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            placeholder="Add your experimental notes or observations here..."
            value={userNote}
            onChange={(e) => setUserNote(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs bg-[#090d16] border border-slate-700/80 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-full"
          />
          <button
            onClick={handleRecordObservation}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/40 rounded-md transition-colors cursor-pointer whitespace-nowrap w-full sm:w-auto justify-center"
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Record Observation</span>
          </button>
        </div>
      </div>

      {/* Observation Log Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 font-mono flex items-center gap-1.5">
            <span>Student Observation Log</span>
            <span className="text-slate-500">({logs.length} entries)</span>
          </span>
          <div className="flex items-center gap-2">
            {logs.length > 0 && (
              <>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 rounded transition-colors cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => setLogs([])}
                  className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 rounded transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </>
            )}
          </div>
        </div>

        {logs.length === 0 ? (
          <div className="p-4 bg-[#07090e] border border-slate-800 rounded-lg text-center text-xs text-slate-500 font-mono">
            No observations recorded yet. Click "Record Observation" above to log current simulation measurements.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-xs font-mono text-left">
              <thead className="bg-[#07090e] text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2 px-3">Time</th>
                  <th className="py-2 px-3">Experiment</th>
                  <th className="py-2 px-3">Parameters</th>
                  <th className="py-2 px-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-[#090d16]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40">
                    <td className="py-2 px-3 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-2 px-3 font-semibold text-white whitespace-nowrap">{log.experimentName}</td>
                    <td className="py-2 px-3 text-cyan-300">{log.parametersSummary}</td>
                    <td className="py-2 px-3 text-slate-300">{log.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
