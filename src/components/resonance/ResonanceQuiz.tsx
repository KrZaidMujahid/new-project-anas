/**
 * EQUATION 1 — Resonance Knowledge Evaluation Quiz (Light Theme)
 * 10 comprehensive multiple-choice questions covering all syllabus requirements
 * with immediate answer feedback, scientific explanations, and score tracking.
 */

import React, { useState } from 'react';
import { QuizQuestion } from '../../physics/resonance/types';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Under what physical condition does mechanical resonance occur in an oscillating system?',
    options: [
      'When the driving force amplitude is set to zero',
      'When the frequency of an external driving force matches or is very close to the system natural frequency',
      'When the damping coefficient exceeds the critical damping value',
      'When the mass of the oscillator is infinitely large',
    ],
    correctIndex: 1,
    explanation:
      'Resonance occurs when the external excitation frequency matches the natural frequency of the system, enabling efficient energy transfer and maximal amplitude buildup.',
  },
  {
    id: 2,
    question: 'How does the natural frequency f₀ of an ideal mass-spring system depend on its mass m and spring constant k?',
    options: [
      'f₀ is directly proportional to mass and independent of spring constant',
      'f₀ is directly proportional to √m and inversely proportional to √k',
      'f₀ = (1 / 2π) √(k / m)',
      'f₀ = 2π √(m · k)',
    ],
    correctIndex: 2,
    explanation:
      'For a mass-spring system, the natural angular frequency is ω₀ = √(k/m), which gives natural frequency f₀ = (1/2π)√(k/m).',
  },
  {
    id: 3,
    question: 'What is the fundamental difference between the "natural frequency" and the "driving frequency"?',
    options: [
      'Natural frequency is an intrinsic physical property of the oscillator, whereas driving frequency is imposed externally by the driver',
      'Natural frequency changes every second, while driving frequency is always constant',
      'Natural frequency only exists in electrical circuits, not in mechanical systems',
      'They are always identical in every physical experiment',
    ],
    correctIndex: 0,
    explanation:
      'Natural frequency is determined solely by the oscillator’s internal inertia and stiffness, while driving frequency is chosen independently by the external excitation source.',
  },
  {
    id: 4,
    question: 'How does increasing the viscous damping coefficient c affect the resonance curve of a driven oscillator?',
    options: [
      'The resonance peak becomes taller and narrower',
      'The resonance peak becomes lower, broader, and the curve flattens',
      'The resonance curve shifts to infinite frequency',
      'The system instantly ceases to oscillate at any frequency',
    ],
    correctIndex: 1,
    explanation:
      'Higher damping dissipates more energy per cycle, which depresses the maximum steady-state amplitude and broadens the half-power bandwidth.',
  },
  {
    id: 5,
    question: 'What is the theoretical steady-state amplitude of an ideal undamped oscillator (c = 0) driven at exact resonance (ω = ω₀)?',
    options: [
      'Zero amplitude',
      'Finite amplitude equal to F₀ / k',
      'Unbounded (theoretically approaches infinity)',
      'Equal to the driving force F₀',
    ],
    correctIndex: 2,
    explanation:
      'When damping c = 0, the denominator of A(ω) becomes zero at ω = ω₀, predicting an unbounded amplitude buildup in linear theory.',
  },
  {
    id: 6,
    question: 'What is the phase difference between displacement and driving force at exact undamped natural resonance?',
    options: [
      '0° (In phase)',
      '90° (π/2 radians out of phase)',
      '180° (π radians completely out of phase)',
      '360°',
    ],
    correctIndex: 1,
    explanation:
      'At resonance, the phase lag φ = atan2(cω, k - mω²) reaches 90° (π/2 rad), meaning velocity is perfectly in phase with the driving force.',
  },
  {
    id: 7,
    question: 'What does the Quality Factor (Q) of a resonant system quantify?',
    options: [
      'The physical weight of the oscillator in kilograms',
      'The sharpness of the resonance peak and the ratio of stored energy to energy dissipated per radian',
      'The price or grade of the spring material',
      'The number of cycles before the spring breaks',
    ],
    correctIndex: 1,
    explanation:
      'Quality factor Q = mω₀/c indicates how underdamped the resonator is. Higher Q corresponds to sharper resonance peaks and slower energy dissipation.',
  },
  {
    id: 8,
    question: 'If you quadruple the mass (m → 4m) while keeping spring constant k fixed, what happens to the natural frequency f₀?',
    options: [
      'f₀ is halved (divided by 2)',
      'f₀ is doubled (multiplied by 2)',
      'f₀ remains unchanged',
      'f₀ is quadrupled (multiplied by 4)',
    ],
    correctIndex: 0,
    explanation:
      'Because f₀ = (1/2π)√(k/m), multiplying m by 4 results in √(1/4) = 1/2 of the initial natural frequency.',
  },
  {
    id: 9,
    question: 'Why do marching soldiers break cadence when crossing suspension footbridges?',
    options: [
      'To prevent their uniform footsteps from matching the bridge natural frequency and triggering destructive resonance',
      'To walk faster and minimize their total time on the bridge',
      'Because marching boots are too heavy for suspension steel cables',
      'To reduce the total gravitational weight on the bridge deck',
    ],
    correctIndex: 0,
    explanation:
      'Marching in lockstep can provide a periodic driving force that matches a bridge torsional/flexural mode, leading to large resonance amplitudes (e.g., the 1831 Broughton Suspension Bridge collapse).',
  },
  {
    id: 10,
    question: 'At very low driving frequencies (ω << ω₀), what factor primarily limits the oscillation amplitude?',
    options: [
      'The mass inertia (m)',
      'The spring stiffness (k)',
      'The damping coefficient (c)',
      'Gravitational acceleration (g)',
    ],
    correctIndex: 1,
    explanation:
      'As ω → 0, the inertial term mω² and damping term cω vanish, leaving the static Hooke’s law displacement A ≈ F₀ / k governed strictly by spring stiffness.',
  },
];

export const ResonanceQuiz: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (selectedAnswers[questionId] !== undefined) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleRestart = () => {
    setSelectedAnswers({});
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isFinished = answeredCount === QUIZ_QUESTIONS.length;

  const score = QUIZ_QUESTIONS.reduce((acc, q) => {
    return selectedAnswers[q.id] === q.correctIndex ? acc + 1 : acc;
  }, 0);

  const percentage = Math.round((score / QUIZ_QUESTIONS.length) * 100);

  return (
    <div className="space-y-4 text-[#172033]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-[#2563EB]">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#172033]">
              Resonance Knowledge Evaluation Quiz
            </h2>
            <p className="text-xs text-[#64748B]">
              10 interactive concept questions testing physical understanding of driven harmonic motion
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
            Score: {score} / {QUIZ_QUESTIONS.length} ({percentage}%)
          </span>
          <button
            onClick={handleRestart}
            className="flex items-center gap-1 px-3 py-1 text-xs text-[#172033] hover:bg-slate-100 rounded-md border border-slate-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Restart Quiz</span>
          </button>
        </div>
      </div>

      {/* Completion Banner */}
      {isFinished && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-900">Quiz Completed!</h3>
              <p className="text-xs text-emerald-700">
                You scored <strong className="text-emerald-900">{score}</strong> out of{' '}
                <strong>{QUIZ_QUESTIONS.length}</strong> ({percentage}%).
              </p>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="px-3 py-1.5 text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            Retake Quiz
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
              className={`p-4 rounded-xl border transition-all ${
                hasAnswered
                  ? isCorrect
                    ? 'bg-emerald-50/50 border-emerald-300'
                    : 'bg-red-50/50 border-red-300'
                  : 'bg-[#F8FAFC] border-slate-200'
              }`}
            >
              <div className="flex items-start gap-2.5 mb-3">
                <span className="font-mono text-xs font-bold text-[#2563EB] shrink-0">
                  Q{qIdx + 1}.
                </span>
                <h4 className="text-xs font-bold text-[#172033] leading-relaxed">{q.question}</h4>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6">
                {q.options.map((opt, optIdx) => {
                  let optStyle =
                    'bg-white border-slate-200 text-[#172033] hover:border-blue-400 hover:bg-blue-50/30';

                  if (hasAnswered) {
                    if (optIdx === q.correctIndex) {
                      optStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold';
                    } else if (optIdx === userAnswer) {
                      optStyle = 'bg-red-100 border-red-400 text-red-900 line-through';
                    } else {
                      optStyle = 'bg-slate-50 border-slate-200 text-slate-400';
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
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {hasAnswered && optIdx === userAnswer && !isCorrect && (
                        <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Immediate Feedback & Explanation */}
              {hasAnswered && (
                <div
                  className={`mt-3 pl-6 pt-2.5 border-t text-xs leading-relaxed ${
                    isCorrect
                      ? 'border-emerald-200 text-emerald-800'
                      : 'border-red-200 text-red-800'
                  }`}
                >
                  <p>
                    <strong className="text-[#172033]">Explanation: </strong>
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
