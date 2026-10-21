/**
 * EQUATION 1 — Double-Slit Examination Quiz
 * 15 rigorous conceptual & numerical questions for Class 11 & Class 12 Physics.
 */

import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  BookOpen,
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const DoubleSlitQuiz: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  const questions: Question[] = [
    {
      id: 1,
      question: "In Young's double-slit experiment, if the wavelength of light used is doubled and the slit separation is halved, the fringe width will:",
      options: [
        "Remain unchanged",
        "Be doubled",
        "Become four times greater",
        "Be halved",
      ],
      correctIndex: 2,
      explanation: "Since fringe width β = λD / d, doubling λ (2×) and halving d (1/0.5 = 2×) makes the new fringe width β' = (2λ)D / (d/2) = 4(λD/d) = 4β (four times greater).",
    },
    {
      id: 2,
      question: "Two independent sodium lamps of identical power and wavelength illuminating two pinholes will NOT produce an interference pattern because:",
      options: [
        "Light intensity is too low",
        "They are not coherent sources and have random, rapid phase differences",
        "Sodium vapor emits longitudinal waves",
        "The screen distance must be infinite",
      ],
      correctIndex: 1,
      explanation: "Independent light sources emit photons through spontaneous emission with random, uncorrelated phase shifts changing every ~10⁻¹⁰ seconds. Coherent sources with constant phase difference are required for sustained interference.",
    },
    {
      id: 3,
      question: "In a double-slit experiment, the path difference between two interfering waves at the position of the 3rd dark fringe is:",
      options: [
        "3 λ",
        "1.5 λ (3/2 λ)",
        "2.5 λ (5/2 λ)",
        "3.5 λ (7/2 λ)",
      ],
      correctIndex: 2,
      explanation: "Condition for dark fringes is Δx = (2n - 1) λ / 2 where n = 1, 2, 3... For the 3rd dark fringe (n = 3), Δx = (2(3) - 1) λ / 2 = 5/2 λ = 2.5 λ.",
    },
    {
      id: 4,
      question: "If Young's double-slit apparatus is immersed in water of refractive index 4/3, the fringe width will:",
      options: [
        "Increase by 33%",
        "Decrease by 25% (become 3/4 of its original value)",
        "Remain the same because frequency is invariant",
        "Disappear completely",
      ],
      correctIndex: 1,
      explanation: "In water, wavelength compresses to λ' = λ / n = λ / (4/3) = 3/4 λ. Hence, fringe width β' = β / n = 3/4 β (a 25% decrease).",
    },
    {
      id: 5,
      question: "When white light is used in Young's double-slit experiment, the central fringe is:",
      options: [
        "Pure black due to destructive interference",
        "White, because path difference is zero for all visible wavelengths",
        "Red, because red has the longest wavelength",
        "Violet, because violet has the shortest wavelength",
      ],
      correctIndex: 1,
      explanation: "At the geometric center y = 0, the path difference Δx = 0 for all wavelengths simultaneously. Therefore, all spectral colors construct maxima at the center, superposing into an achromatic white fringe.",
    },
    {
      id: 6,
      question: "If one of the two slits in a double-slit experiment is completely covered with an opaque block:",
      options: [
        "No light reaches the screen",
        "The fringes become twice as wide",
        "The interference pattern disappears and is replaced by a single-slit diffraction pattern",
        "The bright fringes become four times brighter",
      ],
      correctIndex: 2,
      explanation: "With one slit covered, there is only one source of secondary wavelets, so two-beam interference ceases, and the screen displays standard Fraunhofer single-slit diffraction.",
    },
    {
      id: 7,
      question: "If slit separation d = 1 mm and slit width a = 0.2 mm, which interference maximum is missing from the screen?",
      options: [
        "m = 2",
        "m = 3",
        "m = 5",
        "m = 10",
      ],
      correctIndex: 2,
      explanation: "Missing order condition is d/a = m/p. Here d/a = 1.0 / 0.2 = 5. For the first diffraction zero (p = 1), m = 5(1) = 5. The 5th interference maximum is absent.",
    },
    {
      id: 8,
      question: "The ratio of maximum intensity to minimum intensity in an interference pattern where the slit amplitudes are in the ratio 3:1 is:",
      options: [
        "9 : 1",
        "4 : 1",
        "16 : 1",
        "2 : 1",
      ],
      correctIndex: 1,
      explanation: "I_max / I_min = ((a1 + a2) / (a1 - a2))² = ((3 + 1) / (3 - 1))² = (4 / 2)² = 2² = 4:1.",
    },
    {
      id: 9,
      question: "What happens to the angular fringe width (Δθ = λ / d) when the screen is moved farther away from the slits?",
      options: [
        "It increases linearly with D",
        "It decreases inversely with D",
        "It remains strictly unchanged",
        "It fluctuates sinusoidally",
      ],
      correctIndex: 2,
      explanation: "Angular fringe width Δθ = λ / d depends solely on wavelength and slit separation, not on the distance to the screen D. While the linear spatial width β = λD/d increases with D, the angle Δθ remains constant.",
    },
    {
      id: 10,
      question: "In the quantum double-slit experiment, when photons are fired one by one with a 'which-way' detector placed at the slits:",
      options: [
        "The interference fringes become sharper",
        "The interference fringes disappear and become the classical sum of two single-slit distributions",
        "Photons bounce backward into the laser",
        "Photons change wavelength to X-rays",
      ],
      correctIndex: 1,
      explanation: "According to quantum mechanics and the complementarity principle, measuring which slit a photon traverses collapses the quantum superposition, destroying phase coherence and extinguishing the interference fringes.",
    },
    {
      id: 11,
      question: "If the phase difference between two interfering coherent waves of equal amplitude E₀ is 2π/3 radians (120°), the resultant intensity is:",
      options: [
        "4 I₀",
        "2 I₀",
        "I₀",
        "0",
      ],
      correctIndex: 2,
      explanation: "I = 4 I₀ cos²(Δφ / 2) = 4 I₀ cos²(60°) = 4 I₀ (1/2)² = 4 I₀ (1/4) = I₀.",
    },
    {
      id: 12,
      question: "A monochromatic beam of 600 nm light produces fringes with β = 2 mm on a screen. If the wavelength is changed to 450 nm with the same apparatus, the new fringe width is:",
      options: [
        "1.5 mm",
        "2.5 mm",
        "1.33 mm",
        "3.0 mm",
      ],
      correctIndex: 0,
      explanation: "β₂ / β₁ = λ₂ / λ₁ ⟹ β₂ = 2 mm × (450 / 600) = 2 × 0.75 = 1.5 mm.",
    },
    {
      id: 13,
      question: "The conservation of energy in wave interference is verified because:",
      options: [
        "Energy is created at bright fringes and destroyed at dark fringes",
        "The average intensity across the pattern equals the sum of individual intensities (⟨I⟩ = 2I₀ = I₁ + I₂)",
        "The total power doubles due to constructive interference",
        "Frequency increases to compensate for dark fringes",
      ],
      correctIndex: 1,
      explanation: "Interference does not create or destroy energy; it merely redistributes electromagnetic flux from regions of destructive interference to regions of constructive interference, keeping the spatial average equal to I₁ + I₂ = 2I₀.",
    },
    {
      id: 14,
      question: "In Young's experiment, how does fringe width β change if the entire apparatus is made larger by doubling all dimensions (slit separation d, slit width a, and screen distance D)?",
      options: [
        "Fringe width is quadrupled",
        "Fringe width is doubled",
        "Fringe width remains unchanged",
        "Fringe width is halved",
      ],
      correctIndex: 2,
      explanation: "Since β = λD / d, doubling both D and d yields β' = λ(2D) / (2d) = λD / d = β. The fringe width remains exactly the same.",
    },
    {
      id: 15,
      question: "Why must the slit separation 'd' in Young's experiment be very small (comparable to a few millimeters or fractions of a millimeter)?",
      options: [
        "To prevent air molecules from entering",
        "To make the fringe width β = λD / d sufficiently large to be visually resolved",
        "To reduce the speed of light",
        "Because large slits block all light transmission",
      ],
      correctIndex: 1,
      explanation: "Since the optical wavelength λ is exceedingly small (~5 × 10⁻⁷ m), if d were large (say 10 cm), the fringe width β would be microscopic (~5 × 10⁻⁶ m) and impossible to resolve with the human eye or standard optics.",
    },
  ];

  const handleSelectOption = (qId: number, optIndex: number) => {
    if (showResults) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIndex }));
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  const score = Object.entries(selectedAnswers).reduce((acc, [qId, ans]) => {
    const q = questions.find((item) => item.id === parseInt(qId));
    return q && q.correctIndex === ans ? acc + 1 : acc;
  }, 0);

  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-5 text-[#F1F5F9]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#26364D] pb-3">
        <div className="flex items-center gap-2.5">
          <Award className="w-5 h-5 text-[#FBBF24]" />
          <div>
            <h2 className="text-lg font-bold text-[#F1F5F9]">Class 11 & 12 Wave Optics Mastery Quiz</h2>
            <p className="text-xs text-[#94A3B8]">
              15 comprehensive conceptual & numerical questions with step-by-step physics solutions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {showResults && (
            <div className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-[#17263B] border border-[#26364D] text-[#34D399]">
              Score: {score} / {questions.length} ({((score / questions.length) * 100).toFixed(0)}%)
            </div>
          )}
          <button
            onClick={handleResetQuiz}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#17263B] hover:bg-[#26364D] text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer border border-[#26364D]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Quiz</span>
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q, idx) => {
          const userChoice = selectedAnswers[q.id];
          const isAnswered = userChoice !== undefined;
          const isCorrect = userChoice === q.correctIndex;

          return (
            <div
              key={q.id}
              className={`p-4 rounded-lg border transition-all ${
                showResults
                  ? isCorrect
                    ? 'bg-emerald-950/20 border-emerald-500/50'
                    : 'bg-rose-950/20 border-rose-500/50'
                  : 'bg-[#0B1728] border-[#26364D]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xs sm:text-sm font-semibold text-[#F1F5F9] leading-snug">
                  <span className="text-[#38BDF8] font-mono mr-1.5">Q{idx + 1}.</span>
                  {q.question}
                </h3>
                {showResults && (
                  <div>
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-[#FB7185] shrink-0" />
                    )}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                {q.options.map((opt, optIdx) => {
                  const isThisSelected = userChoice === optIdx;
                  const isThisCorrect = q.correctIndex === optIdx;

                  let optClass = 'bg-[#17263B] border-[#26364D] text-slate-300 hover:bg-[#26364D]/60';

                  if (showResults) {
                    if (isThisCorrect) {
                      optClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold';
                    } else if (isThisSelected && !isThisCorrect) {
                      optClass = 'bg-rose-500/20 border-rose-500 text-rose-200';
                    } else {
                      optClass = 'bg-[#101D30] border-[#26364D] text-slate-500 opacity-60';
                    }
                  } else if (isThisSelected) {
                    optClass = 'bg-[#38BDF8]/20 border-[#38BDF8] text-[#38BDF8] font-bold';
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={showResults}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`p-2.5 rounded-md border text-left text-xs transition-colors cursor-pointer flex items-center gap-2 ${optClass}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center font-mono text-[10px] shrink-0">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation upon submission */}
              {showResults && (
                <div className="mt-3 pt-2.5 border-t border-[#26364D] text-[11px] text-slate-300 space-y-1">
                  <div className="font-bold text-[#FBBF24]">Physics Explanation:</div>
                  <p className="leading-relaxed">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit / Score Action */}
      <div className="pt-3 border-t border-[#26364D] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-400">
          Answered {Object.keys(selectedAnswers).length} of {questions.length} questions
        </div>

        {!showResults ? (
          <button
            onClick={() => setShowResults(true)}
            disabled={Object.keys(selectedAnswers).length === 0}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#38BDF8] hover:bg-[#38BDF8]/90 disabled:opacity-40 text-slate-900 font-bold text-xs transition-colors cursor-pointer shadow-md shadow-[#38BDF8]/20"
          >
            Submit Answers & Reveal Explanations
          </button>
        ) : (
          <button
            onClick={handleResetQuiz}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#17263B] hover:bg-[#26364D] text-white font-bold text-xs transition-colors cursor-pointer border border-[#26364D]"
          >
            Retake Examination
          </button>
        )}
      </div>
    </div>
  );
};
