/**
 * EQUATION 1 — Bohr Model Guided Experiment Studio
 * Five structured, inquiry-based physics experiments with interactive prompts,
 * observation checkpoints, auto-configuration, and physics explanations.
 */

import React, { useState } from 'react';
import { PrincipalQuantumNumber } from '../../physics/bohr/types';
import { Compass, CheckCircle2, ArrowRight, ArrowLeft, Play, RotateCcw, Sparkles } from 'lucide-react';

interface GuidedExperimentProps {
  onSetupExperiment: (
    currentLevel: PrincipalQuantumNumber,
    ni?: PrincipalQuantumNumber,
    nf?: PrincipalQuantumNumber
  ) => void;
}

interface ExperimentStep {
  title: string;
  objective: string;
  instructions: string;
  expectedObservation: string;
  physicsExplanation: string;
  targetCurrentLevel: PrincipalQuantumNumber;
  targetNi?: PrincipalQuantumNumber;
  targetNf?: PrincipalQuantumNumber;
}

export const GuidedExperiment: React.FC<GuidedExperimentProps> = ({ onSetupExperiment }) => {
  const [activeExpIndex, setActiveExpIndex] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const experiments: ExperimentStep[] = [
    {
      title: 'Experiment 1: Explore the Ground State (n = 1)',
      objective: 'Observe the most tightly bound quantum state of atomic hydrogen.',
      instructions:
        'Select quantum number n = 1. Observe its binding energy, orbital radius, and idealized non-relativistic electron velocity.',
      expectedObservation:
        'Energy is exactly −13.60 eV, radius is a₀ ≈ 0.529 Å (5.29 × 10⁻¹¹ m), and orbital speed is ~2.19 × 10⁶ m/s (~0.73% of light speed).',
      physicsExplanation:
        'In the Bohr model, angular momentum is quantized as L = n·ℏ. For n = 1, the electron occupies the lowest allowed non-zero angular momentum state. It cannot radiate or fall into the nucleus because no lower bound state exists.',
      targetCurrentLevel: 1,
    },
    {
      title: 'Experiment 2: Excite the Atom (Photon Absorption 1 → 3)',
      objective: 'Observe resonant photon absorption boosting an electron to the second excited state.',
      instructions:
        'Configure an absorption transition with n_i = 1 and n_f = 3. Run the quantum transition.',
      expectedObservation:
        'The atom absorbs an incoming 12.089 eV ultraviolet photon (λ ≈ 102.6 nm). The electron expands outward to orbit n = 3 (radius 9 a₀ ≈ 4.76 Å).',
      physicsExplanation:
        'According to the Bohr frequency condition, ΔE = E₃ − E₁ = −1.51 eV − (−13.60 eV) = 12.089 eV. The incoming photon must carry exactly this quantum of energy (hν = ΔE) to induce the transition.',
      targetCurrentLevel: 1,
      targetNi: 1,
      targetNf: 3,
    },
    {
      title: 'Experiment 3: Observe Emission & the H-α Line (3 → 2)',
      objective: 'Simulate the creation of the most famous visible hydrogen emission line.',
      instructions:
        'Configure an emission transition from n_i = 3 down to n_f = 2. Run the transition.',
      expectedObservation:
        'The electron drops to n = 2 and emits an outgoing photon with ΔE = 1.889 eV and wavelength λ = 656.3 nm (vibrant red visible light).',
      physicsExplanation:
        'This is the Balmer-α (H-α) line. Because human vision is sensitive to 380–750 nm, this transition produces the characteristic red glow seen in hydrogen discharge tubes and emission nebulae across the universe.',
      targetCurrentLevel: 3,
      targetNi: 3,
      targetNf: 2,
    },
    {
      title: 'Experiment 4: Compare Spectral Lines (3 → 2 vs 4 → 2)',
      objective: 'Determine how larger energy jumps affect photon frequency and wavelength.',
      instructions:
        'Set up n_i = 4 to n_f = 2 (Balmer-β). Observe how its photon energy and color compare to the H-α transition.',
      expectedObservation:
        'The energy drop increases to ΔE = 2.550 eV, shifting the emitted wavelength down to λ = 486.1 nm (cyan / blue-green light).',
      physicsExplanation:
        'Because wavelength is inversely proportional to photon energy (λ = hc / ΔE), a larger energy difference produces a higher frequency and a shorter wavelength, shifting the color from red toward blue.',
      targetCurrentLevel: 4,
      targetNi: 4,
      targetNf: 2,
    },
    {
      title: 'Experiment 5: Higher Energy Levels & the Ionization Limit',
      objective: 'Explore the crowding of high-n Rydberg states and the ionization boundary at 0 eV.',
      instructions:
        'Step through levels n = 2, 3, 4, 5, and 6 on the energy-level diagram. Observe how the levels cluster near 0 eV.',
      expectedObservation:
        'As n grows, the energy spacing between adjacent levels shrinks dramatically (ΔE₂₋₁ = 10.2 eV, but ΔE₆₋₅ = 0.166 eV). The bound-state energies approach 0 eV from below.',
      physicsExplanation:
        'At E = 0 eV, the electron is no longer electrostatically bound to the proton—it has been ionized. Above 0 eV lies the continuum, where the free electron can possess any positive kinetic energy.',
      targetCurrentLevel: 6,
    },
  ];

  const currentExp = experiments[activeExpIndex];

  const handleApplyCurrent = () => {
    onSetupExperiment(
      currentExp.targetCurrentLevel,
      currentExp.targetNi,
      currentExp.targetNf
    );
  };

  const handleNext = () => {
    if (activeExpIndex < experiments.length - 1) {
      setActiveExpIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    setIsCompleted(false);
    if (activeExpIndex > 0) {
      setActiveExpIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setActiveExpIndex(0);
    setIsCompleted(false);
  };

  return (
    <div className="bg-[#10243D] border border-[#29415F] rounded-xl p-5 shadow-xl flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#29415F]/70">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#38BDF8]" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Step-by-Step Guided Laboratory Inquiry
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#9FB3CC]">
          <span>
            Activity {activeExpIndex + 1} of {experiments.length}
          </span>
          {isCompleted && (
            <span className="text-emerald-400 font-bold flex items-center gap-1 font-sans">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Inquiry Completed</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Experiment Card */}
      <div className="p-5 rounded-xl bg-[#0B1B31] border border-[#29415F] flex flex-col gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#38BDF8] font-bold">
            Activity {activeExpIndex + 1} of 5
          </span>
          <h4 className="text-base font-bold text-white mt-0.5">
            {currentExp.title}
          </h4>
          <p className="text-xs text-[#9FB3CC] mt-1 font-medium">
            <strong>Objective:</strong> {currentExp.objective}
          </p>
        </div>

        {/* Step Instructions */}
        <div className="p-3.5 rounded-lg bg-[#142B47] border border-[#29415F] text-xs text-white leading-relaxed">
          <strong className="text-[#38BDF8] block mb-1">Interactive Task:</strong>
          {currentExp.instructions}
        </div>

        {/* Setup button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleApplyCurrent}
            className="py-2 px-4 rounded-lg bg-[#38BDF8] hover:bg-[#0284C7] text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Configure Atom & Laboratory</span>
          </button>
        </div>

        {/* Expected Observation */}
        <div className="p-3 rounded-lg bg-[#10243D] border border-emerald-500/30 text-xs text-[#EAF2FF]">
          <strong className="text-emerald-400 block mb-0.5">Expected Observation:</strong>
          {currentExp.expectedObservation}
        </div>

        {/* Scientific Explanation */}
        <div className="p-3 rounded-lg bg-[#10243D] border border-[#29415F] text-xs text-[#9FB3CC] leading-relaxed">
          <strong className="text-white block mb-0.5">Physics Explanation:</strong>
          {currentExp.physicsExplanation}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={handlePrev}
          disabled={activeExpIndex === 0}
          className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeExpIndex === 0
              ? 'bg-[#142B47] text-[#9FB3CC] opacity-50 cursor-not-allowed'
              : 'bg-[#142B47] hover:bg-[#1E3B61] text-white border border-[#29415F]'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous Activity</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="py-2 px-3 rounded-lg bg-[#0B1B31] hover:bg-[#142B47] text-[#9FB3CC] hover:text-white text-xs border border-[#29415F] transition-colors cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Series</span>
          </button>

          <button
            onClick={handleNext}
            className="py-2 px-4 rounded-lg bg-[#818CF8] hover:bg-[#6366F1] text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <span>{activeExpIndex < experiments.length - 1 ? 'Next Activity' : 'Finish Inquiry'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
