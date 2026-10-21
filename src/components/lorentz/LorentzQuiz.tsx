/**
 * EQUATION 1 — Lorentz Force Knowledge Evaluation Quiz
 * 10 rigorous, syllabus-aligned multiple choice questions for Class 11 & 12 physics
 * with instant feedback, scientific rationales, and score calculation.
 */

import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  Sparkles,
} from 'lucide-react';
import { LorentzQuizQuestion } from '../../physics/lorentz/types';

export const LORENTZ_QUIZ_QUESTIONS: LorentzQuizQuestion[] = [
  {
    id: 1,
    question:
      'What is the total mechanical work done by a static, uniform magnetic field on a charged particle moving along any trajectory?',
    options: [
      'Positive work equal to q · v · B · t',
      'Always zero, because the magnetic force is strictly perpendicular to velocity at every instant',
      'Negative work equal to the change in kinetic energy',
      'Zero only if the particle moves in a closed circle',
    ],
    correctIndex: 1,
    explanation:
      'Because F_B = q(v × B), the magnetic force is always orthogonal to the instantaneous velocity vector v (F_B ⊥ v). The power delivered is P = F_B · v = 0, so dW = P dt = 0. A pure magnetic field never alters a particle’s speed or kinetic energy.',
  },
  {
    id: 2,
    question:
      'An electron moves horizontally towards the East through a region where a uniform magnetic field points vertically Upward. In which direction is the magnetic force on the electron?',
    options: [
      'Towards North',
      'Towards South',
      'Towards West',
      'Zero force',
    ],
    correctIndex: 1,
    explanation:
      'By the Right-Hand Rule: v points East, B points Upward. The cross product v × B points North. However, the electron carries a negative charge (q = -e), which inverts the force direction by 180° towards the South.',
  },
  {
    id: 3,
    question:
      'A proton (mass m, charge +e) and an alpha particle (mass 4m, charge +2e) enter a uniform magnetic field with the same velocity perpendicular to the field. What is the ratio of their orbital radii (r_proton : r_alpha)?',
    options: [
      '1 : 1',
      '1 : 2',
      '2 : 1',
      '1 : 4',
    ],
    correctIndex: 1,
    explanation:
      'Cyclotron radius is r = mv / (qB). For identical speed v and field B: r ∝ m/q. For proton, m/q = 1/1 = 1. For alpha, m/q = 4/2 = 2. Therefore, r_proton / r_alpha = 1 / 2.',
  },
  {
    id: 4,
    question:
      'A charged particle enters a uniform magnetic field at an oblique angle θ = 45° with the field lines. What is the geometry of its resulting trajectory?',
    options: [
      'Uniform circle in the plane perpendicular to B',
      'Straight line accelerated along B',
      'Helical spiral with constant radius and constant longitudinal pitch',
      'Parabolic trajectory towards the magnetic poles',
    ],
    correctIndex: 2,
    explanation:
      'The velocity decomposes into v_⊥ = v sin(45°) and v_∥ = v cos(45°). v_⊥ creates uniform circular motion with radius r = mv_⊥ / (qB), while v_∥ experiences zero force and drifts uniformly along the magnetic field, producing a helical path.',
  },
  {
    id: 5,
    question:
      'In a cyclotron particle accelerator, how does the revolution frequency f_c = qB / (2πm) change as the particle gains speed and spirals to larger orbital radii?',
    options: [
      'It increases proportionally to the radius r',
      'It decreases inversely with speed (1/v)',
      'It remains strictly constant and independent of both speed and radius (non-relativistic limit)',
      'It doubles every complete revolution',
    ],
    correctIndex: 2,
    explanation:
      'The cyclotron resonance condition is unique: as the particle speeds up, its orbit radius grows in exact proportion (r = mv/qB), keeping the orbital period T = 2πr / v = 2πm / (qB) constant. Hence f_c is isochronous.',
  },
  {
    id: 6,
    question:
      'In a crossed-field Velocity Selector (Wien filter), what condition must a particle of charge q satisfy to emerge undeflected without touching the collimator plates?',
    options: [
      'Its mass must equal m = q · B / E',
      'Its speed must strictly equal v = E / B',
      'Its kinetic energy must exceed 10 keV',
      'Its charge must be strictly positive',
    ],
    correctIndex: 1,
    explanation:
      'In crossed fields, the electric force qE and magnetic force qvB act in opposite directions. For zero net deflection, qE = qvB, which simplifies to v = E / B. Notice this is completely independent of both particle mass and charge!',
  },
  {
    id: 7,
    question:
      'Contrast the kinetic energy of a charged particle in a pure uniform magnetic field versus a pure uniform electric field:',
    options: [
      'Kinetic energy increases in magnetic fields, but is conserved in electric fields',
      'Kinetic energy is conserved in both fields',
      'Kinetic energy is conserved in pure magnetic fields, but can increase or decrease in electric fields',
      'Kinetic energy always decreases due to radiation damping',
    ],
    correctIndex: 2,
    explanation:
      'In pure B-field, F_B ⊥ v, so W = 0 and ΔK = 0 (kinetic energy is strictly conserved). In pure E-field, F_E = qE acts along the field lines, performing work W = qE · Δx = ΔK, accelerating or decelerating the particle.',
  },
  {
    id: 8,
    question:
      'If the magnetic field strength B is tripled while keeping a particle’s mass, charge, and perpendicular speed constant, how does the circular orbit radius change?',
    options: [
      'It becomes 3 times larger',
      'It becomes 9 times larger',
      'It shrinks to 1/3 of its initial radius',
      'It remains unchanged because speed is constant',
    ],
    correctIndex: 2,
    explanation:
      'Since r = (m · v_⊥) / (|q| · B), the radius is inversely proportional to the magnetic field (r ∝ 1/B). Tripling B (3×) shrinks the orbit radius to one third (1/3).',
  },
  {
    id: 9,
    question:
      'What is the formula for the helical pitch p of a charged particle moving with speed v at angle θ relative to magnetic field B?',
    options: [
      'p = (2π · m · v · cos θ) / (q · B)',
      'p = (2π · m · v · sin θ) / (q · B)',
      'p = (q · B · v) / (2π · m · cos θ)',
      'p = (m · v²) / (q · B)',
    ],
    correctIndex: 0,
    explanation:
      'Pitch is the distance traveled along the magnetic field line during one cyclotron revolution: pitch = v_∥ · T = (v · cos θ) · (2πm / qB) = (2πm v cos θ) / (qB).',
  },
  {
    id: 10,
    question:
      'How did J.J. Thomson determine the charge-to-mass ratio (e/m) of the electron in his landmark 1897 cathode ray tube experiment?',
    options: [
      'By timing the free fall of oil droplets between capacitor plates',
      'By using crossed E and B fields to measure electron speed v = E/B, then measuring deflection with B alone to find radius r, giving e/m = E / (r · B²)',
      'By scattering alpha particles off thin gold foil',
      'By measuring the wavelength of characteristic X-rays',
    ],
    correctIndex: 1,
    explanation:
      'Thomson first used crossed electric and magnetic fields to balance the beam (v = E/B). He then turned off the electric field, measuring the curvature radius r in the magnetic field alone (r = mv / eB). Substituting v = E/B gave e/m = E / (r · B²).',
  },
];

export const LorentzQuiz: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  // Calculate score
  const totalQuestions = LORENTZ_QUIZ_QUESTIONS.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = LORENTZ_QUIZ_QUESTIONS.reduce((acc, q) => {
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
              Lorentz Force Examination (Class 11 &amp; 12)
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              10 high-yield questions covering vector cross products, zero-work theorem, cyclotron resonance, and velocity selectors.
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
            <span>Reset</span>
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
                {scorePercent >= 80
                  ? 'Outstanding mastery of magnetic forces and electrodynamics!'
                  : scorePercent >= 60
                  ? 'Solid foundation. Review the detailed explanations below to master subtle vector rules.'
                  : 'Keep practicing! Review the Right-Hand Rule and zero-work theorem in the Theory tab.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10 Questions List */}
      <div className="space-y-4">
        {LORENTZ_QUIZ_QUESTIONS.map((q, idx) => {
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
                      optStyles =
                        'bg-[#34D399]/15 border-[#34D399] text-[#34D399] font-bold';
                    } else if (isThisSelected) {
                      optStyles =
                        'bg-[#FB7185]/15 border-[#FB7185] text-[#FB7185] font-semibold';
                    } else {
                      optStyles =
                        'bg-[#17263B]/60 border-[#26364D]/60 text-[#94A3B8]/60 cursor-default';
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
