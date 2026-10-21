import React from 'react';
import { Waves, ArrowLeftRight, CheckCircle2, Info } from 'lucide-react';
import { DopplerDerivedValues } from '../../physics/doppler/types';

interface DopplerWavelengthPanelProps {
  speedOfSound: number;
  sourceFrequency: number;
  sourceVelocity: number;
  derived: DopplerDerivedValues;
}

export const DopplerWavelengthPanel: React.FC<DopplerWavelengthPanelProps> = ({
  speedOfSound,
  sourceFrequency,
  sourceVelocity,
  derived,
}) => {
  const { wavelengthFront, wavelengthBehind, stationaryWavelength } = derived;

  // Visual scaling: map wavelength in meters (typically 0.3m to 3.5m) to visual pixel spacing (25px to 140px)
  const pxPerMeter = 60;
  const frontSpacingPx = Math.max(16, Math.min(130, wavelengthFront * pxPerMeter));
  const behindSpacingPx = Math.max(16, Math.min(130, wavelengthBehind * pxPerMeter));
  const normalSpacingPx = Math.max(16, Math.min(130, stationaryWavelength * pxPerMeter));

  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl flex flex-col gap-4">
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-[#26364D]">
        <div className="flex items-center gap-2">
          <Waves className="w-4 h-4 text-[#38BDF8]" />
          <h3 className="text-sm font-bold text-[#F1F5F9] uppercase tracking-wide">
            Wavelength Compression &amp; Expansion
          </h3>
        </div>

        <span className="text-xs font-mono text-[#94A3B8]">
          v_wave = const = {speedOfSound} m/s
        </span>
      </div>

      {/* SVG Spatial Comparison Diagram */}
      <div className="bg-[#0A1526] border border-[#26364D] rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#38BDF8]">◀ IN FRONT OF SOURCE</span>
          <span className="font-bold text-[#FBBF24]">SOURCE</span>
          <span className="font-bold text-[#FB7185]">BEHIND SOURCE ▶</span>
        </div>

        {/* SVG Wavefront Spacing Diagram */}
        <div className="w-full overflow-hidden">
          <svg viewBox="0 0 760 110" className="w-full h-auto block select-none">
            {/* Center Axis */}
            <line x1="20" y1="55" x2="740" y2="55" stroke="#1E334D" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Source Center Position at x = 380 */}
            <rect x="368" y="35" width="24" height="40" rx="4" fill="#F97316" stroke="#FBBF24" strokeWidth="2" />
            <circle cx="380" cy="55" r="4" fill="#07111F" />

            {/* Front Wavefront Lines (to the left, toward observer) */}
            {[1, 2, 3, 4, 5, 6].map((i) => {
              const xPos = 380 - i * frontSpacingPx;
              if (xPos < 30) return null;
              return (
                <g key={`front-${i}`}>
                  <line
                    x1={xPos}
                    y1="20"
                    x2={xPos}
                    y2="90"
                    stroke="#38BDF8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeOpacity={Math.max(0.3, 1 - (i * 0.12))}
                  />
                  {/* Wave index */}
                  <text x={xPos} y="15" textAnchor="middle" fill="#38BDF8" fontSize="9" fontFamily="ui-monospace, monospace">
                    +{i}
                  </text>
                </g>
              );
            })}

            {/* Behind Wavefront Lines (to the right, away from observer) */}
            {[1, 2, 3, 4, 5].map((i) => {
              const xPos = 380 + i * behindSpacingPx;
              if (xPos > 730) return null;
              return (
                <g key={`behind-${i}`}>
                  <line
                    x1={xPos}
                    y1="20"
                    x2={xPos}
                    y2="90"
                    stroke="#FB7185"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeOpacity={Math.max(0.3, 1 - (i * 0.15))}
                  />
                  <text x={xPos} y="15" textAnchor="middle" fill="#FB7185" fontSize="9" fontFamily="ui-monospace, monospace">
                    -{i}
                  </text>
                </g>
              );
            })}

            {/* Front Wavelength Dimension Arrow */}
            {380 - frontSpacingPx >= 30 && (
              <g>
                <line
                  x1={380 - frontSpacingPx}
                  y1="75"
                  x2={380}
                  y2="75"
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                />
                <circle cx={380 - frontSpacingPx} cy="75" r="2.5" fill="#38BDF8" />
                <circle cx={380} cy="75" r="2.5" fill="#38BDF8" />
                <text
                  x={380 - frontSpacingPx / 2}
                  y="100"
                  textAnchor="middle"
                  fill="#38BDF8"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="ui-monospace, monospace"
                >
                  λ_front = {wavelengthFront.toFixed(3)} m
                </text>
              </g>
            )}

            {/* Behind Wavelength Dimension Arrow */}
            {380 + behindSpacingPx <= 730 && (
              <g>
                <line
                  x1={380}
                  y1="75"
                  x2={380 + behindSpacingPx}
                  y2="75"
                  stroke="#FB7185"
                  strokeWidth="1.5"
                />
                <circle cx={380} cy="75" r="2.5" fill="#FB7185" />
                <circle cx={380 + behindSpacingPx} cy="75" r="2.5" fill="#FB7185" />
                <text
                  x={380 + behindSpacingPx / 2}
                  y="100"
                  textAnchor="middle"
                  fill="#FB7185"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="ui-monospace, monospace"
                >
                  λ_behind = {wavelengthBehind.toFixed(3)} m
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#17263B] border border-[#26364D] rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#94A3B8]">Wavelength In Front (λ_front)</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-mono font-bold text-[#38BDF8]">
              {wavelengthFront.toFixed(3)}
            </span>
            <span className="text-xs font-mono text-[#94A3B8]">m</span>
          </div>
          <span className="text-[10px] text-[#94A3B8] mt-0.5">(v - vs) / fs</span>
        </div>

        <div className="bg-[#17263B] border border-[#26364D] rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#94A3B8]">Stationary Wavelength (λ₀)</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-mono font-bold text-[#F1F5F9]">
              {stationaryWavelength.toFixed(3)}
            </span>
            <span className="text-xs font-mono text-[#94A3B8]">m</span>
          </div>
          <span className="text-[10px] text-[#94A3B8] mt-0.5">v / fs at rest</span>
        </div>

        <div className="bg-[#17263B] border border-[#26364D] rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#94A3B8]">Wavelength Behind (λ_behind)</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-mono font-bold text-[#FB7185]">
              {wavelengthBehind.toFixed(3)}
            </span>
            <span className="text-xs font-mono text-[#94A3B8]">m</span>
          </div>
          <span className="text-[10px] text-[#94A3B8] mt-0.5">(v + vs) / fs</span>
        </div>
      </div>

      {/* Educational Constant Wave Speed Principle */}
      <div className="bg-[#17263B] border border-[#26364D] rounded-lg p-3 text-xs text-[#94A3B8] flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-[#F1F5F9]">Fundamental Acoustic Principle:</strong>
          <p className="leading-relaxed">
            The speed of sound in the stationary air medium remains strictly invariant (<code className="font-mono text-[#38BDF8]">v = 343 m/s</code>) regardless of how fast the source travels. The source’s forward motion physically compresses the distance between successive emitted crests, so smaller wavelength <code className="font-mono text-[#38BDF8]">λ_front</code> necessarily demands higher arrival frequency <code className="font-mono text-[#38BDF8]">f = v / λ</code>.
          </p>
        </div>
      </div>
    </div>
  );
};
