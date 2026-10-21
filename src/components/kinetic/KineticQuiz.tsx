/**
 * EQUATION 1 — Kinetic Theory of Gases Interactive Examination Quiz
 * 10 rigorous conceptual & quantitative questions with immediate feedback,
 * explanations, and score tracking.
 */

import React, { useState } from 'react';
import { QuizQuestion } from '../../physics/kinetic/types';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  BookOpen,
} from 'lucide-react';

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is the ideal gas equation?',
    options: ['P + V = nRT', 'PV = nRT', 'P/V = nRT', 'PV = n/R'],
    correctAnswerIndex: 1, // B
    explanation:
      'The ideal gas equation of state relates absolute pressure P, volume V, amount of substance n in moles, universal gas constant R, and absolute temperature T: PV = nRT.',
  },
  {
    id: 2,
    question:
      'What is the average translational kinetic energy per molecule of an ideal gas?',
    options: ['k_B T', '(1/2) k_B T', '(3/2) k_B T', '3 k_B T'],
    correctAnswerIndex: 2, // C
    explanation:
      'From equipartition of energy, each translational degree of freedom contributes (1/2) k_B T. In 3 dimensions (x, y, z), the average translational kinetic energy per molecule is exactly ⟨E_k⟩ = (3/2) k_B T.',
  },
  {
    id: 3,
    question:
      'If the absolute temperature of a gas increases while its volume and amount remain fixed, what happens to its pressure?',
    options: ['It decreases.', 'It remains constant.', 'It increases.', 'It becomes zero.'],
    correctAnswerIndex: 2, // C
    explanation:
      "According to Gay-Lussac's Law and the ideal gas equation P = (nR/V)·T, pressure is directly proportional to absolute temperature at constant volume. Higher temperature means molecules move faster and hit the walls more forcefully and frequently.",
  },
  {
    id: 4,
    question:
      'Which characteristic speed is calculated using the formula: v = √(3RT/M)?',
    options: [
      'Mean speed',
      'Root-mean-square (RMS) speed',
      'Most probable speed',
      'Speed of sound',
    ],
    correctAnswerIndex: 1, // B
    explanation:
      'The root-mean-square speed is v_rms = √(3RT/M). The most probable speed is √(2RT/M) and the mean speed is √(8RT/πM).',
  },
  {
    id: 5,
    question:
      'At the same temperature, which gas generally has a greater RMS molecular speed?',
    options: [
      'The gas with the greater molar mass.',
      'The gas with the lower molar mass.',
      'Both always have identical RMS speeds.',
      'Neither gas has molecular motion.',
    ],
    correctAnswerIndex: 1, // B
    explanation:
      'Because v_rms = √(3RT/M), speed is inversely proportional to the square root of molar mass (1/√M). At the same temperature, lighter molecules (like Helium, 4 g/mol) move much faster than heavy molecules (like Argon, 40 g/mol).',
  },
  {
    id: 6,
    question:
      'At constant temperature and fixed amount of ideal gas, what happens when volume decreases?',
    options: [
      'Pressure decreases.',
      'Pressure increases.',
      'Pressure stays zero.',
      'Molecular mass increases.',
    ],
    correctAnswerIndex: 1, // B
    explanation:
      "According to Boyle's law (P ∝ 1/V), decreasing volume crowds gas molecules into a smaller space, causing them to collide with the walls more frequently per unit area, resulting in increased pressure.",
  },
  {
    id: 7,
    question:
      'What does the total area under a normalized Maxwell–Boltzmann speed distribution curve represent?',
    options: [
      'Gas pressure',
      'Absolute temperature',
      'Total probability, identically equal to 1',
      'Molar mass of the gas',
    ],
    correctAnswerIndex: 2, // C
    explanation:
      'Because f(v) is a probability density function, integrating f(v) dv from speed 0 to infinity equals the total probability of a molecule having some real speed, which is identically 1.0 (100%).',
  },
  {
    id: 8,
    question: 'Why does macroscopic gas pressure arise on container walls?',
    options: [
      'Molecules are completely stationary and press down by gravity.',
      'Molecules transfer momentum during repeated collisions with the container walls.',
      'Gas molecules have zero kinetic energy.',
      'Temperature is measured in pascals.',
    ],
    correctAnswerIndex: 1, // B
    explanation:
      'Whenever a gas molecule collides elastically with a wall, its normal velocity reverses, transferring momentum Δp = 2mv_x to the wall. The cumulative rate of these momentum transfers per unit area constitutes macroscopic pressure P = F/A.',
  },
  {
    id: 9,
    question:
      'Does the average translational kinetic energy per molecule ⟨E_k⟩ of an ideal gas depend on the molecular mass of the gas?',
    options: [
      'Yes, heavy molecules always possess higher kinetic energy.',
      'No, ⟨E_k⟩ depends solely on absolute temperature T (⟨E_k⟩ = 3/2 k_B T).',
      'Yes, light molecules always possess higher kinetic energy.',
      'Only if the volume of the container is zero.',
    ],
    correctAnswerIndex: 1, // B
    explanation:
      'In an ideal gas, average translational kinetic energy depends strictly on temperature: ⟨E_k⟩ = (3/2) k_B T. While lighter molecules move with higher velocities, their smaller mass exactly offsets this, leaving average kinetic energy identical across all ideal gases at the same temperature.',
  },
  {
    id: 10,
    question:
      'If the absolute temperature of a gas is quadrupled from 200 K to 800 K, by what factor does its RMS molecular speed increase?',
    options: ['Factor of 2 (doubles)', 'Factor of 4 (quadruples)', 'Factor of 16', 'It remains unchanged'],
    correctAnswerIndex: 0, // A
    explanation:
      'Since v_rms ∝ √T, multiplying temperature by 4 increases the RMS speed by a factor of √4 = 2 (it doubles).',
  },
];

export const KineticQuiz: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (showResults) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  const totalAnswered = Object.keys(selectedAnswers).length;
  const score = Object.entries(selectedAnswers).reduce((acc, [qId, ans]) => {
    const q = QUIZ_QUESTIONS.find((item) => item.id === parseInt(qId, 10));
    return q && q.correctAnswerIndex === ans ? acc + 1 : acc;
  }, 0);

  return (
    <div className="bg-[#102740] rounded-xl border border-[#29445F] p-5 shadow-xl space-y-5 text-[#F1F5F9]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#29445F] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
            <Award className="w-4 h-4 text-[#FBBF24]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F1F5F9] tracking-wide">
              Kinetic Theory Mastery Quiz
            </h3>
            <p className="text-[11px] text-[#AFC2D8]">
              Test your understanding of molecular motion, gas laws, and Maxwell-Boltzmann distributions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showResults ? (
            <div className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-[#16334F] border border-[#29445F] text-[#4ADE80]">
              Score: {score} / {QUIZ_QUESTIONS.length} ({Math.round((score / QUIZ_QUESTIONS.length) * 100)}%)
            </div>
          ) : (
            <div className="text-xs font-mono text-[#AFC2D8]">
              Progress: {totalAnswered} / {QUIZ_QUESTIONS.length}
            </div>
          )}

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#16334F] hover:bg-[#29445F] text-xs font-medium text-[#AFC2D8] hover:text-white transition-colors cursor-pointer border border-[#29445F]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake</span>
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {QUIZ_QUESTIONS.map((q, idx) => {
          const userChoice = selectedAnswers[q.id];
          const isAnswered = userChoice !== undefined;
          const isCorrect = userChoice === q.correctAnswerIndex;

          return (
            <div
              key={q.id}
              className={`p-4 rounded-xl border transition-all ${
                showResults
                  ? isCorrect
                    ? 'bg-[#0B1F36] border-[#4ADE80]/50'
                    : 'bg-[#0B1F36] border-rose-500/50'
                  : isAnswered
                  ? 'bg-[#0B1F36] border-[#38BDF8]/50'
                  : 'bg-[#071426] border-[#29445F]'
              }`}
            >
              {/* Question Title */}
              <div className="flex items-start gap-2.5 mb-3">
                <span className="w-6 h-6 rounded-md bg-[#16334F] text-[#38BDF8] text-xs font-mono font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-white leading-snug pt-0.5">
                  {q.question}
                </span>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {q.options.map((opt, optIdx) => {
                  const isThisSelected = userChoice === optIdx;
                  const isThisCorrect = optIdx === q.correctAnswerIndex;

                  let optionStyle =
                    'bg-[#102740] border-[#29445F] text-[#AFC2D8] hover:border-[#38BDF8] hover:text-white';

                  if (showResults) {
                    if (isThisCorrect) {
                      optionStyle = 'bg-[#4ADE80]/20 border-[#4ADE80] text-[#4ADE80] font-bold';
                    } else if (isThisSelected && !isThisCorrect) {
                      optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold';
                    } else {
                      optionStyle = 'bg-[#102740]/40 border-[#29445F] text-slate-500';
                    }
                  } else if (isThisSelected) {
                    optionStyle =
                      'bg-[#38BDF8]/20 border-[#38BDF8] text-[#38BDF8] font-bold shadow-xs';
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={showResults}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${optionStyle} ${
                        showResults ? 'cursor-default' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] opacity-75">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span>{opt}</span>
                      </div>
                      {showResults && isThisCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0" />
                      )}
                      {showResults && isThisSelected && !isThisCorrect && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation on Show Results */}
              {showResults && (
                <div
                  className={`mt-3 p-3 rounded-lg text-xs leading-relaxed border ${
                    isCorrect
                      ? 'bg-[#4ADE80]/10 border-[#4ADE80]/30 text-emerald-300'
                      : 'bg-rose-950/20 border-rose-800/40 text-rose-200'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{isCorrect ? 'Correct!' : 'Incorrect.'}</span>
                  </div>
                  <p>{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!showResults && (
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => setShowResults(true)}
            disabled={totalAnswered < QUIZ_QUESTIONS.length}
            className="px-5 py-2.5 rounded-lg bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-[#071426] text-xs font-bold transition-all cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {totalAnswered < QUIZ_QUESTIONS.length
              ? `Answer All Questions (${totalAnswered}/${QUIZ_QUESTIONS.length})`
              : 'Submit Answers for Evaluation'}
          </button>
        </div>
      )}
    </div>
  );
};
