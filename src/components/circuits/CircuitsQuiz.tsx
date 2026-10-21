/**
 * EQUATION 1 — RLC Circuits Knowledge Evaluation Quiz
 * 14 syllabus-aligned multiple choice questions for Class 11 & 12 physics / electronics
 * with instant feedback, scientific rationales, and score calculation.
 */

import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, Award, Sparkles } from 'lucide-react';
import { RLC_QUIZ_QUESTIONS } from '../../physics/circuits/model';

export const CircuitsQuiz: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
  };

  const totalQuestions = RLC_QUIZ_QUESTIONS.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = RLC_QUIZ_QUESTIONS.reduce((acc, q) => {
    return acc + (selectedAnswers[q.id] === q.correctIndex ? 1 : 0);
  }, 0);
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);

  return (
    <div className="space-y-6 text-[#F1F5F9]">
      {/* Quiz Header Banner */}
      <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#FBBF24]/10 border border-[#FBBF24]/30 flex items-center justify-center text-[#FBBF24] shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold uppercase tracking-wide text-[#F1F5F9]">
              RLC Circuits Examination (Class 11 &amp; 12)
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              14 questions covering reactances, impedance, resonance, power factor, and transient damping.
            </p>
          </div>
        </div>

        {/* Score & Controls */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-lg bg-[#17263B] border border-[#26364D] text-xs font-mono">
            <span className="text-[#94A3B8]">Answered: </span>
            <span className="font-bold text-[#38BDF8]">
              {answeredCount}/{totalQuestions}
            </span>
          </div>

          <button
            onClick={handleResetQuiz}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#17263B] hover:bg-[#1E334D] border border-[#26364D] text-xs font-semibold text-[#94A3B8] hover:text-[#F1F5F9] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Quiz</span>
          </button>
        </div>
      </div>

      {/* Score Summary Card if all answered */}
      {answeredCount === totalQuestions && (
        <div className="bg-[#0B1728] rounded-xl border border-[#38BDF8]/40 p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#38BDF8]/20 border border-[#38BDF8] flex items-center justify-center text-[#38BDF8]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#F1F5F9]">
                Quiz Completed! Score: {correctCount}/{totalQuestions} ({scorePercent}%)
              </div>
              <div className="text-xs text-[#94A3B8] mt-0.5">
                {scorePercent >= 85
                  ? 'Exceptional mastery of AC circuit theory and electrodynamic invariants!'
                  : scorePercent >= 65
                  ? 'Great performance! Review the detailed rationales below to polish your understanding.'
                  : 'Keep learning! Check the Theory tab to review reactances and resonance formulas.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Question Cards */}
      <div className="space-y-4">
        {RLC_QUIZ_QUESTIONS.map((q, idx) => {
          const userAnswer = selectedAnswers[q.id];
          const isAnswered = userAnswer !== undefined;
          const isCorrect = userAnswer === q.correctIndex;

          return (
            <div
              key={q.id}
              className={`bg-[#101D30] rounded-xl border p-5 shadow-xl transition-all ${
                isAnswered
                  ? isCorrect
                    ? 'border-[#34D399]/40'
                    : 'border-[#FB7185]/40'
                  : 'border-[#26364D]'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-2.5">
                  <span className="font-mono text-xs font-bold text-[#38BDF8] px-2 py-0.5 rounded bg-[#17263B] border border-[#26364D] shrink-0 mt-0.5">
                    Q{idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-[#F1F5F9] leading-relaxed">
                    {q.question}
                  </p>
                </div>

                {isAnswered && (
                  <div className="shrink-0">
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-[#34D399] bg-[#34D399]/10 px-2 py-0.5 rounded border border-[#34D399]/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Correct</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-[#FB7185] bg-[#FB7185]/10 px-2 py-0.5 rounded border border-[#FB7185]/30">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Incorrect</span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                {q.options.map((opt, optIdx) => {
                  const isThisSelected = userAnswer === optIdx;
                  const isThisCorrect = optIdx === q.correctIndex;

                  let optStyles =
                    'bg-[#17263B] border-[#26364D] text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1E334D]';

                  if (isAnswered) {
                    if (isThisCorrect) {
                      optStyles = 'bg-[#34D399]/15 border-[#34D399] text-[#34D399] font-bold';
                    } else if (isThisSelected) {
                      optStyles = 'bg-[#FB7185]/15 border-[#FB7185] text-[#FB7185] font-semibold';
                    } else {
                      optStyles = 'bg-[#17263B]/60 border-[#26364D]/60 text-[#94A3B8]/60 cursor-default';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`p-3 rounded-lg text-xs text-left border transition-all cursor-pointer flex items-start gap-2.5 ${optStyles}`}
                    >
                      <span className="font-mono text-[10px] font-bold uppercase mt-0.5 shrink-0 opacity-70">
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      <span className="leading-snug">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation upon answering */}
              {isAnswered && (
                <div className="mt-3.5 p-3 rounded-lg bg-[#0B1728] border border-[#26364D] text-xs text-[#94A3B8] space-y-1">
                  <div className="text-[11px] font-bold text-[#F1F5F9] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
                    <span>Scientific Explanation:</span>
                  </div>
                  <p className="leading-relaxed pl-5">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
