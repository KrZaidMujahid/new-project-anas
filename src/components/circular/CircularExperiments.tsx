/**
 * EQUATION 1 — Circular Motion Guided Laboratory Experiments
 * 5 Structured interactive investigations exploring radius scaling,
 * quadratic angular velocity dynamics, mass invariance of acceleration, and period/frequency relationships.
 */

import React from 'react';
import { CircularParameters } from '../../physics/circular/types';
import { Compass, Play, Check } from 'lucide-react';

interface CircularExperimentsProps {
  currentParams: CircularParameters;
  onApplyExperiment: (params: CircularParameters) => void;
}

interface CircularExperimentItem {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  scientificGoal: string;
  params: CircularParameters;
}

const EXPERIMENTS: CircularExperimentItem[] = [
  {
    id: 'exp-1',
    number: 1,
    title: 'Radius Scaling at Constant ω',
    subtitle: 'v ∝ r and a_c ∝ r (ω = 2.0 rad/s constant)',
    description:
      'With angular velocity fixed at 2.0 rad/s, increase radius from 2.0 m to 6.0 m. Notice how both tangential speed v and centripetal acceleration a_c scale linearly with radius.',
    scientificGoal: 'Verify that linear speed v = rω and a_c = rω² grow proportionally with radius.',
    params: {
      mass: 1.5,
      radius: 6.0,
      angularVelocity: 2.0,
      initialAngleDeg: 0,
    },
  },
  {
    id: 'exp-2',
    number: 2,
    title: 'Quadratic Acceleration with Angular Velocity',
    subtitle: 'v ∝ ω and a_c ∝ ω² (r = 3.0 m constant)',
    description:
      'Keep radius fixed at 3.0 m and double angular velocity from 1.5 rad/s to 3.0 rad/s. While tangential speed doubles, centripetal acceleration quadruples from 6.75 m/s² to 27.00 m/s².',
    scientificGoal: 'Demonstrate quadratic scaling: a_c = rω² doubles squared (4×).',
    params: {
      mass: 1.5,
      radius: 3.0,
      angularVelocity: 3.0,
      initialAngleDeg: 0,
    },
  },
  {
    id: 'exp-3',
    number: 3,
    title: 'Mass Invariance of Centripetal Acceleration',
    subtitle: 'a_c is invariant of m; F_c ∝ m',
    description:
      'Increase mass 5-fold from 1.0 kg to 5.0 kg while keeping orbit radius (4.0 m) and angular speed (2.0 rad/s) identical. Observe that kinematics and acceleration a_c remain exactly 16.0 m/s², while required force F_c quintuples from 16 N to 80 N.',
    scientificGoal: 'Prove that centripetal acceleration depends purely on trajectory kinematics, while force scales with mass.',
    params: {
      mass: 5.0,
      radius: 4.0,
      angularVelocity: 2.0,
      initialAngleDeg: 0,
    },
  },
  {
    id: 'exp-4',
    number: 4,
    title: 'Orbital Period & Fast vs Slow Rotation',
    subtitle: 'T = 2π / ω (Fast orbital period test)',
    description:
      'Set high angular velocity ω = 6.283 rad/s (≈ 2π rad/s). The body sweeps 360° every 1.00 second. Observe the rapid sinusoidal oscillation in x(t) and y(t).',
    scientificGoal: 'Confirm T = 2π / ω = 1.00 s and observe one complete cycle per second.',
    params: {
      mass: 1.0,
      radius: 2.5,
      angularVelocity: 6.283,
      initialAngleDeg: 0,
    },
  },
  {
    id: 'exp-5',
    number: 5,
    title: 'Frequency & Orbital Rate in Hz and RPM',
    subtitle: 'f = 1 / T = ω / 2π',
    description:
      'With ω = 3.1416 rad/s (π rad/s), period T = 2.00 s and frequency f = 0.50 Hz (30 RPM). Track how frequency directly quantifies revolutions per second.',
    scientificGoal: 'Verify reciprocal relation f = 1/T = 0.50 Hz.',
    params: {
      mass: 2.0,
      radius: 3.0,
      angularVelocity: 3.1416,
      initialAngleDeg: 0,
    },
  },
];

export const CircularExperiments: React.FC<CircularExperimentsProps> = ({
  currentParams,
  onApplyExperiment,
}) => {
  return (
    <div className="bg-[#0B1728] border border-[#26364D] rounded-xl p-4 select-none space-y-4 shadow-lg text-xs">
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-[#26364D]">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#F1F5F9]">
            Guided Scientific Experiments (5 Laboratory Investigations)
          </h2>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Interactive Scenarios
        </span>
      </div>

      <p className="text-[11px] text-slate-400 leading-relaxed">
        Select any guided investigation below to instantly load calibrated apparatus parameters and explore core rotational laws.
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {EXPERIMENTS.map((exp) => {
          const isCurrent =
            Math.abs(currentParams.radius - exp.params.radius) < 0.01 &&
            Math.abs(currentParams.angularVelocity - exp.params.angularVelocity) < 0.01 &&
            Math.abs(currentParams.mass - exp.params.mass) < 0.01;

          return (
            <div
              key={exp.id}
              className={`p-3.5 rounded-lg border transition-all flex flex-col justify-between space-y-2.5 ${
                isCurrent
                  ? 'bg-cyan-950/20 border-cyan-500/50 shadow-sm'
                  : 'bg-[#07111F] border-[#26364D] hover:border-slate-700'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                    Exp {exp.number}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    r = {exp.params.radius}m, ω = {exp.params.angularVelocity}rad/s
                  </span>
                </div>

                <h3 className="font-bold text-white text-xs">{exp.title}</h3>
                <p className="text-[10px] font-mono text-cyan-400/90">{exp.subtitle}</p>
                <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                  {exp.description}
                </p>

                <div className="bg-[#101D30] p-2 rounded text-[10px] font-mono text-emerald-300 border border-slate-800">
                  <span className="text-slate-500 block text-[9px] uppercase">Goal:</span>
                  {exp.scientificGoal}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onApplyExperiment(exp.params)}
                className={`w-full py-1.5 px-3 rounded font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/40'
                    : 'bg-[#101D30] hover:bg-[#17263B] text-slate-200 border border-[#26364D] hover:border-cyan-500/40'
                }`}
              >
                {isCurrent ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Loaded in Simulation</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-cyan-400 fill-current" />
                    <span>Load Experiment {exp.number}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
