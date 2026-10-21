/**
 * EQUATION 1 — Guided Laboratory Investigations & Student Challenges
 * 5 structured step-by-step Class 11/12 physics experiments with
 * automatic setup loading and interactive verification check.
 */

import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  HelpCircle,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { LorentzParameters } from '../../physics/lorentz/types';
import {
  ELEMENTARY_CHARGE,
  PROTON_MASS,
  ALPHA_MASS,
} from '../../physics/lorentz/model';

interface LorentzGuidedExperimentProps {
  currentParams: LorentzParameters;
  onApplySetup: (params: Partial<LorentzParameters>) => void;
  onGoToSimulation: () => void;
}

interface GuidedLab {
  id: number;
  title: string;
  badge: string;
  objective: string;
  steps: string[];
  expectedObservation: string;
  setupParams: Partial<LorentzParameters>;
  checkCondition: (params: LorentzParameters) => {
    isComplete: boolean;
    feedback: string;
  };
}

export const LorentzGuidedExperiment: React.FC<LorentzGuidedExperimentProps> = ({
  currentParams,
  onApplySetup,
  onGoToSimulation,
}) => {
  const [activeLabId, setActiveLabId] = useState<number>(1);

  const labs: GuidedLab[] = [
    {
      id: 1,
      title: 'Lab 1: Right-Hand Rule & Sign Inversion',
      badge: 'Deflection Direction',
      objective:
        'Verify that a positive charge deflects in the direction predicted by the Right-Hand Palm Rule, and that reversing the charge to negative inverts the deflection by 180°.',
      steps: [
        'Load the initial setup (+q, initial velocity to the right, magnetic field B pointing out of the screen ⊙).',
        'Observe the downward circular deflection: thumb points right, fingers point toward you, palm pushes down.',
        'Switch the charge to an electron (q = -1e).',
        'Verify that the force flips upward, proving F_B = q(v × B) reverses for negative charge.',
      ],
      expectedObservation:
        'Proton curves downward (clockwise); electron curves upward (counter-clockwise) under the identical out-of-screen B-field.',
      setupParams: {
        charge: ELEMENTARY_CHARGE,
        chargeNumber: 1,
        mass: PROTON_MASS,
        speed: 2.0e6,
        bFieldStrength: 0.5,
        bFieldDirection: 'out-of-screen',
        angleThetaDeg: 90,
        electricFieldEnabled: false,
        mode: 'perpendicular',
      },
      checkCondition: (p) => {
        if (p.bFieldStrength > 0.1 && p.angleThetaDeg === 90 && !p.electricFieldEnabled) {
          return {
            isComplete: true,
            feedback: `Current setup is active with ${p.chargeNumber > 0 ? 'positive' : 'negative'} charge. Toggle charge to observe inversion!`,
          };
        }
        return {
          isComplete: false,
          feedback: 'Click "Load Lab 1 Setup" to configure pure magnetic perpendicular deflection.',
        };
      },
    },
    {
      id: 2,
      title: 'Lab 2: Radius-Speed & Radius-Field Laws',
      badge: 'r ∝ v / B',
      objective:
        'Prove the cyclotron radius formula r = mv / (qB) by systematically doubling speed v and tripling magnetic field B.',
      steps: [
        'Load the baseline setup with speed v = 1.0 × 10⁶ m/s and B = 0.5 T (radius r ≈ 2.09 cm).',
        'Double the speed to v = 2.0 × 10⁶ m/s and verify that orbit radius r doubles to ~4.18 cm.',
        'Now increase magnetic field B from 0.5 T to 1.5 T (3×) and observe the orbit shrink to 1/3 size (~1.39 cm).',
      ],
      expectedObservation:
        'Orbit radius scales linearly with velocity (r ∝ v) and inversely with magnetic field (r ∝ 1/B).',
      setupParams: {
        charge: ELEMENTARY_CHARGE,
        chargeNumber: 1,
        mass: PROTON_MASS,
        speed: 1.0e6,
        bFieldStrength: 0.5,
        bFieldDirection: 'out-of-screen',
        angleThetaDeg: 90,
        electricFieldEnabled: false,
        mode: 'perpendicular',
      },
      checkCondition: (p) => {
        if (p.bFieldStrength >= 1.0 && p.speed >= 1.8e6) {
          return {
            isComplete: true,
            feedback: 'Great! You have adjusted parameters and demonstrated radius scaling!',
          };
        }
        return {
          isComplete: false,
          feedback: 'Load setup, then test increasing speed or magnetic field B to observe radius changes.',
        };
      },
    },
    {
      id: 3,
      title: 'Lab 3: Calibrating the Velocity Selector',
      badge: 'v = E / B Balance',
      objective:
        'Tune crossed electric and magnetic fields until the electric force qE and magnetic force qvB cancel out perfectly, yielding zero net force and straight undeflected flight.',
      steps: [
        'Load the crossed-field configuration with B = 0.5 T and particle speed v = 2.0 × 10⁶ m/s.',
        'Enable the electric field E pointing UP.',
        'Calculate required E: E = v · B = (2.0 × 10⁶ m/s) · (0.5 T) = 1.0 × 10⁶ N/C (or 10 × 10⁵ N/C).',
        'Verify that net force drops to zero and the trajectory forms a straight line across the chamber.',
      ],
      expectedObservation:
        'When E = 10 × 10⁵ N/C, the upward electric arrow and downward magnetic arrow have identical lengths; particle shoots straight across.',
      setupParams: {
        charge: ELEMENTARY_CHARGE,
        chargeNumber: 1,
        mass: PROTON_MASS,
        speed: 2.0e6,
        bFieldStrength: 0.5,
        bFieldDirection: 'out-of-screen',
        angleThetaDeg: 90,
        electricFieldEnabled: true,
        eFieldStrength: 5.0e5, // purposefully off balance so student adjusts to 1.0e6
        eFieldDirection: 'up',
        initialVelocityAngleDeg: 0,
        mode: 'crossed-fields',
      },
      checkCondition: (p) => {
        if (p.electricFieldEnabled && p.bFieldStrength > 0.1) {
          const expectedE = p.speed * p.bFieldStrength;
          const diff = Math.abs(p.eFieldStrength - expectedE);
          if (diff < 1.0e5) {
            return {
              isComplete: true,
              feedback: 'Perfect! Velocity selector condition (v = E/B) achieved! Particle moves in a straight line.',
            };
          }
          return {
            isComplete: false,
            feedback: `Almost there! Target E = ${(expectedE / 1e5).toFixed(1)} × 10⁵ N/C. Current E is ${(p.eFieldStrength / 1e5).toFixed(1)} × 10⁵ N/C.`,
          };
        }
        return {
          isComplete: false,
          feedback: 'Enable both Electric and Magnetic fields to calibrate the velocity selector.',
        };
      },
    },
    {
      id: 4,
      title: 'Lab 4: Helical Motion & Pitch Measurement',
      badge: 'Oblique Angle θ',
      objective:
        'Explore how an oblique velocity angle 0° < θ < 90° splits motion into a circular orbit in xy and a uniform drift along z.',
      steps: [
        'Load the helical configuration with pitch angle θ = 45° and B = 0.5 T.',
        'Switch to 3D Isometric View on the canvas to see the 3-dimensional corkscrew helix.',
        'Vary θ between 20° (fast drift, elongated helix) and 80° (tight coils, short pitch).',
        'Verify formula: pitch p = v cos(θ) · (2πm / qB).',
      ],
      expectedObservation:
        'Smaller θ yields larger longitudinal velocity v_∥, stretching the distance between successive helical turns.',
      setupParams: {
        charge: ELEMENTARY_CHARGE,
        chargeNumber: 1,
        mass: PROTON_MASS,
        speed: 2.0e6,
        bFieldStrength: 0.5,
        bFieldDirection: 'out-of-screen',
        angleThetaDeg: 45,
        electricFieldEnabled: false,
        mode: 'helical',
      },
      checkCondition: (p) => {
        if (p.angleThetaDeg > 10 && p.angleThetaDeg < 80 && !p.electricFieldEnabled) {
          return {
            isComplete: true,
            feedback: `Helical mode active at θ = ${p.angleThetaDeg}°. Observe the pitch along the drift axis!`,
          };
        }
        return {
          isComplete: false,
          feedback: 'Load Lab 4 to set an oblique angle θ between 20° and 75° for helical motion.',
        };
      },
    },
    {
      id: 5,
      title: 'Lab 5: Isotope Separation by Inertia',
      badge: 'Mass Spectrometry',
      objective:
        'Compare the trajectories of a proton (1 u, +1e) and an alpha particle (4 u, +2e) under identical velocity and magnetic field.',
      steps: [
        'Load the baseline proton with v = 2.0 × 10⁶ m/s and B = 0.5 T. Note radius r_p = mv/qB ≈ 4.18 cm.',
        'Now select the Alpha Particle (q = +2e, m = 4 u).',
        'Calculate theoretical alpha radius: r_α = (4m · v) / (2q · B) = 2 · r_p ≈ 8.36 cm.',
        'Observe the alpha particle trace an orbit exactly twice as large as the proton!',
      ],
      expectedObservation:
        'Because mass quadrupled while charge only doubled, the charge-to-mass ratio q/m halved, doubling the circular radius.',
      setupParams: {
        charge: 2 * ELEMENTARY_CHARGE,
        chargeNumber: 2,
        mass: ALPHA_MASS,
        speed: 2.0e6,
        bFieldStrength: 0.5,
        bFieldDirection: 'out-of-screen',
        angleThetaDeg: 90,
        electricFieldEnabled: false,
        mode: 'perpendicular',
      },
      checkCondition: (p) => {
        if (p.chargeNumber === 2) {
          return {
            isComplete: true,
            feedback: 'Alpha particle (4 u, +2e) is active! Notice the 2× larger orbital radius compared to a proton.',
          };
        }
        return {
          isComplete: false,
          feedback: 'Load Lab 5 to configure and compare the Alpha particle trajectory against the proton.',
        };
      },
    },
  ];

  const activeLab = labs.find((l) => l.id === activeLabId) || labs[0];
  const validation = activeLab.checkCondition(currentParams);

  return (
    <div className="space-y-6 text-[#F1F5F9]">
      {/* Header Banner */}
      <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#34D399]/10 border border-[#34D399]/30 flex items-center justify-center text-[#34D399] shrink-0">
          <Compass className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-extrabold uppercase tracking-wide text-[#F1F5F9]">
            Guided Physics Investigations (Student Lab Exercises)
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
            Follow these 5 structured experimental challenges designed specifically for Class 11 &amp; 12 physics curricula. Each lab configures target physical conditions and validates your observations against the governing laws of electrodynamics.
          </p>
        </div>
      </div>

      {/* Lab Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#26364D] pb-3">
        {labs.map((lab) => (
          <button
            key={lab.id}
            onClick={() => setActiveLabId(lab.id)}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeLabId === lab.id
                ? 'bg-[#38BDF8] text-[#07111F] shadow-sm'
                : 'bg-[#101D30] text-[#94A3B8] hover:text-[#F1F5F9] border border-[#26364D]'
            }`}
          >
            <span>{lab.title.split(':')[0]}</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                activeLabId === lab.id ? 'bg-[#07111F]/20 text-[#07111F]' : 'bg-[#17263B] text-[#94A3B8]'
              }`}
            >
              {lab.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Active Lab Card */}
      <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#26364D] pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#38BDF8] tracking-widest font-bold">
              Experiment {activeLab.id} of 5 &middot; {activeLab.badge}
            </span>
            <h3 className="text-lg font-bold text-[#F1F5F9] mt-0.5">
              {activeLab.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onApplySetup(activeLab.setupParams);
                onGoToSimulation();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#38BDF8] hover:bg-[#7DD3FC] text-[#07111F] text-xs font-bold transition-colors cursor-pointer shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Setup &amp; Open Sim</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Objective */}
        <div className="bg-[#17263B] p-4 rounded-lg border border-[#26364D] space-y-1">
          <div className="text-[11px] font-bold text-[#38BDF8] uppercase tracking-wide">
            Experimental Objective
          </div>
          <p className="text-xs text-[#F1F5F9] leading-relaxed">
            {activeLab.objective}
          </p>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
            Step-by-Step Procedure:
          </div>
          <ol className="space-y-2 text-xs text-[#94A3B8] list-decimal list-inside leading-relaxed bg-[#0B1728] p-4 rounded-lg border border-[#26364D]">
            {activeLab.steps.map((st, idx) => (
              <li key={idx} className="pl-1">
                <span className="text-[#F1F5F9]">{st}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Expected Scientific Result */}
        <div className="bg-[#17263B] p-4 rounded-lg border border-[#26364D] space-y-1">
          <div className="text-[11px] font-bold text-[#34D399] uppercase tracking-wide flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Expected Scientific Observation</span>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            {activeLab.expectedObservation}
          </p>
        </div>

        {/* Live Verification Status Bar */}
        <div
          className={`p-4 rounded-lg border flex items-center gap-3 transition-colors ${
            validation.isComplete
              ? 'bg-[#34D399]/10 border-[#34D399]/40 text-[#34D399]'
              : 'bg-[#FBBF24]/10 border-[#FBBF24]/30 text-[#FBBF24]'
          }`}
        >
          {validation.isComplete ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <div className="text-xs font-semibold leading-relaxed">
            {validation.feedback}
          </div>
        </div>
      </div>
    </div>
  );
};
