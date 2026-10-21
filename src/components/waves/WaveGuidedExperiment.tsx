/**
 * EQUATION 1 — Guided Laboratory Experiment: "Perform Your Own Experiment" (Section 9)
 * 6 structured experimental tasks with instructions, expected observations,
 * student observation entry inputs, task completion tracking, and persistent localStorage sync.
 */

import React, { useState, useEffect } from 'react';
import { TwoSourceParameters, PointInterferenceAnalysis, InterferenceVisualizationMode } from '../../physics/waves/types';
import { FlaskConical, CheckCircle2, Circle, ArrowRight, Save, RotateCcw } from 'lucide-react';

interface WaveGuidedExperimentProps {
  currentParams: TwoSourceParameters;
  analysis: PointInterferenceAnalysis;
  onApplyTaskPreset: (params: Partial<TwoSourceParameters>, mode?: InterferenceVisualizationMode) => void;
}

interface GuidedTaskItem {
  id: number;
  title: string;
  instructions: string;
  expectedObservation: string;
  presetAction: {
    params: Partial<TwoSourceParameters>;
    mode?: InterferenceVisualizationMode;
  };
}

const GUIDED_TASKS: GuidedTaskItem[] = [
  {
    id: 1,
    title: 'Task 1: In-Phase Interference Pattern (Δφ₀ = 0°)',
    instructions:
      'Set initial phase difference Δφ₀ to 0°. Observe the central perpendicular bisector axis (y = 0).',
    expectedObservation:
      'The central line is a bright, stable antinodal maximum (n = 0) where Δr = 0 and resultant amplitude doubles to 2A.',
    presetAction: {
      params: { phaseDifferenceDeg: 0, sourcePhase1Deg: 0, sourcePhase2Deg: 0, wavelength: 1.0, separation: 2.0 },
      mode: 'two-source',
    },
  },
  {
    id: 2,
    title: 'Task 2: Anti-Phase Source Inversion (Δφ₀ = 180°)',
    instructions:
      'Change the initial phase difference to 180°. Observe what happens to the central axis.',
    expectedObservation:
      'The central maximum vanishes and converts into a stationary destructive nodal line of zero amplitude!',
    presetAction: {
      params: { phaseDifferenceDeg: 180, sourcePhase1Deg: 0, sourcePhase2Deg: 180 },
      mode: 'destructive',
    },
  },
  {
    id: 3,
    title: 'Task 3: Wavelength vs Fringe Spacing',
    instructions:
      'Increase the wavelength from 0.8 m to 2.5 m. Watch the distance between adjacent bright fringes.',
    expectedObservation:
      'Fringes spread out significantly. Greater wavelength λ results in wider fringe separation β ∝ λ.',
    presetAction: {
      params: { wavelength: 2.5, frequency: 1.2 },
      mode: 'intensity',
    },
  },
  {
    id: 4,
    title: 'Task 4: Source Separation Geometry',
    instructions:
      'Change source distance d from 1.0 m to 4.0 m. Observe the angular density of the interference pattern.',
    expectedObservation:
      'As separation d increases, the hyperbolic fringes become closely packed together with many more visible nodal orders.',
    presetAction: {
      params: { separation: 4.0, wavelength: 1.0 },
      mode: 'two-source',
    },
  },
  {
    id: 5,
    title: 'Task 5: Measure a Constructive Point',
    instructions:
      'Click on any bright yellow fringe or on the central line to position Point P on a constructive antinode. Record Δr, Δφ, and resultant amplitude.',
    expectedObservation:
      'Path difference Δr is an integer multiple of λ (e.g. 0.00λ, 1.00λ), and resultant amplitude A_r ≈ 2.0 a.u.',
    presetAction: {
      params: { probePoint: { x: 3.5, y: 0.0 } },
      mode: 'constructive',
    },
  },
  {
    id: 6,
    title: 'Task 6: Measure a Destructive Point',
    instructions:
      'Click on a dark blue/black nodal zone to place Point P on a destructive node. Compare amplitude with Task 5.',
    expectedObservation:
      'Path difference Δr is a half-integer multiple of λ (e.g. 0.50λ, 1.50λ). The resultant amplitude drops toward 0.',
    presetAction: {
      params: { probePoint: { x: 3.0, y: 0.82 } },
      mode: 'destructive',
    },
  },
];

const STORAGE_KEY = 'equation1_wave_guided_experiment_progress_v1';

export const WaveGuidedExperiment: React.FC<WaveGuidedExperimentProps> = ({
  currentParams,
  analysis,
  onApplyTaskPreset,
}) => {
  const [taskNotes, setTaskNotes] = useState<Record<number, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).notes || {};
    } catch {
      // ignore
    }
    return {};
  });

  const [completedTasks, setCompletedTasks] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).completed || {};
    } catch {
      // ignore
    }
    return {};
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ notes: taskNotes, completed: completedTasks })
      );
    } catch {
      // ignore
    }
  }, [taskNotes, completedTasks]);

  const handleNoteChange = (taskId: number, value: string) => {
    setTaskNotes((prev) => ({ ...prev, [taskId]: value }));
  };

  const handleToggleComplete = (taskId: number) => {
    setCompletedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const handleAutoRecordCurrent = (taskId: number) => {
    const formatted = `Recorded at (${currentParams.probePoint.x.toFixed(2)}m, ${currentParams.probePoint.y.toFixed(2)}m): Δr = ${analysis.pathDifference.toFixed(3)}m (${analysis.pathDifferenceInWavelengths.toFixed(2)}λ), Δφ = ${analysis.effectivePhaseDiffDeg.toFixed(1)}°, Ar = ${analysis.resultantAmplitude.toFixed(2)} a.u. [${analysis.classification}]`;
    setTaskNotes((prev) => ({ ...prev, [taskId]: formatted }));
  };

  const handleResetProgress = () => {
    setTaskNotes({});
    setCompletedTasks({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / GUIDED_TASKS.length) * 100);

  return (
    <div className="bg-[#101D30] border border-slate-800 rounded-xl p-4 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <FlaskConical className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Perform Your Own Experiment (Guided Lab)
            </h2>
            <p className="text-[11px] text-slate-400">
              Complete the sequence of 6 structured investigation tasks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-emerald-300 font-bold">
              {completedCount}/{GUIDED_TASKS.length} ({progressPercent}%)
            </span>
          </div>

          <button
            onClick={handleResetProgress}
            className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title="Reset experimental progress"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {GUIDED_TASKS.map((task) => {
          const isDone = !!completedTasks[task.id];
          return (
            <div
              key={task.id}
              className={`p-3.5 rounded-lg border transition-all ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/40'
                  : 'bg-[#07111F] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleComplete(task.id)}
                      className="cursor-pointer text-slate-400 hover:text-emerald-400 transition-colors"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                    <span className={`text-xs font-bold ${isDone ? 'text-emerald-300' : 'text-white'}`}>
                      {task.title}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 pl-6 leading-relaxed">
                    {task.instructions}
                  </p>

                  <div className="pl-6 pt-1 text-[11px] text-cyan-400/90 italic">
                    Expected observation: {task.expectedObservation}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 sm:self-start">
                  <button
                    onClick={() =>
                      onApplyTaskPreset(task.presetAction.params, task.presetAction.mode)
                    }
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 rounded-md transition-colors cursor-pointer"
                  >
                    <span>Load Setup</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => handleToggleComplete(task.id)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
                    }`}
                  >
                    {isDone ? 'Completed' : 'Mark Complete'}
                  </button>
                </div>
              </div>

              {/* Student Result Field */}
              <div className="pl-6 pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  placeholder="Record your observation or measurement here..."
                  value={taskNotes[task.id] || ''}
                  onChange={(e) => handleNoteChange(task.id, e.target.value)}
                  className="flex-1 px-2.5 py-1.5 text-xs bg-[#101D30] border border-slate-700 rounded text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />

                {(task.id === 5 || task.id === 6) && (
                  <button
                    onClick={() => handleAutoRecordCurrent(task.id)}
                    className="px-2.5 py-1.5 text-[11px] font-mono font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/30 rounded transition-colors cursor-pointer shrink-0"
                    title="Insert current measurement from Observation Point P"
                  >
                    Auto-Fill Current P
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
