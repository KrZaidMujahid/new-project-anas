/**
 * EQUATION 1 — Carnot Heat Engine Theory & Principles
 * Deep academic thermodynamics with KaTeX LaTeX formulas, Carnot's Theorem,
 * the Second Law of Thermodynamics, and Clausius entropy balance.
 */

import React from 'react';
import { MathView } from '../MathView';
import { BookOpen, CheckCircle2, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export const CarnotTheory: React.FC = () => {
  return (
    <div className="bg-[#102740] border border-[#29445F] rounded-xl p-5 shadow-xl flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#29445F]/70">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#38BDF8]" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Thermodynamic Foundations, Equations & Carnot's Theorem
          </h3>
        </div>

        <span className="text-xs font-mono text-[#38BDF8]">
          Nicolas Léonard Sadi Carnot (1824)
        </span>
      </div>

      {/* Core Principle 1: The Carnot Efficiency Limit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-4 rounded-xl bg-[#0B1F36] border border-[#29445F] flex flex-col gap-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-[#38BDF8]" />
            1. The Carnot Theoretical Efficiency
          </h4>
          <p className="text-xs text-[#AFC2D8] leading-relaxed">
            The thermal efficiency <strong className="text-white">η</strong> of any heat engine is the ratio of useful net work performed <strong className="text-white">W_net</strong> to heat absorbed from the high-temperature reservoir <strong className="text-[#FB923C]">Q_H</strong>:
          </p>
          <div className="p-3 rounded-lg bg-[#102740] border border-[#29445F] flex justify-center">
            <MathView math="\eta = \frac{W_{\text{net}}}{Q_H} = \frac{Q_H - Q_C}{Q_H} = 1 - \frac{Q_C}{Q_H}" />
          </div>
          <p className="text-xs text-[#AFC2D8] leading-relaxed">
            For a fully reversible cycle, the ratio of heat exchanged equals the ratio of absolute temperatures <strong className="text-white">Q_C / Q_H = T_C / T_H</strong> (Kelvin scale), yielding the universal upper limit:
          </p>
          <div className="p-3 rounded-lg bg-[#102740] border border-[#38BDF8]/40 flex justify-center">
            <MathView math="\eta_{\text{Carnot}} = 1 - \frac{T_C}{T_H}" />
          </div>
        </div>

        {/* Core Principle 2: Why 100% Efficiency Is Physically Impossible */}
        <div className="p-4 rounded-xl bg-[#0B1F36] border border-[#29445F] flex flex-col gap-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            2. The Kelvin-Planck Impossibility Principle
          </h4>
          <p className="text-xs text-[#AFC2D8] leading-relaxed">
            Can an engine ever achieve <strong className="text-white">100% thermal efficiency</strong> (η = 1.0)?
          </p>
          <p className="text-xs text-[#AFC2D8] leading-relaxed">
            Examining the Carnot formula, <strong className="text-white">η = 1 - T_C / T_H = 1.0</strong> requires either:
          </p>
          <ul className="text-xs text-[#AFC2D8] space-y-1.5 list-disc pl-4">
            <li>
              <strong className="text-white">T_C = 0 K (Absolute Zero)</strong>: Strictly prohibited by the Third Law of Thermodynamics (Nernst Theorem), which establishes that absolute zero cannot be attained in a finite number of thermodynamic operations.
            </li>
            <li>
              <strong className="text-white">T_H → ∞ (Infinite Temperature)</strong>: Physically unattainable and restricted by material melting points.
            </li>
          </ul>
          <div className="p-2.5 rounded-lg bg-[#16334F] border border-[#29445F] text-[11px] text-[#38BDF8]">
            <strong>Second Law of Thermodynamics:</strong> Any cyclic heat engine MUST reject heat to a lower-temperature sink (<MathView math="Q_C > 0" />).
          </div>
        </div>
      </div>

      {/* Four Stages Mathematical Derivations */}
      <div className="p-4 rounded-xl bg-[#0B1F36] border border-[#29445F] flex flex-col gap-4">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          3. Exact Mathematical Equations for the Four Carnot Stages
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#AFC2D8]">
          {/* Stage 1 */}
          <div className="p-3 rounded-lg bg-[#102740] border border-[#F97316]/40 flex flex-col gap-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]"></span>
              Stage 1: Reversible Isothermal Expansion (A → B at T_H)
            </span>
            <p>
              The gas expands in thermal equilibrium with the hot reservoir at constant temperature <MathView math="T_H" />. Because internal energy of an ideal gas depends solely on temperature, <MathView math="\Delta U_{AB} = 0" />.
            </p>
            <div className="p-2 rounded bg-[#0B1F36] border border-[#29445F] flex justify-center">
              <MathView math="W_{AB} = \int_{V_A}^{V_B} P \, dV = n R T_H \ln\left(\frac{V_B}{V_A}\right) = Q_H" />
            </div>
          </div>

          {/* Stage 2 */}
          <div className="p-3 rounded-lg bg-[#102740] border border-[#22D3EE]/40 flex flex-col gap-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22D3EE]"></span>
              Stage 2: Reversible Adiabatic Expansion (B → C)
            </span>
            <p>
              The cylinder is insulated (<MathView math="Q_{BC} = 0" />). The gas continues to expand, doing work solely at the cost of its internal energy, cooling from <MathView math="T_H" /> to <MathView math="T_C" />:
            </p>
            <div className="p-2 rounded bg-[#0B1F36] border border-[#29445F] flex justify-center">
              <MathView math="W_{BC} = -\Delta U_{BC} = -n C_v (T_C - T_H) = \frac{n R (T_H - T_C)}{\gamma - 1}" />
            </div>
          </div>

          {/* Stage 3 */}
          <div className="p-3 rounded-lg bg-[#102740] border border-[#60A5FA]/40 flex flex-col gap-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#60A5FA]"></span>
              Stage 3: Reversible Isothermal Compression (C → D at T_C)
            </span>
            <p>
              The cylinder contacts the cold reservoir at constant temperature <MathView math="T_C" />. The piston compresses the gas, rejecting heat into the sink (<MathView math="\Delta U_{CD} = 0" />):
            </p>
            <div className="p-2 rounded bg-[#0B1F36] border border-[#29445F] flex justify-center">
              <MathView math="W_{CD} = n R T_C \ln\left(\frac{V_D}{V_C}\right) < 0, \quad Q_C = -W_{CD} = n R T_C \ln\left(\frac{V_C}{V_D}\right)" />
            </div>
          </div>

          {/* Stage 4 */}
          <div className="p-3 rounded-lg bg-[#102740] border border-[#C084FC]/40 flex flex-col gap-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C084FC]"></span>
              Stage 4: Reversible Adiabatic Compression (D → A)
            </span>
            <p>
              The cylinder is re-insulated (<MathView math="Q_{DA} = 0" />). Compressive work done on the gas increases its internal energy, restoring temperature from <MathView math="T_C" /> back to initial state A at <MathView math="T_H" />:
            </p>
            <div className="p-2 rounded bg-[#0B1F36] border border-[#29445F] flex justify-center">
              <MathView math="W_{DA} = -\Delta U_{DA} = \frac{n R (T_C - T_H)}{\gamma - 1} = -W_{BC}" />
            </div>
          </div>
        </div>
      </div>

      {/* Entropy and Reversibility */}
      <div className="p-4 rounded-xl bg-[#0B1F36] border border-[#29445F] flex flex-col gap-3">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#4ADE80]" />
          4. Entropy Balance Around a Closed Reversible Cycle
        </h4>
        <p className="text-xs text-[#AFC2D8] leading-relaxed">
          Because entropy <strong className="text-white">S</strong> is a thermodynamic state variable, the cyclic integral of <MathView math="dS = \frac{\delta Q_{\text{rev}}}{T}" /> around any reversible path must equal exactly zero:
        </p>
        <div className="p-3 rounded-lg bg-[#102740] border border-[#29445F] flex justify-center">
          <MathView math="\oint \frac{\delta Q_{\text{rev}}}{T} = \frac{Q_H}{T_H} - \frac{Q_C}{T_C} = n R \ln(r) - n R \ln(r) = 0" />
        </div>
        <p className="text-xs text-[#AFC2D8] leading-relaxed">
          In any irreversible real-world cycle, entropy generation occurs (<MathView math="S_{\text{gen}} > 0" />), strictly reducing the engine efficiency below the Carnot upper ceiling: <MathView math="\eta_{\text{real}} < \eta_{\text{Carnot}}" />.
        </p>
      </div>
    </div>
  );
};
