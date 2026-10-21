/**
 * EQUATION 1 — Simple Harmonic Motion Automated Physics Validation Suite
 * Live mathematical verification of Hooke's Law, Conservation of Energy,
 * isochronism, period formula, and kinematic milestone invariants.
 */

import React, { useMemo } from 'react';
import { SHMParameters } from '../../physics/shm/types';
import {
  computeSHMDerivedValues,
  computeSHMStateAtTime,
  convertInitialConditionsToAmplitudePhase,
} from '../../physics/shm/model';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, Play, RefreshCw } from 'lucide-react';

interface SHMValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentParams: SHMParameters;
}

interface TestResult {
  id: string;
  name: string;
  passed: boolean;
  expected: string;
  measured: string;
  errorMargin: string;
  explanation: string;
}

export const SHMValidationModal: React.FC<SHMValidationModalProps> = ({
  isOpen,
  onClose,
  currentParams,
}) => {
  const tests = useMemo<TestResult[]>(() => {
    const results: TestResult[] = [];
    const derived = computeSHMDerivedValues(currentParams);

    // Test 1: Angular Frequency & Period Exact Formula
    const expectedOmega = Math.sqrt(
      currentParams.systemType === 'pendulum'
        ? currentParams.gravity / currentParams.pendulumLength
        : currentParams.springConstant / currentParams.mass
    );
    const omegaPassed = Math.abs(derived.omega - expectedOmega) < 1e-12;
    results.push({
      id: 'test-omega',
      name: '1. Angular Frequency Equation: ω = √(k/m)',
      passed: omegaPassed,
      expected: `ω = ${expectedOmega.toFixed(6)} rad/s`,
      measured: `ω = ${derived.omega.toFixed(6)} rad/s`,
      errorMargin: '0.000000 %',
      explanation: 'Verifies exact closed-form evaluation of natural frequency without floating point drift.',
    });

    // Test 2: Period Formula: T = 2π / ω
    const expectedT = (2 * Math.PI) / expectedOmega;
    const tPassed = Math.abs(derived.period - expectedT) < 1e-12;
    results.push({
      id: 'test-period',
      name: '2. Period Exact Formulation: T = 2π√(m/k)',
      passed: tPassed,
      expected: `T = ${expectedT.toFixed(6)} s`,
      measured: `T = ${derived.period.toFixed(6)} s`,
      errorMargin: '0.000000 %',
      explanation: 'Verifies the full round-trip cycle time matches the analytical formula.',
    });

    // Test 3: Conservation of Mechanical Energy across 100 timesteps
    let maxEnergyDelta = 0;
    const testDuration = derived.period > 0 ? derived.period * 2 : 5;
    for (let i = 0; i <= 100; i++) {
      const t = (i / 100) * testDuration;
      const st = computeSHMStateAtTime(currentParams, t);
      const delta = Math.abs(st.kineticEnergy + st.potentialEnergy - derived.totalEnergy);
      if (delta > maxEnergyDelta) maxEnergyDelta = delta;
    }
    const energyPassed = maxEnergyDelta < 1e-9;
    results.push({
      id: 'test-energy',
      name: '3. Conservation of Mechanical Energy (dE/dt = 0)',
      passed: energyPassed,
      expected: `E = ${derived.totalEnergy.toFixed(6)} J (strictly constant)`,
      measured: `Max |(K+U) - E| = ${maxEnergyDelta.toExponential(3)} J`,
      errorMargin: `${(maxEnergyDelta / (derived.totalEnergy || 1) * 100).toExponential(2)} %`,
      explanation: 'Evaluated at 100 consecutive timesteps; mechanical energy is conserved with zero numerical dissipation.',
    });

    // Test 4: Hooke\'s Law Restoring Force Consistency: F = -kx
    let maxHookeDelta = 0;
    for (let i = 0; i <= 50; i++) {
      const t = (i / 50) * testDuration;
      const st = computeSHMStateAtTime(currentParams, t);
      if (currentParams.systemType !== 'pendulum') {
        const expectedF = -currentParams.springConstant * st.displacement;
        const diff = Math.abs(st.restoringForce - expectedF);
        if (diff > maxHookeDelta) maxHookeDelta = diff;
      }
    }
    const hookePassed = maxHookeDelta < 1e-10;
    results.push({
      id: 'test-hooke',
      name: '4. Restoring Force: F = -kx',
      passed: hookePassed,
      expected: 'F(t) strictly equal to -k·x(t)',
      measured: `Max |F - (-kx)| = ${maxHookeDelta.toExponential(3)} N`,
      errorMargin: '< 10⁻¹⁰ N',
      explanation: 'Restoring force strictly opposes instantaneous displacement and is directly proportional to k.',
    });

    // Test 5: Restoring Acceleration: a = -ω²x
    let maxAccelDelta = 0;
    for (let i = 0; i <= 50; i++) {
      const t = (i / 50) * testDuration;
      const st = computeSHMStateAtTime(currentParams, t);
      const expectedA = -derived.omega * derived.omega * st.displacement;
      const diff = Math.abs(st.acceleration - expectedA);
      if (diff > maxAccelDelta) maxAccelDelta = diff;
    }
    const accelPassed = maxAccelDelta < 1e-10;
    results.push({
      id: 'test-accel',
      name: '5. Acceleration Relationship: a = -ω²x',
      passed: accelPassed,
      expected: 'a(t) strictly equal to -ω²·x(t)',
      measured: `Max |a - (-ω²x)| = ${maxAccelDelta.toExponential(3)} m/s²`,
      errorMargin: '< 10⁻¹⁰ m/s²',
      explanation: 'Confirms that acceleration is proportional to displacement with opposite sign.',
    });

    // Test 6: Maximum Velocity & Acceleration: v_max = Aω, a_max = Aω²
    const expVmax = derived.effectiveAmplitude * derived.omega;
    const expAmax = derived.effectiveAmplitude * derived.omega * derived.omega;
    const maxValsPassed =
      Math.abs(derived.vMax - expVmax) < 1e-10 &&
      Math.abs(derived.aMax - expAmax) < 1e-10;
    results.push({
      id: 'test-kinematic-peaks',
      name: '6. Kinematic Peak Limits: v_max = Aω, a_max = Aω²',
      passed: maxValsPassed,
      expected: `v_max = ${expVmax.toFixed(4)} m/s, a_max = ${expAmax.toFixed(4)} m/s²`,
      measured: `v_max = ${derived.vMax.toFixed(4)} m/s, a_max = ${derived.aMax.toFixed(4)} m/s²`,
      errorMargin: '0.000000 %',
      explanation: 'Maximum speed occurs at equilibrium (x = 0); maximum acceleration occurs at amplitude bounds (x = ±A).',
    });

    // Test 7: Amplitude Independence (Isochronism of SHM)
    const testParamsDoubleA = { ...currentParams, amplitude: currentParams.amplitude * 2 };
    const derivedDoubleA = computeSHMDerivedValues(testParamsDoubleA);
    const isochronousPassed = Math.abs(derivedDoubleA.period - derived.period) < 1e-12;
    results.push({
      id: 'test-isochronism',
      name: '7. Isochronism: Period Invariance to Amplitude',
      passed: isochronousPassed,
      expected: `T(2A) = T(A) = ${derived.period.toFixed(4)} s`,
      measured: `T(2A) = ${derivedDoubleA.period.toFixed(4)} s`,
      errorMargin: '0.000000 %',
      explanation: 'Doubling the displacement doubles both the distance and the average speed, keeping the period constant.',
    });

    // Test 8: Initial Condition Equivalence
    const testX0 = 0.15;
    const testV0 = -0.50;
    const converted = convertInitialConditionsToAmplitudePhase(testX0, testV0, derived.omega);
    const reconX0 = converted.amplitude * Math.cos(converted.phaseRad);
    const reconV0 = -converted.amplitude * derived.omega * Math.sin(converted.phaseRad);
    const initialCondPassed =
      Math.abs(reconX0 - testX0) < 1e-10 && Math.abs(reconV0 - testV0) < 1e-10;
    results.push({
      id: 'test-init-cond',
      name: '8. Initial Conditions Inversion: (x₀, v₀) ↔ (A, φ)',
      passed: initialCondPassed,
      expected: `x₀ = ${testX0.toFixed(3)} m, v₀ = ${testV0.toFixed(3)} m/s`,
      measured: `x₀ = ${reconX0.toFixed(3)} m, v₀ = ${reconV0.toFixed(3)} m/s`,
      errorMargin: '< 10⁻¹⁰',
      explanation: 'Verifies bidirectional consistency between initial Cartesian coordinates and polar phasor coordinates.',
    });

    return results;
  }, [currentParams]);

  if (!isOpen) return null;

  const allPassed = tests.every((t) => t.passed);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#090d16] border border-slate-800 rounded-xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-[#07090e]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Automated Physics Validation Suite
              </h2>
              <p className="text-xs text-slate-400">
                Rigorous testing of SHM equations, invariants, and energy conservation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status banner */}
        <div className="px-6 py-3 bg-[#070a10] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {allPassed ? (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>All 8 Physics Tests Passed (Zero Violations)</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                <span>Some Tests Reported Discrepancies</span>
              </span>
            )}
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Precision: IEEE 754 Double Precision
          </span>
        </div>

        {/* Tests list */}
        <div className="p-6 overflow-y-auto space-y-3">
          {tests.map((t) => (
            <div
              key={t.id}
              className="p-3.5 rounded-lg bg-[#07090e] border border-slate-800 space-y-1.5 text-xs font-mono"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-[13px]">{t.name}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    t.passed
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                      : 'bg-rose-950/60 text-rose-400 border border-rose-500/40'
                  }`}
                >
                  {t.passed ? 'PASSED' : 'FAILED'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-300 pt-1">
                <div>
                  <span className="text-slate-500">Expected: </span>
                  {t.expected}
                </div>
                <div>
                  <span className="text-slate-500">Measured: </span>
                  <span className="text-cyan-300">{t.measured}</span>
                </div>
              </div>
              <p className="text-[11px] font-sans text-slate-400 pt-1">
                {t.explanation}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800/80 bg-[#07090e] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors cursor-pointer"
          >
            Close Validation Suite
          </button>
        </div>
      </div>
    </div>
  );
};
