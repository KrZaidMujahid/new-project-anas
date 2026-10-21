/**
 * EQUATION 1 — Maxwell–Boltzmann Molecular Speed Distribution Plot
 * Scientifically rigorous SVG curve evaluation, characteristic speed markers
 * (v_mp, v_mean, v_rms), and dual-distribution comparison mode.
 */

import React, { useState, useMemo } from 'react';
import {
  KineticParameters,
  KineticResults,
  GasType,
} from '../../physics/kinetic/types';
import {
  GAS_CATALOG,
  GAS_CONSTANT_R,
  generateMaxwellDistributionPoints,
  maxwellBoltzmannPDF,
  verifyMaxwellDistributionArea,
} from '../../physics/kinetic/model';
import {
  Activity,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

interface MaxwellBoltzmannGraphProps {
  params: KineticParameters;
  results: KineticResults;
}

export const MaxwellBoltzmannGraph: React.FC<MaxwellBoltzmannGraphProps> = ({
  params,
  results,
}) => {
  // Dual Comparison Mode State
  const [comparisonMode, setComparisonMode] = useState<
    'none' | 'temperature' | 'gasType'
  >('none');
  const [compareTempK, setCompareTempK] = useState<number>(600);
  const [compareGasType, setCompareGasType] = useState<GasType>('helium');
  const [hoveredSpeed, setHoveredSpeed] = useState<number | null>(null);

  const primarySpecies = results.gasSpecies;
  const compareSpecies = GAS_CATALOG[compareGasType];

  // Determine global max speed for X-axis domain to fit both distributions
  const maxDomainSpeed = useMemo(() => {
    let maxV = results.vRms * 3.2;

    if (comparisonMode === 'temperature') {
      const vRmsComp = Math.sqrt(
        (3 * GAS_CONSTANT_R * compareTempK) / primarySpecies.molarMassKgPerMol
      );
      maxV = Math.max(maxV, vRmsComp * 3.2);
    } else if (comparisonMode === 'gasType') {
      const vRmsComp = Math.sqrt(
        (3 * GAS_CONSTANT_R * params.temperatureK) / compareSpecies.molarMassKgPerMol
      );
      maxV = Math.max(maxV, vRmsComp * 3.2);
    }

    // Round up nicely to nearest 200 or 500
    return Math.ceil(maxV / 250) * 250;
  }, [
    results.vRms,
    comparisonMode,
    compareTempK,
    compareGasType,
    params.temperatureK,
    primarySpecies.molarMassKgPerMol,
    compareSpecies.molarMassKgPerMol,
  ]);

  // Primary distribution data points
  const primaryPoints = useMemo(() => {
    return generateMaxwellDistributionPoints(
      params.temperatureK,
      primarySpecies.molarMassKgPerMol,
      maxDomainSpeed,
      250
    );
  }, [params.temperatureK, primarySpecies.molarMassKgPerMol, maxDomainSpeed]);

  // Secondary comparison data points
  const comparePoints = useMemo(() => {
    if (comparisonMode === 'none') return null;

    const t = comparisonMode === 'temperature' ? compareTempK : params.temperatureK;
    const m =
      comparisonMode === 'gasType'
        ? compareSpecies.molarMassKgPerMol
        : primarySpecies.molarMassKgPerMol;

    return generateMaxwellDistributionPoints(t, m, maxDomainSpeed, 250);
  }, [
    comparisonMode,
    compareTempK,
    compareGasType,
    params.temperatureK,
    primarySpecies.molarMassKgPerMol,
    compareSpecies.molarMassKgPerMol,
    maxDomainSpeed,
  ]);

  // Secondary characteristic speeds
  const compareSpeeds = useMemo(() => {
    if (comparisonMode === 'none') return null;

    const t = comparisonMode === 'temperature' ? compareTempK : params.temperatureK;
    const m =
      comparisonMode === 'gasType'
        ? compareSpecies.molarMassKgPerMol
        : primarySpecies.molarMassKgPerMol;

    return {
      vMp: Math.sqrt((2 * GAS_CONSTANT_R * t) / m),
      vMean: Math.sqrt((8 * GAS_CONSTANT_R * t) / (Math.PI * m)),
      vRms: Math.sqrt((3 * GAS_CONSTANT_R * t) / m),
    };
  }, [
    comparisonMode,
    compareTempK,
    compareGasType,
    params.temperatureK,
    primarySpecies.molarMassKgPerMol,
    compareSpecies.molarMassKgPerMol,
  ]);

  // Peak probability density across both curves for Y-axis scaling
  const maxDensity = useMemo(() => {
    let peak = Math.max(...primaryPoints.map((p) => p.probabilityDensity));
    if (comparePoints) {
      const comparePeak = Math.max(...comparePoints.map((p) => p.probabilityDensity));
      peak = Math.max(peak, comparePeak);
    }
    return peak * 1.15; // 15% headroom
  }, [primaryPoints, comparePoints]);

  // SVG coordinate transform helpers
  const svgWidth = 720;
  const svgHeight = 360;
  const padding = { top: 30, right: 35, bottom: 50, left: 65 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  const scaleX = (speed: number) =>
    padding.left + (speed / maxDomainSpeed) * plotWidth;

  const scaleY = (density: number) =>
    padding.top + plotHeight - (density / maxDensity) * plotHeight;

  // Build SVG paths
  const primaryPathD = useMemo(() => {
    return primaryPoints.reduce((acc, pt, i) => {
      const x = scaleX(pt.speed);
      const y = scaleY(pt.probabilityDensity);
      return `${acc} ${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }, '');
  }, [primaryPoints, maxDomainSpeed, maxDensity]);

  const primaryAreaD = useMemo(() => {
    if (!primaryPoints.length) return '';
    const firstX = scaleX(primaryPoints[0].speed);
    const lastX = scaleX(primaryPoints[primaryPoints.length - 1].speed);
    const baselineY = scaleY(0);
    return `${primaryPathD} L ${lastX.toFixed(1)} ${baselineY.toFixed(1)} L ${firstX.toFixed(1)} ${baselineY.toFixed(1)} Z`;
  }, [primaryPathD, primaryPoints, maxDomainSpeed, maxDensity]);

  const comparePathD = useMemo(() => {
    if (!comparePoints) return '';
    return comparePoints.reduce((acc, pt, i) => {
      const x = scaleX(pt.speed);
      const y = scaleY(pt.probabilityDensity);
      return `${acc} ${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }, '');
  }, [comparePoints, maxDomainSpeed, maxDensity]);

  // Area integration check (proves total area = 1.0)
  const normalizedAreaCheck = useMemo(() => {
    return verifyMaxwellDistributionArea(
      params.temperatureK,
      primarySpecies.molarMassKgPerMol
    );
  }, [params.temperatureK, primarySpecies.molarMassKgPerMol]);

  return (
    <div className="bg-[#102740] rounded-xl border border-[#29445F] p-5 shadow-xl space-y-5 text-[#F1F5F9]">
      {/* Header & Comparison Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#29445F] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F1F5F9] tracking-wide flex items-center gap-2">
              <span>Maxwell–Boltzmann Distribution of Molecular Speeds</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#16334F] text-[#4ADE80] border border-[#29445F]">
                ∫ f(v) dv = {normalizedAreaCheck.toFixed(4)} ≈ 1.000
              </span>
            </h3>
            <p className="text-[11px] text-[#AFC2D8]">
              Probability density function f(v) vs speed v for {primarySpecies.name} at {params.temperatureK} K
            </p>
          </div>
        </div>

        {/* Comparison Mode Selector */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#0B1F36] p-1 rounded-lg border border-[#29445F] text-xs">
          <span className="text-[10px] font-mono text-[#AFC2D8] px-2">Compare:</span>
          <button
            onClick={() => setComparisonMode('none')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              comparisonMode === 'none'
                ? 'bg-[#16334F] text-[#38BDF8] border border-[#38BDF8]'
                : 'text-[#AFC2D8] hover:text-white'
            }`}
          >
            Single Curve
          </button>
          <button
            onClick={() => setComparisonMode('temperature')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              comparisonMode === 'temperature'
                ? 'bg-[#16334F] text-[#FB923C] border border-[#FB923C]'
                : 'text-[#AFC2D8] hover:text-white'
            }`}
          >
            2 Temperatures
          </button>
          <button
            onClick={() => setComparisonMode('gasType')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              comparisonMode === 'gasType'
                ? 'bg-[#16334F] text-[#A78BFA] border border-[#A78BFA]'
                : 'text-[#AFC2D8] hover:text-white'
            }`}
          >
            2 Gases
          </button>
        </div>
      </div>

      {/* Comparison Parameter Sub-Bar */}
      {comparisonMode === 'temperature' && (
        <div className="bg-[#0B1F36] p-3 rounded-lg border border-[#FB923C]/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-[#FB923C] font-semibold flex items-center gap-1.5">
            <span>Comparison Gas Temperature (T₂):</span>
            <span className="font-mono font-bold">{compareTempK} K</span>
          </span>
          <div className="flex items-center gap-3">
            {[200, 450, 600, 850].map((t) => (
              <button
                key={t}
                onClick={() => setCompareTempK(t)}
                className={`px-2.5 py-0.5 rounded font-mono text-[11px] border cursor-pointer ${
                  compareTempK === t
                    ? 'bg-[#FB923C] text-black font-bold border-[#FB923C]'
                    : 'bg-[#16334F] text-[#AFC2D8] border-[#29445F] hover:text-white'
                }`}
              >
                {t} K
              </button>
            ))}
            <input
              type="range"
              min="100"
              max="1000"
              step="25"
              value={compareTempK}
              onChange={(e) => setCompareTempK(parseFloat(e.target.value))}
              className="w-32 accent-[#FB923C] cursor-pointer"
            />
          </div>
        </div>
      )}

      {comparisonMode === 'gasType' && (
        <div className="bg-[#0B1F36] p-3 rounded-lg border border-[#A78BFA]/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-[#A78BFA] font-semibold flex items-center gap-1.5">
            <span>Compare with second gas at {params.temperatureK} K:</span>
            <span className="font-mono font-bold">{compareSpecies.name} ({compareSpecies.molarMassGPerMol} g/mol)</span>
          </span>
          <div className="flex items-center gap-2">
            {(Object.keys(GAS_CATALOG) as GasType[]).map((gt) => (
              <button
                key={gt}
                onClick={() => setCompareGasType(gt)}
                className={`px-2.5 py-0.5 rounded font-mono text-[11px] border cursor-pointer ${
                  compareGasType === gt
                    ? 'bg-[#A78BFA] text-black font-bold border-[#A78BFA]'
                    : 'bg-[#16334F] text-[#AFC2D8] border-[#29445F] hover:text-white'
                }`}
              >
                {GAS_CATALOG[gt].formula}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main SVG Graph */}
      <div className="relative w-full overflow-x-auto bg-[#071426] rounded-xl border border-[#29445F] p-2 flex justify-center">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full max-w-[850px] h-auto block select-none"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const svgX = (mouseX / rect.width) * svgWidth;
            if (svgX >= padding.left && svgX <= padding.left + plotWidth) {
              const speed = ((svgX - padding.left) / plotWidth) * maxDomainSpeed;
              setHoveredSpeed(speed);
            } else {
              setHoveredSpeed(null);
            }
          }}
          onMouseLeave={() => setHoveredSpeed(null)}
        >
          {/* Engineering Grid Lines */}
          {/* Horizontal grid lines */}
          {[0, 0.25, 0.5, 0.75, 1.0].map((frac) => {
            const y = padding.top + plotHeight * (1 - frac);
            const val = (maxDensity * frac * 1000).toFixed(2);
            return (
              <g key={frac}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + plotWidth}
                  y2={y}
                  stroke="#16334F"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  fill="#AFC2D8"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Vertical grid lines (Speed ticks) */}
          {Array.from({ length: 6 }).map((_, idx) => {
            const speed = (idx / 5) * maxDomainSpeed;
            const x = scaleX(speed);
            return (
              <g key={idx}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={padding.top + plotHeight}
                  stroke="#16334F"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={x}
                  y={padding.top + plotHeight + 18}
                  fill="#AFC2D8"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {Math.round(speed)}
                </text>
              </g>
            );
          })}

          {/* Axes */}
          <line
            x1={padding.left}
            y1={padding.top + plotHeight}
            x2={padding.left + plotWidth}
            y2={padding.top + plotHeight}
            stroke="#29445F"
            strokeWidth="2"
          />
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={padding.top + plotHeight}
            stroke="#29445F"
            strokeWidth="2"
          />

          {/* Axis Labels */}
          <text
            x={padding.left + plotWidth / 2}
            y={svgHeight - 12}
            fill="#F1F5F9"
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
          >
            Molecular Speed, v (m/s)
          </text>
          <text
            x={-svgHeight / 2}
            y={18}
            transform="rotate(-90)"
            fill="#F1F5F9"
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
          >
            Probability Density, f(v) [×10⁻³ s/m]
          </text>

          {/* Primary Distribution Filled Area & Curve */}
          <path
            d={primaryAreaD}
            fill={primarySpecies.particleColor}
            fillOpacity="0.12"
          />
          <path
            d={primaryPathD}
            fill="none"
            stroke={primarySpecies.particleColor}
            strokeWidth="2.5"
          />

          {/* Comparison Curve if active */}
          {comparisonMode !== 'none' && comparePoints && (
            <path
              d={comparePathD}
              fill="none"
              stroke={comparisonMode === 'temperature' ? '#FB923C' : compareSpecies.particleColor}
              strokeWidth="2.5"
              strokeDasharray="4 2"
            />
          )}

          {/* Primary Speed Markers: v_mp, v_mean, v_rms */}
          {/* 1. v_mp (Most Probable) */}
          <line
            x1={scaleX(results.vMostProbable)}
            y1={padding.top}
            x2={scaleX(results.vMostProbable)}
            y2={padding.top + plotHeight}
            stroke="#FBBF24"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <circle
            cx={scaleX(results.vMostProbable)}
            cy={scaleY(maxwellBoltzmannPDF(results.vMostProbable, params.temperatureK, primarySpecies.molarMassKgPerMol))}
            r="4"
            fill="#FBBF24"
          />

          {/* 2. v_mean */}
          <line
            x1={scaleX(results.vMean)}
            y1={padding.top}
            x2={scaleX(results.vMean)}
            y2={padding.top + plotHeight}
            stroke="#4ADE80"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* 3. v_rms */}
          <line
            x1={scaleX(results.vRms)}
            y1={padding.top}
            x2={scaleX(results.vRms)}
            y2={padding.top + plotHeight}
            stroke="#38BDF8"
            strokeWidth="2"
          />
          <circle
            cx={scaleX(results.vRms)}
            cy={scaleY(maxwellBoltzmannPDF(results.vRms, params.temperatureK, primarySpecies.molarMassKgPerMol))}
            r="4"
            fill="#38BDF8"
          />

          {/* Interactive Mouse Hover Marker */}
          {hoveredSpeed !== null && (
            <g>
              <line
                x1={scaleX(hoveredSpeed)}
                y1={padding.top}
                x2={scaleX(hoveredSpeed)}
                y2={padding.top + plotHeight}
                stroke="#F1F5F9"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <circle
                cx={scaleX(hoveredSpeed)}
                cy={scaleY(maxwellBoltzmannPDF(hoveredSpeed, params.temperatureK, primarySpecies.molarMassKgPerMol))}
                r="4.5"
                fill="#F1F5F9"
              />
            </g>
          )}
        </svg>

        {/* Hovered Speed Tooltip */}
        {hoveredSpeed !== null && (
          <div className="absolute top-4 right-4 bg-[#0B1F36]/95 border border-[#38BDF8] p-2 rounded-lg text-xs font-mono shadow-xl pointer-events-none">
            <div className="text-white font-bold">
              v = {Math.round(hoveredSpeed)} m/s
            </div>
            <div className="text-[#38BDF8]">
              f(v) = {maxwellBoltzmannPDF(hoveredSpeed, params.temperatureK, primarySpecies.molarMassKgPerMol).toExponential(3)} s/m
            </div>
          </div>
        )}
      </div>

      {/* Speed Metrics Reference Cards (v_mp, v_mean, v_rms) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Most Probable Speed */}
        <div className="p-3 rounded-lg bg-[#0B1F36] border border-[#29445F] space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#FBBF24]">Most Probable Speed (v_mp)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {Math.round(results.vMostProbable)} <span className="text-xs text-[#AFC2D8]">m/s</span>
          </div>
          <div className="text-[10px] text-[#AFC2D8] font-mono">
            v_mp = √(2RT/M) • Peak of f(v)
          </div>
        </div>

        {/* Mean Speed */}
        <div className="p-3 rounded-lg bg-[#0B1F36] border border-[#29445F] space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#4ADE80]">Mean Speed (v_mean)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80]" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {Math.round(results.vMean)} <span className="text-xs text-[#AFC2D8]">m/s</span>
          </div>
          <div className="text-[10px] text-[#AFC2D8] font-mono">
            v_mean = √(8RT/πM) ≈ 1.128 v_mp
          </div>
        </div>

        {/* Root-Mean-Square Speed */}
        <div className="p-3 rounded-lg bg-[#0B1F36] border border-[#38BDF8]/60 space-y-1 bg-[#38BDF8]/5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#38BDF8]">RMS Speed (v_rms) ★</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {Math.round(results.vRms)} <span className="text-xs text-[#AFC2D8]">m/s</span>
          </div>
          <div className="text-[10px] text-[#AFC2D8] font-mono">
            v_rms = √(3RT/M) ≈ 1.225 v_mp
          </div>
        </div>
      </div>

      {/* Physics Takeaway Banner */}
      <div className="p-3 rounded-lg bg-[#071426] border border-[#29445F] flex items-start gap-2.5 text-xs text-[#AFC2D8]">
        <Info className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p>
            <strong className="text-white">Distribution Hierarchy:</strong> For any Maxwellian gas, the three speeds strictly obey{' '}
            <span className="font-mono text-[#F1F5F9]">v_mp &lt; v_mean &lt; v_rms</span> (ratio{' '}
            <span className="font-mono text-[#38BDF8]">1.000 : 1.128 : 1.225</span>).
          </p>
          <p>
            As temperature rises, the curve flattens and broadens toward higher speeds while keeping the total integrated area equal to 1.
            Lighter gases (e.g. Helium, 4 g/mol) exhibit much broader curves and higher velocities than heavy gases (e.g. Argon, 40 g/mol) at identical temperatures.
          </p>
        </div>
      </div>
    </div>
  );
};
