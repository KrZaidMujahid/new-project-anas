/**
 * EQUATION 1 — Simple Harmonic Motion Energy Visualization Panel
 * Dedicated potential well parabola U(x) = 1/2 k x², kinetic energy complement,
 * animated dynamic bars, and proof of mechanical energy conservation E = K + U = constant.
 */

import React from 'react';
import { SHMParameters, SHMDerivedValues, SHMState } from '../../physics/shm/types';
import { Zap, ShieldCheck } from 'lucide-react';

interface SHMEnergyPanelProps {
  params: SHMParameters;
  derived: SHMDerivedValues;
  state: SHMState;
}

export const SHMEnergyPanel: React.FC<SHMEnergyPanelProps> = ({
  params,
  derived,
  state,
}) => {
  const totalE = Math.max(1e-8, derived.totalEnergy);
  const kRatio = Math.max(0, Math.min(1, state.kineticEnergy / totalE));
  const uRatio = Math.max(0, Math.min(1, state.potentialEnergy / totalE));

  // Potential Well SVG geometry
  const svgWidth = 460;
  const svgHeight = 200;
  const padding = { top: 20, right: 30, bottom: 35, left: 55 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;
  const midX = padding.left + plotWidth / 2;

  const maxDisp = Math.max(0.05, derived.effectiveAmplitude * 1.25);
  const toX = (x: number) => midX + (x / maxDisp) * (plotWidth * 0.44);
  const toY = (e: number) => padding.top + plotHeight - (e / (totalE * 1.2)) * plotHeight;

  // Parabolic potential well: U(x) = 1/2 k x²
  // We plot U from -maxDisp to +maxDisp
  const parabolaPoints: string[] = [];
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const x = -maxDisp + (i / steps) * (2 * maxDisp);
    const u = 0.5 * params.springConstant * x * x;
    parabolaPoints.push(`${i === 0 ? 'M' : 'L'} ${toX(x).toFixed(1)},${toY(u).toFixed(1)}`);
  }
  const parabolaPath = parabolaPoints.join(' ');

  // Ball position on the potential well: x = displacement, U = potential energy
  const ballX = toX(state.displacement);
  const ballY = toY(state.potentialEnergy);
  const totalEY = toY(derived.totalEnergy);

  return (
    <div className="bg-[#090d16] border border-slate-800/90 rounded-xl p-4 sm:p-5 select-none space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <h2 className="text-xs font-bold text-white tracking-wider uppercase font-mono">
            Energy Transformation & Potential Well
          </h2>
        </div>
        <div className="text-[11px] font-mono text-slate-300">
          Total Energy E = <strong className="text-white font-bold">{derived.totalEnergy.toFixed(4)} J</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left: Interactive Potential Well SVG */}
        <div className="md:col-span-7 bg-[#07090e] p-2 rounded-lg border border-slate-800">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto font-mono text-[9px]">
            {/* Zero Base & Axes */}
            <line x1={padding.left} y1={padding.top + plotHeight} x2={padding.left + plotWidth} y2={padding.top + plotHeight} stroke="#334155" strokeWidth="1.5" />
            <line x1={midX} y1={padding.top} x2={midX} y2={padding.top + plotHeight} stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />

            {/* Total Mechanical Energy Line */}
            <line
              x1={padding.left}
              y1={totalEY}
              x2={padding.left + plotWidth}
              y2={totalEY}
              stroke="#ffffff"
              strokeWidth="2"
            />
            <text x={padding.left + plotWidth} y={totalEY - 6} fill="#ffffff" textAnchor="end" fontWeight="bold">
              Total Energy E = ½kA² ({derived.totalEnergy.toFixed(3)} J)
            </text>

            {/* Parabolic Potential Well Curve U(x) */}
            <path d={parabolaPath} fill="none" stroke="#c084fc" strokeWidth="2.5" />

            {/* Shaded Energy Columns at Current State */}
            {/* Potential Energy column (purple, from bottom to ballY) */}
            <line x1={ballX} y1={padding.top + plotHeight} x2={ballX} y2={ballY} stroke="#c084fc" strokeWidth="3" />

            {/* Kinetic Energy column (cyan, from ballY to totalEY) */}
            <line x1={ballX} y1={ballY} x2={ballX} y2={totalEY} stroke="#38bdf8" strokeWidth="3" />

            {/* Moving Ball on the Well */}
            <circle cx={ballX} cy={ballY} r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />

            {/* Axis Labels */}
            <text x={padding.left - 10} y={totalEY + 4} fill="#ffffff" textAnchor="end">E</text>
            <text x={padding.left - 10} y={padding.top + plotHeight + 4} fill="#64748b" textAnchor="end">0</text>
            <text x={toX(-derived.effectiveAmplitude)} y={padding.top + plotHeight + 14} fill="#c084fc" textAnchor="middle">-A</text>
            <text x={midX} y={padding.top + plotHeight + 14} fill="#64748b" textAnchor="middle">x = 0</text>
            <text x={toX(derived.effectiveAmplitude)} y={padding.top + plotHeight + 14} fill="#c084fc" textAnchor="middle">+A</text>
            <text x={padding.left + plotWidth} y={padding.top + plotHeight + 14} fill="#94a3b8" textAnchor="end">
              Displacement x →
            </text>
          </svg>
          <div className="flex justify-between text-[10px] text-slate-500 px-3 mt-1 font-mono">
            <span>Purple Line: U(x) = ½kx²</span>
            <span>Cyan Gap: K = E - U</span>
            <span>White Line: Constant Total E</span>
          </div>
        </div>

        {/* Right: Real-time Bar Gauges & Scientific Explanations */}
        <div className="md:col-span-5 space-y-4 text-xs font-mono">
          {/* Animated Energy Bars */}
          <div className="space-y-3">
            {/* Kinetic Energy Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500" />
                  <span>Kinetic Energy (K = ½mv²):</span>
                </span>
                <span className="font-bold text-white tabular-nums">
                  {state.kineticEnergy.toFixed(4)} J ({(kRatio * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-cyan-500 transition-all duration-75"
                  style={{ width: `${kRatio * 100}%` }}
                />
              </div>
            </div>

            {/* Potential Energy Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span className="flex items-center gap-1.5 text-purple-300">
                  <span className="w-2.5 h-2.5 rounded-sm bg-purple-500" />
                  <span>Potential Energy (U = ½kx²):</span>
                </span>
                <span className="font-bold text-white tabular-nums">
                  {state.potentialEnergy.toFixed(4)} J ({(uRatio * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-purple-500 transition-all duration-75"
                  style={{ width: `${uRatio * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Educational Exchange Rules */}
          <div className="p-3 rounded-lg bg-[#07090e] border border-slate-800 space-y-2 text-[11px] leading-relaxed">
            <div className="flex items-start gap-1.5">
              <span className="text-cyan-400 font-bold">•</span>
              <p className="text-slate-300">
                <strong className="text-white">At x = ±A:</strong> Velocity is 0, so <strong className="text-cyan-300">K = 0</strong> and <strong className="text-purple-300">U = E = ½kA² (Max)</strong>.
              </p>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-cyan-400 font-bold">•</span>
              <p className="text-slate-300">
                <strong className="text-white">At x = 0:</strong> Displacement is 0, so <strong className="text-purple-300">U = 0</strong> and <strong className="text-cyan-300">K = E = ½mv_max² (Max)</strong>.
              </p>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-emerald-400 font-bold">•</span>
              <p className="text-slate-300">
                <strong className="text-white">Anywhere in between:</strong> Continuous lossless exchange where <strong className="text-emerald-400">K + U = E (Constant)</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
