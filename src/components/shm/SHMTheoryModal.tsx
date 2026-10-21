/**
 * EQUATION 1 — Simple Harmonic Motion Educational Theory & Core Concepts
 * Concise, authoritative explanations addressing the 10 fundamental SHM principles.
 */

import React from 'react';
import { X, BookOpen, CheckCircle, HelpCircle } from 'lucide-react';
import { MathView } from '../MathView';

interface SHMTheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QuestionAnswer {
  num: number;
  question: string;
  answer: string;
  mathFormula?: string;
  takeaway: string;
}

const THEORY_QUESTIONS: QuestionAnswer[] = [
  {
    num: 1,
    question: 'What is simple harmonic motion (SHM)?',
    answer:
      'Simple harmonic motion is periodic oscillatory motion where a system is displaced from equilibrium and experiences a restoring acceleration directly proportional to its displacement and directed toward the equilibrium point.',
    mathFormula: '\\frac{d^2x}{dt^2} = -\\omega^2 x',
    takeaway: 'Motion is governed by a linear restoring acceleration with zero damping in the ideal case.',
  },
  {
    num: 2,
    question: 'What is a restoring force?',
    answer:
      'A restoring force is an internal force that acts to return a displaced mass back to its stable equilibrium position. In a mass-spring system, Hooke\'s law defines this linear force with a negative sign indicating opposite direction to displacement.',
    mathFormula: 'F_{\\text{restore}} = -kx',
    takeaway: 'When pulled to the right (x > 0), force pushes left (F < 0); when pushed left (x < 0), force pushes right (F > 0).',
  },
  {
    num: 3,
    question: 'What is equilibrium?',
    answer:
      'The equilibrium position (x = 0) is the state in which the net external force acting on the particle is exactly zero. At equilibrium, potential energy reaches a minimum, acceleration is zero, and kinetic energy and speed reach their maximum.',
    mathFormula: '\\Sigma F = 0 \\implies a = 0, \\quad |v| = v_{\\text{max}}',
    takeaway: 'Equilibrium is where speed peaks and restoring force vanishes.',
  },
  {
    num: 4,
    question: 'What is amplitude (A)?',
    answer:
      'Amplitude is the maximum absolute displacement of the oscillating body from its equilibrium position. It represents the spatial boundary of oscillation, bounded between -A and +A. Amplitude depends strictly on the initial energy given to the system.',
    mathFormula: 'x_{\\text{max}} = A, \\quad E = \\frac{1}{2}kA^2',
    takeaway: 'Do not confuse amplitude A (a fixed positive constant) with instantaneous displacement x(t) (which continuously changes).',
  },
  {
    num: 5,
    question: 'What is angular frequency (ω)?',
    answer:
      'Angular frequency measures the rate of oscillation in radians per second. For a mass-spring system, it is determined exclusively by the ratio of spring stiffness k to mass m.',
    mathFormula: '\\omega = \\sqrt{\\frac{k}{m}} = 2\\pi f = \\frac{2\\pi}{T}',
    takeaway: 'Higher stiffness increases ω; greater inertia/mass decreases ω.',
  },
  {
    num: 6,
    question: 'What is period (T)?',
    answer:
      'Period is the time required to complete one full cycle of oscillation (from +A to -A and back to +A). For ideal linear SHM, period is completely independent of amplitude (isochronism).',
    mathFormula: 'T = 2\\pi \\sqrt{\\frac{m}{k}}',
    takeaway: 'T depends only on system properties (m and k), never on how far the mass is displaced.',
  },
  {
    num: 7,
    question: 'What is frequency (f)?',
    answer:
      'Frequency is the number of complete oscillation cycles performed per unit time, measured in Hertz (Hz = 1/s). It is the mathematical reciprocal of the period.',
    mathFormula: 'f = \\frac{1}{T} = \\frac{\\omega}{2\\pi} = \\frac{1}{2\\pi}\\sqrt{\\frac{k}{m}}',
    takeaway: 'A frequency of 2 Hz means the mass completes 2 full round-trips every second.',
  },
  {
    num: 8,
    question: 'What are the phase relationships between x(t), v(t), and a(t)?',
    answer:
      'Displacement, velocity, and acceleration are sinusoidal functions offset by fixed phase angles. Velocity leads displacement by 90° (π/2 radians), meaning velocity is zero when displacement is at extreme values. Acceleration leads displacement by 180° (π radians), meaning acceleration always opposes displacement.',
    mathFormula: 'x(t) = A\\cos(\\omega t), \\quad v(t) = A\\omega\\cos(\\omega t + \\pi/2), \\quad a(t) = A\\omega^2\\cos(\\omega t + \\pi)',
    takeaway: 'Quarter-cycle shift between x and v; half-cycle shift between x and a.',
  },
  {
    num: 9,
    question: 'How does energy change during SHM?',
    answer:
      'In ideal SHM, total mechanical energy is conserved and remains constant at E = ½kA². Energy is continuously transformed between elastic potential energy U = ½kx² and kinetic energy K = ½mv² without dissipation.',
    mathFormula: 'E = K + U = \\frac{1}{2}mv(t)^2 + \\frac{1}{2}kx(t)^2 = \\frac{1}{2}kA^2 = \\text{Constant}',
    takeaway: 'At peaks (x = ±A), U = E and K = 0. At center (x = 0), K = E and U = 0.',
  },
  {
    num: 10,
    question: 'What conditions are necessary for simple harmonic motion?',
    answer:
      'Two fundamental physical criteria must be satisfied: (1) A restoring force directly proportional to displacement (linear Hooke\'s law F = -kx or small-angle pendulum torque), and (2) Inertia provided by mass m to carry the object through the equilibrium point. In ideal SHM, friction and drag are assumed to be zero.',
    mathFormula: 'F_{\\text{net}} = -k x \\quad \\text{and} \\quad \\text{Zero Dissipative Damping}',
    takeaway: 'Linearity of the restoring force is the necessary and sufficient condition for true isochronous SHM.',
  },
];

export const SHMTheoryModal: React.FC<SHMTheoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#090d16] border border-slate-800 rounded-xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-[#07090e]">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Simple Harmonic Motion — Educational Foundations
              </h2>
              <p className="text-xs text-slate-400">
                10 Core Concepts & Scientific Principles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close theory dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-6 overflow-y-auto space-y-4">
          {THEORY_QUESTIONS.map((q) => (
            <div
              key={q.num}
              className="p-4 rounded-lg bg-[#07090e] border border-slate-800 space-y-2 text-xs"
            >
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-cyan-400 font-bold text-sm">
                  {String(q.num).padStart(2, '0')}.
                </span>
                <h3 className="font-bold text-sm text-white">
                  {q.question}
                </h3>
              </div>

              <p className="text-slate-300 leading-relaxed pl-6">
                {q.answer}
              </p>

              {q.mathFormula && (
                <div className="py-1 pl-6">
                  <div className="bg-slate-900/80 px-3 py-1.5 rounded border border-slate-800/80 inline-block">
                    <MathView math={q.mathFormula} />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-1.5 pl-6 pt-1 text-[11px] text-cyan-300 font-mono">
                <span className="font-semibold text-slate-400">Key Takeaway:</span>
                <span>{q.takeaway}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800/80 bg-[#07090e] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors cursor-pointer"
          >
            Close Reference
          </button>
        </div>
      </div>
    </div>
  );
};
