/**
 * EQUATION 1 — Simple Harmonic Motion Guided Scientific Experiments
 * 5 structured investigations with comparative data tables, test trials, and verified conclusions.
 */

import React, { useState } from 'react';
import { SHMParameters } from '../../physics/shm/types';
import { FlaskConical, Play, CheckCircle2, ArrowRight, Lightbulb } from 'lucide-react';

interface SHMExperimentsProps {
  currentParams: SHMParameters;
  onApplyParams: (params: Partial<SHMParameters>) => void;
}

interface ExperimentDef {
  id: number;
  title: string;
  question: string;
  hypothesis: string;
  variedParameter: string;
  constantParameters: string;
  trials: {
    label: string;
    value: number;
    params: Partial<SHMParameters>;
    computedOmega: number;
    computedPeriod: number;
    computedFreq: number;
    note: string;
  }[];
  conclusion: string;
}

const EXPERIMENTS: ExperimentDef[] = [
  {
    id: 1,
    title: 'Experiment 1: Mass vs. Period (T ∝ √m)',
    question: 'How does changing the oscillating mass affect the period of simple harmonic motion?',
    hypothesis: 'Since T = 2π√(m/k), the period should increase proportionally to the square root of the mass (quadrupling m doubles T).',
    variedParameter: 'Mass m (kg)',
    constantParameters: 'k = 20 N/m, A = 0.20 m, φ = 0°',
    trials: [
      {
        label: 'Trial A (0.5 kg)',
        value: 0.5,
        params: { systemType: 'horizontal-spring', mass: 0.5, springConstant: 20, amplitude: 0.2 },
        computedOmega: Math.sqrt(20 / 0.5),
        computedPeriod: 2 * Math.PI * Math.sqrt(0.5 / 20),
        computedFreq: 1 / (2 * Math.PI * Math.sqrt(0.5 / 20)),
        note: 'Baseline low inertia',
      },
      {
        label: 'Trial B (1.0 kg)',
        value: 1.0,
        params: { systemType: 'horizontal-spring', mass: 1.0, springConstant: 20, amplitude: 0.2 },
        computedOmega: Math.sqrt(20 / 1.0),
        computedPeriod: 2 * Math.PI * Math.sqrt(1.0 / 20),
        computedFreq: 1 / (2 * Math.PI * Math.sqrt(1.0 / 20)),
        note: 'Standard mass benchmark',
      },
      {
        label: 'Trial C (2.0 kg)',
        value: 2.0,
        params: { systemType: 'horizontal-spring', mass: 2.0, springConstant: 20, amplitude: 0.2 },
        computedOmega: Math.sqrt(20 / 2.0),
        computedPeriod: 2 * Math.PI * Math.sqrt(2.0 / 20),
        computedFreq: 1 / (2 * Math.PI * Math.sqrt(2.0 / 20)),
        note: '2× mass → 1.414× period',
      },
      {
        label: 'Trial D (4.0 kg)',
        value: 4.0,
        params: { systemType: 'horizontal-spring', mass: 4.0, springConstant: 20, amplitude: 0.2 },
        computedOmega: Math.sqrt(20 / 4.0),
        computedPeriod: 2 * Math.PI * Math.sqrt(4.0 / 20),
        computedFreq: 1 / (2 * Math.PI * Math.sqrt(4.0 / 20)),
        note: '4× mass → exactly 2.0× period (doubled!)',
      },
    ],
    conclusion:
      'Verified: Period T is directly proportional to √m. More mass creates higher inertia, reducing the acceleration produced by the restoring spring force, thereby lengthening the oscillation cycle.',
  },
  {
    id: 2,
    title: 'Experiment 2: Spring Stiffness vs. Period (T ∝ 1/√k)',
    question: 'How does the spring constant k affect the oscillation period?',
    hypothesis: 'Stiffer springs generate larger restoring forces F = -kx for the same displacement, increasing acceleration and decreasing period as 1/√k.',
    variedParameter: 'Spring Constant k (N/m)',
    constantParameters: 'm = 1.0 kg, A = 0.20 m, φ = 0°',
    trials: [
      {
        label: 'Trial A (10 N/m)',
        value: 10,
        params: { systemType: 'horizontal-spring', mass: 1.0, springConstant: 10, amplitude: 0.2 },
        computedOmega: Math.sqrt(10 / 1.0),
        computedPeriod: 2 * Math.PI * Math.sqrt(1.0 / 10),
        computedFreq: 1 / (2 * Math.PI * Math.sqrt(1.0 / 10)),
        note: 'Very soft, loose spring',
      },
      {
        label: 'Trial B (20 N/m)',
        value: 20,
        params: { systemType: 'horizontal-spring', mass: 1.0, springConstant: 20, amplitude: 0.2 },
        computedOmega: Math.sqrt(20 / 1.0),
        computedPeriod: 2 * Math.PI * Math.sqrt(1.0 / 20),
        computedFreq: 1 / (2 * Math.PI * Math.sqrt(1.0 / 20)),
        note: 'Medium stiffness',
      },
      {
        label: 'Trial C (40 N/m)',
        value: 40,
        params: { systemType: 'horizontal-spring', mass: 1.0, springConstant: 40, amplitude: 0.2 },
        computedOmega: Math.sqrt(40 / 1.0),
        computedPeriod: 2 * Math.PI * Math.sqrt(1.0 / 40),
        computedFreq: 1 / (2 * Math.PI * Math.sqrt(1.0 / 40)),
        note: '2× stiffness → period divided by √2',
      },
      {
        label: 'Trial D (80 N/m)',
        value: 80,
        params: { systemType: 'horizontal-spring', mass: 1.0, springConstant: 80, amplitude: 0.2 },
        computedOmega: Math.sqrt(80 / 1.0),
        computedPeriod: 2 * Math.PI * Math.sqrt(1.0 / 80),
        computedFreq: 1 / (2 * Math.PI * Math.sqrt(1.0 / 80)),
        note: '4× stiffness → period halved (0.5×)',
      },
    ],
    conclusion:
      'Verified: Period T is inversely proportional to √k. Stiff springs provide rapid restoring acceleration, completing each cycle in less time.',
  },
  {
    id: 3,
    title: 'Experiment 3: Amplitude & Isochronism (T independent of A)',
    question: 'Does pulling the mass further out change the period of ideal SHM?',
    hypothesis: 'The period of an ideal linear oscillator is strictly independent of amplitude (isochronism), because greater displacement produces proportionally greater restoring force.',
    variedParameter: 'Amplitude A (m)',
    constantParameters: 'm = 1.0 kg, k = 20 N/m, φ = 0°',
    trials: [
      {
        label: 'Trial A (A = 0.05 m)',
        value: 0.05,
        params: { systemType: 'horizontal-spring', mass: 1.0, springConstant: 20, amplitude: 0.05 },
        computedOmega: Math.sqrt(20 / 1.0),
        computedPeriod: 2 * Math.PI * Math.sqrt(1.0 / 20),
        computedFreq: 1 / (2 * Math.PI * Math.sqrt(1.0 / 20)),
        note: 'Small oscillation',
      },
      {
        label: 'Trial B (A = 0.15 m)',
        value: 0.15,
        params: { systemType: 'horizontal-spring', mass: 1.0, springConstant: 20, amplitude: 0.15 },
        computedOmega: Math.sqrt(20 / 1.0),
        computedPeriod: 2 * Math.PI * Math.sqrt(1.0 / 20),
        computedFreq: 1 / (2 * Math.PI * Math.sqrt(1.0 / 20)),
        note: 'Medium amplitude (3× distance)',
      },
      {
        label: 'Trial C (A = 0.25 m)',
        value: 0.25,
        params: { systemType: 'horizontal-spring', mass: 1.0, springConstant: 20, amplitude: 0.25 },
        computedOmega: Math.sqrt(20 / 1.0),
        computedPeriod: 2 * Math.PI * Math.sqrt(1.0 / 20),
        computedFreq: 1 / (2 * Math.PI * Math.sqrt(1.0 / 20)),
        note: 'Large amplitude (5× distance)',
      },
      {
        label: 'Trial D (A = 0.35 m)',
        value: 0.35,
        params: { systemType: 'horizontal-spring', mass: 1.0, springConstant: 20, amplitude: 0.35 },
        computedOmega: Math.sqrt(20 / 1.0),
        computedPeriod: 2 * Math.PI * Math.sqrt(1.0 / 20),
        computedFreq: 1 / (2 * Math.PI * Math.sqrt(1.0 / 20)),
        note: 'Maximum amplitude (7× distance)',
      },
    ],
    conclusion:
      'Verified Isochronism: The period T = 1.405 s is IDENTICAL across all amplitudes! Although the mass travels further, the restoring force and average speed scale in exact proportion, keeping the elapsed time per cycle constant.',
  },
  {
    id: 4,
    title: 'Experiment 4: Initial Phase & Starting State',
    question: 'How does the initial phase angle φ determine the starting position and direction of motion?',
    hypothesis: 'Initial displacement is x(0) = A cos(φ) and velocity is v(0) = -Aω sin(φ). Setting φ shifts where along the cycle motion starts.',
    variedParameter: 'Initial Phase φ (degrees)',
    constantParameters: 'm = 1.0 kg, k = 20 N/m, A = 0.20 m',
    trials: [
      {
        label: 'Trial A (φ = 0°)',
        value: 0,
        params: { systemType: 'horizontal-spring', mass: 1.0, springConstant: 20, amplitude: 0.2, initialPhaseDeg: 0 },
        computedOmega: Math.sqrt(20 / 1.0),
        computedPeriod: 2 * Math.PI * Math.sqrt(1.0 / 20),
        computedFreq: 1 / (2 * Math.PI * Math.sqrt(1.0 / 20)),
        note: 'Starts at +A with v₀ = 0 (released from rest)',
      },
      {
        label: 'Trial B (φ = 90°)',
        value: 90,
        params: { systemType: 'horizontal-spring', mass: 1.0, springConstant: 20, amplitude: 0.2, initialPhaseDeg: 90 },
        computedOmega: Math.sqrt(20 / 1.0),
        computedPeriod: 2 * Math.PI * Math.sqrt(1.0 / 20),
        computedFreq: 1 / (2 * Math.PI * Math.sqrt(1.0 / 20)),
        note: 'Starts at x₀ = 0 moving left at -v_max',
      },
      {
        label: 'Trial C (φ = 180°)',
        value: 180,
        params: { systemType: 'horizontal-spring', mass: 1.0, springConstant: 20, amplitude: 0.2, initialPhaseDeg: 180 },
        computedOmega: Math.sqrt(20 / 1.0),
        computedPeriod: 2 * Math.PI * Math.sqrt(1.0 / 20),
        computedFreq: 1 / (2 * Math.PI * Math.sqrt(1.0 / 20)),
        note: 'Starts at -A with v₀ = 0',
      },
      {
        label: 'Trial D (φ = -90°)',
        value: -90,
        params: { systemType: 'horizontal-spring', mass: 1.0, springConstant: 20, amplitude: 0.2, initialPhaseDeg: -90 },
        computedOmega: Math.sqrt(20 / 1.0),
        computedPeriod: 2 * Math.PI * Math.sqrt(1.0 / 20),
        computedFreq: 1 / (2 * Math.PI * Math.sqrt(1.0 / 20)),
        note: 'Starts at x₀ = 0 moving right at +v_max',
      },
    ],
    conclusion:
      'Verified: Phase φ determines the initial state (x₀, v₀) at t = 0 without altering frequency, period, or total energy.',
  },
  {
    id: 5,
    title: 'Experiment 5: Gravity & Vertical Spring Equilibrium',
    question: 'Does gravity change the oscillation period of a vertical mass-spring system?',
    hypothesis: 'Gravity shifts the static equilibrium position by ΔL = mg/k, but does NOT alter the restoring force gradient (dF/dy = -k), so the period remains T = 2π√(m/k).',
    variedParameter: 'Gravity g (m/s²)',
    constantParameters: 'm = 1.0 kg, k = 20 N/m, A = 0.15 m',
    trials: [
      {
        label: 'Zero-g Space (g = 0.0)',
        value: 0.0,
        params: { systemType: 'vertical-spring', mass: 1.0, springConstant: 20, amplitude: 0.15, gravity: 0.0 },
        computedOmega: Math.sqrt(20 / 1.0),
        computedPeriod: 2 * Math.PI * Math.sqrt(1.0 / 20),
        computedFreq: 1 / (2 * Math.PI * Math.sqrt(1.0 / 20)),
        note: 'Static stretch ΔL = 0.0 cm',
      },
      {
        label: 'Moon Surface (g = 1.62)',
        value: 1.62,
        params: { systemType: 'vertical-spring', mass: 1.0, springConstant: 20, amplitude: 0.15, gravity: 1.62 },
        computedOmega: Math.sqrt(20 / 1.0),
        computedPeriod: 2 * Math.PI * Math.sqrt(1.0 / 20),
        computedFreq: 1 / (2 * Math.PI * Math.sqrt(1.0 / 20)),
        note: 'Static stretch ΔL = 8.1 cm',
      },
      {
        label: 'Earth Surface (g = 9.80)',
        value: 9.80,
        params: { systemType: 'vertical-spring', mass: 1.0, springConstant: 20, amplitude: 0.15, gravity: 9.80 },
        computedOmega: Math.sqrt(20 / 1.0),
        computedPeriod: 2 * Math.PI * Math.sqrt(1.0 / 20),
        computedFreq: 1 / (2 * Math.PI * Math.sqrt(1.0 / 20)),
        note: 'Static stretch ΔL = 49.0 cm',
      },
      {
        label: 'Jupiter (g = 24.79)',
        value: 24.79,
        params: { systemType: 'vertical-spring', mass: 1.0, springConstant: 20, amplitude: 0.15, gravity: 24.79 },
        computedOmega: Math.sqrt(20 / 1.0),
        computedPeriod: 2 * Math.PI * Math.sqrt(1.0 / 20),
        computedFreq: 1 / (2 * Math.PI * Math.sqrt(1.0 / 20)),
        note: 'Static stretch ΔL = 124.0 cm',
      },
    ],
    conclusion:
      'Verified Fundamental Principle: Gravity extends the static equilibrium position ΔL = mg/k, but the restoring stiffness dF/dy = -k and hence the oscillation period T = 1.405 s remain completely unaffected by gravity!',
  },
];

export const SHMExperiments: React.FC<SHMExperimentsProps> = ({
  currentParams,
  onApplyParams,
}) => {
  const [selectedExpId, setSelectedExpId] = useState(1);

  const currentExp = EXPERIMENTS.find((e) => e.id === selectedExpId) || EXPERIMENTS[0];

  return (
    <div className="bg-[#090d16] border border-slate-800/90 rounded-xl p-4 sm:p-5 select-none space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold text-white tracking-wider uppercase font-mono">
            Guided Scientific Experiments
          </h2>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Hypothesis · Parameter Variation · Verification
        </span>
      </div>

      {/* 5 Experiment Navigation Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1 bg-[#07090e] rounded-lg border border-slate-800 text-xs font-medium">
        {EXPERIMENTS.map((exp) => (
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
            Exp {exp.id}: {exp.id === 1 ? 'Mass' : exp.id === 2 ? 'Stiffness' : exp.id === 3 ? 'Amplitude' : exp.id === 4 ? 'Phase' : 'Gravity'}
          </button>
        ))}
      </div>

      {/* Current Experiment Details Card */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide">
            {currentExp.title}
          </h3>
          <p className="text-xs text-cyan-300 mt-1 font-mono">
            {currentExp.question}
          </p>
        </div>

        {/* Hypothesis & Controlled Variables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-[#07090e] border border-slate-800 rounded-lg space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">
              Hypothesis & Theory:
            </span>
            <p className="text-slate-300 leading-relaxed">
              {currentExp.hypothesis}
            </p>
          </div>
          <div className="p-3 bg-[#07090e] border border-slate-800 rounded-lg space-y-1 font-mono text-[11px]">
            <span className="text-[10px] uppercase text-slate-500 block">
              Experimental Controls:
            </span>
            <div className="text-slate-300">
              <span className="text-cyan-400">Varied:</span> {currentExp.variedParameter}
            </div>
            <div className="text-slate-400">
              <span className="text-slate-500">Held Constant:</span> {currentExp.constantParameters}
            </div>
          </div>
        </div>

        {/* Trials Comparison Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-xs font-mono text-left">
            <thead className="bg-[#07090e] text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Test Trial</th>
                <th className="py-2.5 px-3">Test Value</th>
                <th className="py-2.5 px-3">Angular Freq (ω)</th>
                <th className="py-2.5 px-3">Period (T)</th>
                <th className="py-2.5 px-3">Frequency (f)</th>
                <th className="py-2.5 px-3">Observation</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-[#090d16]">
              {currentExp.trials.map((trial, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2 px-3 font-semibold text-white whitespace-nowrap">
                    {trial.label}
                  </td>
                  <td className="py-2 px-3 text-cyan-300 tabular-nums">
                    {trial.value}
                  </td>
                  <td className="py-2 px-3 text-slate-200 tabular-nums">
                    {trial.computedOmega.toFixed(3)} rad/s
                  </td>
                  <td className="py-2 px-3 text-purple-300 font-bold tabular-nums">
                    {trial.computedPeriod.toFixed(3)} s
                  </td>
                  <td className="py-2 px-3 text-slate-300 tabular-nums">
                    {trial.computedFreq.toFixed(3)} Hz
                  </td>
                  <td className="py-2 px-3 text-slate-400 text-[11px]">
                    {trial.note}
                  </td>
                  <td className="py-2 px-3 text-right">
                    <button
                      onClick={() => onApplyParams(trial.params)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-cyan-300 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 rounded transition-colors cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Test Live</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Scientific Conclusion Box */}
        <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-lg flex items-start gap-2.5 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
          <div>
            <span className="font-bold text-emerald-300 block">
              Verified Scientific Conclusion
            </span>
            <p className="text-slate-300 mt-0.5 leading-relaxed">
              {currentExp.conclusion}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
