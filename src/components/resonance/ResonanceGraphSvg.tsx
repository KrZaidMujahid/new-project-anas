import React, { useMemo, useRef, useState, useCallback } from 'react';
import { ResonanceParameters } from '../../physics/resonance/types';

interface ResonanceGraphSvgProps {
  params: ResonanceParameters;
  onSelectFrequency?: (frequencyHz: number) => void;
}

export const ResonanceGraphSvg: React.FC<ResonanceGraphSvgProps> = ({
  params,
  onSelectFrequency,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverFreq, setHoverFreq] = useState<number | null>(null);

  const { mass: m, springConstant: k, dampingCoefficient: c, drivingForceAmplitude: F0, drivingFrequencyHz: currentFd } = params;

  // Key frequencies
  const omega0 = Math.sqrt(Math.max(0.001, k / Math.max(0.001, m)));
  const f0 = omega0 / (2 * Math.PI);

  const term = (c * c) / (2 * m * m);
  const peakRadicand = omega0 * omega0 - term;
  const fPeak = peakRadicand > 0 ? Math.sqrt(peakRadicand) / (2 * Math.PI) : null;
  const targetPeak = fPeak !== null ? fPeak : f0;

  // Viewport geometry (760 x 360)
  const viewWidth = 760;
  const viewHeight = 360;
  const plotLeft = 75;
  const plotRight = 725;
  const plotTop = 45;
  const plotBottom = 305;
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;

  const minF = 0.0;
  const maxF = 10.0;

  const computeAmp = useCallback(
    (f: number) => {
      if (f <= 0) return F0 / k;
      const omega = 2 * Math.PI * f;
      const t1 = k - m * omega * omega;
      const t2 = c * omega;
      const denomSq = t1 * t1 + t2 * t2;
      if (denomSq < 1e-9) return 50.0;
      return F0 / Math.sqrt(denomSq);
    },
    [m, k, c, F0]
  );

  const { points, maxPlotAmp, yTicks } = useMemo(() => {
    const rawPoints: { f: number; amp: number }[] = [];
    let highest = 0;

    const numSamples = 250;
    const step = (maxF - minF) / numSamples;

    for (let i = 0; i <= numSamples; i++) {
      const f = minF + i * step;
      const a = computeAmp(f);
      if (!isNaN(a) && isFinite(a)) {
        rawPoints.push({ f, amp: a });
        if (a > highest) highest = a;
      }
    }

    const currentA = computeAmp(currentFd);
    if (currentA > highest) highest = currentA;

    let ceiling = highest * 1.15;
    if (c === 0 && ceiling > 15.0) {
      ceiling = 15.0;
    }
    if (ceiling < 0.05) ceiling = 0.05;

    const rawTickStep = ceiling / 5;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawTickStep)));
    const normalized = rawTickStep / magnitude;
    let niceStep = magnitude;
    if (normalized <= 1.5) niceStep = 1 * magnitude;
    else if (normalized <= 3.5) niceStep = 2 * magnitude;
    else if (normalized <= 7.5) niceStep = 5 * magnitude;
    else niceStep = 10 * magnitude;

    const actualCeiling = niceStep * 5;
    const ticks: number[] = [];
    for (let i = 0; i <= 5; i++) {
      ticks.push(Number((i * niceStep).toFixed(4)));
    }

    return {
      points: rawPoints,
      maxPlotAmp: actualCeiling,
      yTicks: ticks,
    };
  }, [computeAmp, currentFd, c]);

  const getX = useCallback(
    (f: number) => {
      const clamped = Math.max(minF, Math.min(maxF, f));
      return plotLeft + ((clamped - minF) / (maxF - minF)) * plotWidth;
    },
    [plotLeft, plotWidth]
  );

  const getY = useCallback(
    (amp: number) => {
      const clamped = Math.max(0, Math.min(maxPlotAmp, amp));
      return plotBottom - (clamped / maxPlotAmp) * plotHeight;
    },
    [plotBottom, plotHeight, maxPlotAmp]
  );

  const { pathD, areaD } = useMemo(() => {
    if (points.length === 0) return { pathD: '', areaD: '' };

    let d = '';
    let area = `M ${getX(points[0].f)} ${plotBottom}`;

    for (let i = 0; i < points.length; i++) {
      const pt = points[i];
      const px = getX(pt.f);
      const py = getY(pt.amp);
      if (i === 0) {
        d += `M ${px} ${py}`;
      } else {
        d += ` L ${px} ${py}`;
      }
      area += ` L ${px} ${py}`;
    }

    area += ` L ${getX(points[points.length - 1].f)} ${plotBottom} Z`;

    return { pathD: d, areaD: area };
  }, [points, getX, getY, plotBottom]);

  const bandwidthHalf = Math.max(0.25, f0 * 0.12);
  const peakLeftF = Math.max(0.1, targetPeak - bandwidthHalf);
  const peakRightF = Math.min(9.9, targetPeak + bandwidthHalf);
  const peakX1 = getX(peakLeftF);
  const peakX2 = getX(peakRightF);
  const peakWidth = Math.max(10, peakX2 - peakX1);

  const currentAmp = computeAmp(currentFd);
  const currentMarkerX = getX(currentFd);
  const currentMarkerY = getY(currentAmp);

  const handleSvgInteraction = (clientX: number) => {
    if (!svgRef.current || !onSelectFrequency) return;
    const rect = svgRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const scale = viewWidth / rect.width;
    const svgX = relativeX * scale;

    const clampedSvgX = Math.max(plotLeft, Math.min(plotRight, svgX));
    const newF = minF + ((clampedSvgX - plotLeft) / plotWidth) * (maxF - minF);
    onSelectFrequency(Math.round(newF * 100) / 100);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    handleSvgInteraction(e.clientX);
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.buttons === 1) {
      handleSvgInteraction(e.clientX);
    }
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const scale = viewWidth / rect.width;
    const svgX = relativeX * scale;
    if (svgX >= plotLeft && svgX <= plotRight) {
      const f = minF + ((svgX - plotLeft) / plotWidth) * (maxF - minF);
      setHoverFreq(Math.round(f * 100) / 100);
    } else {
      setHoverFreq(null);
    }
  };

  const xTicks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl flex flex-col gap-3">
      {/* Graph Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#26364D]">
        <div>
          <h3 className="text-base font-extrabold text-[#F1F5F9] tracking-tight">
            Amplitude vs Driving Frequency
          </h3>
          <p className="text-xs text-[#94A3B8]">
            Steady-state amplitude response curve A(f) showing frequency resonance behavior
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-[#38BDF8] rounded-full inline-block" />
            <span className="text-[#F1F5F9] font-medium">A(f) Response</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-[#FB7185] border-t-2 border-dashed border-[#FB7185] inline-block" />
            <span className="text-[#F1F5F9] font-medium">Current f = {currentFd.toFixed(2)} Hz</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-[#FB7185]/20 border border-[#FB7185]/50 rounded inline-block" />
            <span className="text-[#F1F5F9] font-medium">Resonance Peak</span>
          </div>
        </div>
      </div>

      {/* SVG Plot Canvas on #0A1526 */}
      <div className="w-full relative overflow-hidden rounded-xl bg-[#0A1526] border border-[#26364D] cursor-crosshair">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          className="w-full h-auto block select-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setHoverFreq(null);
          }}
        >
          <rect x="0" y="0" width={viewWidth} height={viewHeight} fill="#0A1526" />

          {/* Highlighted region near the resonance peak */}
          <rect
            x={peakX1}
            y={plotTop}
            width={peakWidth}
            height={plotHeight}
            fill="#FB7185"
            fillOpacity="0.12"
            stroke="#FB7185"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            rx="3"
          />

          {/* Resonance Peak Region Badge */}
          <rect
            x={peakX1 + peakWidth / 2 - 65}
            y={plotTop + 8}
            width="130"
            height="18"
            rx="4"
            fill="#101D30"
            stroke="#FB7185"
            strokeWidth="1"
          />
          <text
            x={peakX1 + peakWidth / 2}
            y={plotTop + 21}
            textAnchor="middle"
            fill="#FB7185"
            fontSize="10"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            Resonance Peak Region
          </text>

          {/* Horizontal Grid lines & Amplitude Ticks */}
          {yTicks.map((val) => {
            const y = getY(val);
            return (
              <g key={`y-${val}`}>
                <line
                  x1={plotLeft}
                  y1={y}
                  x2={plotRight}
                  y2={y}
                  stroke="#17263B"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={plotLeft - 10}
                  y={y + 3.5}
                  textAnchor="end"
                  fill="#94A3B8"
                  fontSize="11"
                  fontFamily="ui-monospace, monospace"
                  fontWeight="500"
                >
                  {val.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Vertical Grid lines & Frequency Ticks */}
          {xTicks.map((f) => {
            const x = getX(f);
            return (
              <g key={`x-${f}`}>
                <line
                  x1={x}
                  y1={plotTop}
                  x2={x}
                  y2={plotBottom}
                  stroke="#17263B"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <line
                  x1={x}
                  y1={plotBottom}
                  x2={x}
                  y2={plotBottom + 5}
                  stroke="#26364D"
                  strokeWidth="1.5"
                />
                <text
                  x={x}
                  y={plotBottom + 18}
                  textAnchor="middle"
                  fill="#94A3B8"
                  fontSize="11"
                  fontFamily="ui-monospace, monospace"
                  fontWeight="500"
                >
                  {f}
                </text>
              </g>
            );
          })}

          {/* Main Coordinate Axes */}
          <line x1={plotLeft} y1={plotBottom} x2={plotRight} y2={plotBottom} stroke="#26364D" strokeWidth="2" />
          <line x1={plotLeft} y1={plotTop} x2={plotLeft} y2={plotBottom} stroke="#26364D" strokeWidth="2" />

          {/* Axis Labels */}
          <text
            x={plotLeft + plotWidth / 2}
            y={plotBottom + 38}
            textAnchor="middle"
            fill="#F1F5F9"
            fontSize="12"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            Driving Frequency f (Hz)
          </text>

          <text
            x={-(plotTop + plotHeight / 2)}
            y="22"
            textAnchor="middle"
            transform="rotate(-90)"
            fill="#F1F5F9"
            fontSize="12"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            Steady-State Amplitude A (m)
          </text>

          {/* Area Fill */}
          {areaD && <path d={areaD} fill="#38BDF8" fillOpacity="0.12" />}

          {/* Resonance Curve Path */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="#38BDF8"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Natural Frequency Reference */}
          {f0 <= maxF && (
            <g>
              <line
                x1={getX(f0)}
                y1={plotTop}
                x2={getX(f0)}
                y2={plotBottom}
                stroke="#34D399"
                strokeWidth="1.5"
                strokeDasharray="2 3"
              />
              <text
                x={getX(f0)}
                y={plotTop - 6}
                textAnchor="middle"
                fill="#34D399"
                fontSize="10"
                fontWeight="700"
                fontFamily="system-ui, sans-serif"
              >
                f₀ = {f0.toFixed(2)} Hz
              </text>
            </g>
          )}

          {/* Red Vertical Marker for Current Driving Frequency */}
          <g>
            <line
              x1={currentMarkerX}
              y1={plotTop}
              x2={currentMarkerX}
              y2={plotBottom}
              stroke="#FB7185"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <circle
              cx={currentMarkerX}
              cy={currentMarkerY}
              r="6"
              fill="#FB7185"
              stroke="#07111F"
              strokeWidth="2.5"
            />
            <circle
              cx={currentMarkerX}
              cy={currentMarkerY}
              r="10"
              fill="none"
              stroke="#FB7185"
              strokeWidth="1.5"
              strokeOpacity="0.4"
            />

            <g transform={`translate(${Math.max(plotLeft + 55, Math.min(plotRight - 55, currentMarkerX))}, ${Math.max(plotTop + 24, currentMarkerY - 18)})`}>
              <rect
                x="-55"
                y="-18"
                width="110"
                height="20"
                rx="4"
                fill="#101D30"
                stroke="#FB7185"
                strokeWidth="1"
              />
              <text
                x="0"
                y="-5"
                textAnchor="middle"
                fill="#FB7185"
                fontSize="10.5"
                fontWeight="700"
                fontFamily="ui-monospace, monospace"
              >
                f = {currentFd.toFixed(2)} Hz | A = {currentAmp.toFixed(3)} m
              </text>
            </g>
          </g>

          <text
            x={plotRight}
            y={plotTop - 8}
            textAnchor="end"
            fill="#94A3B8"
            fontSize="10"
            fontStyle="italic"
          >
            Click or drag on graph to set driving frequency
          </text>
        </svg>
      </div>

      {c === 0 && (
        <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#FBBF24] rounded-lg p-2.5 text-xs flex items-center justify-between">
          <span>
            <strong>Undamped System Notice (c = 0):</strong> In pure undamped resonance, the theoretical steady-state amplitude becomes unbounded (A → ∞) at f = f₀. A visual display cap is applied for plotting stability.
          </span>
        </div>
      )}
    </div>
  );
};
