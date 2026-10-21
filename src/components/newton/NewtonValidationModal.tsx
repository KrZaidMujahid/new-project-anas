/**
 * EQUATION 1 — Newton's Laws Automated Physics Validation Suite Modal
 * Executes and presents all 7 Section 19 test invariant benchmarks directly in the UI.
 */

import React, { useMemo } from 'react';
import { runNewtonPhysicsValidationSuite } from '../../physics/newton/model';
import { ShieldCheck, X, CheckCircle2, AlertTriangle } from 'lucide-react';

interface NewtonValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewtonValidationModal: React.FC<NewtonValidationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const testResults = useMemo(() => {
    return runNewtonPhysicsValidationSuite();
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
                  Section 19 Physics Validation Suite
                </h2>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded text-[10px] font-mono font-bold">
                  {allPassed ? '7 / 7 PASSED' : 'TESTS FAILED'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                In-engine verification of Newton's Laws invariant test suite
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
          {testResults.map((test) => (
            <div
              key={test.id}
              className="p-3.5 bg-[#07090e] border border-slate-800/90 rounded-lg space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">
                  {test.title}
                </span>
                {test.passed ? (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3 h-3" /> PASS
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-rose-400 font-bold bg-rose-950/60 border border-rose-500/30 px-2 py-0.5 rounded">
                    <AlertTriangle className="w-3 h-3" /> FAIL
                  </span>
                )}
              </div>

              <p className="text-slate-400 text-[11px] leading-relaxed">
                {test.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[10px]">
                <div className="p-1.5 bg-slate-900/60 border border-slate-800 rounded">
                  <span className="text-slate-400 block">Expected Requirement:</span>
                  <span className="text-slate-300">{test.expected}</span>
                </div>
                <div className="p-1.5 bg-slate-900/60 border border-slate-800 rounded">
                  <span className="text-slate-400 block">Engine Output:</span>
                  <span className="text-cyan-300 font-bold">{test.actual}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#07090e] flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400">
            Validated against analytical classical mechanics models.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
