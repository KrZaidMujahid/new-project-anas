/**
 * EQUATION 1 — RLC Circuits Guided Experiments
 * 8 structured laboratory investigations with:
 * - One-click parameter setup loader
 * - Step-by-step instructions & expected observations
 * - Interactive student answer input field
 * - Mark Complete / Reset Activity buttons
 * - Persistent student answers & completion status in localStorage!
 */

import React, { useState, useEffect } from 'react';
import { Compass, CheckCircle2, RotateCcw, Sparkles, ArrowRight, Save, Award } from 'lucide-react';
import { RLCParameters } from '../../physics/circuits/types';
import { RLC_GUIDED_LABS } from '../../physics/circuits/model';

interface CircuitsGuidedExperimentsProps {
  onApplySetup: (setup: Partial<RLCParameters>) => void;
  onGoToSimulation: () => void;
}

const STORAGE_KEY_PROGRESS = 'equation1_rlc_labs_completed';
const STORAGE_KEY_ANSWERS = 'equation1_rlc_labs_answers';

export const CircuitsGuidedExperiments: React.FC<CircuitsGuidedExperimentsProps> = ({
  onApplySetup,
  onGoToSimulation,
}) => {
  const [activeLabId, setActiveLabId] = useState<number>(1);
  const [completedLabs, setCompletedLabs] = useState<Record<number, boolean>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PROGRESS);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [studentAnswers, setStudentAnswers] = useState<Record<number, string>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ANSWERS);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(completedLabs));
    } catch {}
  }, [completedLabs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(studentAnswers));
    } catch {}
  }, [studentAnswers]);

  const activeLab = RLC_GUIDED_LABS.find((l) => l.id === activeLabId) || RLC_GUIDED_LABS[0];
  const isCompleted = !!completedLabs[activeLab.id];
  const currentAnswer = studentAnswers[activeLab.id] || '';

  const handleToggleComplete = () => {
    setCompletedLabs((prev) => ({
      ...prev,
      [activeLab.id]: !prev[activeLab.id],
    }));
  };

  const handleResetLab = () => {
    setCompletedLabs((prev) => {
      const updated = { ...prev };
      delete updated[activeLab.id];
      return updated;
    });
    setStudentAnswers((prev) => {
      const updated = { ...prev };
      delete updated[activeLab.id];
      return updated;
    });
  };

  const handleAnswerChange = (val: string) => {
    setStudentAnswers((prev) => ({
      ...prev,
      [activeLab.id]: val,
    }));
  };

  const totalCompleted = Object.values(completedLabs).filter(Boolean).length;

  return (
    <div className="space-y-6 text-[#F1F5F9]">
      {/* Header Banner */}
      <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#34D399]/10 border border-[#34D399]/30 flex items-center justify-center text-[#34D399] shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold uppercase tracking-wide text-[#F1F5F9]">
              Guided Laboratory Experiments (Class 11 &amp; 12)
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              8 step-by-step investigations with interactive answer logs and automatic progress saving in localStorage.
            </p>
          </div>
        </div>

        {/* Overall Completion Metric */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#17263B] border border-[#26364D] text-xs font-mono">
          <Award className="w-4 h-4 text-[#FBBF24]" />
          <span className="text-[#94A3B8]">Completed:</span>
          <span className="font-bold text-[#34D399]">
            {totalCompleted} / {RLC_GUIDED_LABS.length} Labs
          </span>
        </div>
      </div>

      {/* Lab Tabs (1 to 8) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {RLC_GUIDED_LABS.map((lab) => {
          const isDone = !!completedLabs[lab.id];
          return (
            <button
              key={lab.id}
              onClick={() => setActiveLabId(lab.id)}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                activeLabId === lab.id
                  ? 'bg-[#38BDF8] text-[#07111F] border-[#38BDF8] shadow-md font-bold'
                  : isDone
                  ? 'bg-[#17263B] border-[#34D399]/40 text-[#F1F5F9]'
                  : 'bg-[#101D30] border-[#26364D] text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              <div className="truncate">
                <div className="text-[10px] uppercase font-mono opacity-80">
                  Lab {lab.id}
                </div>
                <div className="text-xs truncate font-semibold">
                  {lab.badge}
                </div>
              </div>
              {isDone && (
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${activeLabId === lab.id ? 'text-[#07111F]' : 'text-[#34D399]'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Lab Card */}
      <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#26364D] pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#38BDF8] tracking-widest font-bold">
              Experiment {activeLab.id} of 8 &middot; {activeLab.badge}
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
              <span>Load Setup &amp; View Sim</span>
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
            {activeLab.instructions.map((ins, idx) => (
              <li key={idx} className="pl-1">
                <span className="text-[#F1F5F9]">{ins}</span>
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
            {activeLab.expectedObservations}
          </p>
        </div>

        {/* Student Question & Answer Field */}
        <div className="bg-[#0B1728] p-4 rounded-lg border border-[#26364D] space-y-3">
          <div className="text-xs font-bold text-[#F1F5F9] flex items-center gap-1.5">
            <Save className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span>Student Observation Question:</span>
          </div>
          <p className="text-xs text-[#94A3B8]">
            {activeLab.question}
          </p>
          <textarea
            rows={3}
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Type your scientific observation here (saved automatically in localStorage)..."
            className="w-full bg-[#101D30] border border-[#26364D] focus:border-[#38BDF8] rounded-lg p-3 text-xs text-[#F1F5F9] placeholder-[#94A3B8]/50 focus:outline-none transition-colors"
          />
          {activeLab.defaultAnswer && (
            <button
              onClick={() => handleAnswerChange(activeLab.defaultAnswer || '')}
              className="text-[11px] text-[#38BDF8] hover:underline cursor-pointer"
            >
              Insert reference answer sample
            </button>
          )}
        </div>

        {/* Completion Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={handleResetLab}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#17263B] hover:bg-[#1E334D] border border-[#26364D] text-xs font-semibold text-[#94A3B8] hover:text-[#FB7185] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Activity</span>
          </button>

          <button
            onClick={handleToggleComplete}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-md ${
              isCompleted
                ? 'bg-[#34D399] text-[#07111F] hover:bg-[#10B981]'
                : 'bg-[#17263B] text-[#F1F5F9] hover:bg-[#1E334D] border border-[#26364D]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Marked as Complete' : 'Mark Complete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
