import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, RotateCcw, ArrowRight, Save } from 'lucide-react';
import { DopplerParameters } from '../../physics/doppler/types';

interface DopplerGuidedExperimentProps {
  currentParams: DopplerParameters;
  onApplySetup: (setup: Partial<DopplerParameters>) => void;
}

interface ActivityState {
  completed: boolean;
  notes: string;
}

const ACTIVITIES = [
  {
    id: 1,
    title: 'Activity 1: Baseline Stationary Source',
    objective: 'Confirm that without relative motion, no frequency shift occurs.',
    instructions: [
      'Set Source Velocity = 0 m/s and Observer Velocity = 0 m/s.',
      'Record both the emitted frequency and the observed frequency.',
    ],
    expectedObservation: 'f_observed matches f_source exactly (500.0 Hz). Frequency shift is 0.0 Hz.',
    setup: { sourceVelocity: 0, observerVelocity: 0, sourceFrequency: 500 },
  },
  {
    id: 2,
    title: 'Activity 2: Approaching Sound Source',
    objective: 'Observe frequency elevation caused by forward source motion.',
    instructions: [
      'Set Source Velocity to +30 m/s while keeping Observer Velocity at 0 m/s.',
      'Observe the crowding of wavefronts in front of the source.',
      'Note the new observed frequency.',
    ],
    expectedObservation: 'Observed frequency increases to ~547.9 Hz (+47.9 Hz). Sound pitch is higher.',
    setup: { sourceVelocity: 30, observerVelocity: 0 },
  },
  {
    id: 3,
    title: 'Activity 3: Receding Sound Source',
    objective: 'Observe frequency depression when the source travels away.',
    instructions: [
      'Set Source Velocity to -30 m/s.',
      'Examine the wavefront spacing in front of the source.',
      'Compare observed frequency with Activity 2.',
    ],
    expectedObservation: 'Observed frequency drops to ~459.8 Hz (-40.2 Hz). Sound pitch is lower.',
    setup: { sourceVelocity: -30, observerVelocity: 0 },
  },
  {
    id: 4,
    title: 'Activity 4: High Speed Scaling',
    objective: 'Examine how increasing source speed non-linearly magnifies the shift.',
    instructions: [
      'Increase Source Velocity from +30 m/s to +80 m/s.',
      'Watch how closely packed wavefronts become in front of the source.',
      'Calculate the percentage increase in observed frequency.',
    ],
    expectedObservation: 'At 80 m/s, observed frequency jumps to ~652.1 Hz (+152.1 Hz, ~30.4% increase).',
    setup: { sourceVelocity: 80, observerVelocity: 0 },
  },
  {
    id: 5,
    title: 'Activity 5: Moving Observer vs Stationary Source',
    objective: 'Verify that an approaching observer also perceives higher frequency.',
    instructions: [
      'Set Source Velocity = 0 m/s.',
      'Set Observer Velocity = +20 m/s (traveling toward source).',
      'Observe the wavefront spacing in the medium vs the observer’s reception rate.',
    ],
    expectedObservation: 'Wavefront spacing in the air remains unchanged (0.686m), but observed frequency rises to ~529.2 Hz because the observer intercepts crests faster.',
    setup: { sourceVelocity: 0, observerVelocity: 20 },
  },
  {
    id: 6,
    title: 'Activity 6: Direct Wavelength Comparison',
    objective: 'Compare physical spatial wavelength in front vs behind a moving source.',
    instructions: [
      'Set Source Velocity to +40 m/s and Source Frequency to 500 Hz.',
      'Open the Wavelength Panel and compare λ_front and λ_behind.',
    ],
    expectedObservation: 'λ_front = (343 - 40)/500 = 0.606 m, whereas λ_behind = (343 + 40)/500 = 0.766 m.',
    setup: { sourceVelocity: 40, observerVelocity: 0, sourceFrequency: 500 },
  },
];

const STORAGE_KEY = 'equation1_doppler_guided_lab';

export const DopplerGuidedExperiment: React.FC<DopplerGuidedExperimentProps> = ({
  currentParams,
  onApplySetup,
}) => {
  const [activitiesState, setActivitiesState] = useState<Record<number, ActivityState>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {};
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activitiesState));
    } catch {
      // ignore
    }
  }, [activitiesState]);

  const toggleComplete = (id: number) => {
    setActivitiesState((prev) => ({
      ...prev,
      [id]: {
        completed: !prev[id]?.completed,
        notes: prev[id]?.notes || '',
      },
    }));
  };

  const handleNotesChange = (id: number, text: string) => {
    setActivitiesState((prev) => ({
      ...prev,
      [id]: {
        completed: prev[id]?.completed || false,
        notes: text,
      },
    }));
  };

  const handleResetProgress = () => {
    setActivitiesState({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const completedCount = Object.values(activitiesState).filter((s) => s.completed).length;

  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#26364D]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#FBBF24]" />
          <div>
            <h3 className="text-base font-extrabold text-[#F1F5F9] uppercase tracking-wide">
              Perform Your Own Experiment
            </h3>
            <p className="text-xs text-[#94A3B8]">
              6 guided physical inquiry tasks with automated setup, observations, and notebook
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-[#34D399] bg-[#10B981]/15 px-2.5 py-1 rounded border border-[#10B981]/30">
            Progress: {completedCount} / {ACTIVITIES.length} Complete
          </span>
          <button
            onClick={handleResetProgress}
            className="flex items-center gap-1 text-xs text-[#94A3B8] hover:text-[#FB7185] transition-colors cursor-pointer"
            title="Clear all saved notes and completions"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Notebook</span>
          </button>
        </div>
      </div>

      {/* Activity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ACTIVITIES.map((act) => {
          const isDone = activitiesState[act.id]?.completed || false;
          const notes = activitiesState[act.id]?.notes || '';

          return (
            <div
              key={act.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                isDone
                  ? 'bg-[#10B981]/5 border-[#10B981]/40 shadow-xs'
                  : 'bg-[#17263B] border-[#26364D]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#F1F5F9] flex items-center gap-1.5">
                    {isDone && <CheckCircle2 className="w-4 h-4 text-[#34D399]" />}
                    <span>{act.title}</span>
                  </h4>
                  <button
                    onClick={() => act.setup && onApplySetup(act.setup)}
                    className="text-[11px] font-semibold text-[#38BDF8] hover:text-[#7DD3FC] bg-[#101D30] px-2 py-0.5 rounded border border-[#26364D] hover:border-[#38BDF8]/40 transition-colors cursor-pointer"
                    title="Load setup values automatically"
                  >
                    Load Setup →
                  </button>
                </div>

                <p className="text-[11px] text-[#94A3B8] font-medium">{act.objective}</p>

                <div className="bg-[#101D30] p-2.5 rounded-lg border border-[#26364D] space-y-1 text-[11px]">
                  <strong className="text-[#38BDF8] block text-[10px] uppercase tracking-wider">
                    Instructions:
                  </strong>
                  <ul className="list-disc pl-4 space-y-0.5 text-[#94A3B8]">
                    {act.instructions.map((inst, idx) => (
                      <li key={idx}>{inst}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#101D30]/60 p-2.5 rounded-lg border border-[#26364D]/80 text-[11px]">
                  <strong className="text-[#34D399] block text-[10px] uppercase tracking-wider">
                    Expected Observation:
                  </strong>
                  <p className="text-[#94A3B8] italic mt-0.5">{act.expectedObservation}</p>
                </div>

                {/* Student response notebook input */}
                <div className="pt-1">
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">
                    Your Lab Observation &amp; Notes:
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => handleNotesChange(act.id, e.target.value)}
                    placeholder="Enter your recorded numbers or physical takeaways..."
                    className="w-full bg-[#101D30] border border-[#26364D] focus:border-[#38BDF8] rounded-lg p-2 text-xs text-[#F1F5F9] placeholder-[#64748B] outline-hidden resize-none"
                  />
                </div>
              </div>

              {/* Mark Complete Button */}
              <div className="pt-3 mt-2 border-t border-[#26364D] flex justify-end">
                <button
                  onClick={() => toggleComplete(act.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isDone
                      ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40 hover:bg-[#10B981]/30'
                      : 'bg-[#101D30] text-[#F1F5F9] border border-[#26364D] hover:border-[#38BDF8]/40 hover:bg-[#1E334D]'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isDone ? 'Completed ✓' : 'Mark Complete'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
