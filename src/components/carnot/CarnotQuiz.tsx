/**
 * EQUATION 1 — Carnot Heat Engine Interactive Quiz
 * 10 rigorous conceptual and calculation questions assessing mastery
 * of reversible cycles, efficiency equations, First/Second Laws, and entropy.
 */

import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'A Carnot heat engine operates between a hot reservoir at 600 K and a cold reservoir at 300 K. What is its theoretical thermal efficiency?',
    options: ['25%', '33.3%', '50%', '100%'],
    correctIndex: 2,
    explanation: 'Carnot efficiency is calculated by η = 1 - T_C / T_H = 1 - 300 / 600 = 1 - 0.50 = 50%.',
  },
  {
    id: 2,
    question: 'When computing Carnot efficiency, what temperature scale must be used in the formula η = 1 - T_C / T_H?',
    options: [
      'Celsius (°C)',
      'Fahrenheit (°F)',
      'Kelvin (K), the absolute thermodynamic scale',
      'Any temperature scale yields the same result',
    ],
    correctIndex: 2,
    explanation: 'The Carnot theorem is derived from fundamental thermodynamic relations that require the absolute temperature scale in Kelvin (T_K = T_°C + 273.15). Using Celsius leads to mathematically incorrect results.',
  },
  {
    id: 3,
    question: 'During Stage 1 of the Carnot cycle (Reversible Isothermal Expansion A → B), what is the change in internal energy (ΔU) of an ideal gas?',
    options: [
      'ΔU > 0, because heat enters the gas',
      'ΔU = 0, because temperature remains strictly constant at T_H',
      'ΔU < 0, because the gas expands and does work',
      'ΔU depends on whether the gas is monatomic or diatomic',
    ],
    correctIndex: 1,
    explanation: 'For an ideal gas, internal energy depends exclusively on temperature (U = n C_v T). Since the process is isothermal (constant T_H), ΔU_AB = 0, which means all absorbed heat Q_H is converted into expansion work W_AB.',
  },
  {
    id: 4,
    question: 'Why does the temperature of the working gas drop during Stage 2 (Adiabatic Expansion B → C)?',
    options: [
      'Heat is rejected to the cold reservoir',
      'The gas is insulated (Q = 0) and performs work solely by depleting its internal energy (W = -ΔU)',
      'The piston stops moving and allows the gas to equilibrate',
      'The pressure increases rapidly, causing cooling',
    ],
    correctIndex: 1,
    explanation: 'In an adiabatic process, the cylinder is thermally insulated (Q = 0). By the First Law of Thermodynamics, ΔU = Q - W = -W. Because the gas expands and performs positive work (W > 0), its internal energy drops (ΔU < 0), causing its temperature to decrease from T_H to T_C.',
  },
  {
    id: 5,
    question: 'What does the area enclosed by the four curves on a Pressure–Volume (P–V) indicator diagram represent?',
    options: [
      'The total heat absorbed Q_H only',
      'The change in entropy of the surroundings',
      'The net mechanical work performed per cycle W_net = ∮ P dV',
      'The volume of the cylinder when fully expanded',
    ],
    correctIndex: 2,
    explanation: 'Work in a quasi-static expansion or compression is given by W = ∫ P dV. Around a closed clockwise loop, the enclosed area represents the net useful work output per cycle: W_net = ∮ P dV = Q_H - Q_C.',
  },
  {
    id: 6,
    question: 'Why is it physically impossible to build a cyclic heat engine with 100% thermal efficiency (η = 1)?',
    options: [
      'Because friction in the piston cannot be completely eliminated',
      'The Second Law of Thermodynamics (Kelvin-Planck statement) requires that heat must be rejected to a cold sink (Q_C > 0) unless T_C = 0 K, which is unattainable by the Third Law',
      'Because the universal gas constant R varies with pressure',
      'Gases cannot expand reversibly in the real world',
    ],
    correctIndex: 1,
    explanation: 'For η = 1 - T_C / T_H to equal 100%, the cold reservoir temperature T_C must be Absolute Zero (0 K). The Third Law of Thermodynamics states that 0 K cannot be reached in a finite sequence of processes. Furthermore, the Kelvin-Planck statement prohibits converting absorbed heat entirely into work in a cycle.',
  },
  {
    id: 7,
    question: 'What is the net change in entropy of the working gas (ΔS_gas) after completing one full, closed Carnot cycle?',
    options: [
      'ΔS_gas > 0, because entropy of the universe always increases',
      'ΔS_gas = 0, because entropy is a state function and the gas returns to its initial state A',
      'ΔS_gas < 0, because heat was rejected to the cold reservoir',
      'ΔS_gas = Q_H / T_H',
    ],
    correctIndex: 1,
    explanation: 'Entropy is a thermodynamic state property. After traversing a closed cycle that returns to initial state A, the net change in entropy of the working substance is identically zero: ∮ dS = 0 (Q_H / T_H - Q_C / T_C = 0).',
  },
  {
    id: 8,
    question: 'To increase the Carnot efficiency of an engine operating between T_H = 600 K and T_C = 300 K by 10% (from 50% to 60%), which of the following adjustments would achieve this?',
    options: [
      'Increase T_H to 750 K (keeping T_C = 300 K)',
      'Decrease T_C to 240 K (keeping T_H = 600 K)',
      'Both of the above adjustments achieve η = 60%',
      'Double the number of moles of gas',
    ],
    correctIndex: 2,
    explanation: 'If T_H is raised to 750 K: η = 1 - 300/750 = 1 - 0.40 = 60%. If T_C is lowered to 240 K: η = 1 - 240/600 = 1 - 0.40 = 60%. Both achieve exactly 60% efficiency. Changing moles has no effect on Carnot efficiency.',
  },
  {
    id: 9,
    question: 'What does Carnot’s Theorem state regarding real (irreversible) engines versus a reversible Carnot engine?',
    options: [
      'Real engines are always more efficient because friction generates additional heat',
      'No heat engine operating between two given thermal reservoirs can be more efficient than a reversible Carnot engine operating between the same reservoirs',
      'All heat engines have the same efficiency regardless of reversibility',
      'A Carnot engine only works with monatomic helium gas',
    ],
    correctIndex: 1,
    explanation: 'Carnot’s Theorem proves that a reversible engine achieves the maximum possible theoretical efficiency between any two temperatures. Any real engine with friction, turbulence, or irreversible heat transfer will have η_real < η_Carnot.',
  },
  {
    id: 10,
    question: 'How do the work terms of the two adiabatic stages (Stage 2: B → C and Stage 4: D → A) compare in magnitude?',
    options: [
      'W_BC is much greater than W_DA because the gas is hotter',
      'They are equal in magnitude and opposite in sign: W_BC = -W_DA = nR(T_H - T_C)/(γ - 1)',
      'W_DA is zero because compression requires no work',
      'They cannot be compared without knowing the cylinder radius',
    ],
    correctIndex: 1,
    explanation: 'Both adiabatic stages operate between the same two temperatures T_H and T_C. For Stage 2, W_BC = nR(T_H - T_C)/(γ - 1) > 0. For Stage 4, W_DA = nR(T_C - T_H)/(γ - 1) = -W_BC < 0. Thus, the net work of the two adiabatic processes exactly cancels (W_BC + W_DA = 0), leaving W_net = W_AB + W_CD.',
  },
];

export const CarnotQuiz: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (questionId: number, optionIndex: number) => {
    if (showResults) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isComplete = answeredCount === QUIZ_QUESTIONS.length;
  const score = calculateScore();

  return (
    <div className="bg-[#102740] border border-[#29445F] rounded-xl p-5 shadow-xl flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#29445F]/70">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#38BDF8]" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Interactive Thermodynamic Mastery Quiz
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-[#AFC2D8]">
            Progress: <strong className="text-white">{answeredCount}</strong> / {QUIZ_QUESTIONS.length}
          </span>
          {showResults && (
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Award className="w-4 h-4" /> Score: {score} / {QUIZ_QUESTIONS.length} ({((score / QUIZ_QUESTIONS.length) * 100).toFixed(0)}%)
            </span>
          )}
        </div>
      </div>

      {/* Quiz Questions List */}
      <div className="space-y-4">
        {QUIZ_QUESTIONS.map((q, idx) => {
          const selected = selectedAnswers[q.id];
          const isCorrect = selected === q.correctIndex;

          return (
            <div
              key={q.id}
              className={`p-4 rounded-xl border transition-all ${
                showResults
                  ? isCorrect
                    ? 'bg-emerald-950/20 border-emerald-500/50'
                    : 'bg-rose-950/20 border-rose-500/50'
                  : 'bg-[#0B1F36] border-[#29445F]'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span className="text-xs font-mono font-bold text-[#38BDF8] px-2 py-0.5 rounded bg-[#16334F] border border-[#29445F]">
                  Q{idx + 1}
                </span>
                <h4 className="text-xs font-semibold text-white leading-relaxed flex-1">
                  {q.question}
                </h4>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pl-8">
                {q.options.map((opt, optIdx) => {
                  const isOptionSelected = selected === optIdx;
                  const isOptionCorrect = optIdx === q.correctIndex;

                  let optionStyle =
                    'bg-[#102740] border-[#29445F] text-[#AFC2D8] hover:border-slate-500 hover:text-white';

                  if (showResults) {
                    if (isOptionCorrect) {
                      optionStyle = 'bg-emerald-900/40 border-emerald-500 text-white font-bold';
                    } else if (isOptionSelected && !isCorrect) {
                      optionStyle = 'bg-rose-900/40 border-rose-500 text-white line-through';
                    } else {
                      optionStyle = 'bg-[#102740]/40 border-[#29445F]/40 text-slate-500';
                    }
                  } else if (isOptionSelected) {
                    optionStyle = 'bg-[#16334F] border-[#38BDF8] text-white font-semibold shadow-sm';
                  }

                  return (
                    <button
                      key={`q${q.id}-opt${optIdx}`}
                      onClick={() => handleSelect(q.id, optIdx)}
                      disabled={showResults}
                      className={`p-2.5 rounded-lg text-left text-xs border transition-all cursor-pointer flex items-center justify-between ${optionStyle}`}
                    >
                      <span className="flex-1">{opt}</span>
                      {showResults && isOptionCorrect && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-2" />
                      )}
                      {showResults && isOptionSelected && !isCorrect && (
                        <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation upon submission */}
              {showResults && (
                <div className="mt-3 ml-8 p-3 rounded-lg bg-[#102740] border border-[#29445F] text-xs text-[#AFC2D8]">
                  <span className="font-bold text-white mr-1">Explanation:</span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Submission & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#29445F]/70">
        <div className="text-xs text-[#AFC2D8]">
          {!showResults
            ? `${QUIZ_QUESTIONS.length - answeredCount} question(s) remaining.`
            : `You scored ${score} of ${QUIZ_QUESTIONS.length} (${((score / QUIZ_QUESTIONS.length) * 100).toFixed(0)}%).`}
        </div>

        <div className="flex items-center gap-2">
          {!showResults ? (
            <button
              onClick={() => setShowResults(true)}
              disabled={answeredCount === 0}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                answeredCount > 0
                  ? 'bg-[#38BDF8] hover:bg-[#0284C7] text-slate-950 shadow-md'
                  : 'bg-[#16334F] text-[#AFC2D8] border border-[#29445F] cursor-not-allowed opacity-50'
              }`}
            >
              Check Answers
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-[#16334F] hover:bg-[#1E4369] text-white border border-[#29445F] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Quiz</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
