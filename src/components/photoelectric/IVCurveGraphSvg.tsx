/**
 * EQUATION 1 — Graph 2: Photocurrent vs. Applied Voltage (I-V) Characteristic Graph (SVG)
 * Plots experimental I-V curve, highlighting saturation current, stopping potential -V_stop,
 * and current operating bias point with interactive click-to-bias.
 */

import React, { useMemo, useCallback } from 'react';
import { Activity } from 'lucide-react';
import { PhotoelectricParameters, PhotoelectricCalculations } from '../../physics/photoelectric/types';

interface IVCurveGraphSvgProps {
  params: PhotoelectricParameters;
  calc: PhotoelectricCalculations;
  onSetVoltage: (voltage: number) => void;
}

export const IVCurveGraphSvg: React.FC<IVCurveGraphSvgProps> = ({
  params,
  calc,
  onSetVoltage,
}) => {
  const width = 640;
  const height = 270;
  const padL = 60;
  const padR = 40;
  const padT = 30;
  const padB = 45;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  // Voltage range: -5 V to +5 V (or dynamic if stopping potential is larger)
  const minV = Math.min(-5.0, -Math.ceil(calc.stoppingPotentialVolts) - 1.0);
  const maxV = Math.max(5.0, Math.ceil(calc.stoppingPotentialVolts) + 1.0);
  const vRange = maxV - minV;

  // Zero-voltage x position
  const zeroVx = padL + ((0 - minV) / vRange) * plotW;

  // Max current scale: at least 12 µA for consistent grid
  const maxIScale = 12.0; // µA
  const zeroVy = height - padB;

  // Generate curve path
  const { curvePath, stoppingX, currentPoint } = useMemo(() => {
    if (!calc.isEmissionPossible || params.intensityPercent === 0) {
      // Flat line at zero
      return {
        curvePath: `M ${padL} ${zeroVy} L ${width - padR} ${zeroVy}`,
        stoppingX: null,
        currentPoint: {
          x: padL + ((params.appliedVoltage - minV) / vRange) * plotW,
          y: zeroVy,
        },
      };
    }

    const steps = 150;
    let d = '';
    const vStop = calc.stoppingPotentialVolts;
    const iSat = calc.saturationCurrentMicroAmps;
    const iZeroBias = iSat * 0.6;

    for (let s = 0; s <= steps; s++) {
      const vVal = minV + (s / steps) * vRange;
      let iVal = 0;

      if (vVal <= -vStop) {
        iVal = 0;
      } else if (vVal < 0) {
        const remaining = (vVal + vStop) / Math.max(0.01, vStop);
        iVal = iZeroBias * Math.pow(Math.max(0, remaining), 1.6);
      } else {
        const approach = 1 - Math.exp(-vVal / 1.8);
        iVal = iZeroBias + (iSat - iZeroBias) * approach;
      }

      const x = padL + ((vVal - minV) / vRange) * plotW;
      const y = height - padB - (iVal / maxIScale) * plotH;

      if (s === 0) d += `M ${x.toFixed(1)} ${y.toFixed(1)}`;
      else d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }

    const stopX = padL + ((-vStop - minV) / vRange) * plotW;
    const curX = padL + ((params.appliedVoltage - minV) / vRange) * plotW;
    const curY = height - padB - (calc.photocurrentMicroAmps / maxIScale) * plotH;

    return { curvePath: d, stoppingX: stopX, currentPoint: { x: curX, y: curY } };
  }, [
    calc.isEmissionPossible,
    calc.stoppingPotentialVolts,
    calc.saturationCurrentMicroAmps,
    calc.photocurrentMicroAmps,
    params.intensityPercent,
    params.appliedVoltage,
    minV,
    vRange,
    plotW,
    plotH,
    padL,
    padB,
    zeroVy,
    width,
  ]);

  // Click on graph to set voltage
  const handleGraphClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const scaleX = width / rect.width;
      const svgX = clickX * scaleX;

      if (svgX >= padL && svgX <= width - padR) {
        const frac = (svgX - padL) / plotW;
        const targetV = minV + frac * vRange;
        onSetVoltage(parseFloat(targetV.toFixed(2)));
      }
    },
    [width, padL, padR, plotW, minV, vRange, onSetVoltage]
  );

  return (
    <div className="bg-[#10243D] rounded-xl border border-[#29415F] p-4 sm:p-5 shadow-2xl space-y-4">
      {/* Title & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#29415F] pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#34D399]" />
          <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#EAF2FF]">
              Graph 2: Photocurrent vs. Applied Voltage (I-V Curve)
            </h3>
            <div className="text-[11px] text-[#9FB3CC]">
              Saturation: <span className="font-mono text-[#34D399]">{calc.saturationCurrentMicroAmps.toFixed(2)} µA</span> &middot; Stopping Potential: <span className="font-mono text-[#FB7185]">-{calc.stoppingPotentialVolts.toFixed(2)} V</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-[#9FB3CC]">Operating Point:</span>
          <span className="px-2 py-0.5 rounded bg-[#142B47] border border-[#29415F] text-[#34D399] font-bold">
            ({params.appliedVoltage >= 0 ? `+${params.appliedVoltage.toFixed(2)}` : params.appliedVoltage.toFixed(2)} V, {calc.photocurrentMicroAmps.toFixed(2)} µA)
          </span>
        </div>
      </div>

      {/* SVG I-V Graph */}
      <div className="w-full relative rounded-xl overflow-hidden border border-[#29415F] bg-[#071426] shadow-inner">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto block select-none cursor-crosshair"
          onClick={handleGraphClick}
          style={{ minHeight: '230px' }}
        >
          {/* Grid lines */}
          <g opacity="0.35">
            <line x1={padL} y1={padT} x2={width - padR} y2={padT} stroke="#29415F" strokeWidth="1" strokeDasharray="3 3" />
            <line x1={padL} y1={padT + plotH / 2} x2={width - padR} y2={padT + plotH / 2} stroke="#29415F" strokeWidth="1" strokeDasharray="2 2" />
            <line x1={padL} y1={height - padB} x2={width - padR} y2={height - padB} stroke="#9FB3CC" strokeWidth="1.2" />

            {/* Voltage zero axis */}
            <line x1={zeroVx} y1={padT} x2={zeroVx} y2={height - padB} stroke="#9FB3CC" strokeWidth="1.2" strokeDasharray="2 2" />

            {/* Ticks along voltage */}
            {[-6, -4, -2, 0, 2, 4, 6].map((vTick) => {
              if (vTick < minV || vTick > maxV) return null;
              const xPos = padL + ((vTick - minV) / vRange) * plotW;
              return (
                <g key={vTick}>
                  <line x1={xPos} y1={padT} x2={xPos} y2={height - padB} stroke="#29415F" strokeWidth="1" strokeDasharray="2 2" />
                  <text x={xPos} y={height - padB + 14} fill="#9FB3CC" fontSize="9" fontFamily="ui-monospace, monospace" textAnchor="middle">
                    {vTick > 0 ? `+${vTick}V` : `${vTick}V`}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Current Axis Labels */}
          <text x={padL - 10} y={padT + 4} fill="#34D399" fontSize="9" fontWeight="bold" fontFamily="ui-monospace, monospace" textAnchor="end">
            12 µA
          </text>
          <text x={padL - 10} y={padT + plotH / 2 + 4} fill="#9FB3CC" fontSize="9" fontFamily="ui-monospace, monospace" textAnchor="end">
            6 µA
          </text>
          <text x={padL - 10} y={height - padB + 3} fill="#9FB3CC" fontSize="9" fontFamily="ui-monospace, monospace" textAnchor="end">
            0 µA
          </text>

          {/* Saturation current horizontal dashed line */}
          {calc.isEmissionPossible && calc.saturationCurrentMicroAmps > 0 && (
            <g>
              <line
                x1={zeroVx}
                y1={height - padB - (calc.saturationCurrentMicroAmps / maxIScale) * plotH}
                x2={width - padR}
                y2={height - padB - (calc.saturationCurrentMicroAmps / maxIScale) * plotH}
                stroke="#34D399"
                strokeWidth="1.2"
                strokeDasharray="4 3"
                opacity="0.65"
              />
              <text
                x={width - padR - 5}
                y={height - padB - (calc.saturationCurrentMicroAmps / maxIScale) * plotH - 6}
                fill="#34D399"
                fontSize="9"
                fontFamily="ui-monospace, monospace"
                textAnchor="end"
              >
                I_sat = {calc.saturationCurrentMicroAmps.toFixed(1)} µA
              </text>
            </g>
          )}

          {/* Stopping Potential Marker on Negative Axis */}
          {stoppingX !== null && (
            <g>
              <line
                x1={stoppingX}
                y1={padT + 25}
                x2={stoppingX}
                y2={height - padB}
                stroke="#FB7185"
                strokeWidth="1.8"
                strokeDasharray="3 2"
              />
              <circle cx={stoppingX} cy={height - padB} r="4" fill="#FB7185" />
              <text
                x={stoppingX}
                y={padT + 18}
                fill="#FB7185"
                fontSize="10"
                fontWeight="bold"
                fontFamily="ui-monospace, monospace"
                textAnchor="middle"
              >
                -V_stop (-{calc.stoppingPotentialVolts.toFixed(2)} V)
              </text>
            </g>
          )}

          {/* I-V Curve Path */}
          <path
            d={curvePath}
            fill="none"
            stroke="#34D399"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Current Operating Point Dot */}
          <circle
            cx={currentPoint.x}
            cy={currentPoint.y}
            r="6"
            fill="#FBBF24"
            stroke="#071426"
            strokeWidth="2"
          />

          {/* Axis Labels */}
          <text
            x={width / 2}
            y={height - 8}
            fill="#9FB3CC"
            fontSize="10"
            fontFamily="ui-monospace, monospace"
            textAnchor="middle"
          >
            Applied Voltage V (Volts) &middot; Click to select bias voltage
          </text>
          <text
            x={16}
            y={padT - 10}
            fill="#34D399"
            fontSize="10"
            fontWeight="bold"
            fontFamily="ui-monospace, monospace"
          >
            Photocurrent I (µA)
          </text>
        </svg>
      </div>

      {/* Physics Takeaway */}
      <div className="bg-[#142B47] p-3 rounded-lg border border-[#29415F] text-xs text-[#9FB3CC] leading-relaxed">
        <strong className="text-[#EAF2FF]">Crucial I-V Characteristics:</strong> As retarding voltage becomes more negative, fewer electrons possess enough initial kinetic energy to reach the collector. At <span className="font-mono text-[#FB7185]">V = -V_stop</span>, current drops to zero. Importantly, changing light intensity changes the saturation plateau height, but leaves the stopping potential intercept completely unchanged!
      </div>
    </div>
  );
};
