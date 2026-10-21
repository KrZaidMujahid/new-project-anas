/**
 * EQUATION 1 — Photoelectric Effect Interactive Quiz (Section 16)
 * 14 multiple-choice assessment questions covering work function, photon energy,
 * intensity vs frequency, stopping potential, I-V curves, and quantum history.
 */

import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, Award, ArrowRight } from 'lucide-react';
import { PHOTOELECTRIC_QUIZ_QUESTIONS } from '../../physics/photoelectric/model';

export const PhotoelectricQuiz: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (showResults) return; // Prevent changing after submission
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  // Calculate score
  const answeredCount = Object.keys(selectedAnswers).length;
  const totalQuestions = PHOTOELECTRIC_QUIZ_QUESTIONS.length;
  const correctCount = PHOTOELECTRIC_QUIZ_QUESTIONS.filter(
    (q) => selectedAnswers[q.id] === q.correctIndex
  ).length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  return (
    <div className="bg-[#10243D] rounded-xl border border-[#29415F] p-4 sm:p-6 shadow-2xl space-y-6 text-[#EAF2FF]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#29415F] pb-4">
        <div className="flex items-center gap-2.5">
          <HelpCircle className="w-5 h-5 text-[#38BDF8]" />
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#EAF2FF]">
              Photoelectric Effect Knowledge Check
            </h2>
            <p className="text-xs text-[#9FB3CC]">
              14 rigorous multiple-choice questions assessing conceptual mastery of Einstein’s photoelectric equation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showResults && (
            <button
              onClick={handleRestart}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#142B47] hover:bg-[#1A375A] border border-[#29415F] text-[#EAF2FF] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>
          )}
        </div>
      </div>

      {/* Score Summary Banner if submitted */}
      {showResults && (
        <div className="p-4 rounded-xl bg-[#142B47] border border-[#29415F] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#38BDF8]/15 border border-[#38BDF8]/40 flex items-center justify-center text-[#38BDF8]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#EAF2FF]">
                Final Score: {correctCount} / {totalQuestions} ({percentage}%)
              </h3>
              <p className="text-xs text-[#9FB3CC]">
                {percentage >= 85
                  ? 'Outstanding! You have thoroughly mastered the quantum physics of the photoelectric effect.'
                  : percentage >= 60
                  ? 'Good work! Review the explanations below to solidify your understanding of stopping potential and intensity invariance.'
                  : 'Keep learning! Read through the detailed explanations below and consult the Understand section.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-[#38BDF8] text-[#071426] hover:bg-[#0284C7] transition-colors cursor-pointer shrink-0"
          >
            Restart Assessment
          </button>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {PHOTOELECTRIC_QUIZ_QUESTIONS.map((q, qIdx) => {
          const userChoice = selectedAnswers[q.id];
          const isAnswered = userChoice !== undefined;
          const isCorrect = userChoice === q.correctIndex;

          return (
            <div
              key={q.id}
              className={`p-4 rounded-xl border transition-all ${
                showResults
                  ? isCorrect
                    ? 'bg-[#34D399]/5 border-[#34D399]/40'
                    : 'bg-[#FB7185]/5 border-[#FB7185]/40'
                  : 'bg-[#142B47] border-[#29415F]'
              }`}
            >
              {/* Question Title */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-xs font-bold text-[#38BDF8]">
                  Question {qIdx + 1} of {totalQuestions}
                </span>
                {showResults && (
                  <span className="flex items-center gap-1 text-xs font-bold">
                    {isCorrect ? (
                      <span className="text-[#34D399] flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Correct
                      </span>
                    ) : (
                      <span className="text-[#FB7185] flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Incorrect
                      </span>
                    )}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm font-semibold text-[#EAF2FF] mb-3 leading-relaxed">
                {q.question}
              </p>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2">
                {q.options.map((opt, optIdx) => {
                  const isThisSelected = userChoice === optIdx;
                  const isThisCorrect = q.correctIndex === optIdx;

                  let optClass = 'bg-[#071426] border-[#29415F] text-[#9FB3CC] hover:text-[#EAF2FF] hover:border-[#38BDF8]/40';

                  if (showResults) {
                    if (isThisCorrect) {
                      optClass = 'bg-[#34D399]/20 border-[#34D399] text-[#34D399] font-bold';
                    } else if (isThisSelected && !isThisCorrect) {
                      optClass = 'bg-[#FB7185]/20 border-[#FB7185] text-[#FB7185] line-through';
                    }
                  } else if (isThisSelected) {
                    optClass = 'bg-[#38BDF8]/20 border-[#38BDF8] text-[#38BDF8] font-bold';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      disabled={showResults}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center gap-2.5 cursor-pointer ${optClass}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold shrink-0">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation (Shown when submitted or when answered in instant mode) */}
              {showResults && (
                <div className="mt-3 p-3 rounded-lg bg-[#071426] border border-[#29415F] text-xs text-[#9FB3CC] leading-relaxed">
                  <strong className="text-[#EAF2FF]">Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!showResults && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-[#9FB3CC] font-mono">
            {answeredCount} of {totalQuestions} questions answered
          </span>
          <button
            onClick={() => setShowResults(true)}
            disabled={answeredCount === 0}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer ${
              answeredCount > 0
                ? 'bg-[#38BDF8] hover:bg-[#0284C7] text-[#071426]'
                : 'bg-[#142B47] text-[#9FB3CC]/40 border border-[#29415F] cursor-not-allowed'
            }`}
          >
            Submit Quiz & View Explanations
          </button>
        </div>
      )}
    </div>
  );
};
