/**
 * EQUATION 1 — Photoelectric Guided Laboratory Experiments (Section 14)
 * Interactive step-by-step guided activities:
 * - Experiment A: Find the Threshold Frequency
 * - Experiment B: Change Intensity (Prove Intensity Invariance)
 * - Experiment C: Change Frequency (Linear K_max Response)
 * - Experiment D: Compare Metals (Work Function Differences)
 * - Experiment E: Measure Stopping Potential (eV_stop = K_max)
 */

import React, { useState } from 'react';
import { Compass, CheckCircle2, ArrowRight, RotateCcw, Play, Lightbulb, HelpCircle } from 'lucide-react';
import {
  PhotoelectricParameters,
  PhotoelectricCalculations,
  PhotoelectricGuidedExperiment,
} from '../../physics/photoelectric/types';
import { PHOTOELECTRIC_GUIDED_EXPERIMENTS } from '../../physics/photoelectric/model';

interface PhotoelectricGuidedLabProps {
  params: PhotoelectricParameters;
  calc: PhotoelectricCalculations;
  onApplyParams: (params: Partial<PhotoelectricParameters>) => void;
}

export const PhotoelectricGuidedLab: React.FC<PhotoelectricGuidedLabProps> = ({
  params,
  calc,
  onApplyParams,
}) => {
  const [selectedExpId, setSelectedExpId] = useState<string>('exp-a');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isStarted, setIsStarted] = useState<boolean>(false);

  const currentExp: PhotoelectricGuidedExperiment =
    PHOTOELECTRIC_GUIDED_EXPERIMENTS.find((e) => e.id === selectedExpId) ||
    PHOTOELECTRIC_GUIDED_EXPERIMENTS[0];

  const currentStep = currentExp.steps[activeStepIndex] || currentExp.steps[0];
  const isLastStep = activeStepIndex === currentExp.steps.length - 1;

  const handleStartExperiment = (expId: string) => {
    setSelectedExpId(expId);
    setActiveStepIndex(0);
    setIsStarted(true);
    const exp = PHOTOELECTRIC_GUIDED_EXPERIMENTS.find((e) => e.id === expId);
    if (exp?.initialParams) {
      onApplyParams(exp.initialParams);
    }
  };

  const handleNextStep = () => {
    if (!isLastStep) {
      const nextIndex = activeStepIndex + 1;
      setActiveStepIndex(nextIndex);
      const nextStep = currentExp.steps[nextIndex];
      if (nextStep?.targetParams) {
        onApplyParams(nextStep.targetParams);
      }
    }
  };

  const handleResetExperiment = () => {
    setActiveStepIndex(0);
    if (currentExp.initialParams) {
      onApplyParams(currentExp.initialParams);
    }
  };

  return (
    <div className="bg-[#10243D] rounded-xl border border-[#29415F] p-4 sm:p-5 shadow-2xl space-y-5 text-[#EAF2FF]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#29415F] pb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#38BDF8]" />
          <div>
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#EAF2FF]">
              Guided Laboratory Experiments
            </h2>
            <p className="text-[11px] text-[#9FB3CC]">
              Curriculum-aligned inquiry activities with step-by-step guidance and expected observations.
            </p>
          </div>
        </div>

        {isStarted && (
          <button
            onClick={handleResetExperiment}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#9FB3CC] hover:text-[#EAF2FF] bg-[#142B47] hover:bg-[#1A375A] border border-[#29415F] rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Activity</span>
          </button>
        )}
      </div>

      {/* Experiment Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {PHOTOELECTRIC_GUIDED_EXPERIMENTS.map((exp) => {
          const isSelected = selectedExpId === exp.id;
          return (
            <button
              key={exp.id}
              onClick={() => handleStartExperiment(exp.id)}
              className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#38BDF8]/20 border-[#38BDF8] text-[#38BDF8] shadow-sm ring-1 ring-[#38BDF8]/50'
                  : 'bg-[#142B47] border-[#29415F] text-[#9FB3CC] hover:text-[#EAF2FF] hover:border-[#38BDF8]/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#EAF2FF]">Exp {exp.letter}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#071426] text-[#FBBF24]">
                  {exp.badge}
                </span>
              </div>
              <div className="text-[11px] font-medium line-clamp-1 text-[#9FB3CC]">
                {exp.title.replace(`Experiment ${exp.letter}: `, '')}
              </div>
            </button>
          );
        })}
      </div>

      {/* Experiment Body */}
      <div className="bg-[#142B47] rounded-xl border border-[#29415F] p-4 sm:p-5 space-y-4">
        {/* Objective & Meta */}
        <div className="space-y-1 border-b border-[#29415F]/60 pb-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-[#EAF2FF]">
              {currentExp.title}
            </h3>
            <span className="text-xs font-mono text-[#38BDF8]">
              Step {activeStepIndex + 1} of {currentExp.steps.length}
            </span>
          </div>
          <p className="text-xs text-[#9FB3CC] leading-relaxed">
            <strong className="text-[#38BDF8]">Objective:</strong> {currentExp.objective}
          </p>
        </div>

        {/* Step Progression Bar */}
        <div className="flex gap-1.5 w-full">
          {currentExp.steps.map((s, idx) => (
            <div
              key={s.stepNumber}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                idx === activeStepIndex
                  ? 'bg-[#38BDF8]'
                  : idx < activeStepIndex
                  ? 'bg-[#34D399]'
                  : 'bg-[#071426]'
              }`}
            />
          ))}
        </div>

        {/* Active Step Content */}
        <div className="space-y-3 bg-[#071426] p-4 rounded-xl border border-[#29415F]">
          <div className="flex items-center gap-2 text-xs font-bold text-[#38BDF8]">
            <span>Step {currentStep.stepNumber}:</span>
            <span className="text-[#EAF2FF]">{currentStep.title}</span>
          </div>

          <p className="text-xs sm:text-sm text-[#EAF2FF] leading-relaxed font-medium">
            {currentStep.instruction}
          </p>

          {/* Expected Observation Box */}
          <div className="bg-[#10243D] p-3 rounded-lg border border-[#29415F] space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#FBBF24]">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Expected Observation:</span>
            </div>
            <p className="text-xs text-[#9FB3CC] leading-relaxed">
              {currentStep.expectedObservation}
            </p>
          </div>

          {/* Scientific Explanation Box */}
          <div className="bg-[#10243D] p-3 rounded-lg border border-[#29415F] space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#34D399]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Physics Principle:</span>
            </div>
            <p className="text-xs text-[#9FB3CC] leading-relaxed">
              {currentStep.explanation}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {currentStep.targetParams && (
            <button
              onClick={() => onApplyParams(currentStep.targetParams!)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#10243D] hover:bg-[#1A375A] border border-[#29415F] text-[#38BDF8] transition-colors cursor-pointer"
            >
              Apply Step Settings to Simulation
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {!isLastStep ? (
              <button
                onClick={handleNextStep}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-[#38BDF8] hover:bg-[#0284C7] text-[#071426] transition-colors cursor-pointer shadow-md"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#34D399]">
                  Activity Completed!
                </span>
                <button
                  onClick={handleResetExperiment}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#10243D] border border-[#29415F] text-[#EAF2FF] hover:bg-[#1A375A] transition-colors cursor-pointer"
                >
                  Restart
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Conclusion if last step */}
        {isLastStep && (
          <div className="p-3 bg-[#34D399]/10 border border-[#34D399]/40 rounded-lg text-xs text-[#EAF2FF] leading-relaxed">
            <strong className="text-[#34D399]">Conclusion:</strong> {currentExp.conclusion}
          </div>
        )}
      </div>
    </div>
  );
};
