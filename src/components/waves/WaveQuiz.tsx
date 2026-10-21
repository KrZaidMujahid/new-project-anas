/**
 * EQUATION 1 — Interactive Wave Interference Knowledge Test (Section 10)
 * 8 multi-choice questions with immediate answer feedback, scientific explanations,
 * score tracking, and restart capability.
 */

import React, { useState } from 'react';
import { QuizQuestion } from '../../physics/waves/types';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'According to the principle of superposition, when two waves overlap in a medium, what is the resultant displacement at any point?',
    options: [
      'The geometric mean of the displacements',
      'The algebraic sum of the individual wave displacements',
      'The product of the two wave frequencies',
      'Always zero due to mutual wave cancellation',
    ],
    correctIndex: 1,
    explanation:
      'The principle of superposition states that the resultant displacement is the algebraic sum of the displacements caused by each individual wave: y = y₁ + y₂.',
  },
  {
    id: 2,
    question: 'Why must two wave sources be "coherent" to produce a sustained, stationary interference pattern?',
    options: [
      'They must travel at different speeds through the medium',
      'They must maintain the same frequency and a constant phase difference over time',
      'They must emit waves in completely opposite directions',
      'They must have different wavelengths to prevent destructive cancellation',
    ],
    correctIndex: 1,
    explanation:
      'Coherence requires identical frequency and a constant phase difference. If the relative phase changes randomly, the bright and dark fringes shift continuously, averaging out to uniform intensity.',
  },
  {
    id: 3,
    question: 'For two coherent sources emitting in phase (Δφ₀ = 0°), what is the condition for CONSTRUCTIVE interference at an observation point?',
    options: [
      'Path difference Δr = (n + ½)λ',
      'Path difference Δr = nλ (where n = 0, ±1, ±2, ...)',
      'Path difference Δr = λ / (2n)',
      'Path difference Δr must be zero everywhere',
    ],
    correctIndex: 1,
    explanation:
      'When path difference is an integer number of wavelengths (Δr = nλ), the waves arrive exactly in phase (Δφ = 2πn), leading to maximal wave reinforcement.',
  },
  {
    id: 4,
    question: 'At a destructive interference node, what is the resultant amplitude if two identical waves each of amplitude A overlap with phase difference Δφ = 180° (π rad)?',
    options: ['4A', '2A', 'A', '0'],
    correctIndex: 3,
    explanation:
      'At Δφ = 180°, A_r = 2A|cos(180°/2)| = 2A|cos 90°| = 0. The crest of one wave exactly counters the equal trough of the other.',
  },
  {
    id: 5,
    question: 'What is the relationship between the path difference Δr and the resulting phase difference Δφ for two waves of wavelength λ?',
    options: [
      'Δφ = (2π / λ) · Δr',
      'Δφ = (λ / 2π) · Δr',
      'Δφ = 2π · λ · Δr',
      'Δφ = Δr / (2π)',
    ],
    correctIndex: 0,
    explanation:
      'Because one full wavelength λ corresponds to 2π radians of phase, the phase difference is Δφ = k · Δr = (2π/λ) · Δr.',
  },
  {
    id: 6,
    question: 'If two coherent waves each of amplitude A = 1.0 m interfere constructively in phase, what is the ratio of resultant intensity I to the intensity of a single source I₀?',
    options: [
      'I / I₀ = 1',
      'I / I₀ = 2',
      'I / I₀ = 4',
      'I / I₀ = 8',
    ],
    correctIndex: 2,
    explanation:
      'Resultant amplitude doubles (A_r = 2A). Because wave intensity is proportional to the square of amplitude (I ∝ A²), I = (2A)² = 4A² = 4I₀.',
  },
  {
    id: 7,
    question: 'How does increasing the wavelength λ affect the spatial spacing between adjacent interference fringes in a two-source setup?',
    options: [
      'The fringe spacing increases (fringes spread farther apart)',
      'The fringe spacing decreases (fringes become tightly packed)',
      'The fringe spacing remains completely unchanged',
      'All interference fringes instantly disappear',
    ],
    correctIndex: 0,
    explanation:
      'Fringe separation β is directly proportional to wavelength (β ∝ λ/d). Increasing λ increases the angular separation between adjacent maxima.',
  },
  {
    id: 8,
    question: 'Which of the following modern technologies relies directly on the principle of destructive wave interference?',
    options: [
      'Laser barcode scanners',
      'Active noise-cancelling headphones',
      'Solar photovoltaic panels',
      'Lithium-ion batteries',
    ],
    correctIndex: 1,
    explanation:
      'Active noise cancellation samples incoming sound waves and generates an inverted acoustic wave with 180° phase difference to destructively cancel ambient noise.',
  },
];

export const WaveQuiz: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (selectedAnswers[questionId] !== undefined) return; // Prevent re-selection
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isFinished = answeredCount === QUIZ_QUESTIONS.length;

  const score = QUIZ_QUESTIONS.reduce((acc, q) => {
    return selectedAnswers[q.id] === q.correctIndex ? acc + 1 : acc;
  }, 0);

  return (
    <div className="bg-[#101D30] border border-slate-800 rounded-xl p-4 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Wave Interference Knowledge Test
            </h2>
            <p className="text-[11px] text-slate-400">
              Interactive 8-question concept evaluation for Class 11 & 12
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-cyan-300">
            Score: {score} / {QUIZ_QUESTIONS.length}
          </span>
          <button
            onClick={handleRestart}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restart Quiz</span>
          </button>
        </div>
      </div>

      {/* Completion Banner */}
      {isFinished && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-purple-950/40 to-emerald-950/40 border border-cyan-500/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Quiz Completed!</h3>
              <p className="text-xs text-slate-300">
                You scored <strong className="text-emerald-400">{score}</strong> out of{' '}
                <strong>{QUIZ_QUESTIONS.length}</strong> (
                {Math.round((score / QUIZ_QUESTIONS.length) * 100)}%).
              </p>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="px-3 py-1.5 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {QUIZ_QUESTIONS.map((q, qIdx) => {
          const userAnswer = selectedAnswers[q.id];
          const hasAnswered = userAnswer !== undefined;
          const isCorrect = userAnswer === q.correctIndex;

          return (
            <div
              key={q.id}
              className={`p-3.5 rounded-lg border transition-all ${
                hasAnswered
                  ? isCorrect
                    ? 'bg-emerald-950/15 border-emerald-500/40'
                    : 'bg-rose-950/15 border-rose-500/40'
                  : 'bg-[#07111F] border-slate-800'
              }`}
            >
              <div className="flex items-start gap-2.5 mb-2.5">
                <span className="font-mono text-xs font-bold text-cyan-400 shrink-0">
                  Q{qIdx + 1}.
                </span>
                <h4 className="text-xs font-semibold text-white leading-relaxed">{q.question}</h4>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6">
                {q.options.map((opt, optIdx) => {
                  let optStyle =
                    'bg-[#101D30] border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white';

                  if (hasAnswered) {
                    if (optIdx === q.correctIndex) {
                      optStyle = 'bg-emerald-950/50 border-emerald-500/70 text-emerald-200 font-bold';
                    } else if (optIdx === userAnswer) {
                      optStyle = 'bg-rose-950/50 border-rose-500/70 text-rose-300 line-through';
                    } else {
                      optStyle = 'bg-[#101D30]/50 border-slate-900 text-slate-600';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={hasAnswered}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`text-left p-2.5 rounded-lg border text-xs transition-all cursor-pointer disabled:cursor-default flex items-center justify-between gap-2 ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {hasAnswered && optIdx === q.correctIndex && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                      {hasAnswered && optIdx === userAnswer && !isCorrect && (
                        <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Immediate Feedback & Scientific Explanation */}
              {hasAnswered && (
                <div
                  className={`mt-3 pl-6 pt-2 border-t text-[11px] leading-relaxed ${
                    isCorrect
                      ? 'border-emerald-500/20 text-emerald-300/90'
                      : 'border-rose-500/20 text-rose-300/90'
                  }`}
                >
                  <p>
                    <strong className="text-white">Explanation: </strong>
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
