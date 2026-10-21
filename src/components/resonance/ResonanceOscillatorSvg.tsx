import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Activity } from 'lucide-react';
import { ResonanceParameters } from '../../physics/resonance/types';

interface ResonanceOscillatorSvgProps {
  params: ResonanceParameters;
  onTimeUpdate?: (time: number, disp: number, vel: number) => void;
}

export const ResonanceOscillatorSvg: React.FC<ResonanceOscillatorSvgProps> = ({
  params,
  onTimeUpdate,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [time, setTime] = useState(0);
  const [displacement, setDisplacement] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [acceleration, setAcceleration] = useState(0);

  // References for the animation loop
  const animFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const stateRef = useRef({
    time: 0,
    x: 0,
    v: 0,
    isPlaying: true,
  });

  useEffect(() => {
    stateRef.current.isPlaying = isPlaying;
  }, [isPlaying]);

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleReset = () => {
    stateRef.current.time = 0;
    stateRef.current.x = 0;
    stateRef.current.v = 0;
    setTime(0);
    setDisplacement(0);
    setVelocity(0);
    setAcceleration(0);
    if (onTimeUpdate) {
      onTimeUpdate(0, 0, 0);
    }
  };

  const computePhysics = useCallback(
    (t: number) => {
      const { mass: m, springConstant: k, dampingCoefficient: c, drivingFrequencyHz: f, drivingForceAmplitude: F0 } = params;
      const omega = 2 * Math.PI * f;
      const denomSq = Math.pow(k - m * omega * omega, 2) + Math.pow(c * omega, 2);
      const amp = denomSq < 1e-9 ? 50.0 : F0 / Math.sqrt(denomSq);
      const phi = Math.atan2(c * omega, k - m * omega * omega);

      const x = amp * Math.sin(omega * t - phi);
      const v = amp * omega * Math.cos(omega * t - phi);
      const a = -amp * omega * omega * Math.sin(omega * t - phi);
      const Fdrive = F0 * Math.sin(omega * t);

      return { x, v, a, amp, phi, Fdrive };
    },
    [params]
  );

  useEffect(() => {
    const loop = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }
      const deltaSec = Math.min((timestamp - lastTimestampRef.current) / 1000, 0.1);
      lastTimestampRef.current = timestamp;

      if (stateRef.current.isPlaying) {
        stateRef.current.time += deltaSec;
        const currentT = stateRef.current.time;
        const { x, v, a } = computePhysics(currentT);

        stateRef.current.x = x;
        stateRef.current.v = v;

        setTime(currentT);
        setDisplacement(x);
        setVelocity(v);
        setAcceleration(a);

        if (onTimeUpdate) {
          onTimeUpdate(currentT, x, v);
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [computePhysics, onTimeUpdate]);

  // Geometric layout parameters for SVG (720 x 280)
  const viewWidth = 720;
  const viewHeight = 280;
  const wallX = 60;
  const eqX = 400;
  const massWidth = 100;
  const massHeight = 70;
  const massY = 120;

  const pxPerMeter = 90;
  const visualMaxOffset = 180;
  const visualOffset = Math.max(-visualMaxOffset, Math.min(visualMaxOffset, displacement * pxPerMeter));

  const massCenterX = eqX + visualOffset;
  const massLeftX = massCenterX - massWidth / 2;
  const massRightX = massCenterX + massWidth / 2;

  // Spring path generation
  const springStartX = wallX + 16;
  const springEndX = massLeftX;
  const springLength = Math.max(40, springEndX - springStartX);
  const numCoils = 13;
  const leadLength = 20;
  const activeCoilLength = Math.max(20, springLength - leadLength * 2);

  let springPath = `M ${springStartX} 155 L ${springStartX + leadLength} 155`;
  const coilStep = activeCoilLength / numCoils;
  for (let i = 0; i < numCoils; i++) {
    const xMid = springStartX + leadLength + (i + 0.5) * coilStep;
    const xEnd = springStartX + leadLength + (i + 1) * coilStep;
    const yPeak = i % 2 === 0 ? 135 : 175;
    springPath += ` L ${xMid} ${yPeak} L ${xEnd} 155`;
  }
  springPath += ` L ${springEndX} 155`;

  const currentFdrive = params.drivingForceAmplitude * Math.sin(2 * Math.PI * params.drivingFrequencyHz * time);
  const forceArrowLength = Math.max(-50, Math.min(50, currentFdrive * 12));

  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl flex flex-col gap-3">
      {/* Simulation Header & Status Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-[#26364D]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] animate-pulse" />
          <h2 className="text-sm font-bold text-[#F1F5F9] uppercase tracking-wide">
            Mass-Spring Oscillator Animation
          </h2>
        </div>

        {/* Playback Controls & Telemetry */}
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlayPause}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors shadow-xs ${
              isPlaying
                ? 'bg-[#17263B] text-[#FBBF24] hover:bg-[#1E334D] border border-[#FBBF24]/40'
                : 'bg-[#38BDF8] text-[#07111F] hover:bg-[#7DD3FC] font-bold'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#17263B] text-[#F1F5F9] hover:bg-[#1E334D] border border-[#26364D] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span>Reset</span>
          </button>

          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#0B1728] border border-[#26364D] text-xs font-mono text-[#F1F5F9]">
            <span className="text-[#94A3B8]">t =</span>
            <span className="font-bold text-[#38BDF8]">{time.toFixed(2)}s</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas on #0A1526 */}
      <div className="w-full relative rounded-lg overflow-hidden border border-[#26364D] shadow-inner bg-[#0A1526]">
        <svg
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          className="w-full h-auto block select-none"
          style={{ minHeight: '260px' }}
        >
          <rect x="0" y="0" width={viewWidth} height={viewHeight} fill="#0A1526" />

          <defs>
            <pattern id="darkLightGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="0.8" fill="#1E334D" />
            </pattern>
            <pattern id="wallHatchDark" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#38BDF8" strokeWidth="1.2" opacity="0.4" />
            </pattern>
            <marker id="forceArrowDark" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#FB7185" />
            </marker>
            <marker id="dispArrowDark" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#38BDF8" />
            </marker>
          </defs>

          <rect x="0" y="0" width={viewWidth} height={viewHeight} fill="url(#darkLightGrid)" />

          {/* Horizontal Track Rail */}
          <line
            x1={wallX}
            y1="195"
            x2={viewWidth - 30}
            y2="195"
            stroke="#26364D"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Equilibrium Horizontal Line */}
          <line
            x1={wallX}
            y1="155"
            x2={viewWidth - 30}
            y2="155"
            stroke="#34D399"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.5"
          />

          {/* Equilibrium Vertical Center Guide */}
          <line
            x1={eqX}
            y1="45"
            x2={eqX}
            y2="215"
            stroke="#34D399"
            strokeWidth="2"
            strokeDasharray="5 3"
          />

          {/* Equilibrium Label */}
          <rect
            x={eqX - 60}
            y="26"
            width="120"
            height="20"
            rx="4"
            fill="#101D30"
            stroke="#34D399"
            strokeWidth="1"
          />
          <text
            x={eqX}
            y="40"
            textAnchor="middle"
            fill="#34D399"
            fontSize="11"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            Equilibrium (x = 0)
          </text>

          {/* Fixed Vertical Support Wall */}
          <rect
            x={wallX - 16}
            y="55"
            width="28"
            height="150"
            fill="#17263B"
            stroke="#26364D"
            strokeWidth="2"
            rx="3"
          />
          <rect
            x={wallX - 14}
            y="57"
            width="24"
            height="146"
            fill="url(#wallHatchDark)"
          />

          <text
            x={wallX - 2}
            y="42"
            textAnchor="middle"
            fill="#94A3B8"
            fontSize="11"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            Fixed Wall
          </text>

          {/* Spring */}
          <path
            d={springPath}
            fill="none"
            stroke="#94A3B8"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <text
            x={springStartX + springLength * 0.45}
            y="115"
            textAnchor="middle"
            fill="#94A3B8"
            fontSize="11"
            fontWeight="600"
            fontFamily="system-ui, sans-serif"
          >
            Spring (k = {params.springConstant} N/m)
          </text>

          {/* Mass Block */}
          <rect
            x={massLeftX}
            y={massY}
            width={massWidth}
            height={massHeight}
            rx="6"
            fill="#F97316"
            stroke="#FBBF24"
            strokeWidth="2.5"
            filter="drop-shadow(0px 4px 10px rgba(249, 115, 22, 0.4))"
          />

          <line
            x1={massCenterX}
            y1={massY + 4}
            x2={massCenterX}
            y2={massY + massHeight - 4}
            stroke="#07111F"
            strokeWidth="1.5"
            strokeDasharray="3 2"
            opacity="0.8"
          />

          <text
            x={massCenterX}
            y={massY + 30}
            textAnchor="middle"
            fill="#07111F"
            fontSize="13"
            fontWeight="900"
            fontFamily="system-ui, sans-serif"
            letterSpacing="0.5px"
          >
            MASS
          </text>
          <text
            x={massCenterX}
            y={massY + 48}
            textAnchor="middle"
            fill="#07111F"
            fontSize="11"
            fontWeight="800"
            fontFamily="system-ui, sans-serif"
          >
            m = {params.mass.toFixed(1)} kg
          </text>

          {/* Driving Force Vector Arrow */}
          {Math.abs(forceArrowLength) > 3 && (
            <g>
              <line
                x1={massRightX + 10}
                y1="155"
                x2={massRightX + 10 + forceArrowLength}
                y2="155"
                stroke="#FB7185"
                strokeWidth="2.5"
                markerEnd="url(#forceArrowDark)"
              />
              <text
                x={massRightX + 10 + forceArrowLength / 2}
                y="142"
                textAnchor="middle"
                fill="#FB7185"
                fontSize="10"
                fontWeight="700"
              >
                F₀ sin(ωt)
              </text>
            </g>
          )}

          {/* Displacement Marker */}
          {Math.abs(visualOffset) > 2 ? (
            <g>
              <line x1={eqX} y1="220" x2={eqX} y2="238" stroke="#94A3B8" strokeWidth="1.5" />
              <line x1={massCenterX} y1="220" x2={massCenterX} y2="238" stroke="#38BDF8" strokeWidth="1.5" />
              <line
                x1={eqX}
                y1="230"
                x2={massCenterX}
                y2="230"
                stroke="#38BDF8"
                strokeWidth="2"
                markerEnd="url(#dispArrowDark)"
              />
              <rect
                x={Math.min(eqX, massCenterX) + Math.abs(visualOffset) / 2 - 45}
                y="242"
                width="90"
                height="18"
                rx="4"
                fill="#101D30"
                stroke="#38BDF8"
                strokeWidth="1"
              />
              <text
                x={Math.min(eqX, massCenterX) + Math.abs(visualOffset) / 2}
                y="255"
                textAnchor="middle"
                fill="#38BDF8"
                fontSize="10"
                fontWeight="700"
                fontFamily="ui-monospace, monospace"
              >
                x = {displacement >= 0 ? '+' : ''}{displacement.toFixed(3)} m
              </text>
            </g>
          ) : (
            <text
              x={eqX}
              y="238"
              textAnchor="middle"
              fill="#94A3B8"
              fontSize="11"
              fontWeight="600"
              fontFamily="ui-monospace, monospace"
            >
              Displacement x ≈ 0.000 m
            </text>
          )}
        </svg>
      </div>

      {/* Live Physical Measurements Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
        <div className="bg-[#17263B] border border-[#26364D] rounded-lg p-2.5 flex flex-col">
          <span className="text-[#94A3B8] text-[11px] font-medium">Displacement x(t)</span>
          <span className="text-[#38BDF8] font-bold font-mono text-sm">
            {displacement >= 0 ? '+' : ''}{displacement.toFixed(3)} m
          </span>
        </div>

        <div className="bg-[#17263B] border border-[#26364D] rounded-lg p-2.5 flex flex-col">
          <span className="text-[#94A3B8] text-[11px] font-medium">Velocity v(t)</span>
          <span className="text-[#F1F5F9] font-bold font-mono text-sm">
            {velocity >= 0 ? '+' : ''}{velocity.toFixed(3)} m/s
          </span>
        </div>

        <div className="bg-[#17263B] border border-[#26364D] rounded-lg p-2.5 flex flex-col">
          <span className="text-[#94A3B8] text-[11px] font-medium">Acceleration a(t)</span>
          <span className="text-[#F1F5F9] font-bold font-mono text-sm">
            {acceleration >= 0 ? '+' : ''}{acceleration.toFixed(2)} m/s²
          </span>
        </div>

        <div className="bg-[#17263B] border border-[#26364D] rounded-lg p-2.5 flex flex-col">
          <span className="text-[#94A3B8] text-[11px] font-medium">Driving Force F(t)</span>
          <span className="text-[#FB7185] font-bold font-mono text-sm">
            {currentFdrive >= 0 ? '+' : ''}{currentFdrive.toFixed(2)} N
          </span>
        </div>
      </div>
    </div>
  );
};
