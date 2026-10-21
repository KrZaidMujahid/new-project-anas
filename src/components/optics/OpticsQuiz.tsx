/**
 * EQUATION 1 — Optics & Snell's Law Examination Quiz
 * 15 rigorous conceptual & numerical questions for Class 11 & Class 12 Physics.
 */

import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ChevronRight,
  ChevronLeft,
  BookOpen,
} from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const OPTICS_QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: 'When a monochromatic light wave passes from air into water, which of the following properties remains completely unchanged?',
    options: [
      'Wavelength',
      'Wave Velocity',
      'Frequency',
      'Wave Amplitude',
    ],
    correctIndex: 2,
    explanation: 'Frequency depends solely on the source emitting the radiation. When light enters a different medium, atoms at the interface oscillate at the driving frequency, transmitting that exact same temporal frequency (f = c/λ₀) regardless of index changes.',
  },
  {
    id: 2,
    question: 'A ray of light traveling in water (n = 1.333) strikes a water-air interface. What is the critical angle for total internal reflection?',
    options: [
      '38.5°',
      '41.8°',
      '48.6°',
      '53.1°',
    ],
    correctIndex: 2,
    explanation: 'By the critical angle formula: sin(θ_c) = n_rare / n_dense = 1.000 / 1.333 = 0.750. Therefore, θ_c = arcsin(0.750) ≈ 48.6° (or 48.75°).',
  },
  {
    id: 3,
    question: 'Which of the following conditions is mandatory for Total Internal Reflection (TIR) to occur?',
    options: [
      'Light must travel from an optically rarer to an optically denser medium.',
      'Light must travel from an optically denser to an optically rarer medium, with angle of incidence exceeding the critical angle.',
      'Angle of incidence must equal 0° with respect to the surface normal.',
      'The medium must be a vacuum with zero absorption.',
    ],
    correctIndex: 1,
    explanation: 'Two mandatory conditions for TIR: 1) Light must travel from an optically denser to a rarer medium (n₁ > n₂), and 2) Angle of incidence in the denser medium must exceed the critical angle (θ₁ > θ_c).',
  },
  {
    id: 4,
    question: 'In a rectangular parallel glass slab of thickness t, what can be said about the emerging ray relative to the incident ray?',
    options: [
      'It deviates at an angle equal to twice the angle of refraction.',
      'It is strictly parallel to the incident ray, suffering only a lateral displacement.',
      'It bends perpendicularly by 90° due to TIR.',
      'It becomes completely absorbed if the slab exceeds 10 cm.',
    ],
    correctIndex: 1,
    explanation: 'Because the top and bottom faces of the slab are parallel, refraction at the exit face exactly cancels the angular deviation at the entry face (i₁ = r₂ and r₁ = i₂). The emergent ray is parallel to the incident ray, shifted sideways by d = t·sin(i - r)/cos(r).',
  },
  {
    id: 5,
    question: 'A fish swimming 2.0 meters below the surface of a pond (n = 4/3) looks up. Within what cone angle does the entire outside sky appear compressed?',
    options: [
      '48.6° (single cone angle)',
      '97.2° (total apex angle 2θ_c)',
      '180° flat circle',
      '45.0°',
    ],
    correctIndex: 1,
    explanation: "This is 'Snell's Window'. Light from the entire 180° horizon of the terrestrial sky is compressed into a cone of half-angle θ_c ≈ 48.6°. The total vertex angle of the illuminated circular cone is 2θ_c = 2 × 48.6° = 97.2°.",
  },
  {
    id: 6,
    question: 'If light with wavelength 600 nm in vacuum enters crown glass (n = 1.50), what is its wavelength inside the glass?',
    options: [
      '900 nm',
      '600 nm',
      '400 nm',
      '300 nm',
    ],
    correctIndex: 2,
    explanation: 'Wavelength inside a medium of refractive index n is λ_med = λ₀ / n. Here, λ = 600 nm / 1.50 = 400 nm (in the violet region of the spectrum inside glass).',
  },
  {
    id: 7,
    question: 'At the angle of minimum deviation (δ_m) for an equilateral triangular prism (A = 60°), what is the relation between incidence angle i and emergence angle e?',
    options: [
      'i = e and the ray inside the prism travels parallel to the base.',
      'i = 2e and the ray undergoes total internal reflection.',
      'i + e = 90° regardless of prism material.',
      'e = 0° (normal emergence).',
    ],
    correctIndex: 0,
    explanation: 'At minimum deviation, the ray trajectory through the prism is completely symmetric: i = e, and the interior refraction angles are equal: r₁ = r₂ = A/2 = 30°. The internal ray runs parallel to the prism base.',
  },
  {
    id: 8,
    question: 'Why does a diamond sparkle with intense brilliance and multicolored flashes compared to a piece of ordinary cut glass?',
    options: [
      'Diamond is naturally phosphorescent and emits its own light.',
      'Diamond has an extraordinarily high index (n = 2.42) giving a very small critical angle (24.4°), trapping light inside multiple internal reflections.',
      'Diamond has zero optical absorption and infinite speed of light.',
      'Diamond reflects 100% of light off its surface like silver.',
    ],
    correctIndex: 1,
    explanation: 'Due to its large refractive index (n = 2.417), diamond has an exceptionally tiny critical angle of only 24.4°. Cut facets ensure that almost all light entering undergoes multiple total internal reflections before exiting through the top table facet.',
  },
  {
    id: 9,
    question: 'An optical fiber has a core of refractive index 1.50 and a cladding of index 1.40. What is its Numerical Aperture (NA) in air?',
    options: [
      '0.539',
      '0.290',
      '0.100',
      '0.725',
    ],
    correctIndex: 0,
    explanation: 'Numerical Aperture NA = √(n_core² - n_clad²) = √(1.50² - 1.40²) = √(2.25 - 1.96) = √0.29 ≈ 0.5385 ≈ 0.539.',
  },
  {
    id: 10,
    question: 'A coin resting at the bottom of a 12.0 cm deep glass beaker filled with water (n = 4/3) appears to be raised. What is its apparent depth?',
    options: [
      '16.0 cm',
      '12.0 cm',
      '9.0 cm',
      '6.0 cm',
    ],
    correctIndex: 2,
    explanation: 'Apparent depth d_app = Real depth / n = 12.0 cm / (4/3) = 12.0 × (3/4) = 9.0 cm. The apparent shift is Δs = 12 - 9 = 3.0 cm upwards.',
  },
  {
    id: 11,
    question: 'According to Cauchy’s dispersion formula n(λ) = A + B/λ², which visible color has the highest refractive index in glass?',
    options: [
      'Red (700 nm)',
      'Yellow (589 nm)',
      'Green (530 nm)',
      'Violet (400 nm)',
    ],
    correctIndex: 3,
    explanation: 'Because n is inversely proportional to λ², shorter wavelengths yield higher refractive indices. Violet light (400 nm) has the shortest visible wavelength, hence it experiences the largest n, slows down most, and undergoes greatest deviation.',
  },
  {
    id: 12,
    question: 'What is Brewster’s angle (polarizing angle θ_B) for light reflecting from an air-glass boundary (n_glass = 1.50)?',
    options: [
      '33.7°',
      '45.0°',
      '56.3°',
      '60.0°',
    ],
    correctIndex: 2,
    explanation: "Brewster's Law states: tan(θ_B) = n₂ / n₁ = 1.50 / 1.00 = 1.50. Thus θ_B = arctan(1.50) ≈ 56.3°. At this angle, the reflected light is 100% plane-polarized perpendicular to the plane of incidence.",
  },
  {
    id: 13,
    question: 'Why do stars twinkle in the night sky while planets do not?',
    options: [
      'Stars are nuclear fusion bodies whereas planets are cold rocks.',
      'Stars act as point sources whose narrow rays are continuously refracted by turbulent air density pockets; planets are extended disks that average out fluctuations.',
      'Planetary light travels faster than stellar light through the atmosphere.',
      'The Doppler shift from star rotation causes rapid intensity modulation.',
    ],
    correctIndex: 1,
    explanation: 'Stars are light-years away and appear as microscopic point sources; turbulent atmospheric thermal eddies continuously shift their apparent position, causing twinkling. Planets are much closer and act as extended disks, averaging out random fluctuations.',
  },
  {
    id: 14,
    question: 'The Sun is visible roughly 2 minutes before the actual geometric sunrise and 2 minutes after geometric sunset. What optical phenomenon causes this?',
    options: [
      'Atmospheric refraction bending sunlight over the curved horizon.',
      'Gravitational lensing by the Moon.',
      'Total internal reflection in cloud layers.',
      'Chromospheric emission flares.',
    ],
    correctIndex: 0,
    explanation: 'Atmospheric density decreases with altitude. Light from the sub-horizon sun travels from rarer to denser layers, bending continuously downward toward Earth. This lifts the apparent solar disk by about 0.5° (its own diameter), extending daylight by ~4 minutes daily.',
  },
  {
    id: 15,
    question: 'What happens to the reflected ray when light strikes an interface at exactly normal incidence (θ₁ = 0°)?',
    options: [
      'It is refracted at 90° along the surface.',
      'It retraces its exact path backwards with reflectance R = [(n₁ - n₂)/(n₁ + n₂)]².',
      'It undergoes total internal reflection.',
      'It splits into seven rainbow colors.',
    ],
    correctIndex: 1,
    explanation: 'At normal incidence (θ₁ = 0°), the angle of reflection is 0°, meaning the reflected fraction retraces its path straight back. The Fresnel reflectance is given by R₀ = [(n₁ - n₂)/(n₁ + n₂)]².',
  },
];

export const OpticsQuiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQ = OPTICS_QUIZ_DATA[currentQuestionIndex];
  const selectedAnswer = userAnswers[currentQ.id];
  const isAnswered = selectedAnswer !== undefined;

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: idx }));
    setShowExplanation(true);
  };

  const score = Object.entries(userAnswers).reduce((acc, [qId, ansIdx]) => {
    const q = OPTICS_QUIZ_DATA.find((item) => item.id === parseInt(qId));
    return q && q.correctIndex === ansIdx ? acc + 1 : acc;
  }, 0);

  const handleResetQuiz = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setShowExplanation(false);
  };

  return (
    <div className="space-y-6 text-[#F1F5F9]">
      {/* 1. Header Banner */}
      <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#FBBF24]/10 border border-[#FBBF24]/30 flex items-center justify-center text-[#FBBF24] shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#F1F5F9] tracking-tight">
              SNELL'S LAW &amp; OPTICS COMPREHENSIVE EXAMINATION
            </h2>
            <p className="text-xs text-[#94A3B8] font-medium mt-0.5">
              15 CBSE / AP Physics 2 exam questions testing critical angle, lateral shift, prisms, and wave invariants.
            </p>
          </div>
        </div>

        {/* Score Card */}
        <div className="flex items-center gap-3">
          <div className="bg-[#17263B] px-3.5 py-1.5 rounded-lg border border-[#26364D] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#FBBF24]" />
            <span className="text-xs font-mono font-bold text-[#F1F5F9]">
              Score: <span className="text-[#34D399]">{score}</span> / {OPTICS_QUIZ_DATA.length}
            </span>
          </div>

          <button
            onClick={handleResetQuiz}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#17263B] hover:bg-[#26364D] text-[#94A3B8] hover:text-[#F1F5F9] text-xs font-semibold border border-[#26364D] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 2. Question Navigation Pager */}
      <div className="flex flex-wrap items-center gap-1.5 bg-[#101D30] p-3 rounded-xl border border-[#26364D]">
        {OPTICS_QUIZ_DATA.map((q, idx) => {
          const ans = userAnswers[q.id];
          const isCorrect = ans !== undefined && ans === q.correctIndex;
          const isWrong = ans !== undefined && ans !== q.correctIndex;
          const isCurrent = idx === currentQuestionIndex;

          return (
            <button
              key={q.id}
              onClick={() => {
                setCurrentQuestionIndex(idx);
                setShowExplanation(userAnswers[q.id] !== undefined);
              }}
              className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                isCurrent
                  ? 'border-[#38BDF8] ring-2 ring-[#38BDF8]/40'
                  : 'border-[#26364D]'
              } ${
                isCorrect
                  ? 'bg-[#34D399] text-[#07111F]'
                  : isWrong
                  ? 'bg-[#FB7185] text-[#07111F]'
                  : ans !== undefined
                  ? 'bg-[#17263B] text-[#F1F5F9]'
                  : 'bg-[#0B1728] text-[#94A3B8] hover:bg-[#17263B]'
              }`}
            >
              {q.id}
            </button>
          );
        })}
      </div>

      {/* 3. Question Card */}
      <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#26364D]">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#38BDF8]">
            Question {currentQ.id} of {OPTICS_QUIZ_DATA.length}
          </span>
          <span className="text-xs text-[#94A3B8]">
            {isAnswered ? (selectedAnswer === currentQ.correctIndex ? '✓ Correct' : '✗ Incorrect') : 'Unanswered'}
          </span>
        </div>

        {/* Question Text */}
        <h3 className="text-base font-bold text-[#F1F5F9] leading-relaxed">
          {currentQ.question}
        </h3>

        {/* Multiple Choice Options */}
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            const isChosen = selectedAnswer === idx;
            const isCorrect = idx === currentQ.correctIndex;

            let btnStyle = 'bg-[#17263B] border-[#26364D] text-[#F1F5F9] hover:bg-[#26364D]/60';
            if (isAnswered) {
              if (isCorrect) {
                btnStyle = 'bg-[#34D399]/20 border-[#34D399] text-[#34D399] font-bold';
              } else if (isChosen) {
                btnStyle = 'bg-[#FB7185]/20 border-[#FB7185] text-[#FB7185] font-bold';
              } else {
                btnStyle = 'bg-[#17263B]/40 border-[#26364D] text-[#94A3B8] opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-3 ${btnStyle} ${
                  !isAnswered ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-[#0A1526] border border-[#26364D] flex items-center justify-center font-mono font-bold text-[11px] shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-relaxed">{opt}</span>
                </div>

                {isAnswered && (
                  <div>
                    {isCorrect && <CheckCircle2 className="w-5 h-5 text-[#34D399] shrink-0" />}
                    {!isCorrect && isChosen && <XCircle className="w-5 h-5 text-[#FB7185] shrink-0" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Card */}
        {isAnswered && (
          <div className="bg-[#0B1728] p-4.5 rounded-xl border border-[#26364D] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#FBBF24]">
              <BookOpen className="w-4 h-4" />
              <span>Physics Explanation &amp; Syllabus Note:</span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              {currentQ.explanation}
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-[#26364D]">
          <button
            disabled={currentQuestionIndex === 0}
            onClick={() => {
              setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
              setShowExplanation(userAnswers[OPTICS_QUIZ_DATA[currentQuestionIndex - 1]?.id] !== undefined);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#17263B] hover:bg-[#26364D] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-[#F1F5F9] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            disabled={currentQuestionIndex === OPTICS_QUIZ_DATA.length - 1}
            onClick={() => {
              setCurrentQuestionIndex((prev) => Math.min(OPTICS_QUIZ_DATA.length - 1, prev + 1));
              setShowExplanation(userAnswers[OPTICS_QUIZ_DATA[currentQuestionIndex + 1]?.id] !== undefined);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#38BDF8] hover:bg-[#38BDF8]/90 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-[#07111F] transition-colors cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
