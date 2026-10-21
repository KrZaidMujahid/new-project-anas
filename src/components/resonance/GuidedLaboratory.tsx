/**
 * EQUATION 1 — Guided Student Laboratory: "Perform Your Own Experiment" (Section 15)
 * 5 structured resonance activities with instructions, expected observations,
 * auto-fill buttons, student observation entry inputs, task completion tracking, and persistent localStorage sync.
 */

import React, { useState, useEffect } from 'react';
import { ResonanceParameters, OscillatorDerivedValues, ResonanceVisualizationMode } from '../../physics/resonance/types';
import { FlaskConical, CheckCircle2, Circle, ArrowRight, RotateCcw } from 'lucide-react';

interface GuidedLaboratoryProps {
  currentParams: ResonanceParameters;
  derived: OscillatorDerivedValues;
  onApplyActivitySetup: (params: Partial<ResonanceParameters>, mode?: ResonanceVisualizationMode) => void;
}

interface ActivityItem {
  id: number;
  title: string;
  instructions: string[];
  expectedObservation: string;
  setupParams: Partial<ResonanceParameters>;
  targetMode?: ResonanceVisualizationMode;
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: 1,
    title: 'Activity 1: Find Resonance (Peak Amplitude)',
    instructions: [
      '1. Start with the default mass (1.0 kg) and spring constant (50 N/m).',
      '2. Note the natural frequency f₀ = 1.125 Hz.',
      '3. Slowly adjust the driving frequency slider toward 1.125 Hz.',
      '4. Observe the dramatic growth in steady-state amplitude.',
      '5. Record the frequency where maximum amplitude occurs.',
    ],
    expectedObservation:
      'The steady-state amplitude reaches its peak at f_peak ≈ 1.12 Hz, multiplying more than 10-fold compared to static displacement!',
    setupParams: { mass: 1.0, springConstant: 50, dampingCoefficient: 0.4, drivingFrequencyHz: 0.5 },
    targetMode: 'below-resonance',
  },
  {
    id: 2,
    title: 'Activity 2: Effect of Damping on Peak Height & Width',
    instructions: [
      '1. Set a low damping coefficient (c = 0.15 N·s/m).',
      '2. Observe the tall, sharp resonance curve.',
      '3. Increase the damping coefficient to c = 2.0 N·s/m.',
      '4. Compare the peak amplitude and curve bandwidth.',
    ],
    expectedObservation:
      'Stronger damping flattens and broadens the peak, lowering Q and dissipating energy faster.',
    setupParams: { mass: 1.0, springConstant: 50, dampingCoefficient: 0.15, drivingFrequencyHz: 1.125 },
    targetMode: 'low-damping',
  },
  {
    id: 3,
    title: 'Activity 3: Change the Mass (Inertia Scaling)',
    instructions: [
      '1. Keep spring constant fixed at k = 50 N/m.',
      '2. Increase mass from 1.0 kg to 3.0 kg.',
      '3. Calculate the new natural frequency: f₀ = (1/2π)√(50/3) ≈ 0.65 Hz.',
      '4. Re-tune driving frequency to find the shifted resonance peak.',
    ],
    expectedObservation:
      'Greater mass adds inertia, shifting the resonant peak to a lower frequency (f₀ ∝ 1/√m).',
    setupParams: { mass: 3.0, springConstant: 50, dampingCoefficient: 0.5, drivingFrequencyHz: 0.65 },
    targetMode: 'at-resonance',
  },
  {
    id: 4,
    title: 'Activity 4: Change the Spring Constant (Stiffness)',
    instructions: [
      '1. Keep mass fixed at m = 1.0 kg.',
      '2. Increase spring constant to k = 150 N/m.',
      '3. Calculate the new natural frequency: f₀ = (1/2π)√(150/1) ≈ 1.95 Hz.',
      '4. Observe that the stiffer spring accelerates the oscillation rate.',
    ],
    expectedObservation:
      'A stiffer spring increases restoring force, shifting resonance upward (f₀ ∝ √k).',
    setupParams: { mass: 1.0, springConstant: 150, dampingCoefficient: 0.5, drivingFrequencyHz: 1.95 },
    targetMode: 'at-resonance',
  },
  {
    id: 5,
    title: 'Activity 5: Observe the Phase Lag Transition',
    instructions: [
      '1. Set driving frequency well below resonance (f_d = 0.4 Hz). Notice φ ≈ 0° (in-phase).',
      '2. Tune f_d exactly to natural frequency (1.125 Hz). Observe φ ≈ 90° (velocity in-phase with force).',
      '3. Increase f_d well above resonance (3.0 Hz). Observe φ approaching 180° (anti-phase).',
    ],
    expectedObservation:
      'Phase lag smoothly shifts across 180 degrees, passing through 90° at exact resonance.',
    setupParams: { mass: 1.0, springConstant: 50, dampingCoefficient: 0.5, drivingFrequencyHz: 0.4 },
    targetMode: 'below-resonance',
  },
];

const STORAGE_KEY = 'equation1_resonance_guided_lab_v1';

export const GuidedLaboratory: React.FC<GuidedLaboratoryProps> = ({
  currentParams,
  derived,
  onApplyActivitySetup,
}) => {
  const [studentNotes, setStudentNotes] = useState<Record<number, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).notes || {};
    } catch {
      // ignore
    }
    return {};
  });

  const [completedActivities, setCompletedActivities] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).completed || {};
    } catch {
      // ignore
    }
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ notes: studentNotes, completed: completedActivities })
      );
    } catch {
      // ignore
    }
  }, [studentNotes, completedActivities]);

  const handleNoteChange = (id: number, val: string) => {
    setStudentNotes((prev) => ({ ...prev, [id]: val }));
  };

  const handleToggleComplete = (id: number) => {
    setCompletedActivities((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAutoRecord = (id: number) => {
    const formatted = `Recorded: f_d = ${currentParams.drivingFrequencyHz.toFixed(2)} Hz, f₀ = ${derived.naturalFrequencyHz.toFixed(2)} Hz, A = ${derived.steadyStateAmplitude.toFixed(3)} m, Phase = ${derived.steadyStatePhaseLagDeg.toFixed(1)}°, Q = ${derived.qualityFactor ? derived.qualityFactor.toFixed(1) : '∞'}`;
    setStudentNotes((prev) => ({ ...prev, [id]: formatted }));
  };

  const handleResetProgress = () => {
    setStudentNotes({});
    setCompletedActivities({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const completedCount = Object.values(completedActivities).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / ACTIVITIES.length) * 100);

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
              Perform Your Own Experiment (Guided Activities)
            </h2>
            <p className="text-[11px] text-slate-400">
              5 hands-on investigations with data recording and progress tracking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-emerald-300 font-bold">
              {completedCount}/{ACTIVITIES.length} ({progressPercent}%)
            </span>
          </div>

          <button
            onClick={handleResetProgress}
            className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title="Reset all written records"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Activities List */}
      <div className="space-y-3">
        {ACTIVITIES.map((act) => {
          const isDone = !!completedActivities[act.id];
          return (
            <div
              key={act.id}
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
                      onClick={() => handleToggleComplete(act.id)}
                      className="cursor-pointer text-slate-400 hover:text-emerald-400 transition-colors"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                    <span className={`text-xs font-bold ${isDone ? 'text-emerald-300' : 'text-white'}`}>
                      {act.title}
                    </span>
                  </div>

                  <ul className="pl-6 space-y-0.5 text-[11px] text-slate-300">
                    {act.instructions.map((step, sIdx) => (
                      <li key={sIdx}>{step}</li>
                    ))}
                  </ul>

                  <div className="pl-6 pt-1 text-[11px] text-cyan-400/90 italic">
                    Expected observation: {act.expectedObservation}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 sm:self-start">
                  <button
                    onClick={() => onApplyActivitySetup(act.setupParams, act.targetMode)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 rounded-md transition-colors cursor-pointer"
                  >
                    <span>Load Setup</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => handleToggleComplete(act.id)}
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

              {/* Student Record Field */}
              <div className="pl-6 pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  placeholder="Record your numerical findings or observation..."
                  value={studentNotes[act.id] || ''}
                  onChange={(e) => handleNoteChange(act.id, e.target.value)}
                  className="flex-1 px-2.5 py-1.5 text-xs bg-[#101D30] border border-slate-700 rounded text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />

                <button
                  onClick={() => handleAutoRecord(act.id)}
                  className="px-2.5 py-1.5 text-[11px] font-mono font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/30 rounded transition-colors cursor-pointer shrink-0"
                  title="Insert current parameters and response"
                >
                  Insert Current State
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
