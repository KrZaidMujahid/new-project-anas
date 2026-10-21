import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Volume2, FastForward, Activity } from 'lucide-react';
import { DopplerParameters, WavefrontPoint } from '../../physics/doppler/types';

interface DopplerSimulationCanvasProps {
  params: DopplerParameters;
  onUpdateParams?: (updater: (prev: DopplerParameters) => DopplerParameters) => void;
}

export const DopplerSimulationCanvas: React.FC<DopplerSimulationCanvasProps> = ({
  params,
  onUpdateParams,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [time, setTime] = useState(0);

  // Layout coordinates (900 x 380 SVG viewBox)
  const viewWidth = 900;
  const viewHeight = 380;
  const centerY = 190;

  // Visual coordinates
  // Observer base position
  const observerBaseX = 140;
  // Source initial position
  const sourceInitialX = 640;

  // Refs for tracking animation state
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const stateRef = useRef({
    time: 0,
    sourceX: sourceInitialX,
    observerX: observerBaseX,
    wavefronts: [] as WavefrontPoint[],
    nextWaveId: 0,
    lastEmissionTime: 0,
    isPlaying: true,
  });

  // Keep isPlaying in sync
  useEffect(() => {
    stateRef.current.isPlaying = isPlaying;
  }, [isPlaying]);

  // Handle Play/Pause
  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  // Handle Reset
  const handleReset = () => {
    stateRef.current = {
      time: 0,
      sourceX: sourceInitialX,
      observerX: observerBaseX,
      wavefronts: [],
      nextWaveId: 0,
      lastEmissionTime: 0,
      isPlaying: isPlaying,
    };
    setTime(0);
  };

  // Dynamic visual scaling factors
  // Source velocity in m/s scaled to visual pixels/sec
  // Default sound speed 343 m/s maps to ~160 px/s wave expansion speed
  const wavePixelSpeed = 160; // px/s for sound speed 343 m/s
  const speedScale = (params.speedOfSound / 343) * wavePixelSpeed;
  // Source pixel speed: +30 m/s maps to ~ (30 / 343) * wavePixelSpeed px/s toward observer (leftward)
  // Positive source velocity means moving TOWARD the observer (so decreasing X toward left)
  const sourcePixelVelocity = -(params.sourceVelocity / params.speedOfSound) * speedScale;
  // Positive observer velocity means moving TOWARD the source (so increasing X toward right)
  const observerPixelVelocity = (params.observerVelocity / params.speedOfSound) * speedScale;

  // Emission period (scaled for visual clarity):
  // Maps 100-1000 Hz into an aesthetically pleasing 0.25s - 0.7s visual wavefront emission rate
  const emissionIntervalSec = 0.55 * Math.pow(500 / Math.max(100, params.sourceFrequency), 0.5);

  // Main Animation Loop
  useEffect(() => {
    const loop = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const rawDelta = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = timestamp;

      if (stateRef.current.isPlaying) {
        const delta = rawDelta * params.animationSpeed;
        stateRef.current.time += delta;
        const curT = stateRef.current.time;

        // Update Source Position (clamp so it stays on screen)
        stateRef.current.sourceX += sourcePixelVelocity * delta;
        // Bounce or wrap gracefully if reaching ends
        if (stateRef.current.sourceX < 180) {
          stateRef.current.sourceX = 760; // wrap around for continuous study
          stateRef.current.wavefronts = []; // clear old off-screen ripples
        } else if (stateRef.current.sourceX > 820) {
          stateRef.current.sourceX = 240;
          stateRef.current.wavefronts = [];
        }

        // Update Observer Position if moving
        stateRef.current.observerX += observerPixelVelocity * delta;
        if (stateRef.current.observerX < 60) stateRef.current.observerX = 60;
        if (stateRef.current.observerX > 320) stateRef.current.observerX = 320;

        // Emit new wavefront at interval
        if (curT - stateRef.current.lastEmissionTime >= emissionIntervalSec) {
          stateRef.current.lastEmissionTime = curT;
          stateRef.current.wavefronts.push({
            id: stateRef.current.nextWaveId++,
            emissionTime: curT,
            originX: stateRef.current.sourceX,
            originY: centerY,
            radius: 0,
          });
        }

        // Expand all existing wavefronts
        const maxRadius = 750;
        stateRef.current.wavefronts = stateRef.current.wavefronts
          .map((wf) => ({
            ...wf,
            radius: (curT - wf.emissionTime) * speedScale,
          }))
          .filter((wf) => wf.radius < maxRadius);

        setTime(curT);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [params.animationSpeed, sourcePixelVelocity, observerPixelVelocity, speedScale, emissionIntervalSec, params.sourceFrequency]);

  // Current visual snapshot
  const currentSourceX = stateRef.current.sourceX;
  const currentObserverX = stateRef.current.observerX;
  const currentWavefronts = stateRef.current.wavefronts;

  // Arrow calculations for velocity vectors
  const sourceArrowLen = Math.max(-50, Math.min(50, (params.sourceVelocity / 100) * 45));
  const observerArrowLen = Math.max(-40, Math.min(40, (params.observerVelocity / 50) * 35));

  // Distance between source and observer in meters (scaled for display)
  const distancePx = Math.abs(currentSourceX - currentObserverX);
  const visualMetersScale = 0.5; // px to approximate physical distance
  const physicalDistanceM = (distancePx * visualMetersScale).toFixed(1);

  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl flex flex-col gap-3">
      {/* Simulation Controls & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#26364D]">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] animate-pulse" />
          <h2 className="text-sm font-bold text-[#F1F5F9] uppercase tracking-wide">
            Wavefront Propagation &amp; Relative Motion
          </h2>
        </div>

        {/* Playback Controls & Speed Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlayPause}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs ${
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
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#17263B] text-[#F1F5F9] hover:bg-[#1E334D] border border-[#26364D] transition-colors cursor-pointer shadow-xs"
            title="Reset position and wavefronts"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span>Reset</span>
          </button>

          {/* Animation Speed Selector (Part 4 Control E) */}
          <div className="flex items-center gap-1 bg-[#17263B] p-1 rounded-lg border border-[#26364D] text-xs">
            <span className="text-[10px] text-[#94A3B8] px-1 font-mono">Speed:</span>
            {[0.5, 1.0, 2.0].map((spd) => (
              <button
                key={spd}
                onClick={() => onUpdateParams && onUpdateParams((p) => ({ ...p, animationSpeed: spd }))}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                  params.animationSpeed === spd
                    ? 'bg-[#38BDF8] text-[#07111F] font-bold'
                    : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0B1728] border border-[#26364D] text-xs font-mono text-[#F1F5F9]">
            <span className="text-[#94A3B8]">t =</span>
            <span className="font-bold text-[#38BDF8]">{time.toFixed(2)}s</span>
          </div>
        </div>
      </div>

      {/* SVG Simulation Canvas on #0A1526 */}
      <div className="w-full relative rounded-xl overflow-hidden border border-[#26364D] shadow-inner bg-[#0A1526]">
        <svg
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          className="w-full h-auto block select-none"
          style={{ minHeight: '320px' }}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="dopplerGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#17263B" strokeWidth="0.8" />
            </pattern>
            {/* Arrow Markers */}
            <marker id="sourceVelArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#FBBF24" />
            </marker>
            <marker id="observerVelArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#34D399" />
            </marker>
            {/* Soft Radial Glow for Source */}
            <radialGradient id="sourceGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#F97316" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="observerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#34D399" stopOpacity="0.7" />
              <stop offset="60%" stopColor="#10B981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid background */}
          <rect width={viewWidth} height={viewHeight} fill="#0A1526" />
          <rect width={viewWidth} height={viewHeight} fill="url(#dopplerGrid)" />

          {/* Horizontal Ground / Baseline */}
          <line
            x1="40"
            y1={centerY}
            x2={viewWidth - 40}
            y2={centerY}
            stroke="#1E334D"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Distance Indicator between Observer and Source */}
          <g>
            <line
              x1={Math.min(currentObserverX, currentSourceX)}
              y1={centerY + 65}
              x2={Math.max(currentObserverX, currentSourceX)}
              y2={centerY + 65}
              stroke="#26364D"
              strokeWidth="1.5"
            />
            <line
              x1={currentObserverX}
              y1={centerY + 55}
              x2={currentObserverX}
              y2={centerY + 75}
              stroke="#26364D"
              strokeWidth="1.5"
            />
            <line
              x1={currentSourceX}
              y1={centerY + 55}
              x2={currentSourceX}
              y2={centerY + 75}
              stroke="#26364D"
              strokeWidth="1.5"
            />
            <rect
              x={(currentObserverX + currentSourceX) / 2 - 50}
              y={centerY + 55}
              width="100"
              height="20"
              rx="4"
              fill="#101D30"
              stroke="#26364D"
              strokeWidth="1"
            />
            <text
              x={(currentObserverX + currentSourceX) / 2}
              y={centerY + 69}
              textAnchor="middle"
              fill="#94A3B8"
              fontSize="11"
              fontFamily="ui-monospace, monospace"
            >
              dist ≈ {physicalDistanceM} m
            </text>
          </g>

          {/* CIRCULAR WAVEFRONTS */}
          {/* Each circular wavefront stays centered at wf.originX and wf.originY (its emission location) */}
          {currentWavefronts.map((wf) => {
            // Opacity fades gracefully as radius approaches edge
            const opacity = Math.max(0.12, 1.0 - wf.radius / 650);
            return (
              <g key={wf.id}>
                {/* Outer Wavefront Ring */}
                <circle
                  cx={wf.originX}
                  cy={wf.originY}
                  r={wf.radius}
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2.2"
                  strokeOpacity={opacity}
                />
                {/* Subtle soft blur ring */}
                <circle
                  cx={wf.originX}
                  cy={wf.originY}
                  r={wf.radius}
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="5"
                  strokeOpacity={opacity * 0.25}
                />
                {/* Tiny emission origin dot */}
                {wf.radius < 250 && (
                  <circle
                    cx={wf.originX}
                    cy={wf.originY}
                    r="1.8"
                    fill="#38BDF8"
                    opacity={opacity * 0.5}
                  />
                )}
              </g>
            );
          })}

          {/* OBSERVER (Stationary on left, or moving) in Green (#34D399) */}
          <g transform={`translate(${currentObserverX}, ${centerY})`}>
            {/* Observer Glow Halo */}
            <circle cx="0" cy="0" r="28" fill="url(#observerGlow)" />
            {/* Observer Body Circle */}
            <circle cx="0" cy="0" r="16" fill="#10B981" stroke="#34D399" strokeWidth="2.5" />
            {/* Ear / Detector Icon Inside */}
            <path
              d="M -5 -6 Q 4 -8 5 0 Q 6 6 0 7 Q -4 7 -4 4"
              fill="none"
              stroke="#07111F"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <circle cx="-1" cy="0" r="1.5" fill="#07111F" />

            {/* Observer Velocity Arrow (if v_observer != 0) */}
            {Math.abs(params.observerVelocity) > 1 && (
              <g>
                <line
                  x1="0"
                  y1="-30"
                  x2={observerArrowLen}
                  y2="-30"
                  stroke="#34D399"
                  strokeWidth="2.5"
                  markerEnd="url(#observerVelArrow)"
                />
                <text
                  x={observerArrowLen / 2}
                  y="-36"
                  textAnchor="middle"
                  fill="#34D399"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="ui-monospace, monospace"
                >
                  vo = {params.observerVelocity > 0 ? '+' : ''}{params.observerVelocity} m/s
                </text>
              </g>
            )}

            {/* Observer Badge Label */}
            <rect
              x="-48"
              y="24"
              width="96"
              height="22"
              rx="4"
              fill="#101D30"
              stroke="#34D399"
              strokeWidth="1.2"
            />
            <text
              x="0"
              y="38"
              textAnchor="middle"
              fill="#34D399"
              fontSize="11"
              fontWeight="bold"
            >
              OBSERVER
            </text>
            <text
              x="0"
              y="58"
              textAnchor="middle"
              fill="#94A3B8"
              fontSize="10"
              fontFamily="ui-monospace, monospace"
            >
              {params.observerVelocity === 0 ? 'Stationary' : `${params.observerVelocity} m/s`}
            </text>
          </g>

          {/* SOUND SOURCE (Moving or stationary) in Orange/Yellow (#FBBF24 / #F97316) */}
          <g transform={`translate(${currentSourceX}, ${centerY})`}>
            {/* Source Glow Halo */}
            <circle cx="0" cy="0" r="32" fill="url(#sourceGlow)" />
            {/* Source Core */}
            <rect
              x="-18"
              y="-18"
              width="36"
              height="36"
              rx="6"
              fill="#F97316"
              stroke="#FBBF24"
              strokeWidth="2.5"
            />
            {/* Speaker Cone Icon Inside */}
            <path
              d="M -10 -7 L -4 -7 L 4 -12 L 4 12 L -4 7 L -10 7 Z"
              fill="#07111F"
            />
            <path
              d="M 8 -5 Q 12 0 8 5"
              fill="none"
              stroke="#07111F"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Source Velocity Vector Arrow */}
            {/* Note: In our model, positive source velocity means moving toward observer (leftward) */}
            {Math.abs(params.sourceVelocity) > 1 && (
              <g>
                <line
                  x1="0"
                  y1="-30"
                  x2={-sourceArrowLen}
                  y2="-30"
                  stroke="#FBBF24"
                  strokeWidth="2.5"
                  markerEnd="url(#sourceVelArrow)"
                />
                <text
                  x={-sourceArrowLen / 2}
                  y="-36"
                  textAnchor="middle"
                  fill="#FBBF24"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="ui-monospace, monospace"
                >
                  vs = {params.sourceVelocity > 0 ? '+' : ''}{params.sourceVelocity} m/s
                </text>
              </g>
            )}

            {/* Source Badge Label */}
            <rect
              x="-55"
              y="24"
              width="110"
              height="22"
              rx="4"
              fill="#101D30"
              stroke="#FBBF24"
              strokeWidth="1.2"
            />
            <text
              x="0"
              y="38"
              textAnchor="middle"
              fill="#FBBF24"
              fontSize="11"
              fontWeight="bold"
            >
              SOUND SOURCE
            </text>
            <text
              x="0"
              y="58"
              textAnchor="middle"
              fill="#94A3B8"
              fontSize="10"
              fontFamily="ui-monospace, monospace"
            >
              fs = {params.sourceFrequency} Hz
            </text>
          </g>

          {/* FRONT & BEHIND DIRECTION INDICATORS */}
          {params.sourceVelocity !== 0 && (
            <g>
              {/* Region in front of source (between source and observer) */}
              <text
                x={(currentObserverX + currentSourceX) / 2}
                y="55"
                textAnchor="middle"
                fill="#38BDF8"
                fontSize="11"
                fontWeight="bold"
              >
                {params.sourceVelocity > 0 ? '◀ IN FRONT: Compressed λ (Higher Pitch)' : '◀ IN FRONT: Expanded λ'}
              </text>
              {/* Region behind source */}
              <text
                x={Math.min(viewWidth - 80, currentSourceX + 90)}
                y="55"
                textAnchor="middle"
                fill="#FB7185"
                fontSize="11"
                fontWeight="bold"
              >
                {params.sourceVelocity > 0 ? 'BEHIND: Expanded λ ▶' : 'BEHIND: Compressed λ ▶'}
              </text>
            </g>
          )}

          {/* Canvas Legend */}
          <g transform="translate(25, 20)">
            <rect x="0" y="0" width="220" height="65" rx="6" fill="#101D30" fillOpacity="0.85" stroke="#26364D" strokeWidth="1" />
            <circle cx="15" cy="18" r="5" fill="#38BDF8" />
            <text x="28" y="22" fill="#F1F5F9" fontSize="10">Circular Wavefront (Sound Speed v)</text>

            <rect x="10" y="32" width="10" height="10" rx="2" fill="#F97316" stroke="#FBBF24" strokeWidth="1" />
            <text x="28" y="41" fill="#FBBF24" fontSize="10">Moving Source (Frequency fs)</text>

            <circle cx="15" cy="52" r="5" fill="#34D399" />
            <text x="28" y="55" fill="#34D399" fontSize="10">Observer (Hearing f_observed)</text>
          </g>
        </svg>
      </div>

      {/* Quick Telemetry Footnote */}
      <div className="flex flex-wrap items-center justify-between text-xs text-[#94A3B8] pt-1">
        <span>
          <strong className="text-[#F1F5F9]">Physical Note:</strong> Wavefronts expand symmetrically in the medium. Motion of the source bunches up crests along its path of travel.
        </span>
        <span className="font-mono text-[#38BDF8]">
          Speed of Sound: {params.speedOfSound} m/s
        </span>
      </div>
    </div>
  );
};
