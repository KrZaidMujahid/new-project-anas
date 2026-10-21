/**
 * EQUATION 1 — Bohr Model Interactive Mastery Quiz
 * 10 conceptual and computational multiple-choice questions assessing
 * quantized energy levels, atomic transitions, spectral series, and Bohr postulates.
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

const BOHR_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is the binding energy of an electron in the ground state (n = 1) of a hydrogen atom?',
    options: ['0.0 eV', '-3.40 eV', '-13.60 eV', '-27.20 eV'],
    correctIndex: 2,
    explanation:
      'In the Bohr model, the ground state energy is E₁ = -13.6 eV / 1² = -13.60 eV. The negative sign signifies that the electron is electrostatically bound in the attractive potential well of the proton.',
  },
  {
    id: 2,
    question: 'How does the energy E_n of the hydrogen electron depend on the principal quantum number n?',
    options: [
      'E_n ∝ n',
      'E_n ∝ -1/n',
      'E_n ∝ -1/n²',
      'E_n ∝ n²',
    ],
    correctIndex: 2,
    explanation:
      'The Bohr energy equation is E_n = -13.6 eV / n². Because energy varies inversely with the square of n, the levels become much closer together as n increases towards 0 eV.',
  },
  {
    id: 3,
    question: 'How does the physical orbital radius r_n scale with principal quantum number n in the Bohr model?',
    options: [
      'Linearly with n (r_n = a₀ · n)',
      'With the square of n (r_n = a₀ · n²)',
      'Inversely with n (r_n = a₀ / n)',
      'Exponentially with n (r_n = a₀ · 2ⁿ)',
    ],
    correctIndex: 1,
    explanation:
      'By equating centripetal force to Coulomb attraction with quantized angular momentum L = nℏ, the radius is r_n = a₀ n², where a₀ ≈ 0.529 Å. Thus, the n = 2 orbit is 4 times larger than the n = 1 ground state.',
  },
  {
    id: 4,
    question: 'What happens to the atom during photon absorption?',
    options: [
      'The electron drops to a lower level and destroys the photon',
      'The electron absorbs a photon with energy equal to ΔE and jumps to a higher allowed level',
      'The proton absorbs the photon and increases its mass',
      'The electron gains mass without changing orbital radius',
    ],
    correctIndex: 1,
    explanation:
      'During absorption, an incoming photon with energy hν exactly matching the difference ΔE = E_final - E_initial is absorbed, promoting the electron to a higher energy, larger radius orbit.',
  },
  {
    id: 5,
    question: 'Which electron transition produces the iconic Balmer H-alpha (H-α) spectral line?',
    options: [
      'n = 2 → n = 1',
      'n = 3 → n = 2',
      'n = 4 → n = 2',
      'n = ∞ → n = 1',
    ],
    correctIndex: 1,
    explanation:
      'The transition from n = 3 down to n = 2 emits a photon of energy ΔE = 1.889 eV and wavelength λ = 656.3 nm, producing the prominent red H-alpha line seen in astrophysical emission nebulae.',
  },
  {
    id: 6,
    question: 'What is the approximate wavelength and spectral region of the Balmer H-alpha line?',
    options: [
      '121.6 nm in the Ultraviolet',
      '486.1 nm in the Blue-Green',
      '656.3 nm in the Visible Red',
      '1875.1 nm in the Infrared',
    ],
    correctIndex: 2,
    explanation:
      'The H-alpha line has a wavelength of approximately 656.3 nm, which falls squarely in the deep red portion of the visible electromagnetic spectrum (380–750 nm).',
  },
  {
    id: 7,
    question: 'Which hydrogen spectral series consists of transitions that decay into the ground state (n_f = 1)?',
    options: ['Balmer series', 'Lyman series', 'Paschen series', 'Brackett series'],
    correctIndex: 1,
    explanation:
      'The Lyman series consists of transitions ending at n_f = 1. Because the energy drop into the ground state is at least 10.2 eV (n=2 → 1), all Lyman lines lie in the ultraviolet region.',
  },
  {
    id: 8,
    question: 'What physical condition corresponds to the ionization limit (E = 0 eV) of hydrogen?',
    options: [
      'The electron has fallen into the proton nucleus',
      'The electron has zero kinetic energy and is completely unbound (infinite distance from the proton)',
      'The atom has exploded due to nuclear fusion',
      'The principal quantum number has reached n = 0',
    ],
    correctIndex: 1,
    explanation:
      'At E = 0 eV (corresponding to n → ∞), the electron has escaped the Coulomb potential well of the proton. It is no longer bound. Any energy above 0 eV represents the continuous kinetic energy of a free electron.',
  },
  {
    id: 9,
    question: 'If a transition from n = 4 to n = 2 releases a photon with λ = 486.1 nm, what happens during the reverse transition (n = 2 to n = 4)?',
    options: [
      'A photon of twice the wavelength is emitted',
      'A photon of 486.1 nm is absorbed with the exact same energy magnitude (2.55 eV)',
      'No transition is possible in reverse',
      'The electron is ionized immediately',
    ],
    correctIndex: 1,
    explanation:
      'Reversing the transition changes emission into absorption, but the absolute magnitude of the energy difference (|ΔE| = 2.55 eV) and the corresponding resonant photon wavelength (486.1 nm) remain identical.',
  },
  {
    id: 10,
    question: 'Which of the following is a recognized scientific limitation of the historical Bohr model?',
    options: [
      'It cannot accurately predict the energy levels of multi-electron atoms like Helium',
      'It assumes exact classical orbital positions and momenta, violating Heisenberg’s uncertainty principle',
      'It cannot explain why certain spectral lines are brighter than others (transition probabilities)',
      'All of the above are valid limitations of the Bohr model',
    ],
    correctIndex: 3,
    explanation:
      'All of these are well-known limitations. The Bohr model succeeded brilliantly for 1-electron systems (H, He⁺, Li²⁺), but its circular planar orbits were superseded by modern quantum wave mechanics (Schrödinger equation and 3D atomic orbitals).',
  },
];

export const BohrQuiz: React.FC = () => {
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
    BOHR_QUIZ_QUESTIONS.forEach((q) => {
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
  const score = calculateScore();

  return (
    <div className="bg-[#10243D] border border-[#29415F] rounded-xl p-5 shadow-xl flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#29415F]/70">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#818CF8]" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Interactive Bohr Model Mastery Assessment
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-[#9FB3CC]">
            Answered: <strong className="text-white">{answeredCount}</strong> / {BOHR_QUIZ_QUESTIONS.length}
          </span>
          {showResults && (
            <span className="text-emerald-400 font-bold flex items-center gap-1 font-sans">
              <Award className="w-4 h-4" /> Score: {score} / {BOHR_QUIZ_QUESTIONS.length} ({((score / BOHR_QUIZ_QUESTIONS.length) * 100).toFixed(0)}%)
            </span>
          )}
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-4">
        {BOHR_QUIZ_QUESTIONS.map((q, idx) => {
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
                  : 'bg-[#0B1B31] border-[#29415F]'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span className="text-xs font-mono font-bold text-[#38BDF8] px-2 py-0.5 rounded bg-[#142B47] border border-[#29415F]">
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
                    'bg-[#10243D] border-[#29415F] text-[#9FB3CC] hover:border-slate-500 hover:text-white';

                  if (showResults) {
                    if (isOptionCorrect) {
                      optionStyle = 'bg-emerald-900/40 border-emerald-500 text-white font-bold';
                    } else if (isOptionSelected && !isCorrect) {
                      optionStyle = 'bg-rose-900/40 border-rose-500 text-white line-through';
                    } else {
                      optionStyle = 'bg-[#10243D]/40 border-[#29415F]/40 text-slate-500';
                    }
                  } else if (isOptionSelected) {
                    optionStyle = 'bg-[#142B47] border-[#38BDF8] text-white font-semibold shadow-sm';
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
                <div className="mt-3 ml-8 p-3 rounded-lg bg-[#10243D] border border-[#29415F] text-xs text-[#9FB3CC]">
                  <span className="font-bold text-white mr-1">Explanation:</span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Submission & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#29415F]/70">
        <div className="text-xs text-[#9FB3CC]">
          {!showResults
            ? `${BOHR_QUIZ_QUESTIONS.length - answeredCount} question(s) remaining.`
            : `You scored ${score} of ${BOHR_QUIZ_QUESTIONS.length} (${((score / BOHR_QUIZ_QUESTIONS.length) * 100).toFixed(0)}%).`}
        </div>

        <div className="flex items-center gap-2">
          {!showResults ? (
            <button
              onClick={() => setShowResults(true)}
              disabled={answeredCount === 0}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                answeredCount > 0
                  ? 'bg-[#38BDF8] hover:bg-[#0284C7] text-slate-950 shadow-md font-black'
                  : 'bg-[#142B47] text-[#9FB3CC] border border-[#29415F] cursor-not-allowed opacity-50'
              }`}
            >
              Check Answers
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-[#142B47] hover:bg-[#1E3B61] text-white border border-[#29415F] transition-all cursor-pointer flex items-center gap-1.5"
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
