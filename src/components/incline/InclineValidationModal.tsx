/**
 * EQUATION 1 — Inclined Plane Physics Validation Suite Modal
 * Executes and presents automated test invariant benchmarks verifying physical and mathematical correctness.
 */

import React, { useMemo } from 'react';
import { runInclineValidationTests } from '../../physics/incline/model';
import { ShieldCheck, X, CheckCircle2, AlertTriangle } from 'lucide-react';

interface InclineValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InclineValidationModal: React.FC<InclineValidationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const testResults = useMemo(() => {
    return runInclineValidationTests();
  }, []);

  if (!isOpen) return null;

  const allPassed = testResults.every((t) => t.passed);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-2xl bg-[#0b101b] border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-wide">
                  Inclined Plane Automated Validation Suite
                </h2>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded text-[10px] font-mono font-bold">
                  {allPassed ? `${testResults.length} / ${testResults.length} PASSED` : 'TESTS FAILED'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                In-engine verification of physical laws, boundary invariants, and Coulomb friction thresholds
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close validation modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto text-xs">
          {testResults.map((t) => (
            <div
              key={t.id}
              className={`p-3.5 rounded-lg border ${
                t.passed
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                  : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-white">
                  {t.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span>{t.title}</span>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    t.passed
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {t.passed ? 'PASSED' : 'FAILED'}
                </span>
              </div>

              <p className="text-slate-400 text-[11px] mt-1 pl-6">
                {t.description}
              </p>

              <div className="mt-2 pl-6 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono bg-slate-900/60 p-2 rounded border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">
                    Expected Theory:
                  </span>
                  <span className="text-cyan-300">{t.expected}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">
                    Simulation Value:
                  </span>
                  <span className="text-emerald-300">{t.actual}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
