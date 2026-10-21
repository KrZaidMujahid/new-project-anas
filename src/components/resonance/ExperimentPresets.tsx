/**
 * EQUATION 1 — Resonance Experiment Presets Catalog (Section 11)
 * Functional benchmark experiments A through F with one-click setup,
 * parameter adjustments, and scientific commentary.
 */

import React from 'react';
import { ResonanceParameters, ResonancePreset, ResonanceVisualizationMode } from '../../physics/resonance/types';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, RotateCcw } from 'lucide-react';

interface ExperimentPresetsProps {
  onApplyPreset: (params: ResonanceParameters, mode?: ResonanceVisualizationMode) => void;
  onResetExperiment: () => void;
}

const PRESETS: ResonancePreset[] = [
  {
    id: 'exp-a',
    name: 'Experiment A: Find the Natural Frequency',
    badge: 'Benchmark System',
    tagline: 'Locate the exact peak of resonance',
    description:
      'With m = 1.0 kg and k = 50 N/m, the natural frequency is f₀ = 1.125 Hz. Sweep the driver around this region to observe maximum amplitude amplification.',
    params: {
      mass: 1.0,
      springConstant: 50,
      dampingCoefficient: 0.4,
      drivingFrequencyHz: 0.6,
      drivingForceAmplitude: 2.0,
      initialDisplacement: 0,
      initialVelocity: 0,
    },
    targetMode: 'below-resonance',
    pedagogicalTakeaway: 'The amplitude maximizes when external forcing frequency f_d matches natural frequency f₀.',
  },
  {
    id: 'exp-b',
    name: 'Experiment B: Effect of Damping',
    badge: 'Sharp vs Broad',
    tagline: 'Observe Quality factor Q changes',
    description:
      'Set low damping c = 0.15 N·s/m. Notice how the resonance peak becomes very tall and narrow (high Q). Then compare with high damping c = 2.0 N·s/m.',
    params: {
      mass: 1.0,
      springConstant: 50,
      dampingCoefficient: 0.15,
      drivingFrequencyHz: 1.125,
      drivingForceAmplitude: 2.0,
      initialDisplacement: 0,
      initialVelocity: 0,
    },
    targetMode: 'low-damping',
    pedagogicalTakeaway: 'Weaker damping produces higher resonance peak amplitudes and narrower bandwidth (higher Q factor).',
  },
  {
    id: 'exp-c',
    name: 'Experiment C: Effect of Mass (Inertia)',
    badge: 'Inertia Scaling',
    tagline: 'Observe f₀ shift with mass',
    description:
      'Increase mass to m = 3.0 kg while keeping k = 50 N/m. Natural frequency shifts downward from 1.125 Hz to 0.650 Hz due to greater inertia.',
    params: {
      mass: 3.0,
      springConstant: 50,
      dampingCoefficient: 0.5,
      drivingFrequencyHz: 0.65,
      drivingForceAmplitude: 2.0,
      initialDisplacement: 0,
      initialVelocity: 0,
    },
    targetMode: 'at-resonance',
    pedagogicalTakeaway: 'Natural frequency is inversely proportional to square root of mass (f₀ ∝ 1/√m).',
  },
  {
    id: 'exp-d',
    name: 'Experiment D: Effect of Spring Stiffness',
    badge: 'Stiffness Shift',
    tagline: 'Soft spring vs stiff spring',
    description:
      'Increase spring stiffness to k = 150 N/m with m = 1.0 kg. Natural frequency shifts upward from 1.125 Hz to 1.949 Hz.',
    params: {
      mass: 1.0,
      springConstant: 150,
      dampingCoefficient: 0.5,
      drivingFrequencyHz: 1.95,
      drivingForceAmplitude: 2.0,
      initialDisplacement: 0,
      initialVelocity: 0,
    },
    targetMode: 'at-resonance',
    pedagogicalTakeaway: 'Natural frequency is directly proportional to square root of spring stiffness (f₀ ∝ √k).',
  },
  {
    id: 'exp-e',
    name: 'Experiment E: Effect of Driving Force Amplitude',
    badge: 'Linearity Test',
    tagline: 'Doubling force doubles response',
    description:
      'Increase driving force amplitude from F₀ = 2.0 N to F₀ = 6.0 N. In a linear oscillator, steady-state response amplitude scales proportionally: A ∝ F₀.',
    params: {
      mass: 1.0,
      springConstant: 50,
      dampingCoefficient: 0.5,
      drivingFrequencyHz: 1.125,
      drivingForceAmplitude: 6.0,
      initialDisplacement: 0,
      initialVelocity: 0,
    },
    targetMode: 'at-resonance',
    pedagogicalTakeaway: 'For a linear oscillator, steady-state amplitude is directly proportional to applied force amplitude.',
  },
  {
    id: 'exp-f',
    name: 'Experiment F: Phase Shift Near Resonance',
    badge: 'Phase Transition',
    tagline: 'Track φ from 0° to 90° to 180°',
    description:
      'Driver set just below resonance (f_d = 1.0 Hz). Observe the phase lag transition through 90° as f_d crosses the natural frequency.',
    params: {
      mass: 1.0,
      springConstant: 50,
      dampingCoefficient: 0.6,
      drivingFrequencyHz: 1.0,
      drivingForceAmplitude: 2.0,
      initialDisplacement: 0,
      initialVelocity: 0,
    },
    targetMode: 'below-resonance',
    pedagogicalTakeaway: 'Phase lag φ is 0° well below resonance, exactly 90° at resonance, and approaches 180° well above resonance.',
  },
];

export const ExperimentPresets: React.FC<ExperimentPresetsProps> = ({
  onApplyPreset,
  onResetExperiment,
}) => {
  return (
    <div className="bg-[#101D30] border border-slate-800 rounded-xl p-4 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Preset Benchmark Experiments
            </h2>
            <p className="text-[11px] text-slate-400">
              Interactive syllabus investigations A through F
            </p>
          </div>
        </div>

        <button
          onClick={onResetExperiment}
          className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Experiment</span>
        </button>
      </div>

      {/* Presets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {PRESETS.map((p) => (
          <div
            key={p.id}
            className="p-3.5 rounded-lg bg-[#07111F] border border-slate-800 hover:border-cyan-500/50 hover:bg-[#0c182a] transition-all flex flex-col justify-between space-y-2.5"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs font-bold text-white">{p.name}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                  {p.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
                {p.description}
              </p>
            </div>

            <button
              onClick={() => onApplyPreset(p.params, p.targetMode)}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 rounded-md transition-colors cursor-pointer group"
            >
              <span>Load Experiment</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
