/**
 * EQUATION 1 — Thermodynamic Experiments Studio
 * Interactive investigations of:
 * - Exp 1: Effect of Temperature (P ∝ T, v_rms ∝ √T, ⟨E_k⟩ ∝ T)
 * - Exp 2: Boyle's Law (P ∝ 1/V, PV = const)
 * - Exp 3: Number of Moles and Pressure (P ∝ n)
 * - Kinetic Theory Consistency Verification: P_kinetic = ⅓ ρ v²_rms vs P_ideal = nRT/V
 */

import React, { useState, useMemo } from 'react';
import {
  KineticParameters,
  KineticResults,
} from '../../physics/kinetic/types';
import {
  GAS_CONSTANT_R,
  computeKineticResults,
} from '../../physics/kinetic/model';
import {
  Flame,
  ArrowRight,
  TrendingUp,
  Scale,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  RefreshCw,
  Gauge,
  Info,
} from 'lucide-react';

interface GasExperimentsProps {
  params: KineticParameters;
  results: KineticResults;
  onParamChange: <K extends keyof KineticParameters>(
    key: K,
    value: KineticParameters[K]
  ) => void;
}

export const GasExperiments: React.FC<GasExperimentsProps> = ({
  params,
  results,
  onParamChange,
}) => {
  const [activeExp, setActiveExp] = useState<'temp' | 'boyle' | 'moles' | 'kinetic'>(
    'temp'
  );

  // 1. Temperature Curve Data (P vs T at constant V, n)
  const pVsTData = useMemo(() => {
    const points: { tempK: number; pressureKPa: number }[] = [];
    for (let t = 100; t <= 1000; t += 50) {
      const pPa = (params.moles * GAS_CONSTANT_R * t) / (params.volumeLiters * 1e-3);
      points.push({ tempK: t, pressureKPa: pPa / 1000 });
    }
    return points;
  }, [params.moles, params.volumeLiters]);

  // 2. Boyle's Law Data (P vs V at constant T, n)
  const pVsVData = useMemo(() => {
    const points: { volumeL: number; pressureKPa: number; pvProduct: number }[] = [];
    for (let v = 1; v <= 10; v += 0.5) {
      const pPa = (params.moles * GAS_CONSTANT_R * params.temperatureK) / (v * 1e-3);
      points.push({
        volumeL: v,
        pressureKPa: pPa / 1000,
        pvProduct: (pPa / 1000) * v, // in kPa * L
      });
    }
    return points;
  }, [params.moles, params.temperatureK]);

  // 3. Moles Data (P vs n at constant T, V)
  const pVsNData = useMemo(() => {
    const points: { moles: number; pressureKPa: number }[] = [];
    for (let n = 0.1; n <= 2.0; n += 0.1) {
      const pPa = (n * GAS_CONSTANT_R * params.temperatureK) / (params.volumeLiters * 1e-3);
      points.push({ moles: n, pressureKPa: pPa / 1000 });
    }
    return points;
  }, [params.temperatureK, params.volumeLiters]);

  return (
    <div className="bg-[#102740] rounded-xl border border-[#29445F] p-5 shadow-xl space-y-5 text-[#F1F5F9]">
      {/* Header and Experiment Selector Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#29445F] pb-3">
        <div>
          <h3 className="text-sm font-bold text-[#F1F5F9] tracking-wide flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#38BDF8]" />
            <span>Thermodynamic Laws &amp; Experimental Investigations</span>
          </h3>
          <p className="text-[11px] text-[#AFC2D8]">
            Isolate physical variables to observe proportionalities and kinetic momentum balance
          </p>
        </div>

        {/* Experiment Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#0B1F36] p-1 rounded-lg border border-[#29445F] text-xs">
          <button
            onClick={() => setActiveExp('temp')}
            className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              activeExp === 'temp'
                ? 'bg-[#FB923C] text-black font-bold shadow-xs'
                : 'text-[#AFC2D8] hover:text-white'
            }`}
          >
            Exp 1: Temperature (P ∝ T)
          </button>
          <button
            onClick={() => setActiveExp('boyle')}
            className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              activeExp === 'boyle'
                ? 'bg-[#38BDF8] text-black font-bold shadow-xs'
                : 'text-[#AFC2D8] hover:text-white'
            }`}
          >
            Exp 2: Boyle's Law (P ∝ 1/V)
          </button>
          <button
            onClick={() => setActiveExp('moles')}
            className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              activeExp === 'moles'
                ? 'bg-[#A78BFA] text-black font-bold shadow-xs'
                : 'text-[#AFC2D8] hover:text-white'
            }`}
          >
            Exp 3: Gas Amount (P ∝ n)
          </button>
          <button
            onClick={() => setActiveExp('kinetic')}
            className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              activeExp === 'kinetic'
                ? 'bg-[#4ADE80] text-black font-bold shadow-xs'
                : 'text-[#AFC2D8] hover:text-white'
            }`}
          >
            Kinetic Consistency Check
          </button>
        </div>
      </div>

      {/* EXPERIMENT 1: EFFECT OF TEMPERATURE (P ∝ T) */}
      {activeExp === 'temp' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Control & Live Relationships */}
            <div className="md:col-span-1 space-y-3 bg-[#0B1F36] p-4 rounded-xl border border-[#29445F]">
              <div className="text-xs font-bold text-[#FB923C] flex items-center gap-1.5">
                <Flame className="w-4 h-4" />
                <span>Gay-Lussac / Amontons Law</span>
              </div>
              <p className="text-xs text-[#AFC2D8] leading-relaxed">
                At constant volume (<span className="font-mono text-white">{params.volumeLiters} L</span>) and fixed amount (
                <span className="font-mono text-white">{params.moles} mol</span>), pressure is strictly proportional to absolute temperature.
              </p>

              <div className="space-y-2 pt-2 border-t border-[#29445F]">
                <div className="flex justify-between text-xs">
                  <span className="text-[#AFC2D8]">P / T Constant:</span>
                  <span className="font-mono font-bold text-[#FB923C]">
                    {(results.pressurePa / params.temperatureK).toFixed(2)} Pa/K
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#AFC2D8]">v_rms Scaling:</span>
                  <span className="font-mono font-bold text-[#38BDF8]">
                    v_rms ∝ √T ({Math.round(results.vRms)} m/s)
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#AFC2D8]">⟨E_k⟩ Scaling:</span>
                  <span className="font-mono font-bold text-[#4ADE80]">
                    ⟨E_k⟩ ∝ T ({(results.avgKineticEnergyJ * 1e21).toFixed(2)} zJ)
                  </span>
                </div>
              </div>

              {/* Presets */}
              <div className="pt-2 border-t border-[#29445F] space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-[#AFC2D8]">Standard Test Points:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[200, 300, 500, 800].map((t) => (
                    <button
                      key={t}
                      onClick={() => onParamChange('temperatureK', t)}
                      className={`px-2 py-1 rounded text-xs font-mono border cursor-pointer ${
                        params.temperatureK === t
                          ? 'bg-[#FB923C] text-black font-bold border-[#FB923C]'
                          : 'bg-[#16334F] text-[#AFC2D8] border-[#29445F] hover:text-white'
                      }`}
                    >
                      {t} K ({((results.pressurePa / params.temperatureK) * t / 1000).toFixed(0)} kPa)
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Linear P vs T Graph */}
            <div className="md:col-span-2 bg-[#071426] p-4 rounded-xl border border-[#29445F] flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-bold text-white">Pressure vs. Temperature Isotherm Plot</span>
                <span className="text-[11px] font-mono text-[#FB923C]">P = (nR/V) · T (Linear)</span>
              </div>

              <div className="h-52 w-full flex items-center justify-center">
                <svg viewBox="0 0 500 200" className="w-full h-full">
                  {/* Grid Lines */}
                  {[50, 100, 150].map((y) => (
                    <line
                      key={y}
                      x1="45"
                      y1={y}
                      x2="480"
                      y2={y}
                      stroke="#16334F"
                      strokeDasharray="2 2"
                    />
                  ))}
                  {/* Axes */}
                  <line x1="45" y1="170" x2="480" y2="170" stroke="#29445F" strokeWidth="1.5" />
                  <line x1="45" y1="20" x2="45" y2="170" stroke="#29445F" strokeWidth="1.5" />

                  {/* Line Plot P(T) */}
                  {(() => {
                    const maxP = Math.max(...pVsTData.map((d) => d.pressureKPa));
                    const scaleX = (t: number) => 45 + ((t - 100) / 900) * 420;
                    const scaleY = (p: number) => 170 - (p / maxP) * 140;

                    const pathD = pVsTData.reduce((acc, pt, i) => {
                      return `${acc} ${i === 0 ? 'M' : 'L'} ${scaleX(pt.tempK).toFixed(1)} ${scaleY(pt.pressureKPa).toFixed(1)}`;
                    }, '');

                    const currentX = scaleX(params.temperatureK);
                    const currentY = scaleY(results.pressureKPa);

                    return (
                      <>
                        <path d={pathD} fill="none" stroke="#FB923C" strokeWidth="2.5" />
                        {/* Current operating point marker */}
                        <circle cx={currentX} cy={currentY} r="6" fill="#FB923C" stroke="#FFFFFF" strokeWidth="1.5" />
                        <line x1={currentX} y1={currentY} x2={currentX} y2="170" stroke="#FB923C" strokeDasharray="3 3" />
                      </>
                    );
                  })()}

                  {/* Labels */}
                  <text x="260" y="192" fill="#AFC2D8" fontSize="10" textAnchor="middle">
                    Temperature, T (K)
                  </text>
                  <text x="15" y="95" fill="#AFC2D8" fontSize="10" transform="rotate(-90 15 95)" textAnchor="middle">
                    P (kPa)
                  </text>
                </svg>
              </div>

              <div className="text-[11px] text-[#AFC2D8] text-center mt-1">
                Current Operating State: <span className="font-mono text-white font-bold">{params.temperatureK} K</span> ➔{' '}
                <span className="font-mono text-[#FB923C] font-bold">{results.pressureKPa.toFixed(1)} kPa</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EXPERIMENT 2: BOYLE'S LAW (P ∝ 1/V) */}
      {activeExp === 'boyle' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 space-y-3 bg-[#0B1F36] p-4 rounded-xl border border-[#29445F]">
              <div className="text-xs font-bold text-[#38BDF8] flex items-center gap-1.5">
                <Scale className="w-4 h-4" />
                <span>Boyle's Law (Isothermal Compression)</span>
              </div>
              <p className="text-xs text-[#AFC2D8] leading-relaxed">
                At constant temperature (<span className="font-mono text-white">{params.temperatureK} K</span>) and fixed moles,
                decreasing the volume crowds molecules together, causing wall collisions to occur more frequently per unit area and time.
              </p>

              <div className="space-y-2 pt-2 border-t border-[#29445F]">
                <div className="flex justify-between text-xs">
                  <span className="text-[#AFC2D8]">P · V Product:</span>
                  <span className="font-mono font-bold text-[#38BDF8]">
                    {(results.pressureKPa * params.volumeLiters).toFixed(1)} kPa·L
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#AFC2D8]">Ideal Law:</span>
                  <span className="font-mono text-[#AFC2D8]">P · V = nRT = const</span>
                </div>
              </div>

              {/* Volume quick selectors */}
              <div className="pt-2 border-t border-[#29445F] space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-[#AFC2D8]">Compare Volume States:</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[2.0, 5.0, 10.0].map((v) => (
                    <button
                      key={v}
                      onClick={() => onParamChange('volumeLiters', v)}
                      className={`px-2 py-1 rounded text-xs font-mono border cursor-pointer ${
                        params.volumeLiters === v
                          ? 'bg-[#38BDF8] text-black font-bold border-[#38BDF8]'
                          : 'bg-[#16334F] text-[#AFC2D8] border-[#29445F] hover:text-white'
                      }`}
                    >
                      {v.toFixed(1)} L
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Hyperbolic P vs V Graph */}
            <div className="md:col-span-2 bg-[#071426] p-4 rounded-xl border border-[#29445F] flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-bold text-white">Pressure vs. Volume Hyperbolic Isotherm</span>
                <span className="text-[11px] font-mono text-[#38BDF8]">P = (nRT) · (1/V)</span>
              </div>

              <div className="h-52 w-full flex items-center justify-center">
                <svg viewBox="0 0 500 200" className="w-full h-full">
                  {[50, 100, 150].map((y) => (
                    <line key={y} x1="45" y1={y} x2="480" y2={y} stroke="#16334F" strokeDasharray="2 2" />
                  ))}
                  <line x1="45" y1="170" x2="480" y2="170" stroke="#29445F" strokeWidth="1.5" />
                  <line x1="45" y1="20" x2="45" y2="170" stroke="#29445F" strokeWidth="1.5" />

                  {(() => {
                    const maxP = Math.max(...pVsVData.map((d) => d.pressureKPa));
                    const scaleX = (v: number) => 45 + ((v - 1) / 9) * 420;
                    const scaleY = (p: number) => 170 - (p / maxP) * 140;

                    const pathD = pVsVData.reduce((acc, pt, i) => {
                      return `${acc} ${i === 0 ? 'M' : 'L'} ${scaleX(pt.volumeL).toFixed(1)} ${scaleY(pt.pressureKPa).toFixed(1)}`;
                    }, '');

                    const currentX = scaleX(params.volumeLiters);
                    const currentY = scaleY(results.pressureKPa);

                    return (
                      <>
                        <path d={pathD} fill="none" stroke="#38BDF8" strokeWidth="2.5" />
                        <circle cx={currentX} cy={currentY} r="6" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.5" />
                        <line x1={currentX} y1={currentY} x2={currentX} y2="170" stroke="#38BDF8" strokeDasharray="3 3" />
                      </>
                    );
                  })()}

                  <text x="260" y="192" fill="#AFC2D8" fontSize="10" textAnchor="middle">
                    Volume, V (Liters)
                  </text>
                  <text x="15" y="95" fill="#AFC2D8" fontSize="10" transform="rotate(-90 15 95)" textAnchor="middle">
                    P (kPa)
                  </text>
                </svg>
              </div>

              <div className="text-[11px] text-[#AFC2D8] text-center mt-1">
                At V = <span className="font-mono text-white font-bold">{params.volumeLiters.toFixed(1)} L</span> ➔{' '}
                P = <span className="font-mono text-[#38BDF8] font-bold">{results.pressureKPa.toFixed(1)} kPa</span> • (PV = const)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EXPERIMENT 3: NUMBER OF MOLES (P ∝ n) */}
      {activeExp === 'moles' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 space-y-3 bg-[#0B1F36] p-4 rounded-xl border border-[#29445F]">
              <div className="text-xs font-bold text-[#A78BFA] flex items-center gap-1.5">
                <Gauge className="w-4 h-4" />
                <span>Avogadro / Gas Amount Proportionality</span>
              </div>
              <p className="text-xs text-[#AFC2D8] leading-relaxed">
                At constant temperature (<span className="font-mono text-white">{params.temperatureK} K</span>) and volume (
                <span className="font-mono text-white">{params.volumeLiters} L</span>), pressure is directly proportional to the amount of gas (n).
              </p>

              <div className="space-y-2 pt-2 border-t border-[#29445F]">
                <div className="flex justify-between text-xs">
                  <span className="text-[#AFC2D8]">P / n Ratio:</span>
                  <span className="font-mono font-bold text-[#A78BFA]">
                    {(results.pressureKPa / params.moles).toFixed(1)} kPa/mol
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#AFC2D8]">Total Molecules:</span>
                  <span className="font-mono font-bold text-white">
                    {(params.moles * 6.022e23).toExponential(2)}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#071426] border border-[#29445F] text-[11px] text-[#AFC2D8]">
                <strong className="text-white">Note:</strong> Changing moles alters macroscopic pressure P, but does not alter individual particle speeds or average molecular kinetic energy.
              </div>
            </div>

            {/* Linear P vs n Graph */}
            <div className="md:col-span-2 bg-[#071426] p-4 rounded-xl border border-[#29445F] flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-bold text-white">Pressure vs. Moles Linear Plot</span>
                <span className="text-[11px] font-mono text-[#A78BFA]">P = (RT/V) · n</span>
              </div>

              <div className="h-52 w-full flex items-center justify-center">
                <svg viewBox="0 0 500 200" className="w-full h-full">
                  {[50, 100, 150].map((y) => (
                    <line key={y} x1="45" y1={y} x2="480" y2={y} stroke="#16334F" strokeDasharray="2 2" />
                  ))}
                  <line x1="45" y1="170" x2="480" y2="170" stroke="#29445F" strokeWidth="1.5" />
                  <line x1="45" y1="20" x2="45" y2="170" stroke="#29445F" strokeWidth="1.5" />

                  {(() => {
                    const maxP = Math.max(...pVsNData.map((d) => d.pressureKPa));
                    const scaleX = (n: number) => 45 + ((n - 0.1) / 1.9) * 420;
                    const scaleY = (p: number) => 170 - (p / maxP) * 140;

                    const pathD = pVsNData.reduce((acc, pt, i) => {
                      return `${acc} ${i === 0 ? 'M' : 'L'} ${scaleX(pt.moles).toFixed(1)} ${scaleY(pt.pressureKPa).toFixed(1)}`;
                    }, '');

                    const currentX = scaleX(params.moles);
                    const currentY = scaleY(results.pressureKPa);

                    return (
                      <>
                        <path d={pathD} fill="none" stroke="#A78BFA" strokeWidth="2.5" />
                        <circle cx={currentX} cy={currentY} r="6" fill="#A78BFA" stroke="#FFFFFF" strokeWidth="1.5" />
                        <line x1={currentX} y1={currentY} x2={currentX} y2="170" stroke="#A78BFA" strokeDasharray="3 3" />
                      </>
                    );
                  })()}

                  <text x="260" y="192" fill="#AFC2D8" fontSize="10" textAnchor="middle">
                    Amount of Gas, n (mol)
                  </text>
                  <text x="15" y="95" fill="#AFC2D8" fontSize="10" transform="rotate(-90 15 95)" textAnchor="middle">
                    P (kPa)
                  </text>
                </svg>
              </div>

              <div className="text-[11px] text-[#AFC2D8] text-center mt-1">
                At n = <span className="font-mono text-white font-bold">{params.moles.toFixed(2)} mol</span> ➔{' '}
                P = <span className="font-mono text-[#A78BFA] font-bold">{results.pressureKPa.toFixed(1)} kPa</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KINETIC THEORY CONSISTENCY CHECK */}
      {activeExp === 'kinetic' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#0B1F36] border border-[#4ADE80]/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-[#4ADE80]">
                <ShieldCheck className="w-5 h-5" />
                <span>Microscopic Kinetic Pressure vs. Macroscopic Ideal Gas Law</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#16334F] text-[#4ADE80] border border-[#29445F]">
                Verification: Complete Agreement ✓
              </span>
            </div>

            <p className="text-xs text-[#AFC2D8] leading-relaxed">
              Kinetic theory rigorously derives macroscopic pressure from the mechanical momentum transfer of gas molecules
              colliding with the container walls: <span className="font-mono text-white font-semibold">P = ⅓ ρ v²_rms</span>.
              Below, we evaluate both expressions side-by-side using current parameters to verify their exact mathematical equivalence:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Kinetic Expression */}
              <div className="p-3.5 rounded-lg bg-[#071426] border border-[#29445F] space-y-2">
                <div className="text-xs font-bold text-[#38BDF8]">
                  1. Microscopic Kinetic Model: P_kinetic = ⅓ ρ v²_rms
                </div>
                <div className="text-[11px] text-[#AFC2D8] space-y-1 font-mono">
                  <div>• Gas Density ρ = nM / V = ({params.moles} × {results.gasSpecies.molarMassKgPerMol}) / {results.volumeM3} m³</div>
                  <div className="pl-3 text-white">ρ = {results.massDensityKgPerM3.toFixed(4)} kg/m³</div>
                  <div>• RMS Speed v_rms = {Math.round(results.vRms)} m/s</div>
                  <div>• P_kinetic = ⅓ × {results.massDensityKgPerM3.toFixed(4)} × ({Math.round(results.vRms)})²</div>
                  <div className="text-sm font-bold text-[#38BDF8] pt-1">
                    = {Math.round(results.pressureKineticPa).toLocaleString()} Pa ({(results.pressureKineticPa / 1000).toFixed(2)} kPa)
                  </div>
                </div>
              </div>

              {/* Macroscopic Ideal Gas Expression */}
              <div className="p-3.5 rounded-lg bg-[#071426] border border-[#29445F] space-y-2">
                <div className="text-xs font-bold text-[#A78BFA]">
                  2. Macroscopic Ideal Gas Law: P_ideal = nRT / V
                </div>
                <div className="text-[11px] text-[#AFC2D8] space-y-1 font-mono">
                  <div>• Amount n = {params.moles} mol, T = {params.temperatureK} K</div>
                  <div>• Volume V = {results.volumeM3} m³ ({params.volumeLiters} L)</div>
                  <div>• Gas Constant R = 8.31446 J/(mol·K)</div>
                  <div>• P_ideal = ({params.moles} × 8.31446 × {params.temperatureK}) / {results.volumeM3}</div>
                  <div className="text-sm font-bold text-[#A78BFA] pt-1">
                    = {Math.round(results.pressurePa).toLocaleString()} Pa ({results.pressureKPa.toFixed(2)} kPa)
                  </div>
                </div>
              </div>
            </div>

            {/* Agreement Tolerance Badge */}
            <div className="p-3 rounded-lg bg-[#16334F] border border-[#4ADE80] flex items-center justify-between text-xs">
              <span className="text-[#AFC2D8]">
                Difference |P_kinetic − P_ideal|:
              </span>
              <span className="font-mono font-bold text-[#4ADE80] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />
                <span>{results.pressureDifferencePa.toFixed(6)} Pa (Exact numerical identity)</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
